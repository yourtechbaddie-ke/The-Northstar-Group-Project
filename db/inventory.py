import json
import os
import re
from pathlib import Path
from typing import Any

import psycopg

SEED_PATH = Path(__file__).resolve().parents[1] / 'data' / 'inventory.json'


def _connect():
    url = os.environ.get('DATABASE_URL')
    if not url:
        raise EnvironmentError('DATABASE_URL is not set. Connect this service to the Render Postgres database.')
    return psycopg.connect(url, connect_timeout=10)


def ensure_inventory_table() -> None:
    with _connect() as conn:
        with conn.cursor() as cur:
            cur.execute('''
                CREATE TABLE IF NOT EXISTS inventory (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    category TEXT NOT NULL,
                    fabric TEXT,
                    price NUMERIC(12, 2) NOT NULL,
                    stock INTEGER NOT NULL DEFAULT 0,
                    status TEXT NOT NULL
                )
            ''')
            cur.execute('SELECT COUNT(*) FROM inventory')
            count = cur.fetchone()[0]
            if count == 0:
                records = json.loads(SEED_PATH.read_text(encoding='utf-8'))
                cur.executemany(
                    '''INSERT INTO inventory (id, name, category, fabric, price, stock, status)
                       VALUES (%(id)s, %(name)s, %(category)s, %(fabric)s, %(price)s, %(stock)s, %(status)s)''',
                    records,
                )


def search_inventory(query: str) -> list[dict[str, Any]]:
    ensure_inventory_table()
    q = query.lower().strip()
    with _connect() as conn:
        with conn.cursor() as cur:
            if any(word in q for word in ('all', 'full', 'list', 'every', 'catalog')):
                cur.execute('SELECT id, name, category, fabric, price, stock, status FROM inventory ORDER BY id')
            else:
                stops = {'the', 'product', 'item', 'find', 'show', 'get', 'what', 'about', 'is', 'are', 'do', 'you', 'have', 'any', 'for'}
                tokens = [t for t in re.split(r'\W+', q) if len(t) > 2 and t not in stops]
                if not tokens:
                    cur.execute('SELECT id, name, category, fabric, price, stock, status FROM inventory ORDER BY id')
                else:
                    terms = [f'%{token}%' for token in tokens]
                    clauses = []
                    params: list[str] = []
                    for term in terms:
                        clauses.append('(LOWER(name) LIKE %s OR LOWER(category) LIKE %s OR LOWER(id) LIKE %s)')
                        params.extend([term, term, term])
                    cur.execute(
                        'SELECT id, name, category, fabric, price, stock, status FROM inventory WHERE ' + ' OR '.join(clauses) + ' ORDER BY id',
                        params,
                    )
            rows = cur.fetchall()
            columns = [d.name for d in cur.description]
            records = [dict(zip(columns, row)) for row in rows]
            if records:
                return records
            cur.execute('SELECT id, name, category, fabric, price, stock, status FROM inventory ORDER BY id')
            rows = cur.fetchall()
            return [dict(zip(columns, row)) for row in rows]
