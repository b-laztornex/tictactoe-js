let board = Array(9).fill(null);
let xIsNext = true;
let gameActive = true;
let historyStack = [board.slice()];
const LEADERBOARD_KEY = "theLeaderboard";

// Initialaze variables for the settings
let gameMode = "human-vs-human";
let difficultyLevel = "easy";

// Define the plater object containing name and avatar
let player1 = { name: "", avatar: "" };
let player2 = { name: "", avatar: "" };

// List of names to be pick randomly for the computer player
const linuxNames = [
  "Ubuntu",
  "Fedora",
  "Debian",
  "Arch",
  "Mint",
  "openSUSE",
  "Manjaro",
  "Solus",
  "Gentoo",
  "CentOS",
  "RedHat",
  "Kali",
  "Elementary",
  "Zorin",
  "Peppermint",
];

// All the referents to the elements
const statusDiv = document.getElementById("status");
const newGameButton = document.getElementById("new-game");
const cells = document.querySelectorAll(".cell");
const setupContainer = document.getElementById("setup-container");
const gameModeSelect = document.getElementById("game-mode");
const difficultyContainer = document.getElementById("computer-difficulty");
const difficultySelect = document.getElementById("difficulty-level");
const startGameButton = document.getElementById("start-game");
const player1NameInput = document.getElementById("player1-name");
const player2NameInput = document.getElementById("player2-name");
const player1AvatarImg = document.getElementById("player1-avatar");
const player1DisplayName = document.getElementById("player1-display-name");
const player2AvatarImg = document.getElementById("player2-avatar");
const player2DisplayName = document.getElementById("player2-display-name");
const player2Setup = document.getElementById("player2-setup");
const leaderboardList = document.getElementById("leaderboard");

