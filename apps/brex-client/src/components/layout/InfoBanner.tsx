'use client';

import { Info } from "lucide-react";

export function InfoBanner() {
    return (
        <div className="info-banner">
            <div className="info-banner__content">
                <Info className="info-banner__icon" />
                <p className="info-banner__text">
                    The Account details screen now shows your business trading name, if you&apos;ve given this to us. For joint
                    accounts, the names of all account holders are now on your Account details screen.{' '}
                    <a href="#" className="info-banner__link">How to share your account name and number.</a>
                </p>
            </div>
        </div>
    );
}
