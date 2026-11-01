# Fees and Charges — Admin Page Specification

**Page ID:** A06 / ADM-FEE  
**Route:** `/admin/fees`  
**Phase:** 1 — Admin page analysis/specifications  
**Status:** Documented — Owner Approval Pending  
**Priority:** P1  
**Last updated:** 2026-11-02  
**Implementation:** Not started

## 1. Purpose

Provide the source-of-truth workspace for capturing, verifying, approving, publishing and maintaining fees and charges associated with a specific lender loan product. The page must make the actual cost structure understandable without conflating lender fees, government/statutory charges, third-party costs, taxes or interest.

A fee record is linked to one canonical product. Institution and category are derived from that product. A product can have many fee records, each with its own charge type, amount/basis, applicability, trigger, effective period, evidence and history.

## 2. Scope and boundaries

### In scope
- Product-linked fee and charge records, schedules and historical versions.
- Fixed amounts, percentages, slabs, ranges, caps, floors and conditional charges.
- Charge basis, trigger, timing, payee, collector, tax treatment and refundability.
- Lender, statutory/government and third-party cost classification.
- Waivers, discounts and conditional exemptions where officially supported.
- Source evidence, effective dates, verification, freshness and publication lifecycle.
- Fee disclosure completeness and comparison-readiness reporting.
- Validated bulk entry/import proposal.

### Out of scope
- Product identity and category structures (A04/A03).
- Interest rates and rate history (A05).
- Detailed eligibility rule engine (A07), though a fee may carry sourced applicability conditions.
- Offers/discount campaigns (A08), except a sourced fee waiver may be linked to an offer.
- Personalized total-cost quote, legally defined APR calculation, tax advice or legal interpretation.
- Lead capture, borrower PII, lender integrations or application facilitation.

## 3. Authority and role boundaries

The owner-defined four-role model and [authorization standard](../standards/authorization.md) apply.

| Role | Fee-page authority |
|---|---|
| Super Admin | Full access; defines fee entity/field schemas, controlled fee-type and payee catalogues, units, status definitions, tax-treatment options and global validation structures. |
| Admin | Full operational authority to create, edit, verify, review, approve, publish, correct, withdraw and manage fee records using configured structures. Routine publication does not require a separate approver. |
| SEO Manager | Read approved fee facts and manage separately permitted editorial presentation/SEO fields. Cannot change amounts, bases, applicability, tax treatment, effective dates, source evidence or verification state. |
| Sales Executive / Support | Read approved fee disclosures within assigned scope for support; no fee mutations. Lead/customer PII remains disabled pending its separate legal/compliance gate. |

Admin cannot define or change system structures, controlled catalogues, entity types, status definitions or permission templates. Enforce effective permissions and record scope server-side on pages, APIs, server actions, imports, exports, jobs and analytics. UI visibility is not authorization.

## 4. Fee data model

One fee record represents one charge type, with a specific calculation method and applicability set, for one product over a defined effective period. Do not compress materially different triggers, borrower segments, channels or loan amount slabs into a single ambiguous value.

| Field group | Candidate fields | Rules |
|---|---|---|
| Identity | Immutable fee ID, product ID, version, external lender reference | Product ID required; stable internal identity |
| Classification | Configured fee type, charge family, charge owner | Lender, statutory/government or third-party must be explicit |
| Amount | Fixed amount, percentage, range, slab schedule, currency, precision | Decimal-safe; amount and unit/basis required for a numeric claim |
| Calculation basis | Sanctioned amount, disbursed amount, outstanding principal, transaction amount, installment, event or other configured basis | Percentage without basis is incomplete and not publishable as a comparable numeric fee |
| Limits | Minimum, maximum, cap, floor, per-event cap, cumulative cap | Validate relationships and currency |
| Applicability | Loan amount, tenure, LTV, borrower segment, customer relationship, geography/state, channel, loan stage and other sourced conditions | Capture only supported conditions; unknown is not universal |
| Timing/trigger | Application, sanction, disbursal, annual/periodic date, part-payment, foreclosure, delay/default, service request, cancellation or other event | State when the charge becomes payable |
| Collection/payee | Payee, collecting party, collection method if disclosed, pass-through status | Do not imply lender revenue for government/third-party amounts |
| Tax | GST/tax included, excluded, not specified, not applicable; tax rate and source if verified | Never infer tax treatment or calculate an unsupported gross amount |
| Refund/waiver | Refundable status, refund conditions, waiver/discount amount or basis, qualifying conditions | Keep standard fee and conditional waiver distinguishable |
| Effective period | Effective-from/to, publication time, withdrawn time | Separate from capture and verification timestamps |
| Evidence | Source URL/document, publisher, source title/reference, capture date, last verified at/by, evidence note | Material public claims require traceable evidence |
| Governance | Verification/publication state, review decision, actor, reason, previous version | Preserve material history; no hard deletion |
| Display | Public label, conditions, caveat, disclosure priority | Presentation cannot alter the underlying fee semantics |

