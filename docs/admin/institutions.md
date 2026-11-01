# Institutions — Admin Page Specification

**Page ID:** A02 / ADM-INST  
**Route:** `/admin/institutions`  
**Phase:** 1 — Admin page analysis/specifications  
**Status:** Documented — Owner Approval Pending  
**Priority:** P1  
**Last updated:** 2026-11-02  
**Owner approval:** Pending  
**Implementation:** Not started

## 1. Purpose

Provide a trusted, searchable master directory of banks, NBFCs and other eligible lending institutions operating in India. This directory is the parent catalogue for institution-specific loan products, rates, fees, eligibility rules, offers, comparison pages and verified lender destinations.

**Product decision adopted from owner direction:** include eligible institutions in the directory even when they do not yet have a verified loan product to publish. Clearly distinguish directory presence from product availability, verification and commercial partnership. Never imply that an institution is a LoanDhudho partner merely because it is listed.

## 2. Goals and non-goals

### Goals
- Create one canonical institution record per verified legal institution/brand relationship, with clear handling for subsidiaries and brands.
- Support nationwide coverage and future growth across institution types.
- Maintain official identity, classification, operating status, website and evidence.
- Link each institution to multiple loan products across multiple categories.
- Show coverage gaps: listed institutions with no products, products without verified rates, stale evidence and incomplete profiles.
- Support review, publication, correction, deactivation and audit workflows.
- Provide institution data to public directory/profile pages and product comparison journeys.

### Non-goals
- Create or imply a lender partnership, referral agreement or API integration.
- Store a bank's rate as a single institution-level value; rates belong to specific products and effective periods.
- Manage product terms/rates/fees inline as institution fields; those belong to dedicated modules.
- Capture borrower leads or transfer personal data from this page.
- Automatically scrape or publish lender data without validation and review.

## 3. Users and permissions

| Capability | Super Admin | Editor | Reviewer | Support/Analyst |
|---|---|---|---|---|
| View institution list/details | Global | Assigned scope | Review scope | Scoped read-only |
| Create institution draft | Yes | If granted | No by default | No |
| Edit institution profile | Yes | Assigned scope | No except correction workflow | No |
| Submit for review | Yes, with audit | Yes | No | No |
| Approve/reject institution changes | Yes, subject to separation-of-duties policy | No | Assigned review scope | No |
| Publish/deactivate | Yes | No by default | Approve only; publish permission separate | No |
| Manage institution type/taxonomy | Yes | No by default | No | No |
| Export directory | Explicit permission | Scoped permission | No by default | No by default |
| View audit history | Yes | Own/related events if granted | Review-related events | No by default |

Effective permissions and record scope govern every action. Do not rely on role-name checks or hidden UI controls. If a user can edit institution details but not publish, the API must enforce that distinction.

## 4. Information architecture

### List page
- Page title and explanatory subtitle.
- Summary strip: total listed, active, draft/in review, inactive/suspended, and active institutions with zero published products.
- Search by institution legal/display name, aliases and official domain.
- Filters: institution type, status, verification status, product coverage, state/region if supported, updated date.
- Sort: name, recently updated, status, product count, verification age.
- Paginated table with bulk actions only where safe and permissioned.
- Primary action: Add institution (authorized roles only).

Recommended table columns:
1. Institution name and logo/monogram.
2. Institution type (Bank, NBFC, Small Finance Bank, Payments Bank, Cooperative Bank, Housing Finance Company, Other verified category).
3. Directory status.
4. Verification state / last verified date.
5. Published product count, with category breakdown on detail.
6. Rate coverage/comparison readiness summary (derived, not editable here).
7. Last updated.
8. Actions menu.

Do not overload the table with all regulator identifiers or address fields. Use detail view for full record.

### Detail page/drawer
Tabs/sections:
- Overview and public profile.
- Identity and classification.
- Official contact and website.
- Evidence and verification history.
- Linked products by category and lifecycle state.
- Data coverage: products with current rates, fees and comparison-ready fields.
- Offers (read-only links to offers module).
- Activity/audit history, permission-gated.

