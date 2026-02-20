'use client';

/**
 * AmazonFooter — Dynamic footer with geolocation
 *
 * Desktop: gradient divider + centered links + copyright
 * Mobile: dark footer with dynamic language/country (fetched via IP geolocation),
 *         country code text (Windows-compatible), legal links, privacy sprite, copyright
 */

import 'flag-icons/css/flag-icons.min.css';
import { useEffect, useState } from 'react';

interface GeoData {
    countryCode: string;
    countryName: string;
    language: string;
}

// Map country codes to display language
const COUNTRY_LANGUAGES: Record<string, string> = {
    US: 'English',
    GB: 'English',
    AU: 'English',
    CA: 'English',
    NZ: 'English',
    IN: 'English',
    IE: 'English',
    SG: 'English',
    ZA: 'English',
    DE: 'Deutsch',
    AT: 'Deutsch',
    CH: 'Deutsch',
    FR: 'Français',
    BE: 'Français',
    ES: 'Español',
    MX: 'Español',
    AR: 'Español',
    CO: 'Español',
    IT: 'Italiano',
    BR: 'Português',
    PT: 'Português',
    JP: '日本語',
    CN: '中文',
    KR: '한국어',
    NL: 'Nederlands',
    PL: 'Polski',
    SE: 'Svenska',
    NO: 'Norsk',
    DK: 'Dansk',
    FI: 'Suomi',
    RU: 'Русский',
    TR: 'Türkçe',
    SA: 'العربية',
    AE: 'العربية',
    TH: 'ไทย',
    VN: 'Tiếng Việt',
    ID: 'Bahasa Indonesia',
    MY: 'Bahasa Melayu',
    PH: 'English',
    TW: '中文 (繁體)',
};

export function AmazonFooter() {
    const [year] = useState(() => new Date().getFullYear());
    const [geo, setGeo] = useState<GeoData>({
        countryCode: 'US',
        countryName: 'United States',
        language: 'English',
    });

    // Fetch user geolocation on mount
    useEffect(() => {
        const fetchGeo = async () => {
            try {
                const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
                if (!res.ok) return;
                const data = await res.json();
                const cc = (data.country_code || 'US').toUpperCase();
                setGeo({
                    countryCode: cc,
                    countryName: data.country_name || 'United States',
                    language: COUNTRY_LANGUAGES[cc] || 'English',
                });
            } catch {
                // Silently keep defaults (US / English)
            }
        };

        fetchGeo();
    }, []);

    return (
        <>
            {/* Desktop Footer — gradient divider + centered links */}
            <footer className="desktop-footer">
                <div className="footer-divider" />
                <div className="footer-links">
                    <a href="#" className="footer-link">Conditions of Use</a>
                    <a href="#" className="footer-link">Privacy Notice</a>
                    <a href="#" className="footer-link">Help</a>
                </div>
                <p className="footer-copyright">
                    &copy; 1996-{year}, Amazon.com, Inc. or its affiliates
                </p>
            </footer>

            {/* Mobile Footer — dark with dynamic language/country/legal */}
            <footer className="mobile-footer">
                <div className="nav-ftr-inner">
                    {/* Dynamic Language & Country */}
                    <div className="icp-container-mobile">
                        <span className="icp-item">
                            <span className="icp-globe-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                    stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="2" y1="12" x2="22" y2="12" />
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                </svg>
                            </span>
                            <span className="icp-color-base">{geo.language}</span>
                        </span>
                        <span className="icp-item">
                            <span className={`fi fi-${geo.countryCode.toLowerCase()}`} style={{ marginRight: '6px', fontSize: '14px', borderRadius: '2px' }} />
                            <span className="icp-color-base">{geo.countryName}</span>
                        </span>
                    </div>

                    {/* Legal Links */}
                    <ul className="nav-ftr-horiz">
                        <li className="nav-li"><a href="#" className="nav-a">Conditions of Use</a></li>
                        <li className="nav-li"><a href="#" className="nav-a">Privacy Notice</a></li>
                        <li className="nav-li"><a href="#" className="nav-a">Consumer Health Data Privacy Disclosure</a></li>
                        <li className="nav-li"><a href="#" className="nav-a">Your Ads Privacy Choices</a></li>
                    </ul>

                    {/* Privacy Icon */}
                    <div className="nav-ftr-privacy-icon">
                        <span className="nav-sprite-ccba" />
                    </div>

                    {/* Dynamic Copyright */}
                    <div className="nav-ftr-copyright">
                        &copy; 1996-{year}, Amazon.com, Inc. or its affiliates
                    </div>
                </div>
            </footer>
        </>
    );
}
