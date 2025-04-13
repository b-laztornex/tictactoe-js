# Tic Tac Toe - Limited Edition

    This is a simple js+Html+Css Tic Tac Toe game. The application allows players to select the game mode (Human vs Human or Human vs Computer), enter their names, and automatically generate avatar images based on the player names using DiceBear's Pixel Art API. When playing Human vs Computer, if Player 2's name is left blank, a random name is chosen from a list of Linux distributions. The game screen shows the player info panels on the left and right (each with an avatar and name) with the Tic Tac Toe board in the center. A leaderboard is displayed next to the board, showing each player's avatar, name, and win count, with wins stored in local storage.

## Features

- **Game Mode Selection:**  
   Choose between Human vs Human and Human vs Computer.

- **Difficulty Selection for Computer Opponent:**  
   In Human vs Computer mode, choose between "Easy Cake" (random moves) and "Nightmare" (unbeatable via minimax algorithm).

- **Player Setup:**  
   Enter player names. Avatars are automatically generated from the entered names using the DiceBear Pixel Art API.  
   For example:  
   `https://api.dicebear.com/9.x/pixel-art/svg?seed=Sandra`  
   If Player 2’s name is omitted (in computer mode), a random Linux distribution name is selected.

- **Game Screen Layout:**

  - Left Panel: Displays Player 1’s avatar and name.
  - Center: Displays the Tic Tac Toe board with smooth animations and game status.
  - Right Panel: Displays a leaderboard with each player’s avatar, name, and number of wins.

- **History Support:**

  - The game state is saved using the HTML5 History API, allowing you to use the browser’s back button to undo moves.

- **Local Storage Leaderboard:**

  - The leaderboard persists between sessions, with each win updating the player's score in local storage.

- **Lets Play!!!:**
  - Open index.html directly in your web browser. (!!!Note: Some features like the History API might work best using a local server)
