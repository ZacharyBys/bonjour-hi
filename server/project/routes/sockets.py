from flask_socketio import emit, join_room, leave_room
from project import socketio

# global variables
ROOMS = {}


@socketio.on('connect', namespace='/')
def test_connect():
    pass

@socketio.on('disconnect', namespace='/')
def test_disconnect():
    pass

@socketio.on('leave', namespace='/')
def on_leave(data):
    global ROOMS
    user = data['user']
    room = data['room']

    if room in ROOMS and user in ROOMS[room]:
        ROOMS[room].remove(user)
    unique_user = list(set(ROOMS[room]))
    leave_room(room)
    emit('status', {'msg': f'{user} has left the room.', 'users': unique_user}, room=room)


@socketio.on('join', namespace='/')
def on_leave(data):
    user = data['user']
    room = data['room']

    if room not in ROOMS:
        ROOMS[room] = []
    
    ROOMS[room].append(user)
    unique_user = list(set(ROOMS[room]))
    join_room(room)
    emit('status', {'msg': f'{user} has joined the room.', 'users': unique_user}, room=room)


@socketio.on('status', namespace='/')
def status():
    emit('status', {'msg': ROOMS[room]}, room=room)

@socketio.on('originalTranscript', namespace='/')
def originalTranscript(data):
    user = data['user']
    room = data['room']
    transcript = data['transcript']
    language = data['language']
    emit('receiveTranscript', {'msg': transcript, 'user':user, 'language':language}, room=room)


@socketio.on('sendFrames', namespace='/')
def sendFrames(data):
    user = data['user']
    room = data['room']
    img = data['img']
    emit('receiveFrames', {'img': img, 'user':user}, room=room)