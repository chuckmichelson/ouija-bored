const { FRAME_RATE } = require('./constants');
const CANVAS_WIDTH = 838;
const CANVAS_HEIGHT = 554;
const PLANCHETTE_WIDTH = 120;
const PLANCHETTE_HEIGHT = 120;

// const io = require('socket.io')();
const { initGame, gameLoop, getUpdatedVelocity } = require('./game');
const { makeid } = require('./utils');


const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = module.exports.io = require('socket.io')(server)

var app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server);
var sockets = io;


const state = {};
const clientRooms = {};

io.on('connection', client => {gameLoop

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
    }
    console.log("counted numClients")

    if (numClients === 0) {
      console.log("numClients = 0")
      //client.emit('unknownCode');
      handleNewGame()
      return;
    }

    if (numClients === 1) {
      console.log("numClients = 1")
      //client.emit('unknownCode');
      //handleNewGame()
      return;
    }

    clientRooms[client.id] = roomName;

    client.join(roomName);
    // client.number = 2;
    client.number = 2;
    client.emit('init', 2);

    startGameInterval(roomName);
  }

  function handleNewGame() {
    console.log("made it to handleNewGame")
    // let roomName = makeid(5);
    let roomName = 'AAAAA';
    clientRooms[client.id] = roomName;
    client.emit('gameCode', roomName);

    state[roomName] = initGame();

    client.join(roomName);
    client.number = 1;
    client.emit('init', 1);
  }

  function handleKeydown(keyCode) {
    console.log("made it to handleKeydown")
    const roomName = clientRooms[client.id];
    if (!roomName) {
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
      state[roomName].players[client.number - 1].vel = vel;
    }
  }
});

function startGameInterval(roomName) {
  console.log("made it to startGameInterval")
  const intervalId = setInterval(() => {
    const winner = gameLoop(state[roomName]);

    if (!winner) {
      emitGameState(roomName, state[roomName])
      // emitScore(roomName, gameScore)
    } else {
      emitGameOver(roomName, winner);
      state[roomName] = null;
      clearInterval(intervalId);
    }
  }, 1000 / FRAME_RATE);
}

function emitGameState(room, gameState) {
  // Send this event to everyone in the room.
  console.log("made it to emitGameState")
  io.sockets.in(room)
    .emit('gameState', JSON.stringify(gameState));
}

function emitGameOver(room, winner) {
  console.log("made it to emitGameOver()")
  io.sockets.in(room)
    .emit('gameOver', JSON.stringify({ winner }));
}

function emitScore(room, score) {
  console.log("made it to emitScore()")
  io.sockets.in(room)
    .emit('gameScore', JSON.stringify(gameScore));
}

io.listen(process.env.PORT || 3000);
