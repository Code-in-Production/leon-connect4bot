const gameState = require('../state');
const { resetGame } = require('./reset');

function announceWinner(channel) {
  resetGame();
}

module.exports = { announceWinner };