// Calling the api dicebar url with a seed to generate and get an avatar icon
function setPlayerAvatar(playerName) {
  return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(
    playerName
  )}`;
}

// Using the board array, create the game boar
function renderBoard() {
  cells.forEach((cell) => {
    const index = parseInt(cell.dataset.index, 10);
    cell.textContent = board[index] ? board[index] : "";
    cell.classList.remove("clicked");
  });
}

function renderStatus() {
  const winner = calculateWinner(board);
  if (winner) {
    const winName =
      winner === "X"
        ? player1.name || "Player 1"
        : player2.name || "Player 2/Computer";

    statusDiv.textContent = `Winner: ${winner}`;
    gameActive = false;

    const winAvatar = winner === "X" ? player1.avatar : player2.avatar;
    updateLeaderboard(winName, winAvatar);
    showWinnerOverlay(winName);
  } else if (board.every((cell) => cell !== null)) {
    statusDiv.textContent = "It's a draw!";
    gameActive = false;
  } else {
    statusDiv.textContent = `Next player: ${xIsNext ? "X" : "O"}`;
  }
}

// Also calculate on winning lines a posible winner
function calculateWinner(b) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let [a, bIndex, c] of lines) {
    if (b[a] && b[a] === b[bIndex] && b[a] === b[c]) {
      return b[a];
    }
  }
  return null;
}

// To make the back button works the current state is pushed into the history
function pushGameState() {
  historyStack.push(board.slice());
  window.history.pushState({ board: board.slice(), xIsNext }, "");
}

window.addEventListener("popstate", (event) => {
  if (event.state) {
    board = event.state.board;
    xIsNext = event.state.xIsNext;
    gameActive = true;
    historyStack.pop();
    renderBoard();
    renderStatus();
  }
});

function getLeaderboard() {
  const data = localStorage.getItem(LEADERBOARD_KEY);
  return data ? JSON.parse(data) : [];
}

function saveLeaderboard(leaderboard) {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
}

function updateLeaderboard(winnerName, winnerAvatar) {
  const leaderboard = getLeaderboard();
  let entry = leaderboard.find((e) => e.name === winnerName);
  if (entry) {
    entry.wins += 1;
  } else {
    leaderboard.push({ name: winnerName, wins: 1, avatar: winnerAvatar });
  }
  leaderboard.sort((a, b) => b.wins - a.wins);
  saveLeaderboard(leaderboard);
  showLeaderboard();
}

function showLeaderboard() {
  leaderboardList.innerHTML = "";
  const leaderboard = getLeaderboard();
  leaderboard.forEach((entry) => {
    const li = document.createElement("li");
    const img = document.createElement("img");
    img.src = entry.avatar;
    img.alt = entry.name;
    li.appendChild(img);
    const span = document.createElement("span");
    span.textContent = `${entry.name}: ${entry.wins} win(s)`;
    li.appendChild(span);
    leaderboardList.appendChild(li);
  });
}

function handleMove(i) {
  if (!gameActive || board[i]) return;

  board[i] = xIsNext ? "X" : "O";
  const cellElement = document.querySelector(`.cell[data-index="${i}"]`);
  if (cellElement) {
    cellElement.classList.add("clicked");
    setTimeout(() => cellElement.classList.remove("clicked"), 300);
  }

  pushGameState();
  xIsNext = !xIsNext;
  renderBoard();
  renderStatus();

  if (gameMode === "human-vs-computer" && gameActive && !xIsNext) {
    setTimeout(computerMove, 500);
  }
}

function computerMove() {
  if (difficultyLevel === "easy") {
    const emptyCells = board
      .map((value, index) => (value === null ? index : null))
      .filter((val) => val !== null);
    if (emptyCells.length === 0) return;
    const randomIndex =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    handleMove(randomIndex);
  } else if (difficultyLevel === "nightmare") {
    const bestMoveObj = getBestMove(board.slice(), "O");
    if (bestMoveObj && bestMoveObj.index !== undefined) {
      handleMove(bestMoveObj.index);
    }
  }
}

function showWinnerOverlay(winnerName) {
  const overlay = document.getElementById("winner-overlay");
  const title = document.getElementById("winner-title");
  title.innerHTML = "";
  const message = `Winner: ${winnerName}`;
  for (let char of message) {
    const span = document.createElement("span");
    span.textContent = char;
    title.appendChild(span);
  }

  overlay.classList.remove("hidden");
  setTimeout(() => {
    overlay.classList.add("hidden");
  }, 3000);
}

/*
// Minimax Algorithm for Nightmare Difficulty
// https://www.neverstopbuilding.com/blog/minimax
*/

function getBestMove(newBoard, player) {
  const opponent = player === "O" ? "X" : "O";
  const winner = calculateWinner(newBoard);
  if (winner === "O") return { score: 10 };
  if (winner === "X") return { score: -10 };
  if (newBoard.every((cell) => cell !== null)) return { score: 0 };

  const moves = [];
  newBoard.forEach((cell, index) => {
    if (cell === null) {
      const move = { index: index };
      newBoard[index] = player;
      const result = getBestMove(newBoard, opponent);
      move.score = result.score;
      newBoard[index] = null;
      moves.push(move);
    }
  });

  let bestMove;
  let bestScore;
  if (player === "O") {
    // Maximizing for computer
    bestScore = -Infinity;
    moves.forEach((move) => {
      if (move.score > bestScore) {
        bestScore = move.score;
        bestMove = move.index;
      }
    });
  } else {
    // Minimizing for opponent
    bestScore = Infinity;
    moves.forEach((move) => {
      if (move.score < bestScore) {
        bestScore = move.score;
        bestMove = move.index;
      }
    });
  }
  return { index: bestMove, score: bestScore };
}

cells.forEach((cell) => {
  cell.addEventListener("click", () => {
    const index = parseInt(cell.dataset.index, 10);
    if (
      gameMode === "human-vs-human" ||
      (gameMode === "human-vs-computer" && xIsNext)
    ) {
      handleMove(index);
    }
  });
});

newGameButton.addEventListener("click", () => {
  board = Array(9).fill(null);
  xIsNext = true;
  gameActive = true;
  historyStack = [board.slice()];
  window.history.pushState({ board: board.slice(), xIsNext }, "");
  renderBoard();
  renderStatus();
});

gameModeSelect.addEventListener("change", () => {
  gameMode = gameModeSelect.value;
  difficultyContainer.style.display =
    gameMode === "human-vs-computer" ? "block" : "none";

  player2Setup.style.display =
    gameMode === "human-vs-computer" ? "none" : "block";
});

difficultySelect.addEventListener("change", () => {
  difficultyLevel = difficultySelect.value;
});

startGameButton.addEventListener("click", () => {
  player1.name =
    document.getElementById("player1-name").value.trim() || "Player 1";
  let p2Name = document.getElementById("player2-name").value.trim();
  if (!p2Name) {
    // pick a random Linux distro name for player 2 a.k.a pc
    const randIndex = Math.floor(Math.random() * linuxNames.length);
    player2.name = linuxNames[randIndex];
  } else {
    player2.name = p2Name;
  }

  // Set avatars based on names using DiceBear
  // https://www.dicebear.com/styles/big-ears-neutral/
  player1.avatar = setPlayerAvatar(player1.name);
  player2.avatar = setPlayerAvatar(player2.name);

  // Update the info panels
  player1AvatarImg.src = player1.avatar;
  player1DisplayName.textContent = player1.name;
  player2AvatarImg.src = player2.avatar;
  player2DisplayName.textContent = player2.name;

  setupContainer.style.display = "none";
  document.getElementById("game-container").style.display = "block";
  renderBoard();
  renderStatus();
});

// main listener on page Load
document.addEventListener("DOMContentLoaded", () => {
  gameMode = gameModeSelect.value;
  difficultyLevel = difficultySelect.value;
  setupContainer.style.display = "block";
  document.getElementById("game-container").style.display = "none";
  renderBoard();
  renderStatus();
});
