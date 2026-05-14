import type { Metadata } from "next";
import AgentCheckoutDemo from "./AgentCheckoutDemo";

export const metadata: Metadata = {
  title: "Agent Checkout Demo — Humad",
  description:
    "Phase 4 reference implementation: delegate a checkout to an agent under your human principal via Humad L3 (custodial agent wallet + AgentBook).",
  openGraph: {
    title: "Agent Checkout Demo — Humad",
    description:
      "End-to-end walkthrough of L2 human principal → L3 agent delegation, using the Humad API.",
    url: "https://humanauth.vercel.app/demo/agent-checkout",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agent Checkout Demo — Humad",
    description:
      "Delegate a checkout to an agent under your human principal via Humad L3.",
  },
};

export default function Page() {
  return <AgentCheckoutDemo />;
}
