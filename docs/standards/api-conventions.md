# LoanDhudho — API Conventions Standard

**Status:** Draft — Owner Review Pending  
**Last updated:** 2026-11-04  
**Applies to:** Internal application APIs, route handlers, server actions and service boundaries.  
**Implementation:** Not Started

## 1. Purpose and principles

Define consistent contracts for validation, responses, errors, authorization, pagination, audit and compatibility.
- Server-side authorization and validation are mandatory; client checks are convenience only.
- Contracts are explicit, typed, documented and versionable.
- Fail closed for protected or integrity-sensitive operations.
- Never leak secrets, PII, stack traces or protected-resource existence.
- Financial values preserve exact units, decimal precision, source and version context.
- Mutations are protected against accidental duplicate submission where practical.
- Expose only data authorized for the caller's scope.
- No lead capture, lead transmission or customer PII endpoints before separate legal/compliance approval.

## 2. API surface and route conventions

- Use /api/v1 for versioned HTTP APIs; admin APIs use /api/v1/admin.
- Prefer server-side service calls for internal page data when an HTTP boundary is unnecessary; do not create redundant endpoints solely for server-to-server calls within the app.
- Use plural resource nouns and HTTP methods for standard CRUD semantics. Use lowercase kebab-case path segments.
- Use query parameters for filters, sorting, pagination and representation options. Never place secrets or sensitive personal data in URLs.
- Resource identifiers are opaque and do not encode personal or financial data.
- Keep route handlers thin: parse/validate, establish identity, authorize, invoke domain services, map results/errors and emit safe telemetry.
- Domain rules belong in service/domain layers, not duplicated in route handlers.

Examples: GET /api/v1/institutions; GET /api/v1/institutions/{institutionId}; POST /api/v1/admin/institutions; PATCH /api/v1/admin/institutions/{institutionId}.

## 3. HTTP methods and status codes

- GET is read-only and safe.
- POST creates a resource or executes a documented command.
- PUT is full replacement only; PATCH is partial update with documented semantics.
- DELETE is reserved for genuinely deletable records; prefer archive, withdraw or deactivate for auditable financial records.

Use conventional status codes: 200 success; 201 created (include Location where appropriate); 202 accepted but not complete; 204 success with no body; 400 malformed request; 401 unauthenticated; 403 authenticated but forbidden; 404 absent or safely concealed resource; 409 state/version conflict; 410 permanently unavailable where safe; 412 failed precondition; 413 body too large; 415 unsupported media type; 422 domain validation failure; 429 rate limit; 500 unexpected failure; 503 temporary outage.

Never return 200 for failed operations or claim a queued job is complete.

## 4. Request conventions

- JSON uses application/json with UTF-8 unless a documented file contract applies.
- Validate content type, body size, path/query parameters and body schema server-side.
- Reject unknown writable fields for sensitive/admin mutations; never silently accept protected-field assignment.
- Validate identifiers, enums, dates, numbers, arrays, string lengths, collection sizes and numeric bounds at the boundary.
- Use ISO 8601 dates/timestamps. Date-only fields remain date-only; timestamps include timezone/offset and normalize to UTC for storage.
- Use explicit units in field names or schema metadata, e.g. annualRatePercent, tenureMonths, amountInr.
- Represent financial decimals as decimal strings in JSON where floating-point could alter value. Define precision/scale; reject NaN and Infinity.
- Never trust client-supplied actor identity, role, permission scope, approval identity or audit actor.
- Recompute or validate client-supplied totals and publication state in domain logic.

## 5. Response conventions

Use explicit DTOs/serializers and field allowlists. Do not expose database/ORM records directly.

Successful collection example:
    {
      "data": [],
      "meta": {
        "requestId": "opaque-request-id",
        "pagination": { "nextCursor": null, "hasMore": false }
      }
    }

Successful resource example:
    {
      "data": { "id": "opaque-id" },
      "meta": { "requestId": "opaque-request-id" }
    }

