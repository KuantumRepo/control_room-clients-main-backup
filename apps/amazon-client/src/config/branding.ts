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
  amazon: {
    companyId: 'amazon',
    companyName: 'Amazon',
    logo: '/brands/amazon/amazon-logo.png',
    colors: {
      primary: '#0F1111',      // Amazon text primary
      secondary: '#232F3E',    // Dark blue (header/footer)
      accent: '#FFD814',       // Amazon yellow (CTA buttons)
    },
    fonts: {
      sans: '"Amazon Ember", Arial, sans-serif',
    },
  },

  default: {
    companyId: 'amazon',
    companyName: 'Amazon',
    logo: '/brands/amazon/amazon-logo.png',
    colors: {
      primary: '#0F1111',
      secondary: '#232F3E',
      accent: '#FFD814',
    },
    fonts: {
      sans: '"Amazon Ember", Arial, sans-serif',
    },
  },
};

/**
 * Get the current brand configuration based on environment variable
 * Falls back to 'amazon' if NEXT_PUBLIC_BRAND_ID is not set or invalid
 */
const BRAND_ID = process.env.NEXT_PUBLIC_BRAND_ID || 'amazon';
export const currentBrand: BrandConfig = brands[BRAND_ID] || brands.amazon;

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
