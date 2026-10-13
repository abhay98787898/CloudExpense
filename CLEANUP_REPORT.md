# CloudExpense Cleanup Report

## What was changed in this copy

- Replaced the starter README with documentation aligned to the inspected source code.
- Removed unsafe public-read S3 policy files and the script that applied a public-read receipt policy.
- Removed an overly broad IAM policy containing wildcard service permissions.
- Removed duplicate `.gitignore` copies and stale backend/frontend README files.
- Removed deployment guides containing outdated hard-coded resource identifiers and inconsistent port instructions.
- Renamed `backend/src/utils/textract.js` to `backend/src/utils/ocr.js` and updated the import, because the implementation uses Tesseract.js rather than AWS Textract.
- Renamed the legacy CloudFormation template to `backend/infrastructure-template-DRAFT-DO-NOT-DEPLOY.yaml` because its current configuration contains stale repository, key-pair, port, and broad IAM assumptions.

## Not changed

- Core application behavior, UI, handlers, and AWS integration logic were not intentionally redesigned.
- No AWS resources were created, changed, or deleted.
- This is a cleaned copy of the uploaded ZIP; it does not modify your original local folder or GitHub repository.

## Important before public GitHub push

1. Check Git history for any real credentials previously committed; rotate them if exposed.
2. Keep `.env` files out of Git.
3. Do not make the receipt bucket public.
4. Review the CloudFormation draft before any deployment.
5. Run the manual testing checklist in the README and update each status only after verifying it.