Rules:
- data contains only fields authorized for caller and scope.
- meta contains non-sensitive operational metadata.
- Omit unavailable optional fields or use explicit domain states; never fabricate defaults.
- Include stable IDs and version/effective-date metadata where needed for financial records.
- Do not mix success and error payloads.

## 6. Error contract

Use a consistent problem-details style based on RFC 9457 concepts. Example:
    {
      "type": "https://loandhudho.in/problems/validation-error",
      "title": "Request validation failed",
      "status": 422,
      "detail": "One or more fields need attention.",
      "code": "VALIDATION_FAILED",
      "requestId": "opaque-request-id",
      "fieldErrors": [
        { "field": "annualRatePercent", "code": "OUT_OF_RANGE",
          "message": "Enter a valid annual rate." }
      ]
    }

- type and code are stable machine identifiers; messages are localized.
- Never include stack traces, SQL, tokens, secrets, raw provider errors or unredacted request bodies.
- Validation errors identify safe field paths and actionable corrections.
- Use generic 404 for protected resources when existence disclosure is unsafe.
- Map domain conflicts to stable codes such as VERSION_CONFLICT, DUPLICATE_RECORD and INVALID_STATE_TRANSITION.
- Log internal diagnostic details securely with request ID correlation and redaction.

## 7. Authentication and authorization

- Authentication/session behavior follows the approved Authorization standard and selected identity provider; this standard does not choose the provider.
- For cookie-based browser sessions, use Secure, HttpOnly and appropriate SameSite cookies, plus CSRF protection on state-changing requests. Never put session tokens in local storage or URLs.
- Verify origin/CSRF protections according to the chosen framework and deployment model.
- Every protected read and mutation authorizes server-side through the centralized authorization decision service.
- Check action permission, resource scope (All/Assigned/Own/Aggregate), feature/legal gates and field-level redaction.
- Enforce authorization in routes, server actions, service boundaries, exports, jobs and analytics queries. Hidden UI is not security.
- Deny by default. Never trust role names, client claims, request headers or submitted actor IDs.
- Re-check permission and resource state at mutation time and when background jobs execute.
- Sensitive/financial mutations fail closed if required audit/authorization infrastructure is unavailable.
- No endpoint exposes lead/customer PII before separate legal/compliance approval.

## 8. Pagination, filtering and sorting

- Use cursor pagination for large or changing collections. Offset pagination is acceptable for small, stable admin lists when justified.
- Bound page size with documented default and maximum.
- Cursors are opaque, integrity-protected and scoped to query/sort context; do not encode personal data.
- Return nextCursor and hasMore; do not infer completion from page length.
- Filters/operators and sortable fields are allowlisted; reject unknown filters/sorts.
- Sorting specifies asc/desc and a stable unique tie-breaker.
- Apply authorization scope before filtering, sorting, pagination and counting; inaccessible rows/counts must not leak.
- Return total counts only when useful and safe. Define deterministic empty-result and invalid-cursor behavior.

## 9. Mutation safety and concurrency

- Use database transactions for multi-record operations and integrity-sensitive transitions.
- Use optimistic concurrency where overwrites could lose work; expose version/ETag and require If-Match for selected high-impact updates.
- Return 409 or 412 with stable conflict codes for stale writes.
- Support idempotency keys for retry-prone creates/commands where duplicate execution is harmful. Scope keys to actor, operation and payload; define retention/replay behavior.
- Idempotency does not replace domain duplicate detection.
- Revalidate lifecycle transitions server-side; reject invalid state jumps.
- Financial facts are versioned/effective-dated; do not destructively overwrite published history.
- Admin retains routine operational approval/publication authority; this standard does not introduce universal maker-checker.

## 10. Rate limiting and abuse protection

- Apply configurable limits by authenticated actor, session, IP/network signal and route sensitivity as appropriate.
- Use stricter limits for authentication, invitations, search suggestions, expensive queries, exports, imports and mutations.
- Return 429 and Retry-After where possible; do not disclose internal thresholds.
- Add request/body limits, query complexity bounds, upload scanning and timeout budgets.
- Avoid IP-only throttling that unfairly blocks shared networks; combine signals and monitor false positives.
- Protect public search without retaining raw queries by default, consistent with search privacy policy.

