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
import json


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

    processed_data = process_realtor_data(data)
    return jsonify(processed_data),200
   
def process_realtor_data(data):
    processed_listings = []
    
    for listing in data.get('data', {}).get('results', []):
        processed_listing = {
            'property_id': listing.get('property_id'),
            'status': listing.get('status'),
            'price': listing.get('list_price'),
            'address': {
                'line': listing.get('location', {}).get('address', {}).get('line'),
                'city': listing.get('location', {}).get('address', {}).get('city'),
                'state': listing.get('location', {}).get('address', {}).get('state'),
                'postal_code': listing.get('location', {}).get('address', {}).get('postal_code'),
            },
            'bedrooms': listing.get('description', {}).get('beds'),
            'bathrooms': listing.get('description', {}).get('baths_full_calc'),
            'square_feet': listing.get('description', {}).get('sqft'),
            'property_type': listing.get('description', {}).get('type'),
            'photo_url': listing.get('primary_photo', {}).get('href'),
        }
        processed_listings.append(processed_listing)
    
    return processed_listings


    @api.route('/analyze_apartments', methods=['POST'])
    def analyze_apartments():
        user_preferences = request.json.get('preferences', '')

        print("analyze_apartments endpoint was called")
        
        # Fetch apartment data
        url = "https://realtor-search.p.rapidapi.com/properties/search-rent"
        querystring = {"location":"city:San Francisco, CA","sortBy":"newest","propertyType":"apartment"}
        headers = {
            "x-rapidapi-key": "8c3485de4cmsh6d4dd16a945074ep14c798jsn2b52d362f60d",
            "x-rapidapi-host": "realtor-search.p.rapidapi.com"
        }
        response = requests.get(url, headers=headers, params=querystring)
        data = response.json()
        
        # Process apartment data
        processed_data = process_realtor_data(data)
        
        # Analyze with OpenAI
        openai_prompt = f"Analyze these apartments based on the following user preferences: {user_preferences}\n\nApartment data: {json.dumps(processed_data)}"
        
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that analyzes apartment listings based on user preferences."},
                {"role": "user", "content": openai_prompt}
            ]
        )
        
        analysis = completion.choices[0].message.content
        
        # Combine results
        result = {
            "apartments": processed_data,
            "analysis": analysis
        }
        
        return jsonify(result), 200


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

@api.route('/homesearch', methods=["POST"])
def generate_home_list():
    request_body = request.json
    user_prompt = request_body["user_prompt"]
    if not user_prompt:
        return jsonify(message="Please provide a prompt"), 400
    
    completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": """
        I'm going to ask you questions about homes. Do not use anything that is not JSON. You should return a list of 5 homes that matches the interests described for the user. The JSONs should have the following format:

        {
        city: "string",
        state: "string",
        price: int,
        bedrooms: int,
        bathrooms: float,
        squareFeet: int,
        }
        """},
        {"role": "user", "content": user_prompt}
    ]
    )

    initial_response = json.loads(completion.choices[0].message.content)
    city = initial_response['city']
    state = initial_response['state']
    price = initial_response['price']
    bedrooms = initial_response['bedrooms']
    yearBuilt = initial_response['yearBuilt']
    squareFeet = initial_response['squareFeet']
    bathrooms = initial_response['bathrooms']

    return jsonify(result=json.loads(completion.choices[0].message.content))

@api.route('/chatgpt/ask', methods = ["POST"])
def generate_city_list ():
    request_body = request.json
    user_prompt = request_body["user_prompt"]
    if not user_prompt: return jsonify(message = "Please provide a prompt"), 400
    completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": """
        I'm going to ask you questions about different places to live. Do not use anything that is not JSON. You should return a list of 10 cities that matches the interests described for the user. The JSONs should have the following format: 

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
    return jsonify(result = json.loads(completion.choices[0].message.content))



# @api.route('/private', methods=['GET'])
# @jwt_required()
# def handle_private():
#     current_user_id = get_jwt_identity()
#     user = User.query.get(current_user_id)
    
#     if user is None:
#         return jsonify({"msg": "Please signin"})
#     else :
#         return jsonify({"user_id": user.id, "email": user.email}), 200