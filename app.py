# coding: utf-8
from flask import Flask, render_template, request, jsonify, redirect, url_for, g, session
from flask_socketio import SocketIO, send, emit
app = Flask(__name__)
app.config['SECRET_KEY'] = 'some key for session'
app.config['DEBUG'] = True
socketio = SocketIO(app)

currentuserid = ['user1', 'user2', 'user3', 'user4', 'user5']
currentusers = {"name": [],"sid": [], "hos":[]}
clients = []
@app.route('/')
def index():
    userszamlalo = len(currentusers["name"])
    return render_template('index.html', userszamlalo=userszamlalo)

@app.route('/game')
def game():
    return render_template('jsgame.html')
    
@app.route('/choosecharacter/<character>')
def choosecharacter(character):
    character = character
    return render_template('jsgame.html', chooseduser=character)

@socketio.on('message')
def receivemessage(message):
    send('ez egy valasz')
    
@socketio.on('connection')
def connectionevent(event):
    event = event.split(":")
    givenuser = event[1]
    jelenlegi = currentuserid[0]
    currentuserid.remove(currentuserid[0])
    currentusers["name"].append(jelenlegi)
    currentusers["sid"].append(request.sid)
    currentusers["hos"].append(givenuser)
    socketio.emit('getuserid', str(jelenlegi))
    event = currentusers
    socketio.emit('currentusers', currentusers)

@socketio.on('usermove')
def usermove(positions):
    positions = positions.split(":")
    socketio.emit('useraction', positions)

@socketio.on('disconnect')
def disconnect():
    exitsid = currentusers["sid"].index(request.sid)
    exituser = currentusers["name"][exitsid]
    currentuserid.append(exituser)
    currentusers["sid"].remove(currentusers["sid"][exitsid])
    currentusers["name"].remove(currentusers["name"][exitsid])
    currentusers["hos"].remove(currentusers["hos"][exitsid])
    socketio.emit('divdelete', exituser)
    


if __name__ == '__main__':
    socketio.run(app, host="192.168.0.41")
