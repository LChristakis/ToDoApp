import psycopg2
import json
from flask import Flask, request
from flask_cors import CORS
from redis import Redis
from os import getenv

app = Flask(__name__)
CORS(app)
redis = Redis(host='redis', port=6379)

def fetch_db_conn():
    conn = psycopg2.connect(getenv('DATABASE_URL'))
    return conn

def dump_task_row(row):
    return {
        'id': row[0],
        'title': row[1],
        'description': row[2],
        'status': row[3],
    }

expiration_time = 300 # seconds

@app.route('/api/tasks', methods=['GET', 'POST'])
def tasks():

    if request.method == 'GET':

        all_tasks = redis.get('all_tasks')
        if all_tasks is None:
            conn = fetch_db_conn()
            with conn.cursor() as cur:
                statement = 'SELECT id, title, description, status FROM tasks WHERE deleted = FALSE'
                cur.execute(statement)
                all_tasks = cur.fetchall()
                conn.close()

            all_tasks = json.dumps({ 'tasks': [dump_task_row(r) for r in all_tasks]})
            redis.set('all_tasks', all_tasks, ex=expiration_time)

        return json.loads(all_tasks)

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
            statement = 'INSERT into tasks(title, description) VALUES (%s, %s) RETURNING id, title, description, status'
            cur.execute(statement, (title, description))
            new_task = cur.fetchone()
            cur.close()
            conn.commit()
        conn.close()
        redis.delete('all_tasks')
        return dump_task_row(new_task)
    return { 'error': 'Invalid request' }

@app.route('/api/task/<id>', methods=['GET', 'PUT', 'DELETE'])
def task(id):
    
    try:
        int(id)
    except ValueError as e:
        return { 'error': 'invalid id' }
    task = None
    conn = fetch_db_conn()
    task = redis.get(id)
    if task is not None:
        task = json.loads(task)
    else:
        with conn.cursor() as cur:
            statement = 'SELECT id, title, description, status FROM tasks WHERE id = %s and deleted = FALSE'
            cur.execute(statement, (id,))
            task = cur.fetchone()
            cur.close()
        if task is None:
            return { 'error': 'id not found' }, 404
        task = dump_task_row(task)
        redis.set(id, json.dumps(task), ex=expiration_time)
    
    if request.method == 'GET':
        conn.close()
        return (task)

    if request.method == 'DELETE':
        with conn.cursor() as cur:
            statement = 'UPDATE tasks SET deleted = true WHERE id = %s'
            cur.execute(statement, (id,))
            cur.close()
            conn.commit()
        conn.close()
        redis.delete(id)
        redis.delete('all_tasks')
        return { 'success': 'task deleted' }, 204

    if request.method == 'PUT':
        parameters = []
        values = []
        for parameter in ['status', 'title', 'description']:
            if parameter in request.args:
                # Confirm that status is an integer value
                if parameter == 'status':
                    try:
                        int(request.args[parameter])
                    except ValueError:
                        parameters = []
                        break
                    values.append(int(request.args[parameter]))
                else:
                    values.append(request.args[parameter])
                parameters.append('{parameter} = %s'.format(parameter=parameter))
        if len(parameters) == 0:
            conn.close()
            return { 'error': 'Invalid PUT request' }
        parameters = ','.join(parameters)
        statement = 'UPDATE tasks SET {parameters} WHERE id = %s RETURNING id, title, description, status'.format(parameters=parameters)
        values.append(id)

        with conn.cursor() as cur:
            cur.execute(statement, values)
            updated_task = cur.fetchone()
            cur.close()
            conn.commit()
        conn.close()
        redis.delete(id)
        redis.delete('all_tasks')
        return dump_task_row(updated_task)
    
    return { 'error': 'Invalid request'}



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)

