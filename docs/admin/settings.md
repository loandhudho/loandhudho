# LoanDhudho — Admin Settings Specification

**Page ID:** A15 / ADM-SETTINGS  
**Route:** `/admin/settings`  
**Priority:** P0 for secure admin launch; P1 for operational settings MVP  
**Status:** Documented — Owner Approval Pending  
**Last updated:** 2026-11-02  
**Implementation:** Not started  
**Tests:** Not run

## 1. Purpose

Provide a controlled place to view and manage application-wide configuration without mixing configuration with marketplace records, editorial content or user administration. Settings must make ownership explicit: Super Admin defines system structures and global security policy; Admin manages operational settings explicitly delegated to Admin; other roles see only settings required for their work.

The page is not a back door for changing lender/product facts, role definitions, permission catalogues, controlled taxonomies or application code.

## 2. Users, authority and entry points

Entry point: Admin navigation → Settings. Direct route access must be authorized server-side.

| Role | Settings access |
|---|---|
| Super Admin | Full access to system structures, controlled catalogues, global configuration and security policy, subject to re-authentication, validation and audit. |
| Admin | View global settings; manage only explicitly delegated operational settings. Cannot define structures, role/permission definitions, controlled option catalogues or global security policy. |
| SEO Manager | No global settings administration. May access separately permissioned editorial/SEO defaults within content tools, not this page by default. |
| Sales Executive / Support | No settings administration; no access by default. |

Role names are not authorization checks. Use effective permission keys, record scope and field-level redaction from the shared authorization standard. Deny by default.

## 3. Scope

### In scope

- Settings landing page with grouped sections, search, ownership labels, current value, environment, last changed timestamp and actor where permitted.
- Application behavior and presentation defaults.
- Localization and regional display preferences.
- Configurable freshness thresholds and warning behavior, clearly distinguished from approved policy.
- Operational feature availability switches where explicitly delegated.
- Integration connection metadata and health status, without exposing credentials.
- Security configuration visibility and Super Admin-only policy management.
- Controlled options and structural catalogues managed only by Super Admin.
- Change preview, validation, confirmation, version history, audit trail and safe rollback where compatible.
- Configuration export/import only if separately permissioned and safe; secret values must never be exported.

### Out of scope

- Editing bank/institution, loan product, rate, fee, eligibility or offer records (A02–A08).
- Creating or editing user accounts, roles or permission assignments (A13).
- Audit event search/detail and retention administration (A14), except links to the audit record for a settings change.
- Lead collection, customer PII, lender application facilitation, consent capture or data sharing. A12 remains deferred pending legal/compliance approval.
- Editing source code, deployment infrastructure, production secrets, database credentials or identity-provider secrets through the UI.
- Arbitrary scripts, HTML, SQL, shell commands, custom code or unvalidated JSON configuration.
- Changing production settings from a development or staging environment.

## 4. Settings information architecture

The landing page groups settings into the following sections. A section or field is shown only when the user has the relevant view permission.

### 4.1 General application settings

- Public site name and approved brand assets reference.
- Default public locale and supported locale availability.
- Default country/market (India for initial release), currency (INR), number formatting and business timezone display (IST).
- Public support/contact details, only after verified values are supplied.
- Default pagination and non-security UI preferences where centrally configurable.

Brand identity, supported markets and other controlled choices may be structural; Super Admin owns their definitions. Admin may update only fields explicitly classified as operational.

### 4.2 Localization and regional settings

- Supported locales: English (India, `en-IN`) and Hindi (India, `hi-IN`) for initial product direction.
- Default locale and fallback behavior.
- Locale activation state, subject to translation-completeness and native Hindi review gates.
- INR formatting, Indian digit grouping and date/time presentation.
- Timezone storage/display policy: store timestamps in UTC; display business-facing dates/times in IST unless a documented workflow requires otherwise.
- Translation completeness indicators and links to relevant content workflows.

