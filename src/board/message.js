const capitalize = require('lodash.capitalize');
const gameState = require('../state');
const { getBoardActionComponents } = require('./components');

const blankEmoji = ':white_large_square:';
const redEmoji = ':red_circle:';
const yellowEmoji = ':yellow_circle:';
const redSquareEmoji = ':red_square:';
const yellowSquareEmoji = ':yellow_square:';

function getBoardMessage(params = {}) {
  function isWinningSquare({ col, row }) {
    if (params.winningSquares === undefined) return false;

    return params.winningSquares.any(
      (square) => square.col === col && square.row === row
    );
  }

  let msg = `===================
  **${capitalize(gameState.curColor)}'s Turn:**\n`;
  for (let row = 0; row < 5; row += 1) {
    for (let col = 0; col < 7; col += 1) {
      const piece = gameState.board[row][col];
      if (piece.color === 'red') {
        if (isWinningSquare({ col, row })) {
          msg += redSquareEmoji;
        } else {
          msg += redEmoji;
        }
      } else if (piece.color === 'yellow') {
        if (isWinningSquare({ col, row })) {
          msg += yellowSquareEmoji;
        } else {
          msg += yellowEmoji;
        }
      } else {
        msg += blankEmoji;
      }
    }

    msg += '\n';
  }
  msg += 'To play a piece, press the corresponding column number:';

  return msg;
}

function sendBoardMessageAndActions(channel) {
  channel.send(getBoardMessage(), { components: getBoardActionComponents() });
}

module.exports = { getBoardMessage, sendBoardMessageAndActions };
