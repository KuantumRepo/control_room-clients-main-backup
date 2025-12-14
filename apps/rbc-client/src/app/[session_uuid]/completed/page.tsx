'use client';

/**
 * Completed/Success Stage Page
 *
 * Shown when verification is successfully completed
 * All stages passed - customer is verified
 */

import { SplitLayout } from '@/components/layout/SplitLayout';
import { RBCFooter, ServiceNotices } from '@/components/ui/RBCComponents';
import { CheckCircle2 } from 'lucide-react';

export default function CompletedPage() {
  return (
    <SplitLayout>
      <div className="w-full flex flex-col flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-normal text-[#1f1f1f] mb-2">
            Verification Complete
          </h1>
          <p className="text-[#666666] text-sm font-light">
            Your identity has been successfully verified. Thank you for completing the process.
          </p>
        </div>

        <div className="w-full space-y-4 mb-8">
          <div className="flex items-center gap-3 p-4 bg-[#f0fdf4] rounded-md border border-[#bbf7d0]">
            <CheckCircle2 className="h-6 w-6 text-[#16a34a] flex-shrink-0" />
            <div>
              <p className="text-[0.95rem] font-medium text-[#1f1f1f]">Verification Successful</p>
              <p className="text-[0.85rem] text-[#666666]">You can now close this page.</p>
            </div>
          </div>
        </div>

        <ServiceNotices />
        <RBCFooter />
      </div>
    </SplitLayout>
  );
}
