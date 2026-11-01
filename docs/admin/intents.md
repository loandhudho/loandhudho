# Intents and Search Mappings — Admin Page Specification

**Page ID:** A09 / ADM-INTENT  
**Route:** `/admin/intents`  
**Phase:** 1 — Admin page analysis/specifications  
**Status:** Documented — Owner Approval Pending  
**Priority:** P1  
**Last updated:** 2026-11-02  
**Implementation:** Not started

## 1. Purpose

Manage the language users use to describe borrowing needs and map those expressions to canonical loan categories and eligible products. Search intent is a discovery layer, not a replacement for the product-category taxonomy.

Examples:
- “I want to buy a house” → Home Loan category and relevant home-loan products.
- “Need funds against my property” → Loan Against Property.
- “Paise ki zaroorat hai” / “mujhe personal loan chahiye” → Personal Loan.
- “Need money for shop expansion” → potentially Business Loan and/or Loan Against Property, depending on collateral and context; do not force one result when intent is ambiguous.

The system must support English, Hindi (Devanagari), common Romanized Hindi/Hinglish, spelling variants, synonyms, colloquial phrases and safe typo tolerance. It should return relevant results without inventing eligibility, lender facts or user intent.

## 2. Scope and boundaries

**In scope**
- Intent catalogue: user goal, intent label, description and examples.
- Locale-specific phrases, synonyms, spelling variants and transliterations.
- Intent-to-category mappings with relevance/priority and explanatory rationale.
- Optional product filters/constraints only when grounded in structured product data.
- Search query normalization, matching and ranking configuration.
- Preview/simulation, test queries, analytics and no-result review.
- Draft/review/publish, version history, rollback and audit.

**Out of scope**
- Defining or changing canonical loan categories, product types, entity types, global status catalogues or comparison schemas; these remain Super Admin structural responsibilities and are governed by A03.
- Editing lender/product/rate/fee/eligibility/offer facts.
- Treating an intent as proof of borrower eligibility or approval.
- Collecting lead/customer PII, credit-bureau data or sensitive financial credentials.
- Automatically creating public landing pages; A10 owns landing-page publishing.
- Unreviewed machine-learning model deployment or opaque ranking changes.

## 3. Roles and permissions

| Role | Authority |
|---|---|
| Super Admin | Defines intent entity structures, controlled intent classes, locale catalogues, mapping operators and global search configuration. |
| Admin | Operationally creates/edits/reviews/approves/publishes intent records and mappings using configured structures; cannot redefine system structures. |
| SEO Manager | Full editorial access to intent labels, descriptions, examples, phrase coverage and SEO-facing metadata within approved structures; cannot change canonical product/category facts or override relevance safeguards. |
| Sales Executive / Support | Read-only access to published mappings and aggregate search diagnostics within assigned scope; no query-level personal data or unrestricted exports. |

Enforce effective permissions server-side on routes, APIs, server actions, preview endpoints, exports and background jobs. Deny by default. UI visibility is not authorization. Audit publication, mapping and ranking changes. Do not introduce mandatory second-person approval for routine Admin publication; preserve validation and history.

## 4. Information architecture

Route: `/admin/intents`.

Suggested sections/tabs:
1. **Intent catalogue** — intent name, stable ID, description, use case and status.
2. **Phrase mappings** — locale, phrase, normalized form, phrase type and target intent.
3. **Category mappings** — intent-to-category relationship, relevance band/weight, primary/secondary designation and rationale.
4. **Search preview** — test query, detected locale, normalized query, matched phrases/intents/categories/products and explanation of ranking.
5. **Coverage and diagnostics** — language/phrase coverage, no-result patterns, low-confidence queries, zero-result categories and mapping gaps.
6. **History** — revisions, publication and rollback.

Provide search, filters, stable pagination and sorting. Filters include status, locale, intent class, target category, phrase type, mapping confidence/review state and last updated. Avoid exposing raw user-entered queries where they could contain personal information; diagnostics should be aggregated and privacy-reviewed.

## 5. Canonical data and mapping model

