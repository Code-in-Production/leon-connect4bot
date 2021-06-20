function parseButtonId(buttonId) {
  return JSON.parse(buttonId);
}

function createButtonId({ type, gameId, turnNumber, powerup, col }) {
  if (type === 'powerup') {
    return JSON.stringify({
      type,
      gameId,
      turnNumber,
      powerup,
    });
  } else if (type === 'play') {
    return JSON.stringify({
      type,
      gameId,
      turnNumber,
      col,
    });
  }
}

module.exports = {
  parseButtonId,
  createButtonId,
};
