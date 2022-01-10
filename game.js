const { FRAME_RATE } = require('./constants');
const { CANVAS_WIDTH } = require('./constants');
const { CANVAS_HEIGHT } = require('./constants');
const { PLANCHETTE_WIDTH } = require('./constants');
const { PLANCHETTE_HEIGHT } = require('./constants');
const { MAX_PLAYERS_PER_ROOM } = require('./constants');

const { makeid } = require('./utils');
const { ouijaGoToLetter } = require('./utils');
const { ouijaGetLetter } = require('./utils');

module.exports = {
  initGame,
  addPlayer,
  gameLoop,
  getUpdatedVelocity,
}

function initGame() {
  console.log("made it to initGame()")
  state = createGameState();
  state = ouijaGoToLetter(state, 'C');
  return state;
}

function createGameState() {
  console.log("made it to createGameState")
  return {
    numSpirits: Array(1).fill(0),
    x: Array(100).fill(0),
    y: Array(100).fill(0),
    planchette: {
      pos: {
        x: 100,
        y: 100,
      }
    },
    letter_buffer: '',
    agreed_letters: '',
  };
}


function addPlayer(state) {
  // console.log("made it to addPlayer ****************************")
}

function gameLoop(state) {
  // console.log("made it to gameLoop")
  if (!state) {
    return;
  }

  // decision rule
  for (let i = 0; i < MAX_PLAYERS_PER_ROOM; i++) {
    // console.log("index: " + i)
    if (state.x[i] === 1 ) {
      // console.log("RIGHT")
      state.planchette.pos.x += 3;
    }
    if (state.x[i] === -1 ) {
      // console.log("LEFT")
      state.planchette.pos.x += -3;
    }
    if (state.y[i] === 1 ) {
      // console.log("DOWN")
      state.planchette.pos.y += 3;
    }
    if (state.y[i] === -1 ) {
      // console.log("UP")
      state.planchette.pos.y += -3;
    }

    // once we read the velocity, zero it out
    state.x[i] = 0;
    state.y[i] = 0;

  }

  // keep the planchette on the board
  if (state.planchette.pos.x < 0 + PLANCHETTE_WIDTH / 2) {
    state.planchette.pos.x = 0 + PLANCHETTE_WIDTH / 2;
  }
  if (state.planchette.pos.x > CANVAS_WIDTH - PLANCHETTE_WIDTH / 2) {
    state.planchette.pos.x = CANVAS_WIDTH - PLANCHETTE_WIDTH / 2;
  }
  if (state.planchette.pos.y < 0 + PLANCHETTE_WIDTH / 2) {
    state.planchette.pos.y = 0 + PLANCHETTE_WIDTH / 2;
  }
  if (state.planchette.pos.y > CANVAS_HEIGHT - PLANCHETTE_WIDTH / 2) {
    state.planchette.pos.y = CANVAS_HEIGHT - PLANCHETTE_WIDTH / 2;
  }

  // console.log("state.planchette.pos.x: " + state.planchette.pos.x)
  // console.log("state.planchette.pos.y: " + state.planchette.pos.y)


  current_letter = ouijaGetLetter(state);
  state.letter_buffer += current_letter;

  // if the last 30 frames of the letter buffer are the same, then that's an agreed letter
  if (state.letter_buffer.length > 50) {
    var last50 = state.letter_buffer.substr(state.letter_buffer.length - 50);
    console.log(last50)
    let count = 0;
    for(let i = 0; i < last50.length; i++){
      if(i === last50.lastIndexOf(last50[i])){
         continue;
      };
      count++;
    }

    if (count >= 49 && current_letter != '_') {
      state.agreed_letters += current_letter;
      state.letter_buffer = {};
      console.log("AGREED: " + state.agreed_letters)
    }
  }

  last_agreed = state.agreed_letters.substr(state.agreed_letters.length - 1);
  if(last_agreed == '.') {
      return true;
  }
  // reset all player velocities to 0
  state.x = Array(5).fill(0);
  state.y = Array(5).fill(0);

  return false;
}


function getUpdatedVelocity(keyCode) {
  // console.log("made it to getUpdatedVelocity()")
  switch (keyCode) {
    case 32: { // space bar
      // console.log("SPACE BAR")
      return { x: 0, y: 0 };
    }
    case 37: { // left
      // console.log("LEFT")
      return { x: -1, y: 0 };
    }
    case 38: { // down
      // console.log("UP")
      return { x: 0, y: -1 };
    }
    case 39: { // right
      // console.log("RIGHT")
      return { x: 1, y: 0 };
    }
    case 40: { // up
      // console.log("DOWN")
      return { x: 0, y: 1 };
    }
  }
}



