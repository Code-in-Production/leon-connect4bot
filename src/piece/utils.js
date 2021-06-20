const capitalize = require('lodash.capitalize');
const delay = require('delay');
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

async function playPiece({ col, channel }) {
  const color = gameState.curColor;

  // Removing piece from inventory
  if (gameState.powerupsActivated.bomb) {
    gameState.inventories[color].bomb -= 1;
  } else if (gameState.powerupsActivated.spike) {
    gameState.inventories[color].spike -= 1;
  } else if (gameState.powerupsActivated.anvil) {
    gameState.inventories[color].anvil -= 1;
  } else {
    gameState.inventories[color].regular -= 1;
  }

  // If the user plays a piece on a spike, remove the spike and discard the piece
  if (gameState.spikes[col]) {
    gameState.spikes[col] = false;
    channel.send(
      `${capitalize(gameState.curColor)}'s piece was destroyed by the spike.`
    );
    await delay(1000);

    resetPowerups();
    endTurn(channel);
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
        `${capitalize(gameState.curColor)} dropped a bomb piece on column ${
          col + 1
        }.`
      );
      await delay(1000);
      channel.send(
        `Please select a column to detonate (which will remove the bottom piece of the column and cause the other pieces in the column to fall down a row).`,
        {
          components: getBoardColumnButtons({
            // Can't detonate an empty column
            isColDisabled: (column) => isColEmpty(column),
          }),
        }
      );
      gameState.isBombDetonationActive = true;
    }
  } else if (gameState.powerupsActivated.spike) {
    dropPiece({ color, col });
    channel.send(
      `${capitalize(gameState.curColor)} dropped a spike piece on column ${
        col + 1
      }.`
    );
    gameState.spikes[col] = true;
    await delay(1000);
    if (!checkWin(channel)) endTurn(channel);
  } else {
    dropPiece({ color, col });
    channel.send(
      `${capitalize(gameState.curColor)} dropped a regular piece on column ${
        col + 1
      }.`
    );
    await delay(1000);
    if (!checkWin(channel)) endTurn(channel);
  }

  resetPowerups();
}

async function detonateBomb({ col, channel }) {
  for (let row = 4; row > 0; row -= 1) {
    gameState.board[row][col] = gameState.board[row - 1][col];
  }

  // Make the top piece empty
  gameState.board[0][col] = Piece();

  channel.send(
    `${capitalize(gameState.curColor)} has detonated a bomb on column ${col}.`
  );
  await delay(1000);

  if (!checkWin(channel)) {
    endTurn(channel);
  }

  gameState.isBombDetonationActive = false;
}

module.exports = { dropPiece, playPiece, detonateBomb };
