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
  playerId: {
    red: '',
    yellow: '',
  },
  playerWaitingForReady: '',
  inventories: {
    red: {
      regular: 16,
      anvil: 1,
      spike: 1,
      bomb: 1,
    },
    yellow: {
      regular: 16,
      anvil: 1,
      spike: 1,
      bomb: 1,
    },
  },
  lastMessage: '',
};

module.exports = gameState;
