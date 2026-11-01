# A11 — Content and Guides

**Page ID:** A11 / ADM-CONTENT  
**Route:** /admin/content  
**Priority:** P1  
**Specification status:** Documented — Owner Approval Pending  
**Implementation status:** Not Started  
**Tests:** 30 acceptance tests defined; all Not Run  
**Last updated:** 2026-11-02

## 1. Purpose
Provide a controlled editorial workspace for creating, reviewing, localizing, publishing and maintaining educational content that helps Indian consumers understand loans, borrowing costs, eligibility concepts, lender processes, financial terminology and responsible borrowing.

A11 manages substantive editorial resources such as guides, explainers, FAQs, glossaries and educational articles. A10 Landing Pages manages SEO/discovery pages and curated journeys. Content may be referenced by A10 and public guide experiences, but neither page type may duplicate or override canonical lender/product data.

## 2. Scope and boundaries

### In scope
- Educational articles, step-by-step guides, explainers, FAQs, glossary entries and evergreen reference content.
- Content categories, tags and editorial collections using configured structures.
- Rich text using a safe, constrained editor; headings, lists, tables, callouts, citations, images and internal links.
- Author/reviewer attribution, editorial notes, version history, review and publication lifecycle.
- Source register and claim-level evidence for factual, regulatory, statistical and financial assertions.
- English-first content with Hindi localization and native-language review.
- SEO metadata, canonical URL, indexability, sitemap eligibility and internal linking.
- Related content and references to canonical A02–A10 records and public calculators.
- Aggregate content analytics where privacy and consent rules permit.

### Out of scope
- Creating or editing lender identities, products, rates, fees, eligibility rules, offers, categories or intent mappings.
- Personalized financial advice, individualized recommendations, loan eligibility decisions or approval promises.
- Lead capture, application forms, lender integrations, customer PII, credit bureau checks or transaction processing.
- Publishing legal, tax or regulatory interpretations as definitive advice without qualified review.
- Arbitrary HTML/JavaScript, embedded scripts, external forms or untrusted third-party widgets.

## 3. Roles and authorization
- **Super Admin:** defines content types, editorial categories/tags, controlled options, workflow states, block schemas and structured-data rules.
- **Admin:** operational access to content records, including create/edit/review/approve/publish/unpublish/archive, subject to configured permissions.
- **SEO Manager:** primary editorial/SEO role; creates and edits content, manages metadata/internal links and may submit/review/publish only where explicitly permitted. Cannot change canonical lender or financial facts.
- **Sales Executive / Support:** read-only access only where explicitly granted; no default access to drafts, internal editorial notes or restricted analytics.

Use configurable RBAC and server-side checks across pages, APIs, server actions, exports and scheduled jobs. Deny by default. Do not rely on UI hiding. Admin may publish routine content without mandatory second-person approval; do not impose universal maker-checker. A specific high-risk content class may later require qualified review only by explicit owner decision. Record all publication, unpublication, source and permission-sensitive actions in the audit trail.

## 4. Content types and taxonomy

### Proposed content types
1. **Guide:** comprehensive practical explanation, often step-by-step.
2. **Explainer/article:** focused educational topic or concept.
3. **FAQ collection:** reviewed question-and-answer set.
4. **Glossary entry:** concise definition with related terms.
5. **Checklist/how-to:** actionable steps or document-preparation guidance.
6. **Regulatory/update explainer:** time-sensitive summary of an official change, with source date and review/expiry date.

Super Admin controls available content types and taxonomy structures. Admin and SEO Manager use configured values; they cannot invent structural categories or workflow states. Keep public navigation simple; tags support discovery but must not create uncontrolled thin indexable pages.

## 5. Information architecture

### Content list
Display title, content type, locale, category, tags, author, reviewer, status, source-review date, last updated, published date, scheduled date and indexability. Support search, filters by type/locale/status/category/author/review date, sorting and pagination.

### Content editor
- Identity: internal title, public title, type, locale, slug, category and tags.
- Editorial: summary/excerpt, body blocks, key takeaways, estimated reading time (derived, not manually inflated), related content and related canonical records.
- Evidence: source records, claim links, publication/effective dates, source access date, quoted/paraphrased material notes and reviewer notes.
- Attribution: author display name/profile, reviewer/qualified reviewer where relevant, editorial ownership and disclosure.
- SEO: title, meta description, canonical target, robots directives, social metadata and preview.
- Lifecycle: status, schedule, publish/unpublish date, expiry/review date and change summary.

Keep internal notes separate from public content and never expose them in public APIs or rendered pages.

