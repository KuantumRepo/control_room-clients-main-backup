import React from 'react';

export const Footer = () => {
    return (
        <footer className="bg-white border-t border-[#e3e2e2] min-h-[56px] py-[16px] px-[18px]">
            <div className="max-w-[1240px] mx-auto flex justify-center">
                <nav aria-label="Footer navigation">
                    <ul className="flex flex-wrap justify-center gap-y-[12px] gap-x-[40px] list-none p-0 m-0">
                        <li className="inline">
                            <a href="https://www.kiwibank.co.nz/contact-us/" className="text-[12px] text-[#404040] uppercase tracking-[0.3px] hover:text-[#009de5] no-underline">Contact Us</a>
                        </li>
                        <li className="inline">
                            <a href="https://www.kiwibank.co.nz/about-us/governance/legal-documents-and-information/legal-documents/#kiwibank-general-terms-and-conditions/" className="text-[12px] text-[#404040] uppercase tracking-[0.3px] hover:text-[#009de5] no-underline">Terms and Conditions</a>
                        </li>
                        <li className="inline">
                            <a href="https://www.kiwibank.co.nz/contact-us/security/" className="text-[12px] text-[#404040] uppercase tracking-[0.3px] hover:text-[#009de5] no-underline">Online Security</a>
                        </li>
                        <li className="inline">
                            <a href="https://www.kiwibank.co.nz/contact-us/support-hub/internet-banking/" className="text-[12px] text-[#404040] uppercase tracking-[0.3px] hover:text-[#009de5] no-underline">Register for internet banking</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </footer>
    );
};