### 4.1 Amount and calculation semantics

- Support fixed amount (for example, INR amount), percentage of a named basis, lender-published range, and slab-based schedules.
- A percentage must identify its basis: sanctioned amount, disbursed amount, outstanding principal, transaction amount or another explicitly configured base.
- Capture minimum, maximum, cap, floor and per-event/cumulative limits when sourced. Do not infer them.
- For slabs, preserve each threshold and corresponding charge, including whether boundaries are inclusive/exclusive. Validate no accidental gaps or overlaps.
- Store numeric values as decimal-safe data and currency explicitly. Display INR with Indian number formatting.
- Do not store only formatted text such as “up to 1% + GST” as canonical data. Preserve the lender's original wording as attributed evidence alongside normalized fields.
- If a source provides a narrative charge that cannot safely be normalized, retain the attributed text and mark the structured amount unavailable pending review.
- “Nil”, “not applicable”, “not disclosed”, “not verified” and “unknown/not captured” are distinct states. Missing data must never be interpreted as zero or free.

### 4.2 Charge owner, payee and pass-through costs

Every charge must be classified, as supported by the source, as one of:
- **Lender charge:** imposed by the lender and payable to the lender.
- **Government/statutory charge:** imposed by a government or statutory authority; identify the authority/payee and whether the lender merely collects/remits it.
- **Third-party charge:** payable to a service provider such as a legal, technical, valuation or insurance provider; identify the provider/payee if disclosed.
- **Unclear classification:** retain internally and block definitive public classification until verified.

Record who assesses the charge, who collects it and who ultimately receives it when known. Do not represent stamp duty, registration or third-party valuation costs as lender revenue. If the lender collects a pass-through amount, label that collection role accurately.

### 4.3 Tax treatment

Capture whether the stated amount is tax-inclusive, tax-exclusive, tax-not-specified or tax-not-applicable. Capture a tax rate only when the source supports it and the relevant effective period is known. Do not assume GST applies uniformly, add an assumed tax rate to a quoted fee, or show a calculated tax-inclusive total without a verified rule and basis. The display must explain when tax may be additional but is not quantified.

### 4.4 Timing, refundability and waiver

Capture the event that triggers a charge and whether it is upfront, recurring, periodic or event-based. Examples: application, processing, sanction, disbursal, annual renewal, part-payment, foreclosure, late payment or service request.

Refundability must be one of the configured explicit states (for example refundable, non-refundable, conditional or not disclosed), with conditions and source. A waiver/discount must be a separate conditional representation linked to the standard fee; preserve qualifying channel, customer segment, offer validity and effective dates. Do not silently replace the standard fee with a waived value.

## 5. Fee taxonomy — candidate coverage

The following are candidate fee families for product discovery and specification, not an approved immutable catalogue. Super Admin owns the final controlled taxonomy.

- Processing/application/administration charges.
- Documentation, agreement, legal, technical and valuation charges.
- Stamp duty, registration and other statutory charges.
- Insurance premiums or related charges, including whether optional/mandatory and beneficiary where sourced.
- Foreclosure/prepayment and part-payment charges.
- Late-payment, overdue and penal charges.
- Cheque, ECS/NACH or payment-bounce/return charges.
- Rate conversion, benchmark switch or loan conversion charges.
- Duplicate statement, document, certificate or service-request charges.
- Cancellation, commitment, annual, renewal and maintenance charges.
- Other lender-disclosed charges, retained with source wording and review.

This list must not be treated as evidence that every fee applies to every product. Do not populate a default amount merely because a fee type exists.

## 6. List and detail workspace

Route: `/admin/fees`

