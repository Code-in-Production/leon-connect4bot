const capitalize = require('lodash.capitalize');
const { isColFull, isColEmpty } = require('../utils');
const Piece = require('./piece');
const gameState = require('../state');
const { endTurn } = require('../player');
const { checkWin } = require('../board/win');
const { getBoardColumnButtons } = require('../board/components');

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

function resetPowerups() {
  gameState.powerupsActivated.anvil = false;
  gameState.powerupsActivated.spike = false;
  gameState.powerupsActivated.bomb = false;
}

function playPiece({ col, piece, channel }) {
  const { color } = piece;
  // If the user plays a piece on a spike, remove the spike and discard the piece
  if (gameState.spikes[col]) {
    gameState.spikes[col] = false;
    resetPowerups();
    return;
  }

  if (gameState.powerupsActivated.anvil) {
    for (let row = 0; row < 5; row += 1) {
      gameState.board[row][col] = Piece();
    }

    // Adding the piece to the last row
    gameState.board[4][col] = Piece({ color });
    endTurn(channel);
  } else if (gameState.powerupsActivated.bomb) {
    dropPiece({ color, col });
    if (!checkWin(channel)) {
      channel.send(
        'Please select a column to detonate (which will remove the bottom piece of the column and cause the other pieces in the column to fall down a row).',
        // Can't detonate an empty row
        {
          components: [getBoardColumnButtons((column) => isColEmpty(column))],
        }
      );
      // TODO: Query user for bomb
    }
  } else if (gameState.powerupsActivated.spike) {
    dropPiece({ color, col });
    gameState.spikes[col] = true;
    if (!checkWin(channel)) endTurn(channel);
  } else {
    dropPiece({ color, col });
    if (!checkWin(channel)) endTurn(channel);
  }
  resetPowerups();
}

function detonateBomb({ col, channel }) {
  for (let row = 4; row > 0; row -= 1) {
    gameState.board[row][col] = gameState.board[row - 1][col];
  }

  // Make the top piece empty
  gameState.board[0][col] = Piece();

  channel.send(
    `${capitalize(gameState.curColor)} has detonated a bomb on column ${col}.`
  );

  if (!checkWin(channel)) {
    endTurn(channel);
  }

  gameState.isBombActive = false;
}

module.exports = { dropPiece, playPiece, detonateBomb };
