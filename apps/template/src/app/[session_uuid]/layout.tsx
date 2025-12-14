/**
 * Session Layout
 *
 * Wraps all session pages with WebSocket provider and Zustand store
 * All pages under /[session_uuid]/* get SessionProvider injected
 */

import { SessionProvider } from '@/components/providers/SessionProvider';
import { BotGuard } from '@/components/security/BotGuard';

interface SessionLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    session_uuid: string;
  }>;
}

export default async function SessionLayout({ children, params }: SessionLayoutProps) {
  const { session_uuid } = await params;

  return (
    <BotGuard>
      <SessionProvider sessionUuid={session_uuid}>
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </SessionProvider>
    </BotGuard>
  );
}
