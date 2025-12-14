import React from 'react';
import { currentBrand } from '@/config/branding';

interface SplitLayoutProps {
    children: React.ReactNode;
}

export function SplitLayout({ children }: SplitLayoutProps) {
    return (
        <div className="flex flex-col min-h-screen md:flex-row md:h-screen">
            {/* Left Side: Branding Section */}
            <aside className="w-full flex-none md:w-1/2 md:flex-1 md:order-1">
                <div
                    className="w-full h-[164px] md:h-full flex justify-center items-center text-center bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/signin-landing.jpeg')" }}
                >
                    <div className="p-10 md:p-[60px_40px] flex flex-col items-center justify-center">
                        <div className="mb-5 md:w-[90px] md:h-[90px] w-[30px] h-[30px]">
                            {/* RBC Logo SVG Placeholder - will be replaced by actual SVG component */}
                            <img src={currentBrand.logo} alt={currentBrand.companyName} className="w-full h-full" />
                        </div>
                        <h1 className="text-white text-xl md:text-[2rem] font-normal mb-2.5 leading-tight">
                            Secure Verification
                        </h1>
                        <h2 className="text-white text-sm md:text-base font-normal">
                            {currentBrand.companyName} Online Banking
                        </h2>
                    </div>
                </div>
            </aside>

            {/* Right Side: Content/Form */}
            <main className="w-full flex-1 bg-white p-5 md:p-[40px_30px] lg:p-[60px_40px] md:order-2 overflow-y-auto flex flex-col items-center justify-start md:h-screen">
                <div className="w-full max-w-[600px] md:max-w-[400px] lg:max-w-[430px] flex flex-col">
                    {children}
                </div>
            </main>
        </div>
    );
}
