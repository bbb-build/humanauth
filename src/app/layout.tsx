import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Humad — World ID Authentication Gateway",
  description: "Add World ID human verification to your app in 2 lines of code. Managed RP signing, nullifier dedup, and Login with Humad (OIDC).",
  metadataBase: new URL("https://humanauth.vercel.app"),
  openGraph: {
    title: "Humad — Human verification in 2 lines of code",
    description: "Managed World ID authentication gateway with Login with Humad (OIDC). RP signing, nullifier dedup, real-time analytics. Powered by World ID.",
    url: "https://humanauth.vercel.app",
    siteName: "Humad",
    type: "website",
    images: [{ url: "/api/og", width: 1200, height: 630, alt: "Humad" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Humad — Human verification in 2 lines of code",
    description: "Managed World ID authentication gateway. Stop building auth infrastructure. Start verifying humans.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
