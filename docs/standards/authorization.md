# LoanDhudho — Admin Authorization and Role Standard

**Status:** Draft — owner approval pending; role boundaries and Admin operational authority confirmed by owner  
**Last updated:** 2026-11-02  
**Scope:** All admin routes, APIs, server actions, dashboards, data exports and future admin modules.

## 1. Owner-defined role hierarchy

LoanDhudho will start with four named admin roles. This replaces the earlier provisional Super Admin / Editor / Reviewer / Support-Analyst role vocabulary in page drafts.

| Role | Primary responsibility | Authority boundary |
|---|---|---|
| **Super Admin** | Owns system-level configuration and data structures | Can define controlled options, statuses, entity types, role definitions and permission templates. Highest administrative authority. |
| **Admin** | Runs day-to-day application and marketplace operations | Has full day-to-day operational authority: can create, edit, review, approve, publish, unpublish and manage institutions, products, rates, fees, eligibility, offers and users, and assign existing permissions within the configured authority ceiling. Cannot define or change system-level structures, role definitions, permission definitions/templates or controlled catalogues, or grant Super Admin authority. |
| **SEO Manager** | Owns public content and organic discovery | Can create, edit, optimize and manage content, SEO metadata, landing pages, blogs and public product/category pages, plus permitted page analytics. Does not manage financial source-of-truth records or user security. |
| **Sales Executive / Support** | Handles customer-facing product support and sales operations | Can access permitted product pages, customer records, lead workflows and related analytics. Access to personal/lead data is conditional on the legal/compliance gate, consent and assigned scope. |

A user may have only the role(s) explicitly assigned by an authorized Admin or Super Admin. Multiple roles, if enabled, combine permissions but never bypass explicit deny rules, data scope, legal gates or separation-of-duty controls.

## 2. Permission model

Use permission-based authorization rather than scattered role-name checks. Each permission has:
- Stable machine-readable key (for example, `institutions.create`, `products.publish`, `content.publish`, `users.assign_permissions`).
- Resource/entity and action.
- Optional scope (all records, assigned records, own records, or read-only aggregate).
- Risk classification and whether approval/step-up authentication is required.
- Audit requirement and effective date.

Suggested actions: view, create, edit, submit_for_review, approve, publish, unpublish, archive, assign, export, configure, manage_permissions. Do not treat create/edit/approve/publish as one permission.

Authorization is evaluated server-side on every request and mutation. The UI only reflects the effective permission set; it is never the enforcement layer.

## 3. Role capability matrix

| Capability | Super Admin | Admin | SEO Manager | Sales Executive / Support |
|---|---|---|---|---|
| Define system options, entity types and status catalogues | Full | No | No | No |
| Create/edit role definitions and permission templates | Full | No | No | No |
| Manage global security/configuration policies | Full | Limited operational settings explicitly delegated | No | No |
| Manage institutions and lender records | Full | Full operational create/edit/review/approve/publish/manage authority | Read approved public-facing data only | Read product-facing information only |
| Manage loan products and financial source records | Full | Full operational create/edit/review/approve/publish/manage authority, with source evidence and audit history | Edit presentation/content fields only; no source-of-truth rate/fee/eligibility changes | Read approved product information; no edits to financial facts |
| Manage rates, fees and eligibility facts | Full | Full operational create/edit/review/approve/publish/manage authority with evidence, effective dates, history and audit controls | No | No |
| Manage offers and promotions | Full | Operational management | Manage public copy/SEO fields only when separately permissioned | View approved offers and customer-facing details |
| Create/edit/publish landing pages, blogs and guides | Full | Limited/optional only if separately granted | Full within content workflow | No |
| Create/edit public product/category page content | Full | Operational facts; content fields only if granted | Full presentation/SEO content access; cannot alter verified lender facts | View published pages |
| View page analytics | Full | Operational summaries as granted | Full page/content SEO analytics | Sales/customer analytics within assigned scope |
| Manage users | Full | Create/deactivate users and assign existing roles/permissions within own authority ceiling | No | No |
| Create new role or grant Super Admin | Full | No | No | No |
| Access customer records | Only when operationally necessary and authorized | Only when operationally necessary and authorized | No by default | Assigned-scope access after legal gate |
| Access/manage leads | Only after legal gate and explicit permission | Only after legal gate and explicit permission | No by default | Assigned-scope access after legal gate |
| View audit logs | Full | Operationally relevant events if granted | Content-related activity only if granted | Own actions or support-related events only if granted |

