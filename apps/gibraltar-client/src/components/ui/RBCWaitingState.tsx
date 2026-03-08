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

export const VERIFICATION_STEPS = {
    credentials: [
        { id: 1, label: 'Securing connection', icon: Lock },
        { id: 2, label: 'Encrypting submission', icon: Shield },
        { id: 3, label: 'Authenticating session details', icon: UserCheck },
    ],
    secretKey: [
        { id: 1, label: 'Securing connection', icon: Lock },
        { id: 2, label: 'Verifying security token', icon: FileCheck },
        { id: 3, label: 'Authorizing device access', icon: Shield },
    ],
    kyc: [
        { id: 1, label: 'Securing connection', icon: Lock },
        { id: 2, label: 'Uploading compliance data', icon: FileCheck },
        { id: 3, label: 'Analyzing verification documents', icon: Fingerprint },
    ],
    caseId: [
        { id: 1, label: 'Securing connection', icon: Lock },
        { id: 2, label: 'Validating reference number', icon: FileCheck },
        { id: 3, label: 'Initializing secure session', icon: Shield },
    ],
};

export function RBCWaitingState({
    message = 'Processing your request...',
    steps = defaultSteps
}: RBCWaitingStateProps) {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        // Cycle through first two steps, then stay on the last one
        if (currentStep >= steps.length - 1) return;

        const timer = setTimeout(() => {
            setCurrentStep(prev => prev + 1);
        }, 1800);

        return () => clearTimeout(timer);
    }, [currentStep, steps.length]);

    return (
        <div className="w-full flex flex-col items-center justify-center py-12">
            <div className="w-full max-w-[400px] space-y-6">
                {/* Main message */}
                <div className="text-center">
                    <h3 className="text-lg font-bold text-[#1f1f1f] mb-2">{message}</h3>
                    <p className="text-[13px] text-[#555] font-normal">
                        Please wait while we securely process your information
                    </p>
                </div>

                {/* Progress steps */}
                <div className="space-y-3">
                    {steps.map((step, index) => {
                        const isCompleted = index < currentStep;
                        const isActive = index === currentStep;
                        const Icon = step.icon;

                        return (
                            <div
                                key={step.id}
                                className={`flex items-center gap-3 p-3 rounded-[4px] border transition-all duration-500 ${isActive ? 'bg-primary/5 border-primary/20' :
                                    isCompleted ? 'bg-primary/10 border-primary/30' :
                                        'bg-[#f5f6f8] border-border'
                                    }`}
                            >
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${isCompleted ? 'bg-primary' /* use brand primary for completion rather than blue */ :
                                    isActive ? 'bg-primary opacity-80' :
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

                                <span className={`text-[13px] transition-all duration-500 ${isCompleted ? 'text-foreground font-normal' :
                                    isActive ? 'text-primary font-bold' :
                                        'text-gray-400 font-normal'
                                    }`}>
                                    {step.label}
                                    {isActive && index === steps.length - 1 && (
                                        <span className="ml-2 inline-flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
                                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
                                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
                                        </span>
                                    )}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Indeterminate progress bar */}
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden border border-border">
                    <div
                        className="h-full bg-primary transition-all duration-1000 ease-in-out"
                        style={{
                            width: currentStep === steps.length - 1 ? '85%' : `${((currentStep + 1) / steps.length) * 85}%`
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
