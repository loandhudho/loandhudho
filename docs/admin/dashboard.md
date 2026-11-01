# Admin Dashboard — Page Specification

**Page ID:** ADM-DASH  
**Route:** `/admin`  
**Phase:** 1 — Admin page analysis/specifications  
**Status:** Owner Approved — Ready for implementation planning  
**Priority:** P1  
**Last updated:** 2026-11-02  
**Owner approval:** Approved by owner on 2026-11-02  
**Implementation:** Not started under documentation-first workflow

## 1. Purpose

Give authorized LoanDhudho operators a reliable overview of marketplace operations, data quality and work requiring attention. The dashboard should prioritize actionable work over decorative charts. It must not imply live lender integrations or live financial data when the system only contains manually verified records.

## 2. Primary users and permissions

Proposed roles from the product plan: Super Admin, Editor, Reviewer, Support/Analyst.

**Approved direction: Hybrid dashboard.** All roles receive a common operational overview, while additional widgets and actions are displayed according to role permissions and responsibilities. The common overview must not become a way to expose restricted data: each aggregate, activity item, drill-down and API response must independently enforce the user's authorized scope.

| Capability | Super Admin | Editor | Reviewer | Support/Analyst |
|---|---:|---:|---:|---:|
| View common operational overview | Yes | Yes | Yes | Yes |
| View data-quality and review queues | Yes | Yes | Yes | Read-only, subject to scope |
| View user/role administration metrics | Yes | No | No | No |
| View audit activity | Yes | Limited, subject to approved scope | Limited, subject to approved scope | No by default |
| Open a record | According to entity permission | According to entity permission | According to entity permission | Read-only allowed only for assigned scope |
| See role-specific quick actions/widgets | Admin actions | Content/data maintenance actions | Review/approval actions | Scoped operational/read-only actions |

Role-specific widgets are additive to the common overview, not separate dashboards with inconsistent headline definitions. The exact widget-to-permission mapping must be finalized alongside the shared authorization standard. No sensitive personal/lead information should appear on the dashboard by default.

## 3. Entry points and navigation

- Admin sign-in success redirects to `/admin` unless a safe, authorized return path exists.
- Persistent admin navigation links to all authorized admin modules.
- Dashboard cards link to filtered lists or review queues, never to unauthorized records.
- Direct route access must be protected server-side.

## 4. Proposed information architecture

**Owner-approved first-screen priorities:** products pending review; stale rates, fees and sources requiring verification; and offers nearing expiry. These should receive the strongest visual emphasis in the common overview, subject to each user's authorized data scope.

1. Page heading, current reporting period and last refreshed timestamp.
2. Common operational KPI cards:
   - Active institutions.
   - Published loan products.
   - Products pending review.
   - Rates/fees requiring verification.
   - Active offers and offers nearing expiry.
3. Common action-required summary, scoped to records the current user may access:
   - Drafts awaiting review.
   - Rejected items needing correction.
   - Stale or missing source records.
   - Expiring/expired offers.
4. Role-specific widgets and quick actions:
   - Super Admin: user/role administration and broader audit/operational controls.
   - Editor: assigned drafts, data maintenance and correction work.
   - Reviewer: pending approvals, review workload and rejected items requiring follow-up.
   - Support/Analyst: scoped read-only operational summaries and permitted record lookup.
5. Recent admin activity, limited by role.
6. Data freshness summary by entity type.

Avoid vanity metrics. Every count must have a documented definition, date window and drill-down behavior. A widget must be omitted or replaced with an access-safe state when the role lacks permission; hiding it in the browser is not an authorization control.

## 5. KPI definitions to confirm

| KPI | Proposed definition | Important caveat |
|---|---|---|
| Active institutions | Institutions with active status | Not the same as number of lender partnerships |
| Published products | Products in published status and linked to an active institution/category | Exclude drafts/archived |
| Pending review | Records awaiting reviewer action | Count by entity type and permission |
| Stale financial data | Published rate/fee/source records beyond configured freshness window | Freshness thresholds must be configured and visible |
| Active offers | Offers within validity window and published status | Timezone and end-date inclusivity must be defined |
| Recent activity | Audited admin events in a selected period | Never expose secrets or unnecessary personal data |

