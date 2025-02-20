from flask import Flask, request
import gensim.downloader as api
from gensim.models import KeyedVectors
import itertools
from functools import cmp_to_key
from datetime import datetime
from functions import func
import sys
from flask_cors import CORS

startTime = datetime.now()

app = Flask(__name__)
CORS(app)


@app.route('/api/route', methods=['POST'])
def index():
    print('Hello world', file=sys.stderr)
    data = request.get_json()
    ret = func(data)
    return ret, 200