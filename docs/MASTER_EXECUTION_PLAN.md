# LoanDhudho — Unified Page-by-Page Execution Plan

**Status:** Active execution tracker  
**Last updated:** 2026-11-02  
**Method:** Document → approve → code → test → update status → choose next task

## 1. Operating model

This file is the cross-project source of truth for phases, page inventory, dependencies, status and next focus. Detailed requirements, tasks and test cases belong in each page document.

- [Global working rules](./WORKING_RULES.md)
- [Product and technical plan](./PRODUCT_PLAN.md)

A page is not ready for feature implementation until its specification is complete and explicitly approved. Update this tracker whenever page status, dependencies, phase gates or next focus change.

## 2. Phases and exit gates

| Phase | Name | Exit gate | Status |
|---|---|---|---|
| 0 | Governance and discovery | Approve global rules, sitemap, roles, data principles, compliance boundaries and delivery workflow. | In Progress |
| 1 | Admin page analysis/specifications | Every MVP admin page and shared admin workflow documented and approved. | Not Started |
| 2 | Admin foundation and implementation | Auth, RBAC, shell, audit foundation and approved admin pages implemented/tested. | Not Started |
| 3 | Public frontend specifications | Public pages and shared journeys documented and approved page by page. | Not Started |
| 4 | Public frontend implementation | Approved public pages, search, comparison and calculators implemented/tested. | Not Started |
| 5 | Integration and controlled launch | Data verification, legal review, security, accessibility, SEO and release checks complete. | Not Started |
| 6 | Post-launch improvement | Priorities based on measured search, conversion, freshness and support data. | Not Started |

Phase overlap requires explicit dependencies and owner approval. No page skips its documentation and approval gate.

## 3. Admin page inventory

Admin is analyzed before public frontend. Page documents are created during their analysis turn; an inventory link may therefore point to a planned document not yet created.

| Order | Page | Specification | Status | Key dependency |
|---:|---|---|---|---|
| A01 | Dashboard | [dashboard.md](./admin/dashboard.md) | Owner Approved | Authorization standard and metric definitions |
| A02 | Institutions | [institutions.md](./admin/institutions.md) | Owner Approved | Institution data model and authorization standard |
| A03 | Loan Categories | [loan-categories.md](./admin/loan-categories.md) | Owner Approved | Product-centric taxonomy and authorization boundaries |
| A04 | Loan Products | [loan-products.md](./admin/loan-products.md) | Owner Approved | Institutions and categories |
| A05 | Rates and History | [rates.md](./admin/rates.md) | Owner Approved | Products and source records |
| A06 | Fees and Charges | [fees.md](./admin/fees.md) | Owner Approved | Products, rates boundary and sources |
| A07 | Eligibility Rules | [eligibility.md](./admin/eligibility.md) | Owner Approved | Products, rates and fees |
| A08 | Offers | [offers.md](./admin/offers.md) | Owner Approved | Products, rates, fees, eligibility and sources |
| A09 | Intents and Search Mappings | [intents.md](./admin/intents.md) | Owner Approved | Categories, product records and bilingual search |
| A10 | Landing Pages | [landing-pages.md](./admin/landing-pages.md) | Owner Approved | Intents/categories and SEO |
| A11 | Content and Guides | [content.md](./admin/content.md) | Owner Approved | Localization/editorial workflow and source governance |
| A12 | Leads | [leads.md](./admin/leads.md) | Deferred | Legal approval, consent and agreements |
| A13 | Users and Roles | [users-and-roles.md](./admin/users-and-roles.md) | Owner Approved | Authentication, authorization and audit model |
| A14 | Audit Logs | [audit-logs.md](./admin/audit-logs.md) | Owner Approved — policy-specific gates remain | Event taxonomy, append-only storage, integrity, authorization and retention policy |
| A15 | Settings | [settings.md](./admin/settings.md) | Owner Approved | Configuration ownership/security, A13/A14 and shared standards |
| A16 | Content Studio — Static Pages, News and Blogs | [content-studio.md](./admin/content-studio.md) | Scope Draft — Owner Review Pending | Admin Shell, authorization, CMS data model, SEO/media, legal/editorial review gates |

## 4. Public frontend page inventory

Frontend analysis starts after the admin analysis sequence unless the owner explicitly changes the order.

