# LoanDhudho — Admin Audit Logs

**Page ID:** A14 / ADM-AUDIT  
**Route:** `/admin/audit-logs`  
**Priority:** P0 for secure admin launch  
**Status:** Owner Approved — policy-specific gates remain  
**Implementation status:** Not Started  
**Test status:** Not Run  
**Last updated:** 2026-11-02

## 1. Purpose

Provide a trustworthy, searchable, tamper-evident record of security-relevant and business-critical activity across the LoanDhudho admin platform. Audit Logs help investigate mistakes, unauthorized access, data disputes, operational changes and security incidents.

The audit system is a control plane, not an ordinary application activity feed. Events must be generated server-side, written reliably, protected from alteration, and retained under an approved policy. The UI must never imply that an event was recorded if durable persistence failed.

## 2. Goals and non-goals

### Goals
- Record who or what performed an action, what happened, when, to which target, from which authenticated context, and whether it succeeded.
- Capture material before/after changes for supported business records without exposing secrets or unnecessary personal data.
- Record authorization denials, account/security lifecycle events, sensitive reads and exports where configured.
- Support scoped search, filtering, event detail, investigation and controlled export.
- Preserve event integrity, ordering metadata, provenance and retention/deletion evidence.
- Provide monitoring for audit pipeline health, gaps, unusual activity and privileged actions.

### Out of scope
- A general-purpose analytics/event-tracking platform or user behavior replay.
- Raw HTTP request/response dumps, keystroke capture, session recording or full database snapshots.
- Storing passwords, authentication tokens, OTPs, PINs, recovery codes, API secrets, payment credentials or full sensitive documents.
- Lead/customer PII workflows. A12 remains deferred; any future lead-related audit events must follow the separate legal/compliance gate and minimization policy.
- Editing, deleting or manually inserting audit events through the admin UI.
- Treating an audit log as a substitute for database backups, security monitoring or incident response.

## 3. Users, roles and permissions

Use the four owner-defined roles and the effective permission resolver from the shared authorization standard. Role names alone never grant access.

| Role | Expected access |
|---|---|
| Super Admin | Search and inspect all permitted audit events; access integrity/retention health and privileged security events. |
| Admin | Search operational marketplace and user-administration events within configured scope; inspect details needed for operational investigations. |
| SEO Manager | View content/SEO-related events only where explicitly granted; no access to unrelated security or financial-record details by default. |
| Sales Executive / Support | Own-action or assigned-scope events only where explicitly granted; no customer/lead PII access before the legal gate. |

Candidate permission keys (proposed; final catalogue belongs to Super Admin):
- `audit.view`
- `audit.view_security_events`
- `audit.view_sensitive_metadata`
- `audit.export`
- `audit.view_integrity_status`
- `audit.manage_retention_policy` (Super Admin-only configuration surface; retention execution must be system-controlled and audited)

Requirements:
- Enforce authorization, scope and field redaction server-side on page loads, APIs, exports and background jobs.
- Deny by default. Filtered results must not leak counts, target names or metadata outside the viewer's scope.
- Separate permission to view an event from permission to see sensitive metadata or export it.
- No admin role may edit or erase event records. Retention-policy configuration is separate from event mutation.
- Admin cannot define permission keys, event schemas, retention structures or global security policy.
- A user must not gain access to an event solely because they are its actor; own-action visibility is permission- and scope-controlled.
- Record access to sensitive audit details and audit exports as new audit events, avoiding recursive payload expansion.

## 4. Event taxonomy

Every event has a stable event type and category. Super Admin owns the controlled taxonomy and schema; application modules emit only registered event types. New types require schema/catalogue governance, not ad hoc free-text labels.

### Initial event categories

