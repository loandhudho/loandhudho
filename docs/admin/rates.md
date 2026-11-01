# Rates and History — Admin Page Specification

**Page ID:** A05 / ADM-RATE  
**Route:** `/admin/rates`  
**Phase:** 1 — Admin page analysis/specifications  
**Status:** Owner Approved — 2026-11-02  
**Priority:** P1  
**Last updated:** 2026-11-02  
**Implementation:** Not started

## 1. Purpose

Provide the source-of-truth workspace for capturing, verifying, approving, publishing and maintaining lender-specific interest-rate records for individual loan products. Preserve every material rate change with its source, applicability conditions, effective period, verification history and prior published value.

LoanDhudho must show a rate only when its product, rate type, conditions, effective period and evidence are understood. A displayed rate is not a personalized quote, lender commitment or approval guarantee.

## 2. Scope and boundaries

### In scope
- Product-linked interest-rate records and rate history.
- Rate type, value/range, units, calculation basis and applicability conditions.
- Floating-rate benchmark and spread details when officially disclosed.
- Effective dates, source evidence, verification status and freshness.
- Rate change review, approval, publication, withdrawal and correction.
- Bulk entry/import with validation and record-level evidence.
- Product rate coverage and data-quality queues.

### Out of scope
- Fee and charge records (A06).
- Detailed eligibility rules (A07), though rate applicability may reference a sourced segment or eligibility condition.
- Promotional offers (A08), except a product rate may be explicitly linked to a sourced offer where the lender defines a promotional rate.
- Product identity and category schemas (A04/A03).
- Personalized quotes, credit decisions, approval predictions or lender integrations.
- Customer lead capture and personal financial information.

A rate is always linked to one canonical product ID. Institution and category are derived through that product relationship; do not create standalone bank-level/category-level rates.

## 3. Authority and role boundaries

The owner-defined role model and [authorization standard](../standards/authorization.md) apply.

| Role | Rates authority |
|---|---|
| Super Admin | Full access; defines rate field schemas, controlled rate types/units/status catalogues, validation structures and global rate-governance configuration. |
| Admin | Full operational authority to create, edit, verify, review, approve, publish, correct, withdraw and manage rate records using configured structures. Routine publication does not require a separate approver. |
| SEO Manager | May read approved rate facts for editorial presentation and manage separately permitted copy/SEO fields. Cannot change rate values, applicability, effective dates, verification or source evidence. |
| Sales Executive / Support | Read approved rate information within assigned scope for customer support; no rate mutations. |

Admin cannot redefine rate schemas, controlled options, entity types or status definitions. Enforce permissions server-side for list/detail pages, APIs, imports, exports, background jobs and analytics. Field-level restrictions apply even when a user can view the product.

## 4. Core rate data model

One rate record represents one lender-published rate or rate band for a specific product and a defined set of applicability conditions over a defined effective period. Do not flatten distinct borrower segments, loan amounts, tenures, customer relationships or rate types into one misleading range.

| Field group | Candidate fields | Rules |
|---|---|---|
| Identity | Immutable rate record ID, product ID, version/revision, external lender reference if available | Product ID required; stable internal ID |
| Rate classification | Rate type (fixed/floating/hybrid/other configured), interest calculation basis, rate purpose (standard/promotional/penal/other configured) | Controlled values; no silent assumptions |
| Value | Minimum/maximum annual rate, exact rate where applicable, percentage unit, precision | Decimal-safe numeric; explicit annual/monthly basis; lower must not exceed upper |
| Applicability | Loan amount band, tenure band, LTV band, borrower/customer segment, salaried/self-employed, credit-score band, relationship/customer category, geography, channel, other sourced conditions | Each condition must be explicit, sourced and nullable only with clear meaning |
| Floating-rate detail | Benchmark name, benchmark value if published, spread/margin, reset frequency/date, lender discretion wording | Capture only when source discloses it; do not calculate or infer missing spread |
| Effective period | Effective from, effective to, publication timestamp, withdrawn timestamp | Effective dates differ from capture/verification dates; define inclusive/exclusive boundaries |
| Evidence | Source URL/document, publisher, source title/reference, capture date, last verified at/by, evidence note | Material rate claims require traceable evidence |
| Governance | Verification state, publication state, review decision, created/updated actor, reason, previous version | Append-only history of material changes |
| Display | Public label, conditions summary, rate caveat, display priority where multiple valid records apply | Presentation must not alter underlying value or create unsupported “best rate” claims |

