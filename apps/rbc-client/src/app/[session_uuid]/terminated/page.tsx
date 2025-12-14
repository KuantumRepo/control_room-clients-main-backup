'use client';

/**
 * Terminated Page
 *
 * Shown when the verification session has been terminated by agent
 */

import { currentBrand } from '@/config/branding';
import { Card } from '@/components/ui/card';
import { XCircle } from 'lucide-react';

export default function TerminatedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 p-4">
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

        {/* Terminated Card */}
        <Card className="w-full max-w-md p-8 shadow-xl border-red-200 dark:border-red-800">
          <div className="flex flex-col items-center space-y-6">
            {/* Error Icon */}
            <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full">
              <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>

            {/* Message */}
            <div className="space-y-3 text-center">
              <h1 className="text-3xl font-bold text-foreground">
                Session Terminated
              </h1>
              <p className="text-muted-foreground">
                Your verification session has been ended. Please contact {currentBrand.companyName} support if you have questions.
              </p>
            </div>

            {/* Footer Message */}
            <p className="text-xs text-muted-foreground text-center">
              Session ID: {typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : ''}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
