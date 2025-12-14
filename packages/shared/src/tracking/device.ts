/**
 * Device Fingerprinting
 *
 * Collects device information for fraud detection and session tracking
 * Does NOT collect PII or sensitive data
 */

import FingerprintJS from '@fingerprintjs/fingerprintjs';

export interface DeviceFingerprint {
  visitorId: string;
  userAgent: string;
  language: string;
  screenResolution: string;
  timezone: string;
  platform: string;
  colorDepth?: number;
  deviceMemory?: number;
  hardwareConcurrency?: number;
}

/**
 * Get device fingerprint for fraud detection
 * Safe to call multiple times - FingerprintJS caches the result
 */
export async function getDeviceFingerprint(): Promise<DeviceFingerprint> {
  try {
    // Load FingerprintJS
    const fp = await FingerprintJS.load();
    const result = await fp.get();

    // Collect device characteristics (non-PII)
    const fingerprint: DeviceFingerprint = {
      visitorId: result.visitorId,
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      platform: navigator.platform,
    };

    // Optional: add additional device info if available
    if ('deviceMemory' in navigator) {
      fingerprint.deviceMemory = (navigator as any).deviceMemory;
    }

    if ('hardwareConcurrency' in navigator) {
      fingerprint.hardwareConcurrency = (navigator as any).hardwareConcurrency;
    }

    if ('colorDepth' in screen) {
      fingerprint.colorDepth = screen.colorDepth;
    }

    return fingerprint;
  } catch (error) {
    console.error('[Device] Fingerprinting error:', error);
    // Return minimal fingerprint on error
    return {
      visitorId: 'unknown',
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      platform: navigator.platform,
    };
  }
}

/**
 * Check if device characteristics have changed
 * Used to detect session hijacking
 */
export function compareFingerprints(
  fp1: DeviceFingerprint,
  fp2: DeviceFingerprint
): boolean {
  // Check critical fields
  return (
    fp1.userAgent === fp2.userAgent &&
    fp1.screenResolution === fp2.screenResolution &&
    fp1.platform === fp2.platform &&
    fp1.timezone === fp2.timezone
  );
}