### Create/edit form
Use grouped sections and save-draft behavior. Required fields are explicit; optional fields should not block creating a basic directory record. Review/publish actions are separate from saving.

## 5. Institution record fields

### 5.1 Core identity
| Field | Required | Validation / behavior |
|---|---|---|
| Legal name | Yes | Verified legal/institution name; preserve official spelling |
| Display name | Yes | Public-facing name; may differ from legal name |
| Slug | Yes before publication | Unique, stable, URL-safe; changes require redirect strategy |
| Institution type | Yes | Controlled taxonomy; not free text |
| Parent institution | Conditional | Link for subsidiary/brand relationships; prevent cycles |
| Relationship type | Conditional | Parent, subsidiary, brand, division, successor/merged entity; reviewed |
| Aliases/search names | Optional | Normalized unique within defined scope; English/Hindi/transliteration support |
| Logo | Optional | Uploaded asset or approved official asset reference; rights/source recorded |
| Short description | Optional | Editorial copy, separate from official facts |
| Official website | Required before public publication | HTTPS URL; domain ownership/official-source verification recorded |
| Public profile visibility | Controlled by publication state | Draft records must not leak publicly |

Institution type taxonomy should be configurable but controlled. Initial suggested types: Public Sector Bank, Private Sector Bank, Foreign Bank, Small Finance Bank, Payments Bank, Regional Rural Bank, Cooperative Bank, NBFC, Housing Finance Company, and Other Regulated/Eligible Institution. Classification must be evidence-backed and reviewed; do not infer regulatory classification from marketing language.

### 5.2 Regulatory and identity evidence
| Field | Required | Notes |
|---|---|---|
| Regulator / supervisory classification | Conditional | Controlled value plus source |
| Registration / license identifier | Conditional | Store only where relevant, public/legitimate to display and verified |
| Official institution source URL | Yes | Prefer official institution and regulator sources |
| Evidence document/reference | Recommended | Document title, issuer, date, storage reference |
| Verification status | Yes | Unverified, pending review, verified, disputed, suspended, expired |
| Last verified at | Required for verified/public profile | Timestamp and verifier |
| Verification notes | Optional/restricted | Internal note; do not expose publicly |
| Verified by | System-managed | Authenticated reviewer identity |

Do not require every institution to have the same regulator ID field. Validate according to institution type and applicable official source. Do not publish sensitive internal notes.

### 5.3 Public contact/profile details
- Official website URL.
- Official customer-care phone/email only when published by the institution and verified.
- Registered/corporate address where appropriate and sourced.
- Public social links only when verified as official.
- Public description and logo attribution/source.
- Publicly supported categories derived from published products, not manually asserted without evidence.

Never present an unverified phone number, email, branch address or social profile as official. Do not collect private staff contact information.

### 5.4 Internal operational fields
- Directory lifecycle status: Draft, In Review, Active/Published, Inactive, Suspended, Merged/Archived.
- Verification status and next review due date.
- Assigned editor/data owner.
- Internal notes with restricted access.
- Created/updated timestamps and actor.
- Publication timestamp and publisher.
- Reason for suspension, merge, deactivation or correction (internal; public explanation only where appropriate).

Keep partnership status separate from directory status. If partnerships are later modeled, use a separate entity and approval workflow.

## 6. Directory coverage and relationships

- One institution can have many loan products.
- One product belongs to one primary institution; if co-lending or multiple legal lenders apply, model an explicit relationship rather than duplicating the institution or silently assigning multiple owners.
- Institution may have products in multiple categories and multiple products within the same category.
- Product count must distinguish draft, in-review, published and archived.
- Institutions with no published products remain listed in admin with a clear “No published products yet” status.
- Public directory inclusion is a publication decision: an institution can have a public directory profile with no products only when its identity and official profile are verified and editorial value is clear. Otherwise keep it admin-only/in-review.
- “No products listed” must not imply the institution offers no loans; phrase as “No verified products currently listed on LoanDhudho.”
- Merged/successor institutions must preserve history and redirect public slugs as appropriate; never hard-delete an institution referenced by historical rates, products or audit records.

