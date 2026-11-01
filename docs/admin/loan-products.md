# Loan Products — Admin Page Specification

**Page ID:** A04 / ADM-PROD  
**Route:** `/admin/loan-products`  
**Phase:** 1 — Admin page analysis/specifications  
**Status:** Documented — Owner Approval Pending  
**Priority:** P1  
**Last updated:** 2026-11-02  
**Implementation:** Not started

## 1. Purpose

Provide the operational workspace for creating, maintaining, validating, approving and publishing lender-specific loan products. A product is the canonical offering made by one institution under one primary loan category. It is the parent record for rate history, fees, eligibility rules, offers, comparison data and public product detail.

The product catalog must support broad coverage across Indian banks, NBFCs and other eligible institutions while keeping each lender's facts attributable, current and comparable. Listing a product does not imply a commercial partnership or guarantee that a lender will accept an application.

## 2. Authority and role boundaries

The owner-defined role model and [authorization standard](../standards/authorization.md) govern this page.

| Role | Product-page authority |
|---|---|
| Super Admin | Full access; defines product entity structures, field schemas, controlled product types/status catalogues and global validation structures. |
| Admin | Full operational authority: create, edit, validate, review, approve, publish, pause, withdraw and archive product records using configured structures. Cannot redefine structures or permission models. Routine publication does not require a separate approver. |
| SEO Manager | Manage approved public-facing editorial fields, descriptions, page title/meta, FAQs and content presentation where permitted. Cannot alter lender identity, category assignment, financial facts, eligibility facts, source evidence or operational status. |
| Sales Executive / Support | Read approved product information within assigned scope for support; no master product or financial-data mutation. Lead/customer PII remains gated by separate legal/compliance approval. |

Enforce permissions server-side for pages, APIs, server actions, exports and background jobs. UI visibility is not authorization. Admin may operate all existing product lifecycle states, but only Super Admin may define or structurally change the underlying status catalogue, schemas, entity types and controlled options.

## 3. Product modeling principles

1. Every product has one canonical institution ID and one primary category ID.
2. One institution may offer multiple distinct products in the same category.
3. A product may have multiple versioned rate, fee, eligibility and offer records over time; these are related entities, not duplicated product fields.
4. Do not store a single mutable “current interest rate” or “processing fee” as the product's canonical value. A05 and A06 own those records.
5. A07 owns detailed structured eligibility rules. A04 may hold short, editorially approved highlights but must link to the authoritative eligibility records.
6. A08 owns offer terms and validity. Product pages may show linked active offers.
7. A product variant should become a separate canonical product only when material terms, borrower eligibility, collateral, repayment structure, pricing basis or application process differ. Cosmetic campaign labels or marketing bundles alone do not automatically justify a new product.
8. Preserve immutable internal IDs and version history. Slug changes require redirects and audit.
9. Product existence, verification state, publication state, data freshness and lender partnership are separate concepts.
10. Missing or undisclosed values must remain explicit; never infer or fabricate terms.

## 4. List page and operator workflow

### 4.1 Product list

Route: `/admin/loan-products`

Provide:
- Search by product name, institution, category, internal ID and public slug.
- Filters for institution, category, product type, lifecycle/publication state, verification state, completeness, freshness and updated date.
- Sort by updated date, name, institution, category, publication state and data-quality priority.
- Pagination with stable ordering and retained filters.
- Bulk actions only for safe, explicitly authorized operations; bulk publish/withdraw requires clear confirmation and per-record validation.
- Export only with explicit permission, field allowlist, audit event and privacy review.

Suggested columns: product name/ID, institution, category, product type, status, completeness, linked current rate status, source/verification status, last updated and actions. Do not expose internal notes or restricted fields to unauthorized roles.

### 4.2 Create product

Admin creates a product by selecting an existing verified institution and existing active category. The form should guide the operator through identity, classification, product facts, public content, source evidence and validation.

