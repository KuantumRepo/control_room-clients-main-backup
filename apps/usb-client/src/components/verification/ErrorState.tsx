import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  subtext?: string;
  onRetry?: () => void;
  showRetryButton?: boolean;
}

export function ErrorState({
  message = 'Unable to proceed at this time',
  subtext = 'Please wait for further instructions from our agent',
  onRetry,
  showRetryButton = false,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center animate-in fade-in duration-500">
      <div className="p-3 bg-red-50 rounded-full">
        <AlertCircle className="w-8 h-8 text-[#d42e12]" />
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

      {showRetryButton && onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-secondary mt-4"
          type="button"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
