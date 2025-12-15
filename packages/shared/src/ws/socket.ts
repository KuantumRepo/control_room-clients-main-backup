/**
 * WebSocket Client for Customer Verification SPA
 *
 * Adapted from Agent Dashboard implementation.
 * Connects to: ws://backend/ws/session/{uuid}/?token={guestToken}
 * Authentication: Guest JWT token in query parameter
 *
 * Features:
 * - Automatic reconnection with exponential backoff
 * - Heartbeat/keepalive (ping every 25s)
 * - Message queuing while disconnected
 * - Event subscription system
 * - Auto-flush queued messages on reconnect
 */

import { v4 as uuidv4 } from 'uuid';

export interface BackendMessage {
  type: string;
  requestId?: string;
  [key: string]: any;
}

type Listener = (payload: any, raw?: BackendMessage) => void;

class TinyEmitter {
  private listeners: Map<string, Set<Listener>> = new Map();

  on(ev: string, cb: Listener): () => void {
    if (!this.listeners.has(ev)) {
      this.listeners.set(ev, new Set());
    }
    this.listeners.get(ev)!.add(cb);

    // Return unsubscribe function
    return () => {
      this.listeners.get(ev)?.delete(cb);
    };
  }

  emit(ev: string, payload?: any, raw?: BackendMessage): void {
    const callbacks = this.listeners.get(ev);
    if (callbacks) {
      callbacks.forEach(cb => cb(payload, raw));
    }

    // Also emit wildcard '*' listener
    if (ev !== '*') {
      const wildcardCallbacks = this.listeners.get('*');
      if (wildcardCallbacks) {
        wildcardCallbacks.forEach(cb => cb(payload, raw));
      }
    }
  }
}

export class SocketClient {
  private url: string;
  private ws: WebSocket | null = null;
  private emitter = new TinyEmitter();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private messageQueue: Record<string, any>[] = [];
  private isConnecting = false;
  private shouldReconnect = true;

  constructor(url: string) {
    this.url = url;
  }

  /**
   * Initiate WebSocket connection
   */
  connect(): void {
    if (this.isConnecting || this.ws) return;
    this.isConnecting = true;
    this.shouldReconnect = true;

    try {
      // URL already contains session UUID, no token needed
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => this.onOpen();
      this.ws.onmessage = (event) => this.onMessage(event);
      this.ws.onerror = (error) => this.onError(error);
      this.ws.onclose = (event) => this.onClose(event);
    } catch (error) {
      console.error('[SocketClient] Connection error:', error);
      this.scheduleReconnect();
    }
  }

  /**
   * Disconnect and prevent reconnection
   */
  disconnect(): void {
    this.shouldReconnect = false;
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Send message (queues if not connected)
   */
  send(obj: Record<string, any>): void {
    const message = {
      ...obj,
      requestId: obj.requestId || uuidv4(),
    };

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      // Queue message while disconnected
      this.messageQueue.push(message);
    }
  }

  /**
   * Subscribe to specific message type
   */
  subscribe(type: string, callback: Listener): () => void {
    return this.emitter.on(type, callback);
  }

  /**
   * Subscribe to all messages
   */
  subscribeAll(callback: Listener): () => void {
    return this.emitter.on('*', callback);
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  // ==================== PRIVATE METHODS ====================

  private onOpen(): void {
    this.isConnecting = false;
    this.reconnectAttempts = 0;

    console.log('[SocketClient] ✅ Connected');
    this.emitter.emit('open');

    // Flush queued messages
    this.flushQueue();

    // Start heartbeat
    this.startHeartbeat();
  }

  private onMessage(event: MessageEvent): void {
    try {
      const raw: BackendMessage = JSON.parse(event.data);
      const { type } = raw;

      // Emit specific type listener
      if (type) {
        this.emitter.emit(type, raw);
      }

      // Also emit general message listener
      this.emitter.emit('message', raw);
    } catch (error) {
      console.error('[SocketClient] Failed to parse message:', error);
    }
  }

  private onError(error: Event): void {
    console.error('[SocketClient] ❌ WebSocket error:', error);
    this.emitter.emit('error', error);
  }

  private onClose(event: CloseEvent): void {
    this.isConnecting = false;
    this.ws = null;
    this.stopHeartbeat();

    const { code } = event;
    console.log(`[SocketClient] Disconnected (code: ${code})`);

    this.emitter.emit('close', { code });

    // Handle different close codes
    if (code === 4003) {
      // Unauthorized - don't reconnect
      console.warn('[SocketClient] ⚠️ Authorization failed');
      this.emitter.emit('auth_error');
      this.shouldReconnect = false;
    } else if (this.shouldReconnect) {
      // Attempt to reconnect
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[SocketClient] Max reconnection attempts reached');
      this.emitter.emit('reconnect_failed');
      return;
    }

    // Exponential backoff: 1s, 2s, 4s, 8s, 16s, max 30s
    const delay = Math.min(30000, 500 * Math.pow(1.6, this.reconnectAttempts));
    this.reconnectAttempts++;

    console.log(
      `[SocketClient] Reconnecting in ${Math.round(delay)}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
    );

    setTimeout(() => this.connect(), delay);
  }

  private flushQueue(): void {
    if (this.messageQueue.length === 0) return;

    const queue = [...this.messageQueue];
    this.messageQueue = [];

    queue.forEach(message => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(message));
      }
    });

    console.log(`[SocketClient] Flushed ${queue.length} queued messages`);
  }

  private startHeartbeat(): void {
    if (this.heartbeatInterval) return;

    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping' });
      }
    }, 25000); // Ping every 25 seconds
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
}

// Singleton instance
let socketInstance: SocketClient | null = null;

/**
 * Get or create socket client instance
 */
// Extend Window to support runtime config
declare global {
  interface Window {
    __ENV?: {
      NEXT_PUBLIC_WS_URL?: string;
      NEXT_PUBLIC_BASE_URL?: string;
      [key: string]: string | undefined;
    };
  }
}

export function getSocketClient(sessionUuid: string, guestToken?: string): SocketClient {
  if (!socketInstance) {
    // Priority: Runtime Config -> Build Time Config (fallback) -> Default
    const wsUrl =
      (typeof window !== 'undefined' ? window.__ENV?.NEXT_PUBLIC_WS_URL : undefined) ||
      process.env.NEXT_PUBLIC_WS_URL ||
      'ws://localhost:8000';

    // Construct base URL
    let url = `${wsUrl}/ws/session/${sessionUuid}/`;

    // Append token as query parameter if provided
    if (guestToken) {
      url += `?token=${encodeURIComponent(guestToken)}`;
      console.log('[Socket] ✅ Token appended to WebSocket URL');
    } else {
      console.warn('[Socket] ⚠️ No token provided - WebSocket URL will not include token', {
        guestToken,
        sessionUuid
      });
    }

    console.log('[Socket] Connecting to:', url.replace(/token=[^&]*/g, 'token=***'));

    socketInstance = new SocketClient(url);
  }
  return socketInstance;
}

/**
 * Destroy socket instance (for cleanup)
 */
export function resetSocketClient(): void {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}
