##requirements
http = require 'http'
io = require 'socket.io'
redis = require 'redis'
fs = require 'fs'

##create a server
server = http.createServer (req, res) ->
  fs.readFile "#{__dirname}/index.html", (err, data) ->
    if err then send404(res)
    res.writeHead 200, 'Content-type':  'text/html'
    res.end data, 'utf8'

##Create redis connections
pub = redis.createClient()
sub = redis.createClient()
store = redis.createClient()

##listen up
server.listen 3000
socketio = io.listen server

sub.subscribe 'chat'

socketio.sockets.on 'connection', (socket) ->
  socket.send 'welcome'

  socket.on 'clientmessage', (text) ->
    pub.publish 'chat', text

  sub.on 'message', (channel, text) ->
    socket.send text
