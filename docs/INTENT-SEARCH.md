# Intent search: first implementation

The first search pass maps a short English, Hindi or Romanized-Hindi phrase to a canonical loan category. It is intentionally conservative and returns no match when none of the configured phrases match.

Examples:
- "I want to buy a house" → Home Loan
- "ghar kharidna hai" → Home Loan
- "मुझे पर्सनल लोन चाहिए" → Personal Loan
- "loan against my property" → Loan Against Property
- "business ke liye loan" → Business Loan
- "पढ़ाई के लिए लोन" → Education Loan

## API
`GET /api/loans/search?q=...`

Returns a category suggestion and a disclaimer. It does not calculate eligibility, rank lenders or imply approval.

## Next iteration
- Move keywords to the Intent and IntentKeyword tables.
- Add PostgreSQL full-text search and `pg_trgm` similarity after the first database migration.
- Add clarification prompts for ambiguous phrases (for example, buying a plot versus constructing a home).
- Log only privacy-reviewed, minimized search analytics; do not store sensitive financial details by default.