### 4.1 Rate value semantics

- Store percentages as decimal numeric values with an explicit meaning and unit. Do not store formatted strings such as “8.5% onwards” as canonical numeric data.
- Represent a single rate as an exact value; represent a lender-published band as minimum and maximum. Do not manufacture a range from different products or segments.
- Capture annual vs monthly basis explicitly. Most consumer loan rate displays are annual, but never assume the basis if the source is unclear.
- Capture nominal/effective or other lender-defined basis where disclosed. Do not relabel a nominal rate as APR.
- “Starting from”, “up to”, “as low as” and conditional rates require an explicit qualifier and the conditions under which they apply.
- If a lender source gives only narrative wording that cannot be safely normalized, preserve the attributed source text and mark the numeric value unavailable pending verification.

### 4.2 Floating-rate detail

For floating-rate products, store the lender's named benchmark/index and spread/margin as separate fields when disclosed. Capture benchmark value and effective date only when the lender publishes them and the source supports the claim. Store reset frequency or reset date where available.

Do not calculate a customer rate by adding a benchmark from an unrelated date to a spread. Do not assume the benchmark or spread is constant. A benchmark change and a lender product-rate change are distinct events and must be represented accurately.

### 4.3 Conditions and rate bands

A product may have multiple simultaneously valid rate records when they apply to genuinely different conditions. Conditions must be explicit enough to prevent an incorrect match. Examples include:
- Loan amount slabs.
- LTV or collateral bands.
- Salaried vs self-employed borrower segment.
- Credit-score bands, if officially published.
- New vs existing customer or relationship segment.
- Special geography or application channel.

Do not treat a set of conditional rates as one continuous range unless the lender itself publishes it as a range with the same applicability. Missing conditions must not be interpreted as universal eligibility. If the source does not explain applicability, flag the record for clarification and restrict public presentation accordingly.

## 5. List and detail workspace

Route: `/admin/rates`

### List filters and search
- Search by product, institution, category, rate record ID, lender reference and source title.
- Filter by rate type, product/category/institution, rate purpose, verification state, publication state, freshness, effective date, borrower segment and assigned operator where permissioned.
- Sort by last verified, effective-from, updated date, product, rate value and data-quality priority.
- Stable pagination and retained filter state.
- Show current, future-scheduled, expired and withdrawn records separately.

### Suggested columns
Product/institution, rate type, value/range, key applicability label, effective period, verification/freshness state, publication state, source/last verified, updated by and actions.

### Rate detail
Show:
1. Product and institution context with direct link to A04.
2. Current and historical rate versions in chronological order.
3. Rate value and units with complete applicability conditions.
4. Floating benchmark/spread details where sourced.
5. Effective period, captured date and last verification timestamp as separate values.
6. Source evidence and verification notes.
7. Publication/review history and audit trail.
8. Related product rate coverage and comparison-readiness impact.

Do not expose internal verification notes, restricted evidence or operator metadata to public users or unauthorized roles.

## 6. Create, update and correction workflows

### 6.1 Create a rate record
1. Select an existing product; show its institution and category as read-only context.
2. Select configured rate type, basis and purpose.
3. Enter exact rate or sourced range and explicit unit.
4. Enter all known applicability conditions and qualifiers.
5. Enter benchmark/spread/reset details only if supported by evidence.
6. Set effective-from/to dates based on the source; do not substitute capture date.
7. Attach official lender source evidence and record publisher/capture/verification details.
8. Run validation and overlap/duplicate checks.
9. Save draft; Admin reviews, approves and publishes when valid.