### 5.1 Intent record

Candidate fields:
- immutable intent ID and stable internal key;
- canonical intent label and concise definition;
- intent family/type (configured controlled option);
- user goal/problem statement;
- optional required context or disambiguation prompts;
- locale-neutral concept key;
- lifecycle/publication status;
- owner, timestamps, version and audit references.

An intent describes a goal, not a lender product. Multiple intents may map to one category; one intent may map to multiple categories. Do not create duplicate intents solely for language or spelling variants.

### 5.2 Phrase mapping

Candidate fields:
- immutable phrase-mapping ID and intent ID;
- locale/language tag (e.g. `en-IN`, `hi-IN`, Romanized Hindi/Hinglish configured separately);
- original phrase and normalized phrase;
- phrase kind: exact phrase, synonym, colloquial expression, transliteration, spelling variant or reviewed typo;
- optional token/phrase matching rules;
- ambiguity notes, source/reviewer and confidence/review state;
- active dates, version and audit metadata.

Preserve original script and phrase. Normalization may standardize Unicode, whitespace, punctuation and case where appropriate, but must not destroy meaningful Hindi characters, word boundaries or negation. Romanized Hindi spellings vary; maintain reviewed variants rather than assuming one transliteration is canonical. Avoid broad fuzzy matching that maps unrelated queries.

### 5.3 Intent-to-category mapping

Candidate fields:
- intent ID and canonical category ID from A03;
- mapping role: primary, secondary or conditional;
- relevance band/weight from a Super Admin-defined scale;
- required/excluded context conditions, if explicitly supported;
- rationale and examples;
- effective dates, publication state and version.

Only map to existing active categories. Admin and SEO Manager may use configured categories but cannot create/change them here. A mapping must not imply a product exists or is currently available. Search results must still be constrained to actual published, eligible-for-display products.

### 5.4 Optional product-level constraints

Product-level filtering is permitted only where the condition is backed by structured, current product data (A04–A07). For example, “no collateral” must not exclude secured products unless product collateral requirements are reliably modeled. Do not encode guessed income, credit-score or employment rules in an intent mapping. If query context is insufficient, show a broader result set or ask a simple clarifying question rather than silently narrowing.

## 6. Initial intent catalogue — proposed examples

This is a starter proposal, not a final exhaustive catalogue. Super Admin owns the controlled intent structure; Admin/SEO populate operational records and phrases.

| Intent family | Example user goal | Candidate category mapping |
|---|---|---|
| Purchase | Buy a house/flat | Home Loan |
| Construction | Build a house on owned land | Home Loan, subject to product scope |
| Renovation | Repair, extend or renovate a home | Home Loan and/or Loan Against Property, depending on sourced product purpose |
| Property-backed funds | Borrow against owned residential/commercial property | Loan Against Property |
| Personal expense | Medical, travel, wedding or other personal need | Personal Loan |
| Business growth | Working capital, inventory, equipment or expansion | Business Loan; other categories only where relevant |
| Education | Fund tuition or education expenses | Education Loan |
| Vehicle purchase | Buy a car/two-wheeler/commercial vehicle | Vehicle Loan |
| Gold-backed funds | Borrow against pledged gold | Gold Loan |
| Investment-backed funds | Borrow against shares/securities | Loan Against Securities |
| Consumer purchase | Finance eligible appliances/electronics | Consumer Durable Loan |
| Flexible credit | Reusable credit/overdraft requirement | Credit Line/Overdraft |
| Commercial property | Purchase or finance commercial property | Commercial Property Finance |

The catalogue must not imply every lender offers every use case. Category mapping is discovery guidance, not an eligibility determination. Where more than one category is plausible, retain multiple ranked mappings and explain the distinction.

## 7. Search behavior and ranking

### 7.1 Processing stages

