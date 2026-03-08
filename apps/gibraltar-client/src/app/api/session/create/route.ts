/**
 * POST /api/session/create
 *
 * Create or find session from case ID (customer-initiated path)
 * Customer enters case ID → backend validates → returns session UUID
 */

import { NextRequest, NextResponse } from 'next/server';
import { stripHtmlTags } from '@shared';

interface CreateSessionRequest {
  caseId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateSessionRequest = await request.json();
    const { caseId } = body;

    // Validate case ID is provided
    if (!caseId || typeof caseId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid case ID' },
        { status: 400 }
      );
    }

    // Sanitize case ID
    const sanitizedCaseId = stripHtmlTags(caseId.trim());

    if (!sanitizedCaseId) {
      return NextResponse.json(
        { error: 'Invalid case ID format' },
        { status: 400 }
      );
    }

    const backendUrl = process.env.DJANGO_API_BASE || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/api/sessions/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        external_case_id: sanitizedCaseId,
      }),
    });

    if (!response.ok) {
      // Generic error message regardless of backend error
      console.error(
        `[API] Create session error (${response.status}):`,
        await response.text()
      );
      return NextResponse.json(
        { error: 'Unable to validate case ID. Please contact support.' },
        { status: 400 }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      sessionUuid: data.uuid || data.session_uuid,
      externalCaseId: data.external_case_id || sanitizedCaseId,
    });
  } catch (error) {
    console.error('[API] Create session error:', error);
    return NextResponse.json(
      { error: 'Unable to validate case ID. Please contact support.' },
      { status: 500 }
    );
  }
}
