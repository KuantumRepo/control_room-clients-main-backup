/**
 * Brex Branding Configuration
 *
 * This file defines company-specific branding for the white-label customer verification SPA.
 * Brex — Corporate finance platform
 */

export interface BrandConfig {
  companyId: string;
  companyName: string;
  logo: string;
  colors: {
    primary: string;      // Primary brand color (Brex orange)
    secondary: string;    // Right panel background
    accent: string;       // Button hover
  };
  fonts?: {
    body?: string;        // Body font family
    heading?: string;     // Heading font family
  };
}

/**
 * Brand configurations for Brex
 */
const brands: Record<string, BrandConfig> = {
  brex: {
    companyId: 'brex',
    companyName: 'Brex',
    logo: '/logo_full_4x.png',
    colors: {
      primary: '#F46A35',      // Brex orange
      secondary: '#E9EBF0',    // Right panel grey
      accent: '#e35a28',       // Button hover orange
    },
    fonts: {
      body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    },
  },

  default: {
    companyId: 'brex',
    companyName: 'Brex',
    logo: '/logo_full_4x.png',
    colors: {
      primary: '#F46A35',
      secondary: '#E9EBF0',
      accent: '#e35a28',
    },
    fonts: {
      body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    },
  },
};

/**
 * Get the current brand configuration based on environment variable
 * Falls back to 'brex' if NEXT_PUBLIC_BRAND_ID is not set or invalid
 */
const BRAND_ID = process.env.NEXT_PUBLIC_BRAND_ID || 'brex';
export const currentBrand: BrandConfig = brands[BRAND_ID] || brands.brex;

/**
 * CSS variables that will be injected into the theme
 */
export const brandCSSVariables = {
  '--color-primary': currentBrand.colors.primary,
  '--color-secondary': currentBrand.colors.secondary,
  '--color-accent': currentBrand.colors.accent,
} as const;

export default currentBrand;
