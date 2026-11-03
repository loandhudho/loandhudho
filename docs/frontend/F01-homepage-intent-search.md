# F01 — Homepage and Intent Search Specification

**Status:** Draft — Owner Review Pending  
**Last updated:** 2026-11-04  
**Route:** `/`  
**Priority:** P0  
**Phase:** Public frontend specifications  
**Implementation:** Not Started  
**Testing:** All acceptance tests Not Run

## 1. Purpose and user intent

The homepage is the primary entry point to LoanDhudho. It should help a visitor describe a borrowing need in ordinary language, understand what the marketplace does, and move to relevant published loan categories/products.

Examples of supported intent:
- “I want to buy a house.”
- “Need a personal loan for medical expenses.”
- “Loan against property for business.”
- “Home loan with low processing fees.”
- Hindi and Romanized/Hinglish equivalents, such as “ghar kharidne ke liye loan” and “mujhe personal loan chahiye”.

The search box is for discovery only. It is not a lead form, application, eligibility decision, or promise of lender approval.

Primary success measures (aggregate only, subject to privacy review):
- Search submission to useful results rate.
- Search refinement rate and no-result rate.
- Progression from results/category to product detail and comparison.
- Search latency and error rate.
- Coverage of intents with at least one eligible, published product.

Do not optimize for raw query volume or collect identifiable borrower profiles.

## 2. Page structure and responsive layout

Recommended section order:
1. Accessible site header: approved brand assets, primary navigation, locale control and theme control if enabled.
2. Hero: concise marketplace value proposition and prominent intent-search field.
3. Search guidance/examples: a small set of clearly labelled example queries; examples are suggestions, not pre-filled claims.
4. Popular loan categories: canonical published categories only.
5. How LoanDhudho works: discover, understand, compare, continue to official lender site.
6. Trust and transparency: explain lender-source attribution, last-verified dates, indicative comparisons and sponsored labels.
7. Helpful guides: only published A11 evergreen guides/FAQs with reviewed localization.
8. Footer: About, Contact/Grievance, Privacy, Terms, Disclaimer and other approved public routes.

Mobile:
- Search is immediately visible without requiring a large hero image.
- Header navigation collapses into an accessible menu.
- Category cards use a readable single-column or compact two-column layout depending on available width.
- No horizontal page overflow; touch controls target approximately 44px where practical.

Tablet/desktop:
- Keep search visually dominant and centered within a readable content width.
- Category and guide cards may use responsive grids.
- Do not introduce auto-rotating carousels or motion that hides content.

Avoid decorative media that delays the search field or causes layout shift. Use supplied brand assets only; do not invent a logo.

## 3. Search interaction and behavior

### Input
- One primary free-text search field with a persistent accessible label, e.g. “What kind of loan are you looking for?”
- Placeholder is an example only and never the sole label.
- Support English, Hindi, Romanized Hindi and Hinglish input.
- Submit by Enter or an explicitly labelled search button; keyboard and screen-reader operation required.
- Preserve the entered query when navigating to results and when returning to the homepage.
- Do not require sign-in or personal details to search.

### Query processing
- Normalize whitespace and safe Unicode forms while preserving the original display query as needed for the current interaction.
- Match approved intent phrases, synonyms and category mappings using the approved search architecture (PostgreSQL full-text search plus pg_trgm as specified by A09), with locale-aware tokenization and conservative transliteration support.
- Distinguish a user's stated purpose from a loan category. Example: “buy a house” is an intent that may map to home-loan products; it is not itself a category.
- Search only published, active and eligible catalogue records. Exclude drafts, withdrawn/expired records and unapproved content.
- Respect product applicability, effective dates and data freshness states. Stale/unverified material facts must not be represented as verified current terms.
- Never infer income, credit score, employer, health, identity or other sensitive personal attributes from free text.
- Do not use an LLM-generated answer as evidence of a lender rate, fee, eligibility term or product availability.

### Suggestions and ambiguity
- Suggestions, if shown, are limited to approved categories and intent labels; no fabricated lender or product suggestions.
- For ambiguous queries, show a small set of transparent interpretations and let the visitor choose/refine. Do not silently force a single interpretation.
- If confidence is insufficient, show relevant popular categories and invite a more specific query rather than inventing results.
- No-result state explains the issue and offers query refinement and canonical category links.
- Search failure state provides a retry path and browse categories fallback.

### Navigation
- Submit navigates to `/search?q=...` using URL-safe encoding. Do not put personal/financial sensitive details or secrets in URLs; the interface should discourage entering them.
- Search results page F24 owns results, filters, sort and query refinement. F01 does not duplicate the results experience.
- Selecting a category card navigates to its canonical category route from published category records.
- Guide links navigate only to published A11 content.

## 4. Data and content contract

