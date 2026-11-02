# A10 — Landing Pages

**Page ID:** A10 / ADM-LANDING  
**Route:** /admin/landing-pages  
**Priority:** P1  
**Specification status:** Documented — Owner Approval Pending  
**Implementation status:** Not Started  
**Tests:** 30 acceptance tests defined; all Not Run  
**Last updated:** 2026-11-02

## 1. Purpose
Provide an editorial and SEO workspace for creating, reviewing, publishing and maintaining indexable landing pages that help users discover verified loan categories, intents, products, institutions and offers. Landing pages are presentation and discovery records; they reference canonical marketplace records rather than duplicate or independently redefine them.

## 2. Scope and boundaries
**In scope:** category, intent/use-case, curated institution/product collection and campaign/offer landing pages; locale-specific content and metadata; typed content blocks; canonical references to A02–A09 and A11; draft/preview/review/publish/schedule/unpublish/archive; revisions; canonical URLs, robots, sitemap, hreflang and redirects; content quality checks, source attribution and aggregate analytics.

**Out of scope:** creating/changing canonical lender, category, product, rate, fee, eligibility, offer or intent records; defining structural schemas/statuses; lead capture, applications, lender integrations, redemption processing or customer PII; unsupported financial claims, guaranteed approvals or fabricated comparisons.

## 3. Roles and authorization
- **Super Admin:** owns structural definitions including page types, block schemas, controlled options, status definitions, locale configuration and structured-data schemas.
- **Admin:** full operational authority over landing-page records, including create, edit, review, approve, publish, schedule, unpublish and archive within configured structures.
- **SEO Manager:** editorial content, metadata, internal linking, SEO preview and publishing actions granted by explicit permissions; cannot alter canonical lender facts or verified financial data.
- **Sales Executive / Support:** read-only access only where explicitly granted; no default access to drafts or restricted analytics.

Use configurable RBAC and server-side permission checks on pages, APIs, server actions, exports and jobs. Deny by default. UI hiding is not security. Routine publishing does not require a separate approver. Audit publish, unpublish, redirect, canonical and permission-sensitive changes.

## 4. Proposed page types
1. **Category landing page:** references one active A03 category and eligible published products.
2. **Intent/use-case page:** references active A09 intents and mapped A03 categories.
3. **Curated collection:** editorially selected institutions or products, linked to canonical records.
4. **Campaign/offer page:** groups active A08 offers and canonical products; expired offers must not appear active.

Recommended MVP: category and intent/use-case pages first. Curated collections and campaign pages can follow. Page types remain configurable by Super Admin.

## 5. Information architecture and editor
**List view:** title, page type, locale, slug, linked records, lifecycle status, indexability, last updated/published, editor and validation state. Search/filter by type, locale, status, indexability and update date. Include pagination and loading, empty and error states.

**Editor fields:** internal name, page type, locale, slug, optional parent; SEO title/description, canonical target, robots directives and social metadata; ordered typed content blocks; validated canonical references; publication status, schedule, effective dates and change summary.

**Quality panel:** missing metadata, broken references, duplicate slug, unsupported claims, expired offers, missing localization and indexability warnings. Preview must render the selected locale without publishing.

## 6. Typed content blocks
Proposed allowlist:
- Hero: heading, supporting copy, optional image, internal CTA.
- Rich text: sanitized limited formatting.
- Canonical category/product/institution/offer collection.
- Comparison teaser: eligible published products and approved comparison fields only.
- Calculator teaser: link to approved calculator route.
- FAQ: reviewed question/answer entries.
- Guide links: canonical A11 references.
- Trust/source note: attribution and disclaimer.
- CTA: internal destination for MVP.

Block schemas and allowed properties are structural configuration owned by Super Admin. No arbitrary HTML, JavaScript, iframe, external form embed or user-supplied script. Images require approved media handling, alt text, rights/source metadata and safe URLs.

## 7. Canonical data and factual integrity
- Every reference must exist, be active and be visible to the intended audience.
- Financial values, fees, eligibility and offer terms must render from canonical records, never copied into editorial fields.
- Editorial text cannot override canonical facts. Show source and last-verified context wherever financial facts appear.
- Suppress or show an approved unavailable state when a referenced record is unpublished, withdrawn or expired.
- Do not imply universal suitability, prequalification, eligibility or approval without a separately approved and evidenced process.

