# Admin Shell Standard

**Status:** Draft — owner approval pending  
**Last updated:** 2026-11-02  
**Applies to:** All authenticated LoanDhudho administration routes under `/admin`.

## 1. Purpose and principles

The Admin Shell is the persistent application frame around admin pages. It provides predictable navigation, identity/session controls, page context, responsive behavior and consistent access-denied handling without duplicating page-specific business workflows.

Principles:
- Mobile-first, responsive and usable on low-bandwidth connections.
- Navigation reflects effective server-authorized permissions; hiding a link is not security enforcement.
- Keep the four owner-defined roles: Super Admin, Admin, SEO Manager, Sales Executive / Support.
- Preserve a consistent shell while allowing role-specific navigation and page actions.
- Make high-risk actions deliberate and auditable.
- Support English by default and Hindi localization; light and dark themes.
- Do not expose lead/customer PII or lead-management routes before the separate legal/compliance gate.

## 2. Application frame and information architecture

### Desktop layout

1. **Primary sidebar:** product mark/name, role-permitted navigation groups, active route and collapse control.
2. **Top bar:** sidebar toggle, breadcrumb/page context, global search only when separately authorized and implemented, theme control, locale control, notifications only when supported, and user menu.
3. **Main content region:** page title, concise description, primary action slot, optional contextual actions, page content and page-level feedback.
4. **Global feedback region:** accessible announcements for success, validation, warning and system errors.

Sidebar is persistent on wide screens. Collapsed state must retain accessible labels and tooltips. Main content should have a readable maximum width for forms/tables while allowing dense data grids to use available space.

### Mobile and tablet layout

- Sidebar becomes an accessible drawer opened from the top bar.
- Drawer closes after navigation, Escape, backdrop activation or explicit close.
- Main content uses full available width with safe page padding.
- Tables provide responsive card/list presentation or controlled horizontal scrolling; never clip critical actions.
- Sticky page actions may be used only where they do not cover content, keyboard focus or mobile browser controls.
- No essential workflow may depend on hover.

### Route structure

- Shell applies to authenticated `/admin/*` routes.
- Sign-in, invitation acceptance, MFA challenge and recovery screens use an unauthenticated identity layout, not the full operational shell.
- A global not-found page, session-expired page and access-denied page have clear paths back to permitted destinations.
- Deep links must preserve intended destinations only after safe path validation and successful authentication/authorization.

## 3. Navigation model

Navigation is grouped by task and product domain, not by internal database tables. Initial candidate groups:

- **Overview:** Dashboard.
- **Marketplace:** Institutions, Loan Categories, Loan Products, Rates and History, Fees and Charges, Eligibility Rules, Offers.
- **Discovery and SEO:** Intents and Search Mappings, Landing Pages, Content and Guides.
- **Operations:** Leads (hidden and inaccessible while deferred), Users and Roles, Audit Logs.
- **Configuration:** Settings.

Rules:
- Each item has stable route ID, localized label, icon, required permission key and optional feature/legal gate.
- Render only items for which the current effective permission and scope allow access. A feature gate can further restrict availability.
- Do not infer permissions from role name on the client. Obtain a server-authorized navigation model or permission-safe bootstrap payload.
- Parent groups appear only when at least one child is visible.
- Active state follows route hierarchy and remains clear for nested detail/edit routes.
- A user with direct URL access but no permission receives server-side denial, even if a route was previously visible.
- Deferred/disabled features should not appear as active navigation. Do not show a Leads link until its independent gate is approved.
- Navigation labels and icons must have accessible names; icons are supplementary, not the only label.

## 4. Role-aware experience

The shell does not define role permissions; it consumes the centralized Authorization service.

| Role | Shell behavior |
|---|---|
| Super Admin | Show all navigation/actions permitted by effective grants, including structural configuration and user/permission administration. |
| Admin | Show full routine marketplace operations and delegated staff administration within configured authority; hide structural-definition controls. |
| SEO Manager | Show editorial, content, landing-page and permitted aggregate analytics destinations; do not expose canonical lender-fact mutation controls. |
| Sales Executive / Support | Show only assigned-scope product/customer-support destinations and permitted aggregate views; PII remains disabled until legal approval. |

Role-specific dashboards and quick actions are page-owned specifications. The shell must not invent role permissions or broaden scopes.

## 5. Page header and content contract

Every standard admin page should provide:
- Breadcrumbs where useful, with current page announced to assistive technology.
- One clear H1 page title and short purpose description.
- Primary action only when user has the corresponding effective permission.
- Secondary actions grouped without competing with the primary action.
- Optional status/context summary.
- Consistent content spacing and responsive behavior.
- Page-level loading, empty, error, success and denied states.

