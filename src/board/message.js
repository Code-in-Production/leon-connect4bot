const capitalize = require('lodash.capitalize');
const outdent = require('outdent');
const gameState = require('../state');
const { getBoardActionComponents } = require('./components');
const {
  cactusEmoji,
  blackSquareEmoji,
  yellowSquareEmoji,
  yellowEmoji,
  redSquareEmoji,
  redEmoji,
  blankEmoji,
} = require('../emojis');

function getBoardMessage(params = {}) {
  let msg = ':one::two::three::four::five::six::seven:\n';

  function isWinningSquare({ col, row }) {
    if (params.winningSquares === undefined) return false;

    return params.winningSquares.some(
      (square) => square.col === col && square.row === row
    );
  }
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

  // Adding the spikes
  for (let col = 0; col < 7; col += 1) {
    if (gameState.spikes[col]) {
      msg += cactusEmoji;
    } else {
      msg += blackSquareEmoji;
    }
  }

  msg += '\n';

  return msg;
}

function getTurnMessage() {
  let msg = '================\n';
  if (gameState.lastMessage) msg += `${gameState.lastMessage}\n`;

  msg += outdent`
  ${gameState.curColor === 'red' ? redEmoji : yellowEmoji} **${capitalize(
    gameState.curColor
  )}'s Turn:**`;

  msg += `\n\n${getBoardMessage()}`;

  return msg;
}

function sendBoardMessageAndActions(channel) {
  channel.send(
    outdent`
    ${getTurnMessage()}
    To play a piece, press the corresponding column number:`,
    { components: getBoardActionComponents() }
  );
}

module.exports = {
  getBoardMessage,
  getTurnMessage,
  sendBoardMessageAndActions,
};
