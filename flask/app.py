from flask import Flask
from redis import Redis
from sqlalchemy import create_engine
from os import getenv

app = Flask(__name__)
redis = Redis(host='redis', port=6379)

db_engine = create_engine(getenv('DATABASE_URL'))

@app.route('/')
def hello():
    return 'Hello, World!'

@app.route('/api/tasks', methods=['GET'])
def tasks():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)