## 11. Audit, observability and privacy

- Generate or validate an opaque request/correlation ID at the trusted edge and propagate it through services/jobs.
- Audit sensitive actions with actor, action, target, timestamp, outcome and appropriate before/after values under Audit Logs standard.
- Ordinary reads need not be audited unless a documented security requirement says otherwise.
- Audit records are append-only; no API mutates/deletes audit history.
- Logs exclude passwords, OTPs, tokens, secrets, payment credentials and unnecessary PII. Avoid raw request/response body logging.
- Metrics use aggregate dimensions; no labels containing emails, search text or unnecessary personal identifiers.
- Health/readiness checks disclose no secrets or sensitive internal topology.
- Return request IDs for support correlation, not stack traces.

## 12. Caching and conditional requests

- Cache public, non-personal published content only with explicit freshness/invalidation rules.
- Authenticated/admin, permission-dependent or personal data must not be shared-cacheable; use private/no-store as appropriate.
- Invalidate after publication, withdrawal, permission changes and source-data updates.
- Use ETags/Last-Modified for safe reads where useful; use If-Match for selected conditional mutations.
- Do not cache authorization across identities without correct scope and invalidation.
- Cache age must not make stale financial data appear fresh.

## 13. Imports, exports and asynchronous work

- Large imports/exports run as controlled jobs, not unbounded synchronous requests.
- Validate file type, size and content; provide preview/dry-run and row-level errors before commit.
- Jobs record requester, authorized scope, input reference, lifecycle, counts, result reference and audit correlation.
- Re-authorize at job execution and result download; permissions may have changed.
- Export only authorized rows/fields and redact before file generation.
- Downloads are short-lived and access-controlled; never expose permanent public URLs for sensitive exports.
- Job states distinguish queued, running, completed, failed and cancelled.

## 14. Localization and financial domain formatting

- Stable machine codes are locale-neutral; user-facing messages are localized in English and Hindi.
- Store timestamps UTC; API timestamps use ISO 8601 with UTC/offset. Business display uses IST.
- Date-only effective/expiry fields remain date-only and must not shift across timezones.
- Currency is INR with explicit units. Financial decimals use exact representations and documented precision.
- Rate responses include basis, type, applicability and source/version context where relevant.
- Missing, undisclosed, unavailable, unverified, stale, expired, withdrawn and zero are distinct.
- Never infer eligibility, rates, fees or approval outcomes from incomplete data.

## 15. API documentation and compatibility

- Every endpoint contract documents purpose, method/path, auth, permission/scope, request schema, response DTO, errors, pagination, audit and rate-limit profile.
- Maintain OpenAPI documentation from the source of truth where practical; avoid stale duplicate contracts.
- Breaking changes require versioned migration. Prefer additive optional fields.
- Never silently change field meaning, units, enum values or defaults.
- Deprecation includes notice, replacement, migration window and removal approval.
- Internal service interfaces follow the same validation, authorization and domain rules even without HTTP.

## 16. Implementation tasks

All tasks are **Not Started** until implementation is authorized.

| Task | Priority | Scope | Status |
|---|---|---|---|
| API-001 | P0 | Define endpoint inventory and contract template | Not Started |
| API-002 | P0 | Shared request parsing and schema validation | Not Started |
| API-003 | P0 | Response DTO and serialization conventions | Not Started |
| API-004 | P0 | Stable problem-details error mapping and safe messages | Not Started |
| API-005 | P0 | Centralized auth, permission, scope and field redaction | Not Started |
| API-006 | P0 | Request IDs, redacted logs and audit hooks | Not Started |
| API-007 | P1 | Cursor pagination, allowlisted filters and sorting | Not Started |
| API-008 | P0 | Transactions, concurrency and idempotency patterns | Not Started |
| API-009 | P1 | Configurable rate limits, size limits and abuse controls | Not Started |
| API-010 | P1 | Cache policy and conditional requests | Not Started |
| API-011 | P1 | Safe import/export/job contracts and re-authorization | Not Started |
| API-012 | P1 | API contracts/OpenAPI documentation | Not Started |
| API-013 | P1 | Localization, financial decimal and date/time serialization | Not Started |
| API-014 | P0 | Privacy boundary; keep lead/customer PII endpoints disabled | Not Started |