Do not silently machine-publish unreviewed Hindi financial/legal copy. Locale identifiers and supported-locale catalogue are structural and Super Admin controlled.

### 4.3 Data quality and freshness policy

Display and configure freshness reminders only through centrally defined settings and policy permissions.

Current proposed defaults from the data-governance and page specifications (not approved SLAs):
- Rates: reminder at 90 days; stale at 180 days, with event-triggered checks.
- Fees: reminder at 60 days; stale at 90 days.
- Product terms and eligibility: reminder at 90 days; stale at 180 days.
- Offers: expiry warning 7 days before expiry; expiry is separate from source freshness.
- Missing verification timestamp means Unverified, never Fresh.

Settings must identify each value as **Proposed**, **Approved**, or **System enforced**. Until the owner approves thresholds, show them as proposed defaults and do not present them as binding policy. Super Admin controls policy definitions and permitted ranges; Admin may adjust operational reminder values only if explicitly delegated. A settings change must not rewrite historical verification timestamps or mark records fresh.

### 4.4 Marketplace operational defaults

Examples of candidate configurable defaults:
- Default table page size from an approved fixed option list.
- Default dashboard date range from an approved option list.
- Bulk-import maximum row count and file-size limits within security-approved bounds.
- Non-sensitive notification preferences and operational warning thresholds.
- Public display defaults that do not alter underlying lender facts.

Super Admin defines the allowed option catalogue and safe bounds. Admin may select from those options where delegated. A setting must not change product comparison formulas or financial meaning without an explicit approved product/data-governance change.

### 4.5 Security and access policy

Super Admin-only section for approved, application-level security policy controls and visibility:
- Session lifetime and idle timeout within security-approved bounds.
- MFA requirement and step-up authentication policy.
- Invitation expiry and resend throttling policy.
- Login/rate-limit/lockout policy.
- Allowed authentication methods and identity-provider configuration references.
- Session revocation behavior after role/permission changes.
- Security notification destinations as verified operational contacts, with restricted editing.

Some controls may be managed by the identity provider or deployment environment rather than LoanDhudho. In that case, show ownership, status and a safe link/instruction; do not simulate control or claim a setting is enforced when it is not.

Admin may view security status and perform explicitly delegated operational actions, but cannot alter global security policy, authentication architecture, MFA requirements, permission definitions or security boundaries. No role can disable audit capture or bypass authorization from this page.

### 4.6 Integrations and external services

Show configured integration name, purpose, environment, owner, connection status, last successful check and non-sensitive configuration metadata.

Potential future integration categories:
- Email delivery.
- Error/observability monitoring.
- Analytics with privacy-safe, aggregate events.
- Search/indexing services.
- Identity provider.
- Approved lender or data-source integrations, only after legal, security and commercial approval.

MVP must not activate lender application APIs, lead transmission, bureau access, bank account access or customer-data sharing. A12 legal/compliance gates remain controlling.

Secrets, API keys, OAuth tokens, client secrets, passwords and signing keys must be stored in a dedicated secret manager/environment, never returned to the browser, displayed in full, logged, exported or stored in ordinary settings rows. UI may support a secure connect/disconnect flow only after a separate integration specification and security review. Masked secret placeholders are not proof of secret validity.

### 4.7 Controlled options and system structures

Super Admin-only area for structural catalogues, such as:
- Entity and record types.
- Role definitions and permission catalogue/templates.
- Status definitions and lifecycle transitions.
- Controlled option lists and taxonomy structures.
- Comparison-profile schemas and supported field definitions.
- Supported locale catalogue and other system-level enumerations.

This section must not become an unrestricted schema editor. Structural changes require dependency checks, migration/version planning, compatibility validation, preview of affected records, explicit confirmation and an immutable audit event. Destructive changes should be blocked if referenced records would be orphaned or semantics would change. Prefer deprecation over deletion.

Admin can use existing structures in operational workflows but cannot create, rename, delete or redefine them. SEO Manager and Support have no access by default.

