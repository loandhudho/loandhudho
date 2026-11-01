# Eligibility Rules — Admin Page Specification

**Page ID:** A07 / ADM-ELIG  
**Route:** `/admin/eligibility`  
**Phase:** 1 — Admin page analysis/specifications  
**Status:** Documented — Owner Approval Pending  
**Priority:** P1  
**Last updated:** 2026-11-02  
**Implementation:** Not started

## 1. Purpose

Provide the operational workspace for capturing, verifying, reviewing, approving, publishing and maintaining lender-specific eligibility criteria for each canonical loan product. Eligibility records describe the lender's published criteria and conditions; they are not a credit decision, pre-approval, underwriting engine or promise of sanction.

Every rule is linked to a canonical A04 product. One product may have multiple eligibility rules and versions, with separate criteria for applicant type, employment, income, age, geography, loan amount, tenure, credit profile, collateral and application channel. A criterion may be a hard requirement, preferred profile, conditional requirement, indicative guideline or lender-disclosed exception. The system must preserve this distinction.

## 2. Scope and boundaries

### In scope
- Product-linked eligibility criteria and rule groups.
- Applicant types and borrower/co-applicant applicability.
- Age, income, employment, occupation, business vintage, geography and residency.
- Credit score/history criteria, where explicitly disclosed.
- Loan amount, tenure, LTV, FOIR/obligation and collateral criteria where sourced.
- Required documents and application-channel conditions at a high level.
- Hard requirements, preferences, ranges, conditional criteria and exceptions.
- Source evidence, effective dates, verification, version history and publication.
- Eligibility disclosure completeness and comparison readiness.
- Carefully qualified, non-binding eligibility summaries.

### Out of scope
- Product identity and category structures (A04/A03).
- Interest rates (A05) and fees/charges (A06).
- Offers and campaigns (A08).
- A lender's private underwriting model, internal scorecards or undisclosed policy.
- Credit bureau pulls, bank-account access, identity verification or automated loan application.
- Personalized credit decisions, pre-approval, sanction or guarantee.
- Lead capture or borrower PII; this remains subject to a separate legal/compliance gate.

## 3. Authority and role boundaries

The owner-defined four-role model and [authorization standard](../standards/authorization.md) apply.

| Role | Eligibility-page authority |
|---|---|
| Super Admin | Full access; defines eligibility schemas, rule operators, controlled applicant/occupation/document catalogues, units, statuses, comparison profiles and global validation structures. |
| Admin | Full operational authority to create, edit, verify, review, approve, publish, correct, withdraw and manage eligibility records using configured structures. Routine publication does not require a separate approver. |
| SEO Manager | Read approved eligibility facts and manage separately permissioned editorial presentation/SEO fields. Cannot alter criteria, thresholds, conditions, source evidence, effective dates or verification state. |
| Sales Executive / Support | Read approved eligibility disclosures within assigned scope for support; no eligibility mutations. Customer/lead PII remains disabled pending its separate legal/compliance gate. |

Admin cannot define or change system structures, controlled catalogues, rule operators, entity types, status definitions or permission templates. Enforce effective permissions and record scope server-side on pages, APIs, server actions, imports, exports, jobs and analytics. UI visibility is not authorization.

## 4. Eligibility data model

One eligibility rule represents one criterion or logically grouped set of criteria, linked to one product and scoped to an applicant role or product segment. Avoid one unstructured paragraph as the only source of truth. Preserve the lender's original wording as evidence and as a display fallback when normalization is not safe.

