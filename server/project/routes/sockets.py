from project import socketio

@socketio.on('connect', namespace='/')
def test_connect():
    print('Client connect')

@socketio.on('disconnect', namespace='/')
def test_disconnect():
    print('Client disconnected')