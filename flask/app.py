import psycopg2
import json
from flask import Flask, request
from redis import Redis
from os import getenv

app = Flask(__name__)
redis = Redis(host='redis', port=6379)

def fetch_db_conn():
    conn = psycopg2.connect(getenv('DATABASE_URL'))
    return conn

def dump_task_row(row):
    return {
        'id': row[0],
        'title': row[1],
        'description': row[2],
        'completed': row[3],
    }

@app.route('/')
def hello():
    return 'Hello, World!'

@app.route('/api/tasks', methods=['GET', 'POST'])
def tasks():
    if request.method == 'GET':
        conn = fetch_db_conn()
        with conn.cursor() as cur:
            statement = 'SELECT id, title, description, completed FROM tasks WHERE deleted = FALSE'
            cur.execute(statement)
            results = cur.fetchall()
            conn.close()
            return json.dumps([dump_task_row(r) for r in results])
    if request.method == 'POST':
        task = request.get_json()
        if 'title' not in task:
            return '"title" field is required'
        title = task['title']
        description = '' if 'description' not in task else task['description']
        if type(title) != str or type(description) != str:
            return 'only string values are accepted for "title" and "description"'
        conn = fetch_db_conn()
        with conn.cursor() as cur:
            statement = 'INSERT into tasks(title, description) VALUES (%s, %s) RETURNING id, title, description'
            cur.execute(statement, (title, description))
            new_id = cur.fetchone()[0]
            cur.close()
            conn.commit()
        conn.close()
        return json.dumps({
            'id': new_id,
            'title': title,
            'description': description,
            'completed': False
        })

@app.route('/api/task/<id>', methods=['GET', 'PUT', 'DELETE'])
def task(id):
    try:
        int(id)
    except ValueError as e:
        return 'invalid id'
    if request.method == 'GET':
        task = None
        with conn.cursor() as cur:
            statement = 'SELECT id, title, description, completed FROM tasks WHERE id = %s and deleted = FALSE'
            cur.execute(statement, (id,))
            task = cur.fetchone()
        if task is None:
            # TODO - throw 404
            return 'id not found'
        return dump_task_row(task[0])
    if request.method == 'PUT':
        pass
    if request.method == 'DELETE':
        pass
    


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)