| Field group | Candidate fields | Rules |
|---|---|---|
| Identity | Immutable rule ID, product ID, version, rule-group ID | Product relationship required |
| Classification | Configured criterion type, applicant dimension, rule category | Super Admin owns controlled taxonomy |
| Applicant scope | Primary borrower, co-applicant, guarantor, self-employed applicant, salaried applicant, business entity or configured segment | Scope must be explicit |
| Operator/value | Minimum, maximum, range, exact, one-of, required, not-accepted, conditional, narrative-only | Use typed values and configured operators |
| Unit/basis | Years, months, INR/month, INR/year, percentage, score scale, months of business vintage, geographic code | Unit and basis required for numeric claims |
| Requirement strength | Mandatory, preferred, conditional, indicative, exception or not disclosed | Never collapse preference into hard requirement |
| Conditions | Employment type, income source, location, loan amount, tenure, LTV, customer segment, channel, relationship or other sourced qualifier | Store only evidence-backed conditions |
| Combination logic | All/any groups, nested group reference, exclusion and exception references | Versioned, bounded and validated; no arbitrary executable expressions |
| Evidence | Source URL/document, publisher, title/reference, capture date, verified at/by, evidence note | Evidence supports the exact rule |
| Effective period | Effective-from/to, captured at, verified at, published at, withdrawn at | Distinct timestamps and dates |
| Governance | Draft/review/approval/publication state, reviewer, reason, prior version | Immutable material history |
| Display | Public summary, caveat, disclosure priority, source attribution | Editorial layer cannot mutate rule facts |

### 4.1 Typed criteria and units

- Age: numeric years, with minimum/maximum and the relevant point in the journey (application, sanction or maturity) explicitly stated when sourced.
- Income: amount plus period (monthly/annual), gross/net basis if disclosed, applicant scope and qualifying income source.
- Employment: salaried/self-employed/business/professional/other configured category; record minimum employment or business vintage with months/years and the reference point.
- Credit score: numeric range only with bureau/score scale and whether minimum, preferred or indicative. Never compare scores from different scales as equivalent.
- Geography: country/state/city/pincode/branch/serviceable-area scope as appropriate; do not infer national availability from one branch or a generic lender directory.
- Loan amount and tenure: currency/unit, min/max and any linked conditions; these are eligibility bounds, not a quoted offer.
- LTV, FOIR or obligations: percentage plus exact calculation basis and source definition; do not invent formulas or assume lenders use identical definitions.
- Collateral/property: configured type, value/valuation basis, location or property conditions only where disclosed.
- Documents: required/conditional document type and applicant stage; do not collect or store document images in this admin specification.

### 4.2 Requirement strength

Use explicit states:
- **Mandatory:** lender states the criterion is required.
- **Preferred:** lender describes a desirable profile, not an absolute rejection rule.
- **Conditional:** applies only to a named segment, channel, amount, geography or other condition.
- **Indicative:** published as a general guideline, subject to lender assessment.
- **Exception:** a sourced exception or alternative route, with its own applicability.
- **Not disclosed:** source/review confirms the lender has not disclosed the criterion.
- **Unknown / not captured:** data has not been established.

Do not translate preferred, indicative or unknown into mandatory. A missing rule does not mean there is no requirement. “Not disclosed” is not equivalent to “no minimum” or “not applicable”.

### 4.3 Rule logic and combinations

- Support simple operators: equals, not-equals, greater-than, greater-than-or-equal, less-than, less-than-or-equal, range, one-of, required and conditional.
- Use explicit ALL/ANY groups with visible summaries. Default combination must never be silently assumed when source wording is ambiguous.
- Store exceptions as separately scoped records with source and effective dates.
- Do not implement arbitrary formulas or user-authored executable expressions in this phase.
- Where source wording is ambiguous, preserve it verbatim, mark normalization incomplete and block a definitive structured claim.
- Validate contradictory thresholds, overlapping segments and impossible ranges; allow legitimate distinct segments.

## 5. List and detail workspace

Route: `/admin/eligibility`

### List filters and search
- Search by rule ID, product, institution, category, applicant type, criterion label and source title.
- Filter by criterion family, applicant scope, requirement strength, rule status, verification/freshness, effective period, source availability and publication state.
- Filter for missing units, unclear operators, ambiguous combination logic, conflicting rules, missing source, expired criteria and incomplete product coverage.
- Sort by product, criterion, last verified, effective date, data-quality priority and publication state.
- Stable pagination and retained filter state.

### Suggested columns
Product/institution, criterion, applicant scope, requirement strength, value/unit, condition summary, effective period, verification state, source/last verified and actions.

### Detail view
Show:
1. Canonical product and institution context (read-only relationship).
2. Current and historical rule groups and versions.
3. Typed criterion, value, unit, applicant scope and requirement strength.
4. Conditions, ALL/ANY logic, exceptions and conflicts.
5. Source wording alongside normalized interpretation.
6. Source evidence, effective dates and verification history.
7. Publication state and public display preview.
8. Product eligibility completeness and comparison readiness.
9. Audit history and change reason.

