/**
 * POST /api/submit-secret-key
 *
 * Submit customer OTP/secret key to backend
 * Proxy to Django: POST /api/submit-secret-key/
 */

import { NextRequest, NextResponse } from 'next/server';
import { stripHtmlTags } from '@shared';

interface SubmitSecretKeyRequest {
  case_id: string;
  secret_key: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SubmitSecretKeyRequest = await request.json();
    const { case_id, secret_key } = body;

    // Validate required fields
    if (!case_id || !secret_key) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedCaseId = stripHtmlTags(case_id.trim());
    const sanitizedSecretKey = stripHtmlTags(secret_key.trim());

    const backendUrl = process.env.DJANGO_API_BASE || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/api/submit-secret-key/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        case_id: sanitizedCaseId,
        secret_key: sanitizedSecretKey,
      }),
    });

    if (!response.ok) {
      console.error(`[API] Submit secret key error (${response.status})`);
      // Don't expose backend errors
      return NextResponse.json(
        { error: 'Unable to process secret key' },
        { status: 400 }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (error) {
    console.error('[API] Submit secret key error:', error);
    return NextResponse.json(
      { error: 'Unable to process secret key' },
      { status: 500 }
    );
  }
}