Creation flow:
1. Select institution; show legal/display identity and current institution status.
2. Select primary category from the controlled active catalogue.
3. Enter product identity and classification.
4. Enter supported product-level terms and customer-facing summary.
5. Add official product URL and source evidence.
6. Save draft; run validation and completeness checks.
7. Review and approve/publish using configured permissions.

Do not allow product creation against a missing, inactive or unverified institution without an explicit Admin exception path and reason. Do not silently create a new institution or category from this form.

### 4.3 Edit and maintain

- Display immutable product ID and a version/change history.
- Separate operational/source-of-truth fields from SEO/editorial fields.
- Show linked rates, fees, eligibility rules, offers and sources with deep links to A05–A08.
- Material changes to public facts create a new product version or revision record and preserve the prior published version.
- If institution or category association changes, require an explicit impact warning and audit reason; do not silently reassign.
- A change to product identity, availability, borrower segment, collateral or repayment structure should trigger review of linked rates, fees, eligibility, offers, comparison readiness and public URL.
- Pausing/withdrawing a product must update public visibility and downstream comparison/search eligibility according to lifecycle rules without deleting history.

### 4.4 Review, approval and publication

Admin has authority to review, approve and publish routine product records. A separate Reviewer role or mandatory second-person approval is not required. Preserve validation results, source evidence, actor, timestamps, reasons and versions. Optional maker-checker controls for selected high-risk changes may be introduced later only through an explicit owner decision and Super Admin configuration.

A record with missing required identity, invalid institution/category reference, unsafe URL or unsupported material public claim must not publish. Missing a category-specific optional field should not block publication unless the comparison profile marks it required for publication; it must still affect comparison readiness.

## 5. Product data contract

The following is the proposed canonical product record. Exact database types and API schemas are finalized in the implementation design and shared data standards.

| Field group | Candidate fields | Rules |
|---|---|---|
| Identity | immutable product ID, internal reference, product name, public display name, slug | ID unique and immutable; slug unique and redirect-managed |
| Relationships | institution ID, primary category ID | Required; references must resolve to eligible records |
| Classification | product type, secured/unsecured, collateral type, repayment structure, customer segment | Controlled options where values affect filtering/comparison; schema owned by Super Admin |
| Purpose | lender-stated purpose, supported use cases | Do not confuse product category with customer search intent; intent mapping belongs to A09 |
| Availability | geographic availability, branch/digital/channel availability, new-application availability | Only publish when supported by evidence; distinguish national from selected-region availability |
| Amount and tenure | minimum/maximum amount, currency, minimum/maximum tenure and unit | Optional unless reliably sourced or required by category profile; validate range ordering |
| Product summary | short summary, full description, key features, material caveats | Separate lender-sourced wording from editorial explanation |
| Application | official application/product URL, channel, application instructions | URL validation and safe external-link handling; no implication of guaranteed approval |
| Disclosure | lender disclosure text, disclaimer/reference | Preserve material terms and attribution |
| Lifecycle | operational state, publication state, visibility, indexability | Separate controlled dimensions; values defined by Super Admin |
| Governance | created/updated by, timestamps, version, review decision, audit reference | Preserve history; UTC storage and IST display |
| Evidence | source references, publisher, capture date, last verified date, verifier, effective dates | Source evidence required for material public claims |

### 5.1 Explicitly separate linked data

| Data | System of record | A04 behavior |
|---|---|---|
| Interest rates and rate history | A05 Rates and History | Link and show current published summary/status; no inline canonical rate editing |
| Fees and charges | A06 Fees and Charges | Link and show disclosed/missing summary; no duplicate canonical fee fields |
| Detailed eligibility | A07 Eligibility Rules | Link and show approved highlights/completeness |
| Offers and promotions | A08 Offers | Link active offers; do not store offer validity as product identity |
| Search intent mappings | A09 Intents and Search Mappings | Link category/product discovery terms; do not redefine category taxonomy |
| Comparison schema | Super Admin controlled category profile | Validate product completeness against active schema version |