## 7. Workflows and lifecycle

### Create and publish
1. Authorized editor/admin creates draft with legal/display name, type and source.
2. System validates required fields, duplicate candidates and official URL.
3. Editor adds identity evidence and submits for review.
4. Reviewer checks identity, classification, source and duplicate/parent relationships.
5. Reviewer approves or returns with reason.
6. Authorized publisher activates/publicly publishes the profile.
7. Audit event records each transition.

### Update
- Non-material editorial corrections may follow a configured review policy.
- Legal name, institution type, regulatory status, official domain, parent relationship and public contact changes require re-verification and review.
- Published material changes should create an auditable version and preserve previous public facts where needed.
- A change to institution identity/status should trigger review of linked products and public claims.

### Suspend/deactivate/merge
- Suspension immediately prevents new public referrals/application links from being presented as current, subject to policy and legal review.
- Deactivation removes profile from active directory discovery but preserves historical references.
- Merge/successor workflow requires target institution, reason, reviewer approval, reference migration plan and URL redirects.
- Never hard-delete an institution with linked products, rates, offers, leads or audit history.

## 8. Duplicate prevention and data integrity

Duplicate candidates should be detected using normalized legal name, display name/aliases, official domain, registration identifier where appropriate, and parent relationship. Matching is a review aid, not automatic proof of identity.

- Warn before creating a likely duplicate.
- Block exact duplicate stable identifiers/official-domain rules only where the business rule is unambiguous.
- Allow separate legal entities sharing a group/brand when evidence supports them.
- Never merge records automatically.
- Prevent parent cycles and invalid self-parent relationships.
- Preserve old slug redirects after approved slug changes.
- Referential integrity must prevent deleting institutions referenced by products/history.

## 9. Search, filters, sorting and pagination

- Search legal/display name, aliases, official domain and normalized transliterations.
- English, Devanagari Hindi and Romanized Hindi aliases should be supported where editorially verified.
- Filters are combinable and reflected in safe query parameters.
- Sorting is deterministic with stable tie-breaker.
- Pagination is server-side; define default/max page size in API convention.
- Show applied filters and a clear reset action.
- Empty search, no-result, loading and error states are specified below.

## 10. Validation and URL safety

- Trim and normalize whitespace; preserve official legal spelling and Unicode.
- Validate slug uniqueness and reserve system routes.
- Validate website/contact URLs server-side; allow only appropriate schemes (HTTPS by default). Do not fetch arbitrary URLs from the server without SSRF protections.
- Validate phone/email formats but do not treat syntactic validity as proof of ownership.
- Upload validation: allowlisted file types, MIME/content inspection, size limits, malware scanning where available, safe storage and image transformation.
- Escape/render descriptions safely; reject executable markup.
- Enforce field-level length limits and required fields.
- Use transactions for identity/relationship updates and audit writes.

## 11. Data quality and freshness

- Institution identity/status and official contact details require evidence and a last-verified timestamp.
- Proposed institution profile reminder/stale defaults are 180/365 days, configurable under data governance; not an approved SLA yet.
- A regulator notice, merger, official domain change, suspension or user correction triggers immediate review.
- Missing evidence is “Unverified”; never show a green verified badge by default.
- Institution freshness is separate from product rate/fee freshness.
- Institution detail should summarize linked product freshness without substituting institution verification for product-level verification.
- Product rates and fees remain managed in dedicated modules and tied to product records.

## 12. UI states and accessibility

| State | Expected behavior |
|---|---|
| Loading | Table skeleton and stable layout; announce loading |
| Empty directory | Explain no institutions exist; show authorized create action |
| No search results | Show query, clear filters and suggest alternate search |
| No products | Show “No verified products currently listed on LoanDhudho” in admin; do not imply lender offers none |
| Draft/in review | Status visible in admin; never leak publicly |
| Unverified | Clear warning and next action; no verified public badge |
| Suspended/inactive | Explain status and restrict publication/referral actions |
| Partial detail data | Show available verified fields and explicit unavailable labels |
| Failed request/upload | Preserve form input where safe; actionable error and retry |
| Permission denied | Deny server-side; safe access message |
| Duplicate candidate | Show possible match with comparison context; require human decision |

