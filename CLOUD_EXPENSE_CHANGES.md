# CloudExpense changes (patch notes)

This patch adapts the downloaded OCR receipt tracker into a CloudExpense MVP.

## Included
- Fixed monthly summary aggregation to use `total` (with legacy `amount` fallback).
- Improved date parsing for ISO, month-name, US-style unambiguous slash dates, and Indian DD/MM/YYYY dates. Ambiguous slash dates default to Indian day-first order.
- Removed login request-body logging and removed raw error details from the login 500 response.
- Added per-user CSV export at `GET /expenses/export.csv` (UTF-8 BOM for spreadsheet compatibility).
- Added best-effort CloudWatch count metrics under `CloudExpense/Pipeline`.
- Added optional SES receipt-saved and monthly summary emails, and a configurable monthly INR threshold email alert.
- Changed frontend API default to `http://localhost:3001` and added an Export CSV button.

## Configuration
Copy `backend/.env.example` to `backend/.env` and fill real values. SES is optional; `SES_FROM_EMAIL` must be an SES-verified sender. CloudWatch metrics and SES require corresponding IAM permissions and supported regions. `MONTHLY_BUDGET_INR` is an application-wide threshold for each user's own monthly total, not a per-category budget.

## Important limitations
- This is an MVP, not production-hardened software.
- The original repository has no clear licence file. Get permission or confirm licensing before redistributing a derivative publicly.
- This patch does not provision AWS resources. Check costs and permissions before deploying.
- Rotate any credentials exposed in the original repository; do not reuse them.
