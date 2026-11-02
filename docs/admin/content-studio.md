# Admin Content Studio — Scope

**Status:** Scope Draft — owner review pending  
**Last updated:** 2026-11-02  
**Admin area:** `/admin/content` with dedicated subroutes for Static Pages, News and Blogs.

## 1. Purpose and boundary

Provide one content-management area for publishing and maintaining public-facing institutional, editorial and timely content. The three content types share safe editing, media, SEO, localization, revision, preview, scheduling, publication and audit capabilities, but retain distinct fields, templates and quality rules.

This scope complements, and does not replace:
- **A10 Landing Pages:** SEO/intent/category acquisition pages assembled from approved structured blocks and canonical marketplace records.
- **A11 Content and Guides:** evergreen financial education, guides, FAQs, glossary and explainers with claim-level evidence.
- **A16 Content Studio:** general site pages, news updates and blog/editorial posts.

No lender/product/rate/fee/eligibility/offer facts may be changed through this area. No lead capture, application form, customer PII or external application integration is included.

## 2. Modules

### 2.1 Static Pages

Purpose: maintain stable public information pages and reusable site content.

Examples: About, How LoanDhudho Works, Contact information, grievance information, editorial policy, lender-partner information, FAQs landing page, and other owner-approved informational pages. Legal pages (Privacy, Terms, Disclaimer) may be managed here only with qualified legal review and controlled publication.

Fields:
- Internal name, public title, locale, unique slug/path, page template, summary.
- Typed page sections/blocks, navigation placement, display order and visibility.
- SEO title/description, canonical URL, robots/indexability and social metadata.
- Author/editor, reviewer, source/evidence where factual claims require it.
- Draft/published revision, scheduled publish/unpublish, redirect mapping and change reason.

Rules:
- Only allowlisted templates and typed blocks; no arbitrary HTML, JavaScript, iframe or unsafe embeds.
- Protect reserved/system routes and route collisions. Super Admin controls templates, block schemas, route reservations and navigation catalogues; Admin/SEO Manager use configured structures.
- Legal pages require qualified legal approval before publication. Preserve previous published version and revision history.
- Navigation inclusion is explicit and separately permissioned; unlisted pages can still be published at an approved path.

### 2.2 News

Purpose: publish time-sensitive company, industry and public-interest updates without presenting editorial reporting as lender-confirmed product data.

Fields:
- Headline, short summary, body, category, tags, locale, slug.
- News type (company update, industry update, policy/regulatory update, lender announcement), publisher/source, publication date, event/effective date where relevant.
- Byline, editor/reviewer, source links and claim-level evidence for material facts.
- Related institution/product/category references only as links to canonical records; never edit those records here.
- Review-due/expiry date, correction/update note, SEO/social metadata and image attribution.

Rules:
- Clearly distinguish reported fact, official announcement, analysis and opinion.
- Regulatory/policy and financial claims require primary sources and qualified review when interpretation is non-obvious.
- Display publication and last-updated timestamps; retain correction history and avoid silently rewriting material errors.
- Expired/outdated news can be labelled, de-indexed or archived under configured policy; never delete history to hide a correction.
- No scraped/copied articles, fabricated quotes, unsupported claims or implied lender partnership.

### 2.3 Blogs

Purpose: publish opinion, company updates, interviews and editorial articles that are distinct from evergreen A11 financial guides.

Fields:
- Title, excerpt, body blocks, author/byline, author profile, category, tags, locale, slug.
- Featured image and rights/attribution, reading time (derived), related posts and canonical marketplace links.
- SEO/social metadata, publication/schedule dates, revision/change summary and review state.
- Disclosure fields for sponsorship, commercial relationship, affiliate or contributor content where applicable.

Rules:
- Label opinion, sponsored, partner or contributed material clearly.
- Financial/product claims must link to reliable evidence and cannot promise approval, lowest rates or outcomes.
- Avoid duplicate or thin pages that compete with A11 guides and A10 landing pages; provide canonical/redirect handling.
- Admin has routine publication authority; no universal second-person approval. Specific legal/qualified review gates apply only to configured content classes.

## 3. Shared workflow and editing

