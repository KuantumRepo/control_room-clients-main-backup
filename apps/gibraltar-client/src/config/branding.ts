/**
 * Branding Configuration
 *
 * This file defines company-specific branding for the white-label customer verification SPA.
 * Each company can have different logos, colors, and typography.
 *
 * The NEXT_PUBLIC_BRAND_ID environment variable determines which brand configuration is used.
 */

export interface BrandConfig {
  companyId: string;
  companyName: string;
  logo: string;
  colors: {
    primary: string;      // Primary brand color (hex)
    secondary: string;    // Secondary brand color (hex)
    accent: string;       // Accent color (hex)
  };
  fonts?: {
    sans?: string;        // Custom sans font family
    mono?: string;        // Custom monospace font family
  };
}

/**
 * Brand configurations for all supported companies
 */
const brands: Record<string, BrandConfig> = {
  gibraltar: {
    companyId: 'gibraltar',
    companyName: 'Gibraltar International Bank Ltd.',
    logo: '/logo.svg',
    colors: {
      primary: '#bb282e',    // Primary red
      secondary: '#A32025',  // Secondary red
      accent: '#0076a8',     // Primary blue
    },
  },
};

/**
 * Get the current brand configuration based on environment variable
 * Falls back to 'gibraltar' if NEXT_PUBLIC_BRAND_ID is not set or invalid
 */
const BRAND_ID = process.env.NEXT_PUBLIC_BRAND_ID || 'gibraltar';
export const currentBrand: BrandConfig = brands[BRAND_ID] || brands.gibraltar;

/**
 * CSS variables that will be injected into the theme
 * These are used in globals.css to customize Tailwind colors
 */
export const brandCSSVariables = {
  '--color-primary': currentBrand.colors.primary,
  '--color-secondary': currentBrand.colors.secondary,
  '--color-accent': currentBrand.colors.accent,
} as const;

export default currentBrand;