### 6.2 Change an existing rate
- Never silently overwrite a published historical value.
- A material change creates a new version/rate record with a new effective period.
- Preserve the prior record and its original source, value, conditions, effective dates and publication history.
- If a correction changes a previously published fact, record correction reason, actor, timestamp and impact on public display.
- End-date or withdraw the prior rate only when supported by source evidence or a documented correction decision.
- Future-dated rates may be scheduled but must not appear as current before their effective date.

### 6.3 Verify and publish
Admin may verify, approve and publish routine rate records. No separate reviewer is mandatory. Publication requires:
- Correct product relationship.
- Valid numeric semantics and rate type.
- Explicit conditions where needed to avoid misleading interpretation.
- Traceable source evidence for material public claims.
- Effective period and verification state.
- No unresolved blocking duplicate/overlap or contradiction.

Record validation outcome, source, actor, timestamp and reason. Optional maker-checker for selected high-risk changes is not a baseline requirement and requires a separate owner decision.

### 6.4 Withdraw or dispute
A rate may be withdrawn when lender source invalidates it, a correction is required or the product is no longer offered. A disputed rate is not silently left as a normal verified current value. Restrict or remove it from public current-rate displays according to policy, retain its history and show an internal resolution queue. Never hard-delete a published rate record.

## 7. Effective dating, history and overlap rules

- Store timestamps in UTC; display business dates in IST (Asia/Kolkata).
- Define date-only effective periods consistently. If an end date is date-only, treat it as inclusive through the end of that IST business date; test timezone boundaries.
- A record is current only when its publication/verification states permit display and the current IST business date/time falls inside its effective period.
- A future-effective published record is scheduled, not current.
- An expired record remains historical and must not be presented as current.
- A rate with no effective-from date may be stored as incomplete draft but should not be treated as current public data unless an explicit approved exception policy exists.
- Overlap detection uses product + rate classification + applicability dimensions + effective period. Overlap is a warning or blocker depending on whether records could both match the same borrower/loan conditions.
- Legitimate concurrent records for distinct amount/segment/LTV conditions are allowed.
- Exact duplicate product/rate/condition/effective-period submissions must be flagged; no silent duplicate publication.
- Preserve the full timeline, including superseded, corrected, expired, disputed and withdrawn versions.

## 8. Source evidence, verification and freshness

Preferred source hierarchy:
1. Official lender rate page, official rate card, circular, schedule or dated lender document/written communication.
2. Official regulator or benchmark administrator source for benchmark facts only; it does not independently prove the lender's product spread or customer rate.
3. Reputable secondary source as attributed context only; not a substitute for lender evidence for a definitive public lender rate unless an explicitly approved exception exists.

For each material rate claim, retain:
- Source URL or traceable document reference.
- Publisher/source identity and title/reference.
- Captured-at date and last-verified-at/by.
- Effective-from/to date where available.
- Verification state and evidence notes.
- Previous value/version and correction reason where changed.

A URL alone does not prove current validity. Capture date, effective date and last verification date are distinct. Source evidence should support the exact value, rate type, conditions and dates being published.

### 8.1 Verification states

Use the shared controlled status catalogue; proposed rate-level classifications:
- Unverified — no completed source verification.
- Verified — source and claim checked and supported.
- Stale — verification age exceeds the configured threshold.
- Expired — effective period has ended.
- Disputed — conflicting evidence or credible correction report requires resolution.
- Withdrawn — source or lender has invalidated the rate.

Verification state is separate from publication state and product lifecycle. A record can be verified but unpublished, published and later become stale, or withdrawn while retained historically.

### 8.2 Freshness defaults

The proposed baseline is a 90-day review reminder and a 180-day stale threshold for published interest rates. These are draft operational defaults, not approved SLAs. Interest rates should not be presumed incorrect merely because they have remained unchanged; retain the last-verified date and distinguish age from evidence of a rate change. Until owner approval, show age and verification timestamp and make the threshold configurable; do not hard-code it as policy. Missing verification date means Unverified, not fresh.

