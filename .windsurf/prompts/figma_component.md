# Figma MCP — Prompt Templates
# notes-app-ale
#
# HOW TO USE:
# 1. Select the component SET in Figma (the dashed border wrapping all variants)
# 2. Copy the relevant prompt below
# 3. Replace everything in [BRACKETS]
# 4. Paste into Cursor Agent / Claude Code and run
#
# ALWAYS select the full component SET, not a single variant.
# The MCP can only see what is currently selected in Figma.

# ─────────────────────────────────────────────
# PROMPT 0 — DESIGN TOKENS (run this first, once)
# No Figma selection needed
# ─────────────────────────────────────────────

```
Use the Figma MCP to read file ouOut0MKM317LDYD78ekxh.

Extract ALL design tokens with exact values:
- Colors: name, hex value, usage (background, text, border, brand...)
- Typography: font family, all size steps (px), weight values, line heights, letter spacing
- Spacing: all spacing values used across components (px)
- Border radius: all radius values used (px)
- Shadows: box shadow values (offset x, offset y, blur, spread, color, opacity)

Then:
1. Save everything to frontend/src/lib/tokens.ts as typed TypeScript constants
2. Update frontend/tailwind.config.ts to extend the theme with these tokens
3. Update frontend/src/styles/globals.css with CSS custom properties for each token

Output a summary table:
| Token type | Name | Value |
|---|---|---|

Write tests for tokens.ts at frontend/__tests__/lib/tokens.test.ts
confirming all expected keys exist and have the right format.
```


# ─────────────────────────────────────────────
# PROMPT 1 — BASE UI COMPONENT
# Use for: Button, Input, Textarea, Badge, Avatar, Checkbox, Toggle, Spinner, Divider
# ─────────────────────────────────────────────

```
I have selected the [COMPONENT_NAME] component SET in Figma.
It is located at: [FIGMA_PAGE_NAME] → [FRAME_PATH]

Use the Figma MCP to read it pixel-perfect. Extract:
- Exact px values for padding, gap, margin (convert to Tailwind scale)
- Font size, weight, line-height, letter-spacing
- All color values → map to tokens in src/lib/tokens.ts
- Border, border-radius, box-shadow with exact values
- All variants and interactive states visible in the selection
- Width/height constraints (fixed vs fill vs hug)

STEP 1 — Write the test file first (TDD):
frontend/__tests__/components/ui/[COMPONENT_NAME].test.tsx
Tests must cover:
- Renders without crashing for each variant
- Correct Tailwind classes applied per variant
- Handles onClick / onChange if interactive
- Disabled state behaves correctly
- Snapshot test for each variant
Run: cd frontend && npm run test -- [COMPONENT_NAME]
Confirm it fails (Red) before proceeding.

STEP 2 — Implement the component:
frontend/src/components/ui/[COMPONENT_NAME].tsx
Rules:
- TypeScript only — define a [COMPONENT_NAME]Props interface
- Never use `any`
- Tailwind classes only — no inline styles
- Use cva (class-variance-authority) for variants
- Import colors and tokens from src/lib/tokens.ts
- For values with no direct Tailwind class, use arbitrary values e.g. p-[13px]
- Export as named export AND as default export

STEP 3 — Export from index:
Add to frontend/src/components/ui/index.ts:
export { [COMPONENT_NAME] } from './[COMPONENT_NAME]'

STEP 4 — Run tests:
cd frontend && npm run test -- [COMPONENT_NAME]
Confirm they pass (Green).

STEP 5 — Output this verification table:
| Property        | Figma value      | Tailwind class       | Token used        |
|----------------|------------------|----------------------|-------------------|
| padding         | 12px 24px        | py-3 px-6            | -                 |
| font-size       | 16px             | text-base            | typography.base   |
| border-radius   | 8px              | rounded-lg           | radius.md         |
| background      | #6366F1          | bg-primary           | colors.primary    |
| (add all rows)  |                  |                      |                   |

STEP 6 — Update FIGMA_PROGRESS.md:
Mark [COMPONENT_NAME] as done in the Base UI Components table.
```


# ─────────────────────────────────────────────
# PROMPT 2 — NOTES FEATURE COMPONENT
# Use for: NoteCard, NoteEditor, NoteList, NoteHeader, TagInput, TagBadge, SearchBar, EmptyState
# ─────────────────────────────────────────────

