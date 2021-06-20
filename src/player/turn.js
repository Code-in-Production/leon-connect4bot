const capitalize = require('lodash.capitalize');
const { sendBoardMessageAndActions } = require('../board/message');
const { getBoardMessage } = require('../board/message');
const gameState = require('../state');

function endTurn(channel) {
  if (gameState.curColor === 'yellow') {
    gameState.curColor = 'red';
  } else {
    gameState.curColor = 'yellow';
  }
  gameState.turnNumber += 1;

  sendBoardMessageAndActions(channel);
}

function getTurnMessage() {
  let msg = `===================
  **${capitalize(gameState.curColor)}'s Turn:**\n`;

  msg += getBoardMessage();

  return msg;
}

module.exports = { endTurn, getTurnMessage };
