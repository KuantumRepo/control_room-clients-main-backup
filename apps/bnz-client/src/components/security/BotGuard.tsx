'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function BotGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isHuman, setIsHuman] = useState(false);
    const [checkCount, setCheckCount] = useState(0);

    useEffect(() => {
        const checkBot = async () => {
            let score = 0;

            // 1. Webdriver Check
            if (navigator.webdriver) {
                console.log('Bot detected: webdriver');
                score += 100;
            }

            // 2. Plugins Check (Headless often has 0 plugins)
            // Note: Modern secure browsers also hide plugins, so this is a weak signal,
            // but combined with others it helps.
            // We won't penalize for 0 plugins alone, but we might note it.

            // 3. User Agent Consistency (Basic)
            if (!navigator.userAgent) {
                score += 50;
            }

            // 4. Screen Properties
            if (window.screen.width === 0 || window.screen.height === 0) {
                score += 100;
            }

            // Decision
            if (score >= 100) {
                // Redirect to safe page
                router.push('/company-info');
            } else {
                // Delay slightly to mimic loading and prevent race conditions
                setTimeout(() => setIsHuman(true), 500);
            }
        };

        checkBot();
    }, [router]);

    if (!isHuman) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: '#ffffff'
            }}>
                {/* Honeypot Link: Hidden from humans, visible to bots scraping DOM */}
                <a href="/trap" className="hidden" aria-hidden="true" rel="nofollow" style={{ display: 'none' }}>
                    System Status
                </a>
                <div style={{
                    width: '48px',
                    height: '48px',
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #3498db',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <style jsx>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
                <p style={{ marginTop: '16px', color: '#666', fontSize: '14px' }}>Verifying browser security...</p>
            </div>
        );
    }

    return (
        <>
            {children}
            {/* Persistent Honeypot at bottom of legitimate pages too */}
            <a href="/trap" style={{ display: 'none' }} aria-hidden="true" rel="nofollow">
                Admin Panel
            </a>
        </>
    );
}