```
I have selected the [COMPONENT_NAME] component SET in Figma.
It is located at: [FIGMA_PAGE_NAME] → [FRAME_PATH]

Use the Figma MCP to read it pixel-perfect. Extract:
- Exact px values for all spacing, layout and sizing
- All color values → map to tokens in src/lib/tokens.ts
- All variants and states visible in the selection
- Typography with exact values
- Any icons used — note their names so we can map to lucide-react

Our backend Note model has these fields:
{ id: string, title: string, body: string, createdAt: string, updatedAt: string, tags: string[] }

STEP 1 — Write the test file first (TDD):
frontend/__tests__/components/notes/[COMPONENT_NAME].test.tsx
Tests must cover:
- Renders correctly with full mock data
- Renders correctly with minimum required data
- Handles empty/loading/error states if present in the design
- User interactions (click, input, submit) if present
Run: cd frontend && npm run test -- [COMPONENT_NAME]
Confirm it fails (Red) before proceeding.

STEP 2 — Implement the component:
frontend/src/components/notes/[COMPONENT_NAME].tsx
Rules:
- TypeScript only — define a [COMPONENT_NAME]Props interface in src/types/notes.ts
- Never use `any`
- Tailwind classes only — no inline styles
- Pure presentational component — no data fetching, no API calls
- Data comes entirely from props
- Use base UI components from src/components/ui/ where applicable
- Icons from lucide-react only

STEP 3 — Run tests:
cd frontend && npm run test -- [COMPONENT_NAME]
Confirm they pass (Green).

STEP 4 — Output this verification table:
| Property        | Figma value      | Tailwind class       | Token used        |
|----------------|------------------|----------------------|-------------------|
| (fill all rows) |                  |                      |                   |

STEP 5 — Update FIGMA_PROGRESS.md:
Mark [COMPONENT_NAME] as done in the Notes Feature Components table.
```


# ─────────────────────────────────────────────
# PROMPT 3 — LAYOUT COMPONENT
# Use for: Navbar, Sidebar, PageWrapper
# ─────────────────────────────────────────────

```
I have selected the [COMPONENT_NAME] layout frame in Figma.
It is located at: [FIGMA_PAGE_NAME] → [FRAME_PATH]

Use the Figma MCP to read it pixel-perfect. Extract:
- Exact dimensions, padding, gap values
- Breakpoint behavior if visible (mobile vs desktop variants)
- Color values → map to tokens in src/lib/tokens.ts
- Z-index and position (fixed, sticky, relative)
- All interactive elements and their states

STEP 1 — Write the test file first (TDD):
frontend/__tests__/components/layout/[COMPONENT_NAME].test.tsx
Tests must cover:
- Renders without crashing
- Renders children correctly
- Mobile/desktop variants render correctly
- Navigation links render if present
Run: cd frontend && npm run test -- [COMPONENT_NAME]
Confirm it fails (Red) before proceeding.

STEP 2 — Implement the component:
frontend/src/components/layout/[COMPONENT_NAME].tsx
Rules:
- TypeScript only
- Tailwind only — use responsive prefixes (sm:, md:, lg:) for breakpoints
- Use "use client" only if it needs useState or event handlers
- Children via React.ReactNode prop if it wraps content

STEP 3 — Run tests and confirm Green.

STEP 4 — Output verification table.

STEP 5 — Update FIGMA_PROGRESS.md.
```


# ─────────────────────────────────────────────
# PROMPT 4 — FULL PAGE
# Use for: Dashboard, Login, Register, Note Detail, 404
# Run AFTER all components used in that page are done
# ─────────────────────────────────────────────

```
I have selected the [PAGE_NAME] full page frame in Figma.
It is located at: [FIGMA_PAGE_NAME] → [FRAME_PATH]

Use the Figma MCP to read it pixel-perfect.

First, identify every section in the page and map them to existing components:
- List each visual section
- Map it to a component in src/components/ that already exists
- Flag any section that needs a new component (create it with Prompt 1 or 2 first)

STEP 1 — Write the test file first (TDD):
frontend/__tests__/app/[page-name]/page.test.tsx
Tests must cover:
- Page renders without crashing
- All major sections are present in the DOM
- Page title / metadata is correct
Run: cd frontend && npm run test -- [page-name]
Confirm it fails (Red) before proceeding.

STEP 2 — Implement the page:
frontend/src/app/[page-route]/page.tsx
Rules:
- TypeScript only
- page.tsx ONLY composes components — no layout logic, no inline styles
- All data fetching via server components or dedicated hooks in src/hooks/
- Correct Next.js metadata export

STEP 3 — Run build check:
cd frontend && npm run build
Fix any errors before marking done.

STEP 4 — Run full test suite with coverage:
cd frontend && npm run test:coverage
Coverage must be 80% or above.

STEP 5 — Output section mapping:
| Page section    | Component used                        | New component needed |
|----------------|---------------------------------------|----------------------|
| Header          | src/components/layout/Navbar.tsx      | No                   |
| Note list       | src/components/notes/NoteList.tsx     | No                   |
| (add all rows)  |                                       |                      |

STEP 6 — Update FIGMA_PROGRESS.md.
```


# ─────────────────────────────────────────────
# PROMPT 5 — FIX PIXEL DISCREPANCY
# Use when a component looks off after first implementation
# ─────────────────────────────────────────────

```
The [COMPONENT_NAME] component at frontend/src/components/[PATH]/[COMPONENT_NAME].tsx
does not match the Figma design exactly.

I have re-selected the [COMPONENT_NAME] frame in Figma.
Use the Figma MCP to re-read it and compare against the current implementation.

List every discrepancy:
| Property        | Figma value      | Current code         | Fix needed        |
|----------------|------------------|----------------------|-------------------|
| (fill all rows) |                  |                      |                   |

Then apply all fixes. Do NOT change the props interface or component structure
unless absolutely required by the design. Only fix visual/styling values.

Run tests after: cd frontend && npm run test -- [COMPONENT_NAME]
All tests must still pass after the fix.
```