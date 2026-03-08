/**
 * POST /api/session/kyc/complete
 *
 * Notify backend that customer returned from KYC
 */

import { NextRequest, NextResponse } from 'next/server';

interface CompleteKYCRequest {
  uuid: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CompleteKYCRequest = await request.json();
    const { uuid } = body;

    if (!uuid) {
      return NextResponse.json(
        { error: 'Session UUID required' },
        { status: 400 }
      );
    }

    const backendUrl = process.env.DJANGO_API_BASE || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/api/sessions/${uuid}/kyc/complete/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`[API] KYC complete error (${response.status})`);
      // Don't expose backend errors
      return NextResponse.json(
        { error: 'KYC submission failed' },
        { status: 400 }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      message: 'KYC submission received',
      ...data,
    });
  } catch (error) {
    console.error('[API] KYC complete error:', error);
    return NextResponse.json(
      { error: 'KYC submission failed' },
      { status: 500 }
    );
  }
}
