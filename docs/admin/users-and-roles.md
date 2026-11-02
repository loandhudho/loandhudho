# A13 — Users and Roles

**Page ID:** A13 / ADM-USERS  
**Route:** /admin/users  
**Priority:** P0 for secure admin launch  
**Specification status:** Owner Approved  
**Implementation status:** Not Started  
**Tests:** 32 acceptance tests defined; all Not Run  
**Last updated:** 2026-11-02

## 1. Purpose
Provide a secure administrative workspace to invite, create, view, update, suspend, deactivate and manage staff accounts; assign owner-defined roles; delegate existing permissions within authority limits; and inspect access-related history. The authorization standard remains the source of truth for permission semantics and server-side enforcement.

## 2. Scope and boundaries
**In scope:** staff user directory, search, filters and pagination; invitations and activation; assignment of the four owner-defined roles; scoped existing permission grants; account lifecycle; role/permission history; session revocation and permission refresh; invitation resend/revoke; aggregate account metrics.

**Out of scope:** defining or editing role types, permission definitions/templates, entity types, status catalogues or global security policies; self-elevation or granting Super Admin by Admin; viewing/resetting passwords or authentication secrets; customer/lead administration before legal approval; public customer registration and social login.

## 3. Owner-defined roles and authority

| Role | User-management authority |
|---|---|
| Super Admin | Full user/access administration; owns role definitions, permission catalogue/templates and structural security settings. |
| Admin | Invite/deactivate operational users and assign existing roles/permissions within configured delegation ceiling. Cannot define roles/permissions, grant Super Admin, self-elevate or change global security structure. |
| SEO Manager | No user administration by default. |
| Sales Executive / Support | No user administration by default. |

Recommended MVP: one primary role per user, with narrowly scoped additional permission grants only where explicitly authorized. If multi-role assignment is later enabled, permission combination must be deterministic and explicit denies, scopes and legal gates must still apply.

## 4. Information architecture
**User list:** display name, masked login identifier, primary role, account status, scope summary, invitation state, last sign-in, last access change and created date. Filters include role, status, invitation state, scope and dates. Search, sorting and pagination must enforce server-side scope and field minimization.

**User detail:** profile and verified login identifier; primary role; read-only effective-permission summary; scope; account/invitation history; safe active/revoked session metadata; recent security and role/permission audit events. Never expose tokens, passwords or secrets.

Actions (view, invite, edit profile, assign role, grant permission, resend/revoke invitation, suspend, reactivate, deactivate, revoke sessions) appear only when permitted, but every operation is independently enforced server-side.

## 5. Core workflows

### Invite a user
1. Authorized operator enters display name, login identifier, existing role and permitted scope.
2. Server validates uniqueness, assignment authority, delegation ceiling and required fields.
3. Create a time-limited, single-use invitation through the approved identity provider.
4. Show state and expiry; permit authorized resend/revoke with throttling.
5. User completes identity verification and sets credentials directly with the provider.
6. Activate only after required verification; audit each transition.

Never expose or store invitation secrets after creation. Never send credentials through the admin UI or logs. Provider, expiry duration and resend limits require approval.

### Change role or permissions
Show current access and proposed effective access. Permit only existing catalogue entries the actor may grant. Server revalidates actor authority, target scope and account state in the same transaction. Require a reason, record before/after state, refresh or revoke sessions immediately, and notify the affected user where configured.

### Suspend, reactivate or deactivate
Suspension blocks new authentication and revokes active sessions. Deactivation is a retained lifecycle state, not deletion. Revoke pending invitations as appropriate. Require reason and confirmation. Prevent deactivation of the last active Super Admin.

### Recover access
Invitation resend/revoke may be administrative. Password reset, MFA recovery and identity verification must use provider self-service or an approved support workflow. An operator must never view, set or communicate passwords, OTPs, PINs or recovery secrets.

