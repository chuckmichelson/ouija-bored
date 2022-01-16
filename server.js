
// ***** CODE THAT WORKS FOR LOCALHOST *********************
// // Load HTTP module
// const http = require("http");
// const hostname = '127.0.0.1';
// const PORT = 3000;

// //Create HTTP server and listen on port 3000 for requests
// const server = http.createServer((req, res) => {

//   //Set the response HTTP header with HTTP status and Content type
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World\n');
// });

// const io = require('socket.io')();

// //listen for request on port 3000, and as a callback function have the port listened on logged
// io.listen(process.env.PORT || 3000);
// server.listen(PORT, hostname, () => {
//   console.log(`Server running at http://${hostname}:${PORT}/`);
// });
// *********************************************************


// ***** LITERALLY THE ONLY CODE IN THE SNAKES EXAMPLE *****
const io = require('socket.io')();
io.listen(process.env.PORT || 3000);
// *********************************************************


const { FRAME_RATE } = require('./constants');
const { CANVAS_WIDTH } = require('./constants');
const { CANVAS_HEIGHT } = require('./constants');
const { PLANCHETTE_WIDTH } = require('./constants');
const { PLANCHETTE_HEIGHT } = require('./constants');
const { initGame, addPlayer, gameLoop, getUpdatedVelocity } = require('./game');
const { makeid } = require('./utils');


const state = {};
const clientRooms = {};


io.on('connection', client => {

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
    // emitScore(room, numClients);

    if (numClients === 0 || state[roomName].current_game_active === false) {
      handleNewGame()
      return;
    }

    clientRooms[client.id] = roomName;

    console.log("roomName: " + roomName)

    client.join(roomName);
    addPlayer(state);
    state[roomName].numSpirits = numClients + 1;
    // console.log("numClients: " + numClients)
    client.number = numClients + 1;
    client.emit('init', numClients + 1);

    startGameInterval(roomName);
  }

  function handleNewGame() {
    let roomName = makeid(5);
    clientRooms[client.id] = roomName;
    client.emit('gameCode', roomName);

    state[roomName] = initGame();
    client.join(roomName);
    client.number = 1;
    client.emit('init', 1);
    state[roomName].numSpirits = 1;


    startGameInterval(roomName);
  }

  function handleKeydown(keyCode) {
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
      state[roomName].x[client.number - 1] = vel.x;
      state[roomName].y[client.number - 1] = vel.y;
    }
  }
});

function startGameInterval(roomName) {
  const intervalId = setInterval(() => {
    const winner = gameLoop(state[roomName]);

    if (!winner) {
      emitGameState(roomName, state[roomName])
    } else {
      emitGameOver(roomName, state[roomName]);
      // state[roomName] = null;
      state[roomName].current_game_active = false;
      clearInterval(intervalId);
    }
  }, 1000 / FRAME_RATE);
}

function emitGameState(room, gameState) {
  // Send this event to everyone in the room.
  io.sockets.in(room)
    .emit('gameState', JSON.stringify(gameState));
}

function emitGameOver(room, gameState) {
  // Send this event to everyone in the room.
  io.sockets.in(room)
    .emit('gameOver', JSON.stringify(gameState));
}

function emitScore(room, score) {
  // Send this event to everyone in the room.
  io.sockets.in(room)
    .emit('gameScore', JSON.stringify(score));
}