## 6. Editor blocks and media
Use an allowlisted, typed block editor:
- Heading with validated hierarchy.
- Paragraph and limited inline emphasis.
- Ordered/unordered list.
- Table with accessible header cells and mobile overflow handling.
- Note/callout with configured styles.
- FAQ question/answer.
- Image with alt text, caption, rights/source and responsive variants.
- Internal link to approved LoanDhudho pages or canonical records.
- External source link with safe URL validation and link purpose.
- Citation/source note.
- Calculator or comparison explainer link, not a custom calculation embed.

Sanitize rich text and validate block configuration server-side. Reject scripts, iframes, event handlers, unsafe URL schemes and arbitrary style injection. Uploads must follow an approved media policy, file type/size validation, malware scanning where available, safe storage and metadata checks. Require meaningful alt text for informative images; decorative images use empty alt text by explicit editor selection.

## 7. Source and claim governance
- Maintain a source register with source type, publisher, title, URL/document reference, publication/effective date, accessed/verified date, jurisdiction, reliability notes and status.
- Prefer primary sources: RBI, relevant government/regulator publications, official lender documents and official scheme documents. Secondary sources may provide context but must not be presented as primary authority.
- Link material factual claims to one or more sources. Mark unsupported claims for correction or removal before publication.
- Distinguish facts, editorial interpretation, estimates, examples and sponsored material.
- Do not fabricate statistics, quotes, lender terms, rates, fees, eligibility conditions, regulatory requirements or partnerships.
- Use short attributed quotations only where legally permitted; otherwise paraphrase and cite.
- Show “last reviewed” or “information checked on” dates where content can become outdated.
- For time-sensitive regulatory/update explainers, require an explicit review/expiry date and scheduled review task.
- A source link is not proof that every sentence is supported; reviewers must validate the specific claim and applicable date/jurisdiction.

## 8. Financial education and consumer safety
- Explain concepts neutrally and in plain language, with India-relevant examples and INR formatting.
- State assumptions for illustrative calculations and link to approved calculators where available.
- Clearly label examples and estimates as illustrative; never present them as a lender quote or guaranteed outcome.
- Explain material costs and risks where relevant, including interest, fees, penalties, rate resets, collateral and repayment obligations.
- Avoid coercive urgency, misleading “lowest rate” claims, guaranteed approval/disbursal language and unsubstantiated superlatives.
- Include an appropriate general-information disclaimer on financial education content. A disclaimer does not cure misleading or unsupported content.
- Content must not make a personalized recommendation or imply that LoanDhudho is a lender, broker or regulated adviser unless the legal position and wording have been separately approved.
- Regulatory content must identify jurisdiction and source date and be escalated for qualified review when interpretation is non-obvious.

## 9. Localization and accessibility
- English (en-IN) is the default source locale.
- Hindi (hi-IN) is a separate reviewed localized version, not an automatic string substitution. Native-language review is required before publication.
- Track translation state independently: Not Started, In Translation, In Review, Approved, Published, Needs Update.
- Localized content must preserve meaning, financial units, caveats, source references and legal disclaimers.
- Do not publish hreflang links to missing or materially non-equivalent translations.
- Use semantic heading order, descriptive link text, accessible tables, keyboard-operable controls, sufficient contrast and alt text.
- Ensure responsive layouts and readable content on small screens and low-bandwidth connections.

## 10. SEO and public rendering
- Enforce unique locale + slug combinations and normalized slugs.
- Drafts, previews, archived content, thin/duplicate content and content failing mandatory quality checks must not be indexable.
- Canonical URL must follow approved routing rules; redirect old slugs safely and audit redirect changes.
- Generate sitemap entries only for eligible published content.
- Structured data may be generated only from approved schemas and content visibly present on the page; do not fabricate reviews, ratings, authorship or dates.
- SEO metadata must accurately describe the content and must not promise outcomes or misrepresent lender terms.
- Related links must resolve to published and authorized public destinations.
- Avoid creating indexable tag/category pages with insufficient unique value.

## 11. Workflow and version history
Proposed lifecycle: Draft → Editorial Review → Approved → Scheduled/Published → Needs Update/Unpublished → Archived. Workflow states and allowed transitions are Super Admin structural configuration. Admin retains routine operational publication authority. SEO Manager permissions are explicit and configurable.

Every save creates a revision or recoverable snapshot. Record actor, timestamp, changed fields, source changes, review decision, publication event and reason. Restoring an old revision creates a new revision; it does not erase history. Editing published content should create a draft revision so the current public version remains stable until republished. Scheduled jobs must re-check permissions, sources, expiry/review dates, links and quality gates at execution time.

