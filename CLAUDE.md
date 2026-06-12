# CLAUDE.md — notes-app-ale
 
This file defines the rules Claude must follow in this project.
**Never break these rules, even if asked to move fast or skip steps.**
 
---
 
## Project Structure
 
```
notes-app-ale/
├── frontend/   → Next.js + TypeScript → deployed on Vercel
├── backend/    → Python + Django REST Framework → deployed on Railway
└── CLAUDE.md
```
 
---
 
## 1. Test-Driven Development (TDD) — Non-Negotiable
 
**Always follow the Red → Green → Refactor cycle:**
 
1. **Write the test first** — it must fail before writing implementation code
2. **Write the minimum code** to make the test pass
3. **Refactor** — clean up without breaking tests
```
# Correct order — never skip this
1. Write failing test
2. Run tests → confirm it fails (Red)
3. Write implementation
4. Run tests → confirm it passes (Green)
5. Refactor if needed
6. Run full test suite → confirm nothing broke
```
 
**Never write implementation code without a corresponding test first.**
If a file has no test file, create the test file before touching the implementation.
 
---
 
## 2. Test Coverage — Minimum 80%
 
- Coverage must stay at **80% or above** at all times
- Before finishing any task, run the coverage report and confirm the threshold is met
- If a change drops coverage below 80%, fix it before considering the task done
- Coverage reports live at:
  - Frontend: `frontend/coverage/`
  - Backend: `backend/htmlcov/`
### Frontend coverage check
```bash
cd frontend && npm run test:coverage
# Must show: All files | 80%+ across Stmts, Branch, Funcs, Lines
```
 
### Backend coverage check
```bash
cd backend && coverage run manage.py test && coverage report --fail-under=80
```
 
---
 
## 3. Frontend Rules — Next.js + TypeScript on Vercel
 
### Language & framework
- **Always TypeScript** — never `.js` or `.jsx`, only `.ts` and `.tsx`
- **Never use `any`** — define proper interfaces and types for everything
- **Next.js App Router** — use `app/` directory, not `pages/`
- All components are React Server Components by default; use `"use client"` only when strictly necessary (event handlers, hooks, browser APIs)
### File structure
```
frontend/
├── src/
│   ├── app/             → routes and layouts (App Router)
│   ├── components/
│   │   ├── ui/          → base components (Button, Input, Card...)
│   │   └── notes/       → feature components (NoteCard, NoteEditor...)
│   ├── hooks/           → custom React hooks
│   ├── lib/
│   │   ├── tokens.ts    → design tokens from Figma
│   │   └── api.ts       → API client for backend calls
│   ├── types/           → shared TypeScript interfaces
│   └── styles/
│       └── globals.css
├── __tests__/           → mirrors src/ structure
├── tailwind.config.ts
├── tsconfig.json
└── .env.local           → never commit this
```
 
### Styling
- **Tailwind CSS only** — no inline styles, no CSS modules, no styled-components
- Colors, spacing and typography must come from `src/lib/tokens.ts`
- Never hardcode hex values or font sizes directly in components
### TypeScript rules
```typescript
// ✅ Always define explicit interfaces
interface NoteCardProps {
  id: string
  title: string
  body: string
  createdAt: string
  tags: string[]
}
 
// ❌ Never use any or implicit types
const handleNote = (data: any) => { ... }
```
 
### Testing (Frontend)
- **Framework:** Jest + React Testing Library
- Test files live next to components or in `__tests__/` mirroring `src/`
- Every component must have a test file: `ComponentName.test.tsx`
- Every custom hook must have a test file: `useHookName.test.ts`
- Every `lib/` utility must have a test file
```typescript
// Naming convention
Button.tsx         → Button.test.tsx
useNotes.ts        → useNotes.test.ts
lib/api.ts         → lib/api.test.ts
```
 
Required test cases per component:
- Renders without crashing
- Renders correct content given props
- Handles user interactions (click, input, submit)
- Handles edge cases (empty state, loading, error)
```bash
# Run tests
cd frontend && npm run test
 
# Run with coverage
cd frontend && npm run test:coverage
 
# Watch mode during development
cd frontend && npm run test:watch
```
 
### Vercel deployment rules
- **Never commit `.env.local`** — add env vars in Vercel dashboard
- `NEXT_PUBLIC_` prefix only for vars the browser needs
- No `console.log` in production code — use proper error boundaries
- Always run `npm run build` locally before considering a feature done
- TypeScript errors = build fails = deployment fails — fix all type errors
```bash
# Must pass before every PR
cd frontend && npm run build
cd frontend && npm run test:coverage
cd frontend && npx tsc --noEmit
```
 
---
 
## 4. Backend Rules — Django REST Framework on Railway
 
