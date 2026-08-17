The Northstar Group Project

This is the backend API for the Northstar Retail Co. inventory
chatbot. It is built with FastAPI and deployed as a serverless
function on Vercel. It connects to a Firebase Realtime Database for
live inventory data and uses CrewAI to power the AI agent.

Project Structure
```
/
├── api/
│   └── index.py           FastAPI app — Vercel serverless entry point
├── agents/
│   └── inventory_agent.py  CrewAI agent definition
├── tools/
│   └── firebase_tool.py    Custom Firebase inventory tool
├── DECISION_TREES.md       Chatbot classification and routing guide
├── AGENTS.md               Agent roles and responsibilities
├── requirements.txt        Python dependencies
├── netlify.json             Netlify deployment configuration
└── .env.example            Environment variable template
```

Setup

1. Clone the repository
```bash
git clone https://github.com/yourtechbaddie-ke/The-Northstar-Group-Project.git
cd The-Northstar-Group-Project
```

2. Install dependencies
```bash
pip install -r requirements.txt
```

3. Configure environment variables

FIREBASE_INVENTORY_PATH=inventory
OPENAI_API_KEY=<your OpenAI API key>
```

4. Run locally
```bash
uvicorn api.index:app --reload --port 8000
```

5. Deploy to Netlify
- Push all files to GitHub
- Connect the repo to Netlify
- Add all environment variables in Netlify project settings
- Netlify auto-deploys on push to main

API Endpoints

GET /api/health
Returns service health status.

POST /api/chat
Accepts a customer message and returns an AI-generated inventory reply.

Request body:
```json
{"message": "Do you have the Arctic Fleece Jacket in my size?"}
```

Response:
```json
{"reply": "...", "source", "status": "ok"}
```

Environment Variables
| Variable | Description |
|---|---|

| FIREBASE_INVENTORY_PATH | Root node in Firebase where inventory
records live (default: inventory) |
| OPENAI_API_KEY | Your OpenAI API key |


Tech Stack
- FastAPI — Python web framework
- CrewAI — AI agent orchestration
- Firebase Admin SDK — Realtime Database access
- Netlify — Serverless deployment
- OpenAI GPT-4.o — Language model
