# LoanDhudho Design System Standard

**Status:** Owner Approved — implementation dependencies remain  
**Last updated:** 2026-11-02  
**Applies to:** Public website, authenticated admin application, shared components and design tokens.

## 1. Purpose and principles

Establish one accessible, responsive and maintainable visual language across LoanDhudho. The public marketplace and admin application share foundations but may use different density and interaction patterns.

Principles:
- Clarity before decoration; financial facts, conditions, source and verification date must be easy to understand.
- Trust through provenance and honest uncertainty; never imply an indicative estimate is a lender quote or approval.
- Mobile-first, low-bandwidth resilient and usable on common Indian devices.
- Accessible by default, targeting WCAG 2.2 AA.
- Consistent semantic tokens, reusable components and documented variants rather than page-specific styling.
- English default with Hindi support, including reliable Devanagari rendering.
- Light and dark themes; preserve contrast and meaning in both.
- Admin navigation and actions reflect effective permissions, but server-side authorization remains authoritative.
- Minimize personal data in every interface. Lead/customer PII and lead-management UI remain disabled pending separate legal/compliance approval.

## 2. Product surfaces and density

### Public marketplace
- Calm, confidence-building presentation with readable content, prominent search and comparison.
- Prioritize product facts, lender identity, conditions, fees, eligibility, source and last-verified date.
- Use comfortable reading widths and touch-friendly controls.
- Sponsored content must be unmistakably labeled and visually distinct from organic ranking.

### Admin application
- Operational, information-dense layouts with consistent page headers, filters, tables and action placement.
- Support wide data tables without forcing the entire application into a narrow fixed width.
- Keep destructive and financial publication actions deliberate and clearly named.
- Use the approved Admin Shell standard for navigation and responsive frame.

### Shared identity
- Use the approved brand mark and wordmark assets when supplied. Do not invent or redraw a logo in implementation.
- Brand color values remain configurable design tokens until the owner approves final brand palette values.

## 3. Color and semantic tokens

Use semantic tokens, not raw color values in component styles. Define light and dark values for every token. Initial palette direction for owner review: restrained blue/indigo as the primary action family, neutral slate surfaces, and restrained teal/green for positive states. This is a direction, not approval of exact brand colors.

Required token groups:
- Brand: `brand.primary`, `brand.primaryHover`, `brand.primaryActive`, `brand.onPrimary`, `brand.subtle`.
- Surfaces: `surface.canvas`, `surface.default`, `surface.raised`, `surface.sunken`, `surface.overlay`.
- Text: `text.primary`, `text.secondary`, `text.muted`, `text.inverse`, `text.link`.
- Borders: `border.default`, `border.strong`, `border.focus`, `border.subtle`.
- States: `state.success`, `state.warning`, `state.danger`, `state.info`, with corresponding subtle backgrounds and on-state text.
- Data: neutral series palette with sufficient distinction; never communicate meaning by color alone.

Rules:
- Text and interactive controls meet WCAG 2.2 AA contrast requirements in each theme.
- Statuses include text or icons plus color; do not rely on color alone.
- Financial comparison highlights must not suggest a recommendation solely through green/red coloring.
- Do not use red/green as the only distinction for rate movement or eligibility.
- Charts must provide labels, legends or accessible data alternatives.
- Disabled controls remain legible and distinguishable; do not reduce opacity to the point of unreadability.
- Focus indicators use a dedicated visible token and are never removed without an equivalent.

## 4. Typography and localization

- Use a modern system sans-serif stack initially; select and bundle a production font only after licensing, performance and Devanagari glyph coverage are verified.
- Font stack must render Latin and Devanagari consistently. Test conjuncts, matras, numerals and mixed English/Hindi strings.
- Avoid synthetic bold or clipped glyphs. Allow line-height and control height to accommodate Devanagari.
- Use a documented type scale: display, page title, section title, subsection, body, body-small, label, caption and numeric emphasis.
- Body text should remain comfortably readable; do not use tiny text for material fees, caveats or verification metadata.
- Use tabular numerals for rates, amounts, tenures and comparison columns where supported.
- Hindi is LTR; no RTL layout is required for the currently supported locales.
- All visible UI strings must be localized through message keys; no hard-coded strings in reusable components.
- Content translation must preserve financial meaning, units, conditions and legal disclaimers. Native review is required for material Hindi financial/legal copy.

