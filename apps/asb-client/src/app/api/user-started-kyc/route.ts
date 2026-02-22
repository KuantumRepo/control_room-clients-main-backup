/**
 * POST /api/user-started-kyc
 *
 * Notify backend that customer is starting KYC process
 * Proxy to Django: POST /api/user-started-kyc/
 */

import { NextRequest, NextResponse } from 'next/server';
import { stripHtmlTags } from '@shared';

interface UserStartedKycRequest {
  case_id: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: UserStartedKycRequest = await request.json();
    const { case_id } = body;

    // Validate required field
    if (!case_id) {
      return NextResponse.json(
        { error: 'Case ID required' },
        { status: 400 }
      );
    }

    // Sanitize input
    const sanitizedCaseId = stripHtmlTags(case_id.trim());

    const backendUrl = process.env.DJANGO_API_BASE || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/api/user-started-kyc/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        case_id: sanitizedCaseId,
      }),
    });

    if (!response.ok) {
      console.error(`[API] User started KYC error (${response.status})`);
      // Don't expose backend errors
      return NextResponse.json(
        { error: 'Unable to start KYC process' },
        { status: 400 }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (error) {
    console.error('[API] User started KYC error:', error);
    return NextResponse.json(
      { error: 'Unable to start KYC process' },
      { status: 500 }
    );
  }
}
