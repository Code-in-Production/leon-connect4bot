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
  } else if (type === 'column') {
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