## 6. Dashboard content specification — recommended baseline

The following is the product/UX recommendation for the first release. Keep the dashboard operational and action-oriented: prioritize queues and exceptions over large decorative charts. Do not add charts merely to fill space. The same common KPI definitions apply across roles; only permitted data scope and role-specific modules vary.

### 6.1 Common overview — all roles

**Top KPI cards (current state, not date-filtered):**

| Display item | Definition / displayed fields | Interaction |
|---|---|---|
| Products pending review | Count of active product records in a review-required state; optionally show age of oldest item | Opens review queue filtered to pending products, scoped to user |
| Stale financial data | Count of published rate/fee records past their configured verification threshold; show affected products/institutions count separately if reliable | Opens data-quality queue filtered to stale records |
| Offers nearing expiry | Published offers within the configured warning window; show count and nearest expiry date | Opens offers list sorted by expiry |
| Published loan products | Published products linked to active institutions and categories | Opens published products list |
| Active institutions | Institutions with active status | Opens institutions list |

Do not combine stale rates, stale fees and stale sources into one ambiguous number unless the underlying records are deduplicated and the label explains the unit. Prefer a primary stale-record count with a small breakdown by rates, fees and source verification.

**Common sections below the KPI cards:**

- **Needs attention:** a compact prioritized list of pending reviews, stale financial records and expiring offers. Each row should show entity, issue, age/due date, assigned owner (only if permitted), and a direct authorized action.
- **Data quality snapshot:** counts of missing source URL, missing last-verified date, expired validity period, and incomplete required fields. Show only checks that have explicit validation rules.
- **Recent activity:** latest permitted admin events with actor display name, action, entity, timestamp and outcome. Never include secrets, credentials, full lead data or unnecessary personal details.
- **Last updated:** per-section refresh time and freshness/caching label; do not imply real-time updates if aggregates are cached.

### 6.2 Role-specific modules

| Role | Additional data items | Recommended chart or visualization | Primary actions |
|---|---|---|---|
| Super Admin | Active/disabled admin accounts; pending invitations; role distribution; failed sign-in/security events as counts; audit events by action; system data-quality totals across all authorized business records | 1. Admin activity trend (daily event count over selected period); 2. Data freshness by entity type (rates, fees, offers, institutions/products) as a horizontal bar; 3. Admin accounts by role as a small donut only when there are enough accounts to make it meaningful | Manage users/roles; inspect audit log; configure freshness thresholds; open system-wide data-quality queues |
| Editor | Assigned drafts; records returned for correction; records missing required data/source evidence; edits awaiting review; own recently updated records | 1. My work by status (draft, returned, submitted, published) as a horizontal stacked bar; 2. My work updated over time as a compact trend only if the history is reliable | Continue draft; fix returned record; add source/verification details; submit for review |
| Reviewer | Pending review count; oldest pending age; items due/overdue against configured SLA; approved/rejected counts; review decisions by entity type; workload assigned to reviewer | 1. Review queue age buckets (e.g. under 1 day, 1–3 days, over 3 days) as horizontal bars; 2. Review outcomes over selected period as a stacked bar; 3. Pending items by entity type | Open next item; approve/reject with reason; request correction; filter queue by age/type |
| Support/Analyst | Read-only counts for assigned/supported scope; institution/product/offer publication status; stale-data exceptions requiring escalation; permitted system notices; recent non-sensitive operational events | 1. Publication coverage by category or institution only when scope and data completeness make comparison valid; otherwise use a sortable summary table rather than a chart | Search permitted records; view product/institution details; copy public reference/link; raise an internal escalation if that workflow is approved |

Role-specific widgets must be driven by permissions, not merely a role-name check. A user may have a custom permission set or multiple roles; the effective permission set determines what appears.

### 6.3 Chart rules and data contracts

