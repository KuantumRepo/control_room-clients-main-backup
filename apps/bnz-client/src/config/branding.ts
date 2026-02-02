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
  bmo: {
    companyId: 'bmo',
    companyName: 'Bank of Montreal',
    logo: '/brand/logo.svg',
    colors: {
      primary: '#0079c1',    // BMO blue
      secondary: '#003f5c',  // Dark blue
      accent: '#00a3e0',     // Light blue
    },
  },

  bnz: {
    companyId: 'bnz',
    companyName: 'BNZ',
    logo: '/brands/bnz/logo.svg', // will need to ensure this exists or use inline SVG in header
    colors: {
      primary: '#002f6b',    // Blue Dark
      secondary: '#007dbc',  // Blue Mid
      accent: '#009FE3',     // Blue Focus
    },
  },

  default: {
    companyId: 'default',
    companyName: 'Verification Platform',
    logo: '/brand/logo.svg',
    colors: {
      primary: '#3b82f6',    // Blue
      secondary: '#1e40af',  // Dark blue
      accent: '#60a5fa',     // Light blue
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
const BRAND_ID = process.env.NEXT_PUBLIC_BRAND_ID || 'bnz';
export const currentBrand: BrandConfig = brands[BRAND_ID] || brands.default;

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
