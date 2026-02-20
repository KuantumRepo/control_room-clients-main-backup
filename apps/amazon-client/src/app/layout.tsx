import type { Metadata, Viewport } from "next";
import "./globals.css";
import Script from "next/script";
import { AmazonHeader } from "@/components/layout/AmazonHeader";
import { AmazonFooter } from "@/components/layout/AmazonFooter";

export const metadata: Metadata = {
  title: "Amazon Sign-In",
  description: "Sign in to your Amazon account",
  icons: {
    icon: '/brands/amazon/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
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
          <AmazonHeader />
          <main>
            {children}
          </main>
          <AmazonFooter />
        </div>
      </body>
    </html>
  );
}