## 8. SEO and localization
- Enforce unique normalized locale + slug combinations.
- Generate canonical URLs from approved routing rules and prevent cross-locale canonical mistakes.
- Index/noindex and sitemap inclusion are explicit validated settings. Drafts, previews, thin/duplicate pages and pages failing mandatory quality checks are noindex.
- Hreflang only for genuinely equivalent localized pages; never point to missing translations.
- English (en-IN) is default. Hindi (hi-IN) requires native-language editorial review before publication. Do not machine-publish unreviewed Hindi copy.
- A09 remains the source of truth for search phrase mappings.
- Validate redirects for loops, chains and collisions; preserve old slug mappings and audit changes.
- Structured data must use approved schemas and visible, accurate content. Never fabricate ratings, reviews, offers or financial values.

## 9. Lifecycle and revisions
Proposed lifecycle: Draft → In Review → Approved → Scheduled/Published → Unpublished/Archived. Admin may perform routine operational review and publishing without a second approver. SEO Manager actions depend on explicit permissions. Super Admin defines states and transitions.

Every save creates a revision or recoverable snapshot. Record actor, timestamp, changed fields, reason and publication event. Restore creates a new revision; it never erases history. Scheduled jobs re-check references, validity dates, permissions and quality gates at execution time.

## 10. Validation and quality gates
Block publication when required identity/locale/slug/references are missing; locale/slug conflicts or redirect loops exist; mandatory SEO metadata is missing for an indexable page; canonical references are invalid/inactive; financial claims lack approved canonical sources; expired/not-yet-effective offers are represented as current; native-language review is incomplete; or unsafe markup/media is present.

Warnings may include thin content, missing social metadata, absent internal links and low-quality alt text. Quality thresholds are configurable by Super Admin and transparent to editors.

## 11. Logical data model proposal
- LandingPage: id, internalName, pageType, locale, slug, parentId, status, indexability, canonicalTarget, seoMetadata, createdBy, updatedBy, publishedAt, scheduledAt, archivedAt.
- LandingPageRevision: id, pageId, revisionNumber, contentSnapshot, changeSummary, actorId, createdAt.
- LandingPageBlock: id, revisionId, blockType, position, validatedConfig.
- LandingPageReference: id, page/revision ID, targetType, targetId, relationship, position.
- LandingPageRedirect: id, locale, sourcePath, destinationPath, statusCode, activeFrom, createdBy.
- LandingPageReview: id, pageId, revisionId, reviewerId, decision, notes, createdAt.
- LandingPageEvent: publication, scheduling, redirect and structural events linked to central audit trail.

This is a logical proposal, not a finalized database schema. Follow approved shared data and API standards before implementation.

## 12. Analytics and privacy
Aggregate page views, organic landing sessions, search-to-page entry, internal CTA clicks and outbound lender-link clicks only where analytics and consent rules permit. Use minimized aggregate reporting. Do not store raw search queries, lead details or unnecessary identifiers in page analytics. Retention, consent and analytics-provider decisions require privacy/legal approval. No lead capture is part of A10.

## 13. Dependencies
A02 Institutions; A03 Categories; A04 Products; A05 Rates; A06 Fees; A07 Eligibility; A08 Offers; A09 Intents; A11 Content and Guides; shared authorization, data governance, admin shell, design system, API conventions, media policy and testing strategy; public routing, localization, SEO rendering and sitemap.

## 14. Implementation tasks
| Task | Description | Status |
|---|---|---|
| ADM-LAND-001 | Confirm page types and MVP scope | Not Started |
| ADM-LAND-002 | Define permission matrix and server-side enforcement | Not Started |
| ADM-LAND-003 | Define logical data model and migrations | Not Started |
| ADM-LAND-004 | Build list, filters and pagination | Not Started |
| ADM-LAND-005 | Build structured editor and draft persistence | Not Started |
| ADM-LAND-006 | Implement typed block registry and validation | Not Started |
| ADM-LAND-007 | Implement canonical record picker and validation | Not Started |
| ADM-LAND-008 | Implement locale-specific slug and SEO metadata | Not Started |
| ADM-LAND-009 | Implement preview by locale and revision | Not Started |
| ADM-LAND-010 | Implement lifecycle and publication permissions | Not Started |
| ADM-LAND-011 | Implement scheduling with execution-time revalidation | Not Started |
| ADM-LAND-012 | Implement revision history and restore | Not Started |
| ADM-LAND-013 | Implement canonical, robots and sitemap controls | Not Started |
| ADM-LAND-014 | Implement safe redirect management | Not Started |
| ADM-LAND-015 | Implement approved structured-data generation | Not Started |
| ADM-LAND-016 | Implement quality and source-claim checks | Not Started |
| ADM-LAND-017 | Implement aggregate analytics panel | Not Started |
| ADM-LAND-018 | Add audit, accessibility and responsive behavior | Not Started |

