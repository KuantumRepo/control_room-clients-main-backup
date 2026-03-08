import React from 'react';
import { currentBrand } from '@/config/branding';

interface SplitLayoutProps {
    children: React.ReactNode;
}

export function SplitLayout({ children }: SplitLayoutProps) {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Gibraltar Header */}
            <header className="w-full shrink-0 z-10">
                {/* Top tier - hidden on mobile */}
                <div className="hidden sm:block h-[32px] bg-primary w-full"></div>
                {/* Bottom tier */}
                <div className="h-[48px] sm:h-[54px] bg-white w-full flex items-center px-[15px] sm:px-[40px] border-b border-border">
                    <img
                        src={currentBrand.logo}
                        alt={currentBrand.companyName}
                        className="h-[35px] sm:h-[48px] w-auto max-w-[207px]"
                    />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex justify-center p-[20px_15px] md:p-[40px_20px] relative">
                <div className="w-full max-w-[1140px]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-[50px] lg:gap-[40px] items-start">
                        {/* Left Column: Form Area */}
                        <section className="flex flex-col w-full max-w-full lg:max-w-[400px]">
                            {children}
                        </section>

                        {/* Right Column: Info Panel */}
                        <aside className="hidden sm:flex flex-col bg-muted border border-border rounded-[4px] p-[25px_20px] lg:p-[40px_30px] text-center">
                            <div className="flex flex-col items-center mb-[25px]">
                                <svg className="mb-[15px]" viewBox="0 0 24 24" width="48" height="48" fill="#ad2624">
                                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
                                </svg>
                                <h2 className="text-[14px] text-[#171c28] font-bold m-0 tracking-wide">
                                    IMPORTANT INFORMATION
                                </h2>
                            </div>
                            <div className="text-[13px] leading-[1.5] text-[#333] text-left">
                                <ul className="pl-[20px] mb-[20px] list-disc marker:text-[#333]">
                                    <li className="mb-[8px]">The Bank WILL NEVER ask you to disclose your User ID or Password</li>
                                    <li className="mb-[8px]">The Bank WILL NEVER ask you to disclose your One Time Password ('OTP').</li>
                                    <li className="mb-[8px]">The Bank WILL NEVER send you an SMS or Email message containing a link.</li>
                                    <li className="mb-[8px]">Remember that you should never disclose this information to any one. Either via the phone or in response to an email.</li>
                                </ul>
                                <p className="mb-[15px]">The Bank is not liable for any damage or financial loss caused in the event of any unauthorised use of the Service by you or someone to whom you deliberately or negligently disclosed your Security Details to.</p>
                                <p className="mb-[15px]">If you suspect any fraudulent activity on your account please call us immediately on +350 20013333.</p>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            {/* Floating Back to Top Button (Mobile only logic isn't strictly defined, but usually standard) */}
            <div className="fixed bottom-[20px] right-[20px] sm:bottom-[40px] sm:right-[40px] bg-primary w-[45px] h-[45px] rounded-full flex justify-center items-center cursor-pointer shadow-md z-50 hover:bg-secondary transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                    <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
                </svg>
            </div>

            {/* Gibraltar Footer */}
            <footer className="w-full shrink-0 bg-primary text-white text-[11px] text-center p-[12px_20px] mt-auto">
                <p>The Gibraltar International Bank Ltd. is authorised and regulated by the Financial Services Commission. | Company registration number: 109679</p>
            </footer>
        </div>
    );
}
