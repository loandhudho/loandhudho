# Offers — Admin Page Specification

**Page ID:** A08 / ADM-OFFER  
**Route:** `/admin/offers`  
**Phase:** 1 — Admin page analysis/specifications  
**Status:** Documented — Owner Approval Pending  
**Priority:** P1  
**Last updated:** 2026-11-02  
**Implementation:** Not started

## 1. Purpose and boundaries

Manage lender-specific promotions linked to canonical loan products: create, verify, review, approve, schedule, publish, pause, withdraw and preserve history. An offer is a time-bound promotional overlay, never a replacement for or mutation of product identity, base rates, standard fees or product eligibility. Public claims require evidence, material conditions and clear validity. Never imply guaranteed approval, savings, benefit fulfillment or an unverified commercial partnership.

In scope: offer list/search/filter; create/edit/duplicate-as-draft; benefit and condition records; source evidence; lifecycle/expiry; review/publication; history/audit; conflict detection and public-display eligibility.

Out of scope: editing A05 rate records, A06 standard fees or A07 eligibility from this page; lead capture, borrower applications, lender transmission, payments, cashback settlement, redemption processing or unapproved integrations.

## 2. Roles and permissions

| Role | Authority |
|---|---|
| Super Admin | Defines offer structures, type catalogues, controlled options, status definitions and global validation structures. |
| Admin | Full operational authority to create/edit/verify/review/approve/publish/schedule/pause/withdraw/archive offers using configured structures. Routine publication needs no separate approver. Cannot redefine system structures. |
| SEO Manager | Edits permitted public copy and SEO metadata only; cannot alter benefit mechanics, eligibility, validity, funding, evidence or operational status. |
| Sales Executive / Support | Reads approved offers within assigned scope; no offer or financial-fact mutation. Lead/customer PII remains disabled pending legal/compliance approval. |

Apply the shared authorization standard. Enforce permissions server-side on routes, APIs, server actions, exports and jobs; UI visibility is not authorization. Deny by default and audit material changes.

## 3. Core modeling rules

1. Every offer links to one canonical product. Institution is derived from that product and must match.
2. A product may have multiple current and historical offers.
3. Offers may target applicant segments, geography, channels, branches, loan amount/tenure or other sourced conditions.
4. Benefit type, calculation basis, cap/floor, funder and redemption method must be explicit.
5. “Up to”, cashback and savings claims require evidence and visible qualifying conditions; a maximum is not universally available.
6. Unknown, undisclosed, not applicable and nil are distinct. Missing information is never zero or unrestricted.
7. Validity, source freshness, publication state and product availability are separate dimensions.
8. Preserve immutable IDs, version history, evidence and audit events. Never delete expired/withdrawn history.
9. Listing a public offer does not imply the lender partners with or endorses LoanDhudho.

## 4. List and workflows

Route: `/admin/offers`. Search by title, offer ID, product, institution, promo code and slug. Filter by institution/category/product/type, lifecycle/publication state, verification, funder, channel, geography, validity and freshness. Include quick filters for active, scheduled, expiring soon, expired, paused, withdrawn, disputed and unverified. Sort by end/start/update date, institution, product, benefit and verification priority. Use stable pagination, retained filters and columns for title/ID, institution/product, benefit, type, validity, status, verification and actions. Bulk public-impact actions require per-record validation and confirmation. Exports require permission, field allowlist, privacy review and audit.

Create flow: select an existing eligible product (derive institution); enter identity/title/slug/type; define benefit mechanics, limits and funder; specify applicant/loan conditions, channel and geography; enter start/end timestamps and source timezone; specify redemption/promo code, exclusions, stacking and quantity limits; attach official evidence; save draft, validate, resolve conflicts, then Admin approves and publishes or schedules. Do not create without a canonical product. Warn/block misleading activation if the product is unavailable unless an authorized exception and reason are recorded.

Edit flow: show immutable ID, product/institution, version and history. Separate operational facts from SEO fields. Material changes to benefit, eligibility, validity, funding, exclusions or redemption create a new revision preserving prior published details. Re-parenting requires impact warning, validation and audit reason. Product/rate/fee/eligibility changes trigger offer review. Pause/withdraw requires reason, actor and timestamp and suppresses public availability without deleting history. Duplicate creates a draft without inherited approval/active status.

Admin may review, approve and publish routine offers; no mandatory second-person approval. Block publication for invalid product link, missing material mechanics/conditions, invalid or expired dates, unsupported claims, mismatch between claim and structured benefit, or missing A05/A06 baseline link for rate/fee benefits.

