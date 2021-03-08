const socket = io.connect('http://nkapp.tk/');
var userid;
var localusers = []
var posx = 1;
var posy = 1;
var alreadyid = false;
var chooseduser = document.getElementById("chooseduser").innerHTML;
var audiofile;
var foodpositions = [];
var wdown = false;
var sdown = false;
var adown = false;
var ddown = false;
var eatenfoods = [];
var allfood = document.getElementsByClassName("feed")
const audiofiles = ["buli", "kisegito", "fantacska", "kicsi", "szaguldas", "talalkozas", "mozgekonyak", "szarhazi"];

//Gameloop
setInterval(onTimerTick, 33); // kb 30fps

function onTimerTick() {
	if (wdown===true){
		posy = posy - 5;
		if (posy < 0) {
			posy = 0
		}
		placeDiv(document.getElementById(userid), posx, posy);
		socket.emit('usermove', `${userid}:${posx}:${posy}`);
	}
	if (sdown===true){
		posy = posy + 5;
		if (posy > 730) {
			posy = 730
		} else {
			placeDiv(document.getElementById(userid), posx, posy);
			socket.emit('usermove', `${userid}:${posx}:${posy}`);
		}

	}
	if (adown===true){
		posx = posx - 5;
		if (posx < 0) {
			posx = 0;
		} else {
			placeDiv(document.getElementById(userid), posx, posy);
			socket.emit('usermove', `${userid}:${posx}:${posy}`);
		}

	}
	if (ddown===true){
		posx = posx + 5;
		if (posx > 1150) {
			posx = 1150;
		} else {
			placeDiv(document.getElementById(userid), posx, posy);
			socket.emit('usermove', `${userid}:${posx}:${posy}`);
		}
	}
	for (var i = 0; i < allfood.length; i++){
		if (utkozes(posx+25, posy+25, 25, Number(allfood[i].style.left.slice(0, -2))+5, Number(allfood[i].style.top.slice(0, -2))+5, 5)) {
			let justeaten = allfood[i].style.left.slice(0, -2) + ":" + allfood[i].style.top.slice(0, -2);
			if (eatenfoods.includes(justeaten)){

			} else {
				console.log("kuldes: " + justeaten)
				socket.emit("eaten", justeaten);
				eatenfoods.push(justeaten);
			}
		}
	}
}
//


for (var i = 0; i < audiofiles.length; i++) {
	addsound(audiofiles[i])
}

function removefood(foodtoremoveid) {
	document.getElementById(foodtoremoveid).remove();
}

function utkozes(p1x, p1y, r1, p2x, p2y, r2) {
  var a;
  var x;
  var y;

  a = r1 + r2;
  x = p1x - p2x;
  y = p1y - p2y;

  if (a > Math.sqrt((x * x) + (y * y))) {
	return true;

  } else {
    return false;
  }
}

function addsound(gombid) {
	document.getElementById(gombid).addEventListener('click', function () {
		playsound(gombid + "sound")
	});
}

addsound("buli");

function playsound(soundtype) {
	socket.emit('playsound', soundtype);
}
function placeDiv(elem, x_pos, y_pos) {
  elem.style.position = "absolute";
  elem.style.left = x_pos+'px';
  elem.style.top = y_pos+'px';
}

function drawfeed(x, y) {
	const feed = document.createElement("div")
	feed.className = "feed";
	feed.id = x + ":" + y;
	feed.style.position = "absolute";
	feed.style.left = x + 'px';
	feed.style.top = y + 'px';
	feed.style.backgroundColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
	document.getElementById("gamearea").appendChild(feed)
}

socket.on('playsoundonclient', function(soundtypeclient) {
	audiofile = document.getElementById(soundtypeclient);
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

window.addEventListener('keydown', billentyule, true);
window.addEventListener('keyup', billentyufel, true);
function billentyufel(event){
	if (event.key==="w"){
		wdown = false;
	}
	if (event.key==="s"){
		sdown = false;
	}
	if (event.key==="a"){
		adown = false;

	}
	if (event.key==="d"){
		ddown = false;
	}
}
function billentyule(event) {
	if (event.key === "w") {
		if (wdown === false) {
			wdown = true;
		}
	}
	if (event.key === "s") {
		if (sdown === false) {
			sdown = true;
		}
	}
	if (event.key === "a") {
		if (adown === false) {
			adown = true;
		}
	}
	if (event.key === "d") {
		if (ddown === false) {
			ddown = true;
		}
	}
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
	for (let a = 0; a < feedlist.length; a++) {
		let position = feedlist[a];
		foodpositions.push(feedlist[a]);
		position = position.split(":");
		drawfeed(position[0], position[1])
	}
})
socket.on("foodeaten", function(foodeaten) {
	console.log("kapott: " + foodeaten)
	removefood(foodeaten);
	//let elem = "#" + foodeaten;
	//console.log(elem)
	//$(elem).remove();
	//elem.style.display = "none";
	//elem.parentNode.removeChild(elem);
	//document.getElementById(foodeaten).remove();

})
