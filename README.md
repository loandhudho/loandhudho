# LoanDhudho

A Pan-India loan discovery, comparison and enquiry marketplace for banks and financial institutions.

## Product vision

Help people across India discover, understand and compare loan products based on their needs, estimate repayments and take a clear next step with a lender. LoanDhudho is a discovery and enquiry platform, not a lender; approval, eligibility, rates, fees and disbursal remain subject to each lender's policies and verification.

## Key experience

- English by default, with a Hindi language switch across the public website and admin panel.
- Natural-language loan discovery in English, Hindi and Romanized Hindi.
- Loan category browsing, lender directory, product details, filters and side-by-side comparison.
- EMI calculator, offers, educational/SEO content and enquiry/application journeys.
- Responsive light and dark themes.
- Admin tools for institutions, products, rates, offers, content, search mappings and leads.

## Initial loan categories

Home, personal, business, education, vehicle, loan against property, gold and administrator-configurable additional categories.

## Proposed stack

- Next.js App Router, TypeScript and Tailwind CSS
- shadcn/ui
- PostgreSQL and Prisma
- Next.js API routes / Server Actions
- Auth.js with role-based access control
- Zod validation
- PostgreSQL full-text search and `pg_trgm`
- Vercel or AWS; S3-compatible object storage

## Repository documentation

- [Product and project plan](docs/PRODUCT_PLAN.md)

## Delivery approach

1. Foundation, schema, authentication and bilingual design system.
2. Homepage, loan categories and navigation.
3. Institution directory and loan product catalogue.
4. English/Hindi/Romanized Hindi intent search.
5. Product comparison and EMI calculator.
6. Offers, content/SEO and enquiry flows.
7. Admin dashboard, auditability, analytics and quality hardening.

## Important data principle

Every displayed rate, fee, tenure, eligibility rule and offer should have a source, effective date or last-reviewed date, and an appropriate disclaimer. Never imply guaranteed approval or present illustrative calculations as lender quotations.
