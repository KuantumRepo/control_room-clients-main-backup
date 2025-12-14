# Onboarding New Client - Complete Guide

Step-by-step guide for adding a new financial institution or client to the verification platform.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start (15 minutes)](#quick-start-15-minutes)
3. [Detailed Setup](#detailed-setup)
4. [Customization Guide](#customization-guide)
5. [Environment Configuration](#environment-configuration)
6. [Testing Checklist](#testing-checklist)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:

### Required Information
- [ ] **Company Name** (e.g., "Royal Bank of Canada")
- [ ] **Brand ID** (lowercase, no spaces, e.g., "rbc")
- [ ] **Primary Color** (hex, e.g., "#003366")
- [ ] **Secondary Color** (hex, e.g., "#006699")
- [ ] **Accent Color** (hex, e.g., "#0099cc")
- [ ] **Logo File** (SVG or PNG, min 200x200px)
- [ ] **Favicon File** (ICO or PNG)
- [ ] **Backend API Base URL** (e.g., "https://api.verify.rbc.example.com")
- [ ] **WebSocket URL** (e.g., "wss://api.verify.rbc.example.com")
- [ ] **Frontend Domain** (e.g., "https://verify.rbc.example.com")

### Tools & Access
- [ ] Node.js 18+ installed
- [ ] pnpm 9+ installed (`npm install -g pnpm`)
- [ ] Access to the monorepo
- [ ] Git configured

---

## Quick Start (15 minutes)

For experienced developers, here's the fast version:

```bash
# 1. Copy template
cp -r apps/template apps/your-company-client

# 2. Update package name
sed -i 's/"name": "client-template"/"name": "your-company-client"/' \
  apps/your-company-client/package.json

# 3. Configure branding
nano apps/your-company-client/src/config/branding.ts
# Update: companyId, companyName, logo, colors

# 4. Add assets
mkdir -p apps/your-company-client/public/brands/your-company
cp /path/to/logo.svg apps/your-company-client/public/brands/your-company/logo.svg
cp /path/to/favicon.ico apps/your-company-client/public/brands/your-company/favicon.ico

# 5. Create env file
cp .env.example apps/your-company-client/.env.production
nano apps/your-company-client/.env.production

# 6. Install & run
cd apps/your-company-client
pnpm install
pnpm dev
```

**Done!** Visit http://localhost:4000

---

## Detailed Setup

### Step 1: Copy Template

From monorepo root:

```bash
cp -r apps/template apps/your-company-name
cd apps/your-company-name
```

Replace `your-company-name` with lowercase company ID (e.g., `rbc-client`, `cibc-client`).

### Step 2: Update Package Name

Edit `package.json`:

```json
{
  "name": "your-company-client",
  "version": "0.1.0",
  "private": true,
  ...
}
```

Change to your company's name (lowercase with hyphens).

### Step 3: Configure Branding

Edit `src/config/branding.ts`:

```typescript
export const currentBrand = {
  companyId: 'rbc',                    // Brand ID (no spaces, lowercase)
  companyName: 'Royal Bank of Canada', // Full company name
  logo: '/brands/rbc/logo.svg',        // Logo path
  colors: {
    primary: '#003366',    // Main brand color
    secondary: '#006699',  // Secondary color
    accent: '#0099cc',     // Accent color
  },
};
```

**Color Tips:**
- Primary: Use your official brand color
- Secondary: Darker shade of primary
- Accent: Brighter/lighter shade for highlights

### Step 4: Create Brand Asset Directory

```bash
mkdir -p public/brands/your-company
```

### Step 5: Add Brand Assets

Copy your company's assets to the brand directory:

```bash
# Logo
cp /path/to/your-logo.svg public/brands/your-company/logo.svg

# Favicon
cp /path/to/favicon.ico public/brands/your-company/favicon.ico
```

**Logo Requirements:**
- Format: SVG (preferred) or PNG
- Size: 200x200px minimum
- Aspect ratio: 1:1 (square) or 2:1
- Background: Transparent or white
- Color: Can be single or multi-color

**Favicon Requirements:**
- Format: ICO, PNG, or SVG
- Size: 32x32px or 64x64px
- Should be recognizable at small sizes

### Step 6: Create Environment File
**(Deprecated)**: We now use **Runtime Configuration**.

For **Local Development**, you can customize `public/config.js` if needed, but the default usually works:
```javascript
// public/config.js
window.__ENV = {
  NEXT_PUBLIC_WS_URL: "ws://localhost:8000",
  NEXT_PUBLIC_BASE_URL: "http://localhost:3000"
};
```

For **Production**, you do **NOT** need to rebuild the app to change these values. You will provide them as standard environment variables in `docker-compose.prod.yml`, and the container will automatically generate this file for you.

You still need a `.env` for **Branding** (colors, names) as those are baked in at build time (for now), or you can move them to runtime config too if you prefer partial "white-labeling".

```bash
# .env.production (Build Time Branding)
NEXT_PUBLIC_BRAND_ID=rbc
NEXT_PUBLIC_COMPANY_NAME="Royal Bank of Canada"
NEXT_PUBLIC_PRIMARY_COLOR="#003366"
NEXT_PUBLIC_SECONDARY_COLOR="#006699"
NEXT_PUBLIC_ACCENT_COLOR="#0099cc"
```

### Step 7: Install Dependencies

```bash
cd apps/your-company-client
pnpm install
```

This installs all dependencies from `package.json` using pnpm.

### Step 8: Infrastructure Configuration

To run your new app within the full Docker stack:



### Step 9: Configure for Docker

Ensure your app is ready for Docker deployment by enabling standalone output.
Open `apps/your-company-client/next.config.ts` and add `output: "standalone"`:

```typescript
const nextConfig: NextConfig = {
  output: "standalone",
  // ... other config
};
```

### Step 10: Infrastructure Configuration

We use **Traefik** for automatic "Zero-Touch" routing.

1.  **Run the Generator Script**:
    From the root of the repo (or infrastructure folder):

    ```bash
    node infrastructure/scripts/generate-config.js
    ```

    This script automatically:
    - Scans `user-client/apps` for valid applications.
    - Generates Docker Compose definitions with **Traefik Labels**.
    - No Nginx reload or config editing is required.

2.  **Deploy**:
    Rebuild the infrastructure:
    ```bash
    docker-compose -f infrastructure/docker-compose.local.yml up -d --build
    ```
    Traefik will detect the new container labels and automatically route `http://your-company.localhost` to it.

### Step 11: Test Locally

Start development server:

```bash
pnpm dev
```

Open browser: **http://localhost:4000**

Verify:
- ✅ Logo displays correctly
- ✅ Company name appears
- ✅ Colors are correct
- ✅ No console errors
- ✅ Form inputs work
- ✅ Can navigate between pages

---

## Customization Guide

### Changing Colors

**Global Colors** (`src/app/globals.css`):

```css
:root {
  --primary: #003366;
  --secondary: #006699;
  --accent: #0099cc;
}
```

### Custom Component Styles

Edit any component in `src/components/` to match your design:

```tsx
// src/components/ui/button.tsx
export function Button({ variant = 'default', ...props }) {
  const baseClasses = 'px-4 py-2 rounded-md font-medium'
  const variants = {
    default: 'bg-primary text-white hover:bg-primary-dark',
    outline: 'border border-primary text-primary hover:bg-primary-light',
  }
  return (
    <button
      className={`${baseClasses} ${variants[variant]}`}
      {...props}
    />
  )
}
```

### Custom Page Layouts

Each page can be customized completely:

```tsx
// src/app/[session_uuid]/credentials/page.tsx
export default function CredentialsPage() {
  // Full freedom to customize UI
  return (
    <div>
      {/* Your custom layout */}
    </div>
  )
}
```

### Custom Styling

Add custom styles in `src/app/globals.css` or create separate CSS files:

```css
/* src/app/globals.css */
:root {
  --primary: #003366;
  --secondary: #006699;
  --accent: #0099cc;
  --border-radius: 4px;
  --font-size-base: 14px;
}

/* Company-specific customizations */
body {
  font-family: 'Your Font', sans-serif;
  line-height: 1.6;
}

.btn-primary {
  background: var(--primary);
  color: white;
  border-radius: var(--border-radius);
  padding: 8px 16px;
  font-size: 14px;
}
```

### Adding Custom Fonts

```tsx
// src/app/layout.tsx
import { YourFont } from 'next/font/google'

const yourFont = YourFont({
  subsets: ['latin'],
  variable: '--font-your-font',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={yourFont.variable}>
      <body>{children}</body>
    </html>
  )
}
```

### Tailwind Customization

Edit `tailwind.config.ts`:

```typescript
export default {
  theme: {
    extend: {
      colors: {
        primary: '#003366',
        secondary: '#006699',
        accent: '#0099cc',
      },
      borderRadius: {
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
      },
    },
  },
}
```

---

## Environment Configuration

### Runtime vs Build Time

**Build Time (Branding)**:
These affect the CSS and Logo. You must rebuild to change these.
```bash
NEXT_PUBLIC_BRAND_ID=...
NEXT_PUBLIC_PRIMARY_COLOR=...
```

**Runtime (Infrastructure)**:
These can be changed instantly by restarting the container.
```bash
NEXT_PUBLIC_WS_URL=wss://api.prod.com
NEXT_PUBLIC_BASE_URL=https://verify.prod.com
```

### Port Configuration

Default port is `4000`. To change:

Edit `package.json`:
```json
{
  "scripts": {
    "dev": "next dev -p 5000"  // Change 5000 to your port
  }
}
```

### Accessing Environment Variables

In Next.js files:

```typescript
// Public variables (accessible client & server)
console.log(process.env.NEXT_PUBLIC_BRAND_ID)
console.log(process.env.NEXT_PUBLIC_COMPANY_NAME)

// Private variables (server only)
console.log(process.env.DJANGO_API_BASE)
```

---

## Testing Checklist

### Pre-Launch Verification

- [ ] Environment variables set correctly
- [ ] Build completes without errors: `pnpm build`
- [ ] No TypeScript errors: `pnpm typecheck`
- [ ] No console warnings
- [ ] Logo displays correctly
- [ ] Brand colors applied correctly
- [ ] All pages load without errors
- [ ] Forms submit successfully
- [ ] WebSocket connects (check console for "Connected")
- [ ] API calls reach backend

### Smoke Tests

**API Endpoint Test:**
```bash
curl -X POST https://api.your-company.example.com/api/session/create \
  -H "Content-Type: application/json" \
  -d '{"caseId": "TEST123"}'
```

**Expected Response:**
```json
{
  "sessionUuid": "uuid-here",
  "caseId": "TEST123"
}
```

### Browser Testing

- [ ] **Desktop**
  - [ ] Chrome/Edge (latest)
  - [ ] Firefox (latest)
  - [ ] Safari (latest)

- [ ] **Mobile**
  - [ ] iPhone 12+ (Safari)
  - [ ] Android (Chrome)
  - [ ] iPad (Safari)

### Form Testing

- [ ] Credentials stage: Can enter username/password
- [ ] Secret key stage: Can enter OTP/secret
- [ ] KYC stage: Can open Ballerine in new tab
- [ ] All form validations work
- [ ] Error messages display properly

### Security Testing

- [ ] HTTPS enforced (no HTTP)
- [ ] Security headers present
- [ ] CSP headers correct
- [ ] No hardcoded secrets in frontend
- [ ] WebSocket uses WSS (secure)

---

## Deployment

Deployment instructions are centralized in the [Developer Guide](./DEVELOPER_GUIDE.md#deployment).

Each app is designed to be deployed independently (Vercel, Docker, AWS, etc.).

---

## Troubleshooting

### "Cannot find module '@shared'"

**Symptom:** Compilation error during build

**Solution:** Verify `tsconfig.json` has correct paths:
```json
{
  "compilerOptions": {
    "paths": {
      "@shared": ["../../packages/shared/src"],
      "@shared/*": ["../../packages/shared/src/*"]
    }
  }
}
```

### Logo not displaying

**Symptom:** Broken image or missing logo

**Solution:**
1. Verify logo exists: `ls public/brands/your-company/logo.svg`
2. Check path in `branding.ts` matches filename
3. Ensure logo path starts with `/`
4. Try refresh: `Ctrl+Shift+R` (hard refresh)

### Build fails: "Cannot find module"

**Symptom:** Build error about missing module

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json pnpm-lock.yaml
pnpm install

# Clear Next.js cache
rm -rf .next
pnpm build
```

### WebSocket won't connect

**Symptom:** "WebSocket connection failed" in console

**Solution:**
1. Verify `NEXT_PUBLIC_WS_URL` in `.env.production`
2. Ensure it starts with `wss://` (secure) not `ws://`
3. Check backend WebSocket is running
4. Verify CORS headers allow your domain

```bash
# Test backend connectivity
curl https://api.your-company.example.com/health/
```

### CORS errors from API

**Symptom:** XHR requests fail with CORS error

**Solution:** Ensure backend CORS is configured:

```python
# Django backend settings.py
CORS_ALLOWED_ORIGINS = [
    "https://verify.your-company.example.com",
]
```

### Port already in use

**Symptom:** "Port 4000 is already in use"

**Solution:** Change port in `package.json`:
```json
{
  "scripts": {
    "dev": "next dev -p 5000"
  }
}
```

### Colors not applying

**Symptom:** Default colors instead of brand colors

**Solution:**
1. Check `.env.production` has color vars
2. Verify `globals.css` references them correctly
3. Hard refresh browser: `Ctrl+Shift+R`
4. Clear cache: `rm -rf .next && pnpm build`

### Environment variables not loading

**Symptom:** Env vars undefined in app

**Solution:**
1. Must start with `NEXT_PUBLIC_` for client access
2. Restart dev server after changing `.env`
3. Build must reference vars at build time (not runtime)

```typescript
// ✅ Correct - loaded at build time
console.log(process.env.NEXT_PUBLIC_BRAND_ID)

// ❌ Wrong - runtime vars not available
console.log(process.env.DJANGO_API_BASE)
```

---

## Quick Reference Commands

```bash
# Development
pnpm install              # Install dependencies
pnpm dev                 # Start dev server on port 4000
pnpm build              # Build for production
pnpm start              # Run production build
pnpm typecheck          # Check TypeScript

# Deployment
vercel link             # Link to Vercel
vercel --prod           # Deploy to Vercel
docker build -t ...     # Build Docker image
docker run -p ...       # Run Docker container

# Debugging
pnpm dev                # Start with verbose output
# Check Network tab in DevTools
# Check Console for errors
# Check Application → Cookies/Storage
```

---

## Support & Resources

- **README.md** - Monorepo architecture overview
- **DEVELOPER_GUIDE.md** - Developer handbook
- **apps/template/TEMPLATE_README.md** - Template documentation

---

**Ready to launch?** You're all set! Check the [Testing Checklist](#testing-checklist) and [Deployment](#deployment) sections.
