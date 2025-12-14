'use client';

/**
 * Shared Session Provider
 *
 * Manages WebSocket connection, agent commands, and session state.
 * Centralizes logic previously duplicated in each app.
 */

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '../stores/sessionStore';
import { getSocketClient, resetSocketClient, SocketClient } from '../ws/socket';
import { SessionTracker } from '../tracking/analytics';
import type { CommandMessage } from '../types/ws';

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
        // Preserve existing caseId when initializing session UUID
        const currentCaseId = useSessionStore.getState().caseId;
        setSession(sessionUuid, currentCaseId || undefined);

        // Get or create socket client
        const socket = getSocketClient(sessionUuid);
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
     */
    const mapStageToRoute = (stage: string): string => {
        const stageMap: Record<string, string> = {
            'secret_key': 'secret-key',
            'credentials': 'credentials',
            'kyc': 'kyc',
            'completed': 'completed',
            'terminated': 'terminated',
        };

        return stageMap[stage] || stage;
    };

    const handleWebSocketOpen = () => {
        console.log('[SessionProvider] WebSocket connected');
        setStatus('idle');
        incrementConnectionAttempts();
    };

    const handleWebSocketClose = () => {
        console.log('[SessionProvider] WebSocket disconnected');
    };

    const handleAuthError = () => {
        console.error('[SessionProvider] WebSocket auth error');
        setStatus('error');
        setAgentMessage('Session expired. Please refresh the page.');
        resetSocketClient();
    };

    const handleAgentCommand = (message: CommandMessage) => {
        console.log('[SessionProvider] Agent command received:', message.command);

        const { command, stage, url, message: msg, next_stage } = message;

        switch (command) {
            case 'redirect':
                if (stage) {
                    const route = mapStageToRoute(stage);
                    router.push(`/${sessionUuid}/${route}`);
                } else if (url) {
                    window.location.href = url;
                }
                break;

            case 'navigate':
                if (stage) {
                    const route = mapStageToRoute(stage);
                    setAgentMessage(msg || `Moving to ${stage} stage...`);
                    router.push(`/${sessionUuid}/${route}`);
                }
                break;

            case 'accept':
                setStatus('approved');
                setAgentMessage('Verification approved. Moving to next step...');
                if (next_stage) {
                    const route = mapStageToRoute(next_stage);
                    router.push(`/${sessionUuid}/${route}`);
                }
                break;

            case 'reject':
                setStatus('rejected');
                setAgentMessage(msg || 'Please review your information and try again.');
                break;

            case 'retry':
                setStatus('error');
                setAgentMessage(msg || 'Please review and resubmit your information.');
                break;

            case 'skip':
                setStatus('approved');
                if (next_stage) {
                    const route = mapStageToRoute(next_stage);
                    router.push(`/${sessionUuid}/${route}`);
                }
                break;

            case 'session_ended':
                setStatus('error');
                setAgentMessage('Your session has been terminated.');
                setStage('terminated');
                setTimeout(() => {
                    router.push(`/${sessionUuid}/terminated`);
                }, 2000);
                break;

            case 'verification_failed':
                setStatus('error');
                setAgentMessage(msg || 'Your verification was unsuccessful. Please contact support.');
                setTimeout(() => {
                    setStage('terminated');
                    router.push(`/${sessionUuid}/terminated`);
                }, 2000);
                break;

            case 'verification_completed':
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