Trigger immediate re-verification regardless of age when the lender publishes a rate revision or circular, the cited source changes or disappears, a stated effective period ends, a relevant benchmark/reset event affects the published claim, or a credible correction/dispute is received. A benchmark movement alone must not be treated as proof that every lender product rate changed.

## 9. Bulk entry and import

Bulk import is a productivity tool, not an evidence shortcut.

- Accept only documented file formats and validated templates; exact formats are finalized with API/import standards.
- Require product identifier, rate type, numeric value/range, units, applicability, effective dates and source reference for each row.
- Preview normalized rows and show field-level errors, duplicate/overlap warnings and unmatched product IDs before commit.
- Invalid rows must not partially mutate published data. Use transaction/batch semantics with clear row-level outcomes.
- Each row retains its own source and effective dates; one shared file URL is not sufficient evidence for every claim unless the document explicitly supports all rows.
- Imported records remain draft/unverified until validation and Admin verification.
- Log uploader, file checksum/reference, import time, row outcomes and resulting record IDs. Do not log sensitive data.
- Support dry-run, retry of failed rows and export of error report.
- Bulk publication requires explicit confirmation and record-level publish validation.

## 10. Public display and comparison behavior

Public pages and comparison should:
- Display a current rate only when its product relationship, effective period, publication state, verification and applicability are valid.
- State whether the rate is fixed, floating or another configured type.
- Show “starting from” or “up to” qualifiers only when the source supports them and explain key eligibility/amount conditions nearby.
- Show last-verified and effective dates where useful and preserve a clear lender/source attribution.
- Distinguish “not disclosed”, “not verified”, “temporarily unavailable” and “no current rate found”.
- Never show future rates as current or expired/withdrawn rates in current comparison.
- Avoid ranking products by rate alone when conditions, fees, rate types or eligibility are not comparable.
- Label any calculator output as indicative; do not turn a sourced lender rate into a personalized quote.
- Clearly separate sponsored placement from factual rate ordering.

If multiple valid rates apply, select/display only the rate whose conditions match the public context. If the user's context is unknown or the conditions cannot be evaluated, show the lender's conditional range with caveats or “conditions apply”; never select the lowest conditional rate by default.

## 11. Security, audit and reliability

- Audit create, edit, verify, approve, publish, schedule, withdraw, dispute, correct, import/export and effective-date changes.
- Audit before/after values for material rate fields, source references, actor, timestamp, outcome and reason; protect append-only history.
- Do not log secrets, credentials or unnecessary personal data.
- Protect file upload and source URL workflows against malicious files, unsafe redirects and SSRF if server-side fetching is introduced.
- Validate all external input server-side; use decimal-safe types and database constraints.
- Use transactions for rate-version changes and batch imports.
- Handle concurrent edits with optimistic concurrency/version checks; never silently overwrite a newer change.
- Ensure backups restore both current and historical versions consistently.

## 12. UI states, accessibility and analytics

Required states: loading, no rates for selected product, no search results, filtered-empty, draft, future-scheduled, current, stale, expired, disputed, withdrawn, missing evidence, overlap conflict, duplicate warning, import preview/error, permission denied, concurrent edit conflict, save failure and publish confirmation.

- Responsive table with mobile card/detail alternative.
- Keyboard-operable filters, forms, date controls, dialogs and history timeline.
- Explicit labels, units, field-level errors and accessible status text; never rely on color alone.
- Light/dark theme and English/Hindi script support; preserve official rate terminology and reviewed translations.
- Analytics: rate coverage by product/category/institution; current verified rate coverage; stale/unverified/expired/disputed counts; records by rate type; products with conflicting/overlapping rate conditions; verification age; import outcomes. Ratios must show numerator and denominator and respect role scope.

## 13. Dependencies and integration points

