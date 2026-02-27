## CONTEXT

This app is a copy of a fully released, working production Next.js app.
All logic is correct and must be preserved exactly as-is.

Your job is a **full visual rebuild** — the existing UI is just a starting point.
You are rebuilding the entire look, feel, layout, and component design to match the reference project pixel-perfectly, while keeping every line of logic working underneath.

Think of it this way:
- The copied app is the **logic donor** — behaviour, data, validation, API calls
- The reference is the **design blueprint** — everything the user sees and interacts with

---

## PATHS

| Role | Path |
|------|------|
| App to rebuild (logic source + working copy) | `C:\Users\Modmin\Downloads\user-client-main\user-client-main\apps\asb-client` |
| New client brand reference (design blueprint) | `C:\Users\Modmin\Downloads\user-client-main\reference` |

---

## PHASE 1 — AUDIT THE REFERENCE (before touching anything)

The reference is the client's login/landing page — a Vite/vanilla HTML project.
This is your **single source of truth for every visual decision**.

Read every file and extract a full **Brand & Layout Spec**. Write it out before writing any code.

**Extract:**

- **Colors** — primary, secondary, accent, background, surface, text, border, error, success. Exact hex/rgb values from CSS variables or stylesheets.
- **Typography** — every font family, weight, size, line-height. Check `<link>` Google Fonts tags, `@font-face` rules, or font files in `/public`.
- **Spacing system** — padding/margin rhythm, border-radius values, gap sizes, container max-widths.
- **Logo & assets** — every image, icon, SVG in `/public`. Note filenames and usage context.
- **Layout structure** — how the page is structured at a macro level. Is there a sidebar? A split-screen layout? A centered card? A full-width header? A sticky nav? Document this precisely.
- **Component anatomy** — how each element is built:
  - Buttons: shape, size, border-radius, shadow, icon usage, hover/active states
  - Inputs: border style, label position (floating? above? placeholder-only?), focus ring, error state
  - Cards/containers: background, border, shadow, radius
  - Header/navbar: structure, logo placement, nav items
  - Any other UI patterns visible in the reference
- **Responsive behavior** — document every breakpoint explicitly. How does the layout change from desktop → tablet → mobile? Does the sidebar collapse? Does a multi-column layout stack? Does the nav become a hamburger? Note exact behavior at each breakpoint.
- **Animations & interactions** — transitions, hover effects, loading states
- **Brand content & copy** — extract every piece of visible text from the reference:
  - Brand/bank name (exact spelling and casing)
  - Taglines and marketing headlines
  - Button labels (e.g. "Sign In", "Continue", "Submit")
  - Form field labels and placeholder text
  - Helper text, hints, tooltips
  - Footer content — copyright line (e.g. "© 2024 [Bank Name]. All rights reserved."), legal links, disclaimer text
  - Any trust badges, security text, or legal notices
  - Navigation labels
  - Error and success message tone/wording style

  This content must be used throughout the rebuilt app wherever equivalent UI elements appear. The app must read and feel like it belongs to the new client — not just look like them.

---

## PHASE 2 — AUDIT THE APP'S LOGIC (extract only, do not redesign yet) Basically i have copied the entire app for you so ites easier so you will find the same thing jusut updated the public folder with some assets and fonts

Read the copied app thoroughly. You are extracting behaviour only — ignore all styling.

Document:

- **Step sequence** — every screen/step the user goes through, in order
- **Form fields per step** — field names, types, validation rules
- **Validation logic** — what passes, fails, error messages shown
- **Data transformation** — how data is shaped before being sent
- **API/webhook calls** — endpoint, method, payload structure, headers
- **State/routing between steps** — query params, localStorage, context, cookies
- **Success states** — what happens after successful submission
- **Error & retry states** — how errors are shown, retry behaviour
- **Guards/middleware** — any route protection or conditional redirects

This is the behaviour map. Every item here must work identically in the rebuilt app.

---

## PHASE 3 — PLAN THE REBUILD

For each step in the behaviour map, plan how it will look using the reference design language:

- What layout structure does this step use? (reference the macro layout from Brand Spec)
- What components are needed? (button, input, card, etc. — reference the component anatomy)
- For screens with no direct counterpart in the reference, infer the design using the same design language — same colors, fonts, spacing, component shapes. Never fall back to generic styles.

Write out this plan before building.

---

## PHASE 4 — SETUP DESIGN TOKENS

Before rebuilding any component, set up the full design system:

1. **`tailwind.config.ts`** — update colors, fontFamily, borderRadius, spacing extensions to match the Brand Spec
2. **`globals.css`** — update CSS variables, font imports (`@import` or `@font-face`), base styles
3. **Font setup** — update Google Fonts link in `layout.tsx`, or copy local font files from reference `/public` to app `/public` and set up `@font-face`
4. **Assets** — copy all logo, favicon, and image files from reference `/public` into the app `/public`. Remove old client assets.

---

## PHASE 5 — REBUILD COMPONENTS

Rebuild every UI component to match the reference design. This is a **full visual rebuild** — you are not just recoloring existing components, you are redesigning them to match the reference's component anatomy exactly.

