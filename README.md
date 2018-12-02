# Bonjour, Hi!

Bonjour-hi is a multilingual video chat room platform, allowing you to video chat with people from all around the world, without having to speak their language!

### What it does

You can create video chat rooms, and invite other users to join them. Each user picks their own language, and they hear all of the other users, translated to their own language! You can have a chatroom with someone speaking German, someone speaking English, and someone speaking French, and they'll all be hearing the conversation in their own language, allowing for easy communication with anyone.

![Screenshot of App](https://i.imgur.com/cO4EIvq.png)

## Backend

- Flask server is located at `/server/`
- Create python3.6+ virtual environment and activate it
    - `pip install -r requirements.txt`
- Copy .env file `cp .env.example .env` and setup environment
- Run `python manage.py run` or `gunicorn --worker-class gevent -b 0.0.0.0:5000 manage:app`

## Frontend

- React app is located at `/client/`
- Run `npm install`
- `npm start`
- App is now running on `http://localhost:3000`