## 5. Data contract

| Group | Fields | Rules |
|---|---|---|
| Identity | immutable offer ID, title, display title, slug, offer type | Unique slug; immutable ID |
| Relationship | product ID, derived institution ID | Product required; institution must match |
| Benefit | type, amount/percentage, currency, calculation basis, cap, floor, maximum | Explicit units/formula; no unsupported arithmetic |
| Rate link | A05 baseline rate ID/version, promotional adjustment, period | Do not overwrite base rate |
| Fee link | A06 fee ID/version, waiver/reduction scope | Preserve standard fee |
| Applicant/loan | segment, customer type, sourced conditions, amount/tenure/LTV limits | Detailed product eligibility remains A07 |
| Channel/geography | online/branch/agent/partner; state/city/branch | Do not imply nationwide availability if restricted |
| Validity | start/end timestamp, source timezone | Store UTC; display IST; end follows start |
| Redemption | promo code, claim steps, application path | Safe URLs; no credentials |
| Conditions | exclusions, stacking, one-per-customer, quantity limits | Unknown is not unrestricted |
| Funding | lender/third-party/government/joint/other, payout timing | Distinguish funder from platform |
| Evidence | source URL/publisher, capture/verification dates, verifier, effective dates | Required for material claims |
| Lifecycle | operational/publication/verification state | Separate dimensions; catalogue owned by Super Admin |
| Governance | version, actors, timestamps, review/audit refs | Preserve history |

### 5.1 Proposed offer types

Interest-rate discount/subvention; processing-fee waiver/reduction; other fee waiver/reduction; cashback/reimbursement; reward/voucher/non-cash benefit; limited-period pricing; partner/co-lender campaign; government subsidy/scheme benefit. Super Admin owns the catalogue. Distinguish government, lender and third-party funding. A campaign label does not prove a formal partnership.

### 5.2 Benefit mechanics

For rate discounts, link the applicable A05 baseline version and identify percentage-point reduction, relative percentage reduction, fixed rate, reimbursement or other mechanism. Show standard rate and promotional adjustment separately, with period, qualifying amount/tenure/segment and cap. Do not mutate base rate or imply the discount lasts the full tenure unless sourced.

For fee waivers, link the A06 fee version; preserve standard fee and model waiver separately. Specify full/partial waiver, cap, GST/tax treatment, scope, timing, conditions and funder. Do not misclassify statutory/third-party charges as lender fees.

For cashback/rewards, state calculation basis, qualifying event, cap, funder, exclusions and payout timing. Distinguish assured from conditional/discretionary benefits. Do not convert points/vouchers to INR without reliable basis or call conditional benefits guaranteed.

## 6. Eligibility, stacking and conflicts

Offer conditions may narrow A07 eligibility but cannot silently broaden/override it. Link relevant A07 rules and store additional conditions separately. Use ALL/ANY logic only where source terms clearly define it; ambiguous wording remains narrative and needs human review.

Record exclusions such as customer type, geography, channel, amount, tenure, promo-code use and application/disbursal date. Stacking must explicitly be allowed, disallowed, allowed with named offers, or unknown/not disclosed. Never assume it is allowed. Detect overlapping offers for the same product and conflicting benefit mechanics. Require Admin resolution/reason before publication where claims may mislead. Overlap is acceptable where source terms allow it. Do not rank a “best” offer without evaluating known borrower conditions.

## 7. Validity, freshness and lifecycle

Store timestamps in UTC, retain source timezone and display IST by default. Define inclusive/exclusive end semantics in implementation. An offer is active only when approved publication state is active, current time is within validity and the linked product is eligible. Scheduled offers cannot appear active early; expired offers must be excluded even if jobs/cache are delayed.

Expiry is not freshness. A future offer can have stale evidence; a fresh active offer can be near expiry. Proposed expiry warning: 7 calendar days before end date (owner approval pending). Proposed freshness: configurable re-verification plus event-triggered checks on source changes, lender announcements, user reports or conflicting evidence. No numeric freshness SLA is set here.

Proposed lifecycle: Draft → In Review → Approved → Scheduled → Active → Expired, with Paused, Withdrawn and Disputed states. Super Admin defines status catalogue/transitions; Admin operates configured states. Pause/withdraw suppresses public availability but preserves history.

## 8. Evidence, public display and SEO