1. Receive query; enforce length/rate limits and safe input handling.
2. Detect likely language/script without treating detection as certainty.
3. Normalize Unicode, whitespace, punctuation and case; preserve original query.
4. Match exact phrases and reviewed synonyms/transliterations.
5. Apply conservative token/full-text and typo-tolerant matching.
6. Resolve candidate intents and category mappings.
7. Apply only evidence-backed filters from structured data.
8. Retrieve currently published products/institutions; exclude unavailable, expired or unpublished records.
9. Rank by phrase/mapping relevance, product/category match quality, data completeness and freshness; never rank sponsored placement as organic relevance.
10. Explain the result category in user-friendly language and offer clarification when confidence is low or intents conflict.

### 7.2 Search technology

MVP direction: PostgreSQL full-text search plus `pg_trgm`, with explicit locale-aware normalization and reviewed phrase dictionaries. Do not assume English stemming works for Hindi. Store language/script metadata and test Devanagari and Romanized Hindi independently. Add dedicated Hindi tokenization or an external search engine only after benchmarked evidence shows the MVP is insufficient and the owner approves the dependency.

Use deterministic, inspectable ranking initially. Any learned ranking must be evaluated for relevance, bias, explainability, privacy and rollback before release.

### 7.3 Ambiguity and clarification

- “Need money” is broad: do not assume Personal Loan; show common routes or ask purpose.
- “Loan for house” may mean purchase, construction, renovation or property-backed borrowing; use context or clarify.
- “Business loan without collateral” may be a query constraint, not a new intent. Apply only when structured product facts support it.
- Negative terms (“not a home loan”, “without gold”) must not be lost during normalization.
- Do not infer sensitive attributes or use demographic proxies.
- If no reliable match exists, show a neutral no-result/help state and retain only privacy-safe aggregate diagnostics.

## 8. Search preview and quality diagnostics

Preview must show original query, detected locale/script with confidence, normalized query, matched phrase and phrase type, candidate intents, category mappings, ranking explanation, product eligibility/display filters and final sample results. Use clearly labeled test/synthetic queries; preview must not create leads or trigger lender applications.

Maintain a curated regression suite across:
- English phrases and spelling variants;
- Hindi Devanagari;
- Romanized Hindi/Hinglish variants;
- mixed-language queries;
- common misspellings and spacing;
- ambiguous and multi-intent queries;
- negation and exclusions;
- empty, overly broad, very long and malicious input;
- queries with no matching products.

Measure aggregate search success, zero-result rate, reformulation rate, mapping coverage and result relevance. Do not optimize solely for click-through. Query analytics must be minimized, access-controlled and aggregated; define retention before storing raw queries. Never expose query-level data to Support by default.

## 9. Editorial, SEO and localization

Intent labels/descriptions should reflect natural user language, not keyword stuffing. Keep user-facing examples distinct from hidden synonyms. SEO Manager may edit approved editorial text and locale phrases but cannot create canonical categories, invent product availability or override structured mappings without permission.

English is default; Hindi is supported. Maintain locale-specific phrase records rather than machine-translating every phrase. Hindi public text requires native-quality review. Romanized Hindi is a search input aid; do not treat it as the preferred public display language unless explicitly approved. Keep language/script variants connected to one concept and prevent duplicate indexable pages. Landing-page creation and canonical/metadata rules belong to A10.

## 10. Validation, lifecycle and versioning

- Intent key and locale-scoped normalized phrase uniqueness; detect duplicates and near-duplicates before save.
- Every phrase maps to an existing active intent.
- Every category mapping references an existing active A03 category.
- Reject unsupported category IDs, circular relationships and invalid effective dates.
- Warn on broad/ambiguous phrases, low-confidence mappings and conflicting targets.
- Require rationale and examples for primary mappings and material ranking changes.
- Test negation, ambiguity and Hindi/transliteration regressions before publication.
- Draft edits do not affect live search until Admin publishes.
- Material published changes create a new version; retain prior versions and allow authorized rollback with reason.
- Proposed lifecycle: Draft → In Review → Approved → Published, with Paused/Withdrawn/Archived. Super Admin defines controlled states; Admin operates them.
- Routine Admin publication requires no separate approver.

## 11. Security, privacy and operational controls

