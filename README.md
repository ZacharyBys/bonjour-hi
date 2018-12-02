## Backend

- Flask server is located at `/server/`
- Create python3.6+ virtual environment and activate it
    - `pip install -r requirements.txt`
- Copy .env file `cp .env.example .env` and setup environment
- Run `python manage.py run` or `gunicorn --worker-class gevent -b 0.0.0.0:5000 manage:app`