## 5. Spacing, sizing and layout

Use a consistent 4-point base spacing scale (4, 8, 12, 16, 24, 32, 40, 48, 64). Components may use documented exceptions only where necessary.

- Use a responsive container with readable maximum width for editorial content and fluid width for comparison/data tables.
- Align page titles, primary actions, filters and content consistently.
- Establish predictable vertical rhythm between labels, controls, help text, validation and sections.
- Minimum interactive target: 24 by 24 CSS pixels where WCAG 2.2 AA permits; aim for 44 by 44 CSS pixels for primary touch interactions.
- Never rely on hover as the only way to discover or operate a control.
- Support 200% zoom and reflow without loss of information or two-dimensional scrolling except for inherently tabular data where a contained horizontal scroll is acceptable and alternatives are provided.

Responsive breakpoints are implementation tokens, initially:
- Small: below 640px
- Medium: 640px to 1023px
- Large: 1024px to 1279px
- Extra large: 1280px and above

Breakpoints are starting values, not device-specific assumptions. Components must respond to available space, not only device labels.

## 6. Component library and variants

Build reusable components with semantic HTML and documented variants. Prefer the existing stack and shadcn/ui patterns where compatible; inspect repository conventions before adding dependencies.

### Actions and navigation
- Button: primary, secondary, tertiary/ghost, destructive, and link variants; sizes; loading and disabled states.
- Link: distinguish navigation from actions; preserve visible focus and meaningful labels.
- Breadcrumbs, tabs, pagination, sidebar items and mobile drawer follow the approved Admin Shell behavior.
- Icon-only controls require accessible names and tooltips where helpful.
- Do not use ambiguous labels such as “Click here” or icon-only destructive actions.

### Form controls
- Text input, textarea, select/combobox, checkbox, radio, switch, date/time, file upload and search field.
- Every control has a programmatic label, required/optional indication, help text association and error association.
- Validate on the server regardless of client validation. Preserve user input after recoverable errors.
- Show field-level errors and a concise form-level summary for multi-field failures.
- Explain units and expected formats at entry points (e.g. annual percentage, INR, months).
- Do not use placeholder text as the only label.
- Confirm irreversible or high-impact actions with a dialog that states the consequence and target.

### Feedback and overlays
- Alert/banner: info, success, warning and error.
- Toast: brief non-critical feedback only; never the sole location for important errors or audit-relevant outcomes.
- Dialog, confirmation dialog, drawer, popover and tooltip must manage focus, Escape behavior, focus return and accessible naming.
- Skeletons communicate loading structure; avoid layout shifts.
- Empty, no-results, permission-denied, offline and recoverable-error states must explain what happened and the next safe action.

### Data display
- Cards, definition lists, tables/data grids, badges, status indicators, accordions and comparison panels.
- Tables require semantic headers, row/column relationships, keyboard support for interactive cells and responsive overflow behavior.
- Sorting state and pagination state must be announced accessibly.
- Use badges sparingly and always pair status color with text.
- Bulk actions clearly state selected-record count and scope.

### Content and media
- Rich content uses allowlisted typed blocks, safe links and approved media handling.
- No arbitrary HTML, JavaScript, embedded scripts or unsafe third-party widgets in CMS content.
- Images require meaningful alt text or decorative treatment; captions and attribution where applicable.
- Upload controls show accepted file types, size limits and upload/processing/error states.

## 7. Financial data presentation

Financial information requires consistent units and explicit context:
- Display rates as percentages with annual/monthly basis and rate type where known; do not label nominal rate as APR.
- Keep rate ranges, conditional bands, benchmark, spread and reset frequency distinct.
- Show amount, tenure and fee units explicitly. Format INR using Indian grouping (e.g. ₹1,00,000) and avoid ambiguous shorthand in critical values.
- Fees identify basis, tax inclusion, timing, payee and conditions where known.
- Distinguish zero, not applicable, not disclosed, unknown, unverified, stale and unavailable. Never render missing data as zero.
- Display lender/source attribution and last-verified date near material facts; distinguish source effective date from verification date.
- Expired offers must not appear as currently available.
- Comparison rows align equivalent units and conditions; explain non-comparable values.
- Estimates/calculators show assumptions, formula inputs and an indicative-only notice. Never imply approval or guaranteed rates.
- Sponsored placements are labeled and do not alter factual comparison values or organic rankings.

