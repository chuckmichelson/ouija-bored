const { FRAME_RATE } = require('./constants');
const { OUIJA_CODES } = require('./constants');


module.exports = {
  makeid,
  ouijaGoToLetter,
}

function makeid(length) {
   var result           = '';
   // var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var characters       = 'A';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function ouijaGoToLetter(state, letter) {
  console.log("made it to ouijaGoToLetter")
  state.planchette.pos.x = OUIJA_CODES[letter].x;
  state.planchette.pos.y = OUIJA_CODES[letter].y;
  return state;
}
