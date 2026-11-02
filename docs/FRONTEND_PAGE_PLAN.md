# Public Frontend — Page and Journey Plan

**Status:** Planning Draft — owner review pending  
**Last updated:** 2026-11-02  
**Purpose:** Define the public-facing page inventory, shared templates, build order, journeys and acceptance gates before frontend implementation.

## 1. Product experience

LoanDhudho is a pan-India loan discovery and comparison marketplace. The public experience should help visitors move from a natural-language need (for example, buying a home or needing funds) to relevant loan categories/products, understand verified lender terms, compare like-for-like options and continue to the lender's official application journey.

Principles:
- Mobile-first, fast on low-bandwidth networks, accessible and usable without an account.
- English (en-IN) default with reviewed Hindi (hi-IN); support English, Hindi, Romanized Hindi and Hinglish search input where relevant.
- Show institution, product, rate, fee and eligibility data from canonical records only, with source and last-verified/effective dates.
- Clearly distinguish indicative calculations, editorial information, offers and sponsored placements.
- Never promise approval, eligibility, rates or disbursal. No lead capture or customer PII until separate legal/compliance approval.
- Light/dark theme support where it improves usability; public content should remain readable and printer-friendly.

## 2. Page inventory and status

All pages below are **Not Started**. Each page requires its own specification, owner approval, implementation tasks and page-level tests before coding.

| ID | Page/template | Route concept | Purpose | Priority | Status |
|---|---|---|---|---:|---|
| F01 | Homepage and intent search | `/` | Explain value, capture loan intent as a search query (not a lead), show popular categories and trust signals | P0 | Not Started |
| F02 | Loan categories index | `/loans` | Browse canonical loan categories | P0 | Not Started |
| F03 | Loan category detail | `/loans/[category]` | Explain category and list eligible published products | P0 | Not Started |
| F04 | Loan product detail | `/loan-products/[slug]` | Full verified lender-specific product facts, costs, eligibility, sources and CTA to official lender page | P0 | Not Started |
| F05 | Institution directory | `/institutions` | Browse verified banks/NBFCs | P1 | Not Started |
| F06 | Institution profile | `/institutions/[slug]` | Institution identity, status, product catalogue and official links | P1 | Not Started |
| F07 | Offers index | `/offers` | List active, eligible and sourced offers with clear terms | P1 | Not Started |
| F08 | Offer detail | `/offers/[slug]` | Explain benefit, validity, eligibility, baseline and exclusions | P1 | Not Started |
| F09 | Product comparison | `/compare` | Compare selected products on consistent cost/eligibility fields | P0 | Not Started |
| F10 | EMI calculator | `/calculators/emi` | Indicative EMI, total interest and repayment illustration | P0 | Not Started |
| F11 | Eligibility estimator | `/calculators/eligibility` | Non-binding estimate with explicit assumptions; no credit decision | P1 | Not Started |
| F12 | Balance transfer calculator | `/calculators/balance-transfer` | Compare remaining cost vs transfer costs and break-even | P2 | Not Started |
| F13 | Guides index/detail | `/guides`, `/guides/[slug]` | Evergreen financial education, FAQs and glossary from A11 | P1 | Not Started |
| F14 | About | `/about` | Company/product purpose, scope and trust disclosures | P1 | Not Started |
| F15 | Contact and grievance | `/contact` | Contact channels, grievance escalation and response expectations | P1 | Not Started |
| F16 | Privacy policy | `/privacy` | Legally reviewed privacy notice | P0 launch gate | Not Started |
| F17 | Terms | `/terms` | Legally reviewed terms of use | P0 launch gate | Not Started |
| F18 | Disclaimer | `/disclaimer` | Legally reviewed marketplace/calculator/editorial disclaimers | P0 launch gate | Not Started |
| F19 | News index | `/news` | Browse dated company/industry/policy updates from Admin CMS | P2 | Not Started |
| F20 | News detail | `/news/[slug]` | Source-led news item with publication/update date, attribution and correction context | P2 | Not Started |
| F21 | Blog index | `/blog` | Browse editorial/company/contributor posts | P2 | Not Started |
| F22 | Blog detail | `/blog/[slug]` | Render blog body, byline, disclosures, related posts and SEO metadata | P2 | Not Started |
| F23 | CMS static page template | approved CMS paths | Render Admin-managed static pages using allowlisted templates | P1 | Not Started |
| F24 | Search results | `/search` | Results for natural-language/keyword intent with filters, ambiguity handling and no-result guidance | P0 | Not Started |

A10 Landing Pages are a separate SEO/intent acquisition template and should resolve to published structured landing-page records; they are not arbitrary static pages. Admin A16 Content Studio owns static pages, news and blogs. A11 remains the source for evergreen guides/FAQs/glossary.

## 3. Shared frontend systems