## 5. User stories

- As a Super Admin, I can inspect and manage global configuration and structural catalogues with clear impact and audit history.
- As a Super Admin, I can change approved security policy only after validation and re-authentication.
- As an Admin, I can manage operational settings delegated to my permission set without changing system structures.
- As an Admin, I can see which settings are proposed, approved, enforced or externally managed.
- As an authorized operator, I can understand who changed a setting, when, why and what changed.
- As an operator, I can identify an integration's health without seeing its credentials.
- As a user, I cannot access or mutate settings by guessing a URL or calling an endpoint directly.

## 6. Core workflows

### 6.1 Browse and search

1. Open Settings.
2. Server resolves permissions and visible sections.
3. Show section, setting name, description, current value, status/ownership, environment, last-updated metadata and available actions.
4. Search only across settings the actor is authorized to view.
5. Selecting a setting opens its detail panel with validation rules, dependencies and history.

### 6.2 Change a setting

1. Actor opens an editable setting and sees current value, allowed range/options, impact, owner and environment.
2. Actor enters a new value and optional reason (required for security/structural/high-risk changes).
3. Server validates type, range, cross-setting constraints, permission, environment and dependencies.
4. Show before/after preview and affected services/records where determinable.
5. For high-risk or structural changes, require recent re-authentication and explicit confirmation. No universal second-person approval is imposed for routine Admin operations.
6. Persist a new immutable configuration version and audit event atomically.
7. Apply immediately only when safe; otherwise mark pending activation and explain the required deployment/restart window.
8. Confirm outcome only after persistence/application succeeds. On failure, preserve the prior effective configuration and show a safe error.

### 6.3 Roll back

- Rollback creates a new version restoring a previous value; it never deletes history.
- Revalidate the old value against the current schema and dependencies.
- Require reason and elevated confirmation for security/structural settings.
- Block rollback if the old configuration is no longer compatible.
- Audit the rollback as a new change with reference to the source version.

### 6.4 Integration status

- Show health metadata and last check result.
- Never display secret material.
- Failed or expired connection status must not expose raw provider response bodies or credentials.
- Connection changes are unavailable until the integration has an approved dedicated workflow.

## 7. Data model and configuration contract

Suggested logical entities:

**SettingDefinition**
- Stable key, display name, description, section, value type, validation schema, allowed options/range, default, owner class (Super Admin / Admin delegated / external), risk level, sensitivity, environment scope, activation mode, dependency keys, permission keys, status and schema version.

**SettingValue**
- Definition key, environment, typed value or secure reference, version, effective value, updated timestamp and actor.
- Secret values are represented only by an opaque secret-manager reference; never by secret plaintext.

**ConfigurationVersion**
- Immutable version ID, definition/schema version, before/after non-secret values or safe diff, actor, timestamp, reason, activation result, correlation ID and rollback reference.

**ConfigurationAuditEvent**
- Correlated with A14 audit event taxonomy; actor, action, target key, outcome, reason, safe before/after diff and timestamp. Do not duplicate secrets or unnecessary personal data.

**IntegrationStatus**
- Integration identifier, environment, purpose, health state, last check, non-sensitive metadata and external owner. Credentials live outside this model.

Configuration values must be typed, schema-validated and versioned. Avoid a single untyped key/value blob. Use database transactions and optimistic concurrency/version checks to prevent lost updates. Sensitive values must be redacted from API responses, logs, diffs, exports and analytics.

## 8. Permissions and enforcement

Candidate permission identifiers (proposals only; Super Admin owns the final catalogue):
- `settings.view`
- `settings.view_security`
- `settings.edit_operational`
- `settings.manage_global`
- `settings.manage_security_policy`
- `settings.manage_structures`
- `settings.view_history`
- `settings.rollback`
- `settings.view_integrations`
- `settings.manage_integrations`

Permission is evaluated per setting definition, action, environment and risk. Do not grant broad edit rights merely because a user can open the Settings page.

