# LoanDhudho.com — Product & Technical Project Plan

**Status:** Initial product blueprint  
**Vision:** Pan-India loan discovery, comparison and marketplace platform  
**Languages:** English (default) and Hindi  
**Themes:** Light and Dark

## 1. Product vision

LoanDhudho helps people discover relevant loan products by purpose or intent, compare sourced information from banks and NBFCs, understand indicative costs, and continue to an authorised lender application journey.

The initial platform is an information, discovery and comparison marketplace. It must not imply that LoanDhudho is a lender, guarantees approval, or has a lender partnership unless a documented agreement exists.

### Product principles
- Accuracy before breadth: publish sourced information and show its last verification date.
- Transparent comparison: disclose rate type, APR availability, fees, assumptions and eligibility caveats.
- No approval promises: the lender decides eligibility, pricing and sanction.
- Consent-led data use: collect minimum personal data and obtain explicit consent before sharing leads.
- Mobile-first, accessible, bilingual and responsive.
- Pan-India data model, with support for location-specific eligibility.
- English default with Hindi language option.
- Light/Dark theme with system preference and saved user choice.

## 2. Target user journeys

### Loan discovery
1. User enters a natural-language purpose or chooses a popular intent.
2. Search suggests a relevant category; ambiguous queries request clarification.
3. User optionally enters amount, location, employment type and tenure.
4. Matching lender products appear with comparison filters.
5. User reviews rate, APR where available, fees, eligibility, source and last-verified date.
6. User continues through an official or authorised application link.

### Admin publishing
Admin signs in, manages an institution and its products, records rate/fees/eligibility and source, submits changes for review, publishes approved data and tracks re-verification.

### Future lead journey
A user submits a lead only after seeing purpose-specific consent and named recipients. Lead sharing remains disabled until legal review and lender agreements are complete.

## 3. Initial loan taxonomy

- Home purchase loan
- Plot / land purchase loan
- Home construction loan
- Home renovation / improvement loan
- Loan against property
- Commercial property loan
- Personal loan
- Business / MSME loan
- New and used car loan
- Two-wheeler loan
- Education loan in India / overseas
- Gold loan
- Loan against fixed deposit / securities
- Balance transfer / refinancing
- Debt consolidation, only where a suitable real lender product exists

### Intent examples
| User phrase | Suggested category |
|---|---|
| I want to buy a house | Home purchase loan |
| I want to buy a plot | Plot / land purchase loan |
| I need money to construct a house | Home construction loan |
| I need funds against my property | Loan against property |
| I want to renovate my home | Home improvement loan |
| I need money to start a business | Business / MSME loan |
| I need money for a wedding | Personal loan |
| I want to transfer my home loan | Home loan balance transfer |

Start with curated keyword synonyms, category rules and PostgreSQL search. Support Hindi, English and practical transliteration. AI interpretation can be introduced later with deterministic validation and safe fallback.

## 4. Website sitemap

### Public website
- / — Homepage and intent search
- /loans — All loan categories
- /loans/[category] — Category landing and comparison
- /loan-products/[slug] — Lender product detail
- /banks — Banks and financial institutions directory
- /banks/[slug] — Institution profile and products
- /offers and /offers/[slug] — Offers and offer details
- /compare — Product comparison
- /calculators/emi — EMI calculator
- /calculators/eligibility — Indicative eligibility tool
- /calculators/balance-transfer — Balance transfer calculator
- /guides and /guides/[slug] — Educational content
- /about, /contact, /privacy-policy, /terms, /disclaimer
- Locale-aware English and Hindi routes, finalised during implementation

### Admin
- /admin — Dashboard
- /admin/institutions
- /admin/loan-categories
- /admin/loan-products
- /admin/rates
- /admin/fees
- /admin/eligibility
- /admin/offers
- /admin/intents
- /admin/landing-pages
- /admin/content
- /admin/leads — disabled until approved lead workflow
- /admin/users-and-roles
- /admin/audit-logs
- /admin/settings

All admin routes and mutations require server-side authentication and role-based authorisation.

## 5. Functional requirements

### Homepage
- Prominent intent search and suggested queries.
- Popular loan categories.
- Featured institutions and recently verified offers.
- EMI calculator entry point.
- Trust and data-sourcing information.
- Responsive header with language and theme controls.

### Search and discovery
- Search natural-language phrases, keywords, categories and synonyms.
- Suggest relevant intents with a short explanation.
- Support Hindi and English terms.
- Optional filters for amount, tenure, rate, lender type, employment type and location.
- Typo-tolerant matching, useful empty states and clarification for ambiguous queries.
- A keyword match must never be presented as proof of loan eligibility.