| Order | Page | Specification | Status |
|---:|---|---|---|
| F01 | Homepage and intent search | [homepage.md](./frontend/homepage.md) | Not Started |
| F02 | All loan categories | [loans-index.md](./frontend/loans-index.md) | Not Started |
| F03 | Loan category detail | [loan-category.md](./frontend/loan-category.md) | Not Started |
| F04 | Loan product detail | [loan-product-detail.md](./frontend/loan-product-detail.md) | Not Started |
| F05 | Institution directory | [institutions-index.md](./frontend/institutions-index.md) | Not Started |
| F06 | Institution profile | [institution-profile.md](./frontend/institution-profile.md) | Not Started |
| F07 | Offers listing | [offers-index.md](./frontend/offers-index.md) | Not Started |
| F08 | Offer detail | [offer-detail.md](./frontend/offer-detail.md) | Not Started |
| F09 | Product comparison | [compare.md](./frontend/compare.md) | Not Started |
| F10 | EMI calculator | [emi-calculator.md](./frontend/emi-calculator.md) | Not Started |
| F11 | Eligibility calculator | [eligibility-calculator.md](./frontend/eligibility-calculator.md) | Not Started |
| F12 | Balance transfer calculator | [balance-transfer-calculator.md](./frontend/balance-transfer-calculator.md) | Not Started |
| F13 | Guides index and detail | [guides.md](./frontend/guides.md) | Not Started |
| F14 | About | [about.md](./frontend/about.md) | Not Started |
| F15 | Contact and grievance | [contact.md](./frontend/contact.md) | Not Started |
| F16 | Privacy policy | [privacy-policy.md](./frontend/privacy-policy.md) | Not Started |
| F17 | Terms | [terms.md](./frontend/terms.md) | Not Started |
| F18 | Disclaimer | [disclaimer.md](./frontend/disclaimer.md) | Not Started |
| F19 | News index | Defined in [FRONTEND_PAGE_PLAN.md](./FRONTEND_PAGE_PLAN.md) | Not Started |
| F20 | News detail | Defined in [FRONTEND_PAGE_PLAN.md](./FRONTEND_PAGE_PLAN.md) | Not Started |
| F21 | Blog index | Defined in [FRONTEND_PAGE_PLAN.md](./FRONTEND_PAGE_PLAN.md) | Not Started |
| F22 | Blog detail | Defined in [FRONTEND_PAGE_PLAN.md](./FRONTEND_PAGE_PLAN.md) | Not Started |
| F23 | CMS static page template | Defined in [FRONTEND_PAGE_PLAN.md](./FRONTEND_PAGE_PLAN.md) | Not Started |
| F24 | Search results | Defined in [FRONTEND_PAGE_PLAN.md](./FRONTEND_PAGE_PLAN.md) | Not Started |

## 5. Shared standards to define

| Standard | Document | Status |
|---|---|---|
| Admin navigation, shell and responsive behavior | [admin-shell.md](./standards/admin-shell.md) | Owner Approved — implementation dependencies remain |
| Authentication, roles and permission matrix | [authorization.md](./standards/authorization.md) | Owner Approved — implementation gates remain |
| Design tokens, components, accessibility and themes | [design-system.md](./standards/design-system.md) | Owner Approved — implementation dependencies remain |
| Data provenance, freshness, review and history | [data-governance.md](./standards/data-governance.md) | Owner Approved — implementation gates remain |
| API conventions, validation and error model | [api-conventions.md](./standards/api-conventions.md) | Draft — Owner Review Pending |
| Test strategy and release gates | [testing-strategy.md](./standards/testing-strategy.md) | Not Started |

## 6. Progress summary

- Global rules: drafted; awaiting owner approval.
- Page specs documented: 14 (A01–A11 and A13–A15). All 14 documented admin page specifications (A01–A11 and A13–A15) are owner-approved; A12 Leads remains deferred pending legal/compliance approval.
- Pages approved for coding: 14 (A01–A11 and A13–A15); implementation remains gated by shared standards and dependencies. A12 Leads is excluded; A14/A15 and A13 retain policy/security-specific gates in their specifications.
- Pages implemented and verified under this workflow: 0.
- Lead management: deferred pending legal/compliance gate.

## 7. Current focus

