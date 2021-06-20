const outdent = require('outdent');
const {
  sendBoardMessageAndActions,
  getBoardMessage,
} = require('../board/message');
const { resetGame } = require('../game/reset');
const gameState = require('../state');
const { isBoardFull } = require('../utils');

function announceTie(channel) {
  const msg = outdent`
    ${getBoardMessage()}

    Since ${
      gameState.curColor
    } has no more possible moves, the game ends in a tie.
  `;
  channel.send(msg);
  resetGame();
}

function endTurn(channel) {
  if (gameState.curColor === 'yellow') {
    gameState.curColor = 'red';
  } else {
    gameState.curColor = 'yellow';
  }
  gameState.turnNumber += 1;

  function isInventoryEmpty() {
    const { regular, anvil, spike, bomb } =
      gameState.inventories[gameState.curColor];
    return regular === 0 && anvil === 0 && spike === 0 && bomb === 0;
  }

  function cantMove() {
    return (
      isBoardFull() &&
      gameState.inventories[gameState.curColor].anvil <= 0 &&
      gameState.inventories[gameState.curColor].bomb <= 0
    );
  }

  // If the player can't make any more moves, then it's a tie
  if (isInventoryEmpty() || cantMove()) {
    announceTie(channel);
  } else {
    sendBoardMessageAndActions(channel);
  }
}

module.exports = { endTurn };
