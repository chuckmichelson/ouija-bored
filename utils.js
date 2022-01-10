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
   // console.log("made it to ouijaGoToLetter")
   // xstart = state.planchette.pos.x;
   // xend = OUIJA_CODES[letter].x;
   // ystart = state.planchette.pos.y;
   // yend = OUIJA_CODES[letter].y;
   // for ( var i = 0; i < 100; i++ ) {

   // }
   ouijaAlphabetLength = Object.keys(OUIJA_CODES).length;
   for ( var i = 0; i < ouijaAlphabetLength - 1; i++ ) {
      if (OUIJA_CODES[i].letter === letter) {
         state.planchette.pos.x = OUIJA_CODES[i].x
         state.planchette.pos.y = OUIJA_CODES[i].y
      }
   }
  return state;
}

function ouijaGetLetter(state) {
   letter = '_';
   ouijaAlphabetLength = Object.keys(OUIJA_CODES).length;
   // console.log("ouijaAlphabetLength: " + ouijaAlphabetLength);
   // console.log("state.planchette.pos.x: " + state.planchette.pos.x);
   posx = state.planchette.pos.x;
   posy = state.planchette.pos.y;

   for ( var i = 0; i < ouijaAlphabetLength; i++ ) {
      // console.log(i)
      codx = OUIJA_CODES[i].x;
      cody = OUIJA_CODES[i].y;
      distance = Math.sqrt(Math.pow(codx - posx, 2) + Math.pow(cody - posy, 2));
      // console.log(distance);
      if (distance <= 15) {
         letter = OUIJA_CODES[i].letter;
         // console.log('Your letter is: ' + letter);
      }
   }
   if (posy >= 494 && posx >= 280 && posx <= 562) {
      letter = '.'; // i.e., GOODBYE
   }
   return letter;
}
