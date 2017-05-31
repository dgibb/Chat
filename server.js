const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

var rooms =[];
var privateRooms=[];
var users = [];
var connections = [];

server.listen(process.env.PORT || 8080);

console.log('server running...');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/Client/index.html');
});

io.sockets.on('connection', function(socket){
  connections.push(socket);
  console.log('connected: %s sockets connected', connections.length);

  socket.emit('sendRooms'{
    msg:'generic connection mesage'
  })

  socket.on('adduser', function(username){
		// store the username in the socket session for this client
		socket.username = username;
		// store the room name in the socket session for this client
		socket.room = 'room1';
		// add the client's username to the global list
		usernames[username] = username;
		// send client to room 1
		socket.join('room1');
		// echo to client they've connected
		socket.emit('updatechat', 'SERVER', 'you have connected to room1');
		// echo to room 1 that a person has connected to their room
		socket.broadcast.to('room1').emit('updatechat', 'SERVER', username + ' has connected to this room');
		socket.emit('updaterooms', rooms, 'room1');
	});

  socket.on('sendchat', function (data) {
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.in(socket.room).emit('updatechat', socket.username, data);
	});

  socket.on('disconnect', function(data){
    connections.splice(connections.indexOf(socket), 1);
    console.log('disconnected: %s sockets connected', connections.length)
  });


});
