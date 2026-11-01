# Admin Dashboard — Page Specification

**Page ID:** ADM-DASH  
**Route:** `/admin`  
**Phase:** 1 — Admin page analysis/specifications  
**Status:** In Analysis  
**Priority:** P1  
**Last updated:** 2026-11-02  
**Owner approval:** Pending  
**Implementation:** Not started under documentation-first workflow

## 1. Purpose

Give authorized LoanDhudho operators a reliable overview of marketplace operations, data quality and work requiring attention. The dashboard should prioritize actionable work over decorative charts. It must not imply live lender integrations or live financial data when the system only contains manually verified records.

## 2. Primary users and permissions

Proposed roles from the product plan: Super Admin, Editor, Reviewer, Support/Analyst.

| Capability | Super Admin | Editor | Reviewer | Support/Analyst |
|---|---:|---:|---:|---:|
| View operational dashboard | Yes | Yes | Yes | Yes |
| View data-quality and review queues | Yes | Yes | Yes | Read-only, subject to scope |
| View user/role administration metrics | Yes | No | No | No |
| View audit activity | Yes | Limited, decision pending | Limited, decision pending | No by default |
| Open a record | According to entity permission | According to entity permission | According to entity permission | Read-only allowed only for assigned scope |

**Open decision:** confirm whether dashboard widgets are identical for all roles or personalized by role. No sensitive personal/lead information should appear on the dashboard by default.

## 3. Entry points and navigation

- Admin sign-in success redirects to `/admin` unless a safe, authorized return path exists.
- Persistent admin navigation links to all authorized admin modules.
- Dashboard cards link to filtered lists or review queues, never to unauthorized records.
- Direct route access must be protected server-side.

## 4. Proposed information architecture

1. Page heading, current reporting period and last refreshed timestamp.
2. Operational KPI cards:
   - Active institutions.
   - Published loan products.
   - Products pending review.
   - Rates/fees requiring verification.
   - Active offers and offers nearing expiry.
3. Action-required queue:
   - Drafts awaiting review.
   - Rejected items needing correction.
   - Stale or missing source records.
   - Expiring/expired offers.
4. Recent admin activity, limited by role.
5. Data freshness summary by entity type.
6. Quick actions, shown only when the user's role permits them.

Avoid vanity metrics. Every count must have a documented definition, date window and drill-down behavior.

## 5. KPI definitions to confirm

| KPI | Proposed definition | Important caveat |
|---|---|---|
| Active institutions | Institutions with active status | Not the same as number of lender partnerships |
| Published products | Products in published status and linked to an active institution/category | Exclude drafts/archived |
| Pending review | Records awaiting reviewer action | Count by entity type and permission |
| Stale financial data | Published rate/fee/source records beyond configured freshness window | Freshness thresholds must be configured and visible |
| Active offers | Offers within validity window and published status | Timezone and end-date inclusivity must be defined |
| Recent activity | Audited admin events in a selected period | Never expose secrets or unnecessary personal data |

## 6. Functional requirements

- Aggregate counts from authoritative database state; do not hardcode dashboard numbers.
- Display clear zero-data states for a new installation.
- Provide loading skeletons and a recoverable error state if an aggregate query fails.
- Display last-refreshed time and explain whether figures are live, cached or delayed.
- KPI drill-down preserves relevant filters.
- Respect role-based data scope in both aggregate queries and destination pages.
- Date filters use a consistent timezone convention and clearly label the selected period.
- Avoid exposing lead-level personal data or sensitive admin account data.
- Quick actions must be permission-gated on server and client.
- Dashboard must work on mobile, tablet and desktop in English/Hindi and light/dark themes.

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
| ADM-DASH-001 | P1 | Confirm dashboard audiences and role-specific visibility | Owner decision | Awaiting Decision |
| ADM-DASH-002 | P1 | Approve KPI definitions, reporting period and timezone behavior | Owner decision | Awaiting Decision |
| ADM-DASH-003 | P1 | Define dashboard wireframe and responsive information hierarchy | 001, 002 | Not Started |
| ADM-DASH-004 | P1 | Define aggregate query/data contracts and freshness calculations | Data governance | Not Started |
| ADM-DASH-005 | P1 | Specify empty/loading/error/partial-data states | 003, 004 | Not Started |
| ADM-DASH-006 | P1 | Define drill-down routes and filter preservation | Admin page inventory | Not Started |
| ADM-DASH-007 | P1 | Complete permission, privacy and audit threat review | Authorization standard | Not Started |
| ADM-DASH-008 | P1 | Finalize acceptance tests and obtain owner approval | 001–007 | Not Started |
| ADM-DASH-009 | P1 | Implement approved dashboard | 008 approved | Not Started |
| ADM-DASH-010 | P1 | Execute unit, integration, RBAC, responsive and E2E tests; record evidence | 009 | Not Started |

## 10. Acceptance criteria and test plan

| Test ID | Scenario | Expected result | Status |
|---|---|---|---|
| ADM-DASH-T01 | Authorized admin opens dashboard | Dashboard loads with only permitted widgets/data | Not Run |
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

All tests remain Not Run until implementation exists and execution evidence is recorded.

## 11. Definition of Done

- Owner-approved role visibility and KPI definitions.
- Responsive wireframe and all UI states documented.
- Data contracts and freshness semantics documented.
- Server-side authorization and privacy review complete.
- P0/P1 acceptance tests pass with recorded evidence.
- Lint, typecheck, relevant unit/integration tests, Playwright flows and production build pass.
- Master tracker reflects actual status and remaining limitations.

## 12. Open decisions for product owner

1. **Who should see the dashboard?** Should all four proposed roles (Super Admin, Editor, Reviewer, Support/Analyst) see the same dashboard, or should widgets differ by role?
2. **Which three priorities matter most on the first screen?** Suggested starting set: (a) products pending review, (b) stale rates/fees/sources, (c) expiring offers. Other candidates: institution/product totals, recent admin activity, search/content health.
3. Should dashboard metrics default to **all-time current totals** with a selectable date range for activity, or should all widgets share one date filter?

No implementation should begin until these decisions are resolved and the page specification is approved.
