const { outdent } = require('outdent');
const capitalize = require('lodash.capitalize');
const gameState = require('../state');

function getInventoryMessage({ color }) {
  return outdent`
		__**${capitalize(color)}'s Inventory:**__
		**Regular Pieces**: ${gameState.inventories[color].regular}
		**Anvil Pieces**: ${gameState.inventories[color].anvil}
		**Spike Pieces**: ${gameState.inventories[color].spike}
		**Bomb Pieces**: ${gameState.inventories[color].bomb}
	`;
}

module.exports = { getInventoryMessage }