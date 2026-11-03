# LoanDhudho — Testing Strategy Standard

**Status:** Owner Approved — implementation dependencies remain  
**Last updated:** 2026-11-04  
**Applies to:** Public marketplace, admin application, APIs, shared services, data workflows and CI/release pipelines.  
**Implementation:** Not Started

## 1. Purpose and principles

Define a repeatable method to verify correctness, financial integrity, security, privacy, accessibility and release readiness.
- Derive tests from approved page specifications and shared standards.
- Prefer fast deterministic tests close to the code, with broader tests at boundaries.
- Financial facts, authorization, audit integrity and privacy are release-critical.
- Never mark an unrun test as passed. Record failures, skips, evidence and known limitations.
- Use synthetic test data only; never copy production PII, credentials or secrets into test environments.
- Test approval does not replace owner, security, legal or compliance approval.
- This draft authorizes no application coding or test execution.

## 2. Test layers

**Unit:** Isolated domain logic and pure utilities, including EMI calculations, decimal handling, eligibility evaluation, offer applicability, freshness states, validation, localization and permission helpers. Include boundary and invalid-input cases.

**Integration:** Database and service behavior, including constraints, transactions, version history, effective dates, source evidence, imports, audit writes, authorization scopes, field redaction, cache invalidation and job re-authorization. Use an isolated database with migrations applied.

**API and contract:** HTTP methods/statuses, request validation, DTO allowlists, stable error codes, pagination, concurrency, idempotency, rate limits, OpenAPI alignment and prohibited PII endpoint absence. Internal service contracts receive equivalent validation.

**End-to-end:** Critical browser journeys using deterministic synthetic data: search, product details, comparison, calculators, admin workflows, publication, role-restricted actions and responsive behavior. No live lender dependency.

**Security and privacy:** Authentication/session controls, deny-by-default authorization, All/Assigned/Own/Aggregate scopes, object access, field redaction, CSRF where applicable, safe logs/errors, uploads, exports, rate limits, secrets and lead/customer PII exclusion. Include negative privilege-escalation and cross-scope cases.

**Accessibility and visual:** Automated accessibility checks plus keyboard and representative screen-reader review. Cover focus, labels, errors, dialogs/drawers, contrast, zoom/reflow, reduced motion and English/Hindi/Devanagari. Visual snapshots supplement, never replace, semantic/accessibility tests.

## 3. Test pyramid and cadence

- Unit tests are the broadest, fastest layer and run on every relevant change.
- Integration and contract tests run on every pull request affecting services, data or API contracts.
- Critical-path E2E tests run on pull requests and before release; maintain a small deployment smoke suite.
- Security, accessibility and visual suites run on relevant changes and scheduled/release gates; critical checks are required before release.
- Migration, import/export and data-integrity suites run whenever schema or data workflows change.
- Ordinary CI uses controlled mocks/fakes and contract fixtures, not live third-party systems.
- Runtime budgets and coverage thresholds are proposals to tune after baseline measurement.

## 4. Fixtures and environments

- Use synthetic institutions, products, rates, fees, eligibility rules, offers, staff identities and editorial content.
- Include edge fixtures for missing/unverified/stale/expired/withdrawn data, effective-date overlap, zero values, ranges, fixed/floating rates, fee tax treatment, conflicting updates, duplicate imports and malformed evidence.
- Include all four staff roles and permitted/denied cases across All/Assigned/Own/Aggregate scopes.
- Fixtures are deterministic, versioned, test-only and safe to reset; avoid shared mutable state.
- Use isolated databases/schemas, apply migrations, and clean up created records.
- Production credentials/secrets must never be available to test jobs. External services are mocked/disabled by default; sandbox credentials require explicit approval.

## 5. Database and financial integrity

- Apply migrations from an empty database in CI and verify supported upgrade paths.
- Test constraints, indexes, foreign keys, uniqueness, transaction rollback and concurrent updates.
- Verify financial history is version-preserving; corrections do not erase published history.
- Verify UTC timestamps, date-only effective/expiry fields, IST display boundaries and exact INR decimal handling.
- Test import preview/dry-run, row-level errors, duplicate detection, documented commit semantics and rollback.
- Verify audit records are append-only and critical mutations fail closed if required audit infrastructure is unavailable.

## 6. Authorization, privacy and compliance

- Test every protected operation at the server boundary; UI hiding is not security.
- Test action permission, resource scope, field redaction and re-authorization at mutation, export download and background-job execution.
- Verify Admin cannot define protected system structures, exceed delegation authority or self-elevate; Super Admin-only controls remain inaccessible to other roles.
- Verify SEO Manager cannot alter canonical lender identity or financial facts.
- Verify Sales Executive/Support remains within approved assigned scope.
- Lead/customer PII, capture, sharing and related endpoints remain disabled until separate documented legal/compliance approval and implementation gates are satisfied.
- Never interpret test approval as legal approval or permission to activate deferred functionality.