## 6. Product identity, duplicates and variants

Potential duplicate signals include same institution, normalized product name, category, official product URL and lender product/reference code. Duplicate detection should warn, not automatically merge.

- Exact same lender product imported twice should resolve to one canonical product with evidence retained.
- Similar names may be distinct products; require operator review.
- Products from different institutions are never duplicates solely because names match.
- A lender's standard, premium, salaried, self-employed or special-segment offering should be separate only if material contractual/eligibility/pricing/application terms differ.
- Store parent/variant relationships only where the product model supports a real lender-defined family.
- Merge/retire operations preserve IDs, history, inbound references and redirects; require reason and impact review.
- Do not use public marketing labels as the only uniqueness key.

## 7. Validation and comparison readiness

### Blocking validation
- Product name, institution and primary category are present.
- Institution and category references exist and are eligible for the selected workflow.
- Slug/ID constraints pass.
- Numeric ranges are valid; minimum does not exceed maximum.
- URLs use allowed schemes and pass validation.
- Required material claims have attributable evidence.
- No prohibited or unsupported claims (guaranteed approval, fabricated rate, unverified partnership).
- Publication state transition is authorized.

### Warnings / readiness checks
- Missing amount or tenure range where commonly disclosed.
- No linked current verified rate record where the category comparison profile expects one.
- Missing fee disclosure or explicit “not disclosed” status.
- Incomplete eligibility highlights or detailed rules.
- Missing Hindi public label/content where bilingual release is intended.
- Stale or unverified source evidence.
- Product has no linked offers (informational only; not necessarily a defect).

Comparison readiness must be computed from the current version of the category's comparison profile and linked A05–A07 records. It is not a manually selectable badge. Show which required fields are complete, missing, stale, undisclosed or not applicable. A product may be published but not comparison-ready if owner-approved rules permit it; public comparison must not imply equivalent completeness.

## 8. Lifecycle and public visibility

Proposed operational lifecycle (controlled catalogue owned by Super Admin):
- Draft
- In Review
- Approved
- Published
- Paused
- Withdrawn
- Archived

Publication visibility and indexability are separate attributes. Admin can use configured transitions; Super Admin defines/changes the state catalogue and transition structure. SEO Manager may manage indexability/canonical/editorial presentation only within explicitly granted permissions and must not override product availability or source validity.

Rules:
- Draft and In Review are not publicly visible.
- Approved may be published by an authorized Admin.
- Paused products are not presented as currently available; show an appropriate status if a public historical page remains useful.
- Withdrawn products are excluded from active search and comparison; retain a useful historical page only if approved policy permits.
- Archived products are removed from normal operational lists but remain auditable.
- Product withdrawal does not delete rate/fee history or source evidence.
- If institution becomes inactive or category deprecated, flag linked products for Admin action; do not silently delete or repoint them.

## 9. Search, SEO and localization

- Product name, lender, category, verified aliases and supported use-case mappings should be searchable.
- English is default; Hindi labels/content and reviewed Romanized aliases are supported according to localization standards.
- Product names should preserve official lender naming; editorial display names must not misrepresent the lender's legal product.
- Slugs are stable, lowercase, readable and unique; changes require redirect checks.
- Public metadata, canonical URL, structured data eligibility and indexability are editorial/SEO fields with separate permission.
- Do not create thin public product pages with no verified useful content.
- Never claim “best,” “lowest rate” or “pre-approved” without defined, current, comparable evidence and approved substantiation.

## 10. Security, privacy and audit

- No borrower lead or application PII is required to create a product.
- Lead capture, lead assignment and sharing are out of scope for A04 and remain disabled pending dedicated legal/compliance approval.
- Never collect OTP, PIN, password, UPI credentials or bank login details.
- Audit create/edit/approve/publish/pause/withdraw/archive, institution/category reassignment, slug changes, evidence changes, imports, bulk actions and permission-denied attempts as appropriate.
- Audit events include actor, action, entity/version, timestamp, outcome and safe reason metadata; do not log secrets.
- Validate uploaded documents and URLs; protect any future URL-fetching/import workflow against SSRF, malicious files and unsafe redirects.
- Apply field-level redaction and least privilege to exports and detail views.