Accessibility requirements: semantic table, keyboard-accessible filters/actions, labels and field-level errors, focus management for dialogs, sufficient contrast, non-color status labels, screen-reader announcements and responsive table/card behavior.

## 13. Public data and SEO considerations

- Public profile fields are explicitly allowlisted; never serialize internal notes, verification comments, draft data or audit metadata.
- Public institution profile only appears after approval and publication.
- Use stable canonical URLs and redirect old slugs after approved changes.
- Do not add structured data implying a lender relationship or endorsement.
- Display last reviewed/verified date with clear meaning.
- If institution has no published products, public profile copy must say no verified products are currently listed on LoanDhudho.
- Public claims must be evidence-backed and editorially reviewed.
- Institution listing does not imply LoanDhudho has authorization to act for the institution.

## 14. Dependencies and integration contracts

- Data governance standard: institution identity, evidence, freshness and history.
- Loan Categories (A03): category taxonomy for linked product coverage.
- Loan Products (A04): institution-to-product relationship and product lifecycle.
- Rates (A05), Fees (A06), Eligibility (A07), Offers (A08): derived coverage summaries.
- Users/Roles (A13) and Authorization standard: permissions, assignment and review separation.
- Audit Logs (A14): sensitive changes and state transitions.
- Settings (A15): institution type taxonomy, freshness defaults and upload constraints.
- Frontend institution directory/profile (F05/F06): public field allowlist and publication behavior.

## 15. Tasks

| Task ID | Priority | Task | Dependency | Status |
|---|---|---|---|---|
| ADM-INST-001 | P1 | Confirm institution coverage policy: include eligible institutions without listed products; clearly distinguish listing from partnership | Owner direction | Resolved — adopted from owner “go ahead” |
| ADM-INST-002 | P1 | Define institution types, legal identity and parent/brand/merger relationships | Data governance | Documented — taxonomy proposed; regulator validation rules need review |
| ADM-INST-003 | P1 | Define core profile fields, official sources and verification workflow | 002 | Documented |
| ADM-INST-004 | P1 | Define directory list/detail/create/edit information architecture | 003 | Documented |
| ADM-INST-005 | P1 | Define permissions, review/publish and lifecycle transitions | Authorization standard | In Progress — page rules documented; shared matrix pending |
| ADM-INST-006 | P1 | Define duplicate detection, URL safety and integrity rules | 002, 003 | Documented |
| ADM-INST-007 | P1 | Define product coverage summaries and integration contracts | A03–A08 | Documented — dependent modules to align |
| ADM-INST-008 | P1 | Finalize UI states, accessibility, SEO/public field allowlist and acceptance tests | 004–007 | Documented |
| ADM-INST-009 | P1 | Obtain owner approval for institutions specification | 001–008 | Awaiting Owner Approval |
| ADM-INST-010 | P1 | Implement approved institutions module | 009 approved | Not Started |
| ADM-INST-011 | P1 | Execute tests and record evidence | 010 | Not Started |

## 16. Acceptance criteria and test plan