“Full” still means subject to authentication, audit, legal restrictions and safe-operation controls. No role may view secrets or credentials.

## 4. Admin authority ceiling

Admin can create users and assign existing roles/permissions, but:
- Cannot create, rename, delete or redefine roles.
- Cannot edit permission definitions or system-wide permission templates.
- Cannot grant Super Admin or elevate their own authority.
- Cannot assign permissions beyond the Admin's configured delegation ceiling.
- Cannot remove the last active Super Admin or bypass required approval for high-risk changes.
- User creation, role assignment, permission changes, deactivation and invitations are audited.

Super Admin owns the role catalogue and permission definitions. High-risk Super Admin changes should require re-authentication and immutable audit events; two-person approval may be introduced for especially sensitive changes.

## 5. Content and product-page boundary

“SEO Manager has access to all content levels” means all editorial and SEO-controlled fields and workflows, including:
- Landing pages, category pages, institution/product page presentation, blogs, guides, metadata, internal linking, canonical URLs, redirects and structured content.
- Draft, review, scheduling and publication workflows according to the content policy.
- Page-level organic analytics and content performance.

It does **not** grant authority to change verified lender identity, interest rates, fees, eligibility rules, source evidence, product availability or other financial facts. Those remain controlled marketplace data managed by Super Admin/Admin workflows. Content may explain or present approved facts but cannot overwrite them.

## 6. Customer and lead data boundary

Sales Executive / Support access to customers, leads and sales analytics is a planned responsibility, not permission to activate lead collection immediately.

Before lead/customer workflows are enabled:
1. Complete documented legal/compliance review and required agreements.
2. Define lawful purpose, fields, retention, access, correction/deletion and export controls.
3. Obtain explicit purpose-specific consent naming intended recipients before personal data is shared.
4. Define assignment and record-level scope, masking, audit and breach-response controls.
5. Approve the lead page specification and test cases.

Until that gate is passed, lead and customer PII modules remain disabled or unavailable; no role receives implicit access. Dashboard analytics must remain aggregate and non-identifying.

## 7. Review, publishing and separation of duties

- Owner decision (2026-11-02): Admin may create, edit, review, approve and publish institution, product, rate, fee, eligibility and offer records. Routine publication does not require a separate approver.
- Preserve source evidence, validation, version history and audit logs for every material financial-data change. Optional maker-checker safeguards for selected high-risk changes may be considered later, but are not a universal requirement.
- SEO Manager can publish content within editorial scope but cannot publish changed financial facts.
- Super Admin may override workflow controls only through a reasoned, audited exceptional action.
- Suspension, role elevation, permission grants, exports and sensitive data access are auditable.

## 8. Implementation and test requirements

- Central permission catalogue and effective-permission resolver.
- Server-side checks on pages, APIs, server actions, exports, background jobs and analytics queries.
- Deny by default; enforce resource-level scope and field-level redaction.
- Prevent horizontal/vertical privilege escalation and self-elevation.
- Session refresh/revocation after role or permission changes.
- Audit actor, target, action, timestamp, outcome, reason and relevant before/after values; never log secrets.
- Automated tests for each role's allowed and denied actions, direct URL access, API mutation, exports, cross-user scope, role changes and lead legal gate.
- Seed only the four owner-defined role names initially; permission bundles remain Super Admin-controlled and versioned.

## 9. Acceptance checklist

- [ ] Four role definitions match the owner-approved boundaries.
- [ ] Admin cannot create roles or grant Super Admin.
- [ ] Super Admin controls role/permission definitions and system taxonomies.
- [ ] SEO Manager can manage editorial/SEO surfaces without changing lender facts.
- [ ] Sales Executive / Support can only access assigned customer/lead data after legal approval.
- [ ] Every server endpoint enforces permissions and scope.
- [ ] Sensitive actions and data access are audited.
- [ ] Role/permission changes revoke stale sessions or refresh effective permissions.
- [ ] Dashboard and every page specification use this role model.