### List filters and search
- Search by fee ID, product, institution, category, fee label, payee and source title.
- Filter by fee family, charge owner, calculation method, tax treatment, applicability, trigger, refundability, verification state, publication state, freshness and effective date.
- Filter for missing source, missing amount/basis, incomplete payee classification, missing tax disclosure and product coverage gaps.
- Sort by last verified, effective date, fee type, product, amount and data-quality priority.
- Stable pagination and retained filter state.

### Suggested columns
Product/institution, fee label/type, charge owner, amount/method/basis, key condition/trigger, effective period, verification/freshness, publication state, source/last verified and actions.

### Fee detail
Show:
1. Product and institution context, linked to A04.
2. Current and historical fee versions.
3. Amount, method, basis, slab, minimum/maximum/cap and currency.
4. Applicability, trigger, payment timing and recurrence.
5. Payee, collector, charge owner and pass-through status.
6. Tax treatment, refundability and waiver conditions.
7. Effective dates, captured date and last verification as distinct values.
8. Source evidence, verification notes, publication/review history and audit trail.
9. Impact on product comparison readiness and completeness.

Internal notes and restricted operator metadata must not appear publicly or to unauthorized roles.

## 7. Create, update, verify and publish workflows

### 7.1 Create a fee record
1. Select an existing canonical product; show institution/category as read-only context.
2. Select a configured fee family and charge-owner classification.
3. Choose fixed, percentage, range or slab method and enter amount/basis/limits.
4. Define applicability conditions, event trigger, timing and recurrence.
5. Capture payee, collector, pass-through status, tax treatment and refundability where sourced.
6. Capture any waiver as a separate conditional record/relationship.
7. Set effective dates from the source, not from the capture date.
8. Attach official lender or authoritative evidence and record publisher/capture/verification details.
9. Run numeric, slab, overlap, duplicate and completeness validation.
10. Save draft. Admin may review, approve and publish when publication criteria pass.

### 7.2 Change an existing fee
- Never silently overwrite a published historical amount, basis or condition.
- A material change creates a new version/record with its own effective period and source evidence.
- Preserve the previous value, conditions, payee, tax treatment, effective dates and publication history.
- Record correction reason, actor, timestamp and impact when correcting a previously published claim.
- End-date or withdraw a prior version only when supported by evidence or documented correction.
- Future-effective fee schedules may be scheduled but must not display as current before their effective date.

### 7.3 Verify and publish
Admin may verify, approve and publish routine fee records. No separate approver is mandatory. Publication requires:
- Correct product relationship and configured fee classification.
- Unambiguous amount method, unit and calculation basis for any numeric percentage/amount.
- Explicit applicability and trigger where material.
- Correct charge owner/payee classification or a clear disclosed unknown state where permitted.
- Tax treatment represented without unsupported assumptions.
- Traceable evidence for material public claims.
- Effective period and verification state.
- No unresolved blocking duplicate, slab overlap or contradictory source.

A fee may be disclosed as “not disclosed” only when the source/review supports that statement; absence of an entered record alone is not proof that the lender does not charge it. Record actor, timestamp, validation outcome, evidence and reason. Optional maker-checker is not a baseline requirement.

### 7.4 Withdraw, dispute or correct
Withdraw when the lender invalidates the schedule, product/fee is no longer offered or correction is required. A disputed fee must not remain presented as an ordinary verified current fee. Restrict affected public claims while resolving; preserve all history. Never hard-delete a published record.

## 8. Effective dating, freshness and history

- Store timestamps in UTC; display operational dates in IST (Asia/Kolkata).
- Define date-only effective periods consistently. An end date is inclusive through the end of that IST business date; test timezone boundaries.
- Current public display requires valid publication/verification state and current date within the effective period.
- Future-effective records are scheduled, not current. Expired records remain historical.
- Missing effective-from may be allowed in an incomplete draft but not treated as a current public schedule without an explicitly approved exception.
- Detect overlaps using product + fee type + calculation method + applicability + trigger + effective period. Distinct valid conditions may coexist.
- Exact duplicate submissions must be flagged; no silent duplicate publication.
- Preserve superseded, corrected, expired, disputed and withdrawn versions.

### 8.1 Verification and freshness

Proposed fee freshness default in the shared data-governance draft is a 60-day review reminder and 90-day stale threshold. This is an unapproved operational proposal, not an SLA. Keep thresholds configurable and display verification age. Missing verification date means Unverified, not fresh.

Trigger immediate re-verification when an official schedule of charges changes, a lender circular/source changes or disappears, a stated effective period ends, or a credible correction/dispute is received. Expiry is independent of verification age. A fee remaining unchanged does not justify inventing a change; retain its last verified evidence and timestamp.