Prefer official lender offer pages, terms and conditions, official scheme pages or other primary sources. Record exact URL, publisher, capture/verification timestamp, effective dates, verifier and source reference. Secondary sources may help discovery but should not alone substantiate material claims where primary evidence is reasonably available. Preserve durable evidence references. Validate external URLs and treat imports as untrusted. Conflicts/user reports trigger review. Missing verification timestamp means Unverified, not Fresh. Source unavailability alone does not prove offer expiry.

Public cards/details should show benefit type/summary, cap/basis, lender/product, material eligibility/restrictions, validity, last-verified date, funder where relevant, promo code/claim steps, exclusions/stacking, full terms, official source and applicable promotional disclosure. Organic offers must not be mislabeled paid sponsorship. State that terms may change and listing does not guarantee approval or fulfillment. Do not index thin, expired or duplicate pages by default. Expired URLs may show expired state and link to current product/replacement. SEO Manager edits editorial copy/metadata, not structured benefit facts or validity.

## 9. Validation, UX and security

Validate product/institution relationship; required identity/type/benefit/conditions/source; non-negative values and explicit units; percentage-point versus relative calculations; cap/floor ordering; dates; promo-code rules; configured channel/geography; A05/A06 links; consistency with A07; stacking/overlap; claim-text consistency; safe URLs/evidence outcome. Preserve input on errors; distinguish blocking errors and warnings. Never silently coerce, round or drop conditions.

Provide loading, empty, no-results, error, success, disabled, read-only and permission-denied states. Confirm public-impact actions with affected offer/product and visibility consequences. Keyboard-operable forms/tables/dialogs, visible focus, semantic labels, announced validation, responsive layouts, status not conveyed by color alone, English/Hindi support, native-quality Hindi review, light/dark themes and low-bandwidth retry behavior.

Audit create/edit/approve/publish/schedule/pause/withdraw, benefit/validity changes, reassignment, source changes and exports. Record actor, target, action, timestamp, outcome, reason, version and relevant before/after values; never log secrets. Do not collect OTPs, PINs, passwords, UPI credentials or unnecessary borrower data. No lead capture, personal-data sharing, application facilitation or redemption processing is enabled; these require separate legal/compliance approval and purpose-specific consent.

## 10. Dependencies

A02 Institutions; A04 Loan Products; A05 Rates and History; A06 Fees and Charges; A07 Eligibility Rules; shared authorization/data-governance standards; future public pages F07 Offers Listing and F08 Offer Detail.

## 11. Ordered tasks

All tasks are **Not Started**. This document does not authorize coding.

| Task ID | Priority | Task | Dependency | Status |
|---|---|---|---|---|
| ADM-OFFER-001 | P1 | Finalize offer entity, relationships and versioned contract | Data governance | Not Started |
| ADM-OFFER-002 | P1 | Define permissions/scopes and server enforcement | Authorization | Not Started |
| ADM-OFFER-003 | P1 | Build list, search, filters, sorting and pagination | Admin shell/API | Not Started |
| ADM-OFFER-004 | P1 | Build create/edit draft workflow and product selector | A04 | Not Started |
| ADM-OFFER-005 | P1 | Implement benefit mechanics, caps and funding | Offer taxonomy | Not Started |
| ADM-OFFER-006 | P1 | Link rate discounts to A05 baseline versions | A05 | Not Started |
| ADM-OFFER-007 | P1 | Link fee waivers to A06 baseline versions | A06 | Not Started |
| ADM-OFFER-008 | P1 | Implement conditions/exclusions and A07 references | A07 | Not Started |
| ADM-OFFER-009 | P1 | Implement validity, scheduling, expiry and timezone | Lifecycle | Not Started |
| ADM-OFFER-010 | P1 | Implement stacking, overlap and conflict resolution | Stacking decision | Not Started |
| ADM-OFFER-011 | P1 | Implement evidence, verification and freshness | Data governance | Not Started |
| ADM-OFFER-012 | P1 | Implement review, approval, publish, pause, withdraw/history | Authorization | Not Started |
| ADM-OFFER-013 | P1 | Implement public-display eligibility and promotional labels | Disclosure policy | Not Started |
| ADM-OFFER-014 | P1 | Implement audit events and safe external links | Security/audit | Not Started |
| ADM-OFFER-015 | P2 | Add CSV import preview/dry run | Import standard/approval | Not Started |
| ADM-OFFER-016 | P2 | Add non-PII offer/expiry analytics | Analytics standard | Not Started |
| ADM-OFFER-017 | P1 | Complete responsive, accessibility, Hindi and theme behavior | Design system | Not Started |

