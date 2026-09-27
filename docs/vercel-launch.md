# Vercel launch checklist

HackerAI uses Vercel for the Next.js app, Convex for data, WorkOS for identity,
E2B for cloud sandboxes, and Trigger.dev for durable Agent tasks. A successful
Next.js build alone does not mean Agent mode is ready.

## Prepare each environment

1. Create separate preview and production deployments for Convex, WorkOS,
   Trigger.dev, and E2B. Build the E2B template for the matching environment.
2. Set the required variables from `.env.local.example` in Vercel. At minimum,
   configure WorkOS (`WORKOS_API_KEY`, `WORKOS_CLIENT_ID`,
   `WORKOS_COOKIE_PASSWORD`, `NEXT_PUBLIC_WORKOS_REDIRECT_URI`,
   `WORKOS_WEBHOOK_SECRET`, `ACCOUNT_IDENTITY_HMAC_SECRET`), Convex
   (`CONVEX_DEPLOYMENT`, `NEXT_PUBLIC_CONVEX_URL`, `CONVEX_SERVICE_ROLE_KEY`),
   the model services (`OPENROUTER_API_KEY`, `OPENAI_API_KEY`), E2B
   (`E2B_API_KEY`, `E2B_TEMPLATE`), Trigger.dev (`TRIGGER_PROJECT_ID`,
   `TRIGGER_SECRET_KEY`), and `NEXT_PUBLIC_BASE_URL`. Confirm every URL and
   callback matches its deployment environment. Do not commit real values.
3. Configure the Trigger.dev worker's own environment variables. It needs
   Convex, model, E2B, and any optional integration keys used by its tasks;
   Vercel variables alone are not sufficient. Deploy the worker version that
   matches the web app's commit before enabling approval-gated Agent mode in
   production. The route requires `TRIGGER_VERSION` for production approvals.
4. Keep preview deployments protected. Set application rate limits and
   monitoring alerts, and check the provider dashboards for unexpected costs.

## Verify before promoting production

- Run `corepack pnpm install --frozen-lockfile`, `corepack pnpm typecheck`,
  `corepack pnpm test:ci`, and `corepack pnpm build` with environment-specific
  test credentials. Keep the package manager version in `package.json`.
- In a protected preview, sign in and out, create a chat, run an Agent command,
  deny an approval, then approve a harmless command. Confirm a different user
  cannot act on that run or reuse its approval.
- Confirm the selected E2B template starts and is cleaned up, the Trigger task
  completes, Convex persists the chat, and error/cost logs contain no secrets.
- Check the software license before offering a commercial service.

## Agent permissions

New browser sessions start in **Ask for approval**. Earlier implicit
full-access browser preferences are reset once by the versioned storage key.
A user can deliberately switch to **Full access** in the selector; this is
not a target-scope or network-egress control. Each assessment still needs an
authorized target list and a sandbox-level egress policy before unattended
testing of external systems.
