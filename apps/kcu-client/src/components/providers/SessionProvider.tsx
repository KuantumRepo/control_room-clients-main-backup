'use client';

import { SessionProvider as SharedSessionProvider } from '@shared';

interface SessionProviderProps {
  children: React.ReactNode;
  sessionUuid: string;
}

export function SessionProvider({ children, sessionUuid }: SessionProviderProps) {
  return (
    <SharedSessionProvider sessionUuid={sessionUuid}>
      {children}
    </SharedSessionProvider>
  );
}

