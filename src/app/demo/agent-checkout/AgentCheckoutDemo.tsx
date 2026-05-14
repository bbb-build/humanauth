"use client";

import { useState } from "react";

type AgentStart = {
  agent_address: string;
  nonce: string;
  verification_url: string;
  qr_data: string;
  action: string;
  signal: string;
  world_app_id: string;
};

type AgentFinalized = {
  tx_hash: string;
  registered_at: string;
};

type Step = "intro" | "token" | "register" | "scan" | "finalize" | "done";

const SAMPLE_CART = [
  { id: "sku-101", name: "Bluetooth Headphones", price: 89.0 },
  { id: "sku-202", name: "USB-C Charger 65W", price: 24.5 },
];

const SUBTOTAL = SAMPLE_CART.reduce((sum, item) => sum + item.price, 0);
const TAX = Math.round(SUBTOTAL * 0.08 * 100) / 100;
const TOTAL = Math.round((SUBTOTAL + TAX) * 100) / 100;

export default function AgentCheckoutDemo() {
  const [step, setStep] = useState<Step>("intro");
  const [accessToken, setAccessToken] = useState("");
  const [start, setStart] = useState<AgentStart | null>(null);
  const [proofJson, setProofJson] = useState("");
  const [finalized, setFinalized] = useState<AgentFinalized | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStart() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/v1/agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(body.error || "Failed to start registration");
      }
      const data: AgentStart = await res.json();
      setStart(data);
      setStep("scan");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleFinalize() {
    if (!start) return;
    setError(null);
    setLoading(true);
    try {
      let parsed: { root: string; nullifierHash: string; proof: string[] };
      try {
        parsed = JSON.parse(proofJson);
      } catch {
        throw new Error("Proof JSON is not valid JSON.");
      }
      if (!parsed.root || !parsed.nullifierHash || !Array.isArray(parsed.proof)) {
        throw new Error("Proof must include root, nullifierHash, and proof[8].");
      }
      const res = await fetch(
        `/api/v1/agents/${encodeURIComponent(start.agent_address)}/finalize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(parsed),
        },
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(body.error || "Failed to finalize registration");
      }
      const data: AgentFinalized = await res.json();
      setFinalized(data);
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStep("intro");
    setAccessToken("");
    setStart(null);
    setProofJson("");
    setFinalized(null);
    setError(null);
  }

  return (
    <div style={styles.wrap}>
      <header style={styles.header}>
        <div style={styles.tag}>Phase 4 reference implementation</div>
        <h1 style={styles.h1}>Agent Checkout Demo</h1>
        <p style={styles.lead}>
          End-to-end walkthrough of L2 human principal → L3 agent delegation, using
          the Humad API. The agent acts as your delegate to complete a checkout on
          your behalf, while World ID verification anchors the human-in-the-loop.
        </p>
      </header>

      <section style={styles.section}>
        <h2 style={styles.h2}>Sample cart</h2>
        <ul style={styles.cartList}>
          {SAMPLE_CART.map((item) => (
            <li key={item.id} style={styles.cartItem}>
              <span>{item.name}</span>
              <span>${item.price.toFixed(2)}</span>
            </li>
          ))}
          <li style={{ ...styles.cartItem, ...styles.cartSubtotal }}>
            <span>Subtotal</span>
            <span>${SUBTOTAL.toFixed(2)}</span>
          </li>
          <li style={styles.cartItem}>
            <span>Tax (8%)</span>
            <span>${TAX.toFixed(2)}</span>
          </li>
          <li style={{ ...styles.cartItem, ...styles.cartTotal }}>
            <span>Total</span>
            <span>${TOTAL.toFixed(2)}</span>
          </li>
        </ul>
      </section>

      {step === "intro" && (
        <section style={styles.section}>
          <h2 style={styles.h2}>1. What this demo shows</h2>
          <p>
            Most checkouts ask <em>you</em> to click &quot;Pay&quot; in person. With
            Humad L3, you can delegate that action to an agent — a script, a bot, or
            a third-party automation — while keeping a verified human principal at
            the root of authority.
          </p>
          <ol style={styles.ol}>
            <li>Log in as a human via Humad OAuth (L2). You already have an access token.</li>
            <li>Register an agent address under your principal. The agent receives a custodial wallet stored encrypted in Humad.</li>
            <li>Verify the registration on AgentBook with a World ID proof — the agent is now on-chain delegated to your principal.</li>
            <li>The agent can now complete checkouts up to the scopes you granted.</li>
          </ol>
          <button style={styles.primary} onClick={() => setStep("token")}>
            Start
          </button>
        </section>
      )}

      {step === "token" && (
        <section style={styles.section}>
          <h2 style={styles.h2}>2. Paste your L2 access token</h2>
          <p>
            Obtain a bearer access token from{" "}
            <a href="/docs" style={styles.link}>
              Login with Humad
            </a>
            . In production, your app already holds this token from the OAuth flow
            and you would call the agent APIs server-side.
          </p>
          <textarea
            style={styles.textarea}
            placeholder="eyJhbGciOi..."
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value.trim())}
            rows={3}
          />
          <div style={styles.row}>
            <button style={styles.secondary} onClick={() => setStep("intro")}>
              Back
            </button>
            <button
              style={styles.primary}
              onClick={() => setStep("register")}
              disabled={!accessToken}
            >
              Continue
            </button>
          </div>
        </section>
      )}

      {step === "register" && (
        <section style={styles.section}>
          <h2 style={styles.h2}>3. Register the agent</h2>
          <p>
            Clicking the button will call{" "}
            <code style={styles.code}>POST /api/v1/agents</code> with your access
            token. The server creates a custodial wallet, encrypts the private key
            at rest, and returns a World App QR for you to verify on AgentBook.
          </p>
          <div style={styles.row}>
            <button style={styles.secondary} onClick={() => setStep("token")}>
              Back
            </button>
            <button
              style={styles.primary}
              onClick={handleStart}
              disabled={loading}
            >
              {loading ? "Calling /api/v1/agents..." : "Register agent"}
            </button>
          </div>
          {error && <div style={styles.error}>{error}</div>}
        </section>
      )}

      {step === "scan" && start && (
        <section style={styles.section}>
          <h2 style={styles.h2}>4. Scan with World App</h2>
          <p>
            Open World App and scan the QR below. The proof generated by World App
            is what AgentBook accepts as proof-of-humanity for this delegation.
          </p>
          <div style={styles.qrBox}>
            <img src={start.qr_data} alt="World App QR" style={styles.qr} />
            <div style={styles.kv}>
              <div>
                <strong>Agent address</strong>
                <code style={styles.code}>{start.agent_address}</code>
              </div>
              <div>
                <strong>Nonce</strong>
                <code style={styles.code}>{start.nonce}</code>
              </div>
              <div>
                <strong>Action</strong>
                <code style={styles.code}>{start.action}</code>
              </div>
            </div>
          </div>
          <p style={styles.muted}>
            For the demo, paste the proof JSON returned by World App below. In a
            production integration, your app receives this via a callback URL or
            polling and passes it to the{" "}
            <code style={styles.code}>&lt;AuthorizeAgent /&gt;</code> SDK component
            as the <code style={styles.code}>pendingProof</code> prop.
          </p>
          <textarea
            style={styles.textarea}
            placeholder='{"root":"...","nullifierHash":"...","proof":["...","...","...","...","...","...","...","..."]}'
            value={proofJson}
            onChange={(e) => setProofJson(e.target.value)}
            rows={6}
          />
          <div style={styles.row}>
            <button style={styles.secondary} onClick={() => setStep("register")}>
              Back
            </button>
            <button
              style={styles.primary}
              onClick={handleFinalize}
              disabled={loading || !proofJson}
            >
              {loading ? "Finalizing..." : "Finalize on AgentBook"}
            </button>
          </div>
          {error && <div style={styles.error}>{error}</div>}
        </section>
      )}

      {step === "done" && finalized && start && (
        <section style={styles.section}>
          <h2 style={styles.h2}>5. Agent delegated — checkout ready</h2>
          <p>
            The agent address is now registered on AgentBook under your human
            principal. The transaction was submitted via the hosted relay.
          </p>
          <div style={styles.kv}>
            <div>
              <strong>Agent address</strong>
              <code style={styles.code}>{start.agent_address}</code>
            </div>
            <div>
              <strong>AgentBook tx</strong>
              <code style={styles.code}>{finalized.tx_hash}</code>
            </div>
            <div>
              <strong>Registered at</strong>
              <code style={styles.code}>{finalized.registered_at}</code>
            </div>
          </div>
          <div style={styles.successBox}>
            <strong>✓ Mock checkout completed</strong>
            <p style={styles.muted}>
              In a real integration, the agent would now sign and submit the
              checkout transaction on your behalf, scoped to{" "}
              <code style={styles.code}>${TOTAL.toFixed(2)}</code>. This demo stops
              before any real payment to keep the surface safe.
            </p>
          </div>
          <button style={styles.secondary} onClick={reset}>
            Run again
          </button>
        </section>
      )}

      <footer style={styles.footer}>
        <p style={styles.muted}>
          Source:{" "}
          <a
            href="https://github.com/bbb-build/humanauth/tree/master/src/app/demo/agent-checkout"
            style={styles.link}
          >
            src/app/demo/agent-checkout
          </a>{" "}
          · See also the SDK component{" "}
          <code style={styles.code}>AuthorizeAgent</code> in{" "}
          <a href="/docs" style={styles.link}>
            humad-sdk/react
          </a>
          .
        </p>
      </footer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "48px 24px 96px",
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    color: "#0f172a",
  },
  header: { marginBottom: 32 },
  tag: {
    display: "inline-block",
    fontSize: 12,
    fontWeight: 600,
    color: "#0891b2",
    background: "#ecfeff",
    border: "1px solid #a5f3fc",
    borderRadius: 999,
    padding: "4px 12px",
    marginBottom: 12,
  },
  h1: { fontSize: 32, fontWeight: 700, margin: "0 0 12px" },
  lead: { color: "#475569", lineHeight: 1.6 },
  section: {
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    background: "#fff",
  },
  h2: { fontSize: 18, fontWeight: 600, margin: "0 0 12px" },
  ol: { paddingLeft: 20, color: "#475569", lineHeight: 1.7 },
  row: { display: "flex", gap: 12, marginTop: 16 },
  primary: {
    background: "#22d3ee",
    color: "#0f172a",
    border: "none",
    borderRadius: 8,
    padding: "10px 18px",
    fontWeight: 600,
    cursor: "pointer",
  },
  secondary: {
    background: "#fff",
    color: "#0f172a",
    border: "1px solid #cbd5e1",
    borderRadius: 8,
    padding: "10px 18px",
    fontWeight: 500,
    cursor: "pointer",
  },
  textarea: {
    width: "100%",
    fontFamily: "ui-monospace, SFMono-Regular, monospace",
    fontSize: 13,
    padding: 12,
    border: "1px solid #cbd5e1",
    borderRadius: 8,
    resize: "vertical",
    background: "#f8fafc",
  },
  code: {
    fontFamily: "ui-monospace, SFMono-Regular, monospace",
    fontSize: 12,
    background: "#f1f5f9",
    padding: "2px 6px",
    borderRadius: 4,
    wordBreak: "break-all",
  },
  cartList: { listStyle: "none", padding: 0, margin: 0 },
  cartItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px dashed #e2e8f0",
    fontSize: 14,
  },
  cartSubtotal: { borderTop: "1px solid #cbd5e1", marginTop: 8, fontWeight: 500 },
  cartTotal: { borderBottom: "none", fontWeight: 700, fontSize: 16 },
  qrBox: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    alignItems: "start",
    margin: "16px 0",
  },
  qr: {
    width: "100%",
    maxWidth: 220,
    aspectRatio: "1 / 1",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    background: "#fff",
  },
  kv: { display: "grid", gap: 8, fontSize: 13 },
  muted: { color: "#64748b", fontSize: 13, lineHeight: 1.6 },
  error: {
    marginTop: 12,
    padding: 12,
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    borderRadius: 8,
    fontSize: 13,
  },
  successBox: {
    marginTop: 16,
    padding: 16,
    background: "#ecfdf5",
    border: "1px solid #a7f3d0",
    color: "#065f46",
    borderRadius: 8,
  },
  link: { color: "#0891b2", textDecoration: "underline" },
  footer: { marginTop: 32 },
};
