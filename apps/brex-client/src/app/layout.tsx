import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

import { BrexFooter } from "@/components/layout/BrexFooter";

export const metadata: Metadata = {
  title: "Brex",
  description: "Sign in to your Brex account",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Script src="/config.js" strategy="beforeInteractive" />
        <div className="page-wrapper">
          {children}
          <BrexFooter />
        </div>
      </body>
    </html>
  );
}
