require('dotenv').config();

const Discord = require('discord.js');

const client = new Discord.Client();
require('discord-buttons')(client);

const { parseButtonId } = require('./button');
const gameState = require('./state');
const { resetGame } = require('./game/reset');
const { playPiece } = require('./piece');
const { sendBoardMessageAndActions } = require('./board/message');
const { getTurnMessage } = require('./board/message');
const { getBoardColumnButtons } = require('./board/components');
const { isColFull } = require('./utils');
const { getInventoryMessage } = require('./player');
const {
  helpMessage,
  inventoryHelpMessage,
  boardHelpMessage,
} = require('./help');

client.on('ready', () => {
  console.info('Bot is ready.');
  resetGame();
});

function checkGameStarted(channel) {
  if (!gameState.gameStarted) {
    channel.send('No game active. Please start a new game with `!new`');
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
        'A game is already in progress. To start a new game, use `!new`.'
      );
    }

    if (gameState.playerWaitingForReady === 'red') {
      gameState.playerId.red = msg.author.id;
      gameState.playerWaitingForReady = 'yellow';
      msg.channel.send('Yellow player, please type in `!ready`');
    } else if (gameState.playerWaitingForReady === 'yellow') {
      gameState.playerId.yellow = msg.author.id;
      gameState.gameStarted = true;
      msg.channel.send('Starting new game...');
      sendBoardMessageAndActions(msg.channel);
    } else {
      msg.channel.send(
        'A game has not been started. To start a new game, type `!new`'
      );
    }
  } else if (command === 'new') {
    resetGame();
    gameState.playerWaitingForReady = 'red';
    msg.channel.send(
      'Starting a new game...\nRed player, please type in `!ready`'
    );
  } else if (command === 'board') {
    if (!checkGameStarted(msg.channel)) return;

    msg.channel.send(getTurnMessage());
  } else if (command === 'inventory') {
    if (!checkGameStarted(msg.channel)) return;

    // If the player is both red and yellow, display the current inventory
    if (
      msg.author.id === gameState.playerId.red &&
      msg.author.id === gameState.playerId.yellow
    ) {
      msg.channel.send(getInventoryMessage({ color: gameState.curColor }));
    }
    // Check if the player is the red player or the yellow player
    else if (msg.author.id === gameState.playerId.red) {
      msg.channel.send(getInventoryMessage({ color: 'red' }));
    } else if (msg.author.id === gameState.playerId.yellow) {
      msg.channel.send(getInventoryMessage({ color: 'red' }));
    } else {
      msg.channel.send('You are not a player in the current game!');
    }
  } else if (command === 'help') {
    const subcommand = command.split(' ')[1];
    if (subcommand === undefined) {
      msg.channel.send(helpMessage);
    } else if (subcommand === 'inventory') {
      msg.channel.send(inventoryHelpMessage);
    } else if (subcommand === 'board') {
      msg.channel.send(boardHelpMessage);
    } else {
      msg.channel.send(
        `Unrecognized command: \`!${command}\`. Please use \`!help\` to get a list of commands.`
      );
    }
  } else {
    msg.channel.send(
      `Unrecognized command: \`!${command}\`. Please use \`!help\` to get a list of commands.`
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
    return button.defer();
  }

  if (button.clicker.member.id !== gameState.playerId[gameState.curColor]) {
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
          components: getBoardColumnButtons({
            isColDisabled: (column) => isColFull(column),
          }),
        }
      );
    } else if (powerup === 'bomb') {
      button.channel.send(
        `Which column would you like to drop the bomb piece on?`,
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
    await playPiece({ channel: button.channel, col });
  }

  button.defer();
});

client.login(process.env.BOT_TOKEN).catch((err) => {
  console.error(`Error: ${err}`);
});
