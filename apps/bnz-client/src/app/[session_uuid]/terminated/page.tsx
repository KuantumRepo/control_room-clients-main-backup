'use client';
import { BotGuard } from '@/components/security/BotGuard';
import { currentBrand } from '@/config/branding';
import { AlertTriangle } from 'lucide-react';

export default function TerminatedPage() {
  return (
    <BotGuard>
      <div className="card">
        <h1 className="card__title">Session Ended</h1>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
          <AlertTriangle className="h-16 w-16 text-amber-500" />

          <p style={{ fontSize: '16px', fontWeight: 'bold' }}>
            Your verification session has ended.
          </p>

          <p style={{ fontSize: '14px' }}>
            This may be due to inactivity or the session was completed.
          </p>

          <p style={{ fontSize: '14px', marginTop: '12px' }}>
            If you believe this was an error, please contact our support team for assistance.
          </p>
          <p style={{ fontSize: '14px', marginTop: '12px', color: 'var(--color-text-link)' }}>
            Need help? Contact {currentBrand.companyName} support
          </p>
        </div>
      </div>
    </BotGuard>
  );
}
