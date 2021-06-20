const { nanoid } = require('nanoid');
const gameState = require('../state');
const Piece = require('../piece/piece');

function resetGame() {
  const newBoard = [];
  for (let row = 0; row < 5; row += 1) {
    const curRow = [];
    for (let col = 0; col < 7; col += 1) {
      curRow.push(Piece());
    }

    newBoard.push(curRow);
  }

  gameState.board = newBoard;
  gameState.gameId = nanoid();
  gameState.gameStarted = true;
  gameState.spikes = [false, false, false, false, false, false, false];
  gameState.curColor = 'red';
  gameState.turn = 0;
  // Red goes first
  gameState.redPlayerId = '';
  gameState.yellowPlayerId = '';
  gameState.playerWaitingForReady = '';
  gameState.isBombDetonationActive = false;
  gameState.powerupsActivated.bomb = false;
  gameState.powerupsActivated.anvil = false;
  gameState.powerupsActivated.spike = false;
}

module.exports = { resetGame };