1. **Public shell:** header, logo, primary navigation, footer, locale selector, theme behavior, mobile menu and accessible skip links.
2. **Search experience:** query input, normalization, English/Hindi/Romanized Hindi/Hinglish matching, suggestions, category/intent interpretation, filters, empty/error states and privacy-safe diagnostics.
3. **Institution/product cards:** canonical identity, relevant product facts, source/verification date, eligibility summary and official-lender link.
4. **Comparison engine/UI:** compare like-for-like fields; disclose missing data; avoid false rankings; preserve source and last-verified context.
5. **Rate/fee display:** distinguish starting rate, range, representative rate, fixed/floating/hybrid, benchmark/spread and one-time/recurring charges; show applicability and effective dates.
6. **Calculators:** shared INR/input validation, zero-rate handling, rounding, assumptions, accessible results and no guaranteed outcome.
7. **Content renderer:** allowlisted blocks, safe media, citations/source notes, related links, localization and reading experience.
8. **SEO/rendering:** metadata, canonical URLs, redirects, sitemap, robots, structured data only from visible verified content, Open Graph and hreflang only for reviewed translations.
9. **Trust/compliance:** source transparency, sponsored labels, general-information notices, grievance route, privacy/terms/disclaimer and no unauthorized lead forms.
10. **Analytics:** aggregate event definitions only after consent/privacy review; no raw sensitive query or personal financial profiling by default.

## 4. Primary user journeys

### Journey A — Intent to relevant products
Homepage → intent/search results → category detail → product detail → compare → official lender website.

### Journey B — Direct category discovery
Loan categories → category detail → product list/filter → product detail → compare.

### Journey C — Institution research
Institution directory → institution profile → its published products → product detail/compare.

### Journey D — Offer evaluation
Offers index → offer detail → underlying product → compare; show offer validity, eligibility, baseline and exclusions.

### Journey E — Calculator-led exploration
EMI/eligibility/balance-transfer calculator → indicative result and assumptions → relevant category/product discovery. Calculator output must not imply lender approval.

### Journey F — Education and updates
Guides/news/blog index → detail → related category/product or source. Editorial content must remain distinct from canonical lender facts.

### Journey G — Trust and support
Footer/header → About, Contact/Grievance, Privacy, Terms, Disclaimer and relevant CMS static pages.

No journey includes lead submission, application facilitation, customer account or lender data transfer until separately approved.

## 5. Recommended delivery sequence

| Release slice | Pages/systems | Exit condition |
|---|---|---|
| Public foundation | Public shell, design tokens, localization, accessibility, SEO primitives, content renderer | Shared frontend standards approved; shell and templates tested |
| MVP discovery | F01, F02, F03, F24 | Search and category discovery work with real approved catalogue data |
| Decision support | F04, F09, F10 | Product facts and comparison integrity verified; EMI tests pass |
| Trust and institution | F05, F06, F14, F15, F16, F17, F18 | Institution provenance and legal pages approved |
| Offers and education | F07, F08, F13 | Offer rules and editorial/source checks pass |
| CMS publishing | F23, F19, F20, F21, F22 | Admin CMS public rendering, SEO, schedule, revisions and cache revalidation pass |
| Advanced tools | F11, F12 | Assumptions, boundaries and calculator tests approved |
| Controlled launch | Cross-page SEO, performance, security, accessibility, legal and content QA | Launch checklist signed off |

The P0/P1/P2 labels are proposed sequencing, not a commitment to launch all pages at once. Legal pages are hard launch gates even if other slices are technically ready.

## 6. Per-page specification template

Every F-page document must include:
- Purpose, target user intent and success measure.
- Route, page states and responsive layout.
- Content/data contract, canonical source and freshness display.
- Components and interaction behavior.
- Search/navigation/internal-link behavior.
- SEO metadata, canonical, indexability and structured-data rules.
- English/Hindi localization and translation state.
- Accessibility (keyboard, screen reader, contrast, focus, headings).
- Privacy, legal and consumer-safety boundaries.
- Loading, empty, error, stale-data and unavailable states.
- Analytics events only where approved.
- Dependencies, implementation tasks, acceptance tests and Definition of Done.
- Owner decisions and approval record.

## 7. Cross-cutting acceptance gates

- Server-rendered/public content contains only published, eligible records.
- Product, rate, fee, eligibility and offer facts resolve from canonical records and show provenance.
- Missing values remain explicitly unavailable; never infer or fabricate.
- Comparison does not silently compare incompatible products or hide material fees.
- Sponsored placements are clearly labelled and do not alter organic relevance.
- Search handles Hindi/English/transliteration conservatively and communicates ambiguity.
- Calculator formulas, rounding, edge cases and assumptions are tested.
- Draft, preview, scheduled-but-unpublished and archived content never leaks into public routes or sitemap.
- Redirects, canonical URLs, locale links and structured data are validated.
- No lead/customer PII or application submission is introduced.
- WCAG 2.2 AA target, responsive behavior, performance and low-bandwidth usability are tested.
- Security, privacy, legal and release gates are signed off before launch.

## 8. Dependencies and current blockers

- Admin specifications and canonical data governance.
- Admin Shell, Design System, Authorization, API Conventions and Testing Strategy.
- Authentication/security and operational data-quality implementation.
- Search/indexing, media, caching/revalidation, SEO and localization foundations.
- Qualified legal/compliance review for Privacy, Terms, Disclaimer, grievance language, analytics and any future lead flow.

**Current status:** Planning Draft — Owner Approval Pending.  
**Frontend page specifications:** Not Started.  
**Frontend implementation:** Not Started.  
**No frontend page is authorized for coding by this planning document alone.**
