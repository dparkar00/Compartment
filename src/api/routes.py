"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import requests
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from datetime import datetime, timedelta
import hashlib
from werkzeug.security import generate_password_hash
from openai import OpenAI


client = OpenAI()

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
   

@api.route('/signin', methods=['POST'])
def create_signin():
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    if email is not None and password is not None:
        hashed_password = hashlib.sha256(password.encode()).hexdigest()
        user = User.query.filter_by(email = email, password = hashed_password).first()
        if not user: 
            return jsonify(error = "Invalid credentials"), 404
        access_token = create_access_token(identity = user.id)
        return jsonify(access_token = access_token)
    return jsonify(error = "Missing email or password"), 400

@api.route('user', methods=['GET'])
@jwt_required()
def get_user():
    id = get_jwt_identity()
    user = User.query.get(id).first()
    if user is None:
        raise APIException('user not found', status_code = 404)
    return jsonify(user.serialize()), 200

# @api.route('/user', methods=['GET'])
# def get_all_users():
#     users = User.query.all()
#     all_users = list(map(lambda x:x.serialize(), users))
#     return jsonify(all_users), 200


@api.route('/signup', methods = ['POST'])
def create_user():
    body = request.get_json()
    if "email" not in body:
        return jsonify({'error': 'You need to specify the email'}), 400
    if "password" not in body:
        return jsonify({'error': 'You need to specify the password'}), 400
    email = body['email']
    password = body['password']
    hashed_password = hashlib.sha256(password.encode()).hexdigest()
    new_user = User(email = email, password = hashed_password, is_active=True)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'Signup successful'}), 200


@api.route('/chatgpt/ask', methods = ["POST"])
def generate_city_list ():
    request_body = request.json
    user_prompt = request_body["user_prompt"]
    if not user_prompt: return jsonify(message = "Please provide a prompt"), 400
    completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": """
        I'm going to ask you questions about different places to live, please answer only with cities names and their attributes as well as with JSON only. Do not use anything that is not JSON. Do not answer questions about cities outside of the United States. Return a JSON error if so. You should return a list of 10 cities that matches the interests described for the user. The JSONs should have the following format: 

        {
        weather: "[replace with climate] - [replace with average temperature]",
        city: "string",
        state: "string",
        population: int,
        populationDensity: int,
        message: "Some good thing about this city and how it matches the user interests.",
        walkable: [boolean yes/no],
        }
        """},
        {"role": "user", "content": user_prompt}
        ]
    )
    return jsonify(result = completion.choices[0].message)



# @api.route('/private', methods=['GET'])
# @jwt_required()
# def handle_private():
#     current_user_id = get_jwt_identity()
#     user = User.query.get(current_user_id)
    
#     if user is None:
#         return jsonify({"msg": "Please signin"})
#     else :
#         return jsonify({"user_id": user.id, "email": user.email}), 200