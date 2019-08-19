const server = require('http').createServer();
const io = require('socket.io')(server, { perMessageDeflate :false });

let clients = [];

let emitClients = () => {
  io.emit('clients', clients);
}

io.serveClient('origins', 'http://www.pivotally.com:80 https://www.pivotally.com:443 http://pivotally.com:80 https://pivotally.com:443')

io.on('connection', socket => {
  emitClients();
  socket.on('register', client => {
      let pos = clients.length;
      let notFound = true;
      while(pos--) {
        if (clients[pos].id === client.id) {
          notFound = false;
        }
      }
      if (notFound) {
        clients.push(client);
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

server.listen(3001);