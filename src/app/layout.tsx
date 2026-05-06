import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HumanAuth — World ID Authentication Gateway",
  description: "Add World ID human verification to your app in 2 lines of code. Managed RP signing, nullifier dedup, and analytics.",
  metadataBase: new URL("https://humanauth.vercel.app"),
  openGraph: {
    title: "HumanAuth — Human verification in 2 lines of code",
    description: "Managed World ID authentication gateway. RP signing, nullifier dedup, real-time analytics. Powered by World ID.",
    url: "https://humanauth.vercel.app",
    siteName: "HumanAuth",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HumanAuth — Human verification in 2 lines of code",
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