- Every chart must state its metric, period, unit, scope and last-updated time. Provide an accessible table/list equivalent.
- Use line charts for time trends, horizontal bars for category/age comparisons, and stacked bars for workflow status. Use a donut only for a small, mutually exclusive composition such as admin role distribution; never use it for precise comparisons.
- Default trend window: last 30 days, with 7-day and 90-day options where event history supports them. This date selector affects activity/trend widgets only, not current-state KPI cards.
- Review-age buckets and stale-data age buckets must be configurable and consistently defined. Do not hardcode an SLA before the business owner approves one.
- Never infer missing dates or freshness. Records without verification timestamps must be shown as “missing verification date,” not silently treated as fresh.
- Do not show percentages without a defined denominator. Show “not enough data” rather than misleading percentages or empty charts.
- Hide or replace a chart with a clear empty state when there are too few records or insufficient history.
- All chart drill-downs must preserve filters and reapply server-side authorization.

### 6.4 Explicit exclusions for the first release

- No revenue, commission, conversion, lender approval-rate or ROI charts until the business model, event tracking and data definitions are approved.
- No individual employee performance ranking or productivity leaderboard.
- No lead-level personal data, borrower details, contact information or loan application information on the dashboard.
- No real-time lender/API health chart unless integrations exist and expose verified health telemetry.
- No predictive forecasts or AI-generated operational scores.

## 7. Functional requirements

- Aggregate counts from authoritative database state; do not hardcode dashboard numbers.
- Display clear zero-data states for a new installation.
- Provide loading skeletons and a recoverable error state if an aggregate query fails.
- Display last-refreshed time and explain whether figures are live, cached or delayed.
- KPI drill-down preserves relevant filters.
- Respect role-based data scope in both aggregate queries and destination pages.
- Date behavior follows the approved split: operational KPIs show current all-time state; recent activity has its own selectable date range; offers are evaluated using their validity dates.
- Date/time calculations use the configured business timezone (to be finalized in the shared settings standard) and clearly label displayed periods.
- Avoid exposing lead-level personal data or sensitive admin account data.
- Quick actions must be permission-gated on server and client.
- Dashboard must work on mobile, tablet and desktop in English/Hindi and light/dark themes.
- Common KPIs must retain consistent definitions across roles; role-specific widgets must be additive and permission-scoped.
- Server endpoints must independently authorize every widget's data request, regardless of whether its UI is rendered.

## 7. Out of scope for this page

- Editing institutions, products, rates, fees or offers directly on dashboard.
- Lead routing or lead transmission.
- Financial performance/revenue reporting before a revenue model is approved.
- Claims of real-time lender APIs or bank integrations.
- Predictive/AI recommendations without a separately approved data and evaluation plan.

## 8. Data and dependencies

Required sources:
- Financial institution status.
- Loan product publication status.
- Review status/work queue.
- Rate, fee and source verification timestamps.
- Offer status and validity.
- Audit events.
- Role/permission definitions.

Dependencies:
- Confirmed admin role and permission matrix.
- Shared admin shell and navigation.
- Defined record lifecycle/review states.
- Data freshness policy and configurable thresholds.
- Audit event schema.
- Query performance strategy for aggregate counts.

## 9. Tasks

