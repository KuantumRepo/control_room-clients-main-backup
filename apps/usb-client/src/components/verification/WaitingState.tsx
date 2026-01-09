import { Loader2 } from 'lucide-react';

interface WaitingStateProps {
  message?: string;
  subtext?: string;
}

export function WaitingState({
  message = 'Verifying your information...',
  subtext = 'Please wait while our agent reviews your submission'
}: WaitingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center animate-in fade-in duration-500">
      <div className="relative w-12 h-12">
        <Loader2 className="w-full h-full text-[#0c2074] animate-spin" />
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        <h2 className="text-xl font-medium text-[#2e2e32]">
          {message}
        </h2>
        {subtext && (
          <p className="text-[#555] text-sm leading-relaxed">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}
