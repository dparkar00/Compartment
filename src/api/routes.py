"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, logging, request, jsonify, url_for, Blueprint
from api.models import db, User, Categories, Listings
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import requests

from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from datetime import datetime, timedelta
import hashlib
from werkzeug.security import generate_password_hash


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


api_key= 'AIzaSyA78pBoItwl17q9g5pZPNUYmLuOnTDPVo8'
def get_coordinates(address, api_key):
    base_url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {
        "address": address,
        "key": api_key
    }
    response = requests.get(base_url, params=params)
    if response.status_code == 200:
        data = response.json()
        if data['status'] == 'OK' and len(data['results']) > 0:
            location = data['results'][0]['geometry']['location']
            return location['lat'], location['lng']
        else:
            raise Exception("No results found or API error")
    else:
        raise Exception(f"Request failed with status code {response.status_code}")

@api.route('/geocode', methods=['GET'])
def geocode():
    address = request.args.get('address')
    if not address:
        return jsonify({"error": "Address parameter is required"}), 400

    try:
        latitude, longitude = get_coordinates(address, api_key)
        return jsonify({"latitude": latitude, "longitude": longitude})
    except Exception as e:
        return jsonify({"error": str(e)}), 500





@api.route('/apartments', methods=['GET'])
def get_apartments():
    location = request.args.get('location', 'San Francisco, CA')
    beds = request.args.get('beds')
    baths = request.args.get('baths')

    url = "https://realtor-search.p.rapidapi.com/properties/search-rent"

    querystring = {
        "location": f"city:{location}",
        "sortBy": "newest",
        "propertyType": "apartment"
    }

    if beds:
        querystring["beds"] = beds
    if baths:
        querystring["baths"] = baths

    headers = {
        "x-rapidapi-key": "8c3485de4cmsh6d4dd16a945074ep14c798jsn2b52d362f60d",
        "x-rapidapi-host": "realtor-search.p.rapidapi.com"
    }

    response = requests.get(url, headers=headers, params=querystring)
    data = response.json()
    return jsonify(data), 200
   


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

@api.route('/user', methods=['GET'])
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


# @api.route('/private', methods=['GET'])
# @jwt_required()
# def handle_private():
#     current_user_id = get_jwt_identity()
#     user = User.query.get(current_user_id)
    
#     if user is None:
#         return jsonify({"msg": "Please signin"})
#     else :
#         return jsonify({"user_id": user.id, "email": user.email}), 200

#----------------------------------------JP---------------------------------------

#route for getting Categories
@api.route('/categories', methods=['GET'])
# @jwt_required()
def get_categories():
    all_categories = list(map(lambda x: x.serialize(), Categories.query.all()))
    return jsonify(all_categories)

#route for createCategory
@api.route('/create_category', methods=['POST'])
# @jwt_required()
def create_category():
    data = request.get_json()
    uid = 1
    # get_jwt_identity()

    category_name = data.get('name')

    # Check if category_name is provided and not empty
    if category_name:
        # Add the category to the list (simulating storage)
        category = Categories(uid = uid, categoryName = category_name)
        db.session.add(category)
        db.session.commit()
        return jsonify({'message': 'Category created successfully'}), 200
    else:
        return jsonify({'error': 'Category name is required'}), 400
    
@api.route('/delete_category', methods=['DELETE'])
def delete_category():
    return

    
# creating new entry to database from chatgpt
@api.route('/add_listing', methods=['POST'])
def add_listing():
    data = request.json  # Assuming data is sent as JSON
    
    # Example of adding a listing
    new_listing = Listings(cid=data['cid'], listingName=data['listingName'])
    db.session.add(new_listing)
    db.session.commit()
    
    return jsonify({'message': 'Listing added successfully'}), 201

@api.route("/get_listing_by_cat", methods=["GET"])
def get_listings_by_cat():
    data = request.json
    all_listings = list(map(lambda x: x.serialize(), Listings.query.all()))
    cat_name = data['category']

    return jsonify(all_listings)
    # query category table by name to get the id to then get the correct listings
    # filters the listings by catogory and return only those

#---------------------------------Secret Valerie Code-------------------------------

# @api.route('/user', methods=['GET'])
# @jwt_required()
# def get_user():
#     id = get_jwt_identity()
#     user = User.query.filter_by(id=id).first()

#     if user is not None:
#         return jsonify(user.serialize()), 200

#     return jsonify({"message": "Uh-oh"}), 400

# @api.route('/room', methods=['POST'])
# def add_room():
#     request_body = request.get_json(force=True)
#     name = request_body.get("name")
#     pic_url = request_body.get("pic_url")
#     objects = request_body.get("objects")
#     meta_tags = request_body.get("meta_tag")

#     return jsonify(request_body), 200

# @api.route('/rooms', methods=['GET'])
# def get_rooms():
#     rooms_list = Room.query
#     if "name" in request.args:
#         rooms_list = rooms_list.filter(Room.name.ilike(f"%{request.args['name']}%"))
#     rooms_list = rooms_list.all()
#     all_rooms = list(map(lambda room: room.serialize(), rooms_list))
#     return jsonify(all_rooms), 200

# @api.route('/objects/<int:id>', methods=['GET'])
# def get_object(id):
#     r_object = Object.query.filter_by(id=id).first()
#     return jsonify(r_object.serialize()), 200
