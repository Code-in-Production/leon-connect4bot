const { outdent } = require('outdent');
const capitalize = require('lodash.capitalize');
const gameState = require('../state');
const {
  redEmoji,
  yellowEmoji,
  cactusEmoji,
  hammerEmoji,
  bombEmoji,
} = require('../emojis');

function getInventoryMessage({ color }) {
  return outdent`
		__**${capitalize(color)}'s Inventory:**__
		${color === 'red' ? redEmoji : yellowEmoji} **Regular Pieces**: ${
    gameState.inventories[color].regular
  }
		${hammerEmoji} **Anvil Pieces**: ${gameState.inventories[color].anvil}
		${cactusEmoji} **Spike Pieces**: ${gameState.inventories[color].spike}
		${bombEmoji} **Bomb Pieces**: ${gameState.inventories[color].bomb}
	`;
}

module.exports = { getInventoryMessage };
