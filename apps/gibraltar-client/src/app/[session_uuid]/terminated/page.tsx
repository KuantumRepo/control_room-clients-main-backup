'use client';

import { SplitLayout } from '@/components/layout/SplitLayout';
import { XCircle } from 'lucide-react';

export default function TerminatedPage() {
  return (
    <SplitLayout>
      <div className="w-full flex flex-col flex-1">
        <div className="mb-[40px] pb-[15px] border-b border-border">
          <h1 className="text-[18px] md:text-[20px] text-foreground font-normal m-0">
            Session Terminated
          </h1>
        </div>

        <div className="mb-[20px]">
          <p className="text-[#555] text-[13px] font-normal leading-snug">
            For your protection, this verification session has been closed. Please contact Gibraltar International Bank support for further assistance.
          </p>
        </div>

        <div className="w-full space-y-4 mb-[40px]">
          <div className="flex items-center gap-[15px] p-[20px] bg-red-50 rounded-[4px] border border-red-200">
            <XCircle className="h-8 w-8 text-destructive flex-shrink-0" />
            <div>
              <p className="text-[14px] font-bold text-foreground m-0">Verification Session Closed</p>
              <p className="text-[13px] text-[#555] mt-[5px]">
                Session ID: {typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    </SplitLayout>
  );
}
