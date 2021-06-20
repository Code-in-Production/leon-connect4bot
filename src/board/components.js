const { MessageButton, MessageActionRow } = require('discord-buttons');
const { createButtonId } = require('../button');
const { isColFull } = require('../utils');
const gameState = require('../state');

function getBoardActionComponents() {
  function createPlayColButtonRow(emojis) {
    const buttonRow = new MessageActionRow();
    buttonRow.addComponents(
      emojis.map(({ emoji, col }) => {
        const messageButton = new MessageButton()
          .setEmoji(emoji)
          .setStyle('blurple')
          .setID(
            createButtonId({
              type: 'play',
              gameId: gameState.gameId,
              turnNumber: gameState.turnNumber,
              col,
            })
          );

        if (isColFull(col)) messageButton.setDisabled();

        return messageButton;
      })
    );
    return buttonRow;
  }

  const playColRow1 = createPlayColButtonRow([
    { emoji: '1️⃣', col: 0 },
    { emoji: '2️⃣', col: 1 },
    { emoji: '3️⃣', col: 2 },
    { emoji: '4️⃣', col: 3 },
  ]);
  const playColRow2 = createPlayColButtonRow([
    { emoji: '5️⃣', col: 4 },
    { emoji: '6️⃣', col: 5 },
    { emoji: '7️⃣', col: 6 },
  ]);

  const powerupRow = new MessageActionRow().addComponents([
    new MessageButton()
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
      ),
    new MessageButton()
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
      ),
    new MessageButton()
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
      ),
  ]);

  return [playColRow1, playColRow2, powerupRow];
}

module.exports = { getBoardActionComponents };
