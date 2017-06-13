const express = require('express');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const path = require('path');

const rooms = [];
const privateRooms = [];
const connections = [];
const users = [];
let offset = Math.floor(Math.random() * 360);

server.listen(process.env.PORT || 5000);

console.log('server running...');

app.use(express.static(path.resolve(__dirname, '..', 'Client')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'Client', 'index.html'));
});

io.sockets.on('connection', (socket) => {
  connections.push({ socket: socket });
  socket.username = '';
  socket.inPrivateRoom = false;
  console.log('connected: %s sockets connected', connections.length);

  socket.on('submit-message', (data) => {
    if (socket.room === undefined) {
      console.log('undefined room');
      return;
    }
    const msg = { author: socket.username, color: socket.color, text: data };
    io.sockets.in(socket.room).emit('new-message', msg);
  });

  socket.on('login-check', () => {
    if (socket.username === '') {
      console.log('not logged in, redirecting')
      socket.emit('login-confirmation', true);
    } else {
      console.log('logged in as ', socket.username, ', redering page')
      socket.emit('login-confirmation', false);
    }
  });

  socket.on('room-check', () => {
    if (socket.username === '') {
      console.log('not logged in, redirecting')
      socket.emit('room-confirmation', 'Login');
    } else if (socket.room === undefined) {
      console.log('logged in as ', socket.username, ', redering page')
      socket.emit('room-confirmation', 'Lobby');
    } else {
      socket.emit('room-confirmation', false);
    }
  });

  socket.on('logout-if-not', () => {
    // on login did mount, sets server username to ''
    // must be empty string for redirection to login page when no username chosen yet

    if (socket.username !== '') {
      for (let i = 0; i < users.length; i += 1) {
        if (socket.username === users[i].username) {
          users.splice(i, 1);
          break;
        }
      }
    }
  });

  socket.on('lobby-request', () => {
    socket.emit('update-lobby', rooms, users);
  });

  socket.on('login-request', (username) => {
    console.log('server receved login-request: ', username, ' attempting login');

    switch (username) {

      case '':
      case 'server-broadcast':
        socket.emit('login-response', 'denied', 'username invalid or reserved, please try again');
        console.log('login-request: denied ', username, ' invalid or reserved');
        return;

      default:
        break;
    }

    for (let i = 0; i < users.length; i += 1) {
      if (users[i].username === username) {
        socket.emit('login-response', 'denied', 'username taken, please try again');
        console.log('login-request: denied', username, 'taken');
        return;
      }
    }

    console.log('login-request: approved for ', username);

    const hue = (Math.floor(Math.random() * 60) + offset) % 360;
    offset = (hue + 60) % 360;
    const color = 'hsl(' + hue + ', 42%, 42%)';
    socket.username = username;
    socket.color = color;
    socket.join('lobby');
    users.push({ username: username, color: color });
    socket.emit('login-response', 'approved', 'Login Approved');
    socket.emit('confirm-username', username);
  });

  socket.on('join-room', (roomname) => {
    let i = 0;
    while ((rooms[i].name !== roomname) && (i < rooms.length)) {
      i += 1;
    }
    const room = rooms[i];
    room.users.push({ username: socket.username, color: socket.color });
    socket.leave('lobby');
    socket.join(roomname);
    socket.room = room.name;
    socket.index = i;
    room.activeUsers += 1;
    io.sockets.in('lobby').emit('update-lobby', rooms, users); // update activeUser count for rooms
    io.sockets.in(roomname).emit('update-users', room.users);
    io.sockets.in(roomname).emit('user-joined-room', socket.username);
  });

  socket.on('join-private-room', (roomname) => {
    console.log('join-private-room recieved')
    let index = -1;
    for (let i = 0; i < privateRooms.length; i += 1) {
      console.log(i, roomname, privateRooms[i].name);
      if (roomname === privateRooms[i].name) {
        index = i;
        console.log('room', roomname, 'found at index', i, index);
        break;
      }
    }
    if (index === -1) {
      console.log('join-private-room failed')
      socket.emit('join-private-response', 'Room not found, please try again.', '');
      return;
    }
    console.log('join-private-room succeeded');
    socket.emit('join-private-response', 'accepted', roomname);
    const room = privateRooms[index];
    room.users.push({ username: socket.username, color: socket.color });
    socket.leave('lobby');
    socket.join(roomname);
    socket.room = room.name;
    socket.index = index;
    socket.inPrivateRoom = true;
    io.sockets.in(roomname).emit('update-users', room.users);
    io.sockets.in(roomname).emit('user-joined-room', socket.username);
  });

  socket.on('leave-room', () => {
    console.log(socket.username + ' is leaving', socket.room);

    const roomArray = (socket.inPrivateRoom) ? privateRooms : rooms;
    const userArray = roomArray[socket.index].users;
    for (let i = 0; i < userArray.length; i += 1) {
      if (socket.username === userArray[i].username) {
        userArray.splice(i, 1);
        break;
      }
    }
    socket.leave(socket.room);
    socket.join('lobby');
    roomArray[socket.index].activeUsers -= 1;
    io.sockets.in('lobby').emit('update-lobby', rooms, users)
    io.sockets.in(socket.room).emit('update-users', roomArray[socket.index].users);
    io.sockets.in(socket.room).emit('user-left-room', socket.username);
    socket.room = undefined;
    socket.index = undefined;
    socket.inPrivateRoom = false;
  });

  socket.on('create-room-request', (roomName, publicPrivate) => {
    console.log('create-room-request recieved', publicPrivate)

    const roomArray = (publicPrivate === 'public') ? rooms : privateRooms;

    switch (roomName) {

      case '':
        socket.emit('create-room-denied');
        console.log('login-request: denied, empty string');
        return;

      default:
        break;
    }

    for (let i = 0; i < rooms.length; i += 1) {
      if (rooms[i].name === roomName) {
        socket.emit('create-room-response', 'Name Taken, Please Try Again', '');
        console.log('login-request: denied, taken');
        return;
      }
    }

    for (let i = 0; i < privateRooms.length; i += 1) {
      if (privateRooms[i].name === roomName) {
        socket.emit('create-room-response', 'Name Taken, Please Try Again', '');
        console.log('login-request: denied, taken');
        return;
      }
    }
    roomArray.push({ name: roomName, users: [] });
    const redirect = '/Room/' + roomName;
    socket.emit('create-room-accept', redirect);
    io.sockets.emit('update-lobby', rooms, users);
    const newroom = roomArray[roomArray.length - 1];
    newroom.users.push({ username: socket.username, color: socket.color });
    socket.leave('lobby');
    socket.join(roomName);
    newroom.activeUsers = 1;
    socket.room = newroom.name;
    socket.index = roomArray.length - 1;
    socket.inPrivateRoom = (publicPrivate === 'private');
    io.sockets.in(roomName).emit('update-users', newroom.users);
    io.sockets.in(roomName).emit('user-joined-room', socket.username);
  });

  socket.on('disconnect', () => {
    // leave room if in one
    if (socket.room !== undefined) {
      const room = (socket.inPrivateRoom) ? privateRooms[socket.index] : rooms[socket.index];
      room.activeUsers -= 1;
      const userArray = room.users;
      for (let i = 0; i < userArray.length; i += 1) {
        if (socket.username === userArray[i].username) {
          userArray.splice(i, 1);
          break;
        }
      }
      io.sockets.in(socket.room).emit('update-users', room.users);
      io.sockets.in(socket.room).emit('user-left-room', socket.username);
    }

    // leave lobby if in lobby
    for (let i = 0; i < users.length; i += 1) {
      if (socket.username === users[i].username) {
        users.splice(i, 1);
        break;
      }
    }

    io.sockets.in('lobby').emit('update-lobby', rooms, users);
    connections.splice(connections.indexOf(socket), 1);
    console.log('disconnected: %s sockets connected', connections.length)
  });
});