| Category | Examples | Minimum capture |
|---|---|---|
| Authentication | Sign-in success/failure, sign-out, MFA challenge/result, invitation acceptance, password reset completion (never secret) | Actor/account reference, outcome, timestamp, auth method class, correlation ID |
| Authorization | Permission denied, scope denied, privileged action blocked, delegation ceiling blocked | Actor, permission key, resource type/reference where safe, outcome, policy version |
| User and access administration | Invite, resend/revoke invite, role/permission grant or removal, suspend/reactivate/deactivate, session revoke | Acting user, affected user, changed role/permission identifiers, reason, outcome |
| Institution records | Create/edit/approve/publish/unpublish/archive/restore | Institution ID, changed field names, safe before/after values, source/revision reference |
| Loan products and categories | Create/edit/assign/status changes/publish/unpublish | Product/category IDs, changed fields and version references |
| Rates and history | Create/edit/verify/approve/publish/correct/withdraw/import | Product/rate IDs, rate version, changed financial values, effective dates, source evidence reference |
| Fees and charges | Create/edit/verify/approve/publish/withdraw/import | Product/fee IDs, fee version, changed fee values and conditions |
| Eligibility | Create/edit/approve/publish/withdraw | Product/rule IDs, rule version and changed criteria |
| Offers | Create/edit/approve/publish/schedule/expire/withdraw | Offer/product IDs, benefit/validity changes and linked baseline versions |
| SEO and content | Draft/edit/review/approve/schedule/publish/unpublish/archive, slug/redirect/metadata change | Content ID/version, locale, changed fields |
| Search configuration | Intent/phrase mapping create/edit/approve/publish, controlled search configuration changes | Mapping ID/version, locale and category references |
| Data import/export | Import preview, validation failure, commit, export request/completion/failure | Job ID, dataset, counts, initiator, outcome; no raw row dumps |
| Audit administration | Audit search/detail access when sensitive, export, retention-policy change, integrity alert acknowledgement | Actor, action, query/filter fingerprint where appropriate, policy change and reason |
| System operations | Background job failure, audit write failure, integrity verification result, clock/configuration anomaly | Service identity, job/run ID, outcome, trace/correlation ID |

Do not log every harmless page view by default. Sensitive reads, exports and privileged inspection should be explicitly classified and configured. A future lead/customer domain must not be enabled by this taxonomy alone.

## 5. Event data contract

Minimum immutable event envelope:
- `event_id`: globally unique, non-reusable identifier.
- `event_type`, `category`, `schema_version`: registered values.
- `occurred_at`: source event time in UTC.
- `recorded_at`: durable audit-store acceptance time in UTC.
- `actor_type`: staff user, system/service, scheduled job or integration identity.
- `actor_id`: stable internal identifier; do not rely on mutable display name.
- `actor_role_snapshot` and/or effective permission context reference: capture the relevant role/permission state at event time, with a policy/version reference.
- `action`, `outcome`: controlled action and success/failure/denied/partial status.
- `target_type`, `target_id`: stable target reference where applicable.
- `changed_fields`: allowlisted field names, not arbitrary object dumps.
- `before` / `after`: field-level, type-safe, redacted snapshots for material mutations; omit unchanged fields.
- `reason`: required for designated high-risk actions; length-limited and sanitized.
- `source_reference`: related source/evidence/version/import/job reference where relevant.
- `request_id`, `correlation_id`, `job_id`: trace related operations without exposing request secrets.
- `ip_address` and `user_agent`: optional, access-restricted security metadata; retention and use require privacy approval.
- `session_reference`: opaque identifier only, never a session token.
- `application_version`, `environment`, `service_identity`: operational provenance.

Use typed structured fields, not a single opaque JSON blob. Store money/rates/percentages with explicit units and preserve precision. Normalize timestamps to UTC; display in IST. Record both event time and persistence time to expose delayed writes or clock skew.

### Before/after rules
- Allowlist fields by entity and event type. Never serialize whole ORM entities or request bodies.
- Financial changes should capture exact old/new values, units, conditions, effective dates and version references where material.
- For content changes, capture changed field names and revision references; avoid copying entire article bodies into audit events.
- For permission changes, capture permission identifiers and scope changes, not authentication secrets.
- Large changes use a bounded summary plus immutable version/diff reference.
- Redact or tokenize sensitive identifiers before persistence; do not store personal data merely because it appeared in a changed record.
- If a value is suppressed, record a redaction marker/reason rather than silently implying it was unchanged.

