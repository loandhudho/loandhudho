# LoanDhudho — Global Working Rules

**Status:** Proposed; owner approval pending  
**Last updated:** 2026-11-02

## 1. Mandatory delivery sequence

For every page or capability:

1. Analyze purpose, users, workflows, data, permissions, edge cases, dependencies and risks.
2. Write/update the page-specific specification, ordered tasks and acceptance tests.
3. Identify decisions that require product-owner input.
4. Obtain explicit owner approval before feature coding.
5. Implement only the approved scope.
6. Run the documented tests and record actual evidence.
7. Update the page document and unified tracker.
8. Recommend the single next best task.

No feature coding begins while its specification is missing, materially incomplete or awaiting a decision. Documentation, repository inspection and test planning may proceed.

## 2. Source of truth

- `docs/MASTER_EXECUTION_PLAN.md`: unified phases, page inventory, dependencies, status and next focus.
- `docs/admin/`: one specification per admin page.
- `docs/frontend/`: one specification per public page.
- `docs/standards/`: cross-page design, data, security, SEO and QA standards.
- `docs/PRODUCT_PLAN.md`: high-level product direction.
- If a decision changes, update every affected page document and the master tracker together.

## 3. Status definitions

| Status | Meaning |
|---|---|
| Not Started | Listed; analysis has not begun. |
| In Analysis | Requirements and risks are being investigated. |
| Awaiting Decision | Owner input blocks completion of the specification or implementation. |
| Documented | Scope, tasks and acceptance tests are written. |
| Approved | Owner explicitly approved the documented scope. |
| In Progress | Approved implementation is underway. |
| Blocked | Work cannot proceed; blocker and owner are recorded. |
| Implemented | Code exists; verification is incomplete. |
| Testing | Documented tests are executing. |
| Verified | Required tests passed and evidence is recorded. |
| Deferred | Explicitly moved out of current scope with reason. |

Never mark Verified based only on code review or assumed results. A skipped test is not a pass.

## 4. Page specification requirements

Each page document must cover:
- Purpose, user roles, entry points and expected outcomes.
- Scope and explicit out-of-scope items.
- User stories and end-to-end workflows.
- Information architecture and loading, empty, error, success, disabled and denied states.
- Fields, validation, filters, sorting, pagination and bulk actions as relevant.
- Data entities, provenance, lifecycle and state transitions.
- Role/permission matrix and server-side enforcement.
- API/server action behavior and failure handling.
- Accessibility, responsive behavior, English/Hindi localization and light/dark themes.
- Security, privacy, audit and compliance implications.
- Dependencies, open decisions and assumptions.
- Ordered tasks with stable IDs, priority, dependencies and status.
- Observable acceptance criteria and test cases.
- Definition of Done and release/rollback considerations.

## 5. Task conventions

- Stable IDs: `ADM-DASH-001`, `ADM-INST-001`, `FE-HOME-001`.
- Priority: P0 release/security blocker; P1 MVP critical; P2 important; P3 later enhancement.
- Never reuse retired task IDs.
- Every task has one status and explicit dependencies where applicable.
- Keep tasks independently implementable and verifiable.

## 6. Product-wide rules

- Mobile-first, responsive, accessible and usable on low-bandwidth connections.
- English default and Hindi supported; no untranslated UI strings in supported locales.
- Light/dark themes use semantic tokens and readable contrast.
- Use INR, Indian number formatting and India-relevant address/phone conventions. Display business dates/times in IST unless a workflow requires otherwise.
- LoanDhudho is a discovery/comparison platform, not a lender. Never promise approval, guaranteed rates or disbursal.
- Distinguish lender-sourced facts, editorial explanations, estimates and sponsored placements.
- Rates, fees, eligibility claims and offers require source and freshness metadata before publication.
- Never invent lender data, partnerships, rates, fees or eligibility rules. Label missing data as unavailable.
- Store money as decimal/numeric, with explicit units for rates, durations and percentages. Preserve financial-data history.

## 7. Security, privacy and compliance

- Authenticate and authorize server-side on every protected page, API and mutation. Hiding a control is not authorization.
- Least privilege; deny by default.
- Audit sensitive admin actions with actor, action, target, timestamp and relevant before/after values.
- Never request/store banking OTPs, PINs, banking passwords or UPI credentials.
- Do not activate lead transmission, lender integrations or application facilitation before documented legal/compliance approval and required agreements.
- Obtain explicit purpose-specific consent naming recipients before personal data sharing.
- Minimize personal data and define retention, access, export and deletion behavior before collection.
- Treat uploads, URLs and imported content as untrusted input.
- Keep secrets out of source control and logs.

## 8. Engineering and QA

- Inspect repository conventions before changing architecture or adding dependencies.
- Prefer a modular monolith until measured scale justifies otherwise.
- Validate external input server-side; use database constraints and transactions for integrity-sensitive operations.
- Add tests with implementation.
- Quality gates: lint/format, typecheck, relevant unit/integration tests, affected Playwright flows and production build before release.
- Test permissions, invalid input, empty/failure states and data freshness, not only happy paths.
- Never claim a test passed unless it actually ran and its result was observed.
- No production deployment without explicit release approval.

## 9. Completion reporting

Report changed paths, completed and remaining task IDs, actual test outcomes, limitations/risks, updated statuses and one next recommended task.

A page is Verified only when all P0/P1 acceptance criteria pass, required tests are evidenced, permission/security checks pass and no unresolved blocker remains. Deferred work must remain visible.

## 10. Owner decisions

A page moves from Documented to Approved only after explicit owner confirmation. Ask one concise question at a time, only when the answer materially changes product behavior, risk, scope or implementation cost.


## 11. Owner-defined admin roles

The initial admin role model is defined in [Admin Authorization and Role Standard](./standards/authorization.md): Super Admin, Admin, SEO Manager, and Sales Executive / Support. This replaces provisional role labels in earlier drafts. Every page specification must use this role model and the permission boundaries in that standard. Role names alone never authorize an action; enforce effective permissions and record scope server-side. Lead/customer PII access remains disabled until the legal/compliance gate is approved.


## 12. Confirmed Admin operational authority

The owner confirmed on 2026-11-02 that Admin can perform all day-to-day marketplace operations, including adding, editing, reviewing, approving and publishing institution/bank records, loan products, rates, fees, eligibility data and offers. Admin's sole structural boundary is that Admin cannot define or change system structures: role types/definitions, permission definitions/templates, entity types, controlled option catalogues, status definitions or global security structure. Super Admin owns those structures. Do not impose mandatory second-person approval on routine financial-data publication; preserve evidence, validation, version history and audit logs. Optional maker-checker safeguards for selected high-risk changes require a separate future decision.