## 6. Permission and scope model
Use permission-based authorization, not scattered role-name checks. Candidate permission identifiers (proposed, not final) are: users.view, users.invite, users.edit_profile, users.assign_role, users.assign_permissions, users.suspend, users.deactivate, users.reactivate, users.revoke_sessions and users.view_access_history.

Super Admin owns permission definitions and templates. A13 assigns only existing catalogue entries. Candidate scopes are all admin users, assigned organizational/team scope, own account and read-only aggregate; the final vocabulary is centrally defined. Admin may grant only permissions and scopes within their current delegation ceiling. Admin cannot grant Super Admin or elevate themselves.

Every protected operation checks actor identity/status, effective permission, scope, target resource, legal gate and step-up requirements on the server. Deny by default. Never trust client-submitted actor IDs, role claims, permission lists or audit fields.

## 7. Account security
- Integrate an approved authentication provider; do not build password storage or credential handling in A13.
- Require MFA for Super Admin and Admin before privileged operations; exact provider/method policy awaits approval.
- Require recent re-authentication/step-up for high-risk role, permission, suspension and session actions.
- Use single-use expiring invitations, resend throttling and anti-enumeration behavior.
- Apply secure session handling, CSRF protection where applicable, rate limiting and brute-force protections through the identity layer.
- Role/permission changes invalidate stale authorization caches and promptly revoke or refresh sessions.
- Audit actor, target, action, time, outcome, reason, correlation ID and safe before/after values. Never log secrets or authentication factors.
- Prevent last-Super-Admin lockout; use transactions/concurrency controls for simultaneous changes.
- Notify users of material access changes where configured.

## 8. Logical data model proposal
- **AdminUser:** id, authProviderSubject, displayName, normalizedLoginIdentifier, status, primaryRoleId, createdAt, updatedAt, lastSignInAt, deactivatedAt.
- **RoleDefinition:** Super Admin-owned versioned role catalogue.
- **PermissionDefinition:** Super Admin-owned stable key, resource/action, risk and audit/step-up metadata.
- **RolePermission:** versioned role-to-permission mapping and default scope.
- **UserPermissionGrant:** userId, permissionKey, scope, grantedBy, reason, effectiveFrom, expiresAt, revokedAt.
- **UserInvitation:** userId, destination, token hash/reference, status, expiresAt, sentAt, acceptedAt, revokedAt.
- **UserSessionReference:** provider session reference, userId, timestamps and revokedAt; never raw credentials.
- **UserAccessEvent:** actor, target, event, safe before/after diff, reason, outcome, timestamp and correlation ID.

Logical proposal only; align with chosen identity provider and approved authorization schema. Enforce unique normalized login identifiers, foreign keys, transactions and immutable security history.

## 9. API/server action contract
Operations: scoped list/search; user detail/effective-access summary; create/resend/revoke invitation; permitted profile update; assign role/grants; suspend/reactivate/deactivate; revoke sessions; inspect safe session metadata; read access history.

Every mutation re-fetches actor permissions, verifies target scope and delegation ceiling, validates state transitions and writes audit events transactionally. Return consistent validation, forbidden, conflict, not-found and rate-limit errors without leaking protected account existence. Do not accept client-supplied actor IDs, effective permissions or audit values.

## 10. Lifecycle and edge cases
Invitation states: Pending, Accepted, Expired, Revoked, Delivery Failed. Account states: Invited, Active, Suspended, Deactivated. Suspended/deactivated accounts cannot authenticate or use existing sessions. Re-inviting an active account must not create a duplicate. Login identifier changes require re-verification. Permission changes take effect promptly. Concurrent updates must not silently overwrite. Do not deactivate/delete the last active Super Admin. Bulk import is deferred for MVP due to identity and privilege risks.

## 11. Privacy and compliance
A13 is for staff/admin accounts only. Customer and lead PII remain unavailable until the legal/compliance gate and separate A12 approval. Minimize profile fields to display name and verified work login identifier. Do not collect home address, government identity numbers, banking details or unrelated demographics. Define retention/deletion for invitations and inactive accounts with legal/security review. Access-history exports require separate permission and audit.

