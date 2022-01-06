// const { FRAME_RATE } = require('./constants');
// const { CANVAS_WIDTH } = require('./constants');
// const { CANVAS_HEIGHT } = require('./constants');
// const { PLANCHETTE_WIDTH } = require('./constants');
// const { PLANCHETTE_HEIGHT } = require('./constants');

const FRAME_RATE = 20;
const CANVAS_WIDTH = 838;
const CANVAS_HEIGHT = 554;
const PLANCHETTE_WIDTH = 120;
const PLANCHETTE_HEIGHT = 120;

const { makeid } = require('./utils');
const { ouijaGoToLetter } = require('./utils');
const { ouijaGetLetter } = require('./utils');


module.exports = {
  initGame,
  addPlayer,
  gameLoop,
  getUpdatedVelocity,
}


// state = initGame()

function initGame() {
  console.log("made it to initGame()")
  var state = createGameState();
  state = ouijaGoToLetter(state, 'C');
  return state;
}

function createGameState() {
  console.log("made it to createGameState")
  return {
    players: [{
      vel: {
        x: 0,
        y: 0,
      },
    },],
    planchette: {
      pos: {
        x: 100,
        y: 100,
      }
    },
    letters: "",
  };
}

function addPlayer(state) {
  console.log("made it to addPlayer ****************************")
  console.log(state.players.vel.x)
  // newPlayer = {
  //     vel: {
  //       x: 0,
  //       y: 0,
  //     }
  // };
  // size = Object.keys([state.players]).length
  // console.log("size: " + size)
  // state.players[size + 1] = { vel: { x: 0, y: 0 } }
  // for (let i = 0; i < size; i++) {
  //   console.log("x vel of player " + i + " : " + state.players[i].vel.x)
  // }
  return state;

}

function gameLoop(state) {
  // console.log("made it to gameLoop")
  // console.log(state.planchette.pos.x)
  if (!state) {
    return;
  }

  // decision rule
  var nUP = 0
  var nDOWN = 0
  var nLEFT = 0
  var nRIGHT = 0
  for (let i = 0; i < state.players.length; i++) {
    if (state.players[i].vel.x === 1 ) {
      nRIGHT += 1
    }
    if (state.players[i].vel.x === -1 ) {
      nLEFT += 1
    }
    if (state.players[i].vel.y === 1 ) {
      nUP += 1
    }
    if (state.players[i].vel.y === -1 ) {
      nDOWN += 1
    }
  }
  var max_arrow_val = Math.max(nRIGHT, nLEFT, nUP, nDOWN)
  if (max_arrow_val != 0) {
    if (max_arrow_val === nRIGHT ) {
      state.planchette.pos.x += 3;
      state.planchette.pos.y += 0;
    }
    if (max_arrow_val === nLEFT ) {
      state.planchette.pos.x += -3;
      state.planchette.pos.y += 0;
    }
    if (max_arrow_val === nUP ) {
      state.planchette.pos.x += 0;
      state.planchette.pos.y += 3;
    }
    if (max_arrow_val === nDOWN ) {
      state.planchette.pos.x += 0;
      state.planchette.pos.y += -3;
    }
  }


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

  var letter = ouijaGetLetter(state);
  if (letter === undefined) {
    // do nothing
  } else {
    state.letters += letter;
  }


  return false;
}


function getUpdatedVelocity(keyCode) {
  console.log("made it to getUpdatedVelocity()")
  switch (keyCode) {
    case 32: { // space bar
      return { x: 0, y: 0 };
    }
    case 37: { // left
      return { x: -1, y: 0 };
    }
    case 38: { // down
      return { x: 0, y: -1 };
    }
    case 39: { // right
      return { x: 1, y: 0 };
    }
    case 40: { // up
      return { x: 0, y: 1 };
    }
  }
}



