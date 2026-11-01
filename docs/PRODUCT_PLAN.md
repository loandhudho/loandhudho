# LoanDhudho — Product & Project Plan

**Product:** LoanDhudho  
**Positioning:** Pan-India loan discovery, comparison and enquiry marketplace  
**Primary language:** English  
**Additional language:** Hindi  
**Status:** Initial product and technical plan

## 1. Vision and goals

LoanDhudho helps people across India discover, understand and compare loan products from banks and financial institutions. Visitors should be able to start with a real-world need—buying a home, funding education, purchasing a vehicle or growing a business—and reach relevant options.

Goals:
1. Build a searchable catalogue of loan products from banks and financial institutions across India.
2. Organize products into clear, configurable loan categories.
3. Support everyday-language search, not only formal banking terminology.
4. Enable meaningful side-by-side product comparison.
5. Provide useful tools, starting with an EMI calculator.
6. Generate qualified enquiries for relevant lenders or lending partners.
7. Give administrators reliable controls for institutions, products, rates, offers, content and leads.
8. Support English and Hindi throughout the public experience and admin panel.
9. Support light and dark themes, mobile layouts and accessibility.
10. Build SEO-friendly category, institution, product and educational pages.

LoanDhudho is a discovery, comparison and enquiry platform, not itself a bank or lender. Approval, eligibility, final rates, fees, terms and disbursal remain subject to the relevant lender's policies and verification.

## 2. Users and journeys

### Loan seekers
A visitor browses a category or describes a need in natural language, reviews relevant products, filters or compares options, estimates an EMI and submits an enquiry or follows a verified lender application link.

### Users comparing lenders
A visitor selects two or more products and compares available rates, fees, tenure, loan amount range, eligibility and other disclosed terms.

### Administrators and content operators
Authorized staff maintain lender profiles, loan products, rate history, offers, search-intent mappings, content, SEO metadata and incoming leads.

### Example journey
1. User enters “I want to buy a house”, “मुझे घर खरीदना है” or “mujhe ghar kharidna hai”.
2. Intent search identifies the home-loan need and presents relevant categories/products.
3. User filters or compares products.
4. User estimates a repayment using the EMI calculator.
5. User submits an enquiry or continues to the lender through a verified link.

## 3. Public website scope

### 3.1 Homepage
- Clear value proposition and prominent loan search.
- Browse-by-category navigation.
- Featured institutions/products when verified data exists.
- Calls to action for comparison and the EMI calculator.
- Educational content and transparent trust/disclaimer information.

### 3.2 Loan categories
Initial categories:
- Home loans
- Personal loans
- Business loans
- Education loans
- Vehicle loans
- Loan against property
- Gold loans
- Other categories configurable by administrators

Each category page should explain the loan type, show relevant products and institutions, provide useful filters, and link to related guides and tools.

### 3.3 Institution directory
Institution profiles may include name, logo, description, institution type, official website, supported loan categories, relevant products, verified contact/application links and last-reviewed date.

### 3.4 Loan product detail pages
Show verified information where available:
- Product name and lending institution
- Loan type and purpose
- Interest rate and whether fixed, floating or otherwise structured
- APR or equivalent cost disclosure where available
- Loan amount and tenure ranges
- Processing fees and other charges
- Eligibility criteria and required documents
- Prepayment/foreclosure information
- Source and last-updated/effective date
- Important disclaimers and lender application/enquiry route

Unknown or unverified values should be labelled as unavailable, not fabricated.

### 3.5 Search and filters
Support search by product, institution, category and user intent. Filters can include loan type, amount, tenure, rate range, institution and relevant eligibility attributes. Search should handle spelling variants and transliteration.

### 3.6 Intent search
Support:
- English: “I need money for my business”
- Hindi: “मुझे बिजनेस के लिए लोन चाहिए”
- Romanized Hindi: “mujhe business ke liye loan chahiye”

Start with a transparent, maintainable intent/category mapping and synonym dictionary. Search results should explain why a category or product is suggested. Avoid making eligibility or approval promises based solely on a text query.

### 3.7 Comparison
Allow users to select products and compare the same fields in aligned columns. Clearly distinguish lender-confirmed facts, indicative values and missing information. Include source/update dates and a route to product details.

### 3.8 EMI calculator
Inputs: principal, annual interest rate and tenure. Support monthly EMI, total interest and total repayment. State that results are estimates and may exclude fees, insurance, taxes or lender-specific adjustments. Validate inputs and handle zero/invalid values safely.

### 3.9 Offers and educational content
Provide dated offers with eligibility, terms, validity and source. Provide SEO-friendly guides, category explainers, FAQs and articles with editorial review and clear financial disclaimers.

### 3.10 Enquiries and applications
Capture only necessary information, obtain clear consent before sharing personal data, validate submissions, prevent spam and provide a clear next step. Track status and source attribution for operations. Do not imply that submitting an enquiry is a loan application unless it truly is one.

## 4. Admin dashboard

Role-protected admin modules:
- Overview dashboard and operational metrics
- Institutions: create, edit, activate/deactivate and verify
- Loan categories and category metadata
- Loan products and product attributes
- Rate/fee history with effective dates and source references
- Offers and validity windows
- Intent phrases, synonyms, language variants and category mappings
- Pages, articles, FAQs and SEO metadata
- Enquiries/leads, assignment, status and notes
- User/role management
- Audit log for important changes