## 12. Review and publication quality gates
Block publication when:
- Required title, type, locale, slug, body or author attribution is missing.
- Duplicate locale/slug or invalid canonical/redirect configuration exists.
- Material factual, regulatory, financial or statistical claims lack evidence.
- Content includes unsupported lender terms, guaranteed outcomes or misleading claims.
- Required qualified review is flagged but not completed.
- Hindi localization has not passed native-language review.
- Unsafe markup, media or external links are present.
- Mandatory disclaimer or source-date fields are missing for the relevant content class.

Warnings may include short/thin content, missing excerpt/social image, few internal links, overdue non-critical review or optional translation gaps. Quality rules must be transparent and configurable by Super Admin.

## 13. Logical data model proposal
- **ContentEntry:** id, contentType, internalTitle, locale, slug, status, categoryId, authorId, ownerId, currentPublishedRevisionId, reviewDueAt, publishedAt, archivedAt.
- **ContentRevision:** id, entryId, revisionNumber, contentSnapshot, seoMetadata, changeSummary, actorId, createdAt.
- **ContentBlock:** id, revisionId, blockType, position, validatedConfig.
- **ContentSource:** id, publisher, title, sourceType, URL/documentRef, publicationDate, effectiveDate, accessedAt, jurisdiction, status, reliabilityNotes.
- **ContentClaimEvidence:** id, revisionId, claimReference, sourceId, evidenceNote, reviewerStatus.
- **ContentRelation:** id, entryId, targetType, targetId, relationType, position.
- **ContentReview:** id, entryId, revisionId, reviewerId, decision, notes, reviewedAt.
- **ContentTranslation:** sourceEntryId, localizedEntryId, locale, translationStatus, reviewerId, reviewedAt.
- **ContentEvent:** create/edit/review/publish/unpublish/archive/source/redirect events linked to central audit trail.

Logical proposal only; final schema follows approved data and API standards.

## 14. Analytics and privacy
Where permitted by consent and privacy policy, show aggregate page views, organic entries, reading engagement, internal guide-to-product navigation and calculator-link clicks. Do not expose individual browsing profiles, raw search queries, lead/customer PII or unnecessary identifiers. Define retention, analytics provider and consent behavior before implementation. No lead capture or personal financial profiling is included in A11.

## 15. Dependencies
- A10 Landing Pages for references and editorial collections.
- A02–A09 canonical institution, category, product, rate, fee, eligibility, offer and intent data.
- Public F13 Guides index/detail and shared public rendering.
- Shared authorization, data governance, design system, admin shell, API conventions, media/upload policy, SEO and testing standards.
- Legal/compliance review for disclaimers, regulated terminology, privacy/analytics and any content that could be construed as advice.

## 16. Implementation tasks
| Task | Description | Priority | Status |
|---|---|---:|---|
| ADM-CONT-001 | Confirm content types and MVP taxonomy | P1 | Not Started |
| ADM-CONT-002 | Define role/permission matrix and server-side enforcement | P1 | Not Started |
| ADM-CONT-003 | Define content, revision, source and claim-evidence models | P1 | Not Started |
| ADM-CONT-004 | Build content list, filters, sorting and pagination | P1 | Not Started |
| ADM-CONT-005 | Build typed block editor and draft persistence | P1 | Not Started |
| ADM-CONT-006 | Implement safe media upload and metadata validation | P1 | Not Started |
| ADM-CONT-007 | Implement source register and claim-evidence linking | P1 | Not Started |
| ADM-CONT-008 | Implement editorial review and publication lifecycle | P1 | Not Started |
| ADM-CONT-009 | Implement immutable revision history and restore | P1 | Not Started |
| ADM-CONT-010 | Implement English/Hindi localization workflow | P1 | Not Started |
| ADM-CONT-011 | Implement SEO metadata, canonical and sitemap eligibility | P1 | Not Started |
| ADM-CONT-012 | Implement internal links and canonical record references | P1 | Not Started |
| ADM-CONT-013 | Implement content quality and consumer-safety checks | P1 | Not Started |
| ADM-CONT-014 | Implement review-due/expiry reminders for time-sensitive content | P2 | Not Started |
| ADM-CONT-015 | Implement aggregate content analytics | P2 | Not Started |
| ADM-CONT-016 | Implement audit events and export controls | P1 | Not Started |
| ADM-CONT-017 | Implement accessibility, responsive and theme behavior | P1 | Not Started |
| ADM-CONT-018 | Integrate public guide rendering and related-content navigation | P1 | Not Started |