Internal notes and restricted operator metadata must not appear publicly or to unauthorized roles.

## 6. Create, update, verify and publish workflows

### 6.1 Create eligibility rule
1. Select an existing canonical product; institution/category are read-only context.
2. Select configured criterion family and applicant scope.
3. Select requirement strength: mandatory, preferred, conditional, indicative, exception or not disclosed.
4. Enter typed value/operator/unit/basis, or preserve narrative-only wording if safe normalization is not possible.
5. Define applicability conditions and ALL/ANY group membership where the source supports it.
6. Add source wording and attach official evidence.
7. Set effective dates from the source; record capture and verification timestamps separately.
8. Run validation for units, ranges, combinations, duplicates and conflicts.
9. Save draft. Admin may review, approve and publish when evidence and disclosure criteria pass.

### 6.2 Edit and maintain
- Never silently overwrite a published eligibility threshold or condition.
- A material change creates a new version with its own effective period and source evidence.
- Preserve prior values, requirement strength, applicant scope, conditions, rule logic, source wording and publication history.
- Record correction reason, actor, timestamp and impact when correcting a previously published rule.
- End-date or withdraw a prior version only when supported by evidence or documented correction.
- Future-effective rules are scheduled and must not display as current before their effective date.

### 6.3 Verify and publish
Admin may verify, approve and publish routine eligibility records; no separate approver is mandatory. Publication requires:
- Valid canonical product relationship.
- Explicit applicant scope and requirement strength.
- Typed value with unit/basis for numeric criteria, or clearly marked narrative-only content.
- Explicit conditions and combination logic where material.
- Traceable evidence supporting the exact criterion and its interpretation.
- Effective period and verification state.
- No unresolved blocking contradiction, invalid range or ambiguous rule combination.

A rule may be marked “not disclosed” only when source/review supports that statement; absence of an entered record is not proof that the lender has no criterion. Preserve the original wording and audit actor, timestamp, validation outcome and reason. Optional maker-checker is not a baseline requirement.

### 6.4 Withdraw, dispute or correct
Withdraw when lender policy is superseded, product is no longer offered or correction is required. A disputed criterion must not remain presented as an ordinary verified current rule. Restrict affected public claims while resolving; preserve history. Never hard-delete a published rule.

## 7. Effective dating, freshness and history

- Store timestamps in UTC; display operational dates/times in IST (Asia/Kolkata).
- Effective dates are distinct from capture, verification and publication timestamps.
- Current public display requires valid publication/verification state and current date within the effective period.
- Future-effective rules are scheduled, not current; expired rules remain historical.
- Missing effective-from may be allowed in an incomplete draft but must not be treated as a current public rule without an explicitly approved exception.
- Detect overlaps by product + criterion + applicant scope + condition set + effective period. Distinct, sourced borrower segments may coexist.
- Flag contradictory rules, impossible ranges and duplicate submissions; do not silently merge or overwrite.
- Preserve superseded, corrected, expired, disputed and withdrawn versions.

### 7.1 Verification and freshness

The shared data-governance draft proposes a 90-day review reminder and 180-day stale threshold for product terms/eligibility. These remain unapproved configurable defaults, not an SLA. Show verification age. Missing verification date means Unverified, not fresh.

Trigger immediate re-verification when a lender publishes a policy/product update, the cited source changes or disappears, an effective period ends, or a credible correction/dispute is received. Age alone is not evidence that a criterion changed. Expiry is independent of freshness.

## 8. Source evidence and data quality

Preferred evidence:
1. Official lender product page, eligibility page, policy document, application guide, circular or dated written lender communication.
2. Official regulator/government source for regulatory facts only; it does not prove lender-specific underwriting thresholds unless explicitly stated.
3. Reputable secondary source as attributed context only, not a substitute for lender criteria without an approved exception.

For each material claim retain source URL/document, publisher/title, capture date, effective dates where available, last verified at/by, evidence note, verification state and prior version. Evidence must support exact values, units, applicant scope, requirement strength, conditions and combination logic.

