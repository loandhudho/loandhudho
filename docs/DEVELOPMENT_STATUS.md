# Development status

## Added to the repository
- Next.js App Router + TypeScript application foundation.
- Tailwind CSS v4 global styles and responsive starter homepage.
- Light/Dark theme provider and toggle.
- PostgreSQL Prisma schema for institutions, categories, products, rate history, fees, eligibility, documents, offers, intents, localized landing/content pages, admin users and audit logs.
- Seed script for loan categories only; it intentionally creates no bank rates or live offers.
- English and Hindi starter message dictionaries.
- Environment template and database setup notes.

## Not yet completed or verified
- No PostgreSQL database was connected from this setup session.
- Prisma Client generation, migration creation/application, seed execution, lint, typecheck and production build have not been run.
- Locale dictionaries exist but the language switcher and locale-aware routing still need implementation.
- Admin authentication, role-protected admin screens, comparison/search APIs, lender data imports and lead workflows are not implemented yet.
- No lender rates or offers are live; source verification is required before publication.

## Local verification checklist
1. Copy `.env.example` to `.env` and configure PostgreSQL.
2. Run `npm install`.
3. Run `npm run db:generate`.
4. Run `npm run db:migrate` and name the initial migration.
5. Run `npm run db:seed`.
6. Run `npm run typecheck`, `npm run lint` and `npm run build`.
7. Fix any environment/version-specific issues before deployment.
