const express = require("express");
const socketio = require("socket.io");
const http = require("http");



var users = [];
var rooms;
var winners = [];
const app = express();
const PORT = 3000 || process.env.PORT;
const server = http.createServer(app);
// Set static folder
app.use(express.static(__dirname));

// Socket setup
const io = socketio(server);
var i = 0;
var roomnumber;
var people = 0;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
io.on("connection", (socket) => {

	people++;
	socket.emit("userjoined")

	socket.join("game" + i);
		rooms = io.sockets.adapter.rooms;
	console.log(rooms);
	socket.on("username", user => {
		if (users.includes(user) || user === null || user === "") {
			socket.emit("usernotadded");
		}
		else {
			socket.nickname = user;
			users.push(user);
			socket.to("game" + i).emit("useradded", users);
			console.log(users);
			if (people % 3 == 0) {
				io.to("game" + i).emit("roomclosed", {room: (("game" + i).toString()), number: (i * 3)});
				i++;
			}
			socket.to("game" + i).emit("joined", user);
		}
	});
	socket.on("disconnecting", () => {
		people--;
		console.log(Array.from(socket.rooms));
		for(var a = 0; a < (i + 1); a++){
			roomnumber = ("game" + a).toString();
			if(Array.from(socket.rooms).includes(roomnumber)){
				socket.leave(roomnumber);
				users = users.filter(use => use != socket.nickname);
				console.log(users);
				socket.to(roomnumber).emit("leave", users);
				socket.to(roomnumber).emit("left", socket.nickname);
			}
		}
	});
	socket.on("userwon", () => {
		for(var a = 0; a < (i + 1); a++){
			roomnumber = ("game" + a).toString();
			if(Array.from(socket.rooms).includes(roomnumber)){
				io.to(roomnumber).emit("winnerchosen");
				io.to(roomnumber).emit("gg");
			}
		}
	})
socket.on("playerhit", () => {
	for(var a = 0; a < (i + 1); a++){
			roomnumber = ("game" + a).toString();
			if(Array.from(socket.rooms).includes(roomnumber)){
				socket.to(roomnumber).emit("damage");
			}
		}
});
	socket.on("died", (user) => {
		users.filter(use => use != user);
		for(var a = 0; a < (i + 1); a++){
			roomnumber = ("game" + a).toString();
			if(Array.from(socket.rooms).includes(roomnumber)){
				socket.to(roomnumber).emit("leave", users)
		socket.to(roomnumber).emit("gameover", user);
			}
		}
		
	});
	socket.on("hit", (person) => {
		for(var a = 0; a < (i + 1); a++){
			roomnumber = ("game" + a).toString();
			if(Array.from(socket.rooms).includes(roomnumber)){
				socket.to(roomnumber).emit("point", person);
			}
		}
	});
	socket.on("won", user => {
		for(var a = 0; a < (i + 1); a++){
			roomnumber = ("game" + a).toString();
			if(Array.from(socket.rooms).includes(roomnumber)){
				socket.to(roomnumber).emit("winner", user);
				winners.push(user);
				console.log(winners);
				if(winners.length === 2){
				io.to(roomnumber).emit("winners", winners);
				}
			}
		}
	});
	socket.on("move", (matrix)=> {
		for(var a = 0; a < (i + 1); a++){
			roomnumber = ("game" + a).toString();
			if(Array.from(socket.rooms).includes(roomnumber)){
				socket.to(roomnumber).emit("enemymoved", matrix);
			}
		}
	});

});