Treat query strings and imported phrases as untrusted. Prevent SQL injection through parameterized queries; escape rendered content; rate-limit search/preview; protect against oversized inputs and denial-of-service patterns. Do not execute mapping expressions or user-supplied code. Keep search diagnostics free of direct identifiers and sensitive personal data.

Audit create/edit/approve/publish/pause/withdraw/rollback, mapping/ranking changes, imports and exports. Record actor, target, action, timestamp, outcome, reason, version and relevant before/after values. Exports require explicit permission and aggregate/minimized fields.

No lead capture, profile building, credit checks, personal-data sharing or application facilitation is part of A09. Do not request OTPs, PINs, passwords, UPI credentials or bank account details.

## 12. API and failure behavior

Implementation should define typed, versioned endpoints/actions for:
- intent and phrase list/detail;
- draft create/update;
- phrase and category mapping management;
- preview/simulation;
- publish/pause/withdraw/rollback;
- aggregate diagnostics.

All mutations validate server-side and run transactionally where multiple mappings/version records change together. Preview is read-only and isolated from production side effects. Return structured field errors, authorization errors, conflict responses and retry-safe failures. Do not expose internal ranking weights or restricted diagnostics publicly.

## 13. Dependencies

- A03 Loan Categories: canonical category IDs and labels.
- A04 Loan Products: actual searchable product records and status.
- A05–A08: optional product facts used only when reliable and published.
- Shared authorization, data-governance, API, design-system and testing standards.
- A10 Landing Pages: consumes approved intents/mappings; owns page creation and SEO publication.
- F01 Homepage and intent search: consumes public search behavior.

## 14. Ordered tasks

All tasks are **Not Started**. This document does not authorize coding.

| Task ID | Priority | Task | Dependency | Status |
|---|---|---|---|---|
| ADM-INTENT-001 | P1 | Finalize intent/phrase/category mapping entities and version contract | Data governance | Not Started |
| ADM-INTENT-002 | P1 | Define role permissions and server-side enforcement | Authorization | Not Started |
| ADM-INTENT-003 | P1 | Build intent catalogue list/detail/search/filter | Admin shell/API | Not Started |
| ADM-INTENT-004 | P1 | Build phrase mapping editor with locale/script metadata | Localization | Not Started |
| ADM-INTENT-005 | P1 | Build intent-to-category mapping editor using A03 references | A03 | Not Started |
| ADM-INTENT-006 | P1 | Add duplicate and near-duplicate detection | Search normalization | Not Started |
| ADM-INTENT-007 | P1 | Implement conservative English/Hindi/Romanized Hindi normalization | Search design | Not Started |
| ADM-INTENT-008 | P1 | Implement PostgreSQL full-text and pg_trgm candidate matching | Database/search standards | Not Started |
| ADM-INTENT-009 | P1 | Implement deterministic relevance ranking and explanations | Mapping model | Not Started |
| ADM-INTENT-010 | P1 | Implement ambiguity, negation and clarification behavior | Search behavior | Not Started |
| ADM-INTENT-011 | P1 | Build isolated search preview/simulation | Search API | Not Started |
| ADM-INTENT-012 | P1 | Add curated multilingual regression query suite | QA/localization | Not Started |
| ADM-INTENT-013 | P1 | Add privacy-safe aggregate coverage and no-result diagnostics | Analytics/privacy | Not Started |
| ADM-INTENT-014 | P1 | Implement draft/review/publish/version/rollback and audit | Authorization/audit | Not Started |
| ADM-INTENT-015 | P2 | Add reviewed bulk phrase import with preview/dry run | Import standard/approval | Not Started |
| ADM-INTENT-016 | P1 | Complete accessibility, responsive, Hindi and theme behavior | Design system | Not Started |

## 15. Acceptance tests

All tests are **Not Run**; implementation must record actual evidence.

