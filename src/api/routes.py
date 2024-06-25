"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import requests


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)



@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/apartments', methods=['GET'])
def get_apartments():
    
    url = "https://realtor-search.p.rapidapi.com/properties/search-rent"

    querystring = {"location":"city:San Francisco, CA","sortBy":"newest","propertyType":"apartment"}

    headers = {
        "x-rapidapi-key": "8c3485de4cmsh6d4dd16a945074ep14c798jsn2b52d362f60d",
        "x-rapidapi-host": "realtor-search.p.rapidapi.com"
    }

    response = requests.get(url, headers=headers, params=querystring)
    data = response.json()
    return jsonify(data),200
   
@api.route('/chatgpt/ask', methods = ["POST"])
def generate_city_list ():
    request_body = request.json
    user_prompt = request_body["user_prompt"]
    if not user_prompt: return jsonify(message = "Please provide a prompt"), 400
