/**
 * Shared Library Exports
 *
 * Central export point for all shared functionality
 */

// Stores
export { useSessionStore, useSession } from './stores/sessionStore';
export { submitStageData } from './api/sessionApi';
export { SessionProvider } from './providers/SessionProvider';
export { stripHtmlTags } from './utils/sanitization';
export type { SessionStage, SessionStatus, SessionState } from './stores/sessionStore';

// WebSocket
export { SocketClient, getSocketClient, resetSocketClient } from './ws/socket';
export { WS_EVENT_TYPES } from './ws/events';
export type { BackendMessage } from './ws/socket';
export type { WSEventType } from './ws/events';

// Types
export type {
  AgentCommand,
  CommandMessage,
  ConnectionEstablishedMessage,
  UserStatusUpdate,
  SessionUpdate,
  DeviceMetadataMessage,
  UserActivityMessage,
  SessionStartedMessage,
  PageViewMessage,
  VerifiedDataMessage,
  WebSocketMessage,
  MessagePayloadForType,
} from './types/ws';

// Tracking
export { SessionTracker } from './tracking/analytics';
export { getDeviceFingerprint, compareFingerprints } from './tracking/device';
export type { DeviceFingerprint } from './tracking/device';

// Utils
export { cn } from './utils';
