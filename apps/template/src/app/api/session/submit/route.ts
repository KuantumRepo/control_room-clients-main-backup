/**
 * POST /api/session/submit
 *
 * Submit stage data to backend
 * Handles: case ID, credentials, secret key, KYC submission, etc.
 */

import { NextRequest, NextResponse } from 'next/server';
import { stripHtmlTags } from '@shared';

interface SubmitRequest {
  uuid: string;
  stage: string;
  data: Record<string, any>;
}

export async function POST(request: NextRequest) {
  try {
    const body: SubmitRequest = await request.json();
    const { uuid, stage, data } = body;

    // Validate required fields
    if (!uuid || !stage || !data) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Sanitize string inputs to prevent XSS
    const sanitizedData = sanitizeData(data);

    const backendUrl = process.env.DJANGO_API_BASE || 'http://localhost:8000';
    const response = await fetch(
      `${backendUrl}/api/sessions/${uuid}/submit/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stage,
          data: sanitizedData,
        }),
      }
    );

    if (!response.ok) {
      // Don't expose backend error details to client
      // Always return generic message
      console.error(
        `[API] Submit error (${response.status}):`,
        await response.text()
      );
      return NextResponse.json(
        { error: 'Submission failed. Please try again.' },
        { status: 400 }
      );
    }

    const result = await response.json();
    return NextResponse.json({
      success: true,
      message: 'Submission received. Waiting for agent verification...',
      ...result,
    });
  } catch (error) {
    console.error('[API] Submit error:', error);
    return NextResponse.json(
      { error: 'Submission failed. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * Sanitize data to prevent XSS attacks
 * Only sanitizes string values, leaves other types alone
 */
function sanitizeData(data: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Remove any HTML tags and dangerous characters
      sanitized[key] = stripHtmlTags(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