| Test ID | Scenario | Expected result | Status |
|---|---|---|---|
| ADM-INST-T01 | Authorized user opens institution list | Correct scoped records, summary counts and pagination appear | Not Run |
| ADM-INST-T02 | Search legal/display name, alias and transliteration | Relevant institution results appear with deterministic ordering | Not Run |
| ADM-INST-T03 | Filter by type, status, verification and product coverage | Filters combine correctly and are preserved in safe query parameters | Not Run |
| ADM-INST-T04 | Create institution with minimum draft fields | Draft saved; no public visibility | Not Run |
| ADM-INST-T05 | Submit institution without required official evidence | Submission/publication blocked with field-level guidance | Not Run |
| ADM-INST-T06 | Create likely duplicate | Candidate warning shown; no automatic merge | Not Run |
| ADM-INST-T07 | Institution has no published products | Admin and public messaging accurately says no verified products listed; no claim that lender offers none | Not Run |
| ADM-INST-T08 | Institution links to multiple products/categories | Counts and detail links are correct; products remain distinct | Not Run |
| ADM-INST-T09 | User without edit permission calls mutation endpoint | Server denies; no record changes | Not Run |
| ADM-INST-T10 | Editor attempts publish/deactivate without permission | Server denies; audit policy records attempted sensitive action where applicable | Not Run |
| ADM-INST-T11 | Change official domain/type/legal name | Re-verification/review required; old values preserved in history | Not Run |
| ADM-INST-T12 | Suspend or merge institution with linked products | No hard deletion; references/history and redirect plan preserved | Not Run |
| ADM-INST-T13 | Unsafe URL or upload supplied | Rejected safely; no server-side arbitrary fetch or executable content | Not Run |
| ADM-INST-T14 | Public profile requested for draft/unverified institution | No private/draft fields or unauthorized public profile is returned | Not Run |
| ADM-INST-T15 | Institution record is stale or missing verification date | Correct distinct freshness state and review action shown | Not Run |
| ADM-INST-T16 | Mobile, keyboard and English/Hindi themes | Usable, accessible, responsive and correctly localized | Not Run |
| ADM-INST-T17 | Institution slug changes after publication | Approved redirect/canonical behavior preserves old inbound links | Not Run |

All tests are Not Run until implementation exists and execution evidence is recorded.

## 17. Definition of Done

- Institution taxonomy and identity/relationship rules approved.
- List, detail, create/edit and lifecycle workflows approved.
- Role/permission matrix and review/publish separation finalized.
- Official source, evidence, freshness and duplicate rules finalized.
- Product coverage summaries align with A03–A08 data models.
- Public field allowlist, SEO and no-product wording approved.
- Acceptance tests pass with evidence after implementation.
- Lint, typecheck, unit/integration tests, affected E2E flows and production build pass.
- Master tracker reflects actual status and next focus.

## 18. Open decisions for product owner

1. **Directory coverage — adopted:** include eligible institutions even when no verified product is currently listed; clearly label “No verified products currently listed on LoanDhudho.” Directory listing is not a partnership.
2. Institution-type taxonomy and exact regulatory eligibility should be validated against authoritative Indian sources during data sourcing and reviewed before bulk import.
3. Public profiles for institutions with no products should be published only when identity and official profile are verified and the profile provides useful directory value; otherwise keep them admin-only until ready.

No institution bulk import, code implementation or public listing should begin until this specification and its source/verification policy are approved.


## 19. Owner role-model update — 2026-11-02

The owner-defined role model and permission boundaries are in [authorization.md](../standards/authorization.md) and supersede the provisional Editor/Reviewer/Support-Analyst labels in this specification. For this page:

- **Super Admin:** full institution administration and control of institution-type/status taxonomies.
- **Admin:** create/edit/manage institution records and operational workflows within delegated permissions; cannot redefine institution types/status catalogues or role definitions.
- **SEO Manager:** read approved institution facts and manage only public presentation/SEO content fields where applicable; cannot change verified identity, regulatory classification or source evidence.
- **Sales Executive / Support:** read approved institution/product information needed for assigned customer support; no institution master-data mutations.

All actions require server-side permission checks. Institution-type/status options are controlled system data owned by Super Admin, not free-text values or Admin-defined options.


## 20. Confirmed Admin operational authority — 2026-11-02

The owner confirmed that Admin can create, edit, review, approve and publish institution/bank records and related operational marketplace data, including loan products, rates, fees, eligibility and offers. The institution workflow must not require a separate Reviewer role or mandatory second-person approval for routine publication. Admin cannot redefine institution-type/status catalogues or any role, permission, entity-type or system-status structures; those remain Super Admin responsibilities. Retain official-source evidence, re-verification triggers, version history and audit logs. This decision supersedes earlier provisional workflow wording that separated Admin editing from approval/publishing authority.