## 8. Date, time, number and currency conventions

- Currency: INR, displayed with ₹ and Indian digit grouping.
- Percentages: retain source precision; avoid false precision or rounding that changes comparison.
- Tenure: explicit months/years; normalize internally without losing source wording.
- Store timestamps in UTC; display operational timestamps in Asia/Kolkata (IST) unless a user-facing context explicitly requires another timezone.
- Display dates in a clear India-friendly format and include time zone where time matters.
- Separate effective date, publication date, expiry date and last-verified date.
- Parse and format locale-aware values; do not rely on browser defaults for financial precision.

## 9. Accessibility and interaction behavior

Target WCAG 2.2 AA across public and admin surfaces.

- Full keyboard operation; logical tab order; no keyboard traps.
- Visible focus indicator with adequate contrast and spacing.
- Correct landmarks, headings, labels, descriptions, names, roles and states.
- Screen-reader announcements for validation, async updates, table sorting, pagination and status changes.
- Dialogs and drawers trap focus appropriately, close with Escape when safe, and return focus to the trigger.
- Touch targets meet WCAG minimum and aim for 44px for common mobile actions.
- Contrast requirements apply to text, controls, focus and meaningful graphical elements.
- Respect reduced-motion preferences; no essential information conveyed only through animation.
- Avoid flashing and unnecessary motion.
- Support 200% zoom, text resizing and reflow; do not clip Devanagari or validation text.
- Provide captions/transcripts for meaningful audio/video content.
- Test with keyboard-only use and representative screen readers, not automated checks alone.

## 10. Responsive, performance and resilience

- Mobile-first layouts; prioritize search, core loan facts and comparison actions on small screens.
- Tables may use contained horizontal scrolling with persistent context or an accessible stacked presentation; do not silently hide material columns.
- Admin mobile navigation uses the approved drawer; page-level actions remain discoverable.
- Optimize fonts and images; avoid loading large decorative assets on initial view.
- Prefer server-rendered content for indexable public pages and progressively enhance interactive controls.
- Avoid blocking critical content on analytics or nonessential third-party scripts.
- Provide usable loading, offline/network failure and retry states.
- Respect low-bandwidth connections and reduced-data choices where available.
- Prevent layout shifts by reserving media and loading dimensions.

## 11. Admin-specific behavior and privacy

- Use the approved Admin Shell and centralized Authorization standard.
- Navigation, actions, records and fields are rendered according to effective server-authorized permissions and scope; UI visibility is not a security boundary.
- Unauthorized requests must be denied server-side.
- Mask or omit personal data unless a separately approved purpose and permission exist.
- Lead/customer PII, lead routes, lead capture and sharing remain disabled pending legal/compliance approval.
- Do not display secrets, credentials, OTPs, PINs, passwords or UPI credentials.
- Audit sensitive actions; confirmation and feedback must not expose restricted before/after values to unauthorized users.
- SEO Manager may edit editorial presentation but not canonical lender financial facts.

## 12. Design tokens and implementation contract

- Centralize tokens for color, typography, spacing, radius, elevation, borders, focus, motion and breakpoints.
- Components consume semantic tokens; page styles must not introduce unreviewed raw palette values.
- Theme switching must not change content, permissions or financial meaning.
- Persist theme/locale only through approved application preferences and privacy practices.
- Provide documented component variants and states; avoid one-off variants without design review.
- Keep shared primitives independent of page business logic.
- Use CSS variables or the project's established token mechanism; do not introduce a second competing styling system.
- Ensure SSR and hydration render the correct theme without avoidable flashes.

## 13. Implementation tasks

All tasks are **Not Started** until implementation begins.

