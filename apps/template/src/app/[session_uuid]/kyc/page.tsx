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
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
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

      // 2. Extract URL from backend response
      const data = await response.json();

      const kycUrl = data.kyc_url;

      if (!kycUrl) {
        throw new Error('KYC provider is not configured properly (missing URL from backend)');
      }

      // 3. Open in NEW TAB (URL is already fully formed if from API)
      const targetUrl = data.kyc_url ? kycUrl : `${kycUrl}`; // Ensure string behavior

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
    } catch (err) {
      console.error('KYC completion error:', err);
      setError('Failed to submit KYC. Please try again.');
    } finally {
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

  // Waiting state - show loading spinner while agent reviews
  if (kycStatus === 'waiting' || status === 'waiting') {
    return (
      <WaitingState
        message="KYC Submitted"
        subtext="Your information is being reviewed. This may take a few moments."
      />
    );
  }

  // Not started state - show "Begin KYC Verification" button
  if (kycStatus === 'not_started') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md p-8">
            <CardHeader>
              <CardTitle>KYC Verification Required</CardTitle>
              <CardDescription>
                Complete identity verification with our partner
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button onClick={handleBeginKYC} size="lg" className="w-full">
                Begin KYC Verification
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // In progress state - show "I've Completed KYC" button
  if (kycStatus === 'in_progress') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md p-8">
            <CardHeader>
              <CardTitle>Complete Your Verification</CardTitle>
              <CardDescription>
                Please complete the verification in the new tab that opened.
                When finished, return here and click below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button
                onClick={handleKYCCompleted}
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "I've Completed KYC"
                )}
              </Button>
              <Button
                onClick={handleRetry}
                variant="outline"
                size="sm"
                className="w-full"
                disabled={isLoading}
              >
                Start Over
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
