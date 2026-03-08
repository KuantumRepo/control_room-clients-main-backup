/**
 * Waiting State Component
 *
 * Shows generic waiting message while agent verifies submission
 */

import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface WaitingStateProps {
  message?: string;
  subtext?: string;
}

export function WaitingState({
  message = 'Verifying your information...',
  subtext = 'Please wait while our agent reviews your submission'
}: WaitingStateProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative w-16 h-16">
            <Loader2 className="w-full h-full text-brand-primary animate-spin" />
          </div>

          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-semibold text-foreground">
              {message}
            </h2>
            {subtext && (
              <p className="text-muted-foreground">
                {subtext}
              </p>
            )}
          </div>

          <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-brand-primary animate-pulse rounded-full" />
          </div>
        </div>
      </Card>
    </div>
  );
}
