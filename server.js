//Load HTTP module
const http = require("http");
const hostname = '127.0.0.1';
const PORT = 3000;

//Create HTTP server and listen on port 3000 for requests
const server = http.createServer((req, res) => {

  //Set the response HTTP header with HTTP status and Content type
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

const io = require('socket.io')();

//listen for request on port 3000, and as a callback function have the port listened on logged
io.listen(process.env.PORT || 3000);
server.listen(PORT, hostname, () => {
  console.log(`Server running at http://${hostname}:${PORT}/`);
});



const { FRAME_RATE } = require('./constants');
const CANVAS_WIDTH = 838;
const CANVAS_HEIGHT = 554;
const PLANCHETTE_WIDTH = 120;
const PLANCHETTE_HEIGHT = 120;

// // const io = require('socket.io')();
const { initGame, addPlayer, gameLoop, getUpdatedVelocity } = require('./game');
const { makeid } = require('./utils');



// const express = require('express')
// const app = express()
// const server = require('http').Server(app)
// const io = require('socket.io')(server)
// const PORT = process.env.PORT || 3000;

// // http.listen(PORT,function(){
// //     console.log("Listening to port " + PORT);
// // });


const state = {};
const clientRooms = {};

// app.use("/api", function(req, res, next){
//    console.log("request handler");
//     res.end("hello");
//     console.log(res);
//     next();
// });

io.on('connection', client => {

  // console.log(socket.connected); // prints "true"
  client.on('keydown', handleKeydown);
  client.on('newGame', handleNewGame);
  client.on('joinGame', handleJoinGame);

  function handleJoinGame(roomName) {
    // console.log("made it to handleJoinGame")
    const room = io.sockets.adapter.rooms[roomName];

    let allUsers;
    if (room) {
      allUsers = room.sockets;
    }

    let numClients = 0;
    if (allUsers) {
      numClients = Object.keys(allUsers).length;
      console.log("*****allUsers: numClients: " + numClients)
    }
    // console.log("*****allUsers: numClients: " + numClients)
    // state[roomName].numSpirits = numClients;
    // console.log("*****allUsers: numClients: " + state.numSpirits)
    emitScore(roomName);

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

function emitScore(room) {
  // console.log("made it to emitScore()")
  var numClients = (typeof clients !== 'undefined') ? Object.keys(clients).length : 0;
  io.sockets.in(room)
    .emit('gameScore', JSON.stringify(31));
}


