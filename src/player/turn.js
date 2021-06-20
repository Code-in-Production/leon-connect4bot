const { sendBoardMessageAndActions } = require('../board/message');
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

module.exports = { endTurn };