Quality queues distinguish:
- No eligibility information captured.
- Source says criterion is not disclosed.
- Explicitly not applicable criterion.
- Criterion exists but value/unit/basis is not disclosed.
- Mandatory vs preferred status unclear.
- Applicant scope or conditional segment unclear.
- Ambiguous ALL/ANY logic or conflicting criteria.
- Unverified, stale, expired, disputed or withdrawn rule.
- Unsupported normalized interpretation.

Do not convert any of these states into an assumed pass or absence of restrictions.

## 9. Public disclosure and eligibility tools

Public product pages should:
- Present verified mandatory, preferred, conditional and indicative criteria with labels.
- Show applicant scope, units, reference point and conditions beside numeric thresholds.
- Preserve lender-specific caveats and avoid implying uniform rules across institutions.
- Attribute sources and show last-verified/effective dates where useful.
- Distinguish not disclosed, unknown, not applicable, unverified and expired.
- Explain that final eligibility and sanction are determined by the lender after its assessment.
- Never guarantee approval, quote a credit decision or imply pre-approval from a checklist.

A future eligibility calculator may offer an **indicative match** only if its rules, inputs, weighting, missing-data behavior and limitations are separately approved. It must not make a credit decision or call bureau/financial data without a separately approved lawful integration and consent. If required user inputs are unknown, return “unable to assess” or “more information needed,” not a pass. Do not infer a score or eligibility from demographic proxies.

No borrower personal data, documents, credit reports, bank credentials or application data are collected by this A07 admin workflow. Any future personal-data intake must pass a separate legal/compliance, privacy and security approval.

## 10. Bulk entry/import

Validated CSV import is proposed as an operational capability, not an evidence shortcut.

- Template includes product ID, criterion type, applicant scope, requirement strength, operator, value, unit/basis, conditions, combination group, source reference and effective dates.
- Preview normalized rows, invalid units, contradictory thresholds, duplicate/overlapping rules, unmatched product IDs and missing evidence.
- Each row retains its own supporting source; a shared file is evidence only where it explicitly supports every row.
- Imported rows remain draft/unverified until validation and Admin review.
- Invalid rows must not partially mutate published rules; use transaction/batch semantics with row-level outcomes.
- Log uploader, file reference/checksum, import time, row outcomes and resulting record IDs; do not log personal data or secrets.
- Provide dry-run, failed-row retry and error report.
- Bulk publication requires explicit confirmation and per-record publish validation.

No import format, automated source scraping or bulk publication is authorized by this draft.

## 11. Security, audit and reliability

- Audit create, edit, verify, approve, publish, schedule, withdraw, dispute, correct, import/export and effective-date changes.
- Capture before/after values for material thresholds, units, requirement strength, applicant scope, conditions and rule logic, plus actor, timestamp, outcome and reason.
- Keep history append-only; never log credentials, credit reports or unnecessary personal data.
- Validate all inputs server-side; use decimal-safe numeric storage and controlled operators/units.
- Protect upload and source URL workflows against malicious files, unsafe redirects and SSRF if server-side fetching is introduced.
- Use optimistic concurrency/version checks to prevent silent overwrite.
- Backups must restore current and historical rule groups consistently.

## 12. UI states, accessibility and analytics

Required states: loading; no rules captured; source says not disclosed; not applicable; no search results; filtered-empty; draft; future-scheduled; current; stale; expired; disputed; withdrawn; missing evidence; missing unit; ambiguous requirement strength; contradictory rules; invalid range; duplicate warning; import preview/error; permission denied; concurrent edit conflict; save failure; publish confirmation.

- Responsive data table with mobile card/detail alternative.
- Keyboard-operable filters, forms, dialogs, date controls and rule-group editor.
- Explicit labels, units, applicant scope and field-level errors; never rely on color alone.
- English default and reviewed Hindi labels; preserve lender wording where materially necessary.
- Light/dark themes with semantic tokens and accessible contrast.
- Analytics: eligibility coverage by product/category/institution; verified coverage; criteria by strength and applicant scope; missing/not-disclosed/unknown distinctions; stale/unverified/expired/disputed counts; source coverage; unresolved conflicts; products with incomplete eligibility disclosure. Ratios show numerator and denominator and respect role scope.

## 13. Dependencies and integration

