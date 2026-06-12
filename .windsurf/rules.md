# Windsurf Rules — notes-app-ale
# This file is automatically read by Windsurf's Cascade AI in every session.
# These rules enforce the project's architecture, TDD, and deployment constraints.

## Project structure
This is a monorepo with two apps:
- `frontend/` → Next.js + TypeScript, deployed on Vercel
- `backend/` → Python + Django REST Framework, deployed on Railway
- Full rules in `CLAUDE.md` at the root — always follow it

## TDD — mandatory
- Write the test first, confirm it fails, then write implementation
- Never write implementation code without a failing test first
- Coverage must stay at 80% or above at all times

## Frontend rules
- TypeScript only — never .js or .jsx
- Never use `any`
- Next.js App Router only — never use pages/ directory
- Tailwind CSS only — no inline styles, no CSS modules
- All colors and spacing from src/lib/tokens.ts
- Components are Server Components by default — use "use client" only when needed
- Icons from lucide-react only
- Jest only for all tests — never use Vitest or other test frameworks
- Test files must be in __tests__/ directory with .test.ts or .test.tsx extension

## Backend rules
- Python only, Django REST Framework only
- Type hints everywhere
- All endpoints under /api/v1/
- Always use DRF serializers and permission classes
- Never leave endpoints unprotected
- Never use SQLite in production

## Figma MCP workflow
- Prompt templates are in .windsurf/prompts/figma-component.md
- Always select the full component SET in Figma before running a prompt
- Always follow the Red → Green → Refactor cycle per component
- Track progress in FIGMA_PROGRESS.md at the root

## Never do
- Write implementation before a failing test exists
- Use `any` in TypeScript
- Use inline styles instead of Tailwind
- Hardcode colors, secrets, or API URLs
- Skip serializers or permissions in Django
- Leave console.log or print() debug statements
- Drop coverage below 80%