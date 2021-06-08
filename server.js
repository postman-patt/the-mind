const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const { userJoin, getRoomUsers } = require("./utils/users.js");

//Setting CORS access list
const socketio = require("socket.io");
const io = socketio(server, {
	cors: {
		origin: "http://localhost:3000",
	},
});

const PORT = 5000 || process.env.PORT;

//Socket
io.on("connection", (socket) => {
	//Join room
	socket.on("joinRoom", ({ username, room }) => {
		const user = userJoin(socket.id, username, room);

		//Show user in console
		console.log(
			`${username} with id of ${socket.id} has joined the room ${room}`
		);

		//Join the room
		socket.join(room);

		//Sent the current game state to the user
		io.to(user.room).emit("initGameState", {
			room: user.room,
			players: getRoomUsers(user.room),
			player: socket.id,
		});
	});
});

server.listen(PORT, () => {
	console.log(`Sever is running on port: ${PORT}`);
});
