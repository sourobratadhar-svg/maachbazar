# Copilot Instructions for MaachBazar WhatsApp Agent

## Overview
This codebase implements a WhatsApp Business API agent for MaachBazar, focused on fish and poultry ordering. It is designed for deployment on Vercel and supports both local development and serverless operation.

## Architecture & Key Components
- **/maachbazar-agent/index.js**: Express server for local development. Handles `/webhook` GET (verification) and POST (message handling) endpoints.
- **/maachbazar-agent/api/webhook.js**: Vercel serverless function for production. Handles webhook verification and incoming WhatsApp messages, replies using the WhatsApp Cloud API.
- **/maachbazar-agent/api/index.js**: Health/status endpoint for Vercel deployments.
- **/maachbazar-agent/vercel.json**: Configures Vercel to route `/api/webhook` to the serverless function.

## Developer Workflows
- **Local development**: Use `npm install` and `npm start` in `maachbazar-agent/`. Requires a `.env` file with `WHATSAPP_TOKEN`, `VERIFY_TOKEN`, and `PHONE_NUMBER_ID`.
- **Production deployment**: Use Vercel CLI (`vercel --prod`). Set environment variables via Vercel dashboard or CLI.
- **Webhook verification**: Meta/WhatsApp will call `/webhook` (local) or `/api/webhook` (Vercel) with a GET request. The verify token is `maachbazar-secret-123` (or fallback `maachbazar-secret123` in some code).

## Patterns & Conventions
- **Message handling**: Incoming WhatsApp messages are logged and replied to with a static message. Extend logic in `sendMessage` (local) or inside the POST handler (Vercel).
- **Environment variables**: Always use environment variables for credentials and configuration. Never hardcode secrets.
- **CORS**: All API endpoints set permissive CORS headers for ease of integration/testing.
- **API endpoints**:
  - `GET /webhook` (verification)
  - `POST /webhook` (message handling)
  - `GET /api` (status)

## Integration Points
- **WhatsApp Cloud API**: All outbound messages use the Facebook Graph API with the configured phone number ID and token.
- **Meta Developer Console**: Webhook URL must be set to `/webhook` (local) or `/api/webhook` (Vercel) with the correct verify token.

## Examples
- To extend message handling, add logic in `sendMessage` (local) or after extracting `message` in `api/webhook.js`.
- For new endpoints, add serverless functions in `api/` and update `vercel.json` if needed.

## References
- See `README.md` for deployment and environment setup details.
- See `vercel.json` for routing/serverless config.
- See `api/webhook.js` for production webhook logic.

---

**Update this file if you add new endpoints, change environment variables, or modify deployment workflows.**
