# Northstar Retail Co. AI Support Backend

This backend powers the Northstar Retail Co. customer-support chatbot. It uses FastAPI, OpenAI for natural-language responses, and Render Postgres for the live inventory source of truth.

## Project Structure

```text
/
├── api/index.py             FastAPI application
├── agents/inventory_agent.py  OpenAI-powered customer concierge
├── db/inventory.py          Render Postgres inventory access and seeding
├── data/inventory.json      Canonical inventory seed
├── data/inventory.js        Frontend inventory catalogue
├── DECISION_TREES.md        Chatbot classification and routing guide
├── AGENTS.md                AI behavior and safety guidance
└── requirements.txt         Python dependencies
```

## Environment

Set these variables on the Render web service:

- `OPENAI_API_KEY` — OpenAI API credential
- `OPENAI_MODEL_NAME` — model used for responses, default `gpt-5.6-luna`
- `DATABASE_URL` — Render Postgres connection string, supplied when the database is connected to the service

## Local run

```bash
pip install -r requirements.txt
uvicorn api.index:app --reload --port 8000
```

## API

`GET /api/health` returns service health.

`POST /api/chat` accepts `{ "message": "..." }` and returns a customer-facing inventory response.

## Behavior

The AI is conversational, warm, friendly and occasionally playful. Product facts are grounded in the inventory database; it must not invent stock, prices, products or specifications.

## Stack

- FastAPI
- OpenAI API
- Render Postgres
- Render Web Service
