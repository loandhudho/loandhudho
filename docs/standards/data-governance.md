# Data Governance Standard

**Status:** Draft — owner approval pending  
**Last updated:** 2026-11-02  
**Applies to:** Institutions, loan products, rates, fees, eligibility, offers, search/comparison data and future lead workflows.

## 1. Purpose and governing principles

LoanDhudho is a discovery and comparison marketplace. Its usefulness depends on broad lender coverage and trustworthy, current, comparable information—not simply the number of records stored.

1. Build a structured directory of banks, NBFCs and other eligible institutions, with institution type and status verified.
2. Model each lender's individual loan products by category; do not assume one institution offers every category or one product has one universal rate.
3. Treat rates, fees, eligibility terms and offers as time-bound, sourced facts.
4. Preserve history. A changed rate must create a new effective record/version rather than erase the prior published fact.
5. Distinguish unavailable, undisclosed, unverified, stale, expired and not applicable values.
6. Compare like with like. Category-specific comparison profiles define the required fields and units.
7. Separate lender-sourced facts, editorial explanation, calculated estimates and sponsored placements.
8. Never fabricate missing data or imply a partnership, lender integration or guaranteed loan outcome.

## 2. Canonical entity model

| Entity | Minimum conceptual fields | Governance notes |
|---|---|---|
| Institution | Stable ID, legal/display name, institution type, regulator/source evidence, website, status, timestamps | Validate legal identity and operating status; distinguish directory listing from partnership |
| Loan category | Stable ID, name, slug, parent/category hierarchy, locale labels, status | Controlled taxonomy; English/Hindi labels and synonyms |
| Loan product | Stable ID, institution/category references, product name, description, status, lifecycle/review state | One lender may have multiple products in the same category |
| Rate record | Product reference, rate/range, rate type, units, benchmark/spread if sourced, effective dates, source, verification status | Versioned and effective-dated; fixed/floating/mixed where applicable |
| Fee/charge | Product reference, fee type, value/unit, applicability, conditions, effective dates, source, verification status | Do not collapse distinct fee types into one unexplained amount |
| Eligibility rule | Product reference, criterion, operator/value/unit, conditions, source and effective dates | Structured facts plus carefully labeled lender text |
| Offer | Institution/product reference, terms, validity window, source, verification status and publication state | Expiry and source invalidation must affect public visibility |
| Source evidence | URL/document reference, publisher, captured/verified dates, reviewer, evidence notes | Track evidence per claim where practical |
| Review record | Entity/version, submitter, reviewer, decision, timestamps, reason | Separate draft, submitted, approved, rejected/returned and published states |
| Audit event | Actor, action, target, timestamp, outcome, safe metadata | Append-only security-sensitive history |

Use normalized relational references for institution, category and product. A bank may offer multiple home-loan products; each product can have multiple historical/current rate and fee records. Do not store one “bank home loan rate” field as the canonical source of truth.

## 3. Source and verification requirements

Every material public financial claim should have:
- A source URL or traceable evidence reference.
- Source publisher/identity where available.
- Last verified timestamp and verifier/reviewer.
- Effective-from and effective-to dates where the source provides them.
- A status indicating verified, unverified, stale, expired, disputed or withdrawn.
- A record of the previous value/version and the reason for change.

Preferred evidence order:
1. Official lender product page, rate card, schedule of charges, official document or written lender communication.
2. Official regulator/government source for institution identity/status or regulatory facts.
3. Other reputable sources only as secondary context, clearly attributed and not substituted for lender terms without review.

A source URL alone does not prove a claim is current. Imported content is untrusted until validated. Record capture date separately from effective date and last-verified date.

## 4. Freshness policy — proposed configurable defaults

These are initial operational recommendations, not approved service-level agreements and not claims about lender update frequency.

| Data type | Reminder after verification | Mark stale after | Additional trigger |
|---|---:|---:|---|
| Interest rates | 90 days | 180 days | Lender-published revision, source/effective-period change or credible correction; age alone does not imply a rate change |
| Fees and charges | 60 days | 90 days | Schedule-of-charges update |
| Offers | 7 days before expiry | At expiry | Source invalidation or terms change |
| Institution profile | 180 days | 365 days | Legal/status/name change |
| Product terms/eligibility | 90 days | 180 days | Material lender update |

Rules:
- Missing last-verified timestamp is **Unverified**, not fresh.
- Missing required source evidence on a material published claim is a publication-blocking exception.
- Expiry is evaluated independently of freshness age.
- Material corrections trigger immediate review.
- Thresholds are configurable by authorized administrators and every change is audited.
- Store timestamps in UTC; use IST (Asia/Kolkata) for business-date display and boundary logic unless globally revised.
- Display last verified and effective date as separate concepts.
- A threshold change affects future classification; it must not rewrite the underlying historical evidence.

## 5. Category-specific comparison profiles

