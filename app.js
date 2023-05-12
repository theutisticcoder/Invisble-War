var socket = io.connect();
var fight = false;
var username;
var users = [];
var winners = 0;
var players = [];
var main;
var range = 200;
var ammo = 20;
let keysPressed = {};
var you;
var matrix2;
var health = document.getElementById("health");
var matrix4;
var matrix = new WebKitCSSMatrix(window.getComputedStyle(document.getElementById("bullet")).transform);
var ps = 0;
var sol1 = document.getElementById("panther");
var matrix3 = new WebKitCSSMatrix(window.getComputedStyle(sol1).transform);
var sold;
var p = 0;
var person;
var roomnumber = 0;
var otherplayer;
function choose() {
	person = prompt("Choose an username!");
	socket.emit("username", person);
}

socket.on("usernotadded", () => {
	person = prompt("Choose a new username. Your old one was taken or it is blank!");
	socket.emit("username", person);
});

choose();
socket.on("roomclosed", (data) => {
	if (typeof users[0 + data.number] != 'undefined' && typeof users[1 + data.number] != 'undefined' && typeof users[2 + data.number] != 'undefined') {
		alert(data.room + " closed. Players are " + users[0 + data.number] + ", " + users[1 + data.number] + ", " + users[2 + data.number]);
		roomnumber = data.room;
		var play = 0;
		users.forEach((player) => {
			player = document.getElementById("score").cloneNode(true);
			player.id = users[play + data.number];
			player.value = users[play + data.number] + ": 0";
			console.log(users[play + data.number]);
			player.classList.add("score");
			player.style.marginBottom = "100px";
			document.body.insertBefore(player, document.getElementById("universe"));
			play++;
		});
	}
});

socket.on("useradded", u => {
	users = u;
});
socket.on("left", (leaving) => {
	alert(leaving + " left.");
});
socket.on("joined", (per) => {
	alert(per + " joined.")
})
socket.on("leave", (u) => {
	users = u;
});
socket.on("gameover", killed => {
	alert(killed + " died.")
});

alert("You have been drafted to fight in the Invisible War. Use arrow keys to move and space to launch a bullet. When you hear a boing sound that is not yours, you will have 5 seconds to run until you are out of range of your target. The catch? No enemy can be seen. Kill the 25 enemies first to win. Good luck...");
function myfunction(tree) {
	tree.src = "explosion.png";
}
var sol1 = document.getElementsByClassName("soldier");
function newgun() {
	matrix = new WebKitCSSMatrix(window.getComputedStyle(document.getElementById("bullet")).transform);
	matrix3 = new WebKitCSSMatrix(window.getComputedStyle(sol1).transform);
	matrix4 = new WebKitCSSMatrix(window.getComputedStyle(document.getElementById("universe")).transform);
	if (matrix4.m41 === -1000 && matrix4.m43 === -7500 && ps === 10) {
		alert("Enjoy your new gun.");
		range = 500;
		document.getElementById("range").innerHTML = "Range: 500";
		document.removeEventListener("keydown", newgun);
	}
}

function pclick() {
	document.getElementById("enemyhealth").value = 5;
	socket.emit("hit", person);
	ps++;
	sol1.style.transform = "translateX(" + (50 * Math.floor(Math.random() * 40)) + "px) translateZ(" + (-50 * Math.floor(Math.random() * 40)) + "px) perspective(60000px) translateY(300px)";
	matrix3 = new WebKitCSSMatrix(window.getComputedStyle(sol1).transform);
	localStorage.setItem("x", matrix3.m41);
	localStorage.setItem("z", matrix3.m43);
	localStorage.setItem("ps", ps);
	matrix4 = new WebKitCSSMatrix(window.getComputedStyle(document.getElementById("universe")).transform);
	console.log(ps);
	document.getElementById("enemy").innerHTML = "A soldier is at X: " + matrix3.m41 + " Z: " + (-matrix3.m43);
	if (ps === 10) {
		alert("Go to X: 0, Z: 0 to get a sniper rifle with 500 range.");

	}
	if (ps === 25) {
		socket.emit("won", person);
		alert("You have a final spot! Once another player finishes, PvP will begin.");
	}
}
socket.on("point", (username) => {
	alert(username + " got a point!");
});
sol1 = document.getElementById("panther");
matrix3 = new WebKitCSSMatrix(window.getComputedStyle(sol1).transform);

