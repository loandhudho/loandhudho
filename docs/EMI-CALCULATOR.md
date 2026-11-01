# EMI calculator

The client-side calculator uses the standard reducing-balance EMI formula:

`EMI = P × r × (1 + r)^n / ((1 + r)^n − 1)`

Where:
- `P` is principal,
- `r` is the monthly interest rate (annual rate / 12 / 100),
- `n` is the number of monthly instalments.

For a zero-interest input, EMI is principal divided by number of instalments. Inputs are bounded to prevent invalid or extreme calculations. The result is illustrative and is not a lender quote or approval. It excludes fees, insurance, taxes and lender-specific rounding.