- A04 Loan Products: canonical product identity and parent relationship. A04 is owner-approved.
- A02 Institutions and A03 Loan Categories: derived institution/category context.
- A05 Rates and History: separate pricing records; eligibility conditions may describe rate applicability but do not mutate rate facts. A05 is owner-approved.
- A06 Fees and Charges: separate charge records; eligibility conditions may describe fee applicability but do not mutate fee facts. A06 is owner-approved.
- Shared data-governance standard: evidence, verification, effective dates, history and configurable freshness.
- Shared authorization standard: role permissions and server-side enforcement.
- A08 Offers: offer-specific eligibility/qualifying conditions belong to the offer record and may reference product eligibility without overwriting it.
- Frontend product detail and comparison: display only verified eligibility facts with conditions and caveats.

## 14. Ordered implementation tasks

All tasks remain **Not Started**; this document does not authorize implementation.

| Task ID | Priority | Task | Dependencies | Status |
|---|---|---|---|---|
| ADM-ELIG-001 | P1 | Define eligibility rule/group schema linked to canonical product | A04, data governance | Not Started |
| ADM-ELIG-002 | P1 | Define controlled criterion, applicant-scope, strength, unit and operator catalogues | Super Admin structures | Not Started |
| ADM-ELIG-003 | P1 | Implement typed criteria and numeric/unit validation | 001–002 | Not Started |
| ADM-ELIG-004 | P1 | Implement conditions and explicit ALL/ANY rule groups | 001–003 | Not Started |
| ADM-ELIG-005 | P1 | Implement mandatory/preferred/conditional/indicative/exception states | 002 | Not Started |
| ADM-ELIG-006 | P1 | Implement source wording, evidence and verification metadata | Data governance | Not Started |
| ADM-ELIG-007 | P1 | Implement effective dating, immutable versions and history | 001, 006 | Not Started |
| ADM-ELIG-008 | P1 | Implement list/detail, filters, search and pagination | 001–007 | Not Started |
| ADM-ELIG-009 | P1 | Implement Admin operational review/approve/publish/withdraw workflow | Authorization | Not Started |
| ADM-ELIG-010 | P1 | Implement server-side permission, scope and field enforcement | Authorization | Not Started |
| ADM-ELIG-011 | P1 | Implement conflict, duplicate, overlap and completeness validation | 003–007 | Not Started |
| ADM-ELIG-012 | P1 | Implement audit events and concurrency-safe updates | 007, 009 | Not Started |
| ADM-ELIG-013 | P1 | Implement eligibility coverage and data-quality analytics | 008, 011 | Not Started |
| ADM-ELIG-014 | P1 | Implement public disclosure data contract and safe indicative-match boundary | 003–007, frontend specs | Not Started |
| ADM-ELIG-015 | P2 | Implement validated CSV import preview/dry-run and row-level outcomes | 006–012, import standard | Not Started |
| ADM-ELIG-016 | P2 | Complete responsive, accessibility, Hindi and theme behavior | Design system | Not Started |

## 15. Acceptance tests

All tests are **Not Run**. Execute and evidence during implementation.