| Test ID | Acceptance criterion | Status |
|---|---|---|
| ADM-INTENT-T01 | Unauthorized user cannot open admin page directly. | Not Run |
| ADM-INTENT-T02 | Unauthorized API/server action/preview/export is rejected. | Not Run |
| ADM-INTENT-T03 | Intent records do not create or mutate canonical categories. | Not Run |
| ADM-INTENT-T04 | Category mapping accepts only existing active A03 category IDs. | Not Run |
| ADM-INTENT-T05 | Phrase mapping requires existing intent and valid locale/script. | Not Run |
| ADM-INTENT-T06 | Duplicate normalized phrase is detected in applicable locale scope. | Not Run |
| ADM-INTENT-T07 | Devanagari phrases survive normalization correctly. | Not Run |
| ADM-INTENT-T08 | Romanized Hindi variants can map to the same intent without duplicate intents. | Not Run |
| ADM-INTENT-T09 | English/Hindi mixed queries return relevant candidates. | Not Run |
| ADM-INTENT-T10 | Typo tolerance does not create unrelated high-confidence matches. | Not Run |
| ADM-INTENT-T11 | Negation/exclusion terms are preserved and respected. | Not Run |
| ADM-INTENT-T12 | Broad ambiguous query does not force an unsupported category. | Not Run |
| ADM-INTENT-T13 | Multi-intent query can return ranked categories or request clarification. | Not Run |
| ADM-INTENT-T14 | Product results include only published/display-eligible products. | Not Run |
| ADM-INTENT-T15 | No product availability or eligibility is inferred from intent mapping alone. | Not Run |
| ADM-INTENT-T16 | Sponsored placement cannot alter organic relevance ranking. | Not Run |
| ADM-INTENT-T17 | Preview is read-only and has no lead/application side effects. | Not Run |
| ADM-INTENT-T18 | Preview explains normalization, mapping and ranking outcome. | Not Run |
| ADM-INTENT-T19 | Draft changes do not affect public search before publication. | Not Run |
| ADM-INTENT-T20 | Publish/rollback preserves version history and audit. | Not Run |
| ADM-INTENT-T21 | SEO Manager cannot mutate canonical category/product facts or protected ranking settings. | Not Run |
| ADM-INTENT-T22 | Support sees only authorized aggregate diagnostics, not raw personal queries. | Not Run |
| ADM-INTENT-T23 | Oversized/malicious queries are safely rejected or bounded. | Not Run |
| ADM-INTENT-T24 | SQL injection and rendered-content injection are prevented. | Not Run |
| ADM-INTENT-T25 | Search diagnostics minimize and aggregate query data per retention policy. | Not Run |
| ADM-INTENT-T26 | Import preview detects invalid locale, duplicate phrase and unknown category/intent. | Not Run |
| ADM-INTENT-T27 | English/Hindi public labels and examples pass localization review. | Not Run |
| ADM-INTENT-T28 | UI is keyboard accessible, responsive and theme-compatible. | Not Run |

## 16. Open owner decisions

1. Approve the initial intent families/examples in §6 as a starting catalogue, or specify additions/removals.
2. Confirm supported search inputs for MVP: English, Hindi Devanagari and Romanized Hindi/Hinglish are proposed.
3. Confirm whether query analytics may retain raw query text; recommended default is no raw-query retention, only minimized/aggregated diagnostics with a defined retention policy.
4. Confirm whether Admin may publish mappings directly (recommended, consistent with routine Admin authority) while Super Admin retains structural configuration.
5. Approve PostgreSQL full-text + `pg_trgm` as MVP search approach; any dedicated search engine is a later evidence-based decision.

These are proposals, not approved policy. Defaults can be accepted together or changed.

## 17. Definition of Done

Approved intent/mapping structures and search behavior implemented; canonical categories remain separate and unchanged; role permissions enforced server-side; English/Hindi/Romanized Hindi regression suite passes; ambiguity/negation and relevance controls verified; preview has no side effects; aggregate diagnostics meet privacy policy; publication/version/rollback audited; accessibility, responsive, localization and theme checks pass; tracker reflects actual implementation/test status.

**Current outcome:** A09 is documented with 16 implementation tasks and 28 acceptance tests. Owner approval pending. No code or tests started.
