import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    // Log the IP address of the bot accessing this trap
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    console.warn(`[HONEYPOT TRIGGERED] Bot detected at /trap via IP: ${ip}, UA: ${userAgent}`);

    // We could add this IP to a blocklist database here.

    // Return 404 to confuse the bot or simulate a dead link
    return new NextResponse(null, { status: 404 });
}
