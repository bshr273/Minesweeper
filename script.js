// Initializing variables to hold game configuration and state
var board = [];
var rows = 8;
var columns = 8;
var minesCount = 10;
var minesLocation = [];
var tilesClicked = 0;
var flagEnabled = false;
var gameOver = false;

// Call the function to start the game when the window loads
window.onload = function() {
    startGame();
}

// Function to randomly set mines on the board
function setMines() {
    let minesLeft = minesCount;
    while (minesLeft > 0) { 
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        // Only set the mine if it hasn't already been set
        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}

// Function to start the game by creating the board, setting the mines, and adding event listeners
function startGame() {
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);
    setMines();

    // Create a 2D array to hold the board and add event listeners to each tile
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    console.log(board); // Log the board to the console for testing purposes
}

// Function to toggle the flag mode on/off
function setFlag() {
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    }
    else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}

// Function to handle the click event on each tile
function clickTile() {
    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }

    let tile = this;

    // If the flag mode is enabled, toggle the flag on/off
    if (flagEnabled) {
        if (tile.innerText == "") {
            tile.innerText = "🚩";
        }
        else if (tile.innerText == "🚩") {
            tile.innerText = "";
        }
        return;
    }

    // If the clicked tile contains a mine, end the game
    if (minesLocation.includes(tile.id)) {
        gameOver = true;
        revealMines();
        return;
    }

    // Otherwise, check the tile for nearby mines
    let coords = tile.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);
}

// Function to reveal all mines when the game ends
function revealMines() {
    for (let r= 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";                
            }
        }
    }
}

function checkMine(r, c) {
    // Recursive function to check adjacent tiles for mines
    if (r < 0 || r >= rows || c < 0 || c >= columns) {  // Out of bounds
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {  // Already clicked
        return;
    }

    // Mark tile as clicked and increment tilesClicked counter
    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;

    // Check adjacent tiles for mines and update minesFound counter
    let minesFound = 0;
    minesFound += checkTile(r-1, c-1);
    minesFound += checkTile(r-1, c);
    minesFound += checkTile(r-1, c+1);
    minesFound += checkTile(r, c-1);
    minesFound += checkTile(r, c+1);
    minesFound += checkTile(r+1, c-1);
    minesFound += checkTile(r+1, c);
    minesFound += checkTile(r+1, c+1);

    // If there are any adjacent mines, update the tile text and class
    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    }
    else {  // Otherwise, recursively check adjacent tiles for mines
        checkMine(r-1, c-1);
        checkMine(r-1, c);
        checkMine(r-1, c+1);
        checkMine(r, c-1);
        checkMine(r, c+1);
        checkMine(r+1, c-1);
        checkMine(r+1, c);
        checkMine(r+1, c+1);
    }

    // Check if all non-mine tiles have been clicked and end the game if so
    if (tilesClicked == rows * columns - minesCount) {
        document.getElementById("mines-count").innerText = "Cleared";
        gameOver = true;
    }
}
function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {  // Check if tile is out of bounds
        return 0;
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {  // Check if tile is a mine
        return 1;
    }
    return 0;
}