Required controls:
- Server-side enforcement on route, API, server action, background job and any export.
- Deny by default; validate scope and field-level visibility.
- Admin cannot change role definitions, permission templates, controlled catalogues, entity types, status definitions or global security policy.
- Prevent self-elevation and privilege escalation through configuration.
- No client-supplied role/permission claim is trusted.
- Re-authentication/step-up for high-risk security and structural changes.
- Session refresh/revocation when a security or access policy change requires it.
- Audit every mutation, failed privileged attempt and rollback; never log secrets.
- Fail closed for privileged/security-sensitive mutations if durable audit capture is unavailable, consistent with A14.

## 9. UI states and interaction requirements

- **Loading:** section skeletons; do not flash unauthorized values.
- **Empty:** explain that no settings are available to this account or environment; distinguish from a configuration error.
- **Read-only:** clearly identify externally managed, system-enforced or permission-restricted settings.
- **Proposed policy:** visually distinguish unapproved defaults from approved/enforced values.
- **Validation error:** field-level explanation and safe server error; retain user input where safe.
- **Conflict:** show that another actor changed the setting; reload current version before retry.
- **Save success:** show effective/pending state and version reference only after confirmed persistence.
- **Apply failure:** preserve prior effective value and show recovery guidance.
- **Integration error:** show sanitized status; no raw secret/provider payload.
- **Denied:** explain insufficient permission without exposing hidden setting names or values.
- **Unavailable dependency:** identify dependency and block unsafe mutation.

No destructive action should be a one-click toggle. Use confirmation with impact summary for security, structural, localization activation and integration actions.

## 10. Audit, privacy and observability

- Record setting key, action, actor, timestamp, outcome, reason, environment, configuration version, correlation ID and safe before/after diff.
- Record attempted unauthorized and failed high-risk changes without logging submitted secrets.
- Structural changes should include dependency/impact summary and schema version.
- Link to A14 audit detail only when the actor has the corresponding audit permission.
- No IP/user-agent collection is introduced by this page; follow A14's separate privacy approval gate.
- Do not include personal or lead/customer data in settings or configuration logs.
- Monitor configuration validation failures, activation failures, repeated denied changes and drift between desired/effective state.

## 11. Localization, accessibility and responsive behavior

- English (`en-IN`) default; Hindi (`hi-IN`) supported after native review.
- All labels, descriptions, validation errors, confirmations and status messages are localizable.
- Do not concatenate translated fragments or expose raw internal keys as user-facing labels.
- Keyboard-operable navigation, search, forms and confirmation dialogs; visible focus; semantic labels; screen-reader status announcements.
- Do not rely on color alone for risk/status.
- Responsive layout: grouped navigation and setting detail on desktop; stacked sections and full-width controls on mobile.
- Light/dark themes must preserve contrast and status distinctions.
- Settings must remain usable on low-bandwidth connections; load history and integration health on demand.

## 12. Dependencies and release gates

- A13 Users and Roles and shared authorization standard: permission catalogue, delegation ceiling, MFA and session behavior.
- A14 Audit Logs: durable audit capture, event taxonomy, access rules and policy-specific gates.
- Data governance: approved freshness thresholds and configuration ownership.
- Admin shell/navigation, design system, API conventions and testing strategy.
- Security review for secret-manager integration, identity provider controls, re-authentication and configuration activation.
- Legal/privacy review before any analytics or external integration transmits personal data.
- No production security-policy mutation or integration activation until the relevant controls are implemented and tested.

## 13. Ordered implementation tasks