## 17. Acceptance tests
All tests are Not Run until implementation exists.

| Test | Expected result | Status |
|---|---|---|
| ADM-CONT-T01 | Authorized user can create and save a draft | Not Run |
| ADM-CONT-T02 | Unauthorized direct API mutation is denied server-side | Not Run |
| ADM-CONT-T03 | Content type/category restricted to configured options | Not Run |
| ADM-CONT-T04 | Duplicate locale/slug is rejected | Not Run |
| ADM-CONT-T05 | Published content remains stable while a new revision is edited | Not Run |
| ADM-CONT-T06 | Restore creates a new revision and preserves prior history | Not Run |
| ADM-CONT-T07 | Material claim without evidence blocks publication | Not Run |
| ADM-CONT-T08 | Source register records publisher, URL, date and jurisdiction | Not Run |
| ADM-CONT-T09 | Unsupported rate/fee/eligibility claim is blocked or flagged for correction | Not Run |
| ADM-CONT-T10 | Unsafe HTML, script, iframe and URL schemes are rejected/sanitized | Not Run |
| ADM-CONT-T11 | Media upload validates file type, size and metadata | Not Run |
| ADM-CONT-T12 | Informative image requires meaningful alt text | Not Run |
| ADM-CONT-T13 | Admin can routinely publish without mandatory second approver | Not Run |
| ADM-CONT-T14 | SEO Manager cannot alter canonical lender financial facts | Not Run |
| ADM-CONT-T15 | Hindi version cannot publish before native-language review | Not Run |
| ADM-CONT-T16 | Missing translation is excluded from hreflang | Not Run |
| ADM-CONT-T17 | Draft, preview and archived content are not indexable | Not Run |
| ADM-CONT-T18 | Sitemap includes eligible published content only | Not Run |
| ADM-CONT-T19 | Invalid canonical URL or redirect loop is rejected | Not Run |
| ADM-CONT-T20 | Scheduled publication revalidates permissions, sources and links | Not Run |
| ADM-CONT-T21 | Time-sensitive update requires review/expiry date | Not Run |
| ADM-CONT-T22 | Required disclaimer is enforced for configured content type | Not Run |
| ADM-CONT-T23 | Internal links cannot expose unpublished/private records | Not Run |
| ADM-CONT-T24 | Structured data reflects visible content only | Not Run |
| ADM-CONT-T25 | Editorial notes and reviewer comments never appear publicly | Not Run |
| ADM-CONT-T26 | Audit trail records source, review and publication changes | Not Run |
| ADM-CONT-T27 | Analytics are aggregate and do not expose PII/raw queries | Not Run |
| ADM-CONT-T28 | Permission revocation takes effect on protected operations | Not Run |
| ADM-CONT-T29 | Editor and public content meet keyboard/screen-reader requirements | Not Run |
| ADM-CONT-T30 | List/editor/preview/public guide are usable on mobile and dark/light themes | Not Run |

## 18. Owner decisions pending
1. Confirm MVP content types; recommendation: guides, explainers/articles, FAQs and glossary entries.
2. Confirm initial taxonomy and whether Super Admin alone manages it (recommended, consistent with structural ownership).
3. Confirm which content classes require qualified legal/compliance review before publication; recommend regulatory/legal interpretation and product-specific claims be escalated.
4. Confirm source evidence policy; recommendation: primary sources for material lender, financial and regulatory facts, with claim-level evidence.
5. Confirm English-first release and native Hindi review requirement.
6. Confirm author attribution model (named staff profiles versus editorial desk); recommend named author plus editorial reviewer where applicable.
7. Confirm mandatory disclaimer variants by content type; wording requires legal review.
8. Confirm analytics metrics and retention/consent policy; recommend aggregate-only reporting.

## 19. Definition of Done and implementation gate
- Specification and shared dependencies explicitly approved.
- Permissions enforced server-side and audited.
- Content/source/revision workflows preserve public-version integrity.
- Claim evidence, localization, accessibility, SEO and privacy acceptance criteria pass.
- All P0/P1 tests have recorded results; no unresolved security/compliance blocker.
- Rollback/unpublish and restore paths are verified.

**Current status:** Documented — Owner Approval Pending.  
**Owner approval:** Pending.  
**Implementation:** Not Started.  
**Testing:** 30 acceptance tests defined; all Not Run.

No implementation begins until this specification and relevant shared standards/dependencies are approved.
