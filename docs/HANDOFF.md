# Northstar AI Support — Handoff

## Current architecture

Northstar AI is a FastAPI customer-support backend using direct OpenAI responses and Render Postgres inventory data.

Customer message → FastAPI → Render Postgres inventory lookup → OpenAI → customer response.

## What works

- Natural-language customer support through OpenAI.
- Live inventory lookup from the Render Postgres database.
- Warm, friendly, sociable and occasionally playful responses.
- Product accuracy grounded in the database.
- Clear distinction between out-of-stock and not-found products.
- FastAPI `/api/health` and `/api/chat` endpoints.

## Environment variables

- `OPENAI_API_KEY`
- `OPENAI_MODEL_NAME` (defaults to `gpt-5.6-luna`)
- `DATABASE_URL` (Render Postgres connection string)

## Inventory

The canonical seed is `data/inventory.json`. On first database access, the backend creates the `inventory` table and seeds it if empty. After that, Render Postgres is the operational source of truth.

## Deployment

The backend is deployed as a Render Web Service. GitHub is the source repository and Render auto-deploys from the connected branch.

## AI safety

The AI must never invent product names, SKUs, prices, stock, fabrics or specifications. If the database does not provide enough information, the assistant says so rather than guessing.

## Future priorities

- Add automated end-to-end tests.
- Add monitoring and analytics.
- Add persistent conversation history if required.
- Add a helpdesk/ticketing integration if required.
