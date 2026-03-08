/**
 * POST /api/session/kyc/init
 *
 * Initialize KYC process - get Ballerine URL from backend
 */

import { NextRequest, NextResponse } from 'next/server';

interface InitKYCRequest {
  uuid: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: InitKYCRequest = await request.json();
    const { uuid } = body;

    if (!uuid) {
      return NextResponse.json(
        { error: 'Session UUID required' },
        { status: 400 }
      );
    }

    const backendUrl = process.env.DJANGO_API_BASE || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/api/sessions/${uuid}/kyc/init/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`[API] KYC init error (${response.status})`);
      return NextResponse.json(
        { error: 'Unable to start KYC verification' },
        { status: 400 }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      kyc_url: data.kyc_url || data.ballerine_url,
      ...data,
    });
  } catch (error) {
    console.error('[API] KYC init error:', error);
    return NextResponse.json(
      { error: 'Unable to start KYC verification' },
      { status: 500 }
    );
  }
}
