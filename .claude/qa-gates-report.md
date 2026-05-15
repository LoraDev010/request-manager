# QA Gates Report

**Date:** 2026-05-15  
**Agent:** qa-gates  
**Project:** /home/lora/projects/api-validator  
**Verdict:** BLOCKED

---

## Gate Summary

| # | Gate | Status | Detail |
|---|------|--------|--------|
| 1 | Backend tests pass | PASS | 11/11 tests passed |
| 2 | Backend coverage — statements (≥85%) | PASS | 94.79% |
| 3 | Backend coverage — branches (≥65%) | **FAIL** | 62.5% — threshold not met; `npm run test:coverage` exits code 1 |
| 4 | Backend coverage — functions (≥85%) | PASS | 95.83% |
| 5 | Backend coverage — lines (≥85%) | PASS | 94.62% |
| 6 | Frontend tests pass | PASS | 4/4 tests passed |
| 7 | Frontend coverage (informational) | INFO | Stmts 17.85% / Branches 9.37% — no thresholds enforced |
| 8 | Frontend lint | PASS | 0 errors, 3 warnings in generated coverage files only |
| 9 | Backend typecheck | PASS | tsc --noEmit clean |
| 10 | Frontend typecheck | PASS | tsc -b --noEmit clean |
| 11 | test-validation-report | ⚠️ STALE | Report dated 15:31; source files modified at 15:40 |
| 12 | architecture-report | ⚠️ STALE | Report dated 15:35; source files modified at 15:40 |
| 13 | security-audit-report | PASS | Report dated 15:42; all HIGH issues corrected; 1 MEDIUM pending (trust proxy, infra-dependent) |

---

## Blocking Issues

| ID | Gate | Severity | Description |
|----|------|----------|-------------|
| BLK-01 | Backend coverage — branches | FAIL | Branch coverage is 62.5%, below the enforced 65% threshold. `npm run test:coverage` exits with code 1. Uncovered branches: `validate.ts` line 7 (null body path), `errorHandler.ts` lines 25-26 (500 error path), `AppError.ts` branch instrumentation. Must add at least one of: (a) test sending null body to cover `req.body ?? {}` false branch in `validate.ts`; (b) test triggering an unhandled non-AppError to cover the 500 fallback in `errorHandler.ts`; or (c) deliberate decision to lower the branch threshold. |
| BLK-02 | test-validation-report stale | ⚠️ STALE | Report was generated at 15:31; backend source files (`requestRoutes.ts`, `validate.ts`, `tests/requests.test.ts`) were modified at 15:40 by the security-auditor agent. The test-validator must be re-run after security corrections to confirm its findings are still valid against the current codebase. |
| BLK-03 | architecture-report stale | ⚠️ STALE | Report was generated at 15:35; same source files modified at 15:40. The architecture-validator must be re-run to confirm no layer rules were violated by the new `validateParams` middleware, `idParamSchema` export, and route wiring changes introduced by security-auditor. |

---

## Test Counts

| Suite | Framework | Tests | Passed | Failed |
|-------|-----------|-------|--------|--------|
| `backend/tests/requests.test.ts` | Jest + Supertest | 11 | 11 | 0 |
| `frontend/tests/RequestCard.test.tsx` | Vitest + Testing Library | 4 | 4 | 0 |
| **Total** | | **15** | **15** | **0** |

---

## Coverage Summary

### Backend (thresholds enforced)

| Metric | Actual | Threshold | Status |
|--------|--------|-----------|--------|
| Statements | 94.79% | 85% | PASS |
| Branches | **62.5%** | **65%** | **FAIL** |
| Functions | 95.83% | 85% | PASS |
| Lines | 94.62% | 85% | PASS |

### Frontend (informational only, no thresholds)

| Metric | Actual |
|--------|--------|
| Statements | 17.85% |
| Branches | 9.37% |
| Functions | 9.52% |
| Lines | 18.51% |

---

## Agent Report Freshness

| Report | Written At | Latest Source Change | Fresh? |
|--------|------------|----------------------|--------|
| test-validation-report.md | 15:31 | 15:40 (requestRoutes.ts, validate.ts, tests/requests.test.ts) | ⚠️ STALE |
| architecture-report.md | 15:35 | 15:40 (requestRoutes.ts, validate.ts) | ⚠️ STALE |
| security-audit-report.md | 15:42 | 15:40 | CURRENT |

---

## Non-Blocking Observations (from agent reports)

| ID | Source | Severity | Description |
|----|--------|----------|-------------|
| OBS-01 | test-validator PEND-02 | MEDIUM | PATCH 200 tests do not assert `expect(res.body.error).toBeNull()` — incomplete envelope verification |
| OBS-02 | test-validator PEND-03 | MEDIUM | No repository state reset between describe blocks; GET test implicitly depends on POST tests running first |
| OBS-03 | security-auditor pending | MEDIUM | `trust proxy` not configured — affects rate limiter accuracy when deployed behind a reverse proxy |
| OBS-04 | test-validator PEND-04/05 | LOW | Frontend tests missing: button click → mutate, and button disabled state during isPending |
| OBS-05 | security-auditor pending | LOW | `VITE_API_URL` fallback is hardcoded for dev; should be required/validated in production builds |
| OBS-06 | security-auditor informativo | INFO | No authentication/authorization — acceptable for current project scope; requires auth before public exposure |

---

## Required Actions Before Re-Running QA Pipeline

1. **Fix branch coverage (BLK-01):** Add a test that covers at least one uncovered branch. The easiest fix is a POST/PATCH test that sends a request with `Content-Type: application/json` but no body, exercising the `req.body ?? {}` false branch in `validate.ts`.

2. **Re-run test-validator (BLK-02):** The security-auditor modified test code and production code after this report was written. Re-run `use agent test-validator` to regenerate a current report.

3. **Re-run architecture-validator (BLK-03):** The security-auditor introduced `validateParams`, `idParamSchema`, and route changes after this report was written. Re-run `use agent architecture-validator` to confirm no layer violations.

4. **Re-run qa-gates** after the above are resolved to obtain a final READY FOR PR verdict.