## 7. API and application security

- Test input boundaries, mass-assignment resistance, output allowlists and safe error responses.
- Test session expiry/revocation, privileged MFA and CSRF/origin protections as applicable.
- Test object/function-level authorization, ID enumeration resistance and safe 403/404 behavior.
- Test upload type/content/size validation and safe storage; reject executable CMS HTML/JS.
- Test abuse controls, bounded queries, request limits, timeouts, idempotency and replay behavior.
- Scan dependencies and repository artifacts for known vulnerabilities and accidentally committed secrets using approved CI tooling.
- Unresolved critical/high security findings block release unless an authorized, documented, time-limited risk acceptance is approved by the owner and security reviewer.

## 8. Accessibility, localization and responsive quality

- Automated checks are necessary but insufficient; manually verify keyboard-only flows and representative screen-reader paths.
- Verify landmarks/headings, accessible names, field errors, focus management and async announcements.
- Verify WCAG 2.2 AA contrast, visible focus, target size, 200% zoom, reflow and reduced motion.
- Verify English/Hindi message coverage, Devanagari glyphs/conjuncts/matras, mixed-script values, localized errors and no clipping.
- Verify mobile/tablet/desktop layouts; inherently tabular data may use accessible contained horizontal scrolling.
- Visual snapshots must be reviewed; update only for intentional changes.

## 9. CI quality gates and release criteria

Proposed pull-request gates:
1. Formatting, lint and type checks pass.
2. Unit, integration and relevant contract tests pass.
3. Build succeeds and migrations apply cleanly.
4. Security checks have no unresolved release-blocking finding.
5. Accessibility checks pass for changed components and critical journeys.
6. Critical E2E smoke tests pass for impacted journeys.
7. Pull requests expose test evidence, failures, skips and known risks.

Release gates:
- Applicable P0 acceptance tests pass; no unreviewed skipped P0 tests.
- No unresolved critical/high security defect without authorized risk acceptance.
- Authorization, audit, financial integrity and privacy tests pass.
- Accessibility review has no unresolved blocking issue.
- Migration/rollback and operational smoke plans are documented.
- Required page/standard approvals and legal/compliance gates are independently satisfied.
- Production verification is claimed only after an actual deployment and observed smoke checks; CI success is not proof of production operation.

## 10. Flaky tests and failure handling

- Tests must be deterministic and isolated; do not add arbitrary sleeps to hide races.
- Retries may diagnose flakiness but do not convert a flaky test into a pass.
- Quarantined tests require an owner, issue, reason and expiry; they remain visible and do not count as passing. Critical-path tests cannot be silently quarantined.
- Record environment, commit, test ID, reproducible inputs and sanitized logs for failures.
- Fix defects rather than weakening assertions. Update tests only when approved behavior changes.

## 11. Coverage and reporting

- Report coverage by package/domain and critical-path acceptance tests, not one aggregate percentage alone.
- Proposed initial target: at least 80% line coverage for core domain/service logic, plus explicit branch tests for financial calculations, authorization and state transitions. Tune after baseline measurement; coverage is not a substitute for meaningful assertions.
- Each tracker records test ID, status (Not Run / Passed / Failed / Blocked / Not Applicable), execution date, evidence and defect links.
- A test is Passed only after execution against the relevant build/environment and observation of its expected result.

## 12. Implementation tasks

All tasks are **Not Started** until implementation is authorized.

| Task | Priority | Scope | Status |
|---|---|---|---|
| TEST-001 | P0 | Establish test tooling, scripts and CI conventions | Not Started |
| TEST-002 | P0 | Create isolated test database and migration lifecycle | Not Started |
| TEST-003 | P0 | Build deterministic synthetic fixtures and seed/reset utilities | Not Started |
| TEST-004 | P0 | Unit-test patterns for domain and financial logic | Not Started |
| TEST-005 | P0 | Service/database integration test patterns | Not Started |
| TEST-006 | P0 | API and internal contract test patterns | Not Started |
| TEST-007 | P0 | Authorization/scope negative-test matrix | Not Started |
| TEST-008 | P0 | Privacy, audit and sensitive-data boundary tests | Not Started |
| TEST-009 | P0 | Critical browser E2E journeys and smoke suite | Not Started |
| TEST-010 | P1 | Accessibility automation and manual review checklist | Not Started |
| TEST-011 | P1 | Visual regression and responsive viewport coverage | Not Started |
| TEST-012 | P1 | Localization and Devanagari rendering coverage | Not Started |
| TEST-013 | P0 | Migration, financial history and import integrity tests | Not Started |
| TEST-014 | P1 | Dependency/secret scanning and security regression checks | Not Started |
| TEST-015 | P1 | Flaky-test quarantine, evidence and reporting | Not Started |
| TEST-016 | P1 | Coverage reporting and release quality-gate automation | Not Started |

