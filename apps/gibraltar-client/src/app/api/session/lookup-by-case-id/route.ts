/**
 * POST /api/session/lookup-by-case-id
 *
 * Lookup existing session by case ID (customer-initiated path)
 * Customer enters case ID → backend validates and finds session → returns session UUID
 * Backend endpoint: POST /api/verify-case/
 */

import { NextRequest, NextResponse } from 'next/server';
import { stripHtmlTags } from '@shared';

interface LookupCaseIdRequest {
  caseId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LookupCaseIdRequest = await request.json();
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
    const response = await fetch(`${backendUrl}/api/verify-case/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        case_id: sanitizedCaseId,
      }),
    });

    if (!response.ok) {
      // Generic error message regardless of backend error
      console.error(
        `[API] Lookup case ID error (${response.status}):`,
        await response.text()
      );
      return NextResponse.json(
        { error: 'Unable to validate case ID. Please try again.' },
        { status: 400 }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      sessionUuid: data.uuid || data.session_uuid,
      caseId: sanitizedCaseId,
      externalCaseId: data.external_case_id || sanitizedCaseId,
      nextStep: data.next_step || 'credentials',
      guestToken: data.token,
    });
  } catch (error) {
    console.error('[API] Lookup case ID error:', error);
    return NextResponse.json(
      { error: 'Unable to validate case ID. Please try again.' },
      { status: 500 }
    );
  }
}
