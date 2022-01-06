const { FRAME_RATE } = require('./constants');
const { OUIJA_CODES } = require('./constants');


module.exports = {
  makeid,
  ouijaGoToLetter,
  ouijaGetLetter,
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
  xstart = state.planchette.pos.x;
  xend = OUIJA_CODES[letter].x;
  ystart = state.planchette.pos.y;
  yend = OUIJA_CODES[letter].y;
  // for ( var i = 0; i < 100; i++ ) {
  //     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  //  }
  state.planchette.pos.x = OUIJA_CODES[letter].x;
  state.planchette.pos.y = OUIJA_CODES[letter].y;
  return state;
}

function ouijaGetLetter(state) {
   letter = '';
   // console.log(OUIJA_CODES.length)
   for ( var i = 0; i < OUIJA_CODES.length; i++ ) {
      distance = Math.sqrt(Math.pow(OUIJA_CODES[i].x - state.planchette.pos.x, 2) + Math.pow(OUIJA_CODES[i].y - state.planchette.pos.y, 2));
      if (distance <= 10) {
         letter = OUIJA_CODES[i][];
         console.log('Your letter is: ' + letter)
      }
   }
   return letter;

}
