# Test Validation Report

**Date:** 2026-05-15  
**Agent:** test-validator  
**Project:** /home/lora/projects/api-validator

---

## 1. Test Discovery

| File | Framework | Count |
|------|-----------|-------|
| `backend/tests/requests.test.ts` | Jest + Supertest | 10 tests |
| `frontend/tests/RequestCard.test.tsx` | Vitest + Testing Library | 4 tests |
| `frontend/tests/setup.ts` | Setup file | n/a |

---

## 2. Test Execution Results

### Backend
- **Status:** PASS (10/10)
- **Runner:** `jest --runInBand`
- **Suites:** 1 passed

### Frontend
- **Status:** PASS (4/4)
- **Runner:** `vitest run`
- **Suites:** 1 passed

---

## 3. Backend Validation (TB-01 → TB-08)

### TB-01 — Jest Config Correctness
| Check | Result | Notes |
|-------|--------|-------|
| preset: ts-jest | PASS | correctly set |
| testEnvironment: node | PASS | correct for HTTP tests |
| roots: ['<rootDir>/tests'] | PASS | correct |
| collectCoverageFrom excludes app.ts | PASS | `!src/app.ts` excludes unreachable listen branch |
| coverageThreshold key spelling | **FAIL → FIXED** | Was `coverageThresholds` (typo); corrected to `coverageThreshold` — thresholds were silently ignored before this fix |

**Correction applied (§7):** `jest.config.js` key renamed from `coverageThresholds` → `coverageThreshold`.

### TB-02 — Integration Test Pattern
| Check | Result | Notes |
|-------|--------|-------|
| Uses `supertest` against real `app` | PASS | `import app from '../src/app'` |
| No mocks for controllers/services/repositories | PASS | Full stack exercised end-to-end |
| Tests HTTP contract (status codes + envelope) | PASS | All tests check `res.status` and `res.body` |
| Uses `--runInBand` for sequential execution | PASS | Set in npm script |

### TB-03 — Coverage: POST /requests
| Test Case | Present | Envelope Assertion |
|-----------|---------|-------------------|
| 400 when title missing | PASS | `error.code === 'VALIDATION_ERROR'` |
| 400 when title is empty string | PASS | `error.code === 'VALIDATION_ERROR'` |
| 201 with PENDING status, correct title | PASS | `data.status`, `data.title`, `error === null` |

### TB-04 — Coverage: GET /requests
| Test Case | Present | Envelope Assertion |
|-----------|---------|-------------------|
| 200 with data array | PASS | `Array.isArray(data)`, `error === null` |
| **Missing: verify data is empty initially** | WARN | GET relies on cross-test pollution (state from POST tests leaks in) — see TB-07 |

### TB-05 — Coverage: PATCH /requests/:id
| Test Case | Present | Envelope Assertion |
|-----------|---------|-------------------|
| 200 APPROVED | PASS | `data.status === 'APPROVED'` |
| 200 REJECTED | PASS | `data.status === 'REJECTED'` |
| 409 already APPROVED | PASS | `error.code === 'REQUEST_ALREADY_PROCESSED'` |
| 409 already REJECTED | PASS | `error.code === 'REQUEST_ALREADY_PROCESSED'` |
| 404 non-existent id | PASS | `error.code === 'REQUEST_NOT_FOUND'` |
| 400 invalid status | PASS | `error.code === 'VALIDATION_ERROR'` |
| **Missing: `error === null` check on 200 cases** | WARN | PATCH 200 tests assert `data.status` but do not assert `error === null` |

### TB-06 — Envelope Assertions
| Endpoint | `body.data` checked | `body.error` checked |
|----------|--------------------|--------------------|
| POST 400 | implicit (not present) | `error.code` checked |
| POST 201 | `data.status`, `data.title` | `error === null` |
| GET 200 | `Array.isArray(data)` | `error === null` |
| PATCH 200 | `data.status` | **NOT checked** — missing `expect(res.body.error).toBeNull()` |
| PATCH 409 | implicit | `error.code` checked |
| PATCH 404 | implicit | `error.code` checked |
| PATCH 400 | implicit | `error.code` checked |

**PENDING:** PATCH 200 tests (approve + reject) do not verify `res.body.error === null`. Add assertions. No automated fix applied — test authorship requires confirmation.

