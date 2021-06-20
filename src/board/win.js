const { resetGame } = require('../game/reset');
const gameState = require('../state');
const { getBoardMessage } = require('./message');

function isRed({ col, row }) {
  return gameState.board[row][col].color === 'red';
}

function isYellow({ col, row }) {
  return gameState.board[row][col].color === 'yellow';
}

function announceWinner({ channel, winningSquares }) {
  channel.send(
    `${getBoardMessage({
      winningSquares,
    })}\n\nWe have a winner; Congratulations to ${
      gameState.curColor
    } for completing the first Connect 4!`
  );
  resetGame();
}

function checkWin(channel) {
  let streak = 0;
  let streakColor = '';

  function resetStreak() {
    streakColor = '';
    streak = 0;
  }

  function updateStreak({ col, row }) {
    if (isRed({ col, row })) {
      if (streakColor === 'red') {
        streak += 1;
      } else {
        streakColor = 'red';
        streak = 1;
      }
    } else if (isYellow({ col, row })) {
      if (streakColor === 'yellow') {
        streak += 1;
      } else {
        streakColor = 'yellow';
        streak = 1;
      }
    }
    // blank square
    else {
      resetStreak();
    }
  }

  // Check for horizontal connect 4s
  for (let row = 0; row < 5; row += 1) {
    for (let col = 0; col < 7; col += 1) {
      updateStreak({ col, row });
      if (streak >= 4) {
        announceWinner({
          channel,
          winningSquares: [
            { col, row },
            { col: col - 1, row },
            { col: col - 2, row },
            { col: col - 3, row },
          ],
        });
        return true;
      }
    }
    // Reached the end of the row, reset streak
    resetStreak();
  }

  resetStreak();

  // Check for vertical connect 4s
  for (let col = 0; col < 7; col += 1) {
    for (let row = 0; row < 5; row += 1) {
      updateStreak({ col, row });
      if (streak >= 4) {
        announceWinner({
          channel,
          winningSquares: [
            { col, row },
            { col, row: row - 1 },
            { col, row: row - 2 },
            { col, row: row - 3 },
          ],
        });
        return true;
      }
    }
    // Reached the bottom row, reset streak
    resetStreak();
  }

  // Check for up-right diagonal connect 4s
  const upRightStartPositions = [
    { col: 0, row: 3 },
    { col: 0, row: 4 },
    { col: 1, row: 4 },
    { col: 2, row: 4 },
    { col: 3, row: 4 },
  ];

  let curRow;
  let curCol;
  for (const startPos of upRightStartPositions) {
    curRow = startPos.row;
    curCol = startPos.col;
    while (curRow < 5 && curCol >= 0) {
      updateStreak({ col: curCol, row: curRow });
      if (streak >= 4) {
        announceWinner({
          channel,
          winningSquares: [
            { row: curRow, col: curCol },
            { row: curRow - 1, col: curCol + 1 },
            { row: curRow - 2, col: curCol + 2 },
            { row: curRow - 3, col: curCol + 3 },
          ],
        });
        return true;
      }
      // Move up a column
      curCol -= 1;
      // Move right a row
      curRow += 1;
    }

    resetStreak();
  }

  // Check for down-right diagonal connect 4s
  const downRightStartPositions = [
    { col: 0, row: 1 },
    { col: 0, row: 0 },
    { col: 1, row: 0 },
    { col: 2, row: 0 },
    { col: 3, row: 0 },
  ];

  for (const startPos of downRightStartPositions) {
    curRow = startPos.row;
    curCol = startPos.col;
    while (curRow < 5 && curCol < 7) {
      updateStreak({ col: curCol, row: curRow });
      if (streak >= 4) {
        announceWinner({
          channel,
          winningSquares: [
            { row: curRow, col: curCol },
            { row: curRow - 1, col: curCol - 1 },
            { row: curRow - 2, col: curCol - 2 },
            { row: curRow - 3, col: curCol - 3 },
          ],
        });
        return true;
      }
      // Move down a column
      curCol += 1;
      // Move right a row
      curRow += 1;
    }

    resetStreak();
  }

  // There were no streaks of 4 colors
  return false;
}

module.exports = { checkWin };