| Test ID | Acceptance criterion | Status |
|---|---|---|
| ADM-ELIG-T01 | Every rule requires a valid canonical product relationship. | Not Run |
| ADM-ELIG-T02 | Institution/category context is derived from product and cannot be inconsistently overridden. | Not Run |
| ADM-ELIG-T03 | Applicant scope and criterion type are explicit for structured rules. | Not Run |
| ADM-ELIG-T04 | Numeric age, income, score, amount, tenure, LTV and vintage values require correct units/basis. | Not Run |
| ADM-ELIG-T05 | Credit score scale and source meaning are retained; unlike scales are not compared as equivalent. | Not Run |
| ADM-ELIG-T06 | Mandatory, preferred, conditional, indicative, exception and unknown states remain distinct. | Not Run |
| ADM-ELIG-T07 | Missing rule data is not interpreted as no requirement or automatic eligibility. | Not Run |
| ADM-ELIG-T08 | ALL/ANY groups are explicit and ambiguous source wording blocks definitive structured publication. | Not Run |
| ADM-ELIG-T09 | Contradictory thresholds, impossible ranges and invalid operators are blocked or flagged. | Not Run |
| ADM-ELIG-T10 | Distinct valid borrower segments and conditional rules can coexist without false duplicate warnings. | Not Run |
| ADM-ELIG-T11 | Source wording and normalized interpretation are both retained and traceable. | Not Run |
| ADM-ELIG-T12 | Missing or unsupported source evidence blocks publication of material criteria. | Not Run |
| ADM-ELIG-T13 | Effective dates are independent of capture, verification and publication timestamps. | Not Run |
| ADM-ELIG-T14 | Future-effective rules are not shown as current; expired rules remain historical. | Not Run |
| ADM-ELIG-T15 | Material changes create new versions and preserve previous published rules. | Not Run |
| ADM-ELIG-T16 | Stale, disputed and withdrawn rules are not shown as ordinary verified current criteria. | Not Run |
| ADM-ELIG-T17 | Not disclosed, unknown, not applicable and unverified states remain distinct. | Not Run |
| ADM-ELIG-T18 | Public display shows applicant scope, units, requirement strength and material conditions. | Not Run |
| ADM-ELIG-T19 | Public copy states that final eligibility is determined by the lender and never guarantees approval. | Not Run |
| ADM-ELIG-T20 | An indicative tool returns unable-to-assess/more-information-needed when essential inputs are missing; it never implies sanction. | Not Run |
| ADM-ELIG-T21 | No credit bureau, banking credential, borrower document or lead data is collected by this admin workflow. | Not Run |
| ADM-ELIG-T22 | Admin can create, review, approve, publish, correct and withdraw operational eligibility rules without mandatory second approver. | Not Run |
| ADM-ELIG-T23 | Super Admin-only structural controls are denied to Admin and other roles. | Not Run |
| ADM-ELIG-T24 | SEO Manager cannot mutate source-of-truth eligibility facts; Support remains read-only and scope-limited. | Not Run |
| ADM-ELIG-T25 | Direct API/server-action/export access enforces permission and record scope; UI hiding alone is insufficient. | Not Run |
| ADM-ELIG-T26 | Audit records actor, action, timestamp, reason and before/after values for material changes. | Not Run |
| ADM-ELIG-T27 | Concurrent edits cannot silently overwrite a newer rule version. | Not Run |
| ADM-ELIG-T28 | Bulk import preview catches invalid/conflicting rows and does not partially mutate published rules. | Not Run |
| ADM-ELIG-T29 | Loading, empty, error, permission-denied, mobile, keyboard and localized states are usable and accessible. | Not Run |

## 16. Definition of Done

- Owner approves this specification and resolves material open decisions.
- Shared authorization, data-governance, API, design-system and testing standards required by implementation are approved.
- All P1 tasks are implemented with code review and automated coverage.
- All P1 acceptance tests pass with recorded evidence; denied-role and direct-endpoint tests pass.
- Criteria retain source wording, typed units, requirement strength, applicant scope, conditions, effective dates and history.
- Public disclosure never converts missing data to a pass and never implies approval or guaranteed sanction.
- Accessibility, responsive, English/Hindi and light/dark requirements pass.
- No borrower PII, credit bureau integration, lead capture or lender application facilitation is introduced without separate approval.

## 17. Open owner decisions

1. **Initial criterion taxonomy:** Approve the candidate dimensions and criterion families in Sections 4 and 5 as the initial controlled catalogue, or revise them. Super Admin owns future structural changes.
2. **Requirement-strength labels:** Approve mandatory / preferred / conditional / indicative / exception / not disclosed / unknown as distinct states.
3. **Numeric thresholds:** Confirm that age, income, credit score, employment vintage, amount, tenure, LTV and FOIR may be stored only with explicit units, basis, applicant scope and source.
4. **Rule combination:** Approve explicit ALL/ANY groups and the rule that ambiguous lender wording remains narrative-only until clarified.
5. **Freshness:** Approve or revise the proposed 90-day reminder / 180-day stale threshold for product terms/eligibility. Age alone does not prove criteria changed; source/policy changes and credible corrections trigger immediate review.
6. **Bulk import:** Confirm whether validated CSV import with preview, dry-run, row-level evidence and Admin-controlled publication is required for MVP. This draft does not authorize scraping or bulk publication.

No implementation, data import, public eligibility publication or tests are authorized by this draft. A07 is awaiting owner approval.
