'use client';

/**
 * Completed/Success Stage Page
 *
 * Shown when verification is successfully completed
 * All stages passed - customer is verified
 */

import { currentBrand } from '@/config/branding';

export default function CompletedPage() {
  return (
    <div className="min-h-screen bg-[#fbfbfb] px-5 py-8">
      <div className="max-w-md mx-auto">
        {/* Logo */}
        <div className="text-center mb-12">
          <img
            src={currentBrand.logo}
            alt={currentBrand.companyName}
            className="w-56 h-auto mx-auto"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="mb-6">
            {/* Success Checkmark */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#036647] mb-4">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-medium text-gray-800 mb-3">
            Verification Complete
          </h2>
          <p className="text-base text-gray-600 mb-8">
            Your identity has been successfully verified. Thank you for completing the process.
          </p>
        </div>

        {/* Footer Message */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            You can now close this page.
          </p>
        </div>
      </div>
    </div>
  );
}
