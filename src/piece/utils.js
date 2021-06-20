const { isColFull } = require('../utils');
const Piece = require('./piece');
const gameState = require('../state');
const { endTurn } = require('../player');
const { checkWin } = require('../board/win');

function dropPiece({ col, color }) {
  if (isColFull(col)) {
    throw new Error(`Column ${col} is full.`);
  }

  // Going from the bottom row to the top row to place the piece
  for (let row = 4; row >= 0; row -= 1) {
    if (gameState.board[row][col].color === null) {
      gameState.board[row][col] = Piece({ color });
      break;
    }
  }
}

function playPiece({ col, piece, channel }) {
  const { color, powerup } = piece;
  if (powerup === 'anvil') {
    for (let row = 0; row < 5; row += 1) {
      gameState.board[row][col] = Piece();
    }

    // Adding the piece to the last row
    gameState.board[4][col] = Piece({ color });
    endTurn(channel);
  } else if (powerup === 'bomb') {
    dropPiece({ color, col });
    if (!checkWin(channel)) {
      // TODO: Query user for bomb
    }
  } else if (powerup === 'spike') {
    dropPiece({ color, col });
    gameState.spikes[col] = true;
    if (!checkWin(channel)) endTurn(channel);
  } else {
    dropPiece({ color, col });
    if (!checkWin(channel)) endTurn(channel);
  }

  gameState.powerupsActivated.anvil = false;
  gameState.powerupsActivated.spike = false;
  gameState.powerupsActivated.bomb = false;
}

module.exports = { dropPiece, playPiece };