## 12. UX, accessibility and localization
Mobile-first list/detail views; role/permission editing uses a clear full-page flow. English default, Hindi UI localization when released; role names and permission keys remain stable machine identifiers. Light/dark themes use semantic tokens. Tables, filters and dialogs must be keyboard accessible and announce errors/status changes. Confirmation dialogs explain the impact of suspension, deactivation and session revocation.

## 13. Analytics and audit
Aggregate metrics may include active staff by role, pending/expired invitations, suspended accounts and recent access changes. Restrict detailed history to authorized operators. Audit invitations, acceptance, role/permission/scope changes, status changes, session revocation, failed privileged actions and delegation-ceiling violations. Ordinary Admin cannot modify/delete audit history.

## 14. Dependencies
Approved authentication provider and identity lifecycle; authorization standard and final permission/scope/delegation policy; A14 Audit Logs; admin shell, API conventions, notification delivery and session/security standards; staff identity retention policy. A13 must not activate A12 Leads or customer data.

## 15. Implementation tasks

| Task | Description | Priority | Status |
|---|---|---:|---|
| ADM-USER-001 | Confirm identity provider and lifecycle integration | P0 | Not Started |
| ADM-USER-002 | Finalize permission keys, scopes and delegation ceiling | P0 | Not Started |
| ADM-USER-003 | Define user, invitation, grant and access-event models | P0 | Not Started |
| ADM-USER-004 | Implement scoped user list, search and filters | P1 | Not Started |
| ADM-USER-005 | Build user detail and effective-access summary | P1 | Not Started |
| ADM-USER-006 | Implement secure invite, accept, resend and revoke | P0 | Not Started |
| ADM-USER-007 | Implement role assignment and authority validation | P0 | Not Started |
| ADM-USER-008 | Implement delegated permission grants and expiry | P0 | Not Started |
| ADM-USER-009 | Implement suspend, reactivate and deactivate | P0 | Not Started |
| ADM-USER-010 | Implement session revocation and permission refresh | P0 | Not Started |
| ADM-USER-011 | Enforce MFA/step-up for privileged operations | P0 | Not Started |
| ADM-USER-012 | Implement immutable access audit and reason capture | P0 | Not Started |
| ADM-USER-013 | Prevent self-elevation and last-Super-Admin lockout | P0 | Not Started |
| ADM-USER-014 | Notify users of material access changes | P2 | Not Started |
| ADM-USER-015 | Add pagination and accessible list states | P1 | Not Started |
| ADM-USER-016 | Add aggregate metrics and restricted history view | P2 | Not Started |
| ADM-USER-017 | Add retention and invitation-expiry cleanup | P1 | Not Started |
| ADM-USER-018 | Add responsive, localized and theme-aware UI | P1 | Not Started |

## 16. Acceptance tests
All tests are Not Run until implementation exists.