**Active focus:** Shared standards — API Conventions  
**Current status:** Design System was owner-approved on 2026-11-04; its 13 implementation tasks and 24 acceptance tests remain Not Started/Not Run. API Conventions is documented as a draft for owner review; its 14 implementation tasks and 26 acceptance tests remain Not Started/Not Run. Data Governance was owner-approved on 2026-11-02. Its 12 implementation tasks and 28 acceptance tests remain Not Started/Not Run; approval does not activate lead/customer PII or bypass legal/security gates. The Admin Shell standard was owner-approved on 2026-11-02. Its 10 implementation tasks and 20 acceptance tests remain Not Started/Not Run; no shell implementation has started.  
**Next action:** Obtain owner review of API Conventions. After approval, define Testing Strategy, then begin page-by-page frontend specifications with F01 Homepage and Intent Search when shared standards are sufficiently defined. Obtain owner review of A16 Content Studio. A12 Leads remains deferred pending legal/compliance approval.

**Product objective:** Broad verified bank/NBFC coverage; lender-specific products, rates, fees, eligibility and offers; like-for-like comparison; calculators; and lead capture only after legal/compliance approval.  
**Coding gate:** Closed until the relevant shared standards (including authorization and data governance) and page-specific dependencies are approved.

## 8. Change log

| Date | Change |
|---|---|
| 2026-11-02 | Created unified phase and page inventory; established admin-first analysis sequence. |
| 2026-11-02 | Added owner-defined four-role admin model; synchronized A01/A02 and shared authorization status; set A03 as next focus. |
| 2026-11-02 | Owner approved A01 Dashboard, A02 Institutions and A03 Loan Categories; documented A04 Loan Products with data contract, linked-record boundaries, lifecycle, workflows, tasks and 24 acceptance tests; set A05 as next focus. |
| 2026-11-02 | Documented A05 Rates and History with product-linked rate model, conditional bands, floating-rate details, effective dating/history, source verification, bulk-import workflow, public display rules, 14 tasks and 28 acceptance tests; set A06 as next focus. |
| 2026-11-02 | Adjusted proposed rate review cadence to a 90-day reminder / 180-day stale threshold with event-triggered checks; documented A06 Fees and Charges with 18 tasks and 30 acceptance tests; set A07 as next focus. |
| 2026-11-02 | Owner approved A04 Loan Products, A05 Rates and History and A06 Fees and Charges; recorded approvals in each specification. Documented A07 Eligibility Rules with 16 tasks and 29 acceptance tests; set A08 Offers as next focus. |
| 2026-11-02 | Documented A08 Offers with product-linked promotional benefit model, A05/A06 baseline links, A07 eligibility boundaries, validity/freshness, stacking, source evidence, 17 tasks and 32 acceptance tests; set A09 as next focus. |
| 2026-11-02 | Documented A09 Intents and Search Mappings with canonical-category separation, English/Hindi/Romanized Hindi phrase model, conservative PostgreSQL full-text/pg_trgm search, ambiguity/negation behavior, privacy-safe diagnostics, 16 tasks and 28 acceptance tests; set A10 as next focus. |
| 2026-11-02 | Added A10 Landing Pages specification with canonical-record references, typed content blocks, SEO/localization, lifecycle/revisions, quality gates, privacy boundaries, 18 tasks and 30 acceptance tests; set A11 Content and Guides as next focus. |
| 2026-11-02 | Added A11 Content and Guides specification covering editorial content types, claim-level source evidence, financial-education safety, English/Hindi localization, revisions, publication, SEO, privacy, 18 tasks and 30 acceptance tests; kept A12 Leads deferred and set A13 Users and Roles as next focus. |
| 2026-11-02 | Added A13 Users and Roles specification covering staff invitations, owner-defined role boundaries, delegated permissions, account lifecycle, MFA/session controls, audit requirements, privacy boundaries, 18 tasks and 32 acceptance tests; kept A12 Leads deferred and set A14 Audit Logs as next focus. |

| 2026-11-02 | Added A14 Audit Logs specification covering the event taxonomy and structured event envelope, transactional/outbox capture, append-only storage, integrity checkpoints, role/scope controls, search/detail, controlled export, retention/legal holds, monitoring, 18 tasks and 32 acceptance tests; kept A12 Leads deferred. |

| 2026-11-02 | Recorded owner acceptance of all eight A14 recommendations: operational audit visibility for Admin with security-event grants controlled separately; narrowly scoped IP/user-agent collection subject to privacy approval; retention classes without guessed durations; export and annotations deferred from MVP; append-only/hash/checkpoint integrity design; fail-closed critical mutations; and narrowly scoped future two-person controls subject to security review. Marked A14 owner-approved with explicit policy gates and advanced focus to A15 Settings. |

