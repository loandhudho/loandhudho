# LoanDhudho Database Design

PostgreSQL is the system of record. Prisma models are in `prisma/schema.prisma`.

## Core relationships
- A financial institution owns many loan products.
- A loan category groups many loan products and can have a parent category.
- A product has versioned rate offers, fees, eligibility rules, required documents and promotional offers.
- Each published financial fact should reference a source record where possible.
- Intents map user language and synonyms to canonical loan categories.
- Landing pages and editorial pages are locale-specific.
- Admin audit logs record material changes.

## Data integrity and publishing
- Use PostgreSQL NUMERIC through Prisma Decimal for rates and money.
- Keep rate effective dates and verification timestamps; do not overwrite historical rate records.
- Require source and reviewer checks in the publishing service before a rate is made public.
- Do not treat a missing APR or fee as zero; show it as unavailable.
- Use database transactions for publish workflows.
- Use server-side role checks for every administrative write.
- Never seed sample/live-looking lender rates.

## Search
The first version can use indexed intent keywords and PostgreSQL full-text search. Add `pg_trgm` for typo-tolerant matching in a migration after confirming the deployment PostgreSQL version and permissions.

## Future compliance-gated tables
Lead, ConsentRecord, lender integration credentials and application tracking are intentionally not included in the initial schema. Add them only after legal review, partner agreements, data retention policy and explicit-consent design are approved.
