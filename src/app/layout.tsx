import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HumanAuth — World ID Authentication Gateway",
  description: "Add World ID human verification to your app in 2 lines of code. Managed RP signing, nullifier dedup, and analytics.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