var y = -1200;
var a = -7500;
var b = 0;
document.getElementById("universe").style.transform = "translateY(" + y + "px) translateZ(" + a + "px) perspective(" + (a * -2) + "px) translateX(" + b + "px)";

var ry = 0;
function kill() {
	if (ps < 25) {
		matrix = new WebKitCSSMatrix(window.getComputedStyle(document.getElementById("bullet")).transform);
		matrix4 = new WebKitCSSMatrix(window.getComputedStyle(document.getElementById("universe")).transform);
		if (range === 200) {

			setTimeout(() => {
				sol1 = document.getElementById("panther");
				matrix3 = new WebKitCSSMatrix(window.getComputedStyle(sol1).transform);
				console.log((matrix.m41 - (matrix3.m41 - (-matrix4.m41 - 1000))));
				console.log((matrix3.m43 - ((-a - 7500))));
				if ((matrix.m41 - (matrix3.m41 - (-matrix4.m41 - 1000))) >= -200 && (matrix3.m43 - ((-a - 7500))) >= -200 && (matrix.m41 - (matrix3.m41 - (-matrix4.m41 - 1000))) < 200 && (matrix3.m43 - ((-a - 7500))) < 200) {
					document.getElementById("healthp").hidden = false;
					document.getElementById("enemyhealth").hidden = false;
					if ((Math.floor(Math.random() * 10)) === 1) {
						document.getElementById("shot").play();
						setTimeout(() => {
							if ((matrix.m41 - (matrix3.m41 - (-matrix4.m41 - 1000))) >= -200 && (matrix3.m43 - ((-a - 7500))) >= -200 && (matrix.m41 - (matrix3.m41 - (-matrix4.m41 - 1000))) < 200 && (matrix3.m43 - ((-a - 7500))) < 200) {
								health.value--;
								if (health.value === 0) {
									alert("You died.");
									socket.emit("died", person);
									location.reload();
								}
							}
						}, 5000);

					}
					else {
						console.log("You Survived!");
					}
				}
				else {
					document.getElementById("healthp").hidden = true;
					document.getElementById("enemyhealth").hidden = true;
				}
			}, 3000);
		}
		if (range === 500) {
			setTimeout(() => {
				sol1 = document.getElementById("panther");
				matrix3 = new WebKitCSSMatrix(window.getComputedStyle(sol1).transform);
				console.log((matrix.m41 - (matrix3.m41 - (-matrix4.m41 - 1000))));
				console.log((matrix3.m43 - ((-a - 7500))));
				if ((matrix.m41 - (matrix3.m41 - (-matrix4.m41 - 1000))) >= -600 && (matrix3.m43 - ((-a - 7500))) >= -600 && (matrix.m41 - (matrix3.m41 - (-matrix4.m41 - 1000))) < 600 && (matrix3.m43 - ((-a - 7500))) < 600) {
					document.getElementById("healthp").hidden = false;
					document.getElementById("enemyhealth").hidden = false;
					if ((Math.floor(Math.random() * 10)) === 1) {
						document.getElementById("shot").play();
						setTimeout(() => {
							if ((matrix.m41 - (matrix3.m41 - (-matrix4.m41 - 1000))) >= -600 && (matrix3.m43 - ((-a - 7500))) >= -600 && (matrix.m41 - (matrix3.m41 - (-matrix4.m41 - 1000))) < 600 && (matrix3.m43 - ((-a - 7500))) < 600) {
								health.value--;
								if (health.value === 0) {
									alert("You died.");
									socket.emit("died", person);
									location.reload();
								}
							}
							else {
								document.getElementById("healthp").hidden = true;
								document.getElementById("enemyhealth").hidden = true;
							}
						}, 5000);

					}
					else {
						console.log("You Survived!");
					}
				}
			}, 3000);
		}
	}
}
var rx = 0;
var playera = 0, playerb = 0;
var ry = 0;
	matrix4 = new WebKitCSSMatrix(window.getComputedStyle(document.getElementById("universe")).transform);