Use least-privilege roles (for example administrator, editor and lead operator). Sensitive actions should be logged.

## 5. Language, theme and accessibility

- English is the default language.
- Provide a visible English/Hindi switch.
- Translate all public and admin navigation, labels, buttons, validation messages, forms, empty states and core page content.
- Keep translation strings in centralized locale files rather than scattering hard-coded text through components.
- Persist the selected language appropriately and ensure URLs/metadata support the chosen SEO strategy.
- Support light and dark themes with accessible contrast.
- Design mobile-first with keyboard navigation, semantic structure, labels and clear focus states.
- Format currency in INR and use Indian number formatting where appropriate.

## 6. Suggested technology and architecture

### Frontend
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Server Components by default; Client Components for interactive controls

### Backend and data
- Next.js Route Handlers and Server Actions for application endpoints/mutations
- PostgreSQL
- Prisma ORM
- Zod for server-side input validation
- PostgreSQL full-text search and `pg_trgm` for initial search
- Auth.js for authentication and session handling

### Infrastructure
- Vercel or AWS hosting
- S3-compatible object storage for uploaded assets
- Managed PostgreSQL with backups
- Centralized error monitoring, structured logs and uptime monitoring
- Separate development, staging and production environments

Keep lender integrations behind adapter/service boundaries so individual providers can be added without coupling the user interface to one lender.

## 7. Suggested data model

Core entities and relationships:
- **User** — identity, authentication metadata and status
- **Role / Permission** — access control
- **Institution** — bank/NBFC/other lender profile
- **LoanCategory** — category hierarchy and localized metadata
- **LoanProduct** — institution-owned product and core terms
- **ProductRateHistory** — rate/fee values, source, effective date and reviewer
- **ProductEligibility** — criteria and documentation requirements
- **Offer** — promotion, terms, validity and source
- **IntentPhrase** — phrase, locale, normalized phrase and mapped category/product
- **Page / Article / FAQ** — localized editorial and SEO content
- **Lead / Enquiry** — consent, requested product/category, contact details and status
- **LeadActivity** — assignment and status history
- **AuditLog** — actor, action, target and timestamp

Use stable IDs, timestamps, status fields and appropriate indexes. Add uniqueness constraints where they reflect real business rules. Model historical rate changes as records rather than overwriting history.

## 8. Security, privacy and financial-data quality

- Enforce authorization on the server for every protected admin action.
- Validate and normalize all inputs on the server.
- Use secure password/session practices through the selected auth provider.
- Apply rate limiting, bot/spam controls and abuse monitoring to public forms.
- Protect against injection, XSS, CSRF and insecure direct object references.
- Store secrets only in environment variables/managed secret storage.
- Minimize personal data collection; define retention and deletion processes.
- Obtain explicit consent before sharing enquiries with lenders/partners and explain the purpose.
- Restrict access to lead data and log sensitive access/changes.
- Maintain source, effective date and last-reviewed date for rates, fees and offers.
- Display disclaimers and distinguish indicative calculations from lender quotations.
- Never guarantee loan approval, eligibility, disbursal or a specific rate.
- Have legal/compliance reviewers assess applicable Indian financial advertising, privacy and partner requirements before launch.

## 9. Delivery roadmap

### Phase 1 — Foundation
Repository setup, Next.js application scaffold, design system, localization framework, theme support, database schema, Prisma migrations, authentication, roles and deployment environments.

### Phase 2 — Public discovery
Homepage, category navigation and pages, institution directory, product catalogue, product details and initial admin CRUD.

### Phase 3 — Search and comparison
English/Hindi/Romanized Hindi intent search, synonyms and mappings, filters, search result explanations and product comparison.

### Phase 4 — Financial tools and conversion
EMI calculator, offers, enquiry forms, consent capture, lead management and verified lender/application links.

### Phase 5 — Content and operations
Articles, FAQs, SEO metadata, rate history, admin analytics, audit logs, data quality workflows and operational reporting.

### Phase 6 — Launch readiness
Security review, accessibility testing, performance optimization, responsive QA, localization QA, backup/restore test, monitoring and production launch checklist.

## 10. Success measures

Track:
- Search-to-product-detail click-through rate
- Product comparison usage
- EMI calculator completion
- Enquiry conversion and qualified-lead rate
- Search no-result rate by language
- Product data freshness and percentage with verified sources
- Page performance, accessibility defects and error rate
- Admin task completion time and lead response time

Define targets after baseline analytics and partner operations are established.

## 11. Acceptance criteria

The initial production release should:
1. Render responsive public pages with English default and a working Hindi switch.
2. Provide category, institution and product discovery from administrator-managed data.
3. Support English, Hindi and Romanized Hindi intent queries for configured mappings.
4. Show product comparison with clear source/update information.
5. Calculate EMI and total repayment correctly for valid inputs and label outputs as estimates.
6. Capture enquiries with consent and provide authorized lead management.
7. Restrict admin routes and mutations by role, with audit records for important changes.
8. Avoid invented or stale financial claims by requiring source/date metadata.
9. Pass core security, accessibility, localization and mobile QA checks.

## 12. Decisions to confirm before implementation

- Initial lender/institution data sources and verification ownership
- Whether leads are routed to LoanDhudho staff, lenders or both
- Exact fields required for enquiry and consent language
- Initial admin roles and approval workflow for publishing rates/offers
- Hosting, domain, analytics and monitoring choices
- Legal/compliance review and partner agreements