## 6. Write path, reliability and integrity

- Generate events in trusted server-side application/service code, never from client-supplied event payloads.
- For critical business mutations, persist the business change and corresponding audit/outbox record atomically in one database transaction. A durable outbox/worker may deliver to a separate append-only audit store.
- Do not report a critical mutation as successful until its audit record is durably committed or safely enqueued in the same transaction.
- If the audit pipeline is unavailable, fail closed for privileged/security-sensitive mutations where an audit gap would be unacceptable. Read-only, low-risk actions may degrade only under an explicitly approved policy and must raise an operational alert.
- Use idempotency keys/event IDs to prevent duplicate records on retries. Preserve original occurrence time and record retry metadata separately.
- Enforce append-only database permissions: application roles may insert and read according to policy, but cannot update/delete audit rows. No ordinary admin UI or application service may mutate existing events.
- Use database constraints, restricted service accounts, encrypted transport/storage and separately controlled backups.
- Add tamper-evidence using a documented integrity mechanism (for example, chained hashes or periodic signed batch manifests) and independently stored verification checkpoints. Hashes alone do not prevent privileged database alteration; protect keys/checkpoints separately and test restoration/verification.
- Maintain sequence/partition metadata and detect gaps, duplicates, out-of-order arrivals and clock anomalies. Do not claim global total ordering across distributed services; use per-stream sequence plus timestamps/correlation IDs.
- Verify integrity periodically and after restore/migration. Alert on mismatch or missing checkpoint.
- Record audit-system configuration changes and access to integrity material through a separate protected security channel where feasible.

## 7. Search, filters and event detail

### List view
- Default newest-first by `recorded_at`; stable cursor pagination, not offset-only pagination for large datasets.
- Search by event ID, actor identifier/display label, target identifier, event type, category, request/correlation ID and approved reason text.
- Filters: date/time range, category, event type, actor, actor type, target type/ID, outcome, source module, environment and high-risk flag.
- Date/time input interpreted in IST and converted to UTC; show the active timezone.
- Sort only by approved indexed fields; never allow arbitrary client-selected SQL/order expressions.
- Display event time, actor, action/event, target, outcome and category. Show redacted state where details are restricted.
- Empty state explains no matching events; error state preserves filters and offers safe retry; loading state uses skeletons; permission-denied state does not reveal whether restricted events exist.

### Detail view
- Show immutable event ID, occurred/recorded timestamps, actor and role snapshot, event type/schema version, action/outcome, target, source/version references, request/correlation IDs and safe before/after diff.
- Clearly distinguish “not captured”, “redacted”, “not applicable” and empty values.
- Provide copyable event ID and safe trace references.
- No edit/delete controls. Any permitted acknowledgement/annotation must be a separate append-only event and must not modify original evidence.
- Avoid exposing internal stack traces, tokens, secrets, raw IP/user-agent or restricted metadata to users without specific permission.

## 8. Export

- CSV export is P1 only after owner approval of field set, retention and access policy; JSONL may be considered for controlled technical investigations.
- Export must use exactly the same server-side authorization, scope and redaction as the UI; no hidden columns or bypass through export endpoints.
- Require a bounded date range and result limit; large exports run asynchronously with status and expiry.
- Permission-gated export, reason capture for sensitive/high-volume exports, and step-up authentication for high-risk scopes are recommended.
- Audit request, generation, download/access and failure as separate events. Export artifacts must be encrypted, access-controlled, short-lived and automatically expired.
- Include export generation time, timezone, applied filters, schema version and redaction notice.
- Never export secrets, credentials, full session identifiers or unapproved customer/lead PII.
- Prevent spreadsheet formula injection in CSV cells (prefix/escape dangerous leading formula characters).
- Do not email audit exports as attachments by default.