## 11. UI, accessibility and analytics

Required states: loading, empty catalog, no results, filtered no results, create/edit draft, validation errors, duplicate warning, stale/unverified evidence, incomplete comparison profile, unauthorized, conflict/concurrent edit, save failure, publish confirmation, paused/withdrawn and archived.

- Responsive list/table with mobile card alternative.
- Keyboard-operable filters, forms, dialogs and tables; visible focus and semantic labels.
- Field-level errors plus summary; do not rely on color alone.
- Light/dark theme and English/Hindi script rendering.
- Confirm destructive or broad-impact operations and show affected linked records.
- Analytics: products by institution/category/state; products with/without current verified rates; comparison readiness; duplicate warnings; source freshness; time from draft to publication. Show numerator/denominator for coverage ratios and respect role scope.

## 12. Dependencies and integration points

- A01 Dashboard: product queues, coverage and freshness aggregates.
- A02 Institutions: canonical institution identity/status.
- A03 Loan Categories: canonical category IDs and comparison-profile association.
- A05 Rates, A06 Fees, A07 Eligibility, A08 Offers: linked product-specific facts.
- A09 Intents: discovery/search mapping.
- A10/A11: public landing pages and editorial content.
- Shared authorization, data governance, audit, API, design system and testing standards.
- Public F04 product detail, F09 comparison and F01 search consume approved product data.

A04 may define the product relationship contract while detailed linked modules are documented in their own page specifications. Do not start implementation until A04 and required shared standards are approved.

## 13. Tasks

| Task ID | Priority | Task | Dependency | Status |
|---|---|---|---|---|
| ADM-PROD-001 | P1 | Define canonical product entity and institution/category relationships | A02, A03, data governance | Documented |
| ADM-PROD-002 | P1 | Separate product identity from rate, fee, eligibility and offer records | A05–A08 | Documented |
| ADM-PROD-003 | P1 | Define product variants, duplicate detection and merge rules | 001 | Documented |
| ADM-PROD-004 | P1 | Define product list, filters, search and detail workspace | Admin shell/design | Documented |
| ADM-PROD-005 | P1 | Define create/edit, validation and source-evidence workflow | Data governance | Documented |
| ADM-PROD-006 | P1 | Define Admin approval/publishing and role boundaries | Authorization standard | Documented |
| ADM-PROD-007 | P1 | Define lifecycle, visibility and indexability | A02/A03, SEO | Documented |
| ADM-PROD-008 | P1 | Define comparison-readiness integration | A03, A05–A07 | Documented |
| ADM-PROD-009 | P1 | Define localization, security, accessibility and analytics | Shared standards | Documented |
| ADM-PROD-010 | P1 | Finalize acceptance tests and owner decisions | 001–009 | Documented |
| ADM-PROD-011 | P1 | Obtain owner approval | 001–010 | Awaiting Owner Approval |
| ADM-PROD-012 | P1 | Implement approved product workspace and workflows | 011 and shared standards | Not Started |
| ADM-PROD-013 | P1 | Run acceptance, security and regression tests | 012 | Not Run |

## 14. Acceptance tests

