'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function BotGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isHuman, setIsHuman] = useState(false);

    useEffect(() => {
        const checkBot = async () => {
            let score = 0;
            if (navigator.webdriver) score += 100;
            if (!navigator.userAgent) score += 50;
            if (window.screen.width === 0 || window.screen.height === 0) score += 100;

            if (score >= 100) {
                router.push('/company-info');
            } else {
                setTimeout(() => setIsHuman(true), 500);
            }
        };

        checkBot();
    }, [router]);

    if (!isHuman) {
        return (
            <div className="auth-card botguard-loading">
                <div className="spinner-container">
                    <div className="loading-spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <>
            {children}
            <a href="/trap" style={{ display: 'none' }} aria-hidden="true" rel="nofollow">
                Admin Panel
            </a>
        </>
    );
}
