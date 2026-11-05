
let board = document.getElementById("board");
let piecesBox = document.getElementById("pieces");
let scoreText = document.getElementById("score");
let message = document.getElementById("message");

let grid = [];
let score = 0;
let selectedBlock = null;
let gameOver = false;

let shapes = [
    [[0,0]],
    [[0,0],[0,1]],
    [[0,0],[0,1],[0,2]],
    [[0,0],[1,0],[1,1]],
    [[0,0],[0,1],[1,0],[1,1]],
    [[0,0],[1,0],[2,0]],
    [[0,0],[0,1],[0,2],[0,3]]
];

// Create the board
function createBoard() {
    board.innerHTML = "";

    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
            let cell = document.createElement("div");
            cell.className = "cell";

            if (grid[r][c] == 1) {
                cell.classList.add("filled");
            }

            cell.onclick = function() {
                placeBlock(r, c);
            };

            board.appendChild(cell);
        }
    }
}

// Create blocks
function createPieces() {
    piecesBox.innerHTML = "";

    for (let i = 0; i < 3; i++) {
        let shape = shapes[Math.floor(Math.random() * shapes.length)];

        let piece = document.createElement("div");
        piece.className = "piece";

        piece.onclick = function() {
            if (gameOver) return;

            selectedBlock = shape;

            document.querySelectorAll(".piece").forEach(p => {
                p.classList.remove("selected");
            });

            piece.classList.add("selected");
            message.innerText = "Click on the board to place your block.";
        };

        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                let small = document.createElement("div");
                small.className = "small";

                if (shape.some(p => p[0] == r && p[1] == c)) {
                    small.classList.add("active");
                }

                piece.appendChild(small);
            }
        }

        piece.dataset.shape = JSON.stringify(shape);
        piecesBox.appendChild(piece);
    }
}

// Check if block can fit
function canPlace(r, c, shape) {
    for (let p of shape) {
        let row = r + p[0];
        let col = c + p[1];

        if (row >= 10 || col >= 10) return false;
        if (grid[row][col] == 1) return false;
    }

    return true;
}

// Place a block
function placeBlock(r, c) {
    if (gameOver) return;

    if (selectedBlock == null) {
        message.innerText = "Choose a block first.";
        return;
    }

    if (!canPlace(r, c, selectedBlock)) {
        message.innerText = "You cannot place the block there.";
        return;
    }

    for (let p of selectedBlock) {
        grid[r + p[0]][c + p[1]] = 1;
    }

    score += selectedBlock.length;
    scoreText.innerText = score;

    selectedBlock = null;

    clearLines();
    createBoard();
    createPieces();
    checkGameOver();

    if (!gameOver) {
        message.innerText = "Choose another block.";
    }
}

// Clear full rows and columns
function clearLines() {
    let rows = [];
    let cols = [];

    for (let r = 0; r < 10; r++) {
        if (grid[r].every(x => x == 1)) {
            rows.push(r);
        }
    }

    for (let c = 0; c < 10; c++) {
        let full = true;

        for (let r = 0; r < 10; r++) {
            if (grid[r][c] == 0) full = false;
        }

        if (full) cols.push(c);
    }

    rows.forEach(r => {
        for (let c = 0; c < 10; c++) grid[r][c] = 0;
    });

    cols.forEach(c => {
        for (let r = 0; r < 10; r++) grid[r][c] = 0;
    });

    score += (rows.length + cols.length) * 10;
    scoreText.innerText = score;
}

// Check for game over
function checkGameOver() {
    let pieces = document.querySelectorAll(".piece");
    let canMove = false;

    for (let piece of pieces) {
        let shape = JSON.parse(piece.dataset.shape);

        for (let r = 0; r < 10; r++) {
            for (let c = 0; c < 10; c++) {
                if (canPlace(r, c, shape)) {
                    canMove = true;
                }
            }
        }
    }

    if (!canMove) {
        gameOver = true;
        message.innerText = "Game Over! Your score is " + score;
    }
}

// Start a new game
function startGame() {
    grid = [];

    for (let r = 0; r < 10; r++) {
        grid.push(Array(10).fill(0));
    }

    score = 0;
    selectedBlock = null;
    gameOver = false;

    scoreText.innerText = score;
    message.innerText = "Select a block to play.";

    createBoard();
    createPieces();
}

// Start game when page opens
startGame();
