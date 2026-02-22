import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,

  // Security headers
  async headers() {
    // Build dynamic connect-src for CSP from environment variables
    const connectSrcParts = ["'self'"];

    // Get backend domain from env var, with fallbacks
    const backendDomain = process.env.NEXT_PUBLIC_BACKEND_DOMAIN ||
                          process.env.NEXT_PUBLIC_WS_URL?.replace(/^wss?:\/\//, '') ||
                          'localhost:8000';

    // Determine protocols based on domain
    const isLocalhost = backendDomain.includes('localhost');
    const httpProtocol = isLocalhost ? 'http' : 'https';
    const wsProtocol = isLocalhost ? 'ws' : 'wss';

    // Add backend URLs
    connectSrcParts.push(`${httpProtocol}://${backendDomain}`);
    connectSrcParts.push(`${wsProtocol}://${backendDomain}`);

    // Always include localhost for local development
    if (!isLocalhost) {
      connectSrcParts.push('http://localhost:8000');
      connectSrcParts.push('ws://localhost:8000');
      connectSrcParts.push('https://localhost:8000');
      connectSrcParts.push('wss://localhost:8000');
    }

    const connectSrc = connectSrcParts.join(' ');

    return [
      {
        source: "/:path*",
        headers: [
          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.jsdelivr.net", // unsafe-inline for Next.js
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              `connect-src ${connectSrc}`,
              "frame-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
            ].join("; "),
          },
          // Additional security headers
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
