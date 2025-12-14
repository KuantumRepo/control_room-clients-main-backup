import React, { useState } from 'react';
import { LockIcon, HelpIcon, PopupIcon, MenuIcon, ChevronIcon, ExternalLinkIcon } from './icons';

// --- RBC Input ---
interface RBCInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    showLockIcon?: boolean;
}

export const RBCInput = React.forwardRef<HTMLInputElement, RBCInputProps>(
    ({ label, showLockIcon, className, ...props }, ref) => {
        return (
            <div className="mb-5">
                <div className="flex items-start gap-2.5 mb-2">
                    <div className="w-full">
                        <label htmlFor={props.id} className="block text-base font-normal text-[#1f1f1f]">
                            {label}
                        </label>
                    </div>
                    {showLockIcon && (
                        <a href="#" className="float-right text-[#444] cursor-pointer w-6 h-6 transition-colors hover:text-[#333]" aria-label="Security Guarantee">
                            <LockIcon className="w-full h-full" />
                        </a>
                    )}
                </div>
                <input
                    ref={ref}
                    className={`w-full p-[12px_10px] border border-[#cccccc] rounded-[4px] text-base font-light text-[#1f1f1f] transition-colors focus:outline-none focus:border-[#006ac3] focus:shadow-[0_0_0_1px_#006ac3] ${className}`}
                    {...props}
                />
            </div>
        );
    }
);
RBCInput.displayName = 'RBCInput';

// --- RBC Button ---
interface RBCButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export const RBCButton = ({ children, className, ...props }: RBCButtonProps) => {
    return (
        <button
            className={`w-full p-[14px_32px] mt-5 bg-[#006ac3] text-white text-base font-medium border border-[#006ac3] rounded-none cursor-pointer transition-colors hover:bg-[#005a9f] hover:border-[#005a9f] active:bg-[#004a7f] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

// --- RBC Checkbox ---
interface RBCCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: React.ReactNode;
}

export const RBCCheckbox = React.forwardRef<HTMLInputElement, RBCCheckboxProps>(
    ({ label, className, ...props }, ref) => {
        return (
            <div className="my-5 outline-none">
                <div className="flex items-start">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        ref={ref}
                        {...props}
                    />
                    <label htmlFor={props.id} className="flex items-start cursor-pointer select-none gap-2.5 group">
                        <span className="flex items-center justify-center w-5 h-5 shrink-0 mt-0.5 border border-[#cccccc] rounded-[2px] bg-white transition-all peer-checked:bg-[#006ac3] peer-checked:border-[#006ac3] group-hover:border-[#006ac3]">
                            {/* Checkmark handled by CSS or conditional rendering if needed, but CSS peer-checked is easier with custom icon */}
                            <svg className="w-3 h-2 text-white hidden peer-checked:block pointer-events-none" viewBox="0 0 12 8" fill="none">
                                <path d="M1 3L4.5 6.5L11 1" stroke="currentColor" strokeWidth="2" />
                            </svg>
                        </span>
                        <div className="text-[0.95rem] font-light text-[#1f1f1f] leading-snug">
                            {label}
                        </div>
                    </label>
                </div>
            </div>
        );
    }
);
RBCCheckbox.displayName = 'RBCCheckbox';

// --- Service Notices ---
export const ServiceNotices = () => {
    return (
        <div className="w-full flex flex-col mt-5 pt-5 border-t border-[#eeeeee]">
            <section>
                <h3 className="text-[0.95rem] font-medium text-[#1f1f1f] mb-[15px]">Service Notices</h3>
                <ul className="list-none m-0 p-0">
                    <li className="mb-2.5">
                        <a href="#" className="flex items-center justify-between gap-3 text-[#006ac3] no-underline text-[0.9rem] py-2 hover:text-[#005a9f] hover:underline">
                            <span className="flex-1">Important Information: Canada Post Service Disruption</span>
                            <PopupIcon className="w-4 h-4 shrink-0 text-[#006ac3]" />
                        </a>
                    </li>
                    <li className="mb-2.5">
                        <a href="#" className="flex items-center justify-between gap-3 text-[#006ac3] no-underline text-[0.9rem] py-2 hover:text-[#005a9f] hover:underline">
                            <span className="flex-1">Maintenance to affect Avion Rewards</span>
                            <PopupIcon className="w-4 h-4 shrink-0 text-[#006ac3]" />
                        </a>
                    </li>
                </ul>
            </section>

            {/* Other Online Services Link */}
            <div className="relative mt-0 pt-0 border-t-0">
                <div className="mx-[-20px] py-4 px-5">
                    <div className="h-px bg-[#eeeeee]"></div>
                </div>
                <a href="#" className="flex items-center justify-between gap-3 text-[#006ac3] no-underline text-[0.95rem] font-normal py-3 hover:text-[#005a9f]">
                    Other Online Services
                    <MenuIcon className="w-4 h-4 shrink-0" />
                </a>
            </div>
        </div>
    );
};

// --- RBC Footer ---
export const RBCFooter = () => {
    return (
        <div className="w-full shrink-0 bg-white flex justify-center items-start">
            <footer className="w-full max-w-[600px] md:max-w-[400px] lg:max-w-[430px] flex flex-col p-5 md:p-[30px_20px]">
                <div className="w-full flex flex-col">
                    <div className="mx-[-20px] mb-[15px] md:mb-[15px]">
                        <div className="h-px bg-[#eeeeee]"></div>
                    </div>
                    <div className="text-[0.85rem] text-[#666666] m-[15px_0_5px_0]">
                        <span>RBC Online Banking is provided by Royal Bank of Canada.</span>
                    </div>
                    <div className="text-[0.85rem] text-[#666666] m-[0_0_10px_0]">
                        <span>Royal Bank of Canada Website, © 1995-{new Date().getFullYear()}</span>
                    </div>
                    <div className="flex flex-wrap justify-start gap-[15px] p-0 box-border">
                        <a href="#" className="inline-flex items-center gap-1 text-[#006ac3] no-underline text-[0.85rem] transition-colors hover:text-[#005a9f] hover:underline">
                            Legal
                            <ExternalLinkIcon className="w-3 h-3 shrink-0" />
                        </a>
                        <a href="#" className="inline-flex items-center gap-1 text-[#006ac3] no-underline text-[0.85rem] transition-colors hover:text-[#005a9f] hover:underline">
                            Accessibility
                            <ExternalLinkIcon className="w-3 h-3 shrink-0" />
                        </a>
                        <a href="#" className="inline-flex items-center gap-1 text-[#006ac3] no-underline text-[0.85rem] transition-colors hover:text-[#005a9f] hover:underline">
                            Privacy & Security
                            <ExternalLinkIcon className="w-3 h-3 shrink-0" />
                        </a>
                    </div>
                    <div className="mt-[15px]">
                        <a href="#" className="inline-flex items-center gap-1 text-[#006ac3] no-underline text-[0.85rem] transition-colors hover:text-[#005a9f] hover:underline">
                            Advertising & Cookies
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};