### Language & framework
- **Always Python** — no other backend language
- **Always Django REST Framework** — no Flask, FastAPI, or raw Django views for API endpoints
- Python version: **3.11+**
- Use **type hints** everywhere
### File structure
```
backend/
├── manage.py
├── requirements.txt
├── requirements-dev.txt    → includes pytest, coverage, factory-boy
├── .env                    → never commit this
├── config/
│   ├── settings/
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py   → used by Railway
│   ├── urls.py
│   └── wsgi.py
└── apps/
    └── notes/
        ├── models.py
        ├── serializers.py
        ├── views.py
        ├── urls.py
        ├── permissions.py
        └── tests/
            ├── test_models.py
            ├── test_serializers.py
            ├── test_views.py
            └── factories.py
```
 
### API rules
- All endpoints under `/api/v1/`
- Always use DRF serializers — never return raw querysets or dicts
- Always use DRF permissions — never leave endpoints unprotected
- Use **ViewSets** and **Routers** for standard CRUD
- Return consistent error responses using DRF's default exception handler
```python
# ✅ Correct
class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    queryset = Note.objects.all()
 
# ❌ Never skip serializers or permissions
def get_notes(request):
    return JsonResponse(list(Note.objects.values()))
```
 
### Python type hints
```python
# ✅ Always use type hints
def get_note_by_id(note_id: int) -> Note:
    return Note.objects.get(id=note_id)
 
# ❌ Never skip types
def get_note_by_id(note_id):
    return Note.objects.get(id=note_id)
```
 
### Testing (Backend)
- **Framework:** pytest + pytest-django + factory-boy
- Every model, serializer, view, and permission must have tests
- Use **factories** (factory-boy) instead of hardcoded fixtures
```python
# apps/notes/tests/factories.py
import factory
from apps.notes.models import Note
 
class NoteFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Note
    title = factory.Faker("sentence", nb_words=4)
    body = factory.Faker("paragraph")
```
 
```python
# apps/notes/tests/test_views.py
class NoteListViewTest(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)
 
    def test_list_returns_only_user_notes(self):
        # Red → write this before the view exists
        NoteFactory.create_batch(3, user=self.user)
        NoteFactory.create_batch(2)  # other user's notes
        response = self.client.get("/api/v1/notes/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)
```
 
```bash
# Run tests
cd backend && pytest
 
# Run with coverage
cd backend && coverage run -m pytest && coverage report --fail-under=80
 
# Run specific app
cd backend && pytest apps/notes/
```
 
### Railway deployment rules
- **Never commit `.env`** — add env vars in Railway dashboard
- `config/settings/production.py` must read all secrets from env vars
- Always set `DEBUG=False` in production
- Database: PostgreSQL (Railway provides it) — never SQLite in production
- Run migrations as part of deploy: add `python manage.py migrate` to Railway start command
```python
# config/settings/production.py — required vars
SECRET_KEY = env("SECRET_KEY")
DATABASE_URL = env("DATABASE_URL")
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS")
DEBUG = False
```
 
```bash
# Must pass before every PR
cd backend && pytest --tb=short
cd backend && coverage run -m pytest && coverage report --fail-under=80
cd backend && python manage.py check --deploy
```
 
---
 
## 5. Git Rules
 
- **Never commit directly to `main`**
- Branch naming: `feat/`, `fix/`, `test/`, `refactor/`
- Every PR must have passing tests and 80%+ coverage
- Never commit:
  - `.env` or `.env.local`
  - `__pycache__/`
  - `.pytest_cache/`
  - `coverage/` or `htmlcov/`
  - `node_modules/`
  - `.next/`
`.gitignore` must include all of the above.
 
---
 
## 6. What Claude Must Never Do
 
- ❌ Write implementation code before writing a test
- ❌ Skip or delete tests to make coverage pass
- ❌ Use `any` in TypeScript
- ❌ Use `.js` or `.jsx` files in the frontend
- ❌ Write Django views that bypass DRF serializers
- ❌ Leave API endpoints without permission classes
- ❌ Hardcode secrets, tokens or API URLs
- ❌ Use inline styles instead of Tailwind
- ❌ Leave `console.log` or `print()` debug statements in code
- ❌ Merge or finish a task with coverage below 80%
- ❌ Use `pages/` directory in Next.js (use `app/` only)
- ❌ Use SQLite in the Railway production environment
---
 
## 7. Quick Reference — Commands
 
```bash
# Frontend
cd frontend
npm run dev              # local dev
npm run build            # verify Vercel build works
npm run test             # run tests
npm run test:coverage    # run tests + coverage report
npx tsc --noEmit         # type check only
 
# Backend
cd backend
python manage.py runserver          # local dev
python manage.py migrate            # apply migrations
python manage.py makemigrations     # create new migrations
pytest                              # run tests
coverage run -m pytest              # run tests + coverage
coverage report --fail-under=80     # enforce 80% threshold
python manage.py check --deploy     # pre-deploy check
```
 
---
 
## 8. Definition of Done
 
A task is only done when **all** of the following are true:
 
- [ ] Tests written **before** implementation (TDD)
- [ ] All tests pass
- [ ] Coverage is **80% or above**
- [ ] No TypeScript errors (`tsc --noEmit` passes)
- [ ] `npm run build` passes (frontend)
- [ ] `manage.py check --deploy` passes (backend)
- [ ] No secrets hardcoded
- [ ] No `console.log` or `print()` debug statements