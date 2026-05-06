import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #09090b 0%, #18181b 50%, #09090b 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span style={{ fontSize: "48px", fontWeight: 700, color: "#fafafa" }}>
            HumanAuth
          </span>
        </div>
        <div
          style={{
            fontSize: "28px",
            color: "#22d3ee",
            fontWeight: 600,
            marginBottom: "16px",
          }}
        >
          Human verification in 2 lines of code
        </div>
        <div
          style={{
            fontSize: "18px",
            color: "#a1a1aa",
            maxWidth: "600px",
            textAlign: "center",
          }}
        >
          Managed World ID gateway — RP signing, nullifier dedup, real-time analytics
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            color: "#71717a",
          }}
        >
          Powered by World ID
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