| Task ID | Priority | Task | Dependency | Status |
|---|---|---|---|---|
| ADM-DASH-001 | P1 | Confirm dashboard audiences and role-specific visibility (hybrid model selected) | Owner decision | Resolved — Approved Direction |
| ADM-DASH-002 | P1 | Approve KPI definitions, reporting period and timezone behavior | Owner decision | Resolved — priorities and split date behavior approved; timezone convention to be standardized globally |
| ADM-DASH-003 | P1 | Define dashboard wireframe and responsive information hierarchy | 001, 002 | Owner-reviewed — wireframe direction accepted; content specification documented |
| ADM-DASH-004 | P1 | Define aggregate query/data contracts, marketplace coverage metrics and freshness calculations | Data governance | Documented — proposed contracts/defaults recorded; shared data standard to be owner-reviewed |
| ADM-DASH-005 | P1 | Specify empty/loading/error/partial-data states | 003, 004 | Documented |
| ADM-DASH-006 | P1 | Define drill-down routes and filter preservation | Admin page inventory | Documented — proposed route contract; align during page specs |
| ADM-DASH-007 | P1 | Complete permission, privacy and audit threat review | Authorization standard | In Progress — dashboard guardrails documented; shared authorization review pending |
| ADM-DASH-008 | P1 | Finalize acceptance tests and obtain owner approval | 001–007 | Awaiting Owner Approval — documentation baseline complete; shared standards remain dependencies |
| ADM-DASH-009 | P1 | Implement approved dashboard | 008 approved | Not Started |
| ADM-DASH-010 | P1 | Execute unit, integration, RBAC, responsive and E2E tests; record evidence | 009 | Not Started |

## 10. Acceptance criteria and test plan

| Test ID | Scenario | Expected result | Status |
|---|---|---|---|
| ADM-DASH-T01 | Authorized admin opens dashboard | Common overview loads with only permitted role-specific widgets/data | Not Run |
| ADM-DASH-T02 | Unauthenticated user opens `/admin` | Redirect/deny according to approved auth policy; no dashboard data leaks | Not Run |
| ADM-DASH-T03 | User without a widget permission requests its data endpoint | Server denies access; no sensitive aggregate is returned | Not Run |
| ADM-DASH-T04 | Fresh database contains no records | Meaningful zero/empty states; no fabricated counts | Not Run |
| ADM-DASH-T05 | KPI is selected | Correct destination opens with matching filters and count definition | Not Run |
| ADM-DASH-T06 | Stale rate/source exists | It is counted according to approved freshness rule and can be drilled into | Not Run |
| ADM-DASH-T07 | Offer crosses expiry boundary | KPI changes according to approved timezone/end-date rule | Not Run |
| ADM-DASH-T08 | Aggregate query fails | Recoverable error appears; no misleading zero is shown as real data | Not Run |
| ADM-DASH-T09 | Mobile viewport and keyboard navigation | Content remains usable; focus order and labels are accessible | Not Run |
| ADM-DASH-T10 | English/Hindi and light/dark modes | Labels, dates and visual tokens remain correct in all combinations | Not Run |
| ADM-DASH-T11 | Recent activity includes sensitive metadata | Secret/credential fields are not rendered or exposed | Not Run |
| ADM-DASH-T12 | Refresh timestamp shown | Timestamp and cache/freshness meaning are accurate | Not Run |
| ADM-DASH-T13 | Each role opens the dashboard | All roles see the common overview; only permitted role-specific widgets/actions appear | Not Run |
| ADM-DASH-T14 | User calls a restricted widget endpoint directly | Server rejects the request even if the user manually constructs the request | Not Run |

All tests remain Not Run until implementation exists and execution evidence is recorded.

## 11. Definition of Done

- Owner-approved role visibility and KPI definitions.
- Responsive wireframe and all UI states documented.
- Data contracts and freshness semantics documented.
- Server-side authorization and privacy review complete.
- P0/P1 acceptance tests pass with recorded evidence.
- Lint, typecheck, relevant unit/integration tests, Playwright flows and production build pass.
- Master tracker reflects actual status and remaining limitations.

## 12. Dashboard data contracts, thresholds and operational states

### 12.1 Marketplace coverage and comparison-readiness metrics

LoanDhudho's core inventory is a lender-to-product catalog: institutions (banks and NBFCs), their loan products, product-specific rates and charges, eligibility terms, and offers. The dashboard should help operators build breadth while protecting data quality. It must never reward raw record volume at the expense of accuracy.

Add a **Marketplace coverage** panel, visible to roles with the relevant catalog permissions:

