# Verification Platform - Monorepo

Multi-tenant customer verification platform with per-company customization.

## Documentation Index

- **[Developer Guide](./DEVELOPER_GUIDE.md)**: Comprehensive guide for development, architecture, and workflow.
- **[Onboarding New Client](./ONBOARDING_NEW_CLIENT.md)**: Step-by-step guide for adding a new company.
- **[Shared Package](./packages/shared/README.md)**: Documentation for the shared business logic layer.

## Structure

```
verification-platform/
├── apps/
│   ├── kcu-client/          ← KCU (Kawartha Credit Union) implementation
│   ├── template/            ← Template for new companies
│   ├── rbc-client/          ← (To be added)
│   ├── cibc-client/         ← (To be added)
│   └── td-client/           ← (To be added)
│
├── packages/
│   └── shared/              ← Shared business logic
│       ├── src/
│       │   ├── stores/      ← Zustand session store
│       │   ├── ws/          ← WebSocket client
│       │   ├── types/       ← TypeScript types
│       │   ├── tracking/    ← Analytics & device fingerprint
│       │   └── utils/       ← Utilities
│       └── package.json
│
├── pnpm-workspace.yaml      ← Workspace configuration
├── tsconfig.json            ← Root TypeScript config
└── package.json             ← Root package.json
```

## Getting Started

For detailed setup instructions, see the [Developer Guide](./DEVELOPER_GUIDE.md).

### Quick Start

```bash
# Install pnpm if needed
npm install -g pnpm

# Install dependencies
pnpm install

# Start all apps
pnpm dev
```

## Architecture

### Shared Business Logic (`packages/shared`)

Contains:
- **Stores**: Zustand session state management
- **WebSocket**: Real-time communication with backend
- **Types**: TypeScript definitions for WebSocket messages
- **Tracking**: Analytics and device fingerprinting
- **Utils**: Shared utilities (cn, etc.)

### Per-Company Apps (`apps/*`)

Each app is a **complete Next.js application** with:
- ✅ 100% UI customization freedom
- ✅ Custom components and layouts
- ✅ Custom styling and branding
- ✅ Custom configuration
- ✅ Independent deployment

## Key Decisions

### Why Monorepo?

1. **Shared Business Logic**: API client, session management, WebSocket - no duplication
2. **Fast Scaling**: Copy template → customize UI → deploy (per company)
3. **Central Dependencies**: pnpm workspaces manage all versions
4. **Consistency**: All companies use same backend communication

## Common Commands

```bash
pnpm install         # Install all deps
pnpm dev            # Start all dev servers
pnpm build          # Build all apps
pnpm lint           # Lint all code
```

## File Modification Rules

### ✅ Modify These

- `apps/your-company-client/src/**/*` - Your UI code (unlimited)
- `apps/your-company-client/src/config/branding.ts` - Your branding
- `apps/your-company-client/.env.production` - Your environment

### ❌ Don't Modify These

- `packages/shared/**/*` - Coordinate with team before changes
- `apps/template/**/*` - This is the template for new companies
- Root `tsconfig.json`, `pnpm-workspace.yaml` - Impacts all apps

## Support

- **Setup Questions**: See TEMPLATE_README.md in your app
- **Shared Code Issues**: Check `packages/shared/README.md`
- **Integration Issues**: Review `ONBOARDING_NEW_CLIENT.md`
- **Architecture Questions**: See `DEVELOPER_GUIDE.md`
