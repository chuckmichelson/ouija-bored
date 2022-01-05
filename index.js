const socket = io('http://localhost:3000');

// socket.on('init_test', handleInit_test);


// function handleInit_test(msg) {
//   console.log(msg);
// }


// const { GRID_SIZE } = require('./constants');
const FRAME_RATE = 10;
const CANVAS_WIDTH = 838;
const CANVAS_HEIGHT = 554;
const PLANCHETTE_WIDTH = 120;
const PLANCHETTE_HEIGHT = 120;

console.log("Entering index.js")

// const socket = io.connect('https://ouija-bored.herokuapp.com:12345/socket.io/socket.io.js');
// const socket = io.connect('https://ouija-bored.herokuapp.com/');

socket.on('init', handleInit);
socket.on('gameState', handleGameState);
socket.on('gameOver', handleGameOver);
socket.on('gameCode', handleGameCode);
socket.on('gameScore', handleScore);
socket.on('unknownCode', handleUnknownCode);

console.log("sockets on")

// const gameScreen = document.getElementById('gameScreen');
// const initialScreen = document.getElementById('initialScreen');
// const newGameBtn = document.getElementById('newGameButton');
const joinGameBtn = document.getElementById('joinGameButton');
// const gameCodeInput = document.getElementById('gameCodeInput');
// const gameCodeDisplay = document.getElementById('gameCodeDisplay');
const numPlayersDisplay = document.getElementById('numPlayersDisplay');
const scoreDisplay = document.getElementById('scoreDisplay');


// joinGame()
document.getElementById("numPlayersDisplay").innerHTML = 5 + 6;
joinGameBtn.addEventListener('click', newGame);

function newGame() {
  console.log("made it to NewGame")
  socket.emit('newGame');
  init();
}

function joinGame() {
  console.log("made it to joinGame")
  socket.emit('joinGame', 'AAAAA');
}

let playerNumber = 1;
let gameActive = false;

function init() {
  console.log("made it to init")

  const layer1 = document.getElementById('layer1');
  const ctx1 = layer1.getContext('2d');
  layer1.height = 554;
  layer1.width = 838;

  const layer2 = document.getElementById('layer2');
  const ctx2 = layer2.getContext('2d');
  layer2.height = 554;
  layer2.width = 838;

  // background image
  var background = new Image();
  background.src = "images/ouija_board.png";
  background.onload = function(){
      ctx1.drawImage(background,0,0);
  }

  // planchette
  var planchette = new Image();
  planchette.src = "images/planchette.png";
  planchette.onload = function(){
      ctx2.drawImage(planchette,CANVAS_WIDTH/2 - PLANCHETTE_WIDTH/2, CANVAS_HEIGHT/2 - PLANCHETTE_HEIGHT/2);
  }

  document.addEventListener('keydown', keyDown);
  console.log("added keydown event listener")
  gameActive = true;

}

function keyDown(e) {
  console.log("made it to keyDown()")
  socket.emit('keydown', e.keyCode);
  // document.getElementById("scoreDisplay").innerHTML = e.keyCode;
  console.log("emitted keydown code")
}

function paintGame(state) {
  console.log("made it to paintGame")
  const layer2 = document.getElementById('layer2');
  const ctx2 = layer2.getContext('2d');
  document.getElementById("scoreDisplay").innerHTML = state.planchette.pos.x;
  planchette.src = "images/planchette.png";
  ctx2.drawImage(planchette,state.planchette.pos.x - PLANCHETTE_WIDTH/2, state.planchette.pos.y - PLANCHETTE_HEIGHT/2);
}

function handleInit(number) {
  console.log("made it to handleInit()")
  playerNumber = number;
  console.log(playerNumber)
}

function handleGameState(gameState) {
  console.log("made it to handleGameState")

  if (!gameActive) {
    return;
  }
  gameState = JSON.parse(gameState);
  console.log('JSON parsed')
  handleNumPlayers(gameState.players.length)
  console.log('num players handled')
  requestAnimationFrame(() => paintGame(gameState));
  console.log('animation frame requested')

}

function handleGameOver(data) {
  console.log("made it to handleGameOver()")
  if (!gameActive) {
    console.log("game not active")
    return;
  }
  data = JSON.parse(data);

  gameActive = false;

  alert('Game Over');

}

function handleGameCode(gameCode) {
  console.log("made it to handleGameCode()")
  //gameCodeDisplay.innerText = gameCode;
}

function handleScore(gameScore) {
  console.log("made it to handleScore()")
  scoreDisplay.innerText = gameScore;
}

function handleNumPlayers(numPlayers) {
  console.log("made it to handleNumPlayers()")
  numPlayersDisplay.innerText = numPlayers;
}

function handleUnknownCode() {
  console.log("made it to handleUnknownCode()")
  reset();
  alert('Unknown Game Code')
}

function reset() {
  console.log("made it to reset()")
  playerNumber = null;
  gameCodeInput.value = 'AAAAA';
  initialScreen.style.display = "block";
  gameScreen.style.display = "none";
}