## 10. Open implementation decisions

1. Exact permission keys, scope vocabulary and delegation ceiling will be finalized during A13 Users and Roles and implementation design.
2. Resolved by owner: Admin has routine operational approval and publishing authority for institution, product and financial records.
3. Lead access remains disabled until legal/compliance approval.
4. Two-person approval for selected Super Admin actions is recommended for security review; final scope can be set in the security design.

No authorization implementation should begin until this standard and the relevant page specifications are approved.


## 11. Authorization decision model

Every protected operation must be evaluated by a centralized server-side authorization service. The service receives the authenticated principal, requested action, target resource, relevant record attributes, request context and current policy version. It returns an explicit allow or deny decision with a machine-readable reason suitable for safe diagnostics.

The decision must satisfy all applicable checks:

1. A valid authenticated session exists and is not expired, revoked or otherwise restricted.
2. The account is active and the current role/permission assignment is valid.
3. The principal has the required permission for the exact action.
4. The requested record is within the permission's effective scope.
5. Field-level restrictions permit the requested fields and response shape.
6. No explicit deny, legal/compliance gate, resource-state restriction or required step-up control blocks the action.
7. Any required audit event can be durably recorded before the protected mutation is committed.

If a required policy, scope, account state or permission cannot be resolved, deny by default. Do not infer permission from a role label, navigation visibility, URL knowledge, client-supplied claims or a previous successful request.

A recommended internal decision order is: authentication → account/session state → explicit deny → permission grant → resource scope → field policy → legal/operational gates → step-up requirement → audit/reliability preconditions → allow. An explicit deny always overrides a grant.

## 12. Permission catalogue and action semantics

Permission keys are stable, namespaced identifiers in the form `resource.action`. The examples below are candidates to guide implementation, not a hard-coded final catalogue. Super Admin owns creation, retirement, descriptions, risk classification and versioning of permission definitions.

| Resource area | Example permission keys |
|---|---|
| Institutions | `institutions.view`, `institutions.create`, `institutions.edit`, `institutions.review`, `institutions.approve`, `institutions.publish`, `institutions.archive` |
| Products/categories | `products.view`, `products.create`, `products.edit`, `products.review`, `products.approve`, `products.publish`; `categories.assign` |
| Rates/fees/eligibility | `rates.view`, `rates.create`, `rates.edit`, `rates.verify`, `rates.approve`, `rates.publish`; corresponding `fees.*` and `eligibility.*` keys |
| Offers/search | `offers.view`, `offers.create`, `offers.edit`, `offers.approve`, `offers.publish`; `intents.view`, `intents.edit`, `intents.publish` |
| Editorial/SEO | `content.view`, `content.create`, `content.edit`, `content.review`, `content.publish`; `landing_pages.*`, `seo.analytics.view` |
| Users/access | `users.view`, `users.invite`, `users.edit_profile`, `users.assign_role`, `users.assign_permissions`, `users.suspend`, `users.deactivate`, `users.reactivate`, `users.revoke_sessions`, `users.view_access_history` |
| Audit/settings | `audit.operational.view`, `audit.security.view`, `settings.operational.edit`, `security.structure.manage` |

Actions are distinct. `create` does not imply `edit`; `edit` does not imply `review`, `approve` or `publish`; `view` does not imply `export`; and `assign_role` does not imply `assign_permissions`. A workflow may combine actions only where its specification explicitly requires it. Admin's confirmed routine operational authority is represented by grants for the operational actions; it does not grant structural configuration permissions.

Permission definitions must include resource, action, description, risk class, default audit behavior, allowed scope types, field-policy category, whether step-up is required and whether a legal/feature gate applies. Retired keys remain resolvable for historical audit interpretation but cannot be newly assigned.

## 13. Record scopes and field-level access

Use a centrally defined scope vocabulary. Initial candidate scopes are:

- **All:** all records in the permitted resource domain.
- **Assigned:** records explicitly assigned to the principal or an authorized team.
- **Own:** records created/owned by the principal, where ownership is meaningful.
- **Aggregate:** non-identifying aggregate metrics only; no row-level access.
- **Read-only:** an action restriction, not a substitute for record scope; combine it with All, Assigned, Own or Aggregate as appropriate.

A permission grant must state its scope. Missing or invalid scope is deny, not All. Scope is checked in the database query or trusted service layer before records are returned or mutated; filtering only after loading records is insufficient.

Field policy is independent of record scope. Responses and exports must apply field allowlists/redaction before serialization. Sensitive fields must not be fetched for a principal who cannot access them. No role receives credentials, authentication secrets, OTPs, PINs, tokens, recovery codes or raw payment/banking credentials.

Lead/customer PII remains unavailable to every role until the separate legal/compliance gate, purpose-specific consent, approved field catalogue, retention policy and access controls are all in force. A permission grant alone cannot bypass this feature/legal gate.

## 14. Role baselines and effective grants

The four owner-defined roles are the starting role templates, not runtime authorization shortcuts. Each role maps to versioned permission grants and default scopes. A user receives only assigned role grants and separately authorized scoped grants. Multiple roles, if enabled, are combined by union of eligible grants subject to explicit deny, scope restrictions, field restrictions and legal gates; they never expand access beyond the grantor's delegation ceiling.

| Role | Baseline grant policy |
|---|---|
| Super Admin | All approved system and operational permissions, including structural catalogue and role/permission administration; still subject to authentication, audit, secret exclusion and legal gates. |
| Admin | Full day-to-day operational marketplace permissions and user administration within the configured delegation ceiling; no structural configuration or Super Admin grant. |
| SEO Manager | Editorial, landing-page, SEO and permitted content analytics permissions; approved lender facts are read-only and source-of-truth financial records are not mutable. |
| Sales Executive / Support | Product-facing read permissions and explicitly assigned support/sales scopes. Customer/lead records remain disabled until the separate legal gate is approved. |

The effective-permission resolver must combine role grants, scoped additional grants, explicit denies, account state, resource scope, field policy and active gates. Cache only with a reliable policy/version key and short invalidation path; stale grants must not survive role or permission changes.

## 15. Delegation and structural ownership

- Super Admin creates and versions role definitions, permission keys, templates, scope vocabulary, field classifications, status catalogues and global security structures.
- Admin may assign only existing roles and permissions that the Admin is explicitly allowed to delegate and that do not exceed the Admin's own effective authority or configured delegation ceiling.
- Admin cannot grant Super Admin, edit role/permission definitions, alter global security settings, change controlled catalogues or grant themselves additional authority.
- Admin cannot delegate a permission or scope they do not hold. A narrower scope may be delegated; a broader scope may not.
- No user may approve their own elevation or modify their own role/permission grants.
- Protect the last active Super Admin from suspension, deactivation or removal of required access.
- Role/permission changes require durable audit, immediate effective-permission refresh and revocation of affected sessions where claims/caches cannot be safely refreshed.
- A delegation ceiling is configuration owned by Super Admin and must be explicit; missing ceiling configuration means no delegation.

## 16. Authentication, sessions and step-up

The specific managed identity provider is an implementation decision. Do not build custom password storage or expose/reset user credentials through admin workflows. Authentication provider selection must verify support for secure invitation, MFA, session revocation, account disablement and appropriate audit/event hooks.

Owner-approved A13 baseline:
- Mandatory MFA for Super Admin and Admin accounts.
- Step-up authentication for sensitive actions where supported.
- Verified work-email invitations, single-use tokens, configurable expiry and throttled resend.
- Notify affected users of role, permission, suspension and deactivation changes.
- Deactivation rather than routine hard deletion; retain minimum necessary audit evidence under approved retention policy.

Exact provider, invitation expiry values, session maximum age, re-authentication window and retention durations remain implementation/security configuration decisions. Never invent these values as approved policy.

After role, permission, scope or account-state changes, invalidate or refresh sessions and server-side permission caches before subsequent protected requests. A request in flight must not commit using a stale grant after a revocation has taken effect.

