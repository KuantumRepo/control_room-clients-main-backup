# Developer Guide - Monorepo Development Handbook

Complete guide for developers working in the verification platform monorepo.

---

## Table of Contents

1. [Monorepo Architecture](#monorepo-architecture)
2. [Project Structure](#project-structure)
3. [Development Workflow](#development-workflow)
4. [Working with @shared](#working-with-shared)
5. [Code Organization](#code-organization)
6. [Common Recipes](#common-recipes)
7. [Debugging Guide](#debugging-guide)
8. [Testing Strategy](#testing-strategy)
9. [Git & Commits](#git--commits)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)
12. [Best Practices](#best-practices)

---

## Monorepo Architecture

### What is a Monorepo?

A **monorepo** is a single git repository containing multiple packages/applications:

```
verification-platform/
├── apps/              ← Multiple company apps
│   ├── kcu-client/    ← KCU implementation
│   ├── rbc-client/    ← To be added
│   └── template/      ← Template for new companies
├── packages/          ← Shared code used by all apps
│   └── shared/        ← Business logic (API, WebSocket, state)
└── pnpm-workspace.yaml ← Workspace config
```

### Why Monorepo?

✅ **Shared Business Logic** - No code duplication
✅ **Unified Dependencies** - All packages use same versions
✅ **Atomic Changes** - Change API + UI in one commit
✅ **Easier Refactoring** - Refactor shared code affects all apps
✅ **Fast Onboarding** - Copy template for new companies

### How It Works

Each company has:
1. **Own UI** (`src/components/`, `src/app/`, `src/styles/`)
2. **Own branding** (`src/config/branding.ts`)
3. **Own environment** (`.env.production`)
4. **Shared business logic** (imported from `@shared`)

```
┌─────────────────────────────────┐
│   Your Company UI & Branding    │
│  (apps/your-company-client)     │
│                                 │
│  ✓ Custom components            │
│  ✓ Custom pages                 │
│  ✓ Custom styling               │
└────────────┬────────────────────┘
             │ imports
             ↓
┌─────────────────────────────────┐
│   Shared Business Logic (@shared)│
│  (packages/shared)              │
│                                 │
│  ✓ Session management           │
│  ✓ WebSocket client             │
│  ✓ Analytics tracking           │
│  ✓ API communication            │
└─────────────────────────────────┘
```

---

## Project Structure

### Complete Monorepo Structure

```
verification-platform/
├── apps/
│   ├── kcu-client/              ← KCU's app
│   │   ├── src/
│   │   │   ├── app/             ← Pages (Next.js)
│   │   │   │   ├── page.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── globals.css
│   │   │   │   ├── api/         ← API routes
│   │   │   │   └── [session_uuid]/  ← Dynamic routes
│   │   │   ├── components/      ← React components
│   │   │   │   ├── ui/          ← UI primitives (Radix)
│   │   │   │   ├── providers/   ← Context providers
│   │   │   │   └── verification/  ← Domain components
│   │   │   ├── config/          ← Configuration
│   │   │   │   └── branding.ts
│   │   │   └── styles/          ← Additional styles
│   │   ├── public/              ← Static assets
│   │   │   └── brands/
│   │   │       └── kcu/         ← Logo, favicon
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── next.config.ts
│   │   └── tailwind.config.ts
│   │
│   ├── template/                ← Copy this for new companies
│   │   ├── src/
│   │   ├── public/
│   │   ├── TEMPLATE_README.md
│   │   └── package.json
│   │
│   └── rbc-client/              ← Another company
│       └── (same structure as kcu-client)
│
├── packages/
│   └── shared/                  ← Shared code
│       ├── src/
│       │   ├── stores/
│       │   │   └── sessionStore.ts  ← Session state (Zustand)
│       │   ├── ws/
│       │   │   ├── socket.ts        ← WebSocket client
│       │   │   └── events.ts        ← Event types
│       │   ├── types/
│       │   │   └── ws.ts            ← WebSocket types
│       │   ├── tracking/
│       │   │   ├── analytics.ts     ← Analytics
│       │   │   └── device.ts        ← Device fingerprint
│       │   ├── utils.ts             ← Utilities (cn)
│       │   └── index.ts             ← Main exports
│       ├── package.json
│       └── tsconfig.json
│
├── README.md                    ← Monorepo overview
├── ONBOARDING_NEW_CLIENT.md    ← Client setup guide
├── DEVELOPER_GUIDE.md          ← This file

├── pnpm-workspace.yaml         ← Workspace config
├── tsconfig.json               ← Root TypeScript config
└── package.json                ← Root package.json
```

### What Lives Where

| Code | Location | Shared? | Notes |
|------|----------|---------|-------|
| Session state | `packages/shared/stores/` | ✅ Yes | All companies use same state |
| WebSocket | `packages/shared/ws/` | ✅ Yes | All companies connect same way |
| UI Components | `apps/*/src/components/` | ❌ No | Each company has own UI |
| Pages | `apps/*/src/app/` | ❌ No | Each company custom routes |
| Branding | `apps/*/src/config/` | ❌ No | Colors, logo, company name |
| Styling | `apps/*/src/app/globals.css` | ❌ No | Company-specific styles |
| Types | `packages/shared/types/` | ✅ Yes | Shared WebSocket types |

---

## Development Workflow

### Daily Development Workflow

#### 1. Get Latest Code

```bash
# From monorepo root
git pull origin main
pnpm install  # Update dependencies if needed
```

#### 2. Start Developing

**If working on your company's app:**
```bash
cd apps/your-company-client
pnpm dev
```

Visit http://localhost:4000 (or configured port)

**If working on shared code:**
```bash
# Option A: Work directly
cd packages/shared
# Edit files, changes hot-reload in all apps

# Option B: Develop in app, move to shared later
cd apps/your-company-client
# Write code, refactor to @shared later
```

#### 3. Make Changes

Edit files in your editor. Next.js hot-reloads automatically.

```typescript
// src/components/MyComponent.tsx
'use client'

import { useSessionStore } from '@shared'

export function MyComponent() {
  const { sessionUuid } = useSessionStore()
  return <div>{sessionUuid}</div>
}
```

#### 4. Test Changes

```bash
pnpm typecheck      # Check TypeScript
pnpm dev           # Already running with hot-reload
# Test manually in browser
```

#### 5. Commit & Push

```bash
git add .
git commit -m "feat: add custom component"
git push origin feature-branch
```

#### 6. Create Pull Request

Document changes, request review.

---

## Working with @shared

### Understanding @shared

`@shared` is the **business logic layer** shared by all companies.

**Do import from @shared:**
```typescript
import { useSessionStore, getSocketClient, SessionTracker } from '@shared'
```

**Don't import UI from @shared:**
```typescript
// ❌ Wrong - UI should be per-company
import { Button } from '@shared/components/button'

// ✅ Correct - Import business logic
import { useSession } from '@shared'
```

### What's in @shared

```typescript
// Session Management
import { useSessionStore, useSession, submitStageData } from '@shared'
// Usage: Zustand store for session state

// WebSocket
import { getSocketClient, resetSocketClient, SocketClient } from '@shared'
// Usage: Real-time communication with backend

// Types
import type { CommandMessage, WebSocketMessage } from '@shared'
// Usage: TypeScript definitions

// Analytics
import { SessionTracker } from '@shared'
// Usage: Track user activity

// Device
import { getDeviceFingerprint, compareFingerprints } from '@shared'
// Usage: Fraud detection

// Utils
import { cn } from '@shared'
// Usage: Merge CSS classes
```

### Importing from @shared

```typescript
// ✅ Good - Import specific items
import {
  useSessionStore,
  getSocketClient,
  SessionTracker
} from '@shared'

// ✅ Good - Import types separately
import type { CommandMessage } from '@shared'

// ❌ Bad - Don't import like this
import * as shared from '@shared'
shared.useSessionStore()  // Verbose
```

### When to Add to @shared

Add to `@shared` if code is:
- ✅ Used by multiple apps
- ✅ Business logic (not UI)
- ✅ API communication, state management, utilities
- ✅ Shared types or constants

Keep in app if:
- ❌ Only used in one app
- ❌ UI-specific (components, pages, styling)
- ❌ Company-specific configuration
- ❌ Custom domain logic

### Adding Code to @shared

1. **Create in app first** (develop faster)
   ```typescript
   // apps/your-company-client/src/lib/customTracker.ts
   export function trackCustomEvent() { ... }
   ```

2. **When ready to share**, move to shared:
   ```typescript
   // packages/shared/src/tracking/customTracker.ts
   export function trackCustomEvent() { ... }
   ```

3. **Update imports** in all apps:
   ```typescript
   // Before
   import { trackCustomEvent } from '@/lib/customTracker'

   // After
   import { trackCustomEvent } from '@shared'
   ```

4. **Export from index.ts**:
   ```typescript
   // packages/shared/src/index.ts
   export { trackCustomEvent } from './tracking/customTracker'
   ```

---

## Code Organization

### Component Structure

```typescript
// src/components/MyComponent.tsx
'use client'  // If using hooks

import { useCallback, useState } from 'react'
import { useSessionStore } from '@shared'  // Import business logic
import { Button } from '@/components/ui/button'  // Import local UI
import styles from './MyComponent.module.css'  // Optional: Local styles

interface MyComponentProps {
  title: string
  onSubmit: (data: FormData) => void
}

export function MyComponent({ title, onSubmit }: MyComponentProps) {
  const { sessionUuid } = useSessionStore()
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = useCallback(() => {
    setIsLoading(true)
    onSubmit({ sessionUuid })
    setIsLoading(false)
  }, [sessionUuid, onSubmit])

  return (
    <div>
      <h2>{title}</h2>
      <Button onClick={handleClick} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Click me'}
      </Button>
    </div>
  )
}
```

### Page Structure

```typescript
// src/app/[session_uuid]/credentials/page.tsx
'use client'

import { useParams } from 'next/navigation'
import { useSessionStore } from '@shared'
import { CredentialsForm } from '@/components/CredentialsForm'

export default function CredentialsPage() {
  const params = useParams()
  const sessionUuid = params.session_uuid as string
  const { caseId } = useSessionStore()

  if (!caseId) {
    return <div>No session found</div>
  }

  return (
    <div>
      <h1>Enter Credentials</h1>
      <CredentialsForm sessionUuid={sessionUuid} caseId={caseId} />
    </div>
  )
}
```

### File Naming

```
// Components: PascalCase
src/components/Button.tsx
src/components/CredentialsForm.tsx
src/components/providers/SessionProvider.tsx

// Pages: lowercase with hyphens
src/app/page.tsx
src/app/[session_uuid]/credentials/page.tsx
src/app/api/submit-credentials/route.ts

// Utilities: camelCase
src/lib/utils.ts
src/lib/helpers.ts

// Styles: lowercase with hyphens
src/styles/globals.css
src/styles/buttons.css

// Config: camelCase
src/config/branding.ts
```

---

## Common Recipes

### Recipe 1: Using Session State

```typescript
'use client'

import { useSessionStore } from '@shared'

export function SessionDisplay() {
  const { sessionUuid, stage, status, caseId } = useSessionStore()

  return (
    <div>
      <p>Session: {sessionUuid}</p>
      <p>Stage: {stage}</p>
      <p>Status: {status}</p>
      <p>Case: {caseId}</p>
    </div>
  )
}
```

### Recipe 2: WebSocket Communication

```typescript
'use client'

import { useEffect } from 'react'
import { getSocketClient } from '@shared'

export function MyComponent() {
  useEffect(() => {
    const socket = getSocketClient('uuid-here')

    // Listen for commands
    const unsubscribe = socket.subscribe('command', (msg) => {
      console.log('Received command:', msg)
    })

    // Send message
    socket.send({
      type: 'user_activity',
      activity: 'page_view',
    })

    return () => unsubscribe()
  }, [])

  return <div>WebSocket example</div>
}
```

### Recipe 3: Form Submission

```typescript
'use client'

import { useSessionStore, submitStageData } from '@shared'
import { useState } from 'react'

export function CredentialsForm() {
  const { sessionUuid, caseId } = useSessionStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const success = await submitStageData(
      sessionUuid,
      'credentials',
      { username, password },
      caseId,
      () => setLoading(true),
      () => setLoading(false)
    )

    if (success) {
      console.log('Credentials submitted')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
```

### Recipe 4: Using Environment Variables

```typescript
// src/config/api.ts
export const API_CONFIG = {
  baseUrl: process.env.DJANGO_API_BASE || 'http://localhost:8000',
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000',
  brandId: process.env.NEXT_PUBLIC_BRAND_ID || 'default',
}

// src/components/MyComponent.tsx
import { API_CONFIG } from '@/config/api'

export function MyComponent() {
  return <div>API: {API_CONFIG.baseUrl}</div>
}
```

### Recipe 5: Conditional Rendering by Company

```typescript
'use client'

import { useEffect, useState } from 'react'
import { currentBrand } from '@/config/branding'

export function CompanySpecificUI() {
  const isBMO = currentBrand.companyId === 'bmo'
  const isRBC = currentBrand.companyId === 'rbc'

  return (
    <div>
      {isBMO && <BMOSpecificUI />}
      {isRBC && <RBCSpecificUI />}
      <SharedUI />
    </div>
  )
}
```

### Recipe 6: Custom Styling

```typescript
'use client'

import { currentBrand } from '@/config/branding'

export function BrandedButton() {
  const style = {
    backgroundColor: currentBrand.colors.primary,
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
  }

  return <button style={style}>Click me</button>
}
```

---

## Debugging Guide

### 1. Browser DevTools

**Console Tab:**
```javascript
// Check session state
window.localStorage.getItem('session')

// Check environment variables
process.env.NEXT_PUBLIC_BRAND_ID
```

**Network Tab:**
- Monitor API calls
- Check request/response headers
- Verify HTTPS/WSS
- Look for failed requests (4xx, 5xx)

**Application Tab:**
- Check localStorage
- Check cookies
- Check IndexedDB

### 2. VS Code Debugging

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js Debug",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

Then: Press `F5` or `Run → Start Debugging`

### 3. TypeScript Errors

```bash
# Check all TypeScript errors
pnpm typecheck

# Get detailed output
pnpm typecheck 2>&1 | head -50
```

### 4. Common Debug Scenarios

**Issue: State not updating**
```typescript
// ❌ Wrong - directly mutate
useSessionStore.setState({ sessionUuid: 'xyz' })

// ✅ Correct - Zustand handles it
const { setSession } = useSessionStore()
setSession('xyz')
```

**Issue: @shared import not working**
```typescript
// Check tsconfig paths
cat tsconfig.json | grep -A 5 paths

// Verify the file exists
ls packages/shared/src/index.ts
```

**Issue: Hot-reload not working**
```bash
# Restart dev server
# Press Ctrl+C to stop
pnpm dev  # Restart
```

---

## Testing Strategy

### Type Checking

```bash
# Run TypeScript check (no output = success)
pnpm typecheck

# Watch mode
pnpm typecheck --watch
```

### Manual Testing Checklist

- [ ] All pages load
- [ ] Forms submit correctly
- [ ] WebSocket connects
- [ ] API calls succeed
- [ ] Error handling works
- [ ] Mobile responsive
- [ ] No console errors

### Testing Commands

```bash
# Development
pnpm dev                # Hot-reload during development

# Type checking
pnpm typecheck         # TypeScript validation

# Building
pnpm build            # Production build
pnpm start            # Run production build

# Linting
pnpm lint             # ESLint (if configured)
```

---

## Git & Commits

### Branch Strategy

```
main
├── feature/company-customization
├── fix/websocket-reconnect
└── docs/update-readme
```

**Branch naming:**
- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation
- `chore/` - Maintenance

### Commit Messages

```bash
# Feature
git commit -m "feat: add custom button styling for RBC"

# Fix
git commit -m "fix: handle WebSocket reconnection timeout"

# Documentation
git commit -m "docs: update developer guide"

# Refactoring
git commit -m "refactor: extract session logic to hook"

# Multiple line commit
git commit -m "feat: implement custom analytics

- Add tracking for form submissions
- Send device fingerprint on session start
- Log user activity events"
```

**Format:** `<type>: <description>`

### Pull Request Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: my awesome feature"

# Push to GitHub
git push origin feature/my-feature

# Create Pull Request on GitHub
# → Get review
# → Make changes if needed
# → Merge to main
```

---

## Deployment

### Building for Production

```bash
cd apps/your-company-client

# Create production build
pnpm build

# Test production build locally
pnpm start
```

### Environment Variables for Production

Create `.env.production` in app directory:

```bash
NEXT_PUBLIC_BRAND_ID=rbc
NEXT_PUBLIC_COMPANY_NAME="Royal Bank of Canada"
DJANGO_API_BASE=https://api.verify.rbc.example.com
NEXT_PUBLIC_WS_URL=wss://api.verify.rbc.example.com
NEXT_PUBLIC_BASE_URL=https://verify.rbc.example.com
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_DEVICE_FINGERPRINT=true
```

### Deployment Checklist

- [ ] All tests passing
- [ ] TypeScript no errors
- [ ] Environment variables set
- [ ] Build succeeds
- [ ] No console errors
- [ ] API endpoints correct
- [ ] HTTPS enabled
- [ ] Security headers configured

### Deploying to Vercel

```bash
cd apps/your-company-client

# Link to Vercel project
vercel link

# Set environment variables
vercel env add NEXT_PUBLIC_BRAND_ID rbc production
# ... add all other vars ...

# Deploy to production
vercel --prod
```

### Deploying to Docker

```bash
cd apps/your-company-client

# Build image
docker build -t your-company-verify:latest .

# Run container
docker run -p 3000:3000 your-company-verify:latest
```

### Deploying to AWS

```bash
# Build Docker image
docker build -t your-company-verify:latest .

# Push to ECR
aws ecr get-login-password | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
docker tag your-company-verify:latest <account>.dkr.ecr.us-east-1.amazonaws.com/your-company-verify:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/your-company-verify:latest

# Deploy with ECS/Fargate
# ... use AWS CloudFormation or Terraform ...
```

---

## Troubleshooting

### "Module not found" Error

```bash
# Clear node_modules
rm -rf node_modules pnpm-lock.yaml

# Reinstall
pnpm install
```

### "Cannot find @shared"

```bash
# Check import path
grep -r "@shared" src/

# Verify tsconfig.json
cat tsconfig.json | grep -A 5 "@shared"

# Should be:
# "@shared": ["../../packages/shared/src"]
```

### Dev server won't start

```bash
# Check if port is in use
lsof -i :4000

# Kill process if needed
kill -9 <PID>

# Restart
pnpm dev
```

### Build fails with "Cannot find module"

```bash
# Verify module exists
ls packages/shared/src/<path-to-module>

# Check index.ts exports
cat packages/shared/src/index.ts | grep <module-name>

# If not exported, add it
# Update packages/shared/src/index.ts
```

### Hot-reload not working

```bash
# Restart dev server
# Press Ctrl+C
pnpm dev

# Clear Next.js cache
rm -rf .next
pnpm dev
```

---

## Best Practices

### ✅ Do

- ✅ Keep `@shared` for business logic only
- ✅ Use local components for UI
- ✅ Keep each app self-contained (UI-wise)
- ✅ Use type imports: `import type { X } from '@shared'`
- ✅ Document company-specific code
- ✅ Test locally before pushing
- ✅ Keep commits focused and atomic

### ❌ Don't

- ❌ Import UI components from `@shared`
- ❌ Put company-specific code in `@shared`
- ❌ Modify `@shared` without team discussion
- ❌ Commit without testing
- ❌ Use `console.log` for permanent logging
- ❌ Hardcode API endpoints or company data
- ❌ Ignore TypeScript errors

### Performance Tips

```typescript
// ❌ Avoid unnecessary re-renders
const MyComponent = () => {
  const data = useSessionStore()  // Subscribes to whole store
  return <div>{data.sessionUuid}</div>
}

// ✅ Better - select only what you need
const MyComponent = () => {
  const sessionUuid = useSessionStore((s) => s.sessionUuid)
  return <div>{sessionUuid}</div>
}
```

```typescript
// ❌ Avoid creating functions in render
const MyComponent = () => {
  return (
    <Button onClick={() => handleSubmit()} />
  )
}

// ✅ Better - use useCallback
const MyComponent = () => {
  const handleClick = useCallback(() => handleSubmit(), [])
  return <Button onClick={handleClick} />
}
```

---

## Quick Reference

### Key Files

| File | Purpose |
|------|---------|
| `src/config/branding.ts` | Company branding config |
| `src/app/page.tsx` | Home/landing page |
| `src/app/layout.tsx` | Root layout |
| `src/app/globals.css` | Global styles |
| `package.json` | App dependencies |
| `tsconfig.json` | TypeScript config |
| `next.config.ts` | Next.js config |
| `.env.production` | Environment variables |

### Key Commands

| Command | Purpose |
|---------|---------|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start dev server |
| `pnpm build` | Build for production |
| `pnpm start` | Run production build |
| `pnpm typecheck` | Check TypeScript |

### Key Imports

```typescript
import { useSessionStore, useSession } from '@shared'
import { getSocketClient } from '@shared'
import { SessionTracker } from '@shared'
import { currentBrand } from '@/config/branding'
import { cn } from '@shared'
```

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev)

---

**Need help?** Check [ONBOARDING_NEW_CLIENT.md](./ONBOARDING_NEW_CLIENT.md) or [README.md](./README.md)
