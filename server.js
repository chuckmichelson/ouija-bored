// ***** CHANGE THIS TO RUN ON HEROKU

//Load HTTP module
const http = require("http");
const hostname = '127.0.0.1';
const PORT = 3000;

// Create HTTP server and listen on port 3000 for requests
const server = http.createServer((req, res) => {

  //Set the response HTTP header with HTTP status and Content type
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});


// const express = require('express')
// const app = express()
// const server = require('https').Server(app)
// const io = require('socket.io')(server)
// const PORT = process.env.PORT || 3000;

console.log("Set up server")

const io = require('socket.io')();


// hostname = "https://ouija-bored.herokuapp.com"


listen for request on port 3000, and as a callback function have the port listened on logged
io.listen(process.env.PORT || 3000);
server.listen(PORT, hostname, () => {
  console.log(`Server running at http://${hostname}:${PORT}/`);
});

console.log("Hopefully listening by now")



console.log("in server")


// const PORT = process.env.PORT || 3000;
// var server = app.listen(PORT, function() {
//     var host = server.address().address;
//     var port = server.address().port;
//     console.log("server is listening at http://%s:%s", host, port);
// });



const { FRAME_RATE } = require('./constants');
const CANVAS_WIDTH = 838;
const CANVAS_HEIGHT = 554;
const PLANCHETTE_WIDTH = 120;
const PLANCHETTE_HEIGHT = 120;

console.log("declared constants")

// *****This is from multiplayer snake
const io = require('socket.io')();
const { initGame, addPlayer, gameLoop, getUpdatedVelocity } = require('./game');
const { FRAME_RATE } = require('./constants');
const { makeid } = require('./utils');
// *****

console.log("ran the multiplayer snake socket code")

// hostname = "https://ouija-bored.herokuapp.com"
// server.listen(process.env.PORT || 3000, hostname, () => {
//   console.log(`Server running at http://${hostname}:${PORT}/`);
// });


const state = {};
const clientRooms = {};

// app.use("/api", function(req, res, next){
//    console.log("request handler");
//     res.end("hello");
//     console.log(res);
//     next();
// });

io.on('connection', client => {

  console.log("inside connection code")

  client.on('keydown', handleKeydown);
  client.on('newGame', handleNewGame);
  client.on('joinGame', handleJoinGame);


  function handleJoinGame(roomName) {
    console.log("made it to handleJoinGame")
    const room = io.sockets.adapter.rooms[roomName];

    let allUsers;
    if (room) {
      allUsers = room.sockets;
    }

    let numClients = 0;
    if (allUsers) {
      numClients = Object.keys(allUsers).length;
      console.log("*****allUsers exists")
    }
    console.log("*****allUsers: numClients: " + numClients)
    // state[roomName].numSpirits = []
    // state[roomName].numSpirits = numClients;
    // console.log("*****allUsers: numClients: " + state.numSpirits)
    // score =
    emitScore(room, numClients);

    if (numClients === 0) {
      //client.emit('unknownCode');
      handleNewGame()
      return;
    }

    clientRooms[client.id] = roomName;

    console.log("roomName: " + roomName)

    client.join(roomName);
    addPlayer(state);
    client.number = numClients + 1;
    client.emit('init', client.number);

    startGameInterval(roomName);
  }

  function handleNewGame() {
    // console.log("made it to handleNewGame")
    let roomName = makeid(5);
    clientRooms[client.id] = roomName;
    client.emit('gameCode', roomName);

    state[roomName] = initGame();
    // console.log('*****')
    // console.log(state.players === undefined)
    // console.log('*****')

    client.join(roomName);
    client.number = 1;
    client.emit('init', 1);

    startGameInterval(roomName);
  }

  function handleKeydown(keyCode) {
    // console.log("made it to handleKeydown")
    const roomName = clientRooms[client.id];
    if (!roomName) {
      console.log("No room name")
      return;
    }
    try {
      keyCode = parseInt(keyCode);
    } catch(e) {
      console.error(e);
      return;
    }

    const vel = getUpdatedVelocity(keyCode);

    if (vel) {
      // console.log("client.number: " + client.number)
      // console.log(typeof(state) == 'undefined')
      state[roomName].x[client.number - 1] = vel.x;
      state[roomName].y[client.number - 1] = vel.y;
      // console.log("This Player Vel x: " + state[roomName].players.x[client.number - 1])
      // console.log("This Player Vel y: " + state[roomName].players.y[client.number - 1])
    }
  }
});

function startGameInterval(roomName) {
  // console.log("made it to startGameInterval")
  const intervalId = setInterval(() => {
    const winner = gameLoop(state[roomName]);

    if (!winner) {
      emitGameState(roomName, state[roomName])
    } else {
      emitGameOver(roomName, winner);
      state[roomName] = null;
      clearInterval(intervalId);
    }
  }, 1000 / FRAME_RATE);
}

function emitGameState(room, gameState) {
  // Send this event to everyone in the room.
  io.sockets.in(room)
    .emit('gameState', JSON.stringify(gameState));
}

function emitGameOver(room, winner) {
  // console.log("made it to emitGameOver()")
  io.sockets.in(room)
    .emit('gameOver', JSON.stringify({ winner }));
}

function emitScore(room, score) {
  console.log("emitScore(): Score: " + score)
  io.sockets.in(room)
    .emit('gameScore', JSON.stringify(score));
}



// ***** from multiplayer snake
io.listen(process.env.PORT || 3000);
// *****
