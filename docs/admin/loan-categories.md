# Loan Categories — Admin Page Specification

**Page ID:** A03 / ADM-CAT  
**Route:** `/admin/loan-categories`  
**Status:** Owner Approved — Ready for implementation planning  
**Priority:** P1  
**Implementation:** Not started

## 1. Purpose

Define the canonical, product-centric loan category taxonomy for LoanDhudho. Categories organize lender products, public browse pages, comparison profiles, filters, search and analytics.

## 2. Authority boundary

Super Admin alone defines system structures: creates or structurally changes categories, hierarchy, category types, comparison-profile schemas, controlled attributes and status catalogues. Admin has full operational authority within existing structures, including product assignment and permitted operational lifecycle, approval and publishing actions. SEO Manager controls editorial presentation and SEO content, not canonical taxonomy. Sales Executive / Support has permitted read-only access within assigned scope.

## 3. Taxonomy principles

- Classify products, not only customer reasons for borrowing.
- Keep customer intents and use cases in A09; map them to canonical category IDs.
- One primary category per product by default; cross-listing requires an explicit reviewed relationship.
- IDs are immutable; public slug changes require redirects.
- Localized labels and aliases resolve to one category ID.
- Lender-specific rates, fees and eligibility belong to product records, never category records.
- Comparison readiness requires sourced product facts, not merely category assignment.

## 4. Proposed initial catalogue

| Category | Guidance |
|---|---|
| Home Loan | Residential purchase; construction/plot may be subtypes where terms warrant |
| Loan Against Property | Property-backed borrowing; distinct from home-purchase finance |
| Personal Loan | General-purpose personal borrowing |
| Business Loan | Working capital, expansion and business-purpose products |
| Education Loan | Education-related borrowing |
| Vehicle Loan | Car and two-wheeler may be child categories |
| Gold Loan | Secured by pledged gold |
| Loan Against Securities | Secured against eligible shares, funds, bonds or securities |
| Consumer Durable Loan | Financing eligible consumer durables |
| Credit Line / Overdraft | Revolving/drawdown facility, distinct from amortizing term loans |
| Commercial Property Finance | Commercial property purpose, distinct where terms differ |

Balance Transfer should be modeled as a refinancing intent, feature or offer by default. Top-up Loan should be a feature/relationship to an existing eligible loan unless independently offered as a distinct product. Loan Against Property and Home Loan remain separate.

## 5. Proposed navigation hierarchy

- Property Loans: Home Loan; Loan Against Property; Commercial Property Finance
- Secured Loans: Gold Loan; Loan Against Securities
- Unsecured Loans: Personal Loan
- Business Finance: Business Loan
- Education Finance: Education Loan
- Asset Finance: Vehicle Loan (Car Loan; Two-Wheeler Loan)
- Retail Finance: Consumer Durable Loan
- Credit Facilities: Credit Line / Overdraft

Keep public navigation shallow, normally no more than two levels. Navigation-only groupings must be distinguishable from selectable product categories.

## 6. Roles and permissions

| Capability | Super Admin | Admin | SEO Manager | Sales Executive / Support |
|---|---|---|---|---|
| View taxonomy | Full | Full | Read | Read |
| Create/rename/merge/re-parent categories | Full | No | No | No |
| Define category types and comparison schemas | Full | No | No | No |
| Assign products to existing categories | Full | Full, permissioned | No | No |
| Operate existing category workflow | Full | As permissioned | Editorial fields only | No |
| Edit public copy and SEO metadata | Full | If separately granted | Full editorial authority | No |
| View analytics | Full | Operational scope | Page/content scope | Assigned scope only |

All authorization is server-side. Admin can operate products and category assignments using existing structures but cannot define the taxonomy. SEO Manager cannot alter canonical identity, hierarchy, comparison schemas or product classification.

## 7. Information architecture and workflows

**List:** summary counts by lifecycle, search by names/aliases/slug/ID, filters for parent/status/visibility/product coverage/localization/profile readiness, stable sorting and server pagination. Columns show category path, ID/slug, status, product counts by state, profile readiness, locale completeness and last update. Add Category is Super Admin-only.

