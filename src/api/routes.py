"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import requests

# UPDATED


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
   













































































# ------------ This is where I am starting the copy and pastes from the JWT Project ------------------

from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from datetime import datetime, timedelta
import hashlib
from werkzeug.security import generate_password_hash


@api.route('/signin', methods=['POST'])
def create_signin():
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    if email is not None and password is not None:
        #password = hashlib.sha256(password.encode()).hexdigest()
        user = User.query.filter_by(email = email, password = password)
    access_token = create_access_token(identity = email)
    return jsonify(access_token = access_token)

@api.route('user/<int:id>', methods=['GET'])
def get_user(id):
    user = User.query.get(id)
    if user is None:
        raise APIException('user not found', status_code = 404)
    return jsonify(user.serialize()), 200

@api.route('/user', methods=['GET'])
def get_all_users():
    users = User.query.all()
    all_users = list(map(lambda x:x.serialize(), users))
    return jsonify(all_users), 200


@api.route('/signup', methods = ['POST'])
def create_user():
    body = request.get_json()
    if "email" not in body:
        return jsonify({'error': 'You need to specify the email'}), 400
    if "password" not in body:
        return jsonify({'error': 'You need to specify the password'}), 400
    email = body['email']
    password = body['password']
    #hashed_password = generate_password_hash(password, method='sha256')
    new_user = User(email = email, password = password, is_active=True)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'Signup successful'}), 200

@api.route('/private', methods=['GET'])
@jwt_required()
def handle_private():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if user is None:
        return jsonify({"msg": "Please signin"})
    else :
        return jsonify({"user_id": user.id, "email": user.email}), 200














