const { MessageButton, MessageActionRow } = require('discord-buttons');
const { createButtonId } = require('../button');
const { isBoardFull, isColFull } = require('../utils');
const gameState = require('../state');

function getBoardColumnButtons({ isColDisabled }) {
  function createColumnButtonsRow(emojis) {
    const buttonRow = new MessageActionRow();
    buttonRow.addComponents(
      emojis.map(({ emoji, col }) => {
        const messageButton = new MessageButton()
          .setEmoji(emoji)
          .setStyle('blurple')
          .setID(
            createButtonId({
              type: 'column',
              gameId: gameState.gameId,
              turnNumber: gameState.turnNumber,
              col,
            })
          );

        if (isColDisabled(col)) {
          messageButton.setDisabled();
        }

        return messageButton;
      })
    );
    return buttonRow;
  }

  const columnButtonsRow1 = createColumnButtonsRow([
    { emoji: '1️⃣', col: 0 },
    { emoji: '2️⃣', col: 1 },
    { emoji: '3️⃣', col: 2 },
    { emoji: '4️⃣', col: 3 },
  ]);
  const columnButtonsRow2 = createColumnButtonsRow([
    { emoji: '5️⃣', col: 4 },
    { emoji: '6️⃣', col: 5 },
    { emoji: '7️⃣', col: 6 },
  ]);

  return [columnButtonsRow1, columnButtonsRow2];
}

function isAnvilPlayable() {
  return gameState.inventories[gameState.curColor].anvil > 0;
}

// Spike is only playable when at least one col is not full
function isSpikePlayable() {
  return gameState.inventories[gameState.curColor].spike > 0 && !isBoardFull();
}

function isBombPlayable() {
  return gameState.inventories[gameState.curColor].bomb > 0;
}

function getPowerupActionButtons() {
  const anvilButton = new MessageButton()
    .setEmoji('🔨')
    .setLabel('Anvil')
    .setStyle('blurple')
    .setID(
      createButtonId({
        type: 'powerup',
        gameId: gameState.gameId,
        turnNumber: gameState.turnNumber,
        powerup: 'anvil',
      })
    );

  if (!isAnvilPlayable()) {
    anvilButton.setDisabled();
  }

  const spikeButton = new MessageButton()
    .setEmoji('🌵')
    .setLabel('Spike')
    .setStyle('blurple')
    .setID(
      createButtonId({
        type: 'powerup',
        gameId: gameState.gameId,
        turnNumber: gameState.turnNumber,
        powerup: 'spike',
      })
    );

  if (!isSpikePlayable()) {
    spikeButton.setDisabled();
  }

  const bombButton = new MessageButton()
    .setEmoji('💣')
    .setLabel('Bomb')
    .setStyle('blurple')
    .setID(
      createButtonId({
        type: 'powerup',
        gameId: gameState.gameId,
        turnNumber: gameState.turnNumber,
        powerup: 'bomb',
      })
    );

  if (!isBombPlayable()) {
    bombButton.setDisabled();
  }

  return new MessageActionRow().addComponents([
    anvilButton,
    spikeButton,
    bombButton,
  ]);
}

function getBoardActionComponents() {
  const columnButtonsRows = getBoardColumnButtons({
    isColDisabled: (col) => {
      if (gameState.inventories[gameState.curColor].regular <= 0) return true;

      return isColFull(col);
    },
  });
  const powerupRow = getPowerupActionButtons();

  return [...columnButtonsRows, powerupRow];
}

module.exports = { getBoardActionComponents, getBoardColumnButtons };
