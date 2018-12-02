import random
import string
from flask import Blueprint, jsonify, request


api_bp = Blueprint('api', __name__, url_prefix='/api')

UNIQUE_ROOMS = []

@api_bp.route('/ping', methods=["GET"])
def get_room():
    return jsonify({'data': 'pong', 'error': ''})


@api_bp.route('/room/create', methods=["GET"])
def create_room():
    id = create_unique_room()
    return jsonify({'room':id, 'error': ''})


@api_bp.route('/room/join', methods=["POST"])
def join_room():
    return jsonify({'data': 'success', 'error' : ''})


def create_unique_room():
    global UNIQUE_ROOMS
    while True:
        N = 4
        id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=N))
        if id not in UNIQUE_ROOMS:
            UNIQUE_ROOMS.append(id)
            return id

