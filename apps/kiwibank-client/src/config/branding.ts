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
  kiwibank: {
    companyId: 'kiwibank',
    companyName: 'Kiwibank',
    logo: '/logo.png',
    colors: {
      primary: '#000000',    // Black header
      secondary: '#00b2a9',  // Teal button
      accent: '#f2f2f2',     // Light grey background
    },
    fonts: {
      sans: 'Geograph, sans-serif',
    },
  },

  default: {
    companyId: 'kiwibank',
    companyName: 'Kiwibank',
    logo: '/logo.png',
    colors: {
      primary: '#000000',
      secondary: '#00b2a9',
      accent: '#f2f2f2',
    },
    fonts: {
      sans: 'Geograph, sans-serif',
    },
  },

  // Future companies can be added here
  // rbc: { ... },
  // cibc: { ... },
};

/**
 * Get the current brand configuration based on environment variable
 * Falls back to 'default' if NEXT_PUBLIC_BRAND_ID is not set or invalid
 */
const BRAND_ID = process.env.NEXT_PUBLIC_BRAND_ID || 'kiwibank';
export const currentBrand: BrandConfig = brands[BRAND_ID] || brands.kiwibank;

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