## 17. Sensitive operations, audit and failure behavior

Sensitive actions include role/permission assignment, account suspension/deactivation, session revocation, structural configuration, exports, security-event access, changes to financial source records and any future personal-data access.

- Record actor, target, action, scope, policy version, timestamp, outcome, reason and relevant before/after values.
- Never include passwords, MFA secrets, invitation tokens, access tokens, OTPs, PINs, recovery codes or raw authentication headers in audit records.
- Follow A14 Audit Logs: privileged and financial mutations fail closed if durable audit capture is unavailable; exact transactional outbox and recovery behavior must be implemented and tested.
- Security-event audit visibility requires an explicit permission; Admin's operational audit visibility does not imply security-event access.
- No universal maker-checker is required for routine Admin publishing. Any future two-person control must be narrowly scoped and separately approved.
- Super Admin exceptional overrides require a reason and durable audit. Do not create an unlogged bypass or hidden support backdoor.

## 18. Enforcement coverage

Authorization is mandatory at every entry and execution point, including:

- Admin route/page loaders and server-rendered data access.
- API route handlers, server actions, RPC procedures and mutation services.
- Database query/service layer for record scope and field selection.
- File upload/download, imports, exports and generated reports.
- Background jobs, scheduled tasks, webhooks and integration callbacks.
- Dashboard widgets, analytics queries, search suggestions and autocomplete.
- Cached data, revalidation, prefetch and streaming responses.
- Audit-log search/detail and any future data warehouse/reporting access.

Prefer a shared policy enforcement point and typed permission helpers. Avoid role-name conditionals distributed through UI components. UI controls may be hidden/disabled for usability, but every server-side execution path must independently authorize.

## 19. Security and test requirements

The implementation must include automated tests for:

1. Every role's allowed and denied action matrix.
2. Missing, invalid, expired, suspended and revoked sessions.
3. Deny-by-default behavior for unknown permission keys and unresolved scopes.
4. Explicit deny overriding role and scoped grants.
5. All/Assigned/Own/Aggregate boundaries, including cross-user and cross-team access.
6. Field redaction in page data, API responses, exports, logs and analytics.
7. Direct URL, API, server-action, job and export attempts that bypass hidden UI controls.
8. Admin attempts to create roles, change permission definitions, grant Super Admin, self-elevate or exceed delegation.
9. Last active Super Admin protection.
10. SEO Manager attempts to mutate verified rates, fees, eligibility, source evidence or institution identity.
11. Support access before and after the lead/customer legal gate; default must be denied.
12. Permission revocation during active sessions and concurrent requests.
13. Audit capture failure for privileged/financial mutations.
14. Step-up requirements and audit events for sensitive operations.
15. Multiple-role grant composition and explicit-deny precedence, if multi-role support is enabled.

Test fixtures must use synthetic data. No real customer/lead PII is needed to validate authorization.

## 20. Implementation tasks

| Task ID | Priority | Task | Dependencies | Status |
|---|---|---|---|---|
| AUTH-001 | P0 | Define versioned permission catalogue and four role baseline templates | Owner approval | Not Started |
| AUTH-002 | P0 | Implement centralized server-side authorization decision service | AUTH-001 | Not Started |
| AUTH-003 | P0 | Implement scope resolver and database-level record filtering | AUTH-001, AUTH-002 | Not Started |
| AUTH-004 | P0 | Implement field allowlists/redaction and export-safe serialization | AUTH-001, AUTH-002 | Not Started |
| AUTH-005 | P0 | Implement Admin delegation ceiling and anti-self-elevation safeguards | AUTH-001, A13 | Not Started |
| AUTH-006 | P0 | Integrate managed identity, mandatory MFA and session lifecycle | Provider selection, A13 | Not Started |
| AUTH-007 | P0 | Enforce policy across routes, APIs, server actions, jobs and exports | AUTH-002–006 | Not Started |
| AUTH-008 | P0 | Integrate A14 audit events and fail-closed critical mutation behavior | A14, audit foundation | Not Started |
| AUTH-009 | P0 | Implement permission/cache/session invalidation on access changes | AUTH-002, AUTH-006 | Not Started |
| AUTH-010 | P0 | Enforce lead/customer PII legal gate and default-deny data access | Legal/compliance gate | Blocked |
| AUTH-011 | P1 | Add authorization administration and effective-access inspection for permitted roles | AUTH-001–009, A13 | Not Started |
| AUTH-012 | P0 | Complete automated authorization, scope, redaction and privilege-escalation tests | AUTH-001–010, testing standard | Not Started |