| Test ID | Scenario | Expected result | Status |
|---|---|---|---|
| ADM-PROD-T01 | Admin creates product with valid institution/category | Product draft saved with immutable ID and correct references | Not Run |
| ADM-PROD-T02 | Product references missing/inactive institution | Save/publish blocked or explicit authorized exception with reason | Not Run |
| ADM-PROD-T03 | Product references inactive/deprecated category | New assignment blocked with replacement guidance | Not Run |
| ADM-PROD-T04 | Same institution/category has two genuinely distinct products | Both records allowed with distinct identity | Not Run |
| ADM-PROD-T05 | Exact duplicate product submitted | Warning and duplicate review; no silent duplicate publication | Not Run |
| ADM-PROD-T06 | Similar product names from different institutions | Both allowed | Not Run |
| ADM-PROD-T07 | Product variant differs only by marketing label | Duplicate/variant review prompts operator; no automatic new canonical product | Not Run |
| ADM-PROD-T08 | Product has updated interest rate | Rate is created/updated through A05; A04 does not overwrite canonical rate | Not Run |
| ADM-PROD-T09 | Product has new fee or eligibility term | Linked A06/A07 record retains source and history | Not Run |
| ADM-PROD-T10 | Required evidence missing for material public claim | Publication blocked with field-level explanation | Not Run |
| ADM-PROD-T11 | Product has incomplete comparison fields | Readiness shows exact gaps; no false ready status | Not Run |
| ADM-PROD-T12 | Admin approves and publishes valid product | Transition succeeds and is audited without mandatory second approver | Not Run |
| ADM-PROD-T13 | SEO Manager edits metadata/description | Permitted editorial fields update; financial/source fields remain protected | Not Run |
| ADM-PROD-T14 | Sales Executive/Support attempts product mutation | Server denies and records safe audit event | Not Run |
| ADM-PROD-T15 | Unauthorized user calls product API directly | Server denies regardless of UI visibility | Not Run |
| ADM-PROD-T16 | Product slug changes | Redirect validated; old URL does not break or loop | Not Run |
| ADM-PROD-T17 | Product is paused/withdrawn | Excluded from active search/comparison; history preserved | Not Run |
| ADM-PROD-T18 | Institution becomes inactive | Linked products flagged for review; no silent deletion | Not Run |
| ADM-PROD-T19 | Concurrent edits occur | Conflict detected; no silent last-write data loss | Not Run |
| ADM-PROD-T20 | Product export requested | Permission, field allowlist and audit enforced | Not Run |
| ADM-PROD-T21 | Product content includes unsupported approval/rate claim | Validation/review flags or blocks claim | Not Run |
| ADM-PROD-T22 | Hindi/localized product content incomplete | Correct locale-specific draft/publication state shown | Not Run |
| ADM-PROD-T23 | Keyboard/mobile/light-dark accessibility check | Core workflows remain usable and accessible | Not Run |
| ADM-PROD-T24 | Product coverage analytics calculated | Counts reconcile and ratios include numerator/denominator | Not Run |

## 15. Definition of Done

- Owner approves product identity, field contract, variants/duplicate rules and lifecycle.
- Institution/category relationships and Admin/Super Admin/SEO/support boundaries are consistent with approved standards.
- Rates, fees, eligibility, offers and comparison profiles remain separate linked sources of truth.
- Evidence, versioning, freshness and publication validation rules are finalized.
- List/create/edit/detail/review/publish/withdraw workflows and all UI states are specified.
- Acceptance tests pass with evidence after implementation; security, accessibility and regression checks pass.
- Lint, typecheck, relevant unit/integration tests, E2E flows and production build pass.
- Master tracker reflects actual status and next focus.

## 16. Owner decisions

1. Approve or revise the product field contract, including which product-level amount/tenure/availability fields are required by category.
2. Confirm variant rule: create a separate canonical product only where material terms, eligibility, repayment, collateral or application process differ; marketing-only labels remain attributes/campaigns.
3. Approve the proposed lifecycle states and confirm Admin may use all configured operational transitions while Super Admin alone changes the state catalogue/transition structure.
4. Confirm publication policy for products with incomplete category comparison fields: publish with explicit gaps where material claims are evidenced, or block until all comparison-required fields are complete.
5. Approve duplicate/merge behavior and the requirement for an impact review before institution/category reassignment.

No implementation or bulk product import is authorized by this draft. Existing A01–A03 owner approvals are recorded separately; A04 remains pending approval.