Homepage data must be server-rendered from canonical, published records:
- Categories: stable ID, localized name/slug, short reviewed description, approved icon/image reference if any, publication state and sort order.
- Featured guides: published A11 record ID, localized title/summary, slug, publication/update date and approved image metadata.
- Trust metrics, if later displayed, must have an explicit source, calculation definition, review cadence and owner approval. Do not use invented counts, “best rates”, “largest marketplace” or unsubstantiated claims.
- Institution/product cards are not required in the homepage MVP unless a specific placement is approved and every fact has provenance.
- Never imply that listed institutions are partners or that LoanDhudho is a lender.

Search uses A09 intent mappings and canonical A03 categories; result eligibility and product facts follow A04–A08 data contracts. F01 must not create a parallel catalogue.

## 5. SEO and rendering

- Server-render the main value proposition, category links and published guide links.
- Page title and meta description must accurately describe a loan discovery/comparison marketplace without promising approval or guaranteed savings.
- Canonical URL: homepage root route.
- Index homepage only when substantive public content is present and legal launch gates are satisfied.
- Structured data is allowed only where supported by visible, accurate page content and the approved SEO standard; no fabricated ratings, reviews, financial offers or organization claims.
- Use reviewed English/Hindi metadata and hreflang only when both localized versions are genuinely available and reviewed.
- Avoid indexing search query parameter variations as separate landing pages by default; F24 owns search-result indexing policy.
- Do not add FAQ structured data unless visible FAQ content and applicable search policy support it.

## 6. Localization

- English (India) is the default locale; Hindi (India) is supported.
- All visible strings use localization message keys.
- Hindi translations of financial, legal and consumer-safety statements require native review.
- Search examples and suggestions must be natural in Hindi and Romanized Hindi/Hinglish, not literal transliterations that change meaning.
- Preserve query text as entered for the current search flow; avoid storing raw queries by default.
- Display INR with Indian grouping and dates in clear India-friendly formats when needed.
- Ensure Devanagari conjuncts, matras, mixed Latin/Devanagari text and font fallbacks do not clip.

## 7. Accessibility and performance

- Target WCAG 2.2 AA per approved Design System.
- Semantic landmarks, one clear H1, logical heading order, accessible input label, button name, focus visibility and status announcements.
- Search suggestions, if implemented, must support keyboard navigation, screen-reader semantics, Escape and focus management. Do not implement an inaccessible custom combobox.
- Respect reduced motion; no autoplay video or auto-rotating content.
- Test zoom/reflow at 200%, keyboard-only use, contrast and representative screen-reader paths.
- Prioritize LCP content and keep the search usable on low-bandwidth connections; avoid blocking it on analytics or third-party scripts.
- Reserve image dimensions to avoid layout shift. Prefer lightweight assets and server-rendered core content.

## 8. Privacy, safety and legal boundaries

- Search is anonymous discovery; no name, phone, email, PAN, Aadhaar, bank details, income proof or document upload on F01.
- No lead capture, contact form, pre-qualification submission, application submission, lender referral payload or customer account flow.
- Do not retain raw query text by default. Aggregate analytics require a documented privacy review and approved event definitions.
- Avoid logging raw queries, query strings containing sensitive information, full IP addresses or unnecessary device identifiers.
- Provide a short helper notice near search: “Search for loan information only. Do not enter account numbers, passwords, OTPs or other sensitive personal details.”
- Never request OTPs, PINs, passwords or UPI credentials.
- Display a clear general-information notice: results are informational; lender terms and approval are determined by the lender.
- Sponsored placements, if ever present, must be unmistakably labelled and separated from organic relevance. No sponsored homepage slot is included in MVP without explicit placement rules and disclosure approval.
- Privacy, Terms and Disclaimer routes are legal-review launch gates.

## 9. Page states

- **Default:** Search field, approved example prompts, published categories, approved guides and trust explanation.
- **Focused/searching:** Accessible focus state; submit feedback; suggestions only if implemented and available.
- **Validation:** Empty/whitespace query is not submitted; show concise accessible instruction.
- **Ambiguous:** Present grounded interpretations or ask the visitor to refine.
- **No results:** Explain no matching published products were found; offer category browsing and query edit.
- **Search unavailable:** Clear retry message and category browse fallback; do not show fabricated cached results as live.
- **Partial catalogue:** Show available verified content and avoid implying complete market coverage.
- **Category unavailable:** Omit unpublished/withdrawn categories; handle stale links with safe not-found/redirect behavior.
- **Localization unavailable:** Fall back to English only with clear locale behavior; never display broken or machine-generated legal/financial Hindi.
- **Reduced motion / low bandwidth:** Core search and links remain functional without decorative media.

## 10. Analytics events (proposed; privacy review required)

Candidate aggregate events:
- `homepage_view`
- `homepage_search_submit` with coarse locale and non-identifying intent/category mapping only; raw query excluded by default
- `homepage_category_select` with canonical category ID
- `homepage_guide_select` with content ID
- `homepage_search_error` with stable error category, not raw query

No event should include typed free text, personal identifiers, financial profile attributes or full URL query strings. Do not activate analytics until privacy review and consent requirements are decided.

## 11. Dependencies