**Detail:** overview, hierarchy, comparison profile, product coverage, localization, editorial/public page, preview and permission-gated audit history.

**Create/edit:** Super Admin creates draft, validates duplicates and hierarchy, defines/selects profile, adds locale labels, previews impact, then saves and publishes under configured authority. Admin operates existing records using configured workflows. SEO Manager edits editorial fields only.

## 8. Data contract and comparison profiles

Category fields: immutable ID; canonical English name; Hindi label before Hindi publication; unique stable slug; parent/group; controlled category type; selectable-vs-navigation-only mode; locale-tagged aliases; editorial brief; versioned comparison profile reference; lifecycle and public visibility; display order; actor/timestamps and change reason.

Comparison profiles are versioned schemas owned by Super Admin. Candidate home-loan attributes include rate type and annual rate/range, benchmark/spread where disclosed, amount and tenure ranges, fees linked from fee records, prepayment terms, eligibility highlights, source and verification dates. Other profiles must be appropriate to the product (e.g. collateral/LTV for gold loans; limit/drawdown/interest charging for credit lines). Each field needs units, allowed values and null/not-applicable semantics. Profile changes require impact review. Actual lender values remain on product records.

## 9. Localization and search

Support English, Hindi Devanagari and reviewed Romanized Hindi aliases. Candidate Hindi labels for native review: Home Loan—गृह ऋण/होम लोन; Personal Loan—व्यक्तिगत ऋण/पर्सनल लोन; Business Loan—व्यवसाय ऋण/बिजनेस लोन; Education Loan—शिक्षा ऋण/एजुकेशन लोन; Gold Loan—गोल्ड लोन; Loan Against Property—संपत्ति पर ऋण/प्रॉपर्टी के बदले लोन. These are draft search labels, not a final linguistic dictionary. Intent phrases belong primarily in A09. Normalize Unicode, case, whitespace and punctuation; flag alias collisions for human resolution.

## 10. Lifecycle, validation and redirects

Proposed controlled states: Draft, In Review, Active, Published, Hidden, Deprecated and Archived. Lifecycle, public visibility, indexability and data freshness are separate. Before deprecation/merge, identify linked products, offers, intent mappings, landing pages and URLs; require reassignment/replacement decision; preserve IDs/history; validate redirects; record reason and actor. Never hard-delete referenced categories.

Validate unique IDs/slugs, duplicate names/aliases, parent cycles, maximum depth, locale codes, comparison-profile keys/units, and redirect loops. Use transactions for structural changes. Imported taxonomy stays draft until reviewed.

## 11. UI, accessibility, analytics and audit

Specify loading, empty, no-results, no-products, draft/review, hidden/deprecated, incomplete-localization, missing-profile, duplicate, impact-warning, denied and request-failure states. Use semantic tables/forms, keyboard-operable hierarchy, field labels/errors, non-color status cues, responsive mobile layouts, English/Hindi script support and accessible light/dark themes.

Metrics: category counts by lifecycle; product coverage by state; zero-product categories; verified rate/fee and comparison coverage; locale completeness; alias collisions; SEO page performance. Ratios show numerator and denominator. Audit structural changes, approvals, publication, deprecation, merges, redirects and profile versions. No lead PII is needed here.

## 12. Dependencies

A01 dashboard; A02 institutions; A04 products; A05 rates; A06 fees; A07 eligibility; A08 offers; A09 intents; A10 landing pages; A11 content; F02/F03 public category pages; shared authorization, data governance, audit, API, design and testing standards.

## 13. Tasks