| Task ID | Priority | Task | Dependencies | Status |
|---|---|---|---|---|
| ADM-SET-001 | P0 | Define typed setting registry, ownership, environment scope and schema versioning | Authorization, API conventions | Not Started |
| ADM-SET-002 | P0 | Implement server-side settings permission resolver and deny-by-default checks | A13, authorization | Not Started |
| ADM-SET-003 | P0 | Implement immutable configuration versions and optimistic concurrency | Database/API design | Not Started |
| ADM-SET-004 | P0 | Integrate configuration mutations with durable A14 audit capture | A14 | Not Started |
| ADM-SET-005 | P0 | Redact secrets and sensitive values from all responses, logs and diffs | Secret-management design | Not Started |
| ADM-SET-006 | P1 | Build settings landing page, grouped sections, search and ownership/status labels | Admin shell, design system | Not Started |
| ADM-SET-007 | P1 | Build setting detail and typed edit controls with server validation | ADM-SET-001..003 | Not Started |
| ADM-SET-008 | P1 | Add impact preview, reason capture and confirmation for elevated changes | ADM-SET-004, security design | Not Started |
| ADM-SET-009 | P1 | Add configuration history and authorized detail view | ADM-SET-003, A14 | Not Started |
| ADM-SET-010 | P1 | Add safe rollback as a new version with compatibility checks | ADM-SET-003, ADM-SET-004 | Not Started |
| ADM-SET-011 | P1 | Implement localization, regional formatting and timezone settings | Localization policy | Not Started |
| ADM-SET-012 | P1 | Implement proposed/approved/enforced freshness policy display and controls | Data governance, owner decision | Not Started |
| ADM-SET-013 | P1 | Implement Admin-delegated operational defaults and option constraints | Super Admin catalogue | Not Started |
| ADM-SET-014 | P1 | Implement Super Admin-only structural catalogue interface with dependency checks | Taxonomy/schema migration design | Not Started |
| ADM-SET-015 | P1 | Add security settings visibility and safe external-owner handoff | Identity/security architecture | Not Started |
| ADM-SET-016 | P2 | Add integration health/status display with no credential exposure | Approved integration inventory | Not Started |
| ADM-SET-017 | P2 | Add sanitized configuration health/drift monitoring | Observability standard | Not Started |
| ADM-SET-018 | P2 | Add controlled configuration export/import only after separate approval | Security review, export policy | Deferred |
| ADM-SET-019 | P1 | Complete responsive, accessibility, light/dark and English/Hindi QA | Design system | Not Started |
| ADM-SET-020 | P0 | Complete security, permission, audit-failure and rollback test suite before release | ADM-SET-001..015 | Not Started |

## 14. Acceptance tests

All tests are **Not Run** until implementation exists and evidence is recorded.

