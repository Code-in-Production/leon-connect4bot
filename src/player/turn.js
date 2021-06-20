const { getBoardMessage } = require('../board');
const gameState = require('../state');

function endTurn(channel) {
  if (gameState.curColor === 'yellow') {
    gameState.curColor = 'red';
  } else {
    gameState.curColor = 'yellow';
  }

	channel.send(getBoardMessage())
}

module.exports = { endTurn };
