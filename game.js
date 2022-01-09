const { FRAME_RATE } = require('./constants');
const { CANVAS_WIDTH } = require('./constants');
const { CANVAS_HEIGHT } = require('./constants');
const { PLANCHETTE_WIDTH } = require('./constants');
const { PLANCHETTE_HEIGHT } = require('./constants');
const { MAX_PLAYERS_PER_ROOM } = require('./constants');

// const FRAME_RATE = 20;
// const CANVAS_WIDTH = 838;
// const CANVAS_HEIGHT = 554;
// const PLANCHETTE_WIDTH = 120;
// const PLANCHETTE_HEIGHT = 120;
const MAX_PLAYERS_PER_ROOM = 100;

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
  state = createGameState();
  // state = ouijaGoToLetter(state, 'C');
  return state;
}

function createGameState() {
  console.log("made it to createGameState")

//   return {
//     numPlayers: 1,
//     players: [{ x : 0, y : 0 }],
//     planchette: {
//       pos: {
//         x: 100,
//         y: 100,
//       }
//     },
//     letters: {},
//   };
// }

  return {
    numSpirits: Array(1).fill(0),
    x: Array(100).fill(0),
    y: Array(100).fill(0),
    // players : {
    //   x : [0],
    //   y : [0],
    // },
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

  // numPlayers = Object.keys([state['AAAAA'].players]).length;
  // console.log("add player numPlayers: " + state.numPlayers)  // state.players[size + 1] = { x: 0, y: 0 };
  // state.players[numPlayers + 1] = {};
  // state.players[numPlayers + 1] = { x : 0, y : 0 };
  // state.players.push([ { x : 0, y : 0 } ]);
  // console.log([state.players].x[0] === undefined);
  // console.log(state)
  // console.log([state.x])
  // numPlayers = 100;
  // console.log("addPlayer numPlayers (before push): " + numPlayers);
  // // [state.players].push({ x : 0, y : 0 });
  // // [state.x].push(0);
  // // [state.y].push(0);
  // [state.x][numPlayers] = 0;
  // [state.y][numPlayers] = 0;
  // numPlayers = state['AAAAA'].x.length;
  // console.log("addPlayer numPlayers (after push): " + numPlayers);
  // state.players[String(state.numPlayers)].x = 0;
  // state.players[String(state.numPlayers)].y = 0;
  // numPlayers = Object.keys([state.players]).length;
  // console.log("add player numPlayers: " + state.numPlayers)  // state.players[size + 1] = { x: 0, y: 0 };

  // for (let i = 0; i < numPlayers; i++) {
  //   console.log("x vel of player " + i + " : " + state.players[i].x)
  // }
  // return state;

}

function gameLoop(state) {
  // console.log("made it to gameLoop")
  if (!state) {
    return;
  }

  // decision rule
  // console.log("decision rule numPlayers: " + numPlayers)
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