A product category defines the fields needed for a fair comparison. A profile should identify each field's label, type, unit, requiredness, display rules, source requirement, sort/filter behavior and whether it is comparable across lenders.

For a home loan, the initial candidate profile includes:
- Rate value/range and whether it is fixed, floating or mixed.
- Benchmark and spread, only where officially disclosed.
- Effective date and last-verified date.
- Tenure range.
- Processing fee and other material charges, including units and conditions.
- Eligibility highlights and key conditions.
- Loan amount range, where sourced.
- Source/evidence and lender-specific caveats.

For personal loans, vehicle loans, education loans, loan against property and other categories, define separate profiles; do not copy home-loan fields blindly.

Comparison rules:
- Compare only equivalent units and clearly defined terms.
- Show “not disclosed” / “not available” instead of filling gaps with estimates.
- Show rate type and effective/verification dates near the rate.
- Clearly label estimated EMI and calculator outputs; do not imply lender quotation or approval.
- Explain material caveats and fees alongside headline rates.
- Sponsored placement must be clearly labeled and must not change factual ranking or comparison values.
- Where values are not directly comparable, disclose why and avoid false rank ordering.

## 6. Coverage and quality measures

Track catalog breadth and completeness separately:
- Institutions by verified type and status.
- Active institutions with at least one published product.
- Products by institution and category.
- Published products with current verified rate records.
- Published products with required fee disclosure.
- Published material claims with source and verification metadata.
- Products meeting category comparison-readiness requirements.

For every coverage ratio, display numerator and denominator. Distinguish no product, no rate, undisclosed rate, unverified rate and stale rate. A directory listing is not evidence of a lender partnership.

## 7. Publication and review lifecycle

Recommended lifecycle:
- Draft → Submitted for review → Approved → Published.
- Submitted record may be Returned for correction or Rejected with a reason.
- Material edits to a published financial claim create a new version and require review before publication.
- Expired/withdrawn offers and invalid product terms must be unpublished or clearly marked according to the approved lifecycle.
- Reviewers should not approve their own submissions unless a documented break-glass process explicitly permits it and logs the exception.
- All state transitions record actor, timestamp and reason.

## 8. Calculators and derived values

Calculators consume sourced product data only when the data is current and suitable. User-entered assumptions must be distinguished from lender-published terms. EMI, affordability and eligibility outputs are indicative estimates, with formula, units, assumptions and limitations documented. Handle zero interest, invalid ranges, missing values, rounding and boundary conditions. Do not claim pre-approval or guarantee eligibility.

## 9. Lead data boundary

Lead capture and transfer are a separate governed capability, not an ordinary catalog field. Before activation, the dedicated lead specification must define lawful purpose, data minimization, explicit purpose-specific consent, named recipients, sharing event/audit, retention/deletion, access/export/correction processes, security controls and legal review. No lead personal data is included in general dashboard metrics or catalog workflows by default. Never collect OTPs, PINs, banking passwords or UPI credentials.

## 10. Localization, units and display

- English default; Hindi labels and search synonyms supported.
- INR and Indian number formatting for money.
- Store numeric values with explicit units and currency; do not parse formatted display strings as canonical data.
- Store percentages as numeric values with explicit meaning (annual/monthly, nominal/effective, range boundaries).
- Use decimal-safe database types for financial values.
- Dates show effective date and last verification date separately; display operational timestamps in IST.
- Preserve lender wording where legally/materially necessary, with editorial explanation separated from source text.

## 11. Security, audit and data retention

- Least-privilege access; server-side authorization for read, create, edit, review, publish, export and delete.
- Audit material changes to rates, fees, eligibility, offers, sources, permissions and freshness settings.
- Never log secrets, credentials, full borrower records or unnecessary personal data.
- Validate URLs and imported files; prevent unsafe content and server-side request forgery in any URL-fetching workflow.
- Define retention and deletion schedules before collecting personal data.
- Backups and history must support recovery without making withdrawn public claims visible.

## 12. Acceptance checklist

- [ ] Institution identity/type and status have evidence.
- [ ] Every product is linked to an institution and category.
- [ ] Rates/fees are separate versioned records with source and effective/verification dates.
- [ ] Category comparison profile is defined and validated.
- [ ] Missing, undisclosed, unverified, stale and expired states are distinct.
- [ ] Public financial claims pass review and freshness rules.
- [ ] Historical versions remain auditable.
- [ ] Coverage ratios expose numerator and denominator.
- [ ] Calculators label assumptions and estimates.
- [ ] Sponsored content is disclosed and separated from factual comparison.
- [ ] Lead capture remains disabled until its dedicated legal/compliance gate is passed.

## 13. Open owner approvals

1. Approve or revise proposed freshness thresholds before treating them as operational policy.
2. Approve category-specific comparison profiles during the relevant product/category page specifications.
3. Approve lead capture and lender data-sharing only after legal/compliance review and recipient agreements.
