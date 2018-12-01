from flask import Blueprint

views_bp = Blueprint('views', __name__)


@views_bp.route('/')
def index():
    return 'hello world'