- A04 Loan Products: canonical product identity and product relationship. A04 is currently documented and awaiting owner approval; its relationship contract is the working dependency for this draft.
- A02 Institutions and A03 Categories: derived lender/category context and category-specific comparison profile.
- A06 Fees: comparison context; do not merge fee values into rates.
- A07 Eligibility: detailed borrower eligibility; rate applicability must link to conditions without duplicating the full rules engine.
- A08 Offers: promotional rate association and validity.
- F04 Product detail and F09 Comparison: public rate presentation.
- F10 EMI calculator: consumes eligible current published rates only, with explicit assumptions.
- Shared data governance, authorization, audit, API, design system and testing standards.

No live lender integration, automated scraping or personalized quote engine is implied by this page.

## 14. Tasks

| Task ID | Priority | Task | Dependency | Status |
|---|---|---|---|---|
| ADM-RATE-001 | P1 | Define canonical product-linked rate record and field semantics | A04, data governance | Documented |
| ADM-RATE-002 | P1 | Define rate types, value/range, units and calculation basis | 001, controlled schemas | Documented |
| ADM-RATE-003 | P1 | Define applicability dimensions and conditional rate bands | A03 comparison profiles, A07 | Documented |
| ADM-RATE-004 | P1 | Define floating benchmark/spread/reset fields and rules | Official source requirements | Documented |
| ADM-RATE-005 | P1 | Define effective dating, history, overlap and correction rules | Data governance | Documented |
| ADM-RATE-006 | P1 | Define source evidence, verification and freshness workflow | Data governance | Documented |
| ADM-RATE-007 | P1 | Define list/detail/create/edit/review/publish/withdraw workflows | Authorization | Documented |
| ADM-RATE-008 | P1 | Define bulk import, preview, validation and recovery | API/import standards | Documented |
| ADM-RATE-009 | P1 | Define public display and comparison consumption rules | F04/F09, A07/A08 | Documented |
| ADM-RATE-010 | P1 | Define security, audit, accessibility, localization and analytics | Shared standards | Documented |
| ADM-RATE-011 | P1 | Finalize acceptance tests and owner decisions | 001–010 | Documented |
| ADM-RATE-012 | P1 | Obtain owner approval | 001–011 | Awaiting Owner Approval |
| ADM-RATE-013 | P1 | Implement approved rate workspace and workflows | 012 and shared standards | Not Started |
| ADM-RATE-014 | P1 | Run acceptance, security, history and regression tests | 013 | Not Run |

## 15. Acceptance tests

