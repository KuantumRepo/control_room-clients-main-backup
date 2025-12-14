/**
 * Session Analytics & Tracking
 *
 * Tracks user interactions for fraud detection and audit
 * Sends events to backend via WebSocket
 */

import { SocketClient } from '../ws/socket';
import { DeviceFingerprint, getDeviceFingerprint } from './device';

export class SessionTracker {
  private sessionUuid: string;
  private socket: SocketClient;
  private deviceFingerprint: DeviceFingerprint | null = null;
  private lastActiveTime: number = Date.now();

  constructor(sessionUuid: string, socket: SocketClient) {
    this.sessionUuid = sessionUuid;
    this.socket = socket;
    this.setupActivity();
  }

  /**
   * Track session start with device fingerprint
   */
  async trackSessionStart(): Promise<void> {
    try {
      // Get device fingerprint
      this.deviceFingerprint = await getDeviceFingerprint();

      // Send to backend
      this.socket.send({
        type: 'session_started',
        data: {
          fingerprint: this.deviceFingerprint,
          timestamp: new Date().toISOString(),
          url: window.location.href,
        },
      });

      console.log('[Tracking] Session started');
    } catch (error) {
      console.error('[Tracking] Failed to track session start:', error);
    }
  }

  /**
   * Track page view
   */
  trackPageView(page: string): void {
    this.socket.send({
      type: 'page_view',
      data: {
        page,
        timestamp: new Date().toISOString(),
        referrer: document.referrer,
      },
    });

    console.log('[Tracking] Page view:', page);
  }

  /**
   * Track form field interaction
   */
  trackFormInteraction(
    fieldName: string,
    eventType: 'focus' | 'blur'
  ): void {
    this.socket.send({
      type: 'user_activity',
      activity: 'form_interaction',
      data: {
        field: fieldName,
        eventType,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Track input attempt (don't track the actual value for security)
   */
  trackInputAttempt(fieldName: string, characterCount: number): void {
    this.socket.send({
      type: 'user_activity',
      activity: 'input_attempt',
      data: {
        field: fieldName,
        length: characterCount,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Track form submission
   */
  trackFormSubmission(
    stage: string,
    fieldCount: number
  ): void {
    this.socket.send({
      type: 'user_activity',
      activity: 'form_submission',
      data: {
        stage,
        fields: fieldCount,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Track page focus/blur
   */
  trackPageVisibility(visible: boolean): void {
    this.socket.send({
      type: 'user_activity',
      activity: 'visibility_change',
      data: {
        visible,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Track mouse/keyboard activity for fraud detection
   */
  trackUserActivity(): void {
    this.lastActiveTime = Date.now();
  }

  /**
   * Setup automatic activity tracking
   */
  private setupActivity(): void {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.trackPageVisibility(document.visibilityState === 'visible');
    });

    // Track user activity (mouse, keyboard)
    const activityEvents = ['mousedown', 'keydown', 'touchstart'];
    activityEvents.forEach((event) => {
      document.addEventListener(event, () => this.trackUserActivity(), {
        passive: true,
      });
    });

    // Track page unload
    window.addEventListener('beforeunload', () => {
      this.socket.send({
        type: 'user_activity',
        activity: 'page_unload',
        data: {
          sessionDuration: Date.now() - this.lastActiveTime,
          timestamp: new Date().toISOString(),
        },
      });
    });
  }

  /**
   * Get session duration in seconds
   */
  getSessionDuration(): number {
    return Math.round((Date.now() - this.lastActiveTime) / 1000);
  }

  /**
   * Get device fingerprint (if available)
   */
  getDeviceFingerprint(): DeviceFingerprint | null {
    return this.deviceFingerprint;
  }
}
