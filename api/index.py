
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from agents.inventory_agent import get_chatbot_reply

app = FastAPI(title='Northstar Inventory Chatbot API', version='1.0.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        'http://localhost:3000',
        'http://localhost:5173',
        'https://northstarprojo.netlify.app',
    ],
    allow_methods=['POST', 'GET'],
    allow_headers=['*'],
)

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)

class ChatResponse(BaseModel):
    reply: str
    source: str
    model: str
    status: str = 'ok'

@app.get('/api/health')
def health():
    return {'status': 'healthy', 'service': 'northstar-inventory-chatbot'}

@app.post('/api/chat', response_model=ChatResponse)
def chat(body: ChatRequest):
    try:
        result = get_chatbot_reply(body.message)
        return ChatResponse(**result)
    except EnvironmentError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
