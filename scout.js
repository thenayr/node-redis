(function() {
  var fs, http, io, pub, redis, server, socketio, store, sub;
  http = require('http');
  io = require('socket.io');
  redis = require('redis');
  fs = require('fs');
  server = http.createServer(function(req, res) {
    return fs.readFile("" + __dirname + "/index.html", function(err, data) {
      if (err) {
        send404(res);
      }
      res.writeHead(200, {
        'Content-type': 'text/html'
      });
      return res.end(data, 'utf8');
    });
  });
  pub = redis.createClient();
  sub = redis.createClient();
  store = redis.createClient();
  server.listen(3000);
  socketio = io.listen(server);
  sub.subscribe('chat');
  socketio.sockets.on('connection', function(socket) {
    socket.send('welcome');
    socket.on('clientmessage', function(text) {
      return pub.publish('chat', text);
    });
    return sub.on('message', function(channel, text) {
      return socket.send(text);
    });
  });
}).call(this);
