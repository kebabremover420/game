const socket = io.connect('http://3.21.169.88:8080/');
var userid;
var localusers = []
var posx = 1;
var posy = 1;
var alreadyid = false;
var chooseduser = document.getElementById("chooseduser").innerHTML;
var audiofile;
var foodpositions = [];
const audiofiles = ["buli", "kisegito", "fantacska", "kicsi", "szaguldas", "talalkozas", "mozgekonyak", "szarhazi"];

for (var i = 0; i < audiofiles.length; i++) {
	addsound(audiofiles[i])
}

function addsound(gombid) {
	document.getElementById(gombid).addEventListener('click', function () {
		playsound(gombid + "sound")
	});
}

addsound("buli");

function playsound(soundtype) {
	socket.emit('playsound', soundtype);
	return
}

function drawfeed(x, y) {
	const feed = document.createElement("div")
	feed.className = "feed"
	feed.style.position = "absolute";
	feed.style.left = x + 'px';
	feed.style.top = y + 'px';
	feed.style.backgroundColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
	document.getElementById("gamearea").appendChild(feed)
}

socket.on('playsoundonclient', function(soundtypeclient) {
	audiofile = document.getElementById(soundtypeclient)
	audiofile.play();
	const gombok = document.getElementsByClassName("btn-secondary");
	for (var i = 0; i < gombok.length; i++) {
		gombok[i].style.backgroundColor="#333333";
		gombok[i].disabled = true;
	}
	setTimeout(function(){
		const gombok = document.getElementsByClassName("btn-secondary");
		for (var i = 0; i < gombok.length; i++) {
			gombok[i].style.backgroundColor="#6c757d";
			gombok[i].disabled = false;
		}
	}, audiofile.duration*1000);
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
	let a;
	let newdiv;
	for(let i = 0; i<currentusers["name"].length; i++){
		if (localusers.includes(currentusers["name"][i])){
			console.log("")
		} else{
			if(currentusers["hos"][i] === "kiki"){
				newdiv = `<div class="user" id="${currentusers["name"][i]}"><img class="user" src="/static/images/kikismall.png"></div>`;
			}else if (currentusers["hos"][i] === "bartos"){
				newdiv = `<div class="user" id="${currentusers["name"][i]}"><img class="user" src="/static/images/bartosbig.png"></div>`;
			}
			document.getElementById("gamearea").innerHTML += newdiv
			localusers.push(currentusers["name"][i])
		}
		if (currentusers["name"][i] === userid) {
			if(currentusers["hos"][i] === "kiki"){
				const gombok = document.getElementsByClassName("kiki");
				for (a = 0; a < gombok.length; a++) {
					gombok[a].style.display = "inline-block";
				}
			}else if (currentusers["hos"][i] === "bartos"){
				const gombok = document.getElementsByClassName("bartos");
				for (a = 0; a < gombok.length; a++) {
					gombok[a].style.display = "inline-block";
				}
			}
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
	}
	if (pressed==="s"){
		posy = posy + 5;
		if (posy > 730) {
			posy = 730
		}
	}
	if (pressed==="a"){
		posx = posx - 5;
		if (posx < 0) {
			posx = 0;
		}
	}
	if (pressed==="d"){
		posx = posx + 5;
		if (posx > 1150) {
			posx = 1150;
		}
	}
	placeDiv(document.getElementById(userid), posx, posy);
	posxfunc = posx;
	posyfunc = posy;
	socket.emit('usermove', `${userid}:${posx}:${posy}`);
}

socket.on('useraction', function(usermovefromflask) {
	if(usermovefromflask[0] === userid ){
		
	} else {
		placeDiv(document.getElementById(usermovefromflask[0]), usermovefromflask[1], usermovefromflask[2]);
	}
})

socket.on('divdelete', function(leftuser) {
	const torlendouser = leftuser;
	localusers.splice(localusers.indexOf(torlendouser),localusers.indexOf(torlendouser));
	document.getElementById(leftuser).remove();
})

socket.on('feedlist', function(feedlist) {
	console.log("lefut: " + feedlist)
	for (let a = 0; a < feedlist.length; a++) {
		let position = feedlist[a];
		foodpositions.push(feedlist[a]);
		position = position.split(":");
		drawfeed(position[0], position[1])
	}
})