### Comparison
- Compare products using consistent amount and tenure assumptions.
- Show interest rate/range and rate type, APR when supplied, processing fee, known charges, tenure, eligibility and source.
- Separate lender-published facts from LoanDhudho calculations.
- Display last-verified date and a correction/report mechanism.
- Clearly label sponsored placements; paid placement must not masquerade as objective ranking.

### Calculators
- EMI = P × r × (1+r)^n / ((1+r)^n − 1), where P is principal, r is monthly interest rate and n is monthly instalments.
- Show assumptions, total interest and total repayment.
- Mark results as illustrative, not a lender quote or approval.
- Test zero-rate and invalid-input cases.

### Offers and admin
- Offers include start/end date, eligible product, conditions, source and status.
- Expire offers automatically but retain history.
- Admin supports draft, review, publish, expire and archive states.
- Role types: super admin, editor, reviewer, support/analyst.
- Audit material changes, especially rates, fees, URLs and validity.
- Import/export with validation and duplicate detection.
- Queue stale records for re-verification.

## 6. Technology stack

| Layer | Technology |
|---|---|
| Framework | Next.js App Router with TypeScript |
| Styling | Tailwind CSS |
| UI components | shadcn/ui |
| Database | PostgreSQL |
| ORM and migrations | Prisma |
| Validation | Zod |
| Authentication | Auth.js, subject to final user/admin needs |
| Search MVP | PostgreSQL full-text search and pg_trgm |
| Forms | React Hook Form and Zod |
| Tests | Vitest, Testing Library and Playwright |
| Hosting | Vercel or AWS, final choice pending |
| File storage | S3-compatible object storage |
| Monitoring | Structured logs, error monitoring and uptime checks |

Use a modular monolith initially. Keep domain logic in service modules. Add a dedicated search service only when measured scale justifies it.

## 7. Suggested source structure

    src/
      app/
        [locale]/
          (public)/
          admin/
        api/
      components/
        ui/
        layout/
        search/
        loans/
        comparison/
        calculators/
        admin/
      features/
        institutions/
        loan-categories/
        loan-products/
        rates/
        offers/
        intent-search/
        content/
        leads/
      lib/
        auth/
        db/
        i18n/
        validation/
        permissions/
      services/
      types/
      messages/
        en/
        hi/
    prisma/
      schema.prisma
      migrations/
    tests/
      unit/
      e2e/
    docs/

## 8. Initial database domain model

Use one FinancialInstitution entity for banks, small finance banks and NBFCs, distinguished by institution type.

Core entities:
- FinancialInstitution — identity, type, official domain and status.
- LoanCategory — hierarchical category taxonomy.
- LoanProduct — institution-owned product, category, slug, description and publication status.
- RateOffer — rate range/type, APR if supplied, effective dates, source and verification state; retain historical versions.
- Fee — processing and other charges, amount/percentage, conditions and validity.
- EligibilityRule — employment, income, age, credit-score and geography conditions with source/caveat.
- ProductDocument — required-document information and source.
- LoanOffer — promotional offer, validity, terms and status.
- Intent — canonical user purpose mapped to categories.
- IntentKeyword — locale, keyword/synonym, normalised form and mapping.
- LandingPage — locale, slug, SEO metadata and linked intent/category.
- ContentPage — guides, FAQs and editorial content.
- User, Account and Session — only if registration is enabled.
- Lead and ConsentRecord — only after legal approval; record consent text/version, timestamp, purpose and recipient.
- AuditLog — actor, action, entity, before/after metadata and timestamp.
- SourceRecord — source URL, publisher, checked-at timestamp and verification notes.

Data rules:
- Store money as decimal/numeric, never floating point.
- Store rate unit and rate type (fixed/floating), min/max and effective dates.
- Retain source and verification metadata for time-sensitive claims.
- Preserve history when records are archived.
- Index institution/product slugs, category, status, locale, effective dates and search vectors.
- Use transactions for multi-record publishing.
- Final Prisma schema follows a confirmed data dictionary and migration tests.

## 9. Light/Dark mode and bilingual UX

- Use semantic design tokens and CSS variables for both themes.
- Keep layout and component hierarchy identical across themes.
- Persist explicit theme preference; otherwise respect system preference.
- Prevent a flash of the wrong theme on initial render.
- Target WCAG AA contrast and visible focus states.
- English is default; Hindi is selectable in the header.
- Translate navigation, buttons, validation, forms and system messages.
- Store editorial/product copy by locale.
- Legal disclosures require human review, not unreviewed machine translation.

