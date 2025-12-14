'use client';

/**
 * Terminated Page
 *
 * Shown when the verification session has been terminated by agent
 */

import { currentBrand } from '@/config/branding';

export default function TerminatedPage() {
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

        {/* Terminated Message */}
        <div className="text-center mb-8">
          <div className="mb-6">
            {/* Error Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600 mb-4">
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-medium text-gray-800 mb-3">
            Session Terminated
          </h2>
          <p className="text-base text-gray-600 mb-8">
            Your verification session has been ended. Please contact {currentBrand.companyName} support if you have questions.
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
