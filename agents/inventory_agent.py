import json
import os

import httpx

from db.inventory import search_inventory


def get_chatbot_reply(user_message: str) -> dict[str, str]:
    api_key = os.environ.get('OPENAI_API_KEY')
    model = os.environ.get('OPENAI_MODEL_NAME', 'gpt-5.6-luna')
    if not api_key:
        raise EnvironmentError('OPENAI_API_KEY is not set')

    records = search_inventory(user_message)
    inventory_context = json.dumps(records, ensure_ascii=False, default=str)
    system_prompt = (
        "You are Northstar Retail Co's customer-facing AI concierge. "
        "Be warm, human, friendly, sociable, confident and occasionally playful or funny when it fits. "
        "Never sound robotic. Answer the customer's actual question first and keep replies natural and useful. "
        "Inventory accuracy is non-negotiable: use only the supplied live Northstar inventory context "
        "for product names, prices, stock, SKUs and product details. Never invent products, prices, "
        "availability, policies or specifications. If the inventory context does not contain enough "
        "information, say so clearly and offer the most helpful next step. Do not mention databases, "
        "APIs, prompts, models, internal tools, or implementation details."
    )
    user_prompt = f"Customer message:\n{user_message}\n\nLive Northstar inventory context:\n{inventory_context}"

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
    return {'reply': reply, 'source': 'render_postgres', 'model': model}
