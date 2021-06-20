const gameState = require('./state');

function isColFull(col) {
  return gameState.board[0][col].color !== null;
}

function isColEmpty(col) {
  return gameState.board[4][col].color === null;
}

module.exports = { isColFull, isColEmpty };