## 9. Retention, archival and deletion

Retention periods are legal/security policy decisions and are not yet approved. Do not hard-code a guessed universal period.

Proposed policy model:
- Separate retention classes for authentication/security events, privileged access changes, financial-record mutations, content operations, routine operational events, and system diagnostics.
- Define minimum online-search period, archive period, total retention, legal-hold behavior, deletion/cryptographic-erasure method and backup expiry per class.
- Preserve audit evidence needed for financial-data history and dispute resolution consistently with approved legal requirements.
- Retention execution is automated, policy-driven and independently logged; ordinary admins cannot delete or shorten retention.
- Legal hold suspends scheduled expiry for specified records with documented authority, reason, scope and review date.
- Purge/expiry must be verifiable, bounded, and itself produce a protected retention event/manifest. Avoid recursive infinite audit writes.
- Backups and replicas must follow the same retention and deletion commitments; document realistic expiry behavior.
- Support data-subject requests only through approved privacy/legal procedures; do not silently rewrite immutable events. Apply approved redaction, tokenization or restricted-access procedures with a separate traceable event if legally required.
- Retention policy edits require Super Admin authority, re-authentication, reason, before/after policy versions and a security alert; any two-person approval requirement remains an owner/security decision.

## 10. Monitoring and incident response

Monitor and alert on:
- Audit write failures, outbox backlog/age, delayed persistence and dropped/retried events.
- Integrity hash/checkpoint mismatch, sequence gaps, duplicate spikes and clock skew.
- Repeated authentication failures, permission denials, blocked privilege escalation and suspicious session revocations.
- Role/permission changes, Super Admin grants/removals, user deactivation and unusual privileged activity.
- High-volume or unusual audit searches/exports and access outside expected scope.
- Retention-policy changes, legal holds, purge jobs and unexpected retention failures.

Alerts must avoid including secrets or full sensitive payloads. Route alerts to a separately controlled monitoring channel; an attacker with admin UI access must not be able to suppress all evidence of their activity. Define severity, on-call owner, acknowledgement, escalation and incident runbook before production launch.

## 11. API and service behavior

Candidate endpoints (final API conventions belong to the shared API standard):
- `GET /api/admin/audit-events`: scoped, filtered cursor-paginated search.
- `GET /api/admin/audit-events/{eventId}`: permission-checked detail.
- `POST /api/admin/audit-exports`: request an authorized export.
- `GET /api/admin/audit-exports/{exportId}`: export status/download authorization.
- Internal-only event writer/outbox processor and integrity-verification jobs; never expose a public event-ingestion endpoint.

All inputs are schema-validated and bounded. Use parameterized queries, allowlisted filters/sorts, safe error responses and request correlation IDs. Return consistent 400/401/403/404/409/422/429/5xx behavior without disclosing restricted event existence. Avoid IDOR by rechecking event scope on every detail/download request.

## 12. Accessibility, responsive behavior and localization

- Table/list usable with keyboard, screen readers and visible focus; semantic column headers and announced filter/result changes.
- Do not rely on color alone for outcome or risk indicators.
- On mobile, use stacked event summaries and a readable detail panel; retain all filter functions without horizontal page overflow.
- English (`en-IN`) default and Hindi (`hi-IN`) labels, dates, number formats and status descriptions. Event type identifiers remain locale-neutral; human-readable labels are localized.
- Display timestamps in IST with explicit timezone; retain UTC in storage/export metadata.
- Support light/dark themes with semantic contrast tokens; avoid conveying severity by color alone.

## 13. Privacy and security requirements

