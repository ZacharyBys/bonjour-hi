from flask_socketio import emit, join_room, leave_room
from project import socketio

@socketio.on('connect', namespace='/')
def test_connect():
    print('Client connect')

@socketio.on('disconnect', namespace='/')
def test_disconnect():
    print('Client disconnected')


@socketio.on('leave', namespace='/')
def on_leave(data):
    user = data['user']
    room = data['room']

    leave_room(room)
    emit('status', {'msg': f'{user} has left the room.'}, room=room)



@socketio.on('join', namespace='/')
def on_leave(data):
    user = data['user']
    room = data['room']

    join_room(room)
    emit('status', {'msg': f'{user} has joined the room.'}, room=room)

@socketio.on('status', namespace='/')
def status():
    emit('status', {'msg': ROOMS[room]}, room=room)



@socketio.on('originalTranscript', namespace='/')
def originalTranscript(data):
    user = data['user']
    room = data['room']
    transcript = data['transcript']
    print(transcript)
    emit('receiveTranscript', {'msg': f'{user} said {transcript}'}, room=room)