| Measure | Definition | Breakdown / drill-down |
|---|---|---|
| Institutions in directory | Distinct institutions with a directory record, split by active, onboarding/incomplete, inactive | Institution list with status |
| Institutions with published products | Distinct active institutions linked to at least one published product | Institution list filtered to no published products / has products |
| Product catalog coverage | Published products by loan category and institution; show unpublished/draft separately | Category and product queues |
| Rate coverage | Published products with at least one current, source-backed rate record / published products requiring a rate | Missing-rate and rate-review queues |
| Fee coverage | Published products with required fee/charge disclosures / products where fee data is required | Missing-fee and fee-review queues |
| Source verification coverage | Published rates/fees with source URL and last-verified timestamp | Missing-source and stale-source queues |
| Comparison readiness | Products meeting required comparison-field completeness for their category | Comparison-readiness exceptions by category |

Coverage ratios must show numerator and denominator (for example, “42 of 60 published home-loan products have a current rate”), not a percentage alone. Category-specific required fields must be configured; do not assume every loan type has identical rate, fee or eligibility fields. Do not count an institution as a lender partner unless a verified partnership relationship exists.

**Category-specific comparison readiness:** for a home loan, likely fields include interest-rate type (fixed/floating/mixed), published rate or range, benchmark/spread where disclosed, tenure range, processing fee, other material charges, eligibility highlights, source, verification date and effective date. Other product categories may require different fields. These are data-quality requirements, not a promise that every lender publishes every field. Unknown or undisclosed values must be represented explicitly as “not disclosed” or “not available,” never inferred.

### 12.2 Core data contracts for dashboard aggregates

All dashboard queries should derive from canonical records and share stable definitions with the catalog pages.

- **Institution:** stable ID, legal/display name, institution type (bank/NBFC/other regulated lender as verified), status, source/evidence, created/updated timestamps.
- **Loan product:** stable ID, institution ID, category ID, product name, lifecycle status, publication status, required-field profile, review status.
- **Rate record:** product ID, rate value or range, rate type, applicable benchmark/spread if sourced, effective-from/to, source URL, last-verified-at, verification status, record status.
- **Fee record:** product ID, fee type, amount/value and unit, applicability/conditions, effective dates, source URL, last-verified-at, verification status, record status.
- **Offer:** institution/product association, validity start/end, publication status, source/evidence, last verified timestamp.
- **Review item:** entity type/ID, state, assigned reviewer, submitted-at, decision-at, reason/correction metadata.
- **Audit event:** actor ID, action, entity type/ID, timestamp, outcome, safe metadata allowlist.
- **Consent/lead:** not part of dashboard aggregates in this phase; any future lead metrics require separately approved lawful purpose, consent, retention and role access.

Every metric response should include: metric key, count/value, unit, scope, calculation/as-of timestamp, applied filters and data freshness metadata. For ratios, include numerator and denominator. Avoid one dashboard query that returns fields the requesting role is not permitted to see.

### 12.3 Freshness policy and configurable defaults

Use configurable policies by data type, not one blanket stale threshold. Initial defaults below are **proposed starting values only**, not approved business SLAs or a claim about lender update frequency. They must be adjustable in admin settings and shown in the data-governance standard.

| Data type | Proposed review reminder | Stale classification | Notes |
|---|---:|---:|---|
| Interest rates | 90 days since last verification | 180 days | Age alone does not imply a rate change; use event-triggered re-verification |
| Fees and charges | 60 days | 90 days | Recheck when product terms/source change |
| Offers | 7 days before expiry | At validity end, or source invalidation | Expiry is separate from verification age |
| Institution profile | 180 days | 365 days | Verify status/name/source; material changes trigger immediate review |
| Product terms/eligibility | 90 days | 180 days | Category-specific; high-impact changes trigger immediate review |

Rules:
- Missing verification timestamp is a separate **Unverified** state, not “fresh” and not automatically the same as “stale.”
- A source URL missing on a published material financial claim is a publication-blocking data-quality exception.
- Expired effective dates/offer validity are evaluated independently of last verification time.
- A material source change, lender notice or user-reported correction can trigger immediate re-review regardless of age.
- Preserve previous values and effective periods; updates must not silently overwrite historical rate/fee facts.
- Display “last verified” and “effective from” separately.
- Store timestamps in UTC; display operational dates in IST (Asia/Kolkata) unless the product-wide timezone standard is explicitly revised. Date-only offer end dates should be inclusive through the end of the displayed IST date; implement this consistently and test boundary conditions.
- Thresholds should be configurable by authorized Super Admins, validated to prevent nonsensical values, audited on change, and never silently alter historic audit facts.

