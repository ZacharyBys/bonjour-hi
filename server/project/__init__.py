import os
from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from pathlib import Path


# setup extensions
socketio = SocketIO()


def create_app(script_info=None):

    app = Flask(__name__)
    CORS(app)
    setup_blueprints(app)

    # setup extensions
    socketio.init_app(app)

    return app


def setup_blueprints(app):
    from project.routes import main as socket_blueprint
    from project.routes.views import views_bp
    from project.routes.api import api_bp

    app.register_blueprint(socket_blueprint)
    app.register_blueprint(views_bp)
    app.register_blueprint(api_bp)
