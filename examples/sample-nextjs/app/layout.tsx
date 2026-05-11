import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Humad Sample — Login with Humad",
  description: "Demonstrates the Login with Humad OAuth/OIDC flow",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          background: "#0a0a0f",
          color: "#fff",
          minHeight: "100vh",
        }}
      >
        {children}
      </body>
    </html>
  );
}
