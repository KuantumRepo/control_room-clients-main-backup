/**
 * Error State Component
 *
 * Shows generic error message (never reveals specific validation errors)
 */

import { AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message?: string;
  subtext?: string;
  onRetry?: () => void;
  showRetryButton?: boolean;
}

export function ErrorState({
  message = 'Unable to proceed at this time',
  subtext = 'Please wait for further instructions from our agent',
  onRetry,
  showRetryButton = false,
}: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md p-8 shadow-lg border-destructive/20">
        <div className="flex flex-col items-center space-y-6">
          <div className="p-3 bg-destructive/10 rounded-full">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>

          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-semibold text-foreground">
              {message}
            </h2>
            {subtext && (
              <p className="text-muted-foreground text-sm">
                {subtext}
              </p>
            )}
          </div>

          {showRetryButton && onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              className="w-full"
            >
              Try Again
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
