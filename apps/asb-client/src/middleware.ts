import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of known bot user-agent fragments
const BOT_AGENTS = [
    'googlebot',
    'bingbot',
    'slurp',
    'duckduckbot',
    'baidu',
    'yandex',
    'sogou',
    'exabot',
    'facebot',
    'ia_archiver',
    'curl',
    'python',
    'wget',
    'http-client',
    'headless',
    'puppeteer',
    'playwright',
    'selenium',
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Always allow asset requests (images, css, js, fonts)
    // This ensures that if a bot *does* render the page, it looks "broken" or generic,
    // but also prevents blocking legitimate resource fetching if the browser behaves oddly.
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.startsWith('/public') ||
        pathname.match(/\.(svg|png|jpg|jpeg|gif|ico|css|js|woff|woff2|ttf)$/)
    ) {
        return NextResponse.next();
    }

    // 2. Identify Bot via User-Agent
    const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
    const isBot = BOT_AGENTS.some((bot) => userAgent.includes(bot));

    // 3. Routing Logic
    if (isBot) {
        // If the bot is already at the safe page, allow it (prevents refresh loops if they land there)
        if (pathname === '/company-info') {
            return NextResponse.next();
        }

        // Otherwise, SILENTLY rewrite the response to the Safe Page.
        // The URL in the address bar remains the same (e.g., /session/123),
        // but the content served is 'Company Info'.
        // This is "Cloaking".
        return NextResponse.rewrite(new URL('/company-info', request.url));
    }

    // 4. Human Logic
    // If a human tries to visit the safe page directly, we could let them, or redirect them home.
    // For now, let's just let them see it if they really want to.

    return NextResponse.next();
}

export const config = {
    // Apply to all routes except api routes (unless we want to protect them too?)
    // For now, protecting pages is the priority.
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