| Test ID | Acceptance criterion | Status |
|---|---|---|
| ADM-SET-T01 | Unauthenticated users cannot access settings route or APIs. | Not Run |
| ADM-SET-T02 | Users without settings permission cannot view settings or infer hidden values through search/API. | Not Run |
| ADM-SET-T03 | Admin can edit only operational settings explicitly delegated to them. | Not Run |
| ADM-SET-T04 | Admin cannot create/edit role definitions, permission templates or grant Super Admin. | Not Run |
| ADM-SET-T05 | Admin cannot change entity types, status definitions, controlled catalogues or comparison schemas. | Not Run |
| ADM-SET-T06 | Only Super Admin with the required permission can change global security policy. | Not Run |
| ADM-SET-T07 | Client-side role/permission tampering does not grant access. | Not Run |
| ADM-SET-T08 | A setting value failing type/range/schema validation is rejected server-side. | Not Run |
| ADM-SET-T09 | Cross-setting dependency conflicts block unsafe activation and explain the dependency. | Not Run |
| ADM-SET-T10 | Concurrent edits detect version conflict and do not silently overwrite another actor's change. | Not Run |
| ADM-SET-T11 | Successful change creates an immutable version and corresponding durable audit event. | Not Run |
| ADM-SET-T12 | If durable audit capture fails, privileged/security-sensitive mutation fails closed and prior effective value remains. | Not Run |
| ADM-SET-T13 | Secret values never appear in browser responses, page source, logs, audit diffs, exports or error messages. | Not Run |
| ADM-SET-T14 | Configuration history shows authorized actor, time, reason, version and safe before/after values. | Not Run |
| ADM-SET-T15 | Rollback creates a new version and is blocked when the previous schema/value is incompatible. | Not Run |
| ADM-SET-T16 | Re-authentication is required for configured high-risk changes and expired step-up is rejected. | Not Run |
| ADM-SET-T17 | Role/security changes trigger required permission refresh or session revocation. | Not Run |
| ADM-SET-T18 | Proposed freshness thresholds are not displayed as approved policy or used as binding SLA before owner approval. | Not Run |
| ADM-SET-T19 | Missing verification timestamp remains Unverified and is not made fresh by changing a threshold. | Not Run |
| ADM-SET-T20 | Changing locale/default display settings does not rewrite stored timestamps or financial records. | Not Run |
| ADM-SET-T21 | Hindi locale activation is blocked or flagged until required native review/translation completeness gates pass. | Not Run |
| ADM-SET-T22 | Integration status is sanitized and does not expose credentials or raw provider payloads. | Not Run |
| ADM-SET-T23 | Lead transmission, bureau access and lender application integrations remain unavailable absent separate approvals. | Not Run |
| ADM-SET-T24 | Unauthorized settings changes and failed privileged attempts are audited without secrets. | Not Run |
| ADM-SET-T25 | Keyboard, screen-reader, mobile, light/dark and supported-locale checks pass for all settings workflows. | Not Run |
| ADM-SET-T26 | Production settings cannot be mutated from a non-production environment or by changing a client-supplied environment field. | Not Run |
| ADM-SET-T27 | Structural catalogue changes detect referenced records and prevent destructive orphaning or silent semantic changes. | Not Run |
| ADM-SET-T28 | A failed activation preserves the last known-good effective configuration and reports pending/error state accurately. | Not Run |

## 15. Owner decisions required

The following are proposals, not assumed approvals:

1. **Operational settings delegation:** Which non-structural settings should Admin be allowed to change by default? Recommendation: Admin may manage operational display/notification defaults and approved reminder values; Super Admin retains global security, structural, market/locale catalogue and integration policy.
2. **Freshness thresholds:** Approve or revise the proposed rates 90/180 days, fees 60/90 days, product terms/eligibility 90/180 days and 7-day offer-expiry warning. Until approved, retain proposed labels.
3. **Locale launch:** Confirm English-only initial launch or English plus Hindi at launch. Recommendation: English default; expose Hindi only after native review and translation completeness.
4. **Security controls:** Confirm whether MFA is mandatory for Super Admin and Admin, and which security controls are managed in the identity provider versus LoanDhudho. Recommendation: mandatory MFA for both privileged roles; identity-provider-owned controls remain external.
5. **Integration scope:** Confirm which non-lender integrations, if any, are required for MVP (e.g. email delivery and monitoring). Recommendation: show status only; do not activate lender, lead, bureau or customer-data integrations in MVP.
6. **Configuration rollback:** Approve versioned rollback for non-secret settings, with revalidation and audit. Recommendation: yes; never restore or expose secret material through rollback.
7. **Structural change protection:** Approve deprecation over deletion for referenced catalogue values and require impact preview/re-authentication for structural changes. Recommendation: yes.

## 16. Definition of Done

- Owner approves the specification and resolves or explicitly defers decisions affecting MVP behavior.
- Settings registry, ownership classes and permission model are implemented server-side.
- Every mutation is schema-validated, versioned and durably audited.
- Secrets and sensitive data are absent from browser/API/log/audit/export surfaces.
- Admin cannot alter system structures or global security policy.
- Super Admin structural and security authority is enforced with step-up controls.
- History, conflict handling, activation failure and rollback behave as specified.
- All P0/P1 acceptance tests pass with recorded evidence; accessibility, localization, responsive and theme checks pass.
- Tracker and this specification reflect actual implementation/test status; no production release without explicit release approval.