| Task ID | Priority | Task | Dependency | Status |
|---|---|---|---|---|
| ADM-CAT-001 | P1 | Define product-centric taxonomy and separate intent classification | Product plan/A09 | Documented |
| ADM-CAT-002 | P1 | Propose catalogue, hierarchy and special-case rules | 001 | Documented — owner review pending |
| ADM-CAT-003 | P1 | Define structural, operational and editorial permissions | Authorization | Documented |
| ADM-CAT-004 | P1 | Define identity, localization, aliases and URLs | Search/SEO | Documented |
| ADM-CAT-005 | P1 | Define comparison profile ownership/versioning | Data governance/A04–A07 | Documented — details depend on product specs |
| ADM-CAT-006 | P1 | Define list/detail/lifecycle/deprecation/merge workflows | 001–005 | Documented |
| ADM-CAT-007 | P1 | Define validation, duplicate, redirect and audit rules | 006 | Documented |
| ADM-CAT-008 | P1 | Define UI states, accessibility and analytics | Design system | Documented |
| ADM-CAT-009 | P1 | Finalize acceptance tests and dependencies | 001–008 | Documented |
| ADM-CAT-010 | P1 | Obtain owner approval | 001–009 | Awaiting Owner Approval |
| ADM-CAT-011 | P1 | Implement approved taxonomy/workflows | 010 and standards | Not Started |
| ADM-CAT-012 | P1 | Run acceptance/security/regression tests | 011 | Not Started |

## 14. Acceptance tests

| Test ID | Scenario | Expected result | Status |
|---|---|---|---|
| ADM-CAT-T01 | Super Admin creates category | Draft has immutable ID and valid slug | Not Run |
| ADM-CAT-T02 | Admin attempts structural mutation | Server denies; no structural change | Not Run |
| ADM-CAT-T03 | Admin assigns product to existing active category | Succeeds within permission/scope | Not Run |
| ADM-CAT-T04 | SEO Manager edits SEO copy | Editorial fields update; taxonomy unchanged | Not Run |
| ADM-CAT-T05 | Sales Support attempts taxonomy mutation | Server denies | Not Run |
| ADM-CAT-T06 | Duplicate name/slug/alias submitted | Collision flagged; unique constraints enforced | Not Run |
| ADM-CAT-T07 | Parent cycle or excess depth submitted | Rejected with validation | Not Run |
| ADM-CAT-T08 | Hindi publication lacks required label | Publication blocked with guidance | Not Run |
| ADM-CAT-T09 | Alias collision detected | Human-resolution warning shown | Not Run |
| ADM-CAT-T10 | Category has no products | Zero coverage shown without implying lender non-availability | Not Run |
| ADM-CAT-T11 | Comparison profile incomplete | Not marked comparison-ready | Not Run |
| ADM-CAT-T12 | Profile schema changes | New version and impact review; history retained | Not Run |
| ADM-CAT-T13 | Deprecate category with linked products | Reassignment decision required; history preserved | Not Run |
| ADM-CAT-T14 | Slug changes or categories merge | Valid redirects; no loops/broken references | Not Run |
| ADM-CAT-T15 | Unauthorized direct structural API call | Denied and audited per policy | Not Run |
| ADM-CAT-T16 | Search English/Hindi/transliteration aliases | Correct canonical category returned | Not Run |
| ADM-CAT-T17 | Keyboard/mobile/locales/themes | Accessible, responsive and localized | Not Run |
| ADM-CAT-T18 | Coverage analytics | Scoped counts reconcile; ratios show denominators | Not Run |
| ADM-CAT-T19 | Assign new product to deprecated category | Blocked or replacement guidance shown | Not Run |
| ADM-CAT-T20 | Role views audit history | Only permitted events/fields visible | Not Run |

## 15. Definition of Done

Owner approves taxonomy and initial catalogue; role boundaries, IDs/hierarchy/localization/URLs, profile ownership/versioning, lifecycle and merge behavior are finalized; A04/A09 can reference canonical IDs; acceptance/security/regression tests pass with evidence; engineering quality gates pass; master tracker is current.

## 16. Owner decisions

1. Approve or revise the proposed catalogue and hierarchy. Balance Transfer and Top-up are features/journeys by default, not independent base categories.
2. Confirm Super Admin alone creates/renames/merges/re-parents categories and defines comparison schemas; Admin operates existing categories, assigns products and uses configured lifecycle/publishing actions.
3. Confirm public hierarchy normally stays no deeper than two levels.
4. Native Hindi review is required before public release of Hindi/Romanized aliases.

Owner approval recorded on 2026-11-02. Implementation, bulk import and public category publication remain subject to the relevant shared-standard and release gates.