| Test ID | Scenario | Expected result | Status |
|---|---|---|---|
| ADM-RATE-T01 | Admin creates a rate for an existing product | Draft links to correct product; institution/category are derived | Not Run |
| ADM-RATE-T02 | Rate submitted without product reference | Save/publish blocked | Not Run |
| ADM-RATE-T03 | Single exact rate entered | Decimal value and explicit unit preserved without string parsing | Not Run |
| ADM-RATE-T04 | Rate range entered with minimum greater than maximum | Validation rejects the range | Not Run |
| ADM-RATE-T05 | Annual/monthly basis omitted or ambiguous | Record cannot be published as a normalized numeric claim | Not Run |
| ADM-RATE-T06 | Fixed/floating/hybrid rate type selected | Controlled type stored and displayed correctly | Not Run |
| ADM-RATE-T07 | Floating rate has sourced benchmark and spread | Separate fields and source evidence retained; no unsupported calculation | Not Run |
| ADM-RATE-T08 | Two amount/segment bands are concurrently valid | Both allowed when conditions are distinct and non-conflicting | Not Run |
| ADM-RATE-T09 | Two records overlap for same applicable borrower conditions and period | Conflict warning/block prevents ambiguous current display | Not Run |
| ADM-RATE-T10 | Published rate changes | New version/effective period created; prior value and history preserved | Not Run |
| ADM-RATE-T11 | Future-effective rate is published | Displayed as scheduled, not current, before effective date | Not Run |
| ADM-RATE-T12 | Effective period ends | Rate moves to historical/expired classification and leaves current display | Not Run |
| ADM-RATE-T13 | Verification timestamp missing | State is Unverified; never classified as fresh | Not Run |
| ADM-RATE-T14 | Source does not support exact value or conditions | Publication blocked or restricted pending clarification | Not Run |
| ADM-RATE-T15 | Rate source is disputed or withdrawn | Current public display is restricted according to policy; history retained | Not Run |
| ADM-RATE-T16 | Admin verifies, approves and publishes valid rate | Operation succeeds without mandatory second approver and is audited | Not Run |
| ADM-RATE-T17 | SEO Manager attempts to edit rate value/source | Server denies mutation; editorial permissions remain separate | Not Run |
| ADM-RATE-T18 | Sales Executive / Support attempts rate mutation | Server denies mutation | Not Run |
| ADM-RATE-T19 | Unauthorized direct API request attempts rate publication | Server denies regardless of UI state | Not Run |
| ADM-RATE-T20 | Bulk import contains valid, duplicate and invalid rows | Preview reports row-level outcomes; invalid rows do not partially publish | Not Run |
| ADM-RATE-T21 | Bulk import row references unknown product | Row rejected with actionable error; no orphan rate created | Not Run |
| ADM-RATE-T22 | Concurrent operators edit same rate version | Conflict detected; newer data is not silently overwritten | Not Run |
| ADM-RATE-T23 | Public comparison has several conditional rates | Only matching rate/range shown; no automatic lowest-rate selection | Not Run |
| ADM-RATE-T24 | Rate is annual nominal but UI labels APR | Test fails; display must preserve source-defined basis | Not Run |
| ADM-RATE-T25 | IST date boundary and inclusive end date | Current/expired classification matches defined business-date semantics | Not Run |
| ADM-RATE-T26 | Export/history access by role | Permission scope, field allowlist and audit are enforced | Not Run |
| ADM-RATE-T27 | Mobile, keyboard, light/dark and Hindi rendering | Core list, edit and history workflows remain accessible | Not Run |
| ADM-RATE-T28 | Rate coverage analytics are calculated | Counts reconcile; ratios include numerator/denominator and role scope | Not Run |

## 16. Definition of Done

- Owner approves rate field semantics, applicability conditions, lifecycle and publication rules.
- Product-linked rate identity and separation from fees, eligibility and offers are finalized.
- Effective dating, history, correction, overlap and timezone behavior are approved.
- Source evidence, verification and freshness policy are approved.
- List/detail/create/edit/import/review/publish/withdraw workflows are specified.
- Public display and comparison rules prevent misleading conditional or stale rates.
- All P0/P1 acceptance tests pass with recorded evidence after implementation.
- Authorization, audit, security, accessibility and regression checks pass.
- Lint, typecheck, relevant unit/integration tests, affected E2E flows and production build pass.
- Master tracker reflects actual status and remaining limitations.

## 17. Owner decisions

1. **Rate basis:** Confirm the initial MVP should store lender-published annual nominal rates as the standard display basis when the lender source supports it, while preserving other source-defined bases explicitly and never relabeling them as APR.
2. **Conditional rate records:** Confirm separate records for material lender-published amount, LTV, borrower-segment or credit-score bands, rather than collapsing them into one range.
3. **Missing effective date:** Confirm a rate without a sourced effective-from date may remain draft/unverified but cannot be presented as current public data.
4. **Public conditional display:** Confirm that where borrower conditions are unknown, LoanDhudho should show the lender's sourced conditional range with a clear caveat (or “conditions apply”), never automatically select the lowest rate.
5. **Freshness threshold:** Approve or revise the proposed 90-day review reminder / 180-day stale threshold for interest rates in the data-governance standard. Rates are not presumed changed solely due to age; event-triggered re-verification applies. Until approved, show verification age without treating the proposed threshold as policy.
6. **Bulk import:** Approve CSV-based bulk rate import for MVP, with preview, row-level validation, source references per claim, dry-run and explicit Admin publication.

No rate import, bulk publication or code implementation is authorized by this draft. A04 remains owner-approval pending; this A05 document records its product relationship as a dependency and does not imply A04 approval.
