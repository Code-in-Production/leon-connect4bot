require('dotenv').config();

const Discord = require('discord.js');

const client = new Discord.Client();
require('discord-buttons')(client);

const { parseButtonId } = require('./button');
const gameState = require('./state');
const { resetGame } = require('./game/reset');
const { Piece, playPiece, detonateBomb } = require('./piece');
const { sendBoardMessageAndActions } = require('./board/message');
const { getTurnMessage } = require('./board/message');
const { getBoardColumnButtons } = require('./board/components');

client.on('ready', () => {
  console.log('Bot is ready.');
});

function debugBoard() {
  for (let row = 0; row < 5; row += 1) {
    for (let col = 0; col < 7; col += 1) {
      console.log(gameState.board[row][col]);
    }
  }
}

client.on('message', (msg) => {
  if (msg.author.bot === true) return;
  if (!msg.content.startsWith('!')) return;
  const command = msg.content.slice(1);

  if (command === 'test') {
    return;
  }

  if (command === 'debug') {
    if (gameState.gameStarted) debugBoard();
    return;
  }

  if (command === 'reset') {
    resetGame();
    return;
  }

  if (command === 'ready') {
    if (gameState.gameStarted) {
      return msg.channel.send('A game is already in progress.');
    }

    if (gameState.playerWaitingForReady === 'red') {
      gameState.redPlayerId = msg.author.id;
      gameState.playerWaitingForReady = 'yellow';
      msg.channel.send('Yellow player, please type in !ready');
    } else if (gameState.playerWaitingForReady === 'yellow') {
      gameState.yellowPlayerId = msg.author.id;
      msg.channel.send('Starting new game...');
      resetGame();
      sendBoardMessageAndActions(msg.channel);
    } else {
      msg.channel.send(
        'A game has not been started. To start a new game, type !play'
      );
    }
    return;
  }

  if (command === 'play') {
    if (gameState.gameStarted) {
      msg.channel.send('A game is in progress. To reset the game, use !reset');
    } else {
      gameState.playerWaitingForReady = 'red';
      msg.channel.send(
        'Starting a new game...\nRed player, please type in !ready'
      );
    }
  } else {
    if (!gameState.gameStarted) {
      return msg.channel.send(
        'No game active. Please start a new game with !play'
      );
    }

    if (command === 'board') {
      msg.channel.send(getTurnMessage());
    } else {
      msg.channel.send(`Unrecognized command: ${command}`);
    }
  }
});

client.on('clickButton', async (button) => {
  const {
    col,
    turnNumber: buttonTurnNumber,
    gameId: buttonGameId,
    powerup,
    type,
  } = parseButtonId(button.id);

  // Don't do anything if the buttons aren't for the current turn.
  if (
    buttonGameId !== gameState.gameId ||
    buttonTurnNumber !== gameState.turnNumber
  ) {
    return button.defer();
  }

  // If the button is a powerup button (i.e. to activate a powerup), then
  // alter the game state accordingly
  if (type === 'powerup') {
    gameState.powerupsActivated[powerup] = true;
    if (powerup === 'anvil') {
      button.channel.send(
        `Which column would you like to drop the anvil piece on?`,
        // Anvil can always be dropped
        {
          components: getBoardColumnButtons({
            isColDisabled: () => false,
          }),
        }
      );
    } else if (powerup === 'spike') {
      button.channel.send(
        `Which column would you like to drop the spike piece on?`,
        {
          components: getBoardColumnButtons(),
        }
      );
    } else if (powerup === 'bomb') {
      button.channel.send(
        `Which column would you like to drop the bomb piece on? (You'll be asked which column you would like to detonate after.)`,
        {
          components: getBoardColumnButtons(),
        }
      );
    }
  }

  // If the button is a column play button, then play the piece
  else if (type === 'column') {
    if (gameState.isBombDetonationActive) {
      detonateBomb({
        channel: button.channel,
        col,
      });
    } else {
      playPiece({
        channel: button.channel,
        col,
        piece: Piece({ color: gameState.curColor }),
      });
    }
  }

  button.defer();
});

client.login(process.env.BOT_TOKEN).catch((err) => {
  console.error(`Error: ${err}`);
});
