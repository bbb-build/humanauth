import Link from "next/link";
import { Shield, Zap, BarChart3, Key, Code, Globe } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="border-b border-[var(--border-color)] px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-[var(--accent)]" />
            <span className="text-lg font-bold">HumanAuth</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#features" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              Features
            </Link>
            <Link href="#pricing" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              Pricing
            </Link>
            <Link href="/docs" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              Docs
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-black hover:bg-[var(--accent-hover)]"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-1.5 text-sm text-[var(--text-secondary)]">
            <span className="h-2 w-2 rounded-full bg-[var(--success)]" />
            Powered by World ID
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight">
            Human verification
            <br />
            <span className="text-[var(--accent)]">in 2 lines of code</span>
          </h1>
          <p className="mb-10 text-lg text-[var(--text-secondary)]">
            Managed RP signing, nullifier dedup, and real-time analytics.
            <br />
            Stop building auth infrastructure. Start verifying humans.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="rounded-lg bg-[var(--accent)] px-6 py-3 font-medium text-black hover:bg-[var(--accent-hover)]"
            >
              Get Started Free
            </Link>
            <Link
              href="/docs"
              className="rounded-lg border border-[var(--border-color)] px-6 py-3 font-medium text-[var(--text-primary)] hover:border-[var(--border-hover)]"
            >
              Read the Docs
            </Link>
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-2 border-b border-[var(--border-color)] px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-[var(--error)] opacity-60" />
            <div className="h-3 w-3 rounded-full bg-[var(--warning)] opacity-60" />
            <div className="h-3 w-3 rounded-full bg-[var(--success)] opacity-60" />
            <span className="ml-2 text-xs text-[var(--text-tertiary)]">App.tsx</span>
          </div>
          <pre className="overflow-x-auto p-6 text-sm leading-relaxed">
            <code>{`import { HumanAuth } from "humanauth-sdk/react";

function App() {
  return (
    <HumanAuth
      appId="your-app-id"
      action="login"
      onVerified={(result) => {
        console.log("Human verified!", result);
      }}
    />
  );
}`}</code>
          </pre>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-[var(--border-color)] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-3xl font-bold">Everything you need. Nothing you don&apos;t.</h2>
          <p className="mb-16 text-center text-[var(--text-secondary)]">
            World ID integration takes days. HumanAuth takes minutes.
          </p>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Key, title: "Managed RP Signing", desc: "We handle key generation, rotation, and signing. Your keys never touch your servers." },
              { icon: Shield, title: "Nullifier Dedup", desc: "Automatic duplicate detection and replay prevention across all your actions." },
              { icon: Zap, title: "2-Line Integration", desc: "Drop-in React component. npm install, import, done." },
              { icon: BarChart3, title: "Real-time Analytics", desc: "MAU tracking, verification logs, conversion rates. All in your dashboard." },
              { icon: Globe, title: "Multi-Chain Ready", desc: "Cloud Verification today. On-chain verification when you need it." },
              { icon: Code, title: "API-First", desc: "REST API for any framework. React SDK for the fast path." },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
                <f.icon className="mb-4 h-8 w-8 text-[var(--accent)]" />
                <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* vs SDK */}
      <section className="border-t border-[var(--border-color)] px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold">HumanAuth vs. Direct SDK</h2>
          <div className="overflow-hidden rounded-xl border border-[var(--border-color)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
                  <th className="px-6 py-4 text-left font-medium text-[var(--text-secondary)]" />
                  <th className="px-6 py-4 text-center font-medium text-[var(--text-secondary)]">Direct SDK</th>
                  <th className="px-6 py-4 text-center font-medium text-[var(--accent)]">HumanAuth</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Initial setup", "Days", "30 min"],
                  ["RP key management", "You build it", "Managed"],
                  ["Nullifier storage", "You build it", "Managed"],
                  ["SDK version upgrades", "Manual migration", "Automatic"],
                  ["Analytics dashboard", "You build it", "Included"],
                  ["Multi-action support", "You build it", "Config only"],
                ].map(([feature, sdk, ha]) => (
                  <tr key={feature} className="border-b border-[var(--border-color)] last:border-b-0">
                    <td className="px-6 py-4 font-medium">{feature}</td>
                    <td className="px-6 py-4 text-center text-[var(--text-tertiary)]">{sdk}</td>
                    <td className="px-6 py-4 text-center text-[var(--success)]">{ha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-[var(--border-color)] px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold">Simple pricing</h2>
          <p className="mb-16 text-center text-[var(--text-secondary)]">Start free. Scale when you&apos;re ready.</p>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { name: "Free", price: "$0", mau: "1,000 MAU", features: ["Unlimited verifications", "1 app", "7-day log retention", "Community support"] },
              { name: "Pro", price: "$49", mau: "10,000 MAU", features: ["Unlimited verifications", "10 apps", "90-day log retention", "Webhook notifications", "Priority support"], highlight: true },
              { name: "Business", price: "$199", mau: "100,000 MAU", features: ["Unlimited verifications", "Unlimited apps", "1-year log retention", "SLA 99.9%", "Dedicated support", "Custom branding"] },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl border p-8 ${
                  plan.highlight
                    ? "border-[var(--accent)] bg-[var(--accent-muted)]"
                    : "border-[var(--border-color)] bg-[var(--bg-card)]"
                }`}
              >
                <h3 className="mb-2 text-lg font-semibold">{plan.name}</h3>
                <div className="mb-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "$0" && <span className="text-[var(--text-tertiary)]">/mo</span>}
                </div>
                <p className="mb-6 text-sm text-[var(--text-secondary)]">{plan.mau}</p>
                <ul className="mb-8 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      <span className="text-[var(--success)]">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/dashboard"
                  className={`block rounded-lg px-4 py-2.5 text-center text-sm font-medium ${
                    plan.highlight
                      ? "bg-[var(--accent)] text-black hover:bg-[var(--accent-hover)]"
                      : "border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--border-hover)]"
                  }`}
                >
                  {plan.price === "$0" ? "Get Started" : "Start Free Trial"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] px-6 py-12">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-[var(--text-tertiary)]">
            <Shield className="h-4 w-4" />
            <span>HumanAuth — Proof of Humanity as a Service</span>
          </div>
          <div className="text-sm text-[var(--text-tertiary)]">
            Powered by <span className="text-[var(--text-secondary)]">World ID</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
