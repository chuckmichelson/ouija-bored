const { FRAME_RATE } = require('./constants');
const { CANVAS_WIDTH } = require('./constants');
const { CANVAS_HEIGHT } = require('./constants');
const { PLANCHETTE_WIDTH } = require('./constants');
const { PLANCHETTE_HEIGHT } = require('./constants');
const { MAX_PLAYERS_PER_ROOM } = require('./constants');
const { AGREE_DURATION } = require('./constants');

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
  state.current_game_active = true;
  // state = ouijaGoToLetter(state, '5');
  start = 0;
  return state;
}

function createGameState() {
  return {
    current_game_active: false,
    numSpirits: 1,
    x: Array(100).fill(0),
    y: Array(100).fill(0),
    planchette: {
      pos: {
        x: 297,
        y: 244,
      }
    },
    previous_letter: '_',
    current_letter: '_',
    agreed_letters: '',
  };
}


function addPlayer(state) {
  state.numSpirits += 1;
  console.log(state.numSpirits)
}

function gameLoop(state) {

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

  // read letter
  state.previous_letter = state.current_letter;
  state.current_letter = ouijaGetLetter(state);

  // run timer to determine agreed letter
  if (state.current_letter == '_') {
    start = Date.now();
  }
  if (state.current_letter != state.previous_letter) {
    start = Date.now();
  }
  if (Date.now() - start > AGREE_DURATION && state.current_letter != '_') {
    state.agreed_letters += state.current_letter;
    console.log("AGREED: " + state.agreed_letters)
    start = Date.now();
  }


  last_agreed = state.agreed_letters.substr(state.agreed_letters.length - 1);
  if(last_agreed == '.') {
      return true;
  }
  // reset all player velocities to 0 so the user must hold down the arrow keys
  state.x = Array(5).fill(0);
  state.y = Array(5).fill(0);

  // return with no exit code
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



