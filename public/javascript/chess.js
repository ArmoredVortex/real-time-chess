const board = document.querySelector('chess-board');
const game = new Chess();

const highlightStyles = document.createElement('style');
document.head.append(highlightStyles);
const whiteSquareGrey = '#a9a9a9';
const blackSquareGrey = '#696969';

function removeGreySquares() {
  highlightStyles.textContent = '';
}

function greySquare(square) {
  const highlightColor = (square.charCodeAt(0) % 2) ^ (square.charCodeAt(1) % 2)
      ? whiteSquareGrey
      : blackSquareGrey;
  
  highlightStyles.textContent += `
    chess-board::part(${square}) {
      background-color: ${highlightColor};
    }
  `;
}

board.addEventListener('drag-start', (e) => {
  const {source, piece} = e.detail;

  // do not pick up pieces if the game is over
  if (game.game_over()) {
    e.preventDefault();
    return;
  }

  // or if it's not that side's turn
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    e.preventDefault();
    return;
  }
});

board.addEventListener('drop', (e) => {
  const {source, target, setAction} = e.detail;

  removeGreySquares();

  // see if the move is legal
  const move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  if (move === null) {
    setAction('snapback');
  }
});

board.addEventListener('mouseover-square', (e) => {
  const {square, piece} = e.detail;

  // get list of possible moves for this square
  const moves = game.moves({
    square: square,
    verbose: true
  });

  // exit if there are no moves available for this square
  if (moves.length === 0) {
    return;
  }

  // highlight the square they moused over
  greySquare(square);

  // highlight the possible squares for this piece
  for (const move of moves) {
    greySquare(move.to);
  }
});

board.addEventListener('mouseout-square', (e) => {
  removeGreySquares();
});

board.addEventListener('snap-end', (e) => {
  board.setPosition(game.fen())
  socket.emit('move', game.fen())
});