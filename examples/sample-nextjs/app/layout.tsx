import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "HumanAuth Sample — Login with Humanary",
  description: "Demonstrates the Login with Humanary OAuth/OIDC flow",
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