- Data minimization and allowlisted payloads are mandatory.
- Never record passwords, OTPs, PINs, API keys, bearer/session tokens, recovery codes, payment credentials or raw authentication headers.
- Avoid full request bodies, uploaded documents, lead/customer contact details and financial account identifiers.
- Restrict IP address, user-agent and other device metadata; collect only with approved purpose and retention.
- Sanitize control characters and untrusted text to prevent log injection, HTML injection and misleading line breaks.
- Protect against log forging, event spoofing, cross-tenant/scope leakage, export abuse, IDOR and privilege escalation.
- Separate audit data access from audit event creation permissions.
- Keep encryption keys, signing keys and integrity checkpoints outside the ordinary audit database and access path.
- Security testing must include privileged insider and compromised-admin scenarios.

## 14. Dependencies and implementation sequence

1. Owner approval of this page scope and open decisions.
2. Approval of shared authorization standard and final permission/scope catalogue.
3. Shared API/error conventions and database/data-governance decisions.
4. Admin shell/navigation and authentication/session foundation.
5. Define event registry/schema versioning and redaction policy.
6. Implement transactional outbox/event writer and append-only storage.
7. Implement scoped search/detail UI and APIs.
8. Implement integrity verification, monitoring and alert runbooks.
9. Approve retention schedule and legal/privacy review before enabling production retention/purge.
10. Implement controlled export only after export policy approval.
11. Verify all P0/P1 tests and operational recovery before production launch.

## 15. Ordered implementation tasks

| Task ID | Priority | Task | Dependencies | Status |
|---|---|---|---|---|
| ADM-AUDIT-001 | P0 | Finalize event registry, schema versioning and category/action taxonomy | Owner approval; Super Admin structure policy | Documented |
| ADM-AUDIT-002 | P0 | Define field allowlists, sensitive-data redaction and payload-size limits per event type | 001; privacy review | Documented |
| ADM-AUDIT-003 | P0 | Design immutable event envelope, identifiers, timestamps and correlation metadata | 001 | Documented |
| ADM-AUDIT-004 | P0 | Implement transactional outbox/event writer for critical mutations | 003; DB conventions | Not Started |
| ADM-AUDIT-005 | P0 | Implement append-only storage roles, constraints, encryption and protected backups | 003; security design | Not Started |
| ADM-AUDIT-006 | P0 | Add server-side event emission for authentication, authorization and user/access changes | 001–005; auth foundation | Not Started |
| ADM-AUDIT-007 | P0 | Add server-side event emission for institution/product/rate/fee/eligibility/offer changes | 001–005; A02–A08 services | Not Started |
| ADM-AUDIT-008 | P0 | Add event emission for content/search configuration and system jobs | 001–005; A09–A11 services | Not Started |
| ADM-AUDIT-009 | P0 | Implement effective-permission, scope and field-redaction checks for audit search/detail | Authorization standard | Not Started |
| ADM-AUDIT-010 | P1 | Build audit list, filters, stable cursor pagination and event detail UI | 009; admin shell/design system | Not Started |
| ADM-AUDIT-011 | P0 | Implement integrity chaining/checkpoints and verification jobs | 004–005 | Not Started |
| ADM-AUDIT-012 | P0 | Implement audit pipeline health metrics, gap detection, alerts and incident runbook | 004–008, 011 | Not Started |
| ADM-AUDIT-013 | P1 | Define and implement retention classes, archive, legal hold and verifiable purge | Owner/legal approval | Blocked — policy approval |
| ADM-AUDIT-014 | P1 | Implement controlled CSV/JSONL export with expiry and formula-injection protection | Owner/privacy approval; 009; 013 policy | Blocked — export policy approval |
| ADM-AUDIT-015 | P1 | Add localization, accessibility, responsive and theme behavior | 010; design system | Not Started |
| ADM-AUDIT-016 | P0 | Complete security, permission, integrity, failure-mode and recovery verification | 004–012 | Not Started |
| ADM-AUDIT-017 | P1 | Add sensitive audit-detail/export access logging and investigation annotations as append-only events | 001–009 | Not Started |
| ADM-AUDIT-018 | P1 | Document operational ownership, alert escalation, backup/restore and disaster-recovery procedures | 011–012 | Not Started |

## 16. Acceptance tests

All tests are currently **Not Run**.

