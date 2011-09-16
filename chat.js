(function() {
  var fs, http, io, rc, redis, server, socketio;
  http = require('http');
  io = require('socket.io');
  redis = require('redis');
  rc = redis.createClient();
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
  server.listen(3000);
  socketio = io.listen(server);
  socketio.sockets.on('connection', function() {
    return console.log('tits');
  });
  rc.on('connect', function() {
    console.log('tits');
    return rc.subscribe('chat');
  });
  rc.on('message', function(channel, message) {
    console.log('sending:' + message);
    return socketio.sockets.emit('message', message);
  });
}).call(this);
