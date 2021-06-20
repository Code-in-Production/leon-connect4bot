require('dotenv').config();

const Discord = require('discord.js');

const client = new Discord.Client();
require('discord-buttons')(client);

const { parseButtonId } = require('./button');
const gameState = require('./state');
const { resetGame } = require('./game/reset');
const { playPiece, detonateBomb } = require('./piece');
const { sendBoardMessageAndActions } = require('./board/message');
const { getTurnMessage } = require('./board/message');
const { getBoardColumnButtons } = require('./board/components');
const { isColFull } = require('./utils');
const { outdent } = require('outdent');
const { getInventoryMessage } = require('./player');

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

function checkGameStarted(channel) {
  if (!gameState.gameStarted) {
    channel.send('No game active. Please start a new game with !new');
  }
  return gameState.gameStarted;
}

client.on('message', (msg) => {
  if (msg.author.bot === true) return;
  if (!msg.content.startsWith('!')) return;
  const command = msg.content.slice(1);

  if (command === 'ready') {
    if (gameState.gameStarted) {
      return msg.channel.send(
        'A game is already in progress. To reset the game, use !reset.'
      );
    }

    if (gameState.playerWaitingForReady === 'red') {
      gameState.playerId.red = msg.author.id;
      gameState.playerWaitingForReady = 'yellow';
      msg.channel.send('Yellow player, please type in !ready');
    } else if (gameState.playerWaitingForReady === 'yellow') {
      gameState.playerId.yellow = msg.author.id;
      msg.channel.send('Starting new game...');
      resetGame();
      sendBoardMessageAndActions(msg.channel);
    } else {
      msg.channel.send(
        'A game has not been started. To start a new game, type !new'
      );
    }
  } else if (command === 'new') {
    gameState.playerWaitingForReady = 'red';
    msg.channel.send(
      'Starting a new game...\nRed player, please type in !ready'
    );
  } else if (command === 'board') {
    if (!checkGameStarted(msg.channel)) return;

    msg.channel.send(getTurnMessage());
  } else if (command === 'inventory') {
    if (!checkGameStarted(msg.channel)) return;

    // Check if the player is the red player or the yellow player
    if (msg.author.id === gameState.playerId.red) {
      msg.channel.send(getInventoryMessage({ color: 'red' }));
    } else if (msg.author.id === gameState.playerId.yellow) {
      msg.channel.send(getInventoryMessage({ color: 'red' }));
    } else {
      msg.channel.send('You are not a player in the current game!');
    }
  } else if (command === 'help') {
    const helpMessage = outdent`
      This is the help message.
    `;

    msg.channel.send(helpMessage);
  } else {
    msg.channel.send(
      `Unrecognized command: ${command}. Please use !help to get a list of commands.`
    );
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
    return button.reply.send(
      'This button is for a previous turn; nothing happened.'
    );
  }

  if (button.clicker.member.id !== gameState.playerId[gameState.curColor]) {
    return button.reply.send('It is not your turn!');
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
          components: getBoardColumnButtons({
            isColDisabled: (column) => isColFull(column),
          }),
        }
      );
    } else if (powerup === 'bomb') {
      button.channel.send(
        `Which column would you like to drop the bomb piece on? (You'll be asked which column you would like to detonate after.)`,
        {
          components: getBoardColumnButtons({
            isColDisabled: (column) => isColFull(column),
          }),
        }
      );
    }
  }

  // If the button is a column play button, then play the piece
  else if (type === 'column') {
    if (gameState.isBombDetonationActive) {
      await detonateBomb({
        channel: button.channel,
        col,
      });
    } else {
      await playPiece({ channel: button.channel, col });
    }
  }

  button.defer();
});

client.login(process.env.BOT_TOKEN).catch((err) => {
  console.error(`Error: ${err}`);
});