| Test ID | Priority | Acceptance criterion | Status |
|---|---|---|---|
| ADM-AUDIT-T01 | P0 | A critical successful mutation creates exactly one durable audit event linked to the transaction/outbox record. | Not Run |
| ADM-AUDIT-T02 | P0 | A rolled-back business transaction does not leave a false success event; failure/denial is represented appropriately. | Not Run |
| ADM-AUDIT-T03 | P0 | Audit persistence failure prevents a critical mutation from being reported successful and raises an alert. | Not Run |
| ADM-AUDIT-T04 | P0 | Retry with the same idempotency/event key does not create duplicate logical events. | Not Run |
| ADM-AUDIT-T05 | P0 | A normal application/admin database role cannot update or delete an existing audit event. | Not Run |
| ADM-AUDIT-T06 | P0 | Audit event payloads reject or redact passwords, OTPs, PINs, tokens, secrets and prohibited PII. | Not Run |
| ADM-AUDIT-T07 | P0 | Financial record changes capture correct allowlisted before/after values, units, effective dates and version references. | Not Run |
| ADM-AUDIT-T08 | P0 | Authentication success/failure and account lifecycle events identify the correct actor/account and outcome without credential material. | Not Run |
| ADM-AUDIT-T09 | P0 | Permission denials and blocked privilege escalation are recorded with safe policy/resource context. | Not Run |
| ADM-AUDIT-T10 | P0 | SEO Manager cannot view unrelated restricted security or financial audit details without explicit permission. | Not Run |
| ADM-AUDIT-T11 | P0 | Admin cannot define event schemas, retention classes or global security structures. | Not Run |
| ADM-AUDIT-T12 | P0 | Direct API/detail/export access enforces server-side permissions and record scope; UI hiding alone is not relied upon. | Not Run |
| ADM-AUDIT-T13 | P0 | Unauthorized users cannot infer the existence/count of out-of-scope events through filters, pagination or errors. | Not Run |
| ADM-AUDIT-T14 | P0 | Event detail clearly distinguishes omitted, redacted, empty and not-applicable values. | Not Run |
| ADM-AUDIT-T15 | P1 | Search supports approved event/actor/target/correlation fields and returns stable cursor-paginated results. | Not Run |
| ADM-AUDIT-T16 | P1 | Date filters entered in IST map correctly to UTC boundaries, including daylight/time-boundary test cases as applicable to IST. | Not Run |
| ADM-AUDIT-T17 | P0 | Event ordering metadata detects duplicates, gaps, delayed persistence and clock anomalies without claiming unsupported global ordering. | Not Run |
| ADM-AUDIT-T18 | P0 | Integrity verification detects a modified/deleted event or invalid checkpoint and raises an alert. | Not Run |
| ADM-AUDIT-T19 | P0 | Integrity keys/checkpoints are not writable by ordinary application or admin accounts. | Not Run |
| ADM-AUDIT-T20 | P0 | Audit outbox backlog, write failures and dropped-event conditions are observable and alertable. | Not Run |
| ADM-AUDIT-T21 | P1 | Export applies identical scope/redaction to UI results, is bounded, expires and is itself audited. | Not Run |
| ADM-AUDIT-T22 | P1 | CSV export safely neutralizes formula-injection payloads. | Not Run |
| ADM-AUDIT-T23 | P0 | Retention/purge cannot run using an unapproved policy and legal holds prevent expiry of held records. | Not Run |
| ADM-AUDIT-T24 | P0 | Retention/purge actions produce verifiable manifests/events without recursive logging loops. | Not Run |
| ADM-AUDIT-T25 | P0 | Audit events and metadata survive backup/restore and integrity verification detects an incomplete or altered restore. | Not Run |
| ADM-AUDIT-T26 | P1 | Sensitive event detail and export access generate separate audit events without recursive payload growth. | Not Run |
| ADM-AUDIT-T27 | P1 | Keyboard, screen-reader, responsive mobile, light/dark and English/Hindi flows are usable and accessible. | Not Run |
| ADM-AUDIT-T28 | P0 | Lead/customer PII is not collected or exposed by A14 before the separate legal/compliance gate. | Not Run |
| ADM-AUDIT-T29 | P0 | Restricted raw IP, user-agent, session references and security metadata are visible only to explicitly authorized roles. | Not Run |
| ADM-AUDIT-T30 | P0 | Monitoring alerts reach a separately controlled channel and cannot be suppressed solely through admin UI access. | Not Run |
| ADM-AUDIT-T31 | P1 | Search/detail failures preserve safe filter state and do not expose stack traces or restricted event existence. | Not Run |
| ADM-AUDIT-T32 | P0 | Role/permission changes and session revocations are attributable to the acting administrator and affected account. | Not Run |

