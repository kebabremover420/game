# coding: utf-8
from flask import Flask, render_template, request
from flask_socketio import SocketIO, send, emit
from random import randint
app = Flask(__name__)
app.config['SECRET_KEY'] = 'some key for session'
app.config['DEBUG'] = True
socketio = SocketIO(app)

currentuserid = ['user1', 'user2', 'user3', 'user4', 'user5']
currentusers = {"name": [],"sid": [], "hos":[]}
kajadivs = ['831:291', '36:706', '800:687', '132:532', '687:290', '195:140', '98:56', '736:477', '261:621', '752:441', '341:344', '747:22', '88:286', '295:684', '149:523', '930:691', '628:705', '446:309', '909:371', '977:605', '240:606', '50:401', '23:323', '136:405', '526:338', '1108:686', '213:320', '629:445', '35:594', '523:59', '319:356', '946:529', '960:224', '435:245', '404:201', '175:122', '362:176']
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


@socketio.on('hidebuttons')
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
    socketio.emit("feedlist", kajadivs)


@socketio.on('usermove')
def usermove(positions):
    positions = positions.split(":")
    socketio.emit('useraction', positions)


@socketio.on('eaten')
def feed(eaten):
    if eaten in kajadivs: kajadivs.remove(eaten) 
    socketio.emit("feedlist", kajadivs)


@socketio.on('playsound')
def playsound(soundtype):
    socketio.emit('playsoundonclient', soundtype)


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
    socketio.run(app, host="0.0.0.0", port="8080")  # rpi: 192.168.0.41 ec2: 3.21.169.88
#usaccess: http://3.124.8.110:8080/
#usaccess: http://3.21.169.88:8080/