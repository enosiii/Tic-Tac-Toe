function computerMove(cells, checkWinner, playSound) {
  let bestScore = -Infinity;
  let bestMove;

  // Evaluate all available moves
  for (let i = 0; i < cells.length; i++) {
    if (cells[i] === null) {
      cells[i] = 'x'; // Try the move
      let score = minimax(cells, 0, false, checkWinner); // Evaluate the move
      cells[i] = null; // Undo the move

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  // Make the best move
  if (bestMove !== undefined) {
    const cell = document.querySelector(`.cell[data-index="${bestMove}"]`);
    cell.click();
    playSound('tick'); // Play tick sound for computer's move
  }
}

function minimax(board, depth, isMaximizing, checkWinner) {
  // Check for a winner
  if (checkWinner('x')) {
    return 10 - depth; // Computer wins
  }
  if (checkWinner('o')) {
    return depth - 10; // Player wins
  }
  if (board.every(cell => cell !== null)) {
    return 0; // Draw
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = 'x'; // Try the move
        let score = minimax(board, depth + 1, false, checkWinner); // Recurse
        board[i] = null; // Undo the move
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = 'o'; // Try the move
        let score = minimax(board, depth + 1, true, checkWinner); // Recurse
        board[i] = null; // Undo the move
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