targetmatrix = matrix4;
document.addEventListener('keydown', function(e) {
	newgun();
	matrix = new WebKitCSSMatrix(window.getComputedStyle(document.getElementById("bullet")).transform);
	matrix4 = new WebKitCSSMatrix(window.getComputedStyle(document.getElementById("universe")).transform);
	sol1 = document.getElementById("panther");
	matrix3 = new WebKitCSSMatrix(window.getComputedStyle(sol1).transform);
	socket.emit("move", matrix4);
	a = parseInt(a);
	b = parseInt(b);
	y = parseInt(y);

	if (e.key == "ArrowUp") {
		e.preventDefault();
		a += 50;
		playera += 50;
		y -= 10;
		localStorage.setItem("y", y);
		localStorage.setItem("a", a);
		a = localStorage.getItem("a");
		y = localStorage.getItem("y");
		document.getElementById("universe").style.transform = "translateY(" + y + "px)  translateZ(" + a + "px) perspective(" + (a * -1.5) + "px) translateX(" + b + "px)";
		sol1.style.transform = "translateY(" + y + "px) translateZ(" + matrix3.m43 + "px) perspective(6000px) translateX(" + matrix3.m41 + "px) ";
	}
	if (e.key == "ArrowDown") {
		e.preventDefault();
		a -= 50;
		playera -= 50;
		y += 10;
		localStorage.setItem("a", a);
		localStorage.setItem("y", y);
		y = localStorage.getItem("y");
		a = localStorage.getItem("a");
		document.getElementById("universe").style.transform = "translateY(" + y + "px)  translateZ(" + a + "px) perspective(" + (a * -1.5) + "px) translateX(" + b + "px)";
		sol1.style.transform = "translateY(" + y + "px) translateZ(" + matrix3.m43 + "px) perspective(6000px) translateX(" + matrix3.m41 + "px)";
	}
	if (e.key == "ArrowRight") {
		e.preventDefault();
		playerb += 50;
		b -= 50;
		localStorage.setItem("b", b);
		b = localStorage.getItem("b");
		document.getElementById("universe").style.transform = "translateY(" + y + "px)  translateZ(" + a + "px) perspective(" + (a * -1.5) + "px) translateX(" + b + "px)";
	}
	if (e.key == "ArrowLeft") {
		e.preventDefault();
		b += 50;
		playerb -= 50;
		localStorage.setItem("b", b);
		b = localStorage.getItem("b");
		document.getElementById("universe").style.transform = "translateY(" + y + "px)  translateZ(" + a + "px) perspective(" + (a * -1.5) + "px) translateX(" + b + "px)";
	}

	if (e.key == " ") {
		matrix = new WebKitCSSMatrix(window.getComputedStyle(document.getElementById("bullet")).transform);
		matrix4 = new WebKitCSSMatrix(window.getComputedStyle(document.getElementById("universe")).transform);

		matrix3 = new WebKitCSSMatrix(window.getComputedStyle(sol1).transform);
		document.getElementById("shot").play();
		if (fight === true) {
					document.getElementById("ammo").innerHTML = "Ammo: ∞";
			setTimeout(() => {
				if (targetmatrix.m41 === (matrix4.m41) && targetmatrix.m43 === (matrix4.m43 + 500)) {
					document.getElementById("enemyhealth").value--;
					socket.emit("playerhit", person);
					if (document.getElementById("enemyhealth").value === 0) {
						socket.emit("userwon");
					}
				}
				else if (targetmatrix.m41 === (matrix4.m41) && targetmatrix.m43 === (matrix4.m43 + 450)) {
					document.getElementById("enemyhealth").value--;
					socket.emit("playerhit", person);
					if (document.getElementById("enemyhealth").value === 0) {
						socket.emit("userwon", person);
					}
				}
				else if (targetmatrix.m41 === (matrix4.m41) && targetmatrix.m43 === (matrix4.m43 + 400)) {
					socket.emit("playerhit", person);
					document.getElementById("enemyhealth").value--;
					if (document.getElementById("enemyhealth").value === 0) {
						socket.emit("userwon", person);
					}
				}
				else if (targetmatrix.m41 === (matrix4.m41) && targetmatrix.m43 === (matrix4.m43 + 350)) {
					socket.emit("playerhit", person);
					document.getElementById("enemyhealth").value--;
					if (document.getElementById("enemyhealth").value === 0) {
						socket.emit("userwon", person);
					}
				}
				else if (targetmatrix.m41 === (matrix4.m41) && targetmatrix.m43 === (matrix4.m43 + 300)) {
					socket.emit("playerhit", person);
					document.getElementById("enemyhealth").value--;
					if (document.getElementById("enemyhealth").value === 0) {
						socket.emit("userwon", person);

					}
				}
				else if (targetmatrix.m41 === (matrix4.m41) && targetmatrix.m43 === (matrix4.m43 + 250)) {
					document.getElementById("enemyhealth").value--;
					socket.emit("playerhit", person);
					if (document.getElementById("enemyhealth").value === 0) {
						socket.emit("userwon", person);
					}
				}
				else if (targetmatrix.m41 === (matrix4.m41) && targetmatrix.m43 === (matrix4.m43 + 200)) { document.getElementById("enemyhealth").value--;
					socket.emit("playerhit", person);
					if (document.getElementById("enemyhealth").value === 0) {
						socket.emit("userwon", person);

					}
				}
				else if (targetmatrix.m41 === (matrix4.m41) && targetmatrix.m43 === (matrix4.m43 + 150)) {
					socket.emit("playerhit", person);
					document.getElementById("enemyhealth").value--;
					if (document.getElementById("enemyhealth").value === 0) {
						socket.emit("userwon", person);
					}
				}
				else if (targetmatrix.m41 === (matrix4.m41) && targetmatrix.m43 === (matrix4.m43 + 100)) { document.getElementById("enemyhealth").value--;
					socket.emit("playerhit", person);
					if (document.getElementById("enemyhealth").value === 0) {
socket.emit("userwon", person);
					}
				}
				else if (targetmatrix.m41 === (matrix4.m41) && targetmatrix.m43 === (matrix4.m43 + 50)) { document.getElementById("enemyhealth").value--;
					socket.emit("playerhit", person);
					if (document.getElementById("enemyhealth").value === 0) {
					socket.emit("userwon", person);
					}
				}
				else if (targetmatrix.m41 === (matrix4.m41) && targetmatrix.m43 === (matrix4.m43)) {
					document.getElementById("enemyhealth").value--;
					socket.emit("playerhit", person);
					if (document.getElementById("enemyhealth").value === 0) {
						socket.emit("userwon", person);
					}
				}
			}, 2000);
		}
		else {
			if (ammo === 0) {
				alert("No ammo. reloading in 3 seconds...");
				setTimeout(() => {
					ammo = 20;
					document.getElementById("ammo").innerHTML = "Ammo: " + ammo;
				}, 3000);
			}
			else {
				ammo--;
				document.getElementById("ammo").innerHTML = "Ammo: " + ammo;
				matrix = new WebKitCSSMatrix(window.getComputedStyle(document.getElementById("bullet")).transform);
				matrix4 = new WebKitCSSMatrix(window.getComputedStyle(document.getElementById("universe")).transform);

				matrix3 = new WebKitCSSMatrix(window.getComputedStyle(sol1).transform);
				if (range === 200) {
					setTimeout(() => {
						if (matrix.m41 === (matrix3.m41 - (-matrix4.m41 - 1000)) && matrix3.m43 === ((-a - 7700))) {
	
							document.getElementById("enemyhealth").value--;
							if (document.getElementById("enemyhealth").value === 0) {
								pclick(sol1);
							}
						}
						else if (matrix.m41 === (matrix3.m41 - (-matrix4.m41 - 1000)) && matrix3.m43 === ((-a - 7650))) {
	
							document.getElementById("enemyhealth").value--;
							if (document.getElementById("enemyhealth").value === 0) {
								pclick(sol1);
							}
						}
						else if (matrix.m41 === (matrix3.m41 - (-matrix4.m41 - 1000)) && matrix3.m43 === ((-a - 7600))) {
	
							document.getElementById("enemyhealth").value--;
							if (document.getElementById("enemyhealth").value === 0) {
								pclick(sol1);
							}
						}
						else if (matrix.m41 === (matrix3.m41 - (-matrix4.m41 - 1000)) && matrix3.m43 === ((-a - 7550))) {
	
							document.getElementById("enemyhealth").value--;
							if (document.getElementById("enemyhealth").value === 0) {
								pclick(sol1);
							}
						}
						else if (matrix.m41 === (matrix3.m41 - (-matrix4.m41 - 1000)) && matrix3.m43 === ((-a - 7500))) {
	
							document.getElementById("enemyhealth").value--;
							if (document.getElementById("enemyhealth").value === 0) {
								pclick(sol1);
							}
						}
					}, 1000);
				}
				else if (range === 500) {
					setTimeout(() => {
						if (matrix.m41 === (matrix3.m41 - (-matrix4.m41 - 1000)) && matrix3.m43 === ((-a - 8000))) {
	
							document.getElementById("enemyhealth").value--;
							if (document.getElementById("enemyhealth").value === 0) {
								pclick(sol1);
							}
						}
						else if (matrix.m41 === (matrix3.m41 - (-matrix4.m41 - 1000)) && matrix3.m43 === ((-a - 7950))) {
	
							document.getElementById("enemyhealth").value--;
							if (document.getElementById("enemyhealth").value === 0) {
								pclick(sol1);
							}
						}
						else if (matrix.m41 === (matrix3.m41 - (-matrix4.m41 - 1000)) && matrix3.m43 === ((-a - 7900))) {
	
							document.getElementById("enemyhealth").value--;
							if (document.getElementById("enemyhealth").value === 0) {
								pclick(sol1);
							}
						}
						else if (matrix.m41 === (matrix3.m41 - (-matrix4.m41 - 1000)) && matrix3.m43 === ((-a - 7850))) {
	
							document.getElementById("enemyhealth").value--;
							if (document.getElementById("enemyhealth").value === 0) {
								pclick(sol1);
							}
						}
						else if (matrix.m41 === (matrix3.m41 - (-matrix4.m41 - 1000)) && matrix3.m43 === ((-a - 7800))) {
	
							document.getElementById("enemyhealth").value--;
							if (document.getElementById("enemyhealth").value === 0) {

							}
							pclick(sol1);
						}
						else if (matrix.m41 === (matrix3.m41 - (-matrix4.m41 - 1000)) && matrix3.m43 === ((-a - 7750))) {
	
							document.getElementById("enemyhealth").value--;
							if (document.getElementById("enemyhealth").value === 0) {
								pclick(sol1);
							}
						}
						else if (matrix.m41 === (matrix3.m41 - (-matrix4.m41 - 1000)) && matrix3.m43 === ((-a - 7700))) {
	 document.getElementById("enemyhealth").value--;
							if (document.getElementById("enemyhealth").value === 0) {

							}
							pclick(sol1);
						}
						else if (matrix.m41 === (matrix3.m41 - (-matrix4.m41 - 1000)) && matrix3.m43 === ((-a - 7650))) {
	
							document.getElementById("enemyhealth").value--;
							if (document.getElementById("enemyhealth").value === 0) {
								pclick(sol1);
							}
						}
						else if (matrix.m41 === (matrix3.m41 - (-matrix4.m41 - 1000)) && matrix3.m43 === ((-a - 7600))) {
	 document.getElementById("enemyhealth").value--;
							if (document.getElementById("enemyhealth").value === 0) {

							}
							pclick(sol1);
						}
						else if (matrix.m41 === (matrix3.m41 - (-matrix4.m41 - 1000)) && matrix3.m43 === ((-a - 7550))) {
	 document.getElementById("enemyhealth").value--;
							if (document.getElementById("enemyhealth").value === 0) {

								pclick(sol1);
							}
						}
						else if (matrix.m41 === (matrix3.m41 - (-matrix4.m41 - 1000)) && matrix3.m43 === ((-a - 7500))) {
							document.getElementById("enemyhealth").value--;
							if (document.getElementById("enemyhealth").value === 0) {
		
								pclick(sol1);
							}
							else {
							}
						}
					}, 1000);
				}

			}
		}
	}
	newgun();
	matrix = new WebKitCSSMatrix(window.getComputedStyle(document.getElementById("bullet")).transform);
	matrix4 = new WebKitCSSMatrix(window.getComputedStyle(document.getElementById("universe")).transform);
	sol1 = document.getElementById("panther");
	matrix3 = new WebKitCSSMatrix(window.getComputedStyle(sol1).transform);
	socket.emit("move", matrix4);
	a = parseInt(a);
	b = parseInt(b);
	y = parseInt(y);
	you = document.getElementById("universe");
	matrix4 = new WebKitCSSMatrix(window.getComputedStyle(you).transform);
	document.getElementById("coordinates").innerHTML = "You are at X: " + (-matrix4.m41 - 1000) + " Z: " + (7500 + matrix4.m43);
	if (ps < 25) {
		document.getElementById("enemy").innerHTML = "A soldier is at X: " + matrix3.m41 + " Z: " + (-matrix3.m43);
	}
	kill();
	socket.emit("keypress", person);
});
socket.emit("move", matrix4);
socket.on("playermoved", (player) => {
	console.log(player);
	document.getElementById(player).style.transform = "translateZ(" + playera + "px) perspective(" + (playera * 1.5) + "px) translateX(" + playerb + "px) ";
})
var dirt = document.getElementById("boxDiv");
var rows = document.getElementById('mainDiv');
var dirtnew;
for (var i = 0; i < 5000; i += 50) {
	dirtnew = dirt.cloneNode(true);
	dirtnew.style.transform = "translateY(" + (-i) + "px) translateX(" + (i - 500) + "px)";
	dirtnew.style.height = "50px";
	dirtnew.style.width = "50px";
	dirtnew.style.transformStyle = "preserve-3d";
	rows.appendChild(dirtnew);
}
var newrow;
var z = 0;
while (z < 5000) {
	z += 50;
	newrow = rows.cloneNode(true);
	newrow.style.top = "100px";
	newrow.style.height = "1000px";
	newrow.style.width = "1000px";
	newrow.style.perspective = "800px";
	newrow.style.position = "absolute";
	newrow.style.transform = "rotateX(180deg) translateY(1600px) perspective(6000px) translateZ(" + z + "px)";

	document.getElementById('world').appendChild(newrow);
}