- Approved shared standards: Design System, Authorization, Data Governance, API Conventions and Testing Strategy.
- Approved A03 categories and A09 intent/search mappings.
- Public frontend page/journey plan and shared public shell/search architecture.
- Search indexing and privacy-safe diagnostics.
- A11 published guides; legal-reviewed Privacy, Terms and Disclaimer pages before public launch.
- Authentication provider is not needed for anonymous homepage discovery.
- No lead or customer PII capability is a dependency for F01.

## 12. Implementation tasks

All tasks remain **Not Started**; this specification does not authorize coding.

| Task | Priority | Scope | Status |
|---|---|---|---|
| F01-001 | P0 | Implement responsive public homepage shell and semantic page structure | Not Started |
| F01-002 | P0 | Implement accessible intent-search input, validation and submit behavior | Not Started |
| F01-003 | P0 | Connect query normalization and approved intent/category mapping | Not Started |
| F01-004 | P0 | Implement conservative ambiguity, suggestion and no-result behavior | Not Started |
| F01-005 | P0 | Load only canonical published categories and reviewed guides | Not Started |
| F01-006 | P0 | Implement privacy-safe search navigation and query handling | Not Started |
| F01-007 | P1 | Add reviewed trust/transparency and how-it-works sections | Not Started |
| F01-008 | P1 | Implement English/Hindi localization and reviewed examples | Not Started |
| F01-009 | P1 | Implement homepage SEO metadata, canonical and visible-content structured data | Not Started |
| F01-010 | P1 | Add approved aggregate analytics only after privacy gate | Blocked |
| F01-011 | P0 | Verify responsive, low-bandwidth and accessibility behavior | Not Started |
| F01-012 | P0 | Verify no lead/customer PII or application flow is exposed | Not Started |

## 13. Acceptance tests

All tests begin as **Not Run**.

| Test | Expected result |
|---|---|
| F01-T01 | Homepage renders semantic structure with one clear H1 and accessible primary navigation. |
| F01-T02 | Search has a persistent programmatic label and works by keyboard and screen reader. |
| F01-T03 | Empty/whitespace query is not submitted and receives accessible guidance. |
| F01-T04 | English, Hindi, Romanized Hindi and Hinglish examples map only to approved intent/category records. |
| F01-T05 | User intent is not conflated with the canonical loan category. |
| F01-T06 | Ambiguous queries offer transparent interpretations; low-confidence queries do not fabricate results. |
| F01-T07 | Search navigation encodes the query safely and preserves it for F24 without exposing sensitive fields. |
| F01-T08 | Homepage categories resolve only from canonical published category records. |
| F01-T09 | Guides shown are published A11 content with reviewed locale state. |
| F01-T10 | Draft, withdrawn, expired or unpublished records never appear in public homepage content. |
| F01-T11 | Missing/stale/unverified financial facts are not presented as verified current terms. |
| F01-T12 | No-result, search-error and partial-catalogue states provide safe next actions. |
| F01-T13 | Homepage claims and trust metrics are evidence-backed; unsupported superlatives/counts are absent. |
| F01-T14 | SEO canonical, metadata and structured data match visible approved content. |
| F01-T15 | English/Hindi strings render correctly, including Devanagari conjuncts and matras. |
| F01-T16 | Keyboard focus, suggestion interaction, Escape and focus return are accessible where suggestions exist. |
| F01-T17 | 200% zoom, responsive reflow and representative mobile widths preserve functionality. |
| F01-T18 | Core search remains usable when nonessential analytics or third-party scripts fail. |
| F01-T19 | Reduced-motion preference is respected and no autoplay/auto-rotation is required. |
| F01-T20 | Search diagnostics and analytics do not retain raw queries or unnecessary personal identifiers by default. |
| F01-T21 | F01 contains no lead capture, customer PII collection, document upload or lender application submission. |
| F01-T22 | Sensitive-data warning and informational/lender-decision disclaimer are visible and understandable. |
| F01-T23 | Sponsored content is absent in MVP unless separately approved and clearly disclosed. |
| F01-T24 | Homepage has usable loading, offline/search-unavailable and localization fallback states. |

## 14. Owner review decisions

Please approve or revise:
1. Homepage section order and the search-first mobile experience.
2. Intent search as anonymous discovery only, with no personal/financial profile fields.
3. English, Hindi, Romanized Hindi and Hinglish input, with conservative ambiguity handling.
4. Search result routing to F24 and use of canonical A03 categories/A09 intent mappings.
5. Published categories and A11 guides only; no unverified product/rate claims or invented trust metrics.
6. No raw query retention by default; analytics remains blocked pending privacy review.
7. No lead capture, customer PII, document upload or lender application flow.
8. Proposed helper warning and informational/lender-decision disclaimer.
9. SEO/indexing and structured-data restrictions as documented.

## 15. Approval and implementation record

- **Owner decision:** Pending.
- **Implementation:** Not Started.
- **Testing:** All 24 acceptance tests remain Not Run.
- **Boundary:** Approval authorizes this page specification for planning only. Feature coding requires explicit owner approval and remaining technical/security/legal dependencies; it does not authorize lead capture, customer PII processing or production launch.
