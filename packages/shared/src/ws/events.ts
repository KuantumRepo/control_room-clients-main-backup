/**
 * WebSocket Event Type Definitions
 *
 * All possible event types that the customer can receive from the backend
 */

export const WS_EVENT_TYPES = {
  // Connection lifecycle
  CONNECTION_ESTABLISHED: 'connection_established',
  PING: 'ping',
  PONG: 'pong',

  // Agent commands (most important for customer)
  COMMAND: 'command',

  // Session updates
  SESSION_UPDATE: 'session_update',
  USER_STATUS_UPDATE: 'user_status_update',

  // Tracking events (sent from customer to agent)
  DEVICE_METADATA: 'device_metadata',
  USER_ACTIVITY: 'user_activity',
  SESSION_STARTED: 'session_started',
  PAGE_VIEW: 'page_view',

  // Verified data updates from agent
  VERIFIED_DATA: 'verified_data',
} as const;

export type WSEventType = typeof WS_EVENT_TYPES[keyof typeof WS_EVENT_TYPES];