- List views with search, filters (type, locale, status, author, category, date), sorting and pagination.
- Editor with preview at desktop/mobile widths, autosave or explicit draft save, validation summary and accessible block controls.
- Lifecycle: Draft → In Review → Approved (where configured) → Scheduled/Published → Needs Update/Unpublished → Archived.
- Workflow states and content structures are Super Admin-controlled. Admin can create, edit, review, approve, publish, unpublish and archive within effective permissions. SEO Manager manages editorial/SEO content within grants. Sales Executive/Support has no default write access and only read access where explicitly granted.
- Every save creates a recoverable revision. Editing a published item creates a draft revision; current public content remains unchanged until republished.
- Schedule jobs re-check permission, publication state, review requirements, route uniqueness, links and media at execution time.
- Preview tokens are short-lived, unguessable, permission-bound and never indexable.
- Audit create/edit/review/publish/unpublish/archive, route/redirect, source, media and permission-sensitive changes.

## 4. Shared SEO, localization, media and analytics

- English (en-IN) default; Hindi (hi-IN) is a separately reviewed translation. Do not publish hreflang for missing or non-equivalent translations.
- Unique normalized locale + slug/path; safe redirects; canonical URL; noindex for draft, preview, archived and ineligible content.
- Sitemap contains only eligible published URLs. Structured data must match visible content and approved schemas.
- Typed, allowlisted blocks and templates; server-side validation and sanitization. No arbitrary script, iframe, event handler or untrusted widget.
- Media requires file/type/size validation, safe storage, rights/source metadata, alt text and responsive variants; malware scanning where available.
- Aggregate content analytics only, subject to consent/privacy policy; no individual browsing profiles or raw query/lead/customer data.

## 5. Roles and authorization

- **Super Admin:** defines page templates, block schemas, content types, taxonomy, navigation catalogue, workflow states and global SEO constraints.
- **Admin:** full routine operational content authority—create/edit/review/approve/publish/unpublish/archive—using configured structures and permissions; cannot redefine structures.
- **SEO Manager:** content authoring, metadata, internal links, editorial workflow and publication only where granted; cannot change canonical financial facts.
- **Sales Executive / Support:** no default access; optional read-only access to approved public content previews only if explicitly granted.

Enforce deny-by-default server-side authorization on pages, APIs, server actions, jobs, media, preview and exports. Hiding UI controls is not enforcement.

## 6. Data model proposal

- `CmsEntry`: id, contentType (STATIC_PAGE/NEWS/BLOG), locale, slug, status, title, owner/author, currentPublishedRevisionId, schedule/review dates.
- `CmsRevision`: entryId, revision, typed content snapshot, SEO metadata, change summary, actor and timestamp.
- `CmsBlock`: revisionId, blockType, order, validated configuration.
- `CmsSourceEvidence`: revisionId, claim reference, source, evidence note, review state.
- `CmsMedia`: storage key, type, dimensions, alt text, caption, rights/source, uploader.
- `CmsRelation`: entry, related CMS entry or canonical marketplace entity, relation type.
- `CmsReview` and `CmsEvent`: review decisions and append-only audit linkage.
- `CmsRedirect`: old path, new path, locale, status and actor.

Logical proposal only; final schema follows approved Data Governance and API Conventions.

## 7. Implementation tasks

| Task | Description | Priority | Status |
|---|---|---:|---|
| ADM-CMS-001 | Define shared CMS content model and three content-type contracts | P1 | Not Started |
| ADM-CMS-002 | Implement permission matrix and route/API/job enforcement | P1 | Not Started |
| ADM-CMS-003 | Build content list, filters, sorting and pagination | P1 | Not Started |
| ADM-CMS-004 | Build safe typed-block editor and responsive preview | P1 | Not Started |
| ADM-CMS-005 | Implement revision history, restore and published-version isolation | P1 | Not Started |
| ADM-CMS-006 | Implement Static Pages templates, route reservation and navigation controls | P1 | Not Started |
| ADM-CMS-007 | Implement News fields, sourcing, correction and expiry workflow | P1 | Not Started |
| ADM-CMS-008 | Implement Blog authoring, bylines and commercial disclosures | P1 | Not Started |
| ADM-CMS-009 | Implement review, schedule, publish, unpublish and archive workflows | P1 | Not Started |
| ADM-CMS-010 | Implement SEO, canonical, redirects, sitemap and structured-data rules | P1 | Not Started |
| ADM-CMS-011 | Implement English/Hindi localization and review states | P1 | Not Started |
| ADM-CMS-012 | Implement media upload, rights metadata and alt-text validation | P1 | Not Started |
| ADM-CMS-013 | Implement sources/evidence and qualified-review gates | P1 | Not Started |
| ADM-CMS-014 | Implement audit events and aggregate analytics | P2 | Not Started |
| ADM-CMS-015 | Integrate public templates and cache/revalidation behavior | P1 | Not Started |