## 17. Acceptance tests

All tests begin as **Not Run**.

| Test | Expected result |
|---|---|
| API-T01 | Every endpoint documents method, path, auth, permission, request, response and errors. |
| API-T02 | Malformed JSON, invalid parameters and oversized bodies are rejected safely. |
| API-T03 | Unknown/protected writable fields cannot be mass-assigned. |
| API-T04 | Responses contain only allowlisted DTO fields and authorized data. |
| API-T05 | Errors use stable codes and never expose stack traces, SQL, secrets or provider internals. |
| API-T06 | Authentication failures return 401; permission failures return 403 or safe 404. |
| API-T07 | All/Assigned/Own/Aggregate scopes and field redaction are enforced server-side. |
| API-T08 | Authorization is rechecked at mutation and background-job execution. |
| API-T09 | Cursor pagination is stable, bounded and scoped; inaccessible records/counts do not leak. |
| API-T10 | Unknown filters/sorts and invalid cursors are rejected consistently. |
| API-T11 | Stale concurrent updates produce safe 409/412 and do not overwrite newer data. |
| API-T12 | Idempotent retries do not duplicate harmful create/command operations. |
| API-T13 | Financial mutations are transactional and preserve version/effective-date history. |
| API-T14 | Rate limits return 429 and retry guidance without disclosing thresholds. |
| API-T15 | Logs/metrics exclude secrets, tokens, raw search text and unnecessary PII. |
| API-T16 | Sensitive mutations create append-only audit events; failures follow fail-closed policy. |
| API-T17 | Authenticated/permission-dependent responses are not shared-cacheable. |
| API-T18 | Public cache invalidation follows publication, withdrawal and source-data changes. |
| API-T19 | Imports validate/preview/dry-run before mutation; jobs re-authorize on execution. |
| API-T20 | Exports contain only authorized rows/fields and require controlled download access. |
| API-T21 | UTC timestamps, date-only values, IST boundaries and INR decimals serialize correctly. |
| API-T22 | Missing, undisclosed, unknown, unverified, stale, expired and zero remain distinct. |
| API-T23 | Lead/customer PII, capture and sharing endpoints remain unavailable before legal approval. |
| API-T24 | API contracts match implemented request/response schemas and documented errors. |
| API-T25 | Error codes are locale-neutral; messages localize in English/Hindi. |
| API-T26 | Health/readiness endpoints disclose no secrets or sensitive topology. |

## 18. Owner review decisions

Please approve or revise:
1. Versioned /api/v1 convention, /api/v1/admin for admin HTTP APIs, and server-side service calls where HTTP is unnecessary.
2. JSON DTO envelopes and stable RFC 9457-style problem-details errors.
3. Decimal strings and explicit financial units; UTC timestamps and date-only effective dates.
4. Centralized server-side authorization, field redaction, deny-by-default and re-authorization for jobs/exports.
5. Cursor pagination for large/changing collections, allowlisted filters/sorts and bounded page sizes.
6. Transactions, optimistic concurrency and idempotency for retry-prone operations; no universal maker-checker.
7. Configurable rate limits, privacy-safe logs, audit integration and cache rules.
8. Lead/customer PII endpoints remain disabled pending separate legal/compliance approval.
9. Inspect existing repository conventions/dependencies before selecting implementation libraries.

## 19. Approval and implementation record

- **Owner decision:** Pending.
- **Implementation:** Not Started.
- **Testing:** All 26 acceptance tests remain Not Run.
- **Dependencies:** Approved Authorization, Data Governance and Design System; authentication/session architecture; Audit Logs policy; repository architecture inspection; Testing Strategy.
- **Boundary:** This standard does not authorize lead capture, customer PII access, lender integrations or production deployment.