## 9. Source evidence and data quality

Preferred evidence:
1. Official lender schedule of charges, product page, sanction/product document, circular or dated written lender communication.
2. Official government/statutory authority source for statutory amounts/rules only; it does not prove unrelated lender charges.
3. Reputable secondary source as attributed context only, not a substitute for authoritative fee terms without an approved exception.

For each material claim retain source URL/document, publisher/title, capture date, effective dates where available, last verified at/by, evidence note, verification state and prior version. Source evidence must support the exact amount, basis, conditions, payee and tax/refund statements being published.

Quality queues should distinguish:
- No fee information captured.
- Source says fee is not disclosed.
- Explicit nil/no-charge claim.
- Fee exists but amount is not disclosed.
- Amount exists but basis/trigger/payee is unclear.
- Unverified, stale, expired, disputed or withdrawn record.
- Tax treatment not specified.
- Incomplete or conflicting fee schedule.

Do not convert any of these into a zero-value fee.

## 10. Public disclosure and comparison behavior

Public product pages and comparisons should:
- Show fee amount with its calculation basis, trigger and key conditions.
- Distinguish lender, statutory/government and third-party costs.
- State whether taxes are included, additional or not specified.
- Explain upfront, recurring and event-triggered costs separately.
- Disclose minimum/maximum/cap and slab conditions where applicable.
- Show waiver conditions without hiding the standard fee.
- Attribute the source and show last-verified/effective dates where useful.
- Distinguish not disclosed, nil, not applicable, unavailable and unverified.
- Avoid a single “total fees” figure unless every included component, tax treatment, timing and assumptions are known and a reviewed methodology exists.
- Do not calculate or label APR from incomplete fee data. APR requires a separately approved methodology and sufficient verified assumptions.
- Do not compare conditional charges as though universally applicable.
- Clearly label sponsored placement; sponsorship must not alter factual fee values.

If the borrower context is unknown, show conditional fee bands and caveats rather than selecting the lowest charge. A calculator may use only verified applicable values and must disclose exclusions and assumptions.

## 11. Bulk entry/import

Bulk import is proposed as an operational capability, not an evidence shortcut.

- Use a documented template with product ID, fee type, charge owner, method, amount/basis, applicability, trigger, tax treatment, effective dates and source reference.
- Preview normalized rows, slab boundaries, duplicate/overlap warnings, unmatched product IDs and field-level errors before commit.
- Each row retains its own supporting source; a shared file is evidence only where it explicitly supports every row.
- Imported rows remain draft/unverified until validation and Admin review.
- Invalid rows must not partially mutate published schedules; use transaction/batch semantics with row-level outcomes.
- Log uploader, file reference/checksum, import time, row outcomes and resulting record IDs; do not log personal data or secrets.
- Provide dry-run, failed-row retry and error report.
- Bulk publication requires explicit confirmation and per-record publish validation.

No import format, automated source scraping or bulk publication is authorized by this draft.

## 12. Security, audit and reliability

- Audit create, edit, verify, approve, publish, schedule, withdraw, dispute, correct, import/export and effective-date changes.
- Capture before/after values for material amount, basis, conditions, payee, tax and refund fields, plus actor, timestamp, outcome and reason.
- Keep history append-only; never log credentials or unnecessary personal data.
- Validate external input server-side; use decimal-safe storage, constraints and transactions.
- Protect upload and source URL workflows against malicious files, unsafe redirects and SSRF if server-side fetching is introduced.
- Use optimistic concurrency/version checks to prevent silent overwrite.
- Backups must restore current and historical fee records consistently.

## 13. UI states, accessibility and analytics

Required states: loading; no fees captured; source says not disclosed; explicit nil; no search results; filtered-empty; draft; future-scheduled; current; stale; expired; disputed; withdrawn; missing evidence; incomplete basis; unclear payee; tax unspecified; slab gap/overlap; duplicate warning; import preview/error; permission denied; concurrent edit conflict; save failure; publish confirmation.

- Responsive data table with mobile card/detail alternative.
- Keyboard-operable filters, forms, dialogs, date controls and history timeline.
- Explicit labels, units, currency, basis and field-level errors; never rely on color alone.
- English default and reviewed Hindi labels; preserve lender wording where materially necessary.
- Light/dark themes with semantic tokens and accessible contrast.
- Analytics: fee coverage by product/category/institution; verified fee coverage; missing/not-disclosed/nil distinctions; stale/unverified/expired/disputed counts; charge-owner mix; products with incomplete basis/payee/tax disclosure; overlapping slabs; verification age and import outcomes. Ratios show numerator and denominator and respect role scope.

