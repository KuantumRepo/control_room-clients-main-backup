import React from 'react';

// --- Gibraltar Input ---
interface RBCInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    showLockIcon?: boolean;
}

export const RBCInput = React.forwardRef<HTMLInputElement, RBCInputProps>(
    ({ label, showLockIcon, className, ...props }, ref) => {
        return (
            <div className="flex flex-col mb-[30px]">
                <label className="text-[13px] text-[#555] -mb-[5px] z-[1] font-normal" htmlFor={props.id}>
                    {label}
                </label>
                <div className="relative flex items-end">
                    <input
                        ref={ref}
                        className={`text-[14px] py-[4px] border-0 border-b border-border bg-transparent outline-none transition-colors duration-200 w-full focus:border-b-ring focus:ring-0 ${showLockIcon ? 'pr-[30px]' : ''} ${className || ''}`}
                        {...props}
                    />
                    {showLockIcon && (
                        <span className="absolute right-0 bottom-0 pb-[4px] cursor-pointer">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="#0076a8">
                                <path d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z" />
                            </svg>
                        </span>
                    )}
                </div>
            </div>
        );
    }
);
RBCInput.displayName = 'RBCInput';

// --- Gibraltar Button ---
interface RBCButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export const RBCButton = ({ children, className, ...props }: RBCButtonProps) => {
    return (
        <button
            className={`w-full lg:w-[150px] bg-primary text-white text-[13px] font-bold rounded-[4px] py-[10px] text-center border-none transition-colors duration-200 hover:bg-secondary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className || ''}`}
            {...props}
        >
            {children}
        </button>
    );
};

// --- Gibraltar Checkbox (Inferred styled for links/options) ---
interface RBCCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: React.ReactNode;
}

export const RBCCheckbox = React.forwardRef<HTMLInputElement, RBCCheckboxProps>(
    ({ label, className, ...props }, ref) => {
        return (
            <div className="my-[15px] outline-none">
                <label className="flex items-start cursor-pointer select-none gap-2 group" htmlFor={props.id}>
                    <input
                        type="checkbox"
                        ref={ref}
                        className={`mt-[2px] w-[14px] h-[14px] accent-primary cursor-pointer border-border focus:ring-ring ${className || ''}`}
                        {...props}
                    />
                    <div className="text-[13px] font-normal text-[#555] leading-snug">
                        {label}
                    </div>
                </label>
            </div>
        );
    }
);
RBCCheckbox.displayName = 'RBCCheckbox';

// --- Nullified Service Notices & Footer (Handled at Layout Level) ---
export const ServiceNotices = () => null;
export const RBCFooter = () => null;
