
import os, textwrap
from typing import Optional
import httpx
from crewai import Agent, Crew, Process, Task
from tools.firebase_tool import FirebaseInventoryTool

_DT_CACHE = None
DT_URL = 'https://raw.githubusercontent.com/yourtechbaddie-ke/The-Northstar-Group-Project/main/DECISION_TREES.md'

def load_decision_trees():
    global _DT_CACHE
    if _DT_CACHE:
        return _DT_CACHE
    try:
        r = httpx.get(DT_URL, timeout=8.0, follow_redirects=True)
        r.raise_for_status()
        _DT_CACHE = r.text
        return _DT_CACHE
    except Exception:
        _DT_CACHE = 'Query firebase_inventory_tool for all product questions.'
        return _DT_CACHE

def build_crew(user_message):
    dt = load_decision_trees()
    tool = FirebaseInventoryTool()
    agent = Agent(
        role='Northstar Inventory Assistant',
        goal='Answer customer questions with 100% accuracy using only
live Firebase data.',
        backstory=f'You are the Northstar inventory assistant. Source
of truth: firebase_inventory_tool. Follow this guide: {dt}',
        tools=[tool], verbose=True, allow_delegation=False, max_iter=6
    )
    task = Task(
        description=f'Customer message: {user_message}\n1. Classify.
2. Call firebase_inventory_tool. 3. Parse response. 4. Compose
reply.',
        expected_output='A complete customer-facing reply grounded in
live Firebase data.',
        agent=agent
    )
    return Crew(agents=[agent], tasks=[task],
process=Process.sequential, verbose=True)

def get_chatbot_reply(user_message):
    result = build_crew(user_message).kickoff()
    reply = result.raw if hasattr(result, 'raw') else str(result)
    return {'reply': reply.strip(), 'source':
'firebase_realtime_database', 'model':
os.environ['OPENAI_MODEL_NAME']}
