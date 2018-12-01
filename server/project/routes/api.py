from flask import Blueprint, jsonify, request

api_bp = Blueprint('api', __name__, url_prefix='/api')


@api_bp.route('/ping', methods=["GET"])
def get_room():
    return jsonify({'data': 'pong', 'error': ''})