This means:
- If the reference uses pill buttons, rebuild all buttons as pill buttons
- If the reference uses floating labels on inputs, rebuild all inputs with floating labels
- If the reference has a sidebar layout, add a sidebar
- If the reference has a split-screen login, rebuild it as split-screen
- If the reference has a specific card style with a top-colored border and a soft shadow, every card gets that treatment
- Every element — buttons, inputs, selects, checkboxes, progress indicators, modals, alerts — must be rebuilt to match the reference's visual language

**Rules while rebuilding:**
- Use only design tokens from your Brand Spec — no hardcoded hex values or font names
- Implement all interaction states: default, hover, focus, active, error, disabled, loading
- Do not change anything about what a component *does* — only how it looks

**Responsiveness is non-negotiable:**
The reference is fully responsive and so must the rebuilt app be. For every component and layout:
- Match the reference's behavior at every breakpoint (desktop, tablet, mobile)
- If the reference collapses a sidebar on mobile — do that
- If the reference stacks a two-column layout vertically on mobile — do that
- If the reference uses a hamburger menu on mobile — do that
- Touch targets on mobile must be appropriately sized
- No horizontal scrolling on any screen size
- For screens that have no counterpart in the reference (e.g. multi-step form pages), use the same responsive patterns and breakpoints from the reference design language to infer how they should behave on mobile

**Content & copy — every text element must match the new client's brand:**
- Use the exact brand name, taglines, and terminology extracted from the reference
- Rewrite all button labels, form labels, placeholders, and helper text to match the reference's wording and tone
- Replace the footer copyright line with the new client's (e.g. "© 2025 [New Client Bank]. All rights reserved.")
- Include any legal disclaimers, security notices, or trust text from the reference footer
- For screens not shown in the reference, infer copy using the same brand voice and tone — never leave old client text or placeholder text in the app
- Every piece of visible text the user reads must feel like it belongs to the new client

---

## PHASE 6 — REWIRE LOGIC

After components are rebuilt, connect all the existing logic back in:

- Hook form fields back to their existing validation and state
- Reconnect all API/webhook calls exactly as they were
- Restore all step transitions and guards
- Restore success and error handling

You MAY carry over from the original app:
- ✅ Validation logic and rules
- ✅ API/webhook call functions
- ✅ Payload builders and data transformers
- ✅ TypeScript types and interfaces
- ✅ Utility/helper functions
- ✅ Environment variable names

You MUST NOT carry over:
- ❌ Any old CSS, styling, or className values
- ❌ Any old component markup or layout structure
- ❌ Old client logo, images, or brand assets
- ❌ Old client name or brand text anywhere in the UI

---

## ABSOLUTE DO NOT TOUCH

These must remain completely unchanged:

- ❌ API routes (`/api/` folder)
- ❌ Data fetching logic (`fetch`, `axios`, server actions, `getServerSideProps`)
- ❌ Validation logic (reuse it, never modify it)
- ❌ Payload structure sent to any API or webhook
- ❌ Step sequence and flow (same number of steps, same order)
- ❌ Form field names and data keys
- ❌ Routing and middleware logic
- ❌ `.env` files
- ❌ `next.config.js` (unless only adding new image domains for new assets)

> If unsure whether something is logic or design — preserve the behaviour, rebuild only the visual presentation of it.

---

## PHASE 7 — VERIFY

**Visual accuracy**
- [ ] Overall page layout matches the reference (sidebar, split-screen, centered card, etc.)
- [ ] Every component shape matches the reference (buttons, inputs, cards, header, nav)
- [ ] Colors fully match — no old client colors anywhere
- [ ] Fonts fully match — correct family, weight, size at every level
- [ ] Logo and favicon are the new client's
- [ ] All old client assets removed and replaced
- [ ] All interaction states (hover, focus, error, loading, disabled) are implemented and on-brand

**Content & copy**
- [ ] New client brand name used everywhere — no old client name remains anywhere
- [ ] All button labels, form labels, and placeholders match the reference wording
- [ ] Footer copyright line is the new client's
- [ ] All legal disclaimers, security text, and trust notices from the reference are present
- [ ] Tone and voice of all UI text matches the reference
- [ ] No placeholder text, lorem ipsum, or old client copy anywhere in the app

**Responsiveness**
- [ ] Desktop layout matches the reference exactly
- [ ] Mobile layout matches the reference exactly — correct stacking, collapsed nav, etc.
- [ ] Tablet/intermediate breakpoints behave consistently with the reference's patterns
- [ ] No horizontal scrolling at any screen size
- [ ] Touch targets are appropriately sized on mobile
- [ ] Inferred screens (not in reference) follow the same responsive patterns

**Logic parity**
- [ ] Every step exists and appears in the correct order
- [ ] All form fields present with correct validation behaviour
- [ ] API/webhook payload is identical to the original
- [ ] Success and error flows work identically
- [ ] All guards and redirects work as before

**Technical**
- [ ] `pnpm build` passes with zero errors
- [ ] No TypeScript errors
- [ ] No console errors at runtime

---

## START HERE

Read the reference project in full. Write the Brand & Layout Spec. Then read the app and write the Behaviour Map. Then plan the rebuild. Only then start making changes — design tokens first, then components, then logic rewire.