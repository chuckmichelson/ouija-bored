const CANVAS_WIDTH = 838;
const CANVAS_HEIGHT = 554;
const PLANCHETTE_WIDTH = 120;
const PLANCHETTE_HEIGHT = 120;

// ***** CHANGE THIS TO RUN ON HEROKU
// const socket = io('http://localhost:3000');
const socket = io('https://ouija-bored.herokuapp.com/');

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

document.body.style.backgroundColor = "black";
setTimeout(() => { collapseSmoke(); joinGame();}, 2000);


function collapseSmoke() {
  var x = document.getElementById("myDIV");
  x.style.display = "none";
}


function setImageVisible(id, visible) {
    var img = document.getElementById(id);
    img.style.visibility = (visible ? 'visible' : 'hidden');
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

  document.addEventListener('keydown', keyDown);
  // console.log("added keydown event listener")
  gameActive = true;

}

function keyDown(e) {
  if (gameActive == true) {
    socket.emit('keydown', e.keyCode);
  }
}

function paintGame(state) {

  // display planchette
  const layer2 = document.getElementById('layer2');
  const ctx2 = layer2.getContext('2d');
  ctx2.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  var planchette = new Image();
  planchette.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAABkWlDQ1BJQ0MgUHJvZmlsZQAAKJF9kLtLw1AUxr+miiIVBwUdFAJWXVopcXG0rVAKFUqtYNXBJH2k0KQhTVHBUXBxKDj4WHwNLs66dnAVBEURxNE/wNciJZ7bRFoVe+Byf3znce/5AG5L1PVCWwBQNdNIREL8fGqB73iGCxz6MYQxUS7pwXg8Borv+2d83FE1xY2fzfqbbxnd6UxJBlw88ZSsGybxMvHwiqkz3iDuM+hTxLuMczafMZZsrtZrkokw8S0xLytimviN2CcrhgpwbL43raZJ56Zt1hgrjKWm3lwTq4Wy7PyTbejJaHOzrJ7OICKIYgZx8JBQRh4FmPDTrZFSQoLyITOzarLmcFFfM/I5xeSD5FCGj2ryuI8XAoIAML9/+9jQiofA5DvgrjQ0aQe42AQGHhqa9wDoIa/OL3XREOuSmw6XzQIvp2RzCui9BroWS9kJwd7IEwLanyzrdQTo2AZqFcv6PLKs2jE1PwJVzfbOmYWTeyC5DsSugL19YDRHby7941Fn3SPHh5Y1jo9fcS931z3BV3IAAADQZVhJZk1NACoAAAAIAAcBEgADAAAAAQABAAABGgAFAAAAAQAAAGIBGwAFAAAAAQAAAGoBKAADAAAAAQADAAABMQACAAAADQAAAHIBMgACAAAAFAAAAICHaQAEAAAAAQAAAJQAAAAAAAAAkAAAAAEAAACQAAAAAUdJTVAgMi4xMC4zMAAAMjAyMjowMTowMiAxOTozNzo0MgAAA5KGAAcAAAASAAAAvqACAAQAAAABAAAAeKADAAQAAAABAAAAeAAAAABBU0NJSQAAAFNjcmVlbnNob3RneZ7qAAAACXBIWXMAABYlAAAWJQFJUiTwAAAIwWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOkdJTVA9Imh0dHA6Ly93d3cuZ2ltcC5vcmcveG1wLyIKICAgICAgICAgICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICAgICAgICAgIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIj4KICAgICAgICAgPGRjOkZvcm1hdD5pbWFnZS9wbmc8L2RjOkZvcm1hdD4KICAgICAgICAgPEdJTVA6QVBJPjIuMDwvR0lNUDpBUEk+CiAgICAgICAgIDxHSU1QOlRpbWVTdGFtcD4xNjQxMTczODY3OTI4MDY5PC9HSU1QOlRpbWVTdGFtcD4KICAgICAgICAgPEdJTVA6UGxhdGZvcm0+TWFjIE9TPC9HSU1QOlBsYXRmb3JtPgogICAgICAgICA8R0lNUDpWZXJzaW9uPjIuMTAuMzA8L0dJTVA6VmVyc2lvbj4KICAgICAgICAgPHhtcE1NOkluc3RhbmNlSUQ+eG1wLmlpZDplYmRkMTIwMy0yMGU4LTQzZmYtYjNkOC1kZDc5Nzc4MzFmZTU8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPmdpbXA6ZG9jaWQ6Z2ltcDo3MzUzMjgyNy05ZDQ3LTRmZTItODQ5MC04NWJlMjE0NDJiNTI8L3htcE1NOkRvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+eG1wLmRpZDplNDQ4Zjk3MS0zMTg4LTQ4ZGEtOWU2Ny1hYTNmOTIxODQ1YmE8L3htcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOkhpc3Rvcnk+CiAgICAgICAgICAgIDxyZGY6U2VxPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+R2ltcCAyLjEwIChNYWMgT1MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDIyLTAxLTAyVDE5OjM3OjQ3LTA2OjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOmI1YTdhZWVmLTg1MzktNDM1Yy1iNzVkLTAyZWE2YzU3NTBkMjwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgPC9yZGY6U2VxPgogICAgICAgICA8L3htcE1NOkhpc3Rvcnk+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDIyLTAxLTAyVDE5OjM3OjQyPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5HSU1QIDIuMTAuMzA8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjE2ODwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlVzZXJDb21tZW50PgogICAgICAgICAgICA8cmRmOkFsdD4KICAgICAgICAgICAgICAgPHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5TY3JlZW5zaG90PC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOkFsdD4KICAgICAgICAgPC9leGlmOlVzZXJDb21tZW50PgogICAgICAgICA8ZXhpZjpQaXhlbFlE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";
  ctx2.drawImage(planchette, state.planchette.pos.x - PLANCHETTE_WIDTH/2, state.planchette.pos.y - PLANCHETTE_HEIGHT/2);

  // display score (spirits present)
  const left_layer2 = document.getElementById("left_layer2");
  const left_ctx2 = left_layer2.getContext("2d");
  left_ctx2.clearRect(0, 0, 100, 554);
  left_ctx2.font = "120px Copperplate, Papyrus, fantasy";
  left_ctx2.fillStyle = 'rgba(255, 255, 255, .3)';
  left_ctx2.textAlign = "center";
  numSpirits = state.numSpirits;
  if (numSpirits == undefined) {
    numSpirits = '1';
  }
  left_ctx2.fillText(numSpirits, 50, 80);
  left_ctx2.fillStyle = 'rgba(255, 255, 255, .3)';
  left_ctx2.font = "24px Copperplate, Papyrus, fantasy";
  display_text = "Spirits"
  if (numSpirits == 1) {
    display_text = "Spirit"
  }
  left_ctx2.fillText(display_text, 50, 110);
  left_ctx2.fillText("Present", 50, 135);

  // display current letter
  const right_layer2 = document.getElementById("right_layer2");
  const right_ctx2 = right_layer2.getContext("2d");
  right_ctx2.clearRect(0, 0, 100, 554);
  right_ctx2.font = "120px Copperplate, Papyrus, fantasy";
  // streak = calculateLetterStreak(state);
  // alpha = streak / state.letter_buffer.length;
  right_ctx2.fillStyle = 'rgba(255, 255, 255, .3)';
  right_ctx2.textAlign = "center";

  current_letter = state.current_letter;
  if (current_letter == '_' || current_letter == undefined) {
    current_letter = ' ';
  }
  display_string = current_letter;
  if (current_letter == '+') {
    right_ctx2.font = "48px Copperplate, Papyrus, fantasy";
    display_string = 'Yes'
  }
  if (current_letter == '-') {
    right_ctx2.font = "48px Copperplate, Papyrus, fantasy";
    display_string = 'No'
  }
  if (current_letter == '.') {
    right_ctx2.font = "48px Copperplate, Papyrus, fantasy";
    display_string = 'Bye'
  }
  right_ctx2.fillText(display_string, 60, 80);


  // display agreed letters
  const layer_agreed = document.getElementById("layer_agreed");
  const agreed_ctx = layer_agreed.getContext("2d");
  agreed_ctx.fillStyle = 'black';
  agreed_ctx.clearRect(0, 0, 838, 48);
  agreed_ctx.font = "48px Copperplate, Papyrus, fantasy";
  agreed_ctx.fillStyle = 'rgba(255, 255, 255, .5)';
  agreed_ctx.textAlign = "center";
  agreed_ctx.fillText(state.agreed_letters, 419, 40);
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

function handleGameOver(state) {
  // if (!gameActive) {
  //   console.log("game not active")
  //   return;
  // }

  state = JSON.parse(state);

  // clear the top of the screen
  const layer_agreed = document.getElementById("layer_agreed");
  const agreed_ctx = layer_agreed.getContext("2d");
  agreed_ctx.fillStyle = 'black';
  agreed_ctx.clearRect(0, 0, 838, 48);

  const right_layer2 = document.getElementById("right_layer2");
  const right_ctx2 = right_layer2.getContext("2d");
  right_ctx2.clearRect(0, 0, 100, 554);

  // remove the planchette
  const layer2 = document.getElementById('layer2');
  const ctx2 = layer2.getContext('2d');
  ctx2.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // remove the ouija board
  const layer1 = document.getElementById('layer1');
  const ctx1 = layer1.getContext('2d');
  ctx1.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // display a dimmed board
  const dim = new Image();
  dim.src = "images/ouija_board_dim.png";
  ctx1.drawImage(dim,0,0);

  // game over messages
  const layer4 = document.getElementById('layer4');
  const ctx4 = layer4.getContext('2d');
  ctx4.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx4.fillStyle = "white";
  ctx4.textAlign = "center";
  ctx4.font = "96px Copperplate, Papyrus, fantasy";
  var final_message = state.agreed_letters.substring(0, state.agreed_letters.length - 1);;
  ctx4.fillText(final_message, CANVAS_WIDTH/2, CANVAS_HEIGHT/2);

  // data = JSON.parse(data);
  gameActive = false;

}

function handleGameCode(gameCode) {
  // console.log("made it to handleGameCode()")
  //gameCodeDisplay.innerText = gameCode;
}

function handleScore(gameScore) {
  // gameScore = JSON.parse(gameScore);
  // console.log("*****handleScore(): gameScore: " + gameScore)
  // const left_layer2 = document.getElementById("left_layer2");
  // const left_ctx = left_layer2.getContext("2d");
  // left_ctx.clearRect(0, 0, 100, 554);
  // left_ctx.font = "60px Copperplate, Papyrus, fantasy";
  // left_ctx.textAlign = "center";
  // left_ctx.fillStyle = 'rgba(255, 255, 255, .3)';
  // left_ctx.fillText(gameScore, 50, 80);
  // left_ctx.font = "18px Copperplate, Papyrus, fantasy";
  // left_ctx.fillText("Spirits", 50, 110);
  // left_ctx.fillText("Present", 50, 130);

}

function handleUnknownCode() {
  reset();
  alert('Unknown Game Code')
}

function reset() {
  playerNumber = null;
  gameCodeInput.value = '';
  initialScreen.style.display = "block";
  gameScreen.style.display = "none";
}