### TB-07 — State Isolation
| Check | Result | Notes |
|-------|--------|-------|
| `PATCH` describe uses `beforeEach` to create fresh request | PASS | `requestId` recreated before each test |
| `GET /requests` test isolated from `POST` suite state | **WARN** | Repository is a module-level singleton in `app.ts`. POST tests run first (3 requests created) and state persists into GET. GET only checks `Array.isArray` — not empty array — which is why this passes but is not order-independent |
| No `afterEach` cleanup / `afterAll` reset | **WARN** | No repository reset between describe blocks; tests pass only because execution order is deterministic with `--runInBand` |

**PENDING:** Add `afterEach` or `afterAll` cleanup in the test file, or expose a `reset()` method on the repository. Requires new test code — not auto-fixed.

### TB-08 — Test Quality
| Check | Result |
|-------|--------|
| Tests check HTTP semantics (not implementation) | PASS |
| No `describe.only` / `it.only` / `xit` | PASS |
| No hardcoded UUIDs in test expectations | PASS |
| `requestId` properly scoped to PATCH describe block | PASS |
| Business rules verified: PENDING-only mutation | PASS (409 tests) |
| Business rules verified: status starts as PENDING | PASS (POST 201 test) |

---

## 4. Coverage Report (Backend)

### npm run test:coverage — after fix

| File | Stmts | Branch | Funcs | Lines | Status |
|------|-------|--------|-------|-------|--------|
| requestController.ts | 90% | 100% | 100% | 90% | PASS |
| AppError.ts | 90.9% | 0% | 75% | 90.9% | WARN |
| errorHandler.ts | 86.66% | 100% | 100% | 85.71% | PASS |
| validate.ts | 100% | 50% | 100% | 100% | WARN |
| InMemoryRequestRepository.ts | 100% | 100% | 100% | 100% | PASS |
| requestRoutes.ts | 100% | 100% | 100% | 100% | PASS |
| requestSchema.ts | 100% | 100% | 100% | 100% | PASS |
| requestService.ts | 100% | 100% | 100% | 100% | PASS |
| **ALL FILES** | **94.31%** | **62.5%** | **95.45%** | **94.18%** | |

### Threshold Results (now enforced after fix)
| Metric | Actual | Threshold | Status |
|--------|--------|-----------|--------|
| Statements | 94.31% | 85% | PASS |
| Branches | **62.5%** | **65%** | **FAIL** |
| Functions | 95.45% | 85% | PASS |
| Lines | 94.18% | 85% | PASS |

### Branch Coverage Gap Analysis
- `validate.ts` line 7: `req.body ?? {}` — the false branch (body is null/undefined) is never exercised. All test requests include a body.
- `errors/AppError.ts`: `ValidationError` constructor (line 26) never instantiated directly in tests. It's only reached via Zod parse paths — but the branch instrumentation shows 0%.
- `errorHandler.ts` lines 25-26: 500 Internal Error path never triggered (no test sends a request that causes an unhandled non-AppError, non-ZodError exception).

**PENDING:** Branch coverage is 62.5% — 2.5 percentage points below the 65% threshold enforced by `coverageThreshold`. The `npm run test:coverage` command now exits with code 1. Requires one or more of:
1. Test for `validate.ts` null-body branch (send Content-Type application/json with no body)
2. Test for `errorHandler.ts` 500 path (inject unhandled error)
3. Lower branch threshold to 60% if intentional — requires deliberate decision

---

## 5. Frontend Validation (TF-01 → TF-04)

### TF-01 — Vitest Config
| Check | Result | Notes |
|-------|--------|-------|
| `defineConfig` from `vitest/config` (not `vite`) | PASS | Correct import |
| `environment: 'jsdom'` | PASS | Required for DOM testing |
| `setupFiles: './tests/setup.ts'` | PASS | Imports `@testing-library/jest-dom` |
| `globals: true` | PASS | Allows `describe`/`it`/`expect` globally |
| No coverage thresholds | PASS | Documented as intentional in config comment |
| `@testing-library/jest-dom` in setup | PASS | Enables `toBeInTheDocument()` matchers |

### TF-02 — Mocks
| Check | Result | Notes |
|-------|--------|-------|
| `vi.mock('../src/services/api')` used | PASS | Prevents real HTTP calls |
| Mocked at correct granularity (service layer) | PASS | `updateRequestStatus` mocked |
| Hook (`useUpdateRequest`) not mocked directly | PASS | Tests behavior through real hook wrapping the mocked service |
| Component does not import `axios` directly | PASS | `RequestCard` imports only from `hooks/useRequests` |

