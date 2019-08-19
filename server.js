var express = require('express');
var app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { perMessageDeflate :false });

const PORT = process.env.PORT || 3001;

let rooms = [];

let emitClients = () => {
  io.emit('clients', rooms);
}

io.configure(function() {
  io.set('transports', ['websocket']);
});

io.on('connection', socket => {
  emitClients();
  socket.on('register', client => {
      let pos = rooms.length;
      let notFound = true;
      while(pos--) {
        if (rooms[pos].id === client.id) {
          notFound = false;
        }
      }
      if (notFound) {
        rooms.push(client);
      }
      socket.join(client.id);
      emitClients();
      
  });
  socket.on('signalling', data => {
    console.log(data);
    io.to(data.client.id).emit('signalling', data);
  });

  socket.on('clearRooms', () => {
    
    clients = [];
    emitClients();
  });

  socket.on('disconnect', (client) => { 
      //console.log('Disconnect', client);
  });
});

server.listen(PORT);
console.log('Server running at http://localhost:%d', PORT);