var t = 0;
for (var i = 0; i < document.getElementsByClassName("tree").length; i++) {
	t++;
	if (t === 3) {
		document.getElementsByClassName("tree")[i].hidden = false;
		t = 0;
	}
}
socket.on("winner", (winner) => {
	winners++;
	alert(winner + " has a final spot!");
});
socket.on("winners", people => {
	console.log(people);
	if (people.includes(person)) {
		alert("The fight shall begin!");
		fight = true;
		health.max = 20
		health.value = 20;
		document.getElementById("ammo").innerHTML = "Ammo: ∞";
		document.getElementById("enemyhealth").max = 20;
		document.getElementById("enemyhealth").value = 20;
			document.getElementById("enemy").innerHTML = "The target is at X: " + (-1000 - targetmatrix.m41) + " Z: " + (targetmatrix.m43 + 7500);
		document.getElementById("enemyhealth").hidden = false;
		document.getElementById("healthp").hidden = false;
	}
	else {
		alert("Sorry, you did not finish before the other players. Good luck next time!");
	}
});
socket.on("enemymoved", (enematrix) => {
	if (ps >= 25) {
		otherplayer = document.getElementById("other");
		targetmatrix = enematrix;
		document.getElementById("enemy").innerHTML = "The target is at X: " + (-1000 - enematrix.m41) + " Z: " + (enematrix.m43 + 7500);
		otherplayer.style.transform = "translateZ(" + (7500 + enematrix.m43) + "px) translateX(" + (enematrix.m41) + "px)";
		if((targetmatrix.m43 - matrix4.m43) <= 500 && (targetmatrix.m43 - matrix4.m43) >= 0 && targetmatrix.m41 === matrix4.m41){
			otherplayer.style.zIndex = "9";
		}
	}
});
socket.on("damage", () => {
	health.value--;
	if (health.value === 0) {
		alert("Nice try. However, you did not win. Better luck next time!");
		socket.emit("loser", person);
		location.reload();
	}
});
socket.on("winnerchosen", () => {
	alert("You Won!");
	location.reload();
});