| Task | Priority | Scope | Status |
|---|---|---|---|
| DS-001 | P0 | Establish semantic token architecture for light/dark themes | Not Started |
| DS-002 | P0 | Define typography, Devanagari font fallback and locale-safe rendering | Not Started |
| DS-003 | P0 | Implement spacing, layout, container and responsive breakpoint tokens | Not Started |
| DS-004 | P0 | Build accessible action, navigation and form primitives | Not Started |
| DS-005 | P0 | Build feedback, dialog, drawer, loading and error-state primitives | Not Started |
| DS-006 | P0 | Build tables, badges, comparison and financial-value presentation primitives | Not Started |
| DS-007 | P1 | Implement public/admin component variants and density rules | Not Started |
| DS-008 | P1 | Implement localization and INR/IST formatting utilities | Not Started |
| DS-009 | P1 | Add safe CMS content/media primitives and upload states | Not Started |
| DS-010 | P1 | Add chart/data visualization accessibility patterns | Not Started |
| DS-011 | P1 | Integrate privacy-safe field masking with authorization decisions | Not Started |
| DS-012 | P1 | Verify SSR theme behavior, performance and low-bandwidth resilience | Not Started |
| DS-013 | P0 | Complete keyboard, screen-reader, contrast, zoom and responsive accessibility review | Not Started |

## 14. Acceptance tests

All tests begin as **Not Run**.

| Test | Expected result |
|---|---|
| DS-T01 | Light and dark themes meet contrast requirements for text, controls and focus. |
| DS-T02 | Components use semantic tokens; no unapproved hard-coded palette values are introduced. |
| DS-T03 | Latin and Devanagari text, conjuncts, matras and mixed strings render without clipping. |
| DS-T04 | All controls have programmatic labels, descriptions and error associations. |
| DS-T05 | All primary interactions work with keyboard only and show visible focus. |
| DS-T06 | Dialogs/drawers manage focus, Escape and focus return correctly. |
| DS-T07 | Status and chart meaning are not communicated by color alone. |
| DS-T08 | 200% zoom and reflow preserve content and functionality. |
| DS-T09 | Mobile touch targets meet minimum requirements and common actions are comfortably usable. |
| DS-T10 | Reduced-motion preference is respected. |
| DS-T11 | Table headers, sort state and pagination are accessible to assistive technology. |
| DS-T12 | INR values use Indian grouping and explicit currency; rate and tenure units are visible. |
| DS-T13 | Zero, missing, undisclosed, unknown, unverified, stale and not-applicable values render distinctly. |
| DS-T14 | Rate type, basis, conditions, source and verification date remain visible where required. |
| DS-T15 | Indicative calculator results are not presented as lender quotes or approval guarantees. |
| DS-T16 | Sponsored placements are clearly labeled and separate from factual ranking. |
| DS-T17 | Admin navigation/actions follow effective permissions and unauthorized server requests are denied. |
| DS-T18 | Lead/customer PII and lead-management UI remain inaccessible pending legal/compliance approval. |
| DS-T19 | Loading, empty, no-results, offline, error and denied states provide safe next steps. |
| DS-T20 | Theme and locale changes do not alter permissions or financial meaning. |
| DS-T21 | Public critical content remains usable when nonessential analytics/scripts fail. |
| DS-T22 | Upload and CMS content components reject unsupported or unsafe content types. |
| DS-T23 | SSR/hydration does not create material theme flash or layout instability. |
| DS-T24 | Keyboard and representative screen-reader testing finds no blocking accessibility defects. |

## 15. Owner review decisions

Please approve or revise these proposed foundations:
1. One shared semantic design system for public and admin, with distinct density and component variants.
2. Initial palette direction: restrained blue/indigo primary, neutral slate surfaces and restrained semantic state colors; exact brand values remain configurable pending brand approval.
3. Light and dark themes, English default and Hindi/Devanagari support; Hindi remains LTR.
4. 4-point spacing scale and proposed responsive breakpoints (640, 1024 and 1280 CSS pixels).
5. WCAG 2.2 AA target, 200% zoom/reflow, keyboard and screen-reader requirements.
6. Financial display rules, Indian INR grouping, IST display and UTC storage.
7. Use existing project conventions and shadcn/ui-compatible patterns where suitable; no new competing styling system.
8. Lead/customer PII and lead UI remain disabled pending separate legal/compliance approval.

## 16. Approval and implementation record

- **Owner decision:** Approved as documented on 2026-11-04.
- **Implementation:** Not started.
- **Testing:** All 24 acceptance tests remain Not Run.
- Approval of this standard will authorize detailed component/token implementation planning only; it does not authorize feature coding that is blocked by other shared standards, page approvals, authentication/security decisions or legal/compliance gates.
