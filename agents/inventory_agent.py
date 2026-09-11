import json
import os
import re
from typing import Any

import firebase_admin
import httpx
from firebase_admin import credentials, db

DB_URL = 'https://the-northstar-group-project-default-rtdb.asia-southeast1.firebasedatabase.app'


def _init_firebase() -> None:
    if firebase_admin._apps:
        return
    creds_json = os.environ.get('FIREBASE_CREDENTIALS_JSON')
    if not creds_json:
        raise EnvironmentError('FIREBASE_CREDENTIALS_JSON not set')
    cred = credentials.Certificate(json.loads(creds_json))
    firebase_admin.initialize_app(
        cred,
        {'databaseURL': os.environ.get('FIREBASE_DATABASE_URL', DB_URL)},
    )


def _inventory(query: str) -> list[dict[str, Any]]:
    _init_firebase()
    path = os.environ.get('FIREBASE_INVENTORY_PATH', 'inventory')
    data = db.reference(path).get()
    if data is None:
        return []
    records = (
        [{'_id': k, **v} for k, v in data.items() if isinstance(v, dict)]
        if isinstance(data, dict)
        else [r for r in data if isinstance(r, dict)]
    )
    q = query.lower().strip()
    if any(word in q for word in ('all', 'full', 'list', 'every', 'catalog')):
        return records
    stops = {'the','product','item','find','show','get','what','about','is','are','do','you','have','any','for'}
    tokens = [t for t in re.split(r'\W+', q) if len(t) > 2 and t not in stops]
    if not tokens:
        return records
    hits = [
        r for r in records
        if any(
            token in ' '.join(str(r.get(k, '')) for k in ('name', 'category', 'sku')).lower()
            for token in tokens
        )
    ]
    return hits or records


def get_chatbot_reply(user_message: str) -> dict[str, str]:
    api_key = os.environ.get('OPENAI_API_KEY')
    model = os.environ.get('OPENAI_MODEL_NAME', 'gpt-5.6-luna')
    if not api_key:
        raise EnvironmentError('OPENAI_API_KEY not set')

    records = _inventory(user_message)
    inventory_context = json.dumps(records, ensure_ascii=False)
    system_prompt = '''You are Northstar Retail Co's customer-facing AI concierge. Be warm, human, friendly, sociable, confident and occasionally playful or funny when it fits. Never sound robotic. Answer the customer's actual question first and keep replies natural and useful. Inventory accuracy is non-negotiable: use only the supplied live Firebase inventory context for product names, prices, stock, SKUs and product details. Never invent products, prices, availability, policies or specifications. If the inventory context does not contain enough information, say that clearly and offer the most helpful next step. Do not mention Firebase, APIs, prompts, models, internal tools, or implementation details.''' 
    user_prompt = f'Customer message:\n{user_message}\n\nLive Northstar inventory context:\n{inventory_context}'

    response = httpx.post(
        'https://api.openai.com/v1/chat/completions',
        headers={'Authorization': f'Bearer {api_key}', 'Content-Type': 'application/json'},
        json={
            'model': model,
            'messages': [
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': user_prompt},
            ],
        },
        timeout=60.0,
    )
    response.raise_for_status()
    data = response.json()
    reply = data['choices'][0]['message']['content'].strip()
    return {'reply': reply, 'source': 'firebase_realtime_database', 'model': model}