### 12.4 Review-age and offer-warning defaults

- Reviewer age buckets: under 1 day, 1–3 days, 3–7 days, over 7 days. These are visualization buckets, not a committed service-level agreement.
- Until a review SLA is approved, label items by age only; do not mark them “overdue” or show an SLA-breach KPI.
- Proposed offer warning window: 7 calendar days before expiry, configurable. Expired offers must be removed from active/public states according to the offer lifecycle rules.
- All boundary calculations use the same IST business-date convention and are covered by tests.

### 12.5 Loading, empty, error and partial-data states

| State | Required behavior |
|---|---|
| Initial loading | Skeletons preserve page hierarchy; announce loading state accessibly; avoid flashing zero values |
| No catalog data | Explain that institutions/products have not yet been added; show authorized setup action |
| No pending reviews | Show a clear “Nothing awaiting review” state, not an empty chart |
| No rates/fees yet | Distinguish missing data from stale data; link to the appropriate catalog/data-quality queue |
| No activity history | Explain that activity appears after audited actions; do not fabricate a trend |
| Partial widget failure | Keep successful widgets visible; mark only failed widget unavailable with retry; do not present failure as zero |
| Full page/data failure | Show recoverable error, safe retry and support reference; no stack traces or sensitive query details |
| Permission denied | Omit unauthorized widget or show a neutral access message where appropriate; endpoint must still deny server-side |
| Stale cached aggregate | Show its as-of time and stale/cache label; never imply current/live data |
| Insufficient chart sample | Replace chart with concise explanatory empty state or table |

### 12.6 Drill-down route and filter contract

Use the following proposed routes, aligning names with the page inventory and final route convention:

| Dashboard item | Destination | Preserved filter intent |
|---|---|---|
| Active institutions / no products | `/admin/institutions` | status, hasPublishedProducts |
| Published products / pending product review | `/admin/loan-products` | publicationStatus, reviewStatus, categoryId, institutionId |
| Stale/missing rates | `/admin/rates` | verificationStatus, stale, missingSource, productId, institutionId |
| Stale/missing fees | `/admin/fees` | verificationStatus, stale, missingSource, productId |
| Offers nearing expiry | `/admin/offers` | status, expiresBefore, validityStatus |
| Category coverage / comparison readiness | `/admin/loan-products` | categoryId, comparisonReadiness |
| Review age / outcomes | Relevant entity queue or `/admin/reviews` (route to be finalized) | reviewStatus, ageBucket, entityType, assignedReviewer |
| Admin users/roles | `/admin/users` | status, role |
| Audit activity | `/admin/audit-logs` | action, entityType, dateRange |
| Leads | No dashboard destination in this phase | Deferred pending legal/compliance approval |

Filter parameters must be allowlisted, validated, shareable only where safe, and re-authorized by the destination. Do not place personal data, tokens or sensitive values in URLs. If a destination route is not yet implemented, keep the widget non-clickable or route to a documented safe placeholder rather than a broken link.

### 12.7 Permission and privacy guardrails

- Common marketplace counts may be visible to all authenticated admin roles only if the underlying business policy permits the same aggregate scope. Otherwise apply institution/category/team scope consistently.
- Super Admin may view global catalog coverage, system configuration and audit summaries.
- Editor sees assigned/authorized institutions, products, rates, fees and offers; no user administration or unrestricted audit log.
- Reviewer sees assigned review queues and the minimum record/source context needed to make a decision; no unrelated borrower/lead data.
- Support/Analyst sees scoped read-only catalog and publication information; no rate/fee editing, approval, user administration or lead details by default.
- Lead data and lead conversion/recipient metrics remain excluded until a dedicated lead specification and legal/compliance approval. If later enabled, require explicit purpose-specific consent, recipient disclosure, least-privilege access, access logging, retention/deletion controls and separate dashboard design.
- Activity metadata must be allowlisted. Never serialize full request bodies, credentials, tokens, bank account details, contact details or free-text lead content into dashboard events.
- Authorization is based on effective permissions and record scope, not only role labels. Enforce at query/service layer and test direct endpoint access.