### TF-03 — QueryClientProvider
| Check | Result | Notes |
|-------|--------|-------|
| `QueryClientProvider` wraps all renders | PASS | `wrap()` helper ensures consistent wrapping |
| `retry: false` on QueryClient | PASS | Prevents test hangs on failed queries |
| QueryClient instance shared across tests in describe | WARN | Single `queryClient` is module-level; state may persist across tests if mutations trigger cache updates. No `beforeEach(() => queryClient.clear())` present. In practice not an issue here since no mutations are invoked in tests (buttons are rendered but not clicked), but is a fragility. |

### TF-04 — Frontend Test Coverage
| Test Case | Present | Behavior vs Implementation |
|-----------|---------|--------------------------|
| PENDING: shows Aprobar + Rechazar buttons | PASS | Behavior check (text content) |
| APPROVED: no action buttons | PASS | Behavior check |
| REJECTED: no action buttons | PASS | Behavior check |
| Badge label per status (Pendiente/Aprobada/Rechazada) | PASS | Behavior check |
| **Missing: button click triggers mutate** | WARN | No `userEvent.click` test verifying that clicking Aprobar/Rechazar calls `updateRequestStatus` |
| **Missing: disabled state during isPending** | WARN | No test for `isPending=true` state (buttons disabled) |

### Frontend Selectors
| Check | Result |
|-------|--------|
| `getByText` / `queryByText` used (semantic) | PASS |
| No test-ids (getByTestId) used | PASS |
| No snapshot tests | PASS |
| Tests check rendered text, not CSS classes | PASS |

---

## 6. Cross-Validation: Tests vs Business Rules

| Business Rule | Tested | Notes |
|---------------|--------|-------|
| `status` starts as `PENDING` on creation | PASS | POST 201 test |
| Only `PENDING` requests can be approved → `ConflictError` if already APPROVED | PASS | PATCH 409 test |
| Only `PENDING` requests can be rejected → `ConflictError` if already REJECTED | PASS | PATCH 409 test |
| PATCH accepts only `{ status: "APPROVED" \| "REJECTED" }` | PASS | 400 on invalid status |
| Error codes match spec: `VALIDATION_ERROR`, `REQUEST_NOT_FOUND`, `REQUEST_ALREADY_PROCESSED` | PASS | All 3 verified |
| Response envelope `{ data, error }` | PARTIAL | `error: null` not asserted on all success paths |
| Frontend only shows action buttons for PENDING | PASS | TF tests verify this |
| Frontend badge labels match Spanish strings | PASS | TF test verifies Pendiente/Aprobada/Rechazada |

---

## 7. Corrections Applied (Automatic)

| ID | File | Change | Rationale |
|----|------|--------|-----------|
| FIX-01 | `backend/jest.config.js` | `coverageThresholds` → `coverageThreshold` | Jest was silently ignoring the typo'd key and emitting a Validation Warning. Coverage thresholds were never enforced. This is a mechanical config key correction per §7. |

---

## 8. Pending Issues (Require Human Action)

| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| PEND-01 | HIGH | Coverage | Branch coverage 62.5% < 65% threshold (now enforced after FIX-01). `npm run test:coverage` exits with code 1. Add test for null-body path in `validate.ts` or for the 500-error path in `errorHandler.ts` |
| PEND-02 | MEDIUM | Envelope | PATCH 200 tests (approve + reject) do not assert `expect(res.body.error).toBeNull()` — incomplete envelope verification |
| PEND-03 | MEDIUM | Isolation | No repository state reset between describe blocks. GET test implicitly depends on POST tests running first. Add `afterAll` or expose `reset()` on InMemoryRequestRepository |
| PEND-04 | LOW | Frontend | No `userEvent.click` test verifying Aprobar/Rechazar buttons call `updateRequestStatus` |
| PEND-05 | LOW | Frontend | No test for button disabled state when `isPending === true` |
| PEND-06 | LOW | Frontend | Module-level `QueryClient` shared across all tests without `queryClient.clear()` in `beforeEach` — potential cross-test cache pollution if mutations are added to tests later |

---

## 9. Final Verdict

| Area | Status |
|------|--------|
| Backend tests pass | PASS (10/10) |
| Frontend tests pass | PASS (4/4) |
| Backend config correctness | PASS (after FIX-01) |
| Backend coverage — statements/functions/lines | PASS (94%/95%/94%) |
| Backend coverage — branches | **FAIL** (62.5% < 65%) |
| Frontend config correctness | PASS |
| Envelope assertions complete | PARTIAL |
| State isolation | PARTIAL |
| Business rule coverage | PASS |

**Overall: CONDITIONAL PASS** — all tests pass, config typo fixed, but `test:coverage` exits with code 1 due to branch coverage gap (PEND-01). Resolve before merging.