| Test | Expected result | Status |
|---|---|---|
| ADM-USER-T01 | Super Admin can invite an Admin | Not Run |
| ADM-USER-T02 | Admin invitation respects delegation ceiling | Not Run |
| ADM-USER-T03 | SEO Manager cannot access user administration | Not Run |
| ADM-USER-T04 | Support has no default user-admin access | Not Run |
| ADM-USER-T05 | Admin cannot create/rename/redefine roles | Not Run |
| ADM-USER-T06 | Admin cannot edit permission definitions/templates | Not Run |
| ADM-USER-T07 | Admin cannot grant Super Admin | Not Run |
| ADM-USER-T08 | User cannot grant permissions they do not hold | Not Run |
| ADM-USER-T09 | User cannot expand recipient scope beyond own ceiling | Not Run |
| ADM-USER-T10 | Self-elevation/self-grant is denied | Not Run |
| ADM-USER-T11 | Duplicate normalized login identifier is rejected | Not Run |
| ADM-USER-T12 | Invitation is single-use, expires and can be revoked | Not Run |
| ADM-USER-T13 | Resend invitation is throttled and audited | Not Run |
| ADM-USER-T14 | Invitation acceptance requires identity verification | Not Run |
| ADM-USER-T15 | Passwords, OTPs and recovery secrets are never visible | Not Run |
| ADM-USER-T16 | Suspension revokes active access and sessions | Not Run |
| ADM-USER-T17 | Deactivated account cannot authenticate | Not Run |
| ADM-USER-T18 | Last active Super Admin cannot be deactivated | Not Run |
| ADM-USER-T19 | Role change invalidates stale permissions/sessions | Not Run |
| ADM-USER-T20 | Privileged mutation requires configured MFA/step-up | Not Run |
| ADM-USER-T21 | Unauthorized direct API mutation is denied | Not Run |
| ADM-USER-T22 | Cross-scope user access is denied | Not Run |
| ADM-USER-T23 | Concurrent role updates do not silently overwrite | Not Run |
| ADM-USER-T24 | Before/after access change and reason are audited | Not Run |
| ADM-USER-T25 | Ordinary Admin cannot edit audit history | Not Run |
| ADM-USER-T26 | Failed privilege escalation is safely recorded | Not Run |
| ADM-USER-T27 | Customer/lead PII remains unavailable before legal gate | Not Run |
| ADM-USER-T28 | Search/filters enforce scope and field limits | Not Run |
| ADM-USER-T29 | Access-history export requires permission and audit | Not Run |
| ADM-USER-T30 | Invitation cleanup preserves required audit records | Not Run |
| ADM-USER-T31 | UI is keyboard accessible and announces errors | Not Run |
| ADM-USER-T32 | List/detail work on mobile and light/dark themes | Not Run |

## 17. Owner decisions

The owner approved the documented A13 proposals on 2026-11-02:

1. **Authentication:** Approved managed identity/authentication rather than custom credential handling. The specific provider remains an implementation selection and security review item.
2. **Role assignment:** Approved one primary role per staff user for MVP; scoped additional grants may be introduced only where required and governed by the central permission model.
3. **Scope and delegation:** Approved the principle that Admin may grant only permissions and scopes within their own effective authority and may never grant Super Admin or elevate themselves. Super Admin owns the permission catalogue and delegation structure.
4. **MFA:** Approved mandatory MFA for all Super Admin and Admin accounts, with step-up authentication for sensitive actions where supported.
5. **Invitations:** Approved verified work email, single-use invitations, configurable expiry and throttled resend. Exact expiry values remain a configuration/security decision.
6. **Admin account management:** Approved Admin operational suspension/deactivation of other staff/Admin accounts only within the configured delegation ceiling, with Super Admin safeguards and protection of the last active Super Admin.
7. **Notifications:** Approved notifying affected users of role, permission, suspension and deactivation changes, without exposing secrets.
8. **Retention:** Approved deactivation rather than routine hard deletion, retaining only minimum necessary audit evidence under the approved legal/security retention policy; no arbitrary retention duration is set here.

## 18. Owner approval record

- **Decision:** A13 Users and Roles specification and its documented implementation task scope approved.
- **Approved on:** 2026-11-02.
- **Implementation:** Not started. Task scope is authorized for implementation only after authentication, authorization, security and shared standards/dependencies pass their gates.
- **Testing:** All 32 acceptance tests remain Not Run.
- **Boundary:** Staff-account administration only; customer/lead PII remains disabled pending separate legal/compliance approval.

## 18. Definition of Done and implementation gate
Identity provider and session lifecycle selected; permission catalogue, scopes and delegation ceiling approved; all operations enforce permissions/scope server-side; invitation and lifecycle flows audited; MFA/step-up, session invalidation, self-elevation and last-Super-Admin safeguards pass; lead/customer PII remains gated; all P0/P1 tests pass with evidence and no unresolved security blocker.

**Current status:** Documented — Owner Approval Pending.  
**Owner approval:** Pending.  
**Implementation:** Not Started.  
**Testing:** 32 acceptance tests defined; all Not Run.

No implementation begins until this specification, authorization standard and authentication/security dependencies are approved.