## 15. Acceptance tests
All tests are Not Run until implementation exists.

| Test | Expected result | Status |
|---|---|---|
| ADM-LAND-T01 | Authorized editor creates and saves draft | Not Run |
| ADM-LAND-T02 | Unauthorized user cannot access editor APIs directly | Not Run |
| ADM-LAND-T03 | Page type restricted to configured values | Not Run |
| ADM-LAND-T04 | Duplicate locale/slug rejected | Not Run |
| ADM-LAND-T05 | Invalid or inactive canonical reference rejected | Not Run |
| ADM-LAND-T06 | Canonical blocks render source records only | Not Run |
| ADM-LAND-T07 | Manual financial-value override impossible | Not Run |
| ADM-LAND-T08 | Expired offer cannot appear active | Not Run |
| ADM-LAND-T09 | Block config rejects unknown fields | Not Run |
| ADM-LAND-T10 | Script, iframe and unsafe HTML rejected/sanitized | Not Run |
| ADM-LAND-T11 | Preview does not publish or expose draft | Not Run |
| ADM-LAND-T12 | Revision records actor and timestamp | Not Run |
| ADM-LAND-T13 | Restore creates revision and preserves history | Not Run |
| ADM-LAND-T14 | Admin can routinely publish without second approver | Not Run |
| ADM-LAND-T15 | SEO Manager cannot alter canonical financial facts | Not Run |
| ADM-LAND-T16 | Scheduled publish revalidates references and permissions | Not Run |
| ADM-LAND-T17 | Draft and preview URLs are not indexable | Not Run |
| ADM-LAND-T18 | Canonical URL is valid and non-conflicting | Not Run |
| ADM-LAND-T19 | Hreflang excludes missing/unreviewed translations | Not Run |
| ADM-LAND-T20 | Sitemap includes eligible published pages only | Not Run |
| ADM-LAND-T21 | Redirect loop and collision rejected | Not Run |
| ADM-LAND-T22 | Redirect change is audited | Not Run |
| ADM-LAND-T23 | Structured data matches visible sourced content | Not Run |
| ADM-LAND-T24 | Missing mandatory SEO metadata blocks indexable publication | Not Run |
| ADM-LAND-T25 | Unreviewed Hindi page cannot publish as localized content | Not Run |
| ADM-LAND-T26 | Archived/unpublished page removed from sitemap | Not Run |
| ADM-LAND-T27 | Analytics do not expose lead/customer PII | Not Run |
| ADM-LAND-T28 | Permission revocation takes effect server-side | Not Run |
| ADM-LAND-T29 | Keyboard/screen-reader behavior meets accessibility standard | Not Run |
| ADM-LAND-T30 | Mobile list, editor and preview workflows work | Not Run |

## 16. Owner decisions

The owner approved the documented A10 proposals on 2026-11-02:

1. **Page types and MVP scope:** Approved category and intent landing pages as the first MVP types; other documented types remain available for later rollout.
2. **Content blocks:** Approved a typed, allowlisted block model and prohibition on arbitrary custom HTML/JavaScript.
3. **Publication quality:** Approved mandatory blocking gates for broken canonical references, invalid metadata/slug conflicts, missing required content and material factual/source defects; editorial quality warnings remain visible and actionable.
4. **Localization:** Approved English-first release and native Hindi review before Hindi publication.
5. **Publishing authority:** Approved routine Admin publishing within operational authority and SEO Manager editorial/SEO control under server-side RBAC; canonical lender/product facts remain protected.
6. **Structured data:** Approved only structured-data types supported by the visible page content.
7. **Analytics:** Approved aggregate analytics only for MVP, with retention/consent rules defined in the shared privacy policy before collection.
8. **Redirect import:** Approved deferring bulk redirect import from MVP.

## 17. Owner approval record

- **Decision:** A10 Landing Pages specification and its documented implementation task scope approved.
- **Approved on:** 2026-11-02.
- **Implementation:** Not started. Task scope is authorized for implementation only after shared standards and dependencies pass their gates.
- **Testing:** All 30 acceptance tests remain Not Run.
- **Boundary:** Landing pages do not create or mutate canonical lender/product facts, and no lead capture or PII is authorized.

## 17. Approval and implementation gate
**Status:** Owner Approved.  
**Owner approval:** Pending.  
**Implementation:** Not Started.  
**Testing:** 30 acceptance tests defined; all Not Run.

No implementation begins until this specification and relevant shared standards/dependencies are approved.