## 21. Acceptance tests

All tests are **Not Run** until implementation.

| Test ID | Acceptance criterion | Status |
|---|---|---|
| AUTH-T01 | Four role baselines match owner-approved role boundaries. | Not Run |
| AUTH-T02 | Unknown permission keys and missing scopes are denied by default. | Not Run |
| AUTH-T03 | Explicit deny overrides role and additional grants. | Not Run |
| AUTH-T04 | Create, edit, review, approve, publish and export remain distinct actions. | Not Run |
| AUTH-T05 | Admin can perform routine marketplace operations but cannot change structural definitions. | Not Run |
| AUTH-T06 | Admin cannot grant Super Admin, self-elevate or exceed delegation ceiling. | Not Run |
| AUTH-T07 | Scope checks prevent access to unassigned records at query/service layer. | Not Run |
| AUTH-T08 | Field redaction is enforced in APIs, exports, analytics and page data. | Not Run |
| AUTH-T09 | SEO Manager cannot mutate lender identity, financial facts or source evidence. | Not Run |
| AUTH-T10 | Support is read-only and scope-limited; lead/customer PII is denied until legal gate passes. | Not Run |
| AUTH-T11 | Direct URL/API/server-action/job/export access is independently authorized. | Not Run |
| AUTH-T12 | Role/permission changes refresh or revoke active sessions and caches. | Not Run |
| AUTH-T13 | Last active Super Admin cannot be deactivated or stripped of required access. | Not Run |
| AUTH-T14 | Sensitive actions create durable audit records without secrets. | Not Run |
| AUTH-T15 | Privileged/financial mutations fail closed when required audit persistence is unavailable. | Not Run |
| AUTH-T16 | Mandatory MFA and configured step-up requirements are enforced. | Not Run |
| AUTH-T17 | Multiple role grants cannot bypass explicit deny, scope or legal gates. | Not Run |
| AUTH-T18 | All tests use synthetic data and do not require real customer/lead PII. | Not Run |

## 22. Open owner decisions and implementation gates

The following items remain intentionally unresolved and must be settled before the corresponding implementation:

1. **Permission catalogue finalization:** Super Admin-owned catalogue; exact keys and resource/action mapping to be finalized against the approved page specs.
2. **Scope vocabulary and delegation ceiling:** Approve the proposed All / Assigned / Own / Aggregate scopes and the rule that Admin can delegate only permissions/scopes within their own effective authority.
3. **Authentication provider:** Select a managed identity provider after capability, security, cost and integration review.
4. **Session and step-up policy:** Set maximum session age, re-authentication windows and which sensitive actions require step-up.
5. **Security override controls:** Decide whether any exceptional Super Admin actions require two-person approval after threat modeling; routine Admin publication remains single-operator.
6. **Legal/PII activation:** Lead/customer PII remains blocked until the separate legal/compliance gate is approved.
7. **Retention:** Apply approved A14/security retention classes once legal/security durations are established; no arbitrary duration is assumed.

## 23. Definition of Done

- Owner approves this standard's detailed implementation policy and resolves decisions that materially affect authorization behavior.
- Permission catalogue and role baselines are versioned and centrally managed.
- Every protected execution path enforces authentication, permission, scope, field policy and legal gates server-side.
- Admin delegation, self-elevation and last-Super-Admin protections are verified.
- Role/permission changes invalidate stale access.
- A14 audit capture and fail-closed behavior pass fault-injection tests.
- All P0 acceptance tests pass with recorded evidence; no unresolved critical security issue remains.
- Customer/lead PII remains disabled until its independent legal/compliance gate is satisfied.

**Current state:** Detailed standard drafted; owner approval pending. No authorization code or tests have started.
