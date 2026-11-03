# F02 — All Loan Categories Specification

**Status:** Draft — Owner Review Pending  
**Last updated:** 2026-11-04  
**Route:** `/loans`  
**Priority:** P0  
**Phase:** Public frontend specifications  
**Implementation:** Not Started  
**Testing:** All acceptance tests Not Run

## 1. Purpose

Provide a clear, browsable directory of the canonical loan categories available on LoanDhudho. Help visitors understand common borrowing options and move to the relevant category detail page (F03). This is a discovery directory, not a lender application, eligibility decision or guarantee of availability.

The page must reflect the actual published catalogue. It must not imply that every lender offers every category or that LoanDhudho covers the entire Indian market.

## 2. Users and primary journeys

- Visitor arrives from the homepage and browses all loan categories.
- Visitor scans category names and short explanations, then opens a category detail page.
- Visitor uses category search/filter to narrow the catalogue.
- Visitor changes between English and Hindi.
- Visitor follows a related guide where a reviewed, published guide is available.

Primary CTA on each category card: **Explore loans** / reviewed Hindi equivalent, linking to the canonical F03 route.

## 3. Page structure

1. Shared public header with navigation, language control and theme control if enabled.
2. Breadcrumb: Home → Loan Categories.
3. H1 and concise introduction explaining that categories describe broad loan types.
4. Optional client-side filter/search over the currently loaded published category list.
5. Responsive category-card grid.
6. Helpful guides section using published A11 content relevant to categories.
7. Short transparency note: product availability, rates, fees and eligibility vary by lender and are shown on product pages with sources and verification dates where available.
8. Shared footer with approved legal and support links.

No hero image is required. Category names and navigation should remain the visual focus.

## 4. Canonical category data contract

Render categories only from canonical A03 records. Do not create or infer category records in the frontend.

Required public fields:
- stable category ID;
- approved localized name and slug for `en-IN` and/or `hi-IN`;
- reviewed short description;
- publication state;
- display order;
- approved icon or image reference, if supplied;
- canonical category route.

Optional fields:
- reviewed introductory content;
- approved related-guide references;
- category-specific display label only when defined in the canonical record.

Do not expose internal notes, draft fields, moderation metadata, permission data or unpublished records. Do not calculate or display product counts unless the count is based on currently published, display-eligible products and its meaning is clear. If no eligible products exist, do not fabricate a count or imply active availability.

## 5. Category coverage and ordering

The page displays every active, publicly published category returned by the canonical catalogue. The initial catalogue may include Home Loan, Personal Loan, Loan Against Property, Business Loan, Education Loan, Vehicle Loan, Gold Loan, Loan Against Securities, Consumer Durable Loan, Credit Line/Overdraft and other owner-approved A03 categories.

This list is illustrative only. The live page must use the actual approved catalogue, not a hard-coded list.

Ordering follows the canonical display order configured by authorized staff. If a category is featured, the feature status and placement must be explicit catalogue data, not a frontend guess. Sponsored placement is not part of this page's MVP.

## 6. Search, filters and interaction

- Provide a lightweight accessible category filter that searches localized category names and approved descriptions.
- Support English and Hindi (Devanagari) only. Do not promise Romanized Hindi or Hinglish matching.
- Filtering must not change canonical catalogue data or create a new search intent.
- If there are few categories, show the complete list without unnecessary filters.
- Preserve selected locale and usable filter state during navigation where practical.
- Selecting a card navigates to the canonical F03 route for that category.
- Unknown, unpublished or withdrawn category routes must resolve safely to not-found or an approved redirect; never silently substitute a different category.

## 7. Localization

- English (India) is the default; Hindi (India, Devanagari) is supported.
- All interface strings use localization message keys.
- Category names, descriptions, accessibility labels and guide summaries must use reviewed locale-specific content.
- Do not machine-translate legal, financial or eligibility statements for public display.
- If a Hindi category description is unavailable or not reviewed, use the approved locale fallback behavior rather than showing broken or unreviewed text.
- Verify Devanagari conjuncts, matras, line wrapping and font fallbacks.

## 8. SEO and rendering

- Server-render the H1, introduction and canonical published category links.
- Use a unique, accurate title and meta description for the category directory.
- Set the canonical URL to `/loans`.
- Index only when substantive public category content and legal launch gates are satisfied.
- Use structured data only when supported by visible, accurate content and approved SEO conventions.
- Do not add financial-product, offer, rating or review structured data to this directory unless the page visibly contains the exact supported information and the SEO standard permits it.
- Avoid duplicate indexable locale or filter URLs. Locale alternates/hreflang are valid only when both localized pages are genuinely available and reviewed.
- Do not claim “all loans in India”, “best loans” or comprehensive lender coverage without evidence and explicit approval.

## 9. Accessibility, responsive behavior and performance

- Target WCAG 2.2 AA.
- Use one clear H1, semantic list/grid structure, meaningful card link names, visible focus and logical keyboard order.
- Category cards must be fully keyboard-operable; avoid nested interactive controls.
- Filter input must have a persistent accessible label and announce result counts/no-results state.
- Layout must reflow at 200% zoom and representative mobile widths without horizontal page scrolling.
- Use readable card density and touch targets; do not rely on color or icons alone to communicate category.
- Reserve media dimensions; omit decorative imagery where it delays meaningful content.
- Core category links must remain usable on low-bandwidth connections and if nonessential scripts fail.

## 10. Privacy, safety and legal boundaries