## 13. Open decisions for product owner

1. **First-screen priorities — approved:** (a) products pending review, (b) stale rates/fees/sources requiring verification, and (c) offers nearing expiry.
2. **Date behavior — approved:** current operational totals are all-time/current-state; recent activity has an independent selectable date range; offer counts use offer validity dates. The business timezone convention will be defined in the shared settings standard.

The hybrid role-visibility direction, first-screen priorities, split date behavior, dashboard content, marketplace coverage metrics, proposed data contracts, configurable freshness defaults, UI states, drill-down filter contract and privacy guardrails are documented. The wireframe direction has been accepted. Proposed freshness thresholds and warning windows are defaults for owner review, not approved SLAs. Final authorization mapping and cross-page data-governance review remain dependencies. No implementation should begin until the owner explicitly approves the completed specification.


## 19. Owner role-model update — 2026-11-02

The owner has defined the four-role model in [authorization.md](../standards/authorization.md). It supersedes the provisional Super Admin / Editor / Reviewer / Support-Analyst labels in Sections 2 and 6.2 above. For implementation, map dashboard widgets as follows:

- **Super Admin:** system-wide marketplace overview, role/permission administration, controlled taxonomies, audit and global data-quality controls.
- **Admin:** operational institution/product/user metrics and queues within delegated permissions; no role-definition or system-taxonomy controls.
- **SEO Manager:** content inventory, drafts/reviews/publications, page freshness and organic/page analytics; no lead PII or edits to verified financial facts.
- **Sales Executive / Support:** assigned-scope product/customer/support and (only after legal approval) lead queues and non-identifying sales analytics. Until that gate, no customer/lead PII widgets.

All common KPI and drill-down data must be permission- and scope-filtered server-side. Replace the old role labels and matrix when the dashboard spec is next comprehensively revised; this addendum is authoritative in the interim.


## 20. Confirmed Admin operational authority — 2026-11-02

The owner confirmed that Admin can add, edit, review, approve and publish institutions, loan products, rates, fees, eligibility data and offers. Dashboard review/publishing queues must therefore be available to Admin according to the effective permission set; do not assume that financial publication requires a separate Reviewer role or second-person approval. Super Admin alone defines role/permission structures and controlled system taxonomies. Keep source evidence, freshness warnings, version history and audit trails visible to authorized operators. This decision supersedes any earlier implication in this specification that Admin publication is only delegated or that a separate approver is mandatory.


## 13. Owner-approved role model alignment — 2026-11-02

The owner-approved four-role model supersedes the provisional Super Admin / Editor / Reviewer / Support-Analyst labels and role examples in earlier sections of this specification. Dashboard widgets and drill-downs must be permission-driven and align to these roles:

- **Super Admin:** system-structure controls, role/permission structures, global configuration and full authorized operational oversight.
- **Admin:** full day-to-day marketplace operations, including institution/product/rate/fee/eligibility/offer creation, review, approval and publication; cannot redefine system structures.
- **SEO Manager:** editorial, SEO, landing-page and content analytics/workflows; cannot alter verified lender facts or financial source-of-truth data.
- **Sales Executive / Support:** assigned-scope customer/support operations and approved product information; lead/customer PII remains disabled until the legal/compliance gate is passed.

The common dashboard overview and role-specific widgets must be calculated from effective permissions and authorized scope, not hard-coded assumptions that an Editor submits and a separate Reviewer approves. Routine marketplace publication by Admin does not require a separate approver. Any dashboard role matrix or widget example elsewhere in this document is subordinate to this addendum and the shared authorization standard.