## 14. Dependencies and integration

- A04 Loan Products: canonical product identity and parent relationship. A04 remains documented and awaiting owner approval.
- A02 Institutions and A03 Loan Categories: derived institution/category context.
- A05 Rates and History: separate financial-record pattern; fees must not be stored as interest rates.
- Shared data-governance standard: source evidence, verification, effective dates, history and configurable freshness.
- Shared authorization standard: role permissions and server-side enforcement.
- A07 Eligibility Rules: may share applicability dimensions but remains a distinct rule domain.
- A08 Offers: a fee waiver may be linked to an offer without overwriting standard fee facts.
- Frontend product detail and comparison: display only verified, applicable fee facts with caveats.

## 15. Ordered implementation tasks

All tasks remain **Not Started**; this document does not authorize implementation.

| Task ID | Priority | Task | Dependencies | Status |
|---|---|---|---|---|
| ADM-FEE-001 | P1 | Define fee record schema and product relationship | A04, data governance | Not Started |
| ADM-FEE-002 | P1 | Define configurable fee taxonomy and charge-owner classifications | Super Admin structures | Not Started |
| ADM-FEE-003 | P1 | Implement fixed, percentage, range and slab amount semantics | 001 | Not Started |
| ADM-FEE-004 | P1 | Implement calculation basis, limits, currency and decimal validation | 003 | Not Started |
| ADM-FEE-005 | P1 | Implement applicability, trigger, timing and recurrence fields | 001 | Not Started |
| ADM-FEE-006 | P1 | Implement payee, collector and pass-through classification | 002, 005 | Not Started |
| ADM-FEE-007 | P1 | Implement tax treatment, refundability and conditional waiver fields | 001 | Not Started |
| ADM-FEE-008 | P1 | Implement source evidence and verification metadata | Data governance | Not Started |
| ADM-FEE-009 | P1 | Implement effective dating, immutable versions and history | 001, 008 | Not Started |
| ADM-FEE-010 | P1 | Implement list/detail, filters, search and pagination | 001–009 | Not Started |
| ADM-FEE-011 | P1 | Implement Admin operational review/approve/publish/withdraw workflow | Authorization | Not Started |
| ADM-FEE-012 | P1 | Implement server-side permission, scope and field enforcement | Authorization | Not Started |
| ADM-FEE-013 | P1 | Implement duplicate, overlap, slab-boundary and completeness validation | 003–009 | Not Started |
| ADM-FEE-014 | P1 | Implement audit events and concurrency-safe updates | 009, 011 | Not Started |
| ADM-FEE-015 | P1 | Implement fee coverage and data-quality analytics | 010, 013 | Not Started |
| ADM-FEE-016 | P1 | Implement public disclosure/comparison data contract | 003–009, frontend specs | Not Started |
| ADM-FEE-017 | P2 | Implement validated import preview/dry-run and row-level outcomes | 008–014, import standard | Not Started |
| ADM-FEE-018 | P2 | Complete responsive, accessibility, Hindi and theme behavior | Design system | Not Started |

## 16. Acceptance tests

All tests are **Not Run**. Tests must be executed and evidenced during implementation.

