Northstar Support Chatbot — Handoff Documentation

Current Status
The Northstar Support Chatbot is a production-ready AI customer
support backend built with CrewAI, Firebase Realtime Database, Gmail,
FastAPI, and Netlify. It accepts a customer free-text support message,
classifies it, fetches live inventory data from Firebase, and sends an
accurate reply to the customer via Gmail — fully automatically.

Live deployment: https://northstarprojo.netlify.app

What Works
- Customer message classification (stock availability, return request,
out of scope, contact capture)
- Live inventory lookup via Firebase Realtime Database
- Email reply delivery via Gmail
- Return request handling with step-by-step Northstar policy instructions
- Out-of-scope escalation with warm holding reply and human follow-up flag
- Contact capture flow — asks customer for email if none is provided
- Correct out-of-stock vs. not-in-catalog distinction (never
fabricates product details)
- Email extraction from free-text customer messages
- Automated GitHub file push (DECISION_TREES.md, requirements.txt,
netlify.toml, firebase_tool.py, inventory_agent.py, api/index.py,
.env.example, SITE_STRUCTURE.md)
- FastAPI backend deployed on Netlify
- Self-serve customer dashboard (dashboard.html) already in the repository
- DECISION_TREES.md fetched from GitHub at runtime to guide chatbot behaviour

Architecture

Customer Message (kickoff input)
  down
Fetch DECISION_TREES.md from GitHub
  down
Classify message (stock availability / return request / out of scope /
contact capture)
  down
Extract customer email from message
  down
Parse extracted email to plain string
  down
Route by category
  down
stock_availability: Query Firebase, reply via Gmail
return_request: Send return instructions via Gmail
out_of_scope: Send holding reply and flag for human team
contact_capture: Ask for customer email address

Tech Stack
| Layer | Technology |
|---|---|
| AI orchestration | CrewAI (multi-agent flow) |
| Inventory data | Firebase Realtime Database |
| Customer replies | Gmail |
| API framework | FastAPI |
| Deployment | Netlify |
| Language model | OpenAI GPT-4o |
| File versioning | GitHub |

AI Safety Principle
The AI layer is not the source of truth. The inventory agent queries
live Firebase data for every product question. Agents are instructed
never to fabricate product names, SKUs, prices, stock levels,
availability, return eligibility, or policies. If a product is not
found in Firebase, the agent reports it as not found. If it is found
but out of stock, the agent reports it as out of stock.

Supported Query Types
| Category | How It Is Handled |
|---|---|
| Stock availability | Queries Firebase live data. Reports in-stock
details or out-of-stock status. Sends reply via Gmail. |
| Return request | Sends step-by-step Northstar return policy
instructions via Gmail. |
| Out of scope | Sends warm holding reply. Flags for human team to
follow up. Reply sent via Gmail. |
| Contact capture | Asks customer for their email address so Northstar
can reply directly. |

Order Status
Order status queries are currently out of scope. Customers asking
about order status receive a warm holding reply and are flagged for
human follow-up via email.

Product Catalog
The chatbot covers 25 products across 6 categories (Outerwear,
Knitwear, Dresses and Skirts, Trousers and Jeans, Tops and Shirts,
Accessories). SKUs NS-001 to NS-055. Live stock data is held in
Firebase Realtime Database.

Website Pages
The Netlify front-end has four pages:
1. Home / Chat (/) — main chatbot interface
2. Dashboard (/dashboard) — self-serve product and support dashboard
3. Returns & Refunds (/returns) — static policy page
4. Contact Us (/contact) — support email and chat widget
There is NO Account page, NO login, and NO admin panel.

Environment Variables
| Variable | Description |
|---|---|
| FIREBASE_INVENTORY_PATH | Root node in Firebase where inventory
records live (default: inventory) |
| OPENAI_API_KEY | OpenAI API key |

Deployment
Platform: Netlify (https://northstarprojo.netlify.app). The repository
is connected to Netlify. api/index.py runs as a serverless function.
netlify.toml configures the build and routing. Netlify auto-deploys on
every push to the main branch. Add all environment variables in
Netlify project settings before going live.

Repository File Structure
/
├── api/
│   └── index.py
├── agents/
│   └── inventory_agent.py
├── tools/
│   └── firebase_tool.py
├── dashboard.html
├── DECISION_TREES.md
├── AGENTS.md
├── HANDOFF.md
├── NORTHSTAR_TEST_AND_VERIFICATION.md
├── README.md
├── SITE_STRUCTURE.md
├── requirements.txt
├── netlify.toml
└── .env.example

Known Limitations
- Order status is not yet integrated (routed to human follow-up)
- No persistent conversation history (each message is a fresh kickoff)
- No customer authentication
- No rate limiting on the API
- No helpdesk or ticketing system integration

Next Production Priorities
1. Connect real order management system for live order status.
2. Add persistent conversation history per customer.
3. Add authentication to the API endpoint.
4. Add rate limiting.
5. Add monitoring and analytics.
6. Add automated end-to-end tests.
7. Connect a helpdesk or ticketing system for out-of-scope escalations.
