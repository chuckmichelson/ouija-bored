console.log("********************** Inside index.js")



// const { GRID_SIZE } = require('./constants');
const FRAME_RATE = 10;
const CANVAS_WIDTH = 838;
const CANVAS_HEIGHT = 554;
const PLANCHETTE_WIDTH = 120;
const PLANCHETTE_HEIGHT = 120;

// console.log("Entering index.js")


// ***** CHANGE THIS TO RUN ON HEROKU
const socket = io('http://localhost:3000');
// const socket = io('https://ouija-bored.herokuapp.com/');

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
// const scoreDisplay = document.getElementById('scoreDisplay');

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
  console.log("made it to NewGame")
  socket.emit('newGame');
}

function joinGame() {
  console.log("made it to joinGame")
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

  // display planchette
  const layer2 = document.getElementById('layer2');
  const context = layer2.getContext('2d');
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  const ctx2 = layer2.getContext('2d');
  var planchette = new Image();
  planchette.src = "images/planchette.png";
  ctx2.drawImage(planchette, state.planchette.pos.x - PLANCHETTE_WIDTH/2, state.planchette.pos.y - PLANCHETTE_HEIGHT/2);

  // display score (spirits present)
  const left_layer2 = document.getElementById("left_layer2");
  const left_ctx = left_layer2.getContext("2d");
  left_ctx.font = "60px Copperplate, Papyrus, fantasy";
  left_ctx.textAlign = "center";
  numSpirits = state.numSpirits[state.numSpirits.length - 1];
  left_ctx.fillText(numSpirits, 50, 80);
  left_ctx.fillStyle = 'rgba(255, 255, 255, .3)';
  left_ctx.font = "18px Copperplate, Papyrus, fantasy";
  left_ctx.fillText("Spirits", 50, 110);
  left_ctx.fillText("Present", 50, 130);

  // display current letter
  const right_layer2 = document.getElementById("right_layer2");
  const right_ctx = right_layer2.getContext("2d");
  right_ctx.clearRect(0, 0, 100, 554);
  right_ctx.font = "120px Copperplate, Papyrus, fantasy";
  streak = calculateLetterStreak(state);
  alpha = streak / state.letter_buffer.length;
  right_ctx.fillStyle = 'rgba(255, 255, 255, .3)';
  right_ctx.textAlign = "center";
  // current_letter = state.letter_buffer.substr(state.letter_buffer.length - 1);
  current_letter = state.letter_buffer[state.letter_buffer.length - 1]
  if (current_letter == '_' || current_letter == undefined) {
    current_letter = ' ';
  }
  display_string = current_letter;
  if (current_letter == '+') {
    display_string = '+'
    // right_ctx.font = "48px Copperplate, Papyrus, fantasy";
  }
  if (current_letter == '-') {
    display_string = '-'
    // right_ctx.font = "48px Copperplate, Papyrus, fantasy";
  }
  right_ctx.font = "120px Copperplate, Papyrus, fantasy";
  right_ctx.fillText(display_string, 60, 80);


  // display agreed letters
  // const layer_agreed = document.getElementById("layer_agreed");
  // const agreed_ctx = layer_agreed.getContext("2d");
  // agreed_ctx.fillStyle = 'black';
  // agreed_ctx.clearRect(0, 0, 838, 48);
  // agreed_ctx.font = "48px Copperplate, Papyrus, fantasy";
  // // right_ctx.fillStyle = '#8A2F70';
  // agreed_ctx.fillStyle = 'whitesmoke';
  // agreed_ctx.textAlign = "center";
  // agreed_ctx.fillText(state.agreed_letters, 419, 40);

}

function handleInit(number) {
  playerNumber = number;
  console.log("*****playerNumber: " + playerNumber)
  init(playerNumber)
}

function handleGameState(gameState) {
  if (!gameActive) {
    return;
  }
  gameState = JSON.parse(gameState);
  requestAnimationFrame(() => paintGame(gameState));
}

function handleGameOver(data) {
  if (!gameActive) {
    console.log("game not active")
    return;
  }
  data = JSON.parse(data);
  gameActive = false;

  // dim the ouija board
  const layer2 = document.getElementById('layer2');
  const ctx2 = layer2.getContext('2d');
  ctx2.fillStyle = "black";
  // ctx2.globalAlpha = 0.8;
  ctx2.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // game over messages
  const layer4 = document.getElementById('layer4');
  const ctx4 = layer4.getContext('2d');
  ctx4.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx4.fillStyle = "white";
  ctx4.textAlign = "center";
  ctx4.font = "120px Copperplate, Papyrus, fantasy";
  ctx4.fillText("Good Bye", CANVAS_WIDTH/2, CANVAS_HEIGHT/2);

}

function handleGameCode(gameCode) {
  // console.log("made it to handleGameCode()")
  //gameCodeDisplay.innerText = gameCode;
}

function handleScore(gameScore) {
  // console.log("made it to handleScore()")
  // const left_layer2 = document.getElementById("left_layer2");
  // const left_ctx = left_layer2.getContext("2d");
  // left_ctx.clearRect(0, 0, 100, 554);
  // left_ctx.font = "60px Copperplate, Papyrus, fantasy";
  // left_ctx.fillStyle = "white";
  // left_ctx.textAlign = "center";
  // left_ctx.fillText(gameScore, 50, 80);
  // left_ctx.fillStyle = 'rgba(255, 255, 255, .3)';
  // left_ctx.font = "18px Copperplate, Papyrus, fantasy";
  // left_ctx.fillText("Spirits", 50, 110);
  // left_ctx.fillText("Present", 50, 130);

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

function calculateLetterStreak(state) {
  current_letter = state.current_letter;
  buffer = state.letter_buffer;
  var streak = 0;
  for (i = 0; i < buffer.length; i++) {
    streak += 1;
    if (current_letter != buffer[buffer.length - i - 1]) {
      break;
    }
  }
  console.log("streak: " + streak)
  return streak;
}
