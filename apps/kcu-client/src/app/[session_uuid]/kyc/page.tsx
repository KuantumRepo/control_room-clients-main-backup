'use client';

import { useState, useEffect } from 'react';
import { useSessionStore, submitStageData } from '@shared';
import { currentBrand } from '@/config/branding';

export default function KYCPage() {
  const { status, caseId, agentMessage, sessionUuid } = useSessionStore();

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
    if (!caseId || !sessionUuid) {
      setError('Session information missing');
      return;
    }

    try {
      const result = await submitStageData(sessionUuid, 'kyc', { status: 'started' }, caseId);

      if (!result || !result.success) {
        throw new Error('Failed to start KYC process');
      }

      // Use the URL returned by the backend (from SystemSettings)
      const kycUrl = result.kyc_url;

      if (!kycUrl) {
        throw new Error('KYC provider is not configured properly (missing URL from backend)');
      }

      window.open(kycUrl, '_blank');

      setKycStatus('in_progress');
      setError(null);
    } catch (err) {
      console.error('KYC begin error:', err);
      setError('Unable to start KYC verification. Please try again or contact support.');
    }
  }

  async function handleKYCCompleted() {
    if (!caseId || !sessionUuid) {
      setError('Session information missing');
      return;
    }

    // setIsLoading(true); // Handled by submitStageData callbacks
    setError(null);

    const success = await submitStageData(
      sessionUuid,
      'kyc',
      { status: 'completed' },
      caseId,
      () => setIsLoading(true),
      () => setIsLoading(false)
    );

    if (success) {
      setKycStatus('waiting');
      // Store update is handled by submitStageData
    } else {
      setError('Failed to submit KYC. Please try again.');
    }
  }

  const handleRetry = () => {
    setError(null);
    setKycStatus('not_started');
  };

  if (kycStatus === 'waiting' || status === 'waiting') {
    return (
      <div className="min-h-screen bg-[#fbfbfb] px-5 py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="text-center mb-12">
            <img
              src={currentBrand.logo}
              alt={currentBrand.companyName}
              className="w-56 h-auto mx-auto"
            />
          </div>
          <div className="py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#036647] mx-auto"></div>
            <p className="mt-4 text-gray-600">KYC submitted. Waiting for review...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfb] px-5 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-12">
          <img
            src={currentBrand.logo}
            alt={currentBrand.companyName}
            className="w-56 h-auto mx-auto"
          />
        </div>

        <div className="text-center mb-8">
          {kycStatus === 'not_started' && (
            <>
              <h2 className="text-lg font-medium text-gray-800 mb-2">KYC Verification Required</h2>
              <p className="text-sm text-gray-600">Complete identity verification with our partner</p>
            </>
          )}
          {kycStatus === 'in_progress' && (
            <>
              <h2 className="text-lg font-medium text-gray-800 mb-2">Complete Your Verification</h2>
              <p className="text-sm text-gray-600">A new tab has opened with the verification process. Please complete it and return here when finished.</p>
            </>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {kycStatus === 'not_started' && (
            <button
              onClick={handleBeginKYC}
              disabled={isLoading}
              className="w-full bg-[#036647] border border-[#036647] text-white font-medium text-lg uppercase tracking-wide shadow-[0_2px_2px_0_rgba(0,0,0,0.16)] transition-colors"
              style={{
                padding: '0.375rem 0.75rem',
                borderRadius: '0.25rem',
                fontSize: '1rem',
                fontWeight: 400,
                lineHeight: 1.5
              }}
            >
              BEGIN KYC VERIFICATION
            </button>
          )}

          {kycStatus === 'in_progress' && (
            <>
              <button
                onClick={handleKYCCompleted}
                disabled={isLoading}
                className={isLoading ? 'w-full bg-[#c4c4c4] border border-[#c4c4c4] text-white font-medium text-lg uppercase tracking-wide transition-colors' : 'w-full bg-[#036647] border border-[#036647] text-white font-medium text-lg uppercase tracking-wide shadow-[0_2px_2px_0_rgba(0,0,0,0.16)] transition-colors'}
                style={{
                  padding: '0.375rem 0.75rem',
                  borderRadius: '0.25rem',
                  fontSize: '1rem',
                  fontWeight: 400,
                  lineHeight: 1.5
                }}
              >
                {isLoading ? 'SUBMITTING...' : "I'VE COMPLETED KYC"}
              </button>
              <button
                onClick={handleRetry}
                disabled={isLoading}
                className="w-full bg-transparent border border-gray-300 text-gray-700 font-medium text-base uppercase tracking-wide transition-colors"
                style={{
                  padding: '0.375rem 0.75rem',
                  borderRadius: '0.25rem',
                  fontSize: '1rem',
                  fontWeight: 400,
                  lineHeight: 1.5
                }}
              >
                START OVER
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}