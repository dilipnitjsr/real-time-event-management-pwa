# Security

## Credential handling

Production credentials must never be committed to this repository.

Use environment variables or the deployment platform's secret store for:

- `CLERK_SECRET_KEY`
- `WEBHOOK_SECRET`
- `MONGODB_URI`
- `UPLOADTHING_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- deployment credentials such as Azure publish profiles

Public browser configuration such as Clerk and Stripe publishable keys may be exposed to the browser by design, but should still be managed through deployment configuration rather than hard-coded into source.

## Previously exposed credentials

Earlier development branches contained real credentials in committed `.env` files. Those historical values must be treated as compromised even though the files are no longer present on `main`.

Rotate or revoke the affected credentials before production use:

1. Clerk secret key and webhook signing secret.
2. MongoDB database user/password or connection credentials.
3. UploadThing secret key.
4. Stripe secret key and webhook signing secret.

Removing secrets from the latest commit does not invalidate credentials already present in Git history.

## Reporting

Do not open a public issue containing credentials, access tokens, database connection strings, payment information, or personal data.
