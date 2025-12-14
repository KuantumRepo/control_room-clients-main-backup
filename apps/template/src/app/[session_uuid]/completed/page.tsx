'use client';

/**
 * Completed/Success Stage Page
 *
 * Shown when verification is successfully completed
 * All stages passed - customer is verified
 */

import { currentBrand } from '@/config/branding';
import { Card } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function CompletedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 p-4">
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

        {/* Success Card */}
        <Card className="w-full max-w-md p-8 shadow-xl border-green-200 dark:border-green-800">
          <div className="flex flex-col items-center space-y-6">
            {/* Success Icon */}
            <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>

            {/* Message */}
            <div className="space-y-3 text-center">
              <h1 className="text-3xl font-bold text-foreground">
                Verification Complete
              </h1>
              <p className="text-muted-foreground">
                Your identity has been successfully verified. Thank you for completing the process.
              </p>
            </div>

            {/* Status Badges */}
            <div className="w-full space-y-2">
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Case ID</p>
                  <p className="text-xs text-muted-foreground">Verified</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Credentials</p>
                  <p className="text-xs text-muted-foreground">Verified</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Identity</p>
                  <p className="text-xs text-muted-foreground">Verified</p>
                </div>
              </div>
            </div>

            {/* Footer Message */}
            <p className="text-xs text-muted-foreground text-center">
              You can now close this page. Your {currentBrand.companyName} account is fully verified.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