## 10. Security, privacy and regulatory guardrails

Obtain qualified Indian legal/compliance review before enabling lead transmission, application facilitation, lender integrations or other regulated digital-lending activity. Actual activities and agreements determine obligations; do not assume a comparison platform is automatically outside regulation.

Minimum controls:
- HTTPS, secure cookies, secrets management and least privilege.
- Server-side validation and authorisation for every admin mutation.
- Rate limiting, bot protection and abuse monitoring.
- Restrict access to personal data and define retention/deletion policies.
- Never request bank passwords, OTPs, PINs or UPI credentials.
- Obtain explicit, purpose-specific consent before sharing data with named recipients.
- Publish privacy policy, terms, disclaimers and grievance/contact process.
- Verify lender identity, official URLs and claimed partnerships.
- Distinguish indicative estimates from lender quotes and approvals.
- Review applicable RBI digital lending requirements, data protection law and advertising/consumer-protection requirements with counsel.

## 11. Data quality and operations

- Keep an approved source URL for each rate, fee and offer.
- Record last_verified_at, effective_from, effective_until and reviewer.
- Configure freshness windows by data type.
- Flag stale/expired data; do not present it silently as current.
- Require review before publishing rate and fee changes.
- Preserve historical values and corrections.
- Prefer official lender sources and authorised partner feeds; respect source-site terms.

## 12. Delivery roadmap

### Phase 0 — Discovery and compliance
Confirm scope, comparison methodology, revenue model, legal position, initial institutions, product categories, design system, sitemap and data dictionary.

### Phase 1 — Marketplace MVP
- Next.js foundation, Tailwind and shadcn/ui.
- PostgreSQL and Prisma migrations.
- English/Hindi framework and Light/Dark themes.
- Homepage, category pages, institution profiles and product details.
- Admin authentication, roles and institution/product management.
- Sourced rates, fees and offers with review/history.
- EMI calculator and official application links.

### Phase 2 — Discovery and comparison
- Intent taxonomy and keyword manager.
- Bilingual PostgreSQL full-text and pg_trgm search.
- Filters, comparison table and product details.
- SEO landing pages, metadata, sitemap and valid structured data.
- Analytics and search-quality feedback.

### Phase 3 — Integrations and consent-based leads
Only after lender agreements and compliance approval:
- Named-recipient consent, lead routing and audit trail.
- Partner feeds/APIs and reconciliation.
- Lead status reporting and operational dashboards.

### Phase 4 — Scale and personalisation
- Improve search using measured query data.
- Consider dedicated search infrastructure if needed.
- Add AI-assisted intent parsing with safe fallback and user confirmation.
- Add consent-aware personalisation.
- Performance, accessibility and security hardening.

Timelines and budget must be estimated after scope, team capacity, data availability and integrations are confirmed.

## 13. MVP acceptance criteria

- Visitors can browse or search categories in English and Hindi.
- Ambiguous search queries are clarified safely.
- Product pages show source, last verification date and caveats.
- Admin can create, review, publish and archive institutions, products, rates and offers.
- Historical rates remain available to authorised admins.
- Comparison uses consistent assumptions and discloses missing data.
- EMI calculations pass normal, zero-rate and invalid-input tests.
- Theme and language preferences work across navigation.
- Admin APIs enforce roles server-side.
- Mobile and desktop end-to-end tests pass.
- Privacy, terms, disclaimer and contact/grievance pages exist before public launch.

## 14. Decisions to confirm

1. Whether all product content must be bilingual at launch.
2. Initial lender/product coverage and who verifies updates.
3. Whether user accounts are needed in MVP.
4. Whether lead forms remain out of MVP until agreements and legal review.
5. Hosting provider, budget, expected traffic and deployment ownership.
6. Comparison ranking rules and sponsored-product treatment.
7. Whether location-specific results are required at launch.

## 15. Immediate engineering tasks

1. Inspect repository conventions and existing code before implementation.
2. Add or adapt the Next.js App Router foundation.
3. Configure Tailwind, shadcn/ui and semantic theme tokens.
4. Configure PostgreSQL and Prisma migrations.
5. Create institution/category/product/rate/fee/offer/intent/source/audit models.
6. Implement public shell, locale switcher and theme switcher.
7. Implement protected admin shell and role checks.
8. Add clearly labelled demo seed data; never present demo rates as live offers.
9. Add tests, CI checks, environment documentation and deployment instructions.

---

**Scope note:** This is the agreed product direction and proposed architecture. It does not claim that the website, lender partnerships, live bank data, regulatory approval or application integrations already exist.