- No lead capture, account registration, customer PII, document upload, credit checks or lender application submission.
- No personal or financial profile fields.
- Do not store category-filter text or raw search terms by default.
- Aggregate analytics, if proposed, remain disabled until privacy review and approved event definitions.
- Do not request OTPs, PINs, passwords, UPI credentials or bank account details.
- Explain that category information is general and lender-specific terms and approval are determined by the lender.
- Privacy, Terms and Disclaimer routes remain legal-review launch gates.

## 11. Page states

- **Default:** Published categories in configured order.
- **Loading:** Stable skeleton or text loading state without layout shift.
- **Filtered:** Matching categories with an accessible result count.
- **No matches:** Clear message, clear-filter action and link back to the full directory.
- **Empty catalogue:** Helpful explanation and homepage/search fallback; no invented categories.
- **Unavailable category:** Safe not-found/approved redirect behavior.
- **Partial localization:** Approved fallback only; never display machine-generated legal/financial copy.
- **Service error:** Clear retry path; do not show fabricated or stale category data as live.

## 12. Analytics (proposed; privacy review required)

Possible aggregate events:
- `loan_categories_view`;
- `loan_category_filter_used` with locale and coarse result-count band only;
- `loan_category_select` with canonical category ID.

Do not capture typed filter text, personal identifiers, financial attributes or full URL query strings. Do not activate analytics before privacy review.

## 13. Dependencies

- A03 canonical category catalogue and public publication contract.
- F01 public shell, locale/theme controls and navigation conventions.
- F03 category detail route and canonical slug behavior.
- A11 published guides for optional related content.
- Approved Design System, Data Governance, API Conventions and Testing Strategy.
- SEO, privacy and legal launch gates.

## 14. Implementation tasks

All tasks are **Not Started**. This specification does not authorize coding.

| Task | Priority | Scope | Status |
|---|---|---|---|
| F02-001 | P0 | Build responsive category-directory page structure and shared public shell integration | Not Started |
| F02-002 | P0 | Load canonical active/published A03 category records server-side | Not Started |
| F02-003 | P0 | Build localized category cards and canonical F03 navigation | Not Started |
| F02-004 | P1 | Add accessible client-side category filter where catalogue size warrants it | Not Started |
| F02-005 | P1 | Add reviewed related A11 guide links where mappings exist | Not Started |
| F02-006 | P0 | Implement English/Hindi localization and safe locale fallback | Not Started |
| F02-007 | P1 | Add metadata, canonical URL and visible-content structured data | Not Started |
| F02-008 | P0 | Implement loading, empty, no-match, error and unavailable-category states | Not Started |
| F02-009 | P0 | Verify accessibility, responsive reflow, keyboard and low-bandwidth behavior | Not Started |
| F02-010 | P0 | Verify no lead/customer PII/application flow and no unsupported coverage claims | Not Started |
| F02-011 | P1 | Add approved aggregate analytics only after privacy gate | Blocked |

## 15. Acceptance tests

All tests begin as **Not Run**.

| Test | Expected result |
|---|---|
| F02-T01 | Directory renders one clear H1 and semantic page landmarks. |
| F02-T02 | Only canonical A03 categories with active public publication status appear. |
| F02-T03 | Draft, paused, withdrawn and unpublished categories are never exposed. |
| F02-T04 | Category cards display approved localized names/descriptions and canonical links. |
| F02-T05 | Category selection opens the correct F03 route without substituting another category. |
| F02-T06 | Optional category filter matches only approved English/Hindi localized fields. |
| F02-T07 | Filter is keyboard and screen-reader accessible and announces result state. |
| F02-T08 | No-match state offers a clear reset and browse-all path. |
| F02-T09 | Empty catalogue state does not fabricate categories or counts. |
| F02-T10 | Product counts, if present, represent published display-eligible products and are clearly defined. |
| F02-T11 | Related guides link only to published A11 records with reviewed locale content. |
| F02-T12 | English/Hindi content renders correctly, including Devanagari conjuncts and matras. |
| F02-T13 | Missing Hindi content follows approved fallback and never shows unreviewed machine translation. |
| F02-T14 | Metadata, canonical and structured data match visible approved content. |
| F02-T15 | Unsupported comprehensive-market or “best loan” claims are absent. |
| F02-T16 | Keyboard focus, contrast, link names and logical navigation meet WCAG 2.2 AA target. |
| F02-T17 | 200% zoom and mobile/tablet layouts reflow without horizontal page overflow. |
| F02-T18 | Core category links remain usable when nonessential scripts fail. |
| F02-T19 | Loading/error/unavailable-category states do not present fabricated live data. |
| F02-T20 | No lead capture, customer PII, document upload, credit check or application submission is present. |
| F02-T21 | Analytics do not capture typed filter text or personal identifiers and remain disabled pending privacy review. |
| F02-T22 | Informational/lender-decision notice is visible and understandable. |

## 16. Owner review decisions

Please approve or revise:

1. Directory layout with category cards and optional lightweight filter.
2. Canonical A03 catalogue as the sole source of category records and display order.
3. English and Hindi (Devanagari) as the only supported languages.
4. Category cards navigate to F03; this page does not duplicate category detail or product comparison.
5. Published A11 guides may appear only when a reviewed relationship exists.
6. No invented category/product counts, market-coverage claims, sponsored placements or unsupported “best” claims.
7. No lead capture, customer PII, document upload, credit check or lender application flow.
8. Analytics remain disabled pending privacy review.

## 17. Approval and implementation record

- **Owner decision:** Pending.
- **Implementation:** Not Started.
- **Testing:** All 22 acceptance tests remain Not Run.
- **Boundary:** Approval authorizes this page specification for planning only. Coding remains subject to shared technical/security/legal dependencies and does not authorize lead capture, customer PII processing or production launch.