## 12. Acceptance tests

All tests are **Not Run**; execution evidence is required during implementation.

| Test ID | Acceptance criterion | Status |
|---|---|---|
| ADM-OFFER-T01 | Unauthorized user cannot open route directly. | Not Run |
| ADM-OFFER-T02 | APIs/server actions reject unauthorized mutations. | Not Run |
| ADM-OFFER-T03 | Offer requires eligible existing product. | Not Run |
| ADM-OFFER-T04 | Product/institution mismatch is rejected. | Not Run |
| ADM-OFFER-T05 | Missing benefit mechanics/conditions block publication. | Not Run |
| ADM-OFFER-T06 | Percentage-point and relative discounts remain distinct. | Not Run |
| ADM-OFFER-T07 | Rate discount links A05 version without mutating base rate. | Not Run |
| ADM-OFFER-T08 | Fee waiver links A06 version without mutating standard fee. | Not Run |
| ADM-OFFER-T09 | Fee waiver preserves tax treatment, cap and conditions. | Not Run |
| ADM-OFFER-T10 | Cashback shows sourced funder, basis, cap and payout terms. | Not Run |
| ADM-OFFER-T11 | “Up to” claim shows maximum and qualifying conditions. | Not Run |
| ADM-OFFER-T12 | Offer cannot silently broaden A07 eligibility. | Not Run |
| ADM-OFFER-T13 | ALL/ANY logic requires source support. | Not Run |
| ADM-OFFER-T14 | Unknown stacking is not treated as allowed. | Not Run |
| ADM-OFFER-T15 | Conflicting overlap warns and requires resolution. | Not Run |
| ADM-OFFER-T16 | Scheduled offer is not active before start. | Not Run |
| ADM-OFFER-T17 | Expired offer excluded despite delayed job/cache. | Not Run |
| ADM-OFFER-T18 | Date ordering and timezone/IST display are correct. | Not Run |
| ADM-OFFER-T19 | Expiry warning is distinct from evidence freshness. | Not Run |
| ADM-OFFER-T20 | Missing verification timestamp is Unverified. | Not Run |
| ADM-OFFER-T21 | Unsupported/inaccessible evidence cannot silently validate claim. | Not Run |
| ADM-OFFER-T22 | Pause/withdraw suppresses public offer and preserves history/audit. | Not Run |
| ADM-OFFER-T23 | Material edits version and preserve prior publication. | Not Run |
| ADM-OFFER-T24 | Duplicate creates draft without inherited approval/active state. | Not Run |
| ADM-OFFER-T25 | SEO Manager cannot change benefit, evidence or status. | Not Run |
| ADM-OFFER-T26 | Support reads only approved offers in assigned scope. | Not Run |
| ADM-OFFER-T27 | Public display includes terms, validity, source and disclosure. | Not Run |
| ADM-OFFER-T28 | Expired/thin/duplicate pages follow canonical/index rules. | Not Run |
| ADM-OFFER-T29 | Unsafe URLs/imported content are rejected or sanitized. | Not Run |
| ADM-OFFER-T30 | Audit captures actor, action, target, timestamp, reason and before/after. | Not Run |
| ADM-OFFER-T31 | Workflow collects/transmits no lead/customer PII. | Not Run |
| ADM-OFFER-T32 | UI is keyboard accessible, responsive, localized and theme-compatible. | Not Run |

## 13. Open owner decisions

1. Approve the proposed offer-type catalogue in §5.1 or specify changes.
2. Confirm explicit stacking states (allowed / not allowed / named combinations / unknown) and block unresolved conflicts from publication.
3. Confirm funding party and last-verified date on detail; key conditions and validity on cards.
4. Approve proposed 7-calendar-day pre-expiry warning.
5. Set configurable active-offer verification cadence; retain event-triggered checks.
6. Approve later CSV preview/dry-run workflow; no direct bulk publication.

These are proposals, not approved policy. Owner approval may accept all defaults or specify changes.

## 14. Definition of Done

Approved data model/workflows/roles/validation implemented; every protected read/mutation server-authorized and material changes audited; offer mechanics link to and do not overwrite A05/A06/A07; validity/freshness/stacking/public display work correctly; all P0/P1 tests pass with evidence; accessibility/responsive/localization/theme checks pass; no lead/customer PII or application facilitation introduced; tracker reflects actual implementation/test status.

**Current outcome:** A08 is documented with 17 implementation tasks and 32 acceptance tests. Owner approval pending. No code or tests started.