| Test ID | Acceptance criterion | Status |
|---|---|---|
| ADM-FEE-T01 | A fee cannot be saved without a valid canonical product relationship. | Not Run |
| ADM-FEE-T02 | Institution and category context are derived from the linked product and cannot be inconsistently overridden. | Not Run |
| ADM-FEE-T03 | Fixed amount, percentage, range and slab methods persist with correct units and precision. | Not Run |
| ADM-FEE-T04 | Percentage fee without a calculation basis is rejected from publication. | Not Run |
| ADM-FEE-T05 | Minimum, maximum, cap and floor relationships are validated. | Not Run |
| ADM-FEE-T06 | Slab boundaries detect invalid gaps/overlaps and permit distinct valid schedules. | Not Run |
| ADM-FEE-T07 | Lender, statutory/government, third-party and unclear charge ownership remain distinct. | Not Run |
| ADM-FEE-T08 | Payee and collecting party are separately represented; pass-through costs are not labeled lender revenue. | Not Run |
| ADM-FEE-T09 | Tax-inclusive, tax-exclusive, unspecified and not-applicable states remain distinct. | Not Run |
| ADM-FEE-T10 | System does not infer GST/tax rate or calculate unsupported tax-inclusive totals. | Not Run |
| ADM-FEE-T11 | Nil, not disclosed, not applicable, unknown and unverified are distinct and never collapse to zero. | Not Run |
| ADM-FEE-T12 | Trigger, payment timing, recurrence and event-based charges display correctly. | Not Run |
| ADM-FEE-T13 | Refundability and waiver conditions are retained and displayed without overwriting standard fee. | Not Run |
| ADM-FEE-T14 | Effective dates are independent of capture and verification timestamps; IST end-date boundary is correct. | Not Run |
| ADM-FEE-T15 | Future-effective fees are not shown as current; expired fees remain historical. | Not Run |
| ADM-FEE-T16 | Material changes create a new version and preserve the prior published schedule. | Not Run |
| ADM-FEE-T17 | Missing or unsupported source evidence blocks publication of material fee claims. | Not Run |
| ADM-FEE-T18 | Source, publisher, capture date, verifier and effective period are traceable for published claims. | Not Run |
| ADM-FEE-T19 | Stale, disputed and withdrawn fees are not presented as ordinary verified current fees. | Not Run |
| ADM-FEE-T20 | Conditional fee schedules are not presented as universally applicable; unknown context shows caveats/bands. | Not Run |
| ADM-FEE-T21 | Admin can create, review, approve, publish, correct and withdraw operational fee records without mandatory second approver. | Not Run |
| ADM-FEE-T22 | Super Admin-only structural controls are denied to Admin and other roles. | Not Run |
| ADM-FEE-T23 | SEO Manager cannot mutate source-of-truth fee facts; Support remains read-only and scope-limited. | Not Run |
| ADM-FEE-T24 | Direct API/server-action/export access enforces permission and record scope; UI hiding alone is insufficient. | Not Run |
| ADM-FEE-T25 | Audit records actor, action, timestamp, reason and before/after values for material changes. | Not Run |
| ADM-FEE-T26 | Concurrent edits cannot silently overwrite a newer fee version. | Not Run |
| ADM-FEE-T27 | Public display distinguishes lender fees, statutory charges, third-party costs, taxes and unknowns. | Not Run |
| ADM-FEE-T28 | Product comparison does not invent a total fee or APR from incomplete/conditional data. | Not Run |
| ADM-FEE-T29 | Bulk import preview catches invalid rows and does not partially mutate published data. | Not Run |
| ADM-FEE-T30 | Loading, empty, error, permission-denied, mobile, keyboard and localized states are usable and accessible. | Not Run |

## 17. Definition of Done

- Owner approves this specification and resolves the material open decisions.
- Shared authorization, data-governance, API, design-system and testing standards required by the implementation are approved.
- All P1 tasks are implemented with code review and automated coverage.
- All P1 acceptance tests pass with recorded evidence; denied-role and direct-endpoint tests pass.
- Fee history, source attribution, effective dates, tax treatment and charge ownership are verified.
- Public display and comparison never imply missing fees are zero or calculate unsupported total cost/APR.
- Accessibility, responsive, English/Hindi and light/dark requirements pass.
- No lead/customer PII or lender application facilitation is introduced by this page.

## 18. Open owner decisions

1. **Fee taxonomy:** Approve the candidate fee families in Section 5 as the initial controlled catalogue, or revise them. Super Admin will own future structural changes.
2. **Unknown vs not disclosed vs nil:** Approve the distinct disclosure states and rule that missing data is never treated as zero.
3. **Statutory and third-party costs:** Approve the separate charge-owner/payee/collector model, including pass-through disclosure.
4. **Tax/GST display:** Approve the explicit tax-included / excluded / not-specified / not-applicable states; no assumed tax calculation.
5. **Fee freshness:** Approve or revise the proposed 60-day reminder / 90-day stale threshold. Source/schedule changes and credible corrections trigger immediate review regardless of age.
6. **Bulk import:** Confirm whether validated CSV import with preview, dry-run, row-level evidence and Admin-controlled publication is required for MVP. The draft does not authorize bulk publication or source scraping.

No implementation, data import, public fee publication or tests are authorized by this draft. A04 remains owner-approval pending; this A06 specification is also awaiting owner approval.
