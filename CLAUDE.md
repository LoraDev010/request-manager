# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Backend (`cd backend`)
```bash
npm run dev           # ts-node-dev with hot reload on :3000
npm test              # Jest + Supertest integration tests (--runInBand)
npm run test:coverage # Jest with coverage — enforces thresholds (statements ≥85%, branches ≥65%)
npm run build         # tsc → dist/
npm start             # run compiled dist/app.js
```

### Frontend (`cd frontend`)
```bash
npm run dev           # Vite dev server on :5173
npm test              # Vitest run (single pass)
npm run test:coverage # Vitest with v8 coverage — informational, no thresholds
npm run lint          # ESLint
npm run build         # tsc -b && vite build
```

### Run a single backend test
```bash
cd backend && npx jest --testNamePattern="<test name>"
```

## Architecture

Strict 4-layer separation — each layer only talks to the one below it:

```
routes → controllers → services → repositories
```

- **routes** (`src/routes/`): register Express routes, apply `validate` middleware
- **controllers** (`src/controllers/`): extract req/res, delegate to service, send `{ data, error }` envelope
- **services** (`src/services/`): all business logic lives here — throws `AppError` subclasses
- **repositories** (`src/repositories/`): data access only, no error handling

### Error handling
`AppError` (`src/errors/AppError.ts`) is the base class. Subclasses:
- `NotFoundError` → 404 / `REQUEST_NOT_FOUND`
- `ConflictError` → 409 / `REQUEST_ALREADY_PROCESSED`
- `ValidationError` → 400 / `VALIDATION_ERROR`

`errorHandler` middleware (`src/middleware/errorHandler.ts`) catches all `AppError` throws and formats them into the envelope. Repositories **must not** catch errors.

### API response envelope
Every endpoint returns:
```json
{ "data": <T> | null, "error": { "code": "...", "message": "..." } | null }
```

### Business rules
- `status` starts as `PENDING` on creation
- Only `PENDING` requests can be approved or rejected → `ConflictError` otherwise
- `PATCH /requests/:id` accepts only `{ status: "APPROVED" | "REJECTED" }`

### Frontend
- `src/types/index.ts` — shared `Request`, `Status`, `ApiResponse`, `ApiError` types
- `src/services/api.ts` — axios instance + typed fetch functions
- `src/hooks/useRequests.ts` — TanStack Query `useQuery` / `useMutation` wrapping the API
- Components consume hooks only; no direct API calls in components

**`verbatimModuleSyntax: true`** is enabled in `tsconfig.app.json`. All type-only imports must use `import type { ... }` — importing interfaces as values causes a runtime ES module error in the browser.

## Key tsconfig notes
- Backend: `"module": "commonjs"` — no `import type` requirement, but tests are in `tests/` which is excluded from `tsc`
- Frontend: `"moduleResolution": "bundler"` + `verbatimModuleSyntax` — strict import rules apply; `vite.config.ts` uses `defineConfig` from `vitest/config` (not `vite`) so the `test` block resolves correctly

## Hard constraints — never violate

These are enforced by the architecture-validator agent. Breaking them requires deliberate intent, not a quick fix.

| Layer | Never do |
|-------|----------|
| repositories | `try/catch`, `throw`, business logic, import from `errors/` |
| services | `new Error()` for business errors — use `NotFoundError` / `ConflictError` only |
| controllers | logic inside `catch` — only `next(err)`, no `if/else` on error type |
| routes | instantiate repositories, services, or controllers — wiring lives in `app.ts` |
| frontend components | `import` from `services/` or `axios` directly |
| frontend hooks | `import axios` directly — use the axios instance from `services/api.ts` |

Non-null assertion `this.map.get(id) as Type` in repository write methods is **valid by contract** — the service always calls `findById` before any write method.

## Quality pipeline — run before every PR

In order:
```
use agent test-validator          # test coverage, patterns, isolation
use agent architecture-validator  # layer rules, import rules, FE↔BE consistency
use agent security-auditor        # OWASP / CWE / SonarQube
use agent qa-gates                # final PASS/FAIL verdict
```

Each agent writes its report to `.claude/`. The `qa-gates` agent reads them and emits the final verdict.

## Instrucciones de trabajo

Ver detalles en:
- `.claude/instructions/dev-workflow.md` — setup, servidores, cuándo ejecutar agentes
- `.claude/instructions/git-conventions.md` — commits semánticos, contributor único, reglas de push
- `.claude/instructions/claude-boundaries.md` — scope, TypeScript estricto, restricciones

## Adding a new endpoint — checklist

1. **Schema** — add Zod schema in `src/schemas/` (strings must have `.max()`)
2. **Repository** — add method signature to `IRequestRepository`, implement in `InMemoryRequestRepository`
3. **Service** — add method to `RequestService`; throw `NotFoundError` or `ConflictError` on business errors
4. **Controller** — add method with `try { service.X() → res.json({ data, error: null }) } catch(err) { next(err) }`
5. **Route** — register in `requestRoutes.ts` with `validate(schema)` middleware
6. **Test** — add to `backend/tests/requests.test.ts`: happy path + at least one error case, verify envelope (`body.data` and `body.error`)
