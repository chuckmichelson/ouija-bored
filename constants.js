const FRAME_RATE = 10;
const CANVAS_WIDTH = 838;
const CANVAS_HEIGHT = 554;
const PLANCHETTE_WIDTH = 120;
const PLANCHETTE_HEIGHT = 120;

const OUIJA_CODES = {
    0 : {letter : 'YES', x : 204, y : 87 },
    1 : {letter : 'NO', x : 645, y : 87 },
    2 : {letter : 'A', x : 111, y : 276 },
    3 : {letter : 'B', x : 162, y : 246 },
    4 : {letter : 'C', x : 220, y : 226 },
    5 : {letter : 'D', x : 265, y : 208 },
    5 : {letter : 'E', x : 316, y : 199 },
    6 : {letter : 'F', x : 364, y : 193 },
    7 : {letter : 'G', x : 418, y : 190 },
    8 : {letter : 'H', x : 472, y : 190 },
}



module.exports = {
  FRAME_RATE,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PLANCHETTE_WIDTH,
  PLANCHETTE_HEIGHT,
  OUIJA_CODES,
}
