'use client';

import Image from 'next/image';
import { currentBrand } from '@/config/branding';

export function AmazonHeader() {
    return (
        <>
            {/* Desktop — Centered logo above card */}
            <div className="logo-section">
                <a href="#" className="logo-link" aria-label={currentBrand.companyName}>
                    <img
                        src={currentBrand.logo}
                        alt={currentBrand.companyName}
                        className="logo-img"
                    />
                </a>
            </div>

            {/* Mobile — Dark header bar */}
            <header className="mobile-header">
                <a href="#" className="logo-link" aria-label={currentBrand.companyName}>
                    <img
                        src={currentBrand.logo}
                        alt={currentBrand.companyName}
                        className="logo-img-mobile"
                        style={{ filter: 'invert(1) hue-rotate(180deg)' }}
                    />
                </a>
            </header>
        </>
    );
}
