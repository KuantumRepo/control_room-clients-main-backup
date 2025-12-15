'use client';

/**
 * Landing/Home Page
 *
 * Entry point for customer-initiated verification path
 * Customer enters case ID and is redirected to session UUID
 */

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { currentBrand } from '@/config/branding';
import { useSessionStore } from '@shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { BotGuard } from '@/components/security/BotGuard';

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
    <BotGuard>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-4">
        <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
          {/* Brand Section */}
          <div className="text-center space-y-3 mb-8">
            <div className="mb-4">
              <img
                src={currentBrand.logo}
                alt={currentBrand.companyName}
                className="h-16 w-auto mx-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              {currentBrand.companyName}
            </h1>
            <p className="text-lg text-muted-foreground">
              Customer Verification Platform
            </p>
          </div>

          {/* Main Card */}
          <Card className="w-full max-w-md p-8 shadow-xl">
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold text-foreground">
                  Begin Verification
                </h2>
                <p className="text-muted-foreground text-sm">
                  Enter your case ID to start the verification process
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Case ID Input */}
                <div className="space-y-2">
                  <label
                    htmlFor="caseId"
                    className="block text-sm font-medium text-foreground"
                  >
                    Case ID
                  </label>
                  <Input
                    id="caseId"
                    type="text"
                    placeholder="Enter your case ID"
                    value={caseId}
                    onChange={(e) => {
                      setCaseId(e.target.value);
                      if (fieldError) setFieldError('');
                    }}
                    disabled={isLoading}
                    autoComplete="off"
                    required
                  />

                  {/* Error message */}
                  {fieldError && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      <span>{fieldError}</span>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={!caseId.trim() || isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? 'Processing...' : 'Continue'}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Alternative
                  </span>
                </div>
              </div>

              {/* Info Text */}
              <p className="text-sm text-muted-foreground text-center">
                If an agent has provided you with a direct link, please use that link instead.
              </p>
            </div>
          </Card>

          {/* Footer */}
          <p className="text-xs text-muted-foreground text-center">
            Need help? Contact {currentBrand.companyName} support
          </p>
        </div>
      </div>
    </BotGuard>
  );
}
