##requirements
http = require 'http'
io = require 'socket.io'
redis = require 'redis'
rc = redis.createClient()
fs = require 'fs'

##create a server
server = http.createServer (req, res) ->
  fs.readFile "#{__dirname}/index.html", (err, data) ->
    if err then send404(res)
    res.writeHead 200, 'Content-type':  'text/html'
    res.end data, 'utf8'

##listen up
server.listen 3000
socketio = io.listen server

##io stuff
socketio.sockets.on 'connection', ->
  console.log 'tits'
##redis time

##on connection subscribe to chat channel
rc.on 'connect', ->
  console.log 'tits'
  rc.subscribe 'chat'

##when a message is submitted, emit to everyone 
rc.on 'message', (channel, message) ->
  console.log 'sending:' + (message)
  socketio.sockets.emit 'message', (message)