## 17. Definition of Done

- Event taxonomy and schema versions are approved and centrally governed.
- Critical mutations use reliable transactional/outbox event capture.
- Audit storage is append-only for application/admin identities and integrity-verified.
- No prohibited secrets or unnecessary personal data are persisted.
- Server-side permissions, scope and redaction protect search, details, exports and jobs.
- P0/P1 event coverage and all applicable acceptance tests pass with recorded evidence.
- Failure, backlog, integrity and retention monitoring are operational.
- Approved retention/legal-hold policy is implemented and tested before production purge is enabled.
- Export is disabled until its separate policy is approved and verified.
- Accessible responsive UI, localized labels and IST display are verified.
- Runbooks, ownership, backup/restore and incident escalation are documented.
- No unresolved P0 security/privacy blocker remains.

## 18. Owner decisions and recorded approvals

The owner responded, “I think yes for questions you asked,” accepting the recommendations recorded below. These decisions approve the A14 functional scope and control direction; they do not waive the explicitly retained legal, privacy, security or implementation gates.

| # | Decision | Owner-approved direction | Remaining gate |
|---:|---|---|---|
| 1 | Event visibility | Super Admin can inspect all permitted audit events. Admin can inspect operational events; security events require an explicit permission grant. | Final permission keys/scopes in the authorization standard. |
| 2 | Sensitive metadata | Collect IP address and user-agent only for security-relevant events, with restricted access and minimum necessary use. | Privacy review must approve purpose and retention before collection is enabled. |
| 3 | Retention schedule | Use separate retention classes; do not select arbitrary durations before legal/security review. | Legal/security review must set durations, archive, backup expiry and legal-hold rules before production purge/expiry is enabled. |
| 4 | Export | Defer CSV/JSONL export from MVP until search/detail access, scope, redaction and retention controls are verified; then allow bounded, permission-gated export. | Separate export enablement and field-set approval after control verification. |
| 5 | Integrity approach | Approve append-only storage with chained hashes and independently protected signed checkpoints as the initial design, subject to security review. | Security design review and verification of key/checkpoint isolation. |
| 6 | Annotations | Defer investigation notes/acknowledgements from MVP. If introduced later, they must be separate attributed append-only events. | Future scope decision; no annotation UI in MVP. |
| 7 | Audit pipeline failure | Fail closed for privileged and financial mutations when durable audit capture is unavailable; never silently accept a critical audit gap. | Engineering must define and test the exact critical-action list and safe operational recovery. |
| 8 | Two-person controls | No universal maker-checker. Security review may propose a narrow set of exceptional Super Admin actions requiring two-person approval. | Separate security/owner decision for any named actions; routine Admin publishing remains single-operator as already confirmed. |

## 19. Current status and next step

A14 functional scope and recommended control direction are owner-approved. No implementation or tests have started. IP/user-agent collection remains disabled until privacy approval; retention durations and production purge remain blocked until legal/security approval; export remains deferred until access/redaction/retention controls are verified. Integrity design requires security review. A12 Leads remains deferred pending legal/compliance approval.

**Recommended next action:** Proceed to A15 Settings specification. Shared authorization, API, security and privacy standards remain prerequisites before A14 implementation.
