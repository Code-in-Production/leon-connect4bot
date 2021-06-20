const outdent = require('outdent');

const helpMessage = outdent`
	==========
	Hi, I'm the Power Connect-4 Bot!

	__How to play:__
	In Connect-4, players choose a color (red or yellow) and then take turns dropping colored discs into a seven-column, six-row vertically suspended grid. The pieces fall straight down, occupying the lowest available space within the column. The objective of the game is to be the first to form a horizontal, vertical, or diagonal line of four of one's own discs.  If a player cannot make any possible moves, the game ends in a draw.

	However, in Power Connect-4, you also get 3 special pieces:
	**Anvil** - A piece that clears an entire column and only leaves the anvil piece remaining (think of it as an anvil falling and crushing all the other pieces). The anvil piece then becomes a regular piece once it is in the board.
	**Spike** - A piece that destroys the next piece (special or non-special) that is placed in the same column as the spike, regardless of color. After it destroys a piece, it then becomes a regular piece.
	**Bomb** - A piece that when dropped in a column, destroys the bottom piece in the column, which causes all the other pieces to fall down a row. Once it is in the board, it becomes a regular piece.

	**Note:** All pieces except for the anvil can only be placed in a non-empty column.

	\`\`\`
	Commands:
	!help - Displays this message.
		!help board - Displays a help message for the board. 
		!help inventory - Displays a help message for the inventory. 
	!new - Starts a new Connect-4 game.
	!ready - Registers yourself as a player in the pending Connect-4 game.
	!board - Displays the current board state.
	!inventory - Displays your inventory.
	\`\`\`
`;

const inventoryHelpMessage = outdent`
	\`\`\`
	Your inventory contains the remaining pieces you have.

	Regular Pieces - The amount of regular pieces (i.e. non-special pieces) you have remaining.
	Anvil Pieces - The amount of anvil pieces you have remaining.
	Spike Pieces - The amount of spike pieces you have remaining.
	Bomb Pieces - The amount of bomb pieces you have remaining.
	\`\`\`
`;

const boardHelpMessage = outdent`
	\`\`\`
	The board consists of blank squares, red pieces, and yellow pieces. 
	
	The black squares represent the bottom of the board, and if a spike piece is active on a column, the black square for that column turns into a cactus until the spike is removed when a piece hits it.

	The blank squares are like air; any piece can fall through them.

	The board also has a series of numbers above it representing the column number. To drop a piece in a specific column, you press the button with the same column number as the column you wish the drop the piece into.
	\`\`\`
`;

module.exports = {
  helpMessage,
  boardHelpMessage,
  inventoryHelpMessage,
};
