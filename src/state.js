const gameState = {
  board: [],
  spikes: [],
  turnNumber: 0,
  curColor: '',
  gameId: '',
  gameStarted: false,
  powerupsActivated: {
    anvil: false,
    spike: false,
    bomb: false,
  },
  player1Id: '',
  player2Id: '',
  playerWaitingForReady: 0,
  isBombDetonationActive: false,
};

module.exports = gameState;
