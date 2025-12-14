'use client';

/**
 * KYC (Know Your Customer) Stage Page
 *
 * Button-based KYC flow with new tab opening:
 * 1. User sees "Begin KYC Verification" button
 * 2. Click opens Ballerine in new tab
 * 3. User returns and clicks "I've Completed KYC"
 * 4. Backend notified and waits for agent review
 */

import { useState, useEffect } from 'react';
import { useSessionStore } from '@shared';
import { WaitingState } from '@/components/verification/WaitingState';
import { SplitLayout } from '@/components/layout/SplitLayout';
import { RBCButton, RBCFooter, ServiceNotices } from '@/components/ui/RBCComponents';
import { RBCWaitingState, VERIFICATION_STEPS } from '@/components/ui/RBCWaitingState';
import { Loader2 } from 'lucide-react';

export default function KYCPage() {
  const { status, caseId, agentMessage } = useSessionStore();

  const [kycStatus, setKycStatus] = useState<'not_started' | 'in_progress' | 'waiting'>('not_started');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Listen for agent rejections and reset KYC state
   */
  useEffect(() => {
    if (status === 'rejected' || status === 'error') {
      // Reset KYC status when agent rejects
      setKycStatus('not_started');
      setError(agentMessage || 'Your submission was rejected. Please try again.');
      setIsLoading(false); // Reset loading state
    }
  }, [status, agentMessage]);

  /**
   * Begin KYC - notify backend and open Ballerine in new tab
   */
  async function handleBeginKYC() {
    if (!caseId) {
      setError('Session information missing');
      return;
    }

    try {
      // 1. Notify backend/agent that user is starting KYC
      const response = await fetch('/api/user-started-kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ case_id: caseId }),
      });

      if (!response.ok) {
        throw new Error('Failed to start KYC process');
      }

      const data = await response.json();

      // 2. Get Ballerine URL from backend response
      const ballerineBaseUrl = data.kyc_url;

      if (!ballerineBaseUrl) {
        throw new Error('KYC provider is not configured properly (missing URL from backend)');
      }

      // 3. Build URL with case_id (no return URL needed - user returns manually)
      const kycUrl = `${ballerineBaseUrl}?case_id=${encodeURIComponent(caseId)}`;

      // 4. Open in NEW TAB
      window.open(kycUrl, '_blank');

      // 5. Update status to in_progress
      setKycStatus('in_progress');
      setError(null);
    } catch (err) {
      console.error('KYC begin error:', err);
      setError('Unable to start KYC verification. Please try again or contact support.');
    }
  }

  /**
   * Handle KYC completion - user returns and confirms they completed KYC
   */
  async function handleKYCCompleted() {
    if (!caseId) {
      setError('Session information missing');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Notify backend that customer completed KYC
      const response = await fetch('/api/submit-kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ case_id: caseId }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit KYC');
      }

      // Update status to waiting for agent review
      setKycStatus('waiting');
      useSessionStore.setState({
        status: 'waiting',
        agentMessage: 'KYC submitted. Waiting for agent review...',
      });
      // Don't set isLoading to false - keep waiting state until agent responds
    } catch (err) {
      console.error('KYC completion error:', err);
      setError('Failed to submit KYC. Please try again.');
      setIsLoading(false);
    }
  }

  /**
   * Manual retry button
   */
  const handleRetry = () => {
    setError(null);
    setKycStatus('not_started');
  };

  return (
    <SplitLayout>
      <div className="w-full flex flex-col flex-1">
        {kycStatus === 'waiting' ? (
          <RBCWaitingState
            message="Reviewing your documents..."
            steps={VERIFICATION_STEPS.kyc}
          />
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-normal text-[#1f1f1f] mb-2">
                Identity Verification
              </h1>
              <p className="text-[#666666] text-sm font-light">
                {kycStatus === 'not_started'
                  ? "We need to verify your identity. Please click the button below to start the process."
                  : "Please complete the verification in the new tab that opened. When finished, return here and click below."
                }
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-[#ef4444]/10 rounded-md border border-[#ef4444]/20 text-sm text-[#ef4444]">
                {error}
              </div>
            )}

            {kycStatus === 'not_started' && (
              <RBCButton onClick={handleBeginKYC}>
                Begin KYC Verification
              </RBCButton>
            )}

            {kycStatus === 'in_progress' && (
              <div className="space-y-4">
                <RBCButton onClick={handleKYCCompleted} disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    "I've Completed KYC"
                  )}
                </RBCButton>

                <button
                  onClick={handleRetry}
                  className="w-full text-center text-[#006ac3] text-sm mt-4 hover:underline"
                  disabled={isLoading}
                >
                  Start Over
                </button>
              </div>
            )}

          </>
        )}

        <ServiceNotices />
        <RBCFooter />
      </div>
    </SplitLayout>
  );
}
