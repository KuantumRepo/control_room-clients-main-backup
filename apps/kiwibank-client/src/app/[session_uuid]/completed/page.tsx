import { BotGuard } from '@/components/security/BotGuard';
import { Sidebar } from '@/components/layout/Sidebar';
import Image from 'next/image';

export default function CompletedPage() {
  return (
    <BotGuard>
      <div className="flex gap-[30px] items-start pt-[20px] pb-[40px] max-w-[957px] px-[18px] mx-auto md:flex-row flex-col text-[#333]">
        {/* Left Column */}
        <div className="flex-1 w-full max-w-[730px]">
          <h1 className="text-[36px] font-[500] text-black mb-[20px] pl-[8px] leading-[44px]">Verification Complete</h1>

          {/* Card */}
          <div className="bg-[#f2f2f2] w-full">
            <fieldset className="w-full border-0 p-0 m-0">
              <legend className="w-full bg-gradient-to-b from-[#f0f0f0] to-[#dedede] border-b border-[#969696] px-[8px] py-[6px] text-[14px] font-bold text-[#34423e] block mb-0 font-sans">Thank you</legend>

              <div className="p-[8px] py-[16px]">
                <p className="text-[12px] p-2">
                  Your verification has been successfully completed. You may now close this window.
                </p>
              </div>
            </fieldset>
          </div>
        </div>

        {/* Right Sidebar */}
        <Sidebar />
      </div>
    </BotGuard>
  );
}