Long pages should use headings and anchor navigation where it materially improves orientation. Do not place page-specific business rules in the shell.

## 6. Identity, session and user menu

User menu may display:
- Staff display name and verified work-email identity.
- Effective role label and scope summary only when safe and useful.
- Account/profile settings where implemented.
- Session/security information where implemented.
- Sign out.

Authentication and session behavior is governed by the approved Authorization standard and selected managed identity provider. The shell must:
- Respect mandatory MFA for Super Admin/Admin.
- Handle session expiry and revoked sessions promptly.
- Never rely on client-stored role claims as authorization.
- Avoid exposing tokens, secrets or sensitive identity-provider details.
- Confirm destructive account/session actions using accessible confirmation patterns.
- After sign-out, clear application state and navigate to the sign-in flow.

## 7. Global search, notifications and utility controls

These are optional shell slots, not assumed MVP capabilities.

- Global search must not imply cross-domain search exists until implemented and permission-filtered.
- Notifications require a defined event source, recipient policy, read state and retention; otherwise omit the control.
- Theme control switches semantic light/dark themes and persists only through an approved preference mechanism.
- Locale control offers supported locales only; English default and Hindi when translations are reviewed.
- Utility controls must have visible labels or accessible names and keyboard support.

## 8. Design, accessibility and interaction

The shell consumes tokens/components from the Design System standard; it does not establish raw colors or one-off component styles.

Minimum requirements:
- Semantic landmarks: navigation, header and main.
- Logical heading order and a skip-to-content link.
- Keyboard-operable navigation, menus and drawer; visible focus.
- Focus is moved into an opened drawer/dialog and restored on close.
- Escape closes transient menus/drawers when appropriate.
- Screen-reader announcements for route changes and global feedback.
- WCAG 2.2 AA target, including contrast, focus visibility, target size and reflow.
- Respect reduced-motion preference.
- No color-only status or active-route cues.
- Loading skeletons must not cause large layout shifts or trap focus.
- Avoid excessive animation and unnecessary polling.

## 9. Responsive and performance behavior

- Define breakpoints centrally in the Design System; shell must not hard-code divergent breakpoints.
- Avoid loading every page module merely to render navigation.
- Keep navigation bootstrap small and permission-filtered.
- Defer nonessential widgets; avoid layout shifts.
- Tables and forms remain usable at narrow widths and 200% zoom.
- Support keyboard-only and touch input.
- Display an offline/network failure state where a request cannot complete; never imply a mutation succeeded before server confirmation.

## 10. Security and privacy requirements

- Authorization is enforced server-side for every page, API, server action, export, background job and data query.
- Navigation visibility is presentation only and never a security boundary.
- Enforce route-level and resource-level scopes; field redaction must occur before data reaches the client.
- Do not put sensitive data in breadcrumbs, page titles, URLs, browser history, client logs or notifications.
- Do not expose customer/lead names, contact details or lead counts that reveal personal data while the legal gate is closed.
- No lead route, menu item, global search result or shortcut is enabled while A12 remains deferred.
- Avoid caching user-specific navigation/data across identities; partition or invalidate caches on role/session changes.
- Audit security-sensitive shell actions according to Authorization and A14.
- Never request OTP, PIN, password or UPI credentials inside the shell.

## 11. Error, empty and recovery states

The shell must support:
- Loading shell/navigation bootstrap.
- Authenticated user with no permitted destinations: safe access-denied/help route and sign-out.
- Session expired/revoked: clear state and reauthenticate.
- Network unavailable: explain read/write status and provide retry where safe.
- Route not found: return to dashboard or first permitted destination.
- Permission denied: explain lack of access without leaking whether protected records exist.
- Global application failure: show trace/reference ID when available, never raw stack traces or secrets.

## 12. Analytics and audit

Collect only necessary aggregate shell telemetry: navigation destination, interaction category, locale/theme preference changes and client error categories. Avoid raw search text, sensitive route parameters, PII and session tokens. Analytics retention and any personal-data collection require approved privacy policy.

Audit sign-in/session/security events through the identity/security architecture. Ordinary navigation need not create an audit event unless a security requirement explicitly calls for it.

## 13. Dependencies and implementation tasks

Dependencies:
- Approved Authorization standard and final permission catalogue mapping.
- Authentication provider, MFA and session policy decisions.
- Design System tokens, typography, iconography, breakpoints and component primitives.
- API/bootstrap contract for effective navigation permissions.
- Audit event and privacy/retention policy.
- Localization process and reviewed Hindi strings.

