const socket = io.connect('http://3.21.169.88:8080/');
var userid;
var localusers = []
var posx = 1;
var posy = 1;
var alreadyid = false;
var chooseduser = document.getElementById("chooseduser").innerHTML;

//const kisegito = new Audio('kisegito.mp3');
//const buli = new Audio('buli.mp3');


document.getElementById("buli").addEventListener('click', function () {
	playsound("buli")
});
document.getElementById("kisegito").addEventListener('click', function () {
	playsound("kisegito")
});

function playsound(soundtype) {
	console.log("klikk: " + soundtype);
	socket.emit('playsound', soundtype);
	return
}

socket.on('playsoundonclient', function(soundtypeclient) {
	if (soundtypeclient==="buli") {
		console.log("start")
		const audiofile = document.getElementById("bulisound");
		audiofile.play();
		setTimeout(function(){
			console.log('vege');
		}, audiofile.duration*1000);
		console.log("duration: " + audiofile.duration)

	}
	if (soundtypeclient==="kisegito") {
		const audiofile = document.getElementById("kisegitosound");
		audiofile.play();
	}
});

socket.on('connect', function() {
	socket.emit('connection', `user_connected:${chooseduser}`);
	socket.on('getuserid', function(id) {
		if (alreadyid === false){
			userid = id;
			alreadyid = true;
		}
	})
});
socket.on('currentusers', function(currentusers) {
	console.log(currentusers)
	console.log(currentusers["name"])
	for(let i = 0; i<currentusers["name"].length; i++){
		if (localusers.includes(currentusers["name"][i])){
			console.log(localusers)
		} else{
			if(currentusers["hos"][i] === "kiki"){
				var newdiv = `<div class="user" id="${currentusers["name"][i]}"><img class="user" src="/static/images/kikismall.png"></div>`
			}else{
				var newdiv = `<div class="user" id="${currentusers["name"][i]}"><img class="user" src="/static/images/bartosbig.png"></div>`
			}
			document.getElementById("gamearea").innerHTML += newdiv
			localusers.push(currentusers["name"][i])
		}

	}
})

window.addEventListener("keypress", mozgas);
function placeDiv(elem, x_pos, y_pos) {
  elem.style.position = "absolute";
  elem.style.left = x_pos+'px';
  elem.style.top = y_pos+'px';
}
function mozgas(event){
	pressed = event.key;
	if (pressed==="w"){
		posy = posy - 5;
		if (posy < 0) {
			posy = 0
		}
		placeDiv(document.getElementById(userid), posx, posy);
		posxfunc = posx;
		posyfunc = posy;
		socket.emit('usermove', `${userid}:${posx}:${posy}`);
	}
	if (pressed==="s"){
		posy = posy + 5;
		if (posy > 730) {
			posy = 730
		}
		placeDiv(document.getElementById(userid), posx, posy);
		posxfunc = posx;
		posyfunc = posy;
		socket.emit('usermove', `${userid}:${posx}:${posy}`);
	}
	if (pressed==="a"){
		posx = posx - 5;
		if (posx < 0) {
			posx = 0;
		}
		placeDiv(document.getElementById(userid), posx, posy);
		posxfunc = posx;
		posyfunc = posy;
		socket.emit('usermove', `${userid}:${posx}:${posy}`);
	}
	if (pressed==="d"){
		posx = posx + 5;
		if (posx > 1150) {
			posx = 1150;
		}
		placeDiv(document.getElementById(userid), posx, posy);
		posxfunc = posx;
		posyfunc = posy;
		socket.emit('usermove', `${userid}:${posx}:${posy}`);
	}
}

socket.on('useraction', function(usermovefromflask) {
	if(usermovefromflask[0] === userid ){
		
	} else {
		placeDiv(document.getElementById(usermovefromflask[0]), usermovefromflask[1], usermovefromflask[2]);
	}
})

socket.on('divdelete', function(leftuser) {
	var torlendouser = leftuser;
	//var userindex = localusers.findIndex(torlendouser)
	//console.log("userindex: " + userindex)
	localusers.splice(localusers.indexOf(torlendouser),localusers.indexOf(torlendouser));
	document.getElementById(leftuser).remove();
})
