import React from 'react';
import Image from 'next/image';
import { currentBrand } from '@/config/branding';

export const Header = () => {
    return (
        <header className="h-[120px] relative z-[100] bg-black w-full">
            <div className="max-w-[1140px] mx-auto px-[18px] h-full flex items-start justify-between">
                <a href="https://www.kiwibank.co.nz/" className="block mt-[12px] mr-[18px]">
                    <Image
                        src={currentBrand.logo}
                        alt={currentBrand.companyName}
                        width={96}
                        height={96}
                        className="w-[96px] h-[96px] object-contain"
                        priority
                    />
                </a>
                <nav className="flex items-center pt-[12px]" aria-label="Utility navigation">
                    <a href="https://www.kiwibank.co.nz/contact-us/support-hub/internet-banking/" className="text-white font-[500] text-[12px] uppercase tracking-[0.3px] hover:underline font-sans">
                        More about internet banking
                    </a>
                </nav>
            </div>
        </header>
    );
};
