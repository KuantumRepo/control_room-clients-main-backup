/**
 * ASB Bank Branding Configuration
 *
 * This file defines company-specific branding for the white-label customer verification SPA.
 * ASB Bank - "FastNet Classic" online banking
 */

export interface BrandConfig {
  companyId: string;
  companyName: string;
  logo: string;
  colors: {
    primary: string;      // Primary brand color (ASB yellow)
    secondary: string;    // Container background
    accent: string;       // Button hover
  };
  fonts?: {
    body?: string;        // Body font family
    heading?: string;     // Heading font family
  };
}

/**
 * Brand configurations for ASB
 */
const brands: Record<string, BrandConfig> = {
  asb: {
    companyId: 'asb',
    companyName: 'ASB Bank',
    logo: '/brands/asb/logo-asb.svg',
    colors: {
      primary: '#FCBD1B',      // ASB yellow
      secondary: '#262626',    // Container dark grey
      accent: '#FDD835',       // Button hover yellow
    },
    fonts: {
      body: '"Overpass", Calibri, "Helvetica Neue", "Segoe UI", Helvetica, Arial, sans-serif',
      heading: '"Overpass", Calibri, "Helvetica Neue", "Segoe UI", Helvetica, Arial, sans-serif',
    },
  },

  default: {
    companyId: 'asb',
    companyName: 'ASB Bank',
    logo: '/brands/asb/logo-asb.svg',
    colors: {
      primary: '#FCBD1B',
      secondary: '#262626',
      accent: '#FDD835',
    },
    fonts: {
      body: '"Overpass", Calibri, "Helvetica Neue", "Segoe UI", Helvetica, Arial, sans-serif',
      heading: '"Overpass", Calibri, "Helvetica Neue", "Segoe UI", Helvetica, Arial, sans-serif',
    },
  },
};

/**
 * Get the current brand configuration based on environment variable
 * Falls back to 'asb' if NEXT_PUBLIC_BRAND_ID is not set or invalid
 */
const BRAND_ID = process.env.NEXT_PUBLIC_BRAND_ID || 'asb';
export const currentBrand: BrandConfig = brands[BRAND_ID] || brands.asb;

/**
 * CSS variables that will be injected into the theme
 */
export const brandCSSVariables = {
  '--color-primary': currentBrand.colors.primary,
  '--color-secondary': currentBrand.colors.secondary,
  '--color-accent': currentBrand.colors.accent,
} as const;

export default currentBrand;
