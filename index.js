
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

// console.log("Entering index.js")


// ***** CHANGE THIS TO RUN ON HEROKU
const socket = io('http://localhost:3000');
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
// const joinGameBtn = document.getElementById('joinGameButton');
// const gameCodeInput = document.getElementById('gameCodeInput');
// const gameCodeDisplay = document.getElementById('gameCodeDisplay');
// const smokeBtn = document.getElementById('smokeBtn');
const scoreDisplay = document.getElementById('scoreDisplay');

// makeSmoke()
document.body.style.backgroundColor = "black";
// playGif("images/smoke.gif")
// makeSmoke()
setTimeout(() => { collapseSmoke(); joinGame();}, 2000);
// setTimeout(() => { joinGame();}, 2000);

// var coll = document.getElementsByClassName("collapsible");
// var i;

// for (i = 0; i < coll.length; i++) {
//   coll[i].addEventListener("click", function() {
//     this.classList.toggle("active");
//     var content = this.nextElementSibling;
//     if (content.style.display === "block") {
//       content.style.display = "none";
//     } else {
//       content.style.display = "block";
//     }
//   });
// }

function collapseSmoke() {
  var x = document.getElementById("myDIV");
  x.style.display = "none";
}

// document.getElementById("numPlayersDisplay").innerHTML = 5 + 6;
// joinGameBtn.addEventListener('click', newGame);

// smokeBtn.addEventListener('click', makeSmoke);

const layer_letters = document.getElementById('layer_letters');
const context_letters = layer_letters.getContext('2d');
context_letters.fillStyle = 'black';
context_letters.fillRect(0, 0, 838, 48);


function setImageVisible(id, visible) {
    var img = document.getElementById(id);
    img.style.visibility = (visible ? 'visible' : 'hidden');
}



function makeSmoke() {
  const layer1 = document.getElementById('layer1');
  const ctx_smoke = layer1.getContext('2d');
  // ctx_smoke.clearRect(0, 0, 554, 554);
  var smoke = new Image();
  smoke.src = "images/smoke.gif";
  ctx_smoke.drawImage(smoke,0, 0);
}

function newGame() {
  // console.log("made it to NewGame")
  socket.emit('newGame');
}

function joinGame() {
  // console.log("made it to joinGame")
  socket.emit('joinGame', 'AAAAA');
}

let playerNumber = 1;
let gameActive = false;

function init() {
  // console.log("made it to init")

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
  // console.log("added keydown event listener")
  gameActive = true;

}

function keyDown(e) {
  // console.log("made it to keyDown()")
  socket.emit('keydown', e.keyCode);
  // console.log("emitted keydown code")
}

function paintGame(state) {
  // console.log("made it to paintGame")
  // document.getElementById("letterDisplay").innerHTML = state.letters[state.letters.length - 1];

  const layer2 = document.getElementById('layer2');
  const context = layer2.getContext('2d');
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  const ctx2 = layer2.getContext('2d');
  var planchette = new Image();
  planchette.src = "images/planchette.png";
  ctx2.drawImage(planchette, state.planchette.pos.x - PLANCHETTE_WIDTH/2, state.planchette.pos.y - PLANCHETTE_HEIGHT/2);

  const left_layer2 = document.getElementById("left_layer2");
  const left_ctx = left_layer2.getContext("2d");
  left_ctx.font = "60px Copperplate, Papyrus, fantasy";
  left_ctx.fillStyle = "whitesmoke";
  left_ctx.textAlign = "center";
  numSpirits = state.numSpirits;
  left_ctx.fillText(numSpirits, 50, 80);
  left_ctx.font = "18px Copperplate, Papyrus, fantasy";
  left_ctx.fillText("Spirits", 50, 110);
  left_ctx.fillText("Present", 50, 130);

  const right_layer2 = document.getElementById("right_layer2");
  const right_ctx = right_layer2.getContext("2d");
  right_ctx.clearRect(0, 0, 100, 554);
  right_ctx.font = "60px Copperplate, Papyrus, fantasy";
  // right_ctx.fillStyle = '#8A2F70';
  right_ctx.fillStyle = 'whitesmoke';
  right_ctx.textAlign = "center";
  // current_letter = state.letters[state.letters.length - 1];
  current_letter = state.letter_buffer.substr(state.letter_buffer.length - 1);
  if (current_letter == '_') {
    current_letter = ' ';
  }
  right_ctx.fillText(current_letter, 50, 80);
  right_ctx.font = "18px Copperplate, Papyrus, fantasy";
  // right_ctx.fillText("Souls", 50, 110);
  // right_ctx.fillText("Present", 50, 130);



  // const context_letters = document.getElementById('context_letters');
  // const context = context_letters.getContext('2d');
  // context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  // const ctx2 = context_letters.getContext('2d');
  // var planchette = new Image();
  // planchette.src = "images/smoke.png";
  // ctx2.drawImage(planchette,state.planchette.pos.x - PLANCHETTE_WIDTH/2, state.planchette.pos.y - PLANCHETTE_HEIGHT/2);

  // const letters_layer = document.getElementById('letters');
  // const letters_context = letters_layer.getContext('2d');
  // letters_context.clearRect(0, 0, 838, 48);
  // const smokey_layer = document.getElementById('smoke');
  // const smokey_context = smokey_layer.getContext('2d');
  // var smoke = new Image();
  // smoke.src = "images/smoke.gif";
  // ctx2.drawImage(smoke, 0, 100);

}

function handleInit(number) {
  console.log("made it to handleInit()")
  playerNumber = number;
  console.log("*****playerNumber: " + playerNumber)
  // document.getElementById("numPlayersDisplay").innerHTML = playerNumber;
  init()
}

function handleGameState(gameState) {
  // console.log("made it to handleGameState")

  if (!gameActive) {
    return;
  }
  gameState = JSON.parse(gameState);
  // console.log('JSON parsed')
  // handleNumPlayers(gameState.players.length)
  // console.log('num players handled')
  requestAnimationFrame(() => paintGame(gameState));
  // console.log('animation frame requested')

}

function handleGameOver(data) {
  // console.log("made it to handleGameOver()")
  if (!gameActive) {
    console.log("game not active")
    return;
  }
  data = JSON.parse(data);

  gameActive = false;

  alert('Game Over');

}

function handleGameCode(gameCode) {
  // console.log("made it to handleGameCode()")
  //gameCodeDisplay.innerText = gameCode;
}

function handleScore(gameScore) {
  console.log("made it to handleScore()")
  // scoreDisplay.innerText = gameScore;
  const left_layer2 = document.getElementById("left_layer2");
  const left_ctx = left_layer2.getContext("2d");
  left_ctx.clearRect(0, 0, 100, 554);
  left_ctx.font = "60px Copperplate, Papyrus, fantasy";
  left_ctx.fillStyle = "white";
  left_ctx.textAlign = "center";
  left_ctx.fillText(gameScore, 50, 80);
  left_ctx.font = "18px Copperplate, Papyrus, fantasy";
  left_ctx.fillText("Spirits", 50, 110);
  left_ctx.fillText("Present", 50, 130);

}

function handleUnknownCode() {
  // console.log("made it to handleUnknownCode()")
  reset();
  alert('Unknown Game Code')
}

function reset() {
  // console.log("made it to reset()")
  playerNumber = null;
  gameCodeInput.value = '';
  initialScreen.style.display = "block";
  gameScreen.style.display = "none";
}