| 2026-11-02 | Recorded owner approval of A15 Settings; verified the updated page specification and advanced the tracker focus to A07 Eligibility Rules owner review. A15 remains unimplemented and its proposed policy decisions and external integration gates remain distinct from page-specification approval. |

| 2026-11-02 | Recorded owner approval of A07 Eligibility Rules, including the typed criterion catalogue, distinct requirement-strength states, sourced numeric units/bases, explicit ALL/ANY logic, proposed 90-day reminder / 180-day stale threshold, and validated CSV import with preview/dry-run and Admin-controlled publication. Updated the approved-page count to nine and advanced focus to A08 Offers. A07 remains unimplemented; all 29 acceptance tests remain Not Run. |

| 2026-11-02 | Owner approved all remaining documented admin specifications A08 Offers, A09 Intents, A10 Landing Pages, A11 Content and Guides, and A13 Users and Roles, including their documented task scopes and recommended defaults. Updated all five page records and the inventory: all 14 documented admin pages are now owner-approved; A12 Leads remains deferred. This approval authorizes implementation planning, not bypassing shared standards, authentication/security, privacy/legal or page-specific dependency gates. All associated acceptance tests remain Not Run; no implementation is marked complete. |

| 2026-11-02 | Expanded the Authorization standard into an implementation-ready policy draft covering centralized deny-by-default decisions, permission catalogue/action semantics, record scopes, field redaction, four role baselines, Admin delegation limits, MFA/session lifecycle, audit/fail-closed behavior, enforcement coverage, 12 implementation tasks and 18 acceptance tests. No code or tests started; detailed owner approval is pending. Set shared-standards focus to Authorization review. |

| 2026-11-02 | Recorded owner approval of the detailed Authorization standard, including All / Assigned / Own / Aggregate scopes and the Admin delegation ceiling. Updated shared-standard status and advanced focus to Data Governance. Authentication provider, session/step-up details, security override review and legal/PII activation remain separate implementation gates. Authorization code has not started and all 18 tests remain Not Run. |

| 2026-11-02 | Expanded Data Governance for owner review: normalized canonical entities, claim-level source evidence, explicit missing-value semantics, rates/fees/eligibility/offers rules, versioning/effective dates, freshness proposals and event triggers, staged imports, Admin publication/correction authority, comparison integrity, 12 implementation tasks and 28 acceptance tests. No code or tests started; approval pending. Advanced shared-standards focus to Data Governance. |

| 2026-11-02 | Recorded owner approval of Data Governance, including source/provenance, canonical relationships, history/correction, staged imports, comparison integrity and Admin operational authority. Freshness defaults are approved as configurable starting proposals, not contractual SLAs or a claim that rates change frequently; lead/customer PII remains disabled pending separate legal/compliance approval. Added Admin Shell standard draft with responsive navigation, role-aware server-authorized navigation, session/error states, accessibility, privacy, 10 tasks and 20 acceptance tests; owner approval pending. |
| 2026-11-02 | Added A16 Admin Content Studio scope for Static Pages, News and Blogs with distinct content contracts, shared CMS workflows, role boundaries, SEO/localization/media rules, 15 implementation tasks and 30 acceptance tests; owner review pending. Added the public Frontend Page and Journey Plan covering F01–F24, shared frontend systems, seven user journeys, delivery slices and cross-page gates. Updated frontend inventory for news, blogs, CMS static-page rendering and search results. No implementation or tests started. |

| 2026-11-02 | Recorded owner approval of the Admin Shell standard: desktop sidebar/mobile drawer, five navigation groups, server-authorized navigation, Leads exclusion pending legal approval, separate identity layout, omission of undefined global search/notifications and WCAG 2.2 AA target. Updated shared-standard status and advanced focus to Design System. Shell implementation and all 20 acceptance tests remain Not Started/Not Run. |

| 2026-11-02 | Added the shared Design System standard draft for public and admin surfaces: semantic light/dark tokens, English/Hindi typography, responsive layout, reusable components, financial data presentation, INR/IST conventions, WCAG 2.2 AA, privacy boundaries, 13 implementation tasks and 24 acceptance tests. Owner review pending; no implementation or tests started. |

| 2026-11-04 | Recorded owner approval of the Design System standard (13 implementation tasks and 24 acceptance tests remain Not Started/Not Run). Added API Conventions standard draft with route/versioning, DTO/error contracts, authorization, pagination, concurrency/idempotency, rate limits, audit/privacy, caching, imports/exports, 14 tasks and 26 acceptance tests; owner review pending. |
