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
| A07 | Eligibility Rules | [eligibility.md](./admin/eligibility.md) | Documented — Owner Approval Pending | Products, rates and fees |
| A08 | Offers | [offers.md](./admin/offers.md) | Documented — Owner Approval Pending | Products, rates, fees, eligibility and sources |
| A09 | Intents and Search Mappings | [intents.md](./admin/intents.md) | Not Started | Categories and bilingual taxonomy |
| A10 | Landing Pages | [landing-pages.md](./admin/landing-pages.md) | Not Started | Intents/categories and SEO |
| A11 | Content and Guides | [content.md](./admin/content.md) | Not Started | Localization/editorial workflow |
| A12 | Leads | [leads.md](./admin/leads.md) | Deferred | Legal approval, consent and agreements |
| A13 | Users and Roles | [users-and-roles.md](./admin/users-and-roles.md) | Not Started | Authentication and permission model |
| A14 | Audit Logs | [audit-logs.md](./admin/audit-logs.md) | Not Started | Audit event taxonomy |
| A15 | Settings | [settings.md](./admin/settings.md) | Not Started | Configuration ownership/security |

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

## 5. Shared standards to define

| Standard | Document | Status |
|---|---|---|
| Admin navigation, shell and responsive behavior | [admin-shell.md](./standards/admin-shell.md) | Not Started |
| Authentication, roles and permission matrix | [authorization.md](./standards/authorization.md) | Drafted — Owner Approval Pending |
| Design tokens, components, accessibility and themes | [design-system.md](./standards/design-system.md) | Not Started |
| Data provenance, freshness, review and history | [data-governance.md](./standards/data-governance.md) | Draft — Owner Approval Pending |
| API conventions, validation and error model | [api-conventions.md](./standards/api-conventions.md) | Not Started |
| Test strategy and release gates | [testing-strategy.md](./standards/testing-strategy.md) | Not Started |

## 6. Progress summary

- Global rules: drafted; awaiting owner approval.
- Page specs documented: 8 (A01–A08). A01–A06 are owner-approved; A07 Eligibility Rules and A08 Offers await owner approval.
- Pages approved for coding: 6 (A01–A06); implementation remains gated by shared standards and dependencies.
- Pages implemented and verified under this workflow: 0.
- Lead management: deferred pending legal/compliance gate.

## 7. Current focus

**Active page:** A09 — Intents and Search Mappings  
**Current status:** A01–A06 owner-approved; A07 Eligibility Rules and A08 Offers documented — Owner Approval Pending.  
**Next action:** Analyze and document A09, keeping customer search intents and bilingual/transliterated search mappings separate from the canonical product-category taxonomy.  
 
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