## 13. Acceptance tests

All tests begin as **Not Run**.

| Test | Expected result |
|---|---|
| TEST-T01 | Unit, integration, contract and E2E responsibilities and triggers are documented. |
| TEST-T02 | Test database is isolated and migrations apply from empty state. |
| TEST-T03 | Fixtures are deterministic, synthetic and contain no production PII/secrets. |
| TEST-T04 | Financial calculations cover normal, boundary, zero-rate and invalid inputs. |
| TEST-T05 | Financial decimals, units, date-only values, UTC storage and IST boundaries are verified. |
| TEST-T06 | Transactions roll back safely and stale concurrent writes cannot overwrite newer data. |
| TEST-T07 | Version/effective-date history and append-only audit behavior are preserved. |
| TEST-T08 | Imports are previewed/validated; duplicate, malformed and rollback cases are covered. |
| TEST-T09 | API validation, DTO allowlists and stable error contracts are verified. |
| TEST-T10 | Pagination, filters, sorting, idempotency and rate limits are bounded and deterministic. |
| TEST-T11 | Every protected route/service action is tested server-side for allowed and denied roles. |
| TEST-T12 | All/Assigned/Own/Aggregate scopes and field redaction prevent cross-scope disclosure. |
| TEST-T13 | Admin cannot self-elevate or modify Super Admin-only structures. |
| TEST-T14 | SEO Manager cannot mutate canonical lender identity or financial facts. |
| TEST-T15 | Sales Executive/Support remains within approved permissions and scope. |
| TEST-T16 | Lead/customer PII and capture/sharing endpoints remain disabled before separate approval. |
| TEST-T17 | Critical audit/authorization infrastructure failures fail closed for protected mutations. |
| TEST-T18 | Logs, errors, metrics and test artifacts contain no secrets or unnecessary PII. |
| TEST-T19 | Session expiry/revocation, privileged MFA and CSRF protections are tested as applicable. |
| TEST-T20 | Uploads and CMS content reject unsafe types, executable markup and oversized files. |
| TEST-T21 | Critical public/admin journeys pass deterministic browser E2E tests. |
| TEST-T22 | Keyboard-only navigation, focus management and accessible names are verified. |
| TEST-T23 | Contrast, zoom/reflow, reduced motion and screen-reader paths are reviewed. |
| TEST-T24 | English/Hindi localization and Devanagari rendering receive automated/manual coverage. |
| TEST-T25 | Responsive behavior is checked at representative mobile, tablet and desktop widths. |
| TEST-T26 | Visual regression changes require review and do not replace semantic/accessibility tests. |
| TEST-T27 | CI gates formatting, lint, types, build, relevant tests and migration checks. |
| TEST-T28 | Security/dependency/secret checks block release for unresolved critical/high findings. |
| TEST-T29 | Flaky/quarantined tests remain visible and are never reported as passing. |
| TEST-T30 | Release requires applicable P0 tests, approvals, privacy/security gates and evidence. |

## 14. Owner review decisions

Please approve or revise:
1. Approved: test pyramid and responsibilities across unit, integration, API/contract, E2E, security/privacy and accessibility/visual testing.
2. Approved: deterministic synthetic fixtures only; no production PII or real credentials in test environments.
3. Approved: negative authorization tests, financial/data integrity tests and continued exclusion of lead/customer PII.
4. Approved: CI pull-request gates and stricter release criteria for P0, security, audit, accessibility and compliance.
5. Approved: flaky-test quarantine policy, evidence recording and status discipline.
6. Approved as an initial target: 80% line coverage for core domain/service logic, with critical branch tests; review against baseline measurement.
7. Approved: automated plus manual accessibility/localization checks and visual regression as a supplementary control.
8. Approved: no live lender integrations or production customer flows in ordinary automated tests.

## 15. Approval and implementation record

- **Owner decision:** Approved as documented on 2026-11-04.
- **Implementation:** Not Started.
- **Testing:** All 30 acceptance tests remain Not Run.
- **Dependencies:** Approved Authorization, Data Governance, Admin Shell, Design System and API Conventions; repository architecture/dependency inspection; authentication/session decisions; legal/compliance gates.
- **Boundary:** This standard does not authorize application implementation, production deployment, live lender integrations, lead capture or customer PII processing.
