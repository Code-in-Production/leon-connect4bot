const pieceProto = {
  // No color means the piece is empty
  color: null,
};

function Piece(params) {
  const { color } = params ?? {};

  const piece = Object.create(pieceProto);

  piece.color = color ?? null;

  return piece;
}

module.exports = Piece;