| Task ID | Priority | Task | Status |
|---|---|---|---|
| SHELL-001 | P0 | Define route registry and shell layout boundaries for authenticated and identity routes. | Not Started |
| SHELL-002 | P0 | Integrate server-authorized navigation model and permission-safe bootstrap. | Not Started |
| SHELL-003 | P0 | Implement desktop sidebar, top bar, breadcrumbs and content frame. | Not Started |
| SHELL-004 | P0 | Implement responsive mobile drawer and keyboard/focus behavior. | Not Started |
| SHELL-005 | P0 | Implement session-expired, access-denied and safe recovery states. | Not Started |
| SHELL-006 | P1 | Implement role-aware navigation groups without client-side authorization assumptions. | Not Started |
| SHELL-007 | P1 | Integrate theme and locale controls with approved preference handling. | Not Started |
| SHELL-008 | P1 | Implement accessible global feedback and page-header contracts. | Not Started |
| SHELL-009 | P1 | Add safe aggregate shell telemetry and client-error reporting. | Not Started |
| SHELL-010 | P1 | Verify responsive, accessibility, security and performance behavior across admin routes. | Not Started |

## 14. Acceptance tests

All tests are **Not Run** until executed and evidenced.

| Test ID | Expected result |
|---|---|
| SHELL-T01 | Authenticated admin routes share the same shell; identity routes use the separate identity layout. |
| SHELL-T02 | Navigation contains only destinations permitted by the server-authorized effective grants and feature gates. |
| SHELL-T03 | Direct URL/API access to a forbidden destination is denied server-side. |
| SHELL-T04 | Admin sees routine marketplace operations but no structural-definition controls. |
| SHELL-T05 | SEO Manager sees permitted editorial destinations and cannot mutate canonical lender facts. |
| SHELL-T06 | Support sees only assigned-scope permitted destinations; lead/customer PII remains inaccessible. |
| SHELL-T07 | Leads navigation and route remain unavailable while the legal/compliance gate is closed. |
| SHELL-T08 | Parent navigation groups with no visible children are hidden. |
| SHELL-T09 | Active navigation state is correct for list, detail and edit routes. |
| SHELL-T10 | Mobile drawer opens/closes with keyboard, Escape, backdrop and navigation; focus is managed correctly. |
| SHELL-T11 | Skip link, landmarks, headings and focus order are accessible. |
| SHELL-T12 | Shell remains usable at narrow viewport, touch input and 200% zoom. |
| SHELL-T13 | Session expiry/revocation clears protected UI state and requires reauthentication. |
| SHELL-T14 | Role/permission changes invalidate stale navigation and user-specific caches. |
| SHELL-T15 | Global feedback is announced accessibly and does not claim mutation success before server confirmation. |
| SHELL-T16 | Theme and locale controls work without losing current route or introducing untranslated critical UI. |
| SHELL-T17 | Errors do not expose stack traces, secrets, tokens or protected-resource existence. |
| SHELL-T18 | Telemetry contains no PII, raw query text, tokens or sensitive route parameters. |
| SHELL-T19 | Navigation bootstrap is bounded and does not load every page module unnecessarily. |
| SHELL-T20 | All protected shell/page requests enforce server-side authorization regardless of menu visibility. |

## 15. Owner review decisions

Please approve or revise:
1. Persistent desktop sidebar with responsive mobile drawer and a compact top bar.
2. Navigation groups: Overview, Marketplace, Discovery and SEO, Operations, Configuration.
3. Server-authorized navigation model; role labels alone never determine access.
4. Keep Leads entirely hidden and inaccessible until its separate legal/compliance approval.
5. Use the same shell across authenticated admin pages; separate identity layout for sign-in, invitation and MFA.
6. Omit global search and notifications until their data, permissions and privacy contracts are separately defined.
7. Adopt WCAG 2.2 AA as the target, with final component-level details in the Design System standard.

## 16. Definition of Done

- Owner approves shell structure, navigation groups and behavior.
- Design tokens and component contracts are supplied by the Design System standard.
- Every navigation item is permission-safe and every protected request is independently authorized server-side.
- Identity/session lifecycle is integrated with the approved provider and Authorization standard.
- Responsive, keyboard, screen-reader, zoom and theme/locale checks pass.
- No lead/customer PII is exposed while the legal gate remains closed.
- All P0 acceptance tests pass with recorded evidence; no unresolved critical security/accessibility issue remains.

**Current state:** Draft for owner review. No shell code or tests have started.