## 8. Acceptance tests

All tests remain Not Run until implementation.

| Test | Expected result | Status |
|---|---|---|
| ADM-CMS-T01 | Authorized Admin can create each of the three content types | Not Run |
| ADM-CMS-T02 | Super Admin alone can alter templates, block schemas and route catalogues | Not Run |
| ADM-CMS-T03 | Unauthorized direct API/job/media access is denied server-side | Not Run |
| ADM-CMS-T04 | Duplicate locale/path and reserved route collisions are rejected | Not Run |
| ADM-CMS-T05 | Published version remains stable while a draft revision is edited | Not Run |
| ADM-CMS-T06 | Restore creates a new revision without erasing history | Not Run |
| ADM-CMS-T07 | Static pages use allowlisted templates and typed blocks only | Not Run |
| ADM-CMS-T08 | Legal static page cannot publish without configured qualified approval | Not Run |
| ADM-CMS-T09 | News item records publisher/source and publication/update dates | Not Run |
| ADM-CMS-T10 | Material news claims without evidence are blocked or flagged | Not Run |
| ADM-CMS-T11 | News correction preserves original revision and visible correction history | Not Run |
| ADM-CMS-T12 | Expired news follows configured label/de-index/archive policy | Not Run |
| ADM-CMS-T13 | Blog byline, image rights and required commercial disclosures are validated | Not Run |
| ADM-CMS-T14 | Unsupported guaranteed/lowest-rate claims are blocked or flagged | Not Run |
| ADM-CMS-T15 | Admin can routinely publish without mandatory second approver | Not Run |
| ADM-CMS-T16 | SEO Manager cannot modify lender/product financial records | Not Run |
| ADM-CMS-T17 | Draft/preview/archive URLs are not indexable | Not Run |
| ADM-CMS-T18 | Sitemap contains eligible published pages/news/blogs only | Not Run |
| ADM-CMS-T19 | Redirect loops and unsafe canonical targets are rejected | Not Run |
| ADM-CMS-T20 | Hindi page/news/blog cannot publish before native-language review | Not Run |
| ADM-CMS-T21 | Missing/non-equivalent translation is excluded from hreflang | Not Run |
| ADM-CMS-T22 | Unsafe HTML, script, iframe and URL schemes are rejected | Not Run |
| ADM-CMS-T23 | Media validates file type, size, rights metadata and alt text | Not Run |
| ADM-CMS-T24 | Scheduled publish re-checks permission and all publication gates | Not Run |
| ADM-CMS-T25 | Preview requires authorized, expiring preview token and is noindex | Not Run |
| ADM-CMS-T26 | Public API never exposes internal notes, reviewer comments or drafts | Not Run |
| ADM-CMS-T27 | All content, source, route and publication changes are audited | Not Run |
| ADM-CMS-T28 | Analytics remain aggregate and privacy-approved | Not Run |
| ADM-CMS-T29 | Public templates and editor meet keyboard/screen-reader requirements | Not Run |
| ADM-CMS-T30 | Lists, editor and preview work on mobile and light/dark themes | Not Run |

## 9. Dependencies and gates

- A10 Landing Pages, A11 Content and Guides, canonical A02–A09 records and public frontend templates.
- Admin Shell, Authorization, Data Governance, Design System, API Conventions and Testing Strategy.
- Authentication/session security, media storage/upload policy, cache invalidation and SEO/sitemap implementation.
- Qualified legal/compliance review for legal pages, regulatory interpretation, privacy, analytics, sponsorship disclosures and regulated claims.
- No lead capture, customer PII, application processing or lender integrations.

## 10. Owner review decisions

Pending. Confirm scope and any content-type-specific policy changes before marking this specification Owner Approved.

**Current status:** Scope Draft — Owner Approval Pending.  
**Implementation:** Not Started.  
**Testing:** 30 acceptance tests defined; all Not Run.
