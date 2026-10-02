# Production Deployment Checklist

The application must not be considered production-ready until the previously exposed provider credentials have been rotated.

## Required application variables

Configure these in the hosting platform's secret/environment settings:

```text
NEXT_PUBLIC_SERVER_URL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
WEBHOOK_SECRET
NEXT_PUBLIC_CLERK_SIGN_IN_URL
NEXT_PUBLIC_CLERK_SIGN_UP_URL
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
MONGODB_URI
UPLOADTHING_SECRET
UPLOADTHING_APP_ID
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

Realtime service variables:

```text
PORT
FRONTEND_ORIGIN
SOCKET_MESSAGE_MAX_LENGTH
SOCKET_RATE_WINDOW_MS
SOCKET_RATE_MAX_MESSAGES
```

## Rotation order

1. Create new provider credentials.
2. Configure the new values in the deployment environment.
3. Deploy and verify login, database access, uploads, checkout, webhooks, and realtime connectivity.
4. Revoke the old credentials.
5. Confirm the old credentials no longer work.
6. Review provider logs for unexpected historical use.

For MongoDB, create or rotate a dedicated application database user with only the permissions required by this application. Avoid reusing a personal or administrative database account.

For Stripe and Clerk webhooks, update the endpoint signing secret in the deployment environment whenever the webhook endpoint is recreated or rotated.

## Git history

Current `main` no longer tracks the old `.env` files. Historical branches and commits may still contain the old values. Credential rotation is the security control that makes those historical copies harmless. History rewriting should only be done as a separate coordinated maintenance operation because it changes commit SHAs for collaborators.
