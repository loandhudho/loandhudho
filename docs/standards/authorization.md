# LoanDhudho — Admin Authorization and Role Standard

**Status:** Drafted from owner-provided role definitions; owner approval pending  
**Last updated:** 2026-11-02  
**Scope:** All admin routes, APIs, server actions, dashboards, data exports and future admin modules.

## 1. Owner-defined role hierarchy

LoanDhudho will start with four named admin roles. This replaces the earlier provisional Super Admin / Editor / Reviewer / Support-Analyst role vocabulary in page drafts.

| Role | Primary responsibility | Authority boundary |
|---|---|---|
| **Super Admin** | Owns system-level configuration and data structures | Can define controlled options, statuses, entity types, role definitions and permission templates. Highest administrative authority. |
| **Admin** | Runs day-to-day application and marketplace operations | Can manage institutions, products, users and assign permissions from the approved permission catalogue. Cannot redefine system-level structures or grant Super Admin authority. |
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
| Manage institutions and lender records | Full | Create/edit/manage within approved workflows | Read approved public-facing data only | Read product-facing information only |
| Manage loan products and financial source records | Full | Create/edit/manage; review/publish according to delegated permissions | Edit presentation/content fields only; no source-of-truth rate/fee/eligibility changes | Read approved product information; no edits to financial facts |
| Manage rates, fees and eligibility facts | Full | Operational management with evidence and review controls | No | No |
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

- Where practical, the person who creates a material financial-data record should not be its sole approver/publisher.
- Admin's ability to approve/publish is an explicit delegated permission, not automatic from the role name.
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
2. Whether Admin can approve/publish institution/product/financial records must be explicitly configured per action; it is not implied by the Admin role.
3. Lead access remains disabled until legal/compliance approval.
4. Two-person approval for selected Super Admin actions is recommended for security review; final scope can be set in the security design.

No authorization implementation should begin until this standard and the relevant page specifications are approved.
