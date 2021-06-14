from typing import Dict
from elasticsearch_dsl.query import Bool, Q
import json
from flask.json import jsonify
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk
from elasticsearch_dsl import Search
from flask import Flask, request, render_template
from flask_cors import CORS
from Packet import ELASTIC_URL, INDEX_NAME, PER_PAGE, AUTOCOMP_LIMIT
from populate_elastic import main

app = Flask(__name__, static_folder="build/static", template_folder="build")
CORS(app)
elastic = Elasticsearch([ELASTIC_URL], verify_certs=True)


@app.route('/bulk-add-packets', methods=['POST'])
def bulk_add_packets():
    json_ = json.loads(request.json)
    print(json_, type(json_))
    bulk(index=INDEX_NAME, client=elastic, actions=(json_))
    return {"ok": True}


@app.route('/search-match', methods=['POST'])
def search_match():
    json_ = (request.json)
    page: int = json_['page']
    fields_to_match: Dict = json_['fields']
    keys = fields_to_match.keys()
    from_ = PER_PAGE * page
    s = Search(index=INDEX_NAME)
    s = s.using(elastic)
    for key in keys:
        q = Bool(must=[Q('terms', **{key: (fields_to_match[key])})])
        s = s.query(q)
    s = s[from_: from_ + PER_PAGE]
    results = s.execute()
    _response = []
    for hit in results:
        _dict = hit.to_dict()
        # add elastic id to each hit, instead of usning indices in react
        _dict['id'] = hit.meta.id
        _response.append((_dict))
    return jsonify({"total": results.hits.total.value, "data": _response})


@app.route('/autocomplete', methods=['POST'])
def autocomplete():
    json_ = (request.json)
    word: str = json_['word']
    field: str = json_['complete_field']
    fields_to_match: Dict = json_['fields']
    keys = fields_to_match.keys()

    s = Search(index=INDEX_NAME)
    s = s.using(elastic)
    q = Q("regexp", **{field: {"value": f"{word}.*"}})
    s = s.query(q)
    s = s.source([field])
    for key in keys:
        q = Bool(must=[Q('terms', **{key: (fields_to_match[key])})])
        s = s.query(q)

    s = s[0: AUTOCOMP_LIMIT]
    results = s.execute()
    _response = []
    for hit in results:
        _dict = hit.to_dict()
        _dict['id'] = hit.meta.id
        _response.append((_dict))
    return jsonify({"total": results.hits.total.value, "data": _response})


@app.route('/')
def index_page():
    return render_template('index.html')
