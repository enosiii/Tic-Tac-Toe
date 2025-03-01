const board = document.getElementById('board');
const toggleFirstPlayerButton = document.getElementById('toggle-first-player');
const currentPlayerDisplay = document.getElementById('current-player');
const winnerBanner = document.getElementById('winner-banner');
const playAgainButton = document.getElementById('play-again');
const whoPlaysFirstSection = document.getElementById('who-plays-first');
const modeSelection = document.getElementById('mode-selection');
const twoPlayerModeButton = document.getElementById('two-player-mode');
const vsComputerModeButton = document.getElementById('vs-computer-mode');
const gameStatus = document.getElementById('game-status');
const turnStatus = document.getElementById('turn-status');
const changeModeButton = document.getElementById('change-mode');
const gameWinSound = document.getElementById('game-win-sound');
const gameOverSound = document.getElementById('game-over-sound');

let currentPlayer = 'o'; // 'o' or 'x'
let cells = Array(9).fill(null);
let markings = { o: [], x: [] };
let gameStarted = false;
let isVsComputer = false;

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Hide turn-status during page load
turnStatus.classList.add('hidden');

// Mode selection
twoPlayerModeButton.addEventListener('click', () => {
  isVsComputer = false;
  gameStatus.textContent = '2-Player Mode';
  startGame();
});

vsComputerModeButton.addEventListener('click', () => {
  isVsComputer = true;
  gameStatus.textContent = 'VS Computer Mode';
  startGame();
});

// Start game
function startGame() {
  modeSelection.classList.add('hidden');
  gameStatus.classList.remove('hidden');
  turnStatus.classList.remove('hidden'); // Show turn-status when the game starts
  updateTurnStatus();

  if (!isVsComputer) {
    whoPlaysFirstSection.classList.remove('hidden');
  } else {
    currentPlayer = 'o'; // Player always goes first in VS Computer mode
  }
  board.classList.remove('hidden');
}

// Toggle who plays first
toggleFirstPlayerButton.addEventListener('click', () => {
  currentPlayer = currentPlayer === 'o' ? 'x' : 'o';
  currentPlayerDisplay.textContent = currentPlayer.toUpperCase();
  toggleFirstPlayerButton.classList.toggle('o', currentPlayer === 'o');
  toggleFirstPlayerButton.classList.toggle('x', currentPlayer === 'x');
  updateTurnStatus(); // Update turn status when player changes
});

// Handle cell clicks
board.addEventListener('click', (e) => {
  const cell = e.target;
  const index = cell.getAttribute('data-index');

  if (cell.classList.contains('o') || cell.classList.contains('x')) return;

  // Hide "Who plays first?" section when the game starts
  if (!gameStarted) {
    whoPlaysFirstSection.classList.add('hidden');
    gameStarted = true;
  }

  // Add current player's mark
  cell.classList.add(currentPlayer);
  markings[currentPlayer].push(index);

  // Remove oldest mark if more than 3
  if (markings[currentPlayer].length > 3) {
    const oldestMark = markings[currentPlayer].shift();
    cells[oldestMark] = null;
    document.querySelector(`.cell[data-index="${oldestMark}"]`).classList.remove(currentPlayer);
  }

  cells[index] = currentPlayer;

  // Check for winner
  if (checkWinner(currentPlayer)) {
    const winnerMessage = isVsComputer
      ? currentPlayer === 'o' ? 'You Win!' : 'Computer Wins!'
      : `Player ${currentPlayer.toUpperCase()} Wins!`;
    highlightWinner(currentPlayer);
    winnerBanner.textContent = winnerMessage;
    winnerBanner.classList.remove('hidden');
    winnerBanner.classList.add(currentPlayer); // Set winner banner color
    playAgainButton.classList.remove('hidden');
    changeModeButton.classList.remove('hidden');
    board.classList.add('disabled'); // Disable the board
    turnStatus.classList.add('hidden'); // Hide turn-status when there is a winner

    // Play sound based on the winner and mode
    if (isVsComputer) {
      if (currentPlayer === 'o') {
        gameWinSound.play(); // Player wins
      } else {
        gameOverSound.play(); // Computer wins
      }
    } else {
      gameWinSound.play(); // Either player wins in 2-Player mode
    }

    return;
  }

  // Switch players
  currentPlayer = currentPlayer === 'o' ? 'x' : 'o';
  updateTurnStatus();

  // If playing against the computer, trigger its move after a delay
  if (isVsComputer && currentPlayer === 'x' && !checkWinner('o')) {
    setTimeout(computerMove, 1000); // 1-second delay
  }
});

// Play again button
playAgainButton.addEventListener('click', () => {
  resetGame();
});

// Change mode button
changeModeButton.addEventListener('click', () => {
  location.reload(); // Refresh the page to reset the game
});

// Check for winner
function checkWinner(player) {
  return winningCombinations.some(combination => {
    return combination.every(index => cells[index] === player);
  });
}

// Highlight winning cells
function highlightWinner(player) {
  winningCombinations.forEach(combination => {
    if (combination.every(index => cells[index] === player)) {
      combination.forEach(index => {
        document.querySelector(`.cell[data-index="${index}"]`).classList.add('winner');
      });
    }
  });
}

// Reset game
function resetGame() {
  cells = Array(9).fill(null);
  markings = { o: [], x: [] };
  document.querySelectorAll('.cell').forEach(cell => {
    cell.classList.remove('o', 'x', 'winner');
  });
  winnerBanner.classList.add('hidden');
  winnerBanner.classList.remove('o', 'x');
  playAgainButton.classList.add('hidden');
  changeModeButton.classList.add('hidden');
  if (!isVsComputer) {
    whoPlaysFirstSection.classList.remove('hidden');
  }
  board.classList.remove('disabled');
  gameStarted = false;
  currentPlayer = 'o'; // Reset to default starting player
  turnStatus.classList.remove('hidden'); // Show turn-status again when resetting the game
  updateTurnStatus();
}

// Update turn status
function updateTurnStatus() {
  if (isVsComputer) {
    if (currentPlayer === 'o') {
      turnStatus.textContent = 'Your Turn';
      turnStatus.classList.remove('x-turn');
      turnStatus.classList.add('o-turn');
    } else {
      turnStatus.textContent = 'Computer Turn';
      turnStatus.classList.remove('o-turn');
      turnStatus.classList.add('x-turn');
    }
  } else {
    if (currentPlayer === 'o') {
      turnStatus.textContent = 'O to Play';
      turnStatus.classList.remove('x-turn');
      turnStatus.classList.add('o-turn');
    } else {
      turnStatus.textContent = 'X to Play';
      turnStatus.classList.remove('o-turn');
      turnStatus.classList.add('x-turn');
    }
  }
}

