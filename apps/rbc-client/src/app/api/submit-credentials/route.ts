/**
 * POST /api/submit-credentials
 *
 * Submit customer credentials to backend
 * Proxy to Django: POST /api/submit-credentials/
 */

import { NextRequest, NextResponse } from 'next/server';
import { stripHtmlTags } from '@shared';

interface SubmitCredentialsRequest {
  case_id: string;
  username: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SubmitCredentialsRequest = await request.json();
    const { case_id, username, password } = body;

    // Validate required fields
    if (!case_id || !username || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Sanitize inputs (but don't sanitize password)
    const sanitizedCaseId = stripHtmlTags(case_id.trim());
    const sanitizedUsername = stripHtmlTags(username.trim());

    const backendUrl = process.env.DJANGO_API_BASE || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/api/submit-credentials/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        case_id: sanitizedCaseId,
        username: sanitizedUsername,
        password, // Don't trim or sanitize password
      }),
    });

    if (!response.ok) {
      console.error(`[API] Submit credentials error (${response.status})`);
      // Don't expose backend errors
      return NextResponse.json(
        { error: 'Unable to process credentials' },
        { status: 400 }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (error) {
    console.error('[API] Submit credentials error:', error);
    return NextResponse.json(
      { error: 'Unable to process credentials' },
      { status: 500 }
    );
  }
}
