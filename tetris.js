// Constants
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const COLORS = [
    null,
    '#FF0D72', // I
    '#0DC2FF', // J
    '#0DFF72', // L
    '#F538FF', // O
    '#FF8E0D', // S
    '#FFE138', // T
    '#3877FF'  // Z
];

// Tetromino shapes
const SHAPES = [
    [],
    [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], // I
    [[2, 0, 0], [2, 2, 2], [0, 0, 0]], // J
    [[0, 0, 3], [3, 3, 3], [0, 0, 0]], // L
    [[4, 4], [4, 4]], // O
    [[0, 5, 5], [5, 5, 0], [0, 0, 0]], // S
    [[0, 6, 0], [6, 6, 6], [0, 0, 0]], // T
    [[7, 7, 0], [0, 7, 7], [0, 0, 0]]  // Z
];

// Game variables
let canvas = document.getElementById('gameCanvas');
let nextPieceCanvas = document.getElementById('nextPieceCanvas');
let ctx = canvas.getContext('2d');
let nextPieceCtx = nextPieceCanvas.getContext('2d');
let score = 0;
let level = 1;
let gameOver = false;
let dropCounter = 0;
let lastTime = 0;
let dropInterval = 1000;
let board = createBoard();
let piece = null;
let nextPiece = null;

// Set canvas sizes
canvas.width = COLS * BLOCK_SIZE;
canvas.height = ROWS * BLOCK_SIZE;
nextPieceCanvas.width = 4 * BLOCK_SIZE;
nextPieceCanvas.height = 4 * BLOCK_SIZE;

// Initialize game
function init() {
    board = createBoard();
    piece = createPiece();
    nextPiece = createPiece();
    score = 0;
    level = 1;
    gameOver = false;
    updateScore();
    draw();
    window.requestAnimationFrame(update);
}

// Create empty game board
function createBoard() {
    return Array(ROWS).fill().map(() => Array(COLS).fill(0));
}

// Create new piece
function createPiece() {
    const pieceType = Math.floor(Math.random() * 7) + 1;
    return {
        pos: {x: Math.floor(COLS / 2) - 2, y: 0},
        shape: SHAPES[pieceType],
        color: COLORS[pieceType]
    };
}

// Draw a single block
function drawBlock(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
}

// Draw the game board
function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw board
    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                drawBlock(ctx, x, y, COLORS[value]);
            }
        });
    });

    // Draw current piece
    if (piece) {
        piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    drawBlock(ctx, x + piece.pos.x, y + piece.pos.y, piece.color);
                }
            });
        });
    }

    // Draw next piece
    nextPieceCtx.fillStyle = '#34495e';
    nextPieceCtx.fillRect(0, 0, nextPieceCanvas.width, nextPieceCanvas.height);
    if (nextPiece) {
        nextPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    drawBlock(nextPieceCtx, x, y, nextPiece.color);
                }
            });
        });
    }
}

// Collision detection
function collide() {
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x] !== 0 &&
                (board[y + piece.pos.y] &&
                board[y + piece.pos.y][x + piece.pos.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

// Merge piece with board
function merge() {
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                board[y + piece.pos.y][x + piece.pos.x] = value;
            }
        });
    });
}

// Rotate piece
function rotate() {
    const shape = piece.shape;
    for (let y = 0; y < shape.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [shape[x][y], shape[y][x]] = [shape[y][x], shape[x][y]];
        }
    }
    shape.forEach(row => row.reverse());
    
    // Check collision after rotation and revert if necessary
    if (collide()) {
        shape.forEach(row => row.reverse());
        for (let y = 0; y < shape.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [shape[x][y], shape[y][x]] = [shape[y][x], shape[x][y]];
            }
        }
    }
}

// Move piece
function move(dir) {
    piece.pos.x += dir;
    if (collide()) {
        piece.pos.x -= dir;
    }
}

// Drop piece
function drop() {
    piece.pos.y++;
    if (collide()) {
        piece.pos.y--;
        merge();
        clearLines();
        piece = nextPiece;
        nextPiece = createPiece();
        piece.pos.y = 0;
        piece.pos.x = Math.floor(COLS / 2) - 2;
        
        if (collide()) {
            gameOver = true;
            alert('Game Over! Score: ' + score);
            init();
        }
    }
    dropCounter = 0;
}

// Hard drop
function hardDrop() {
    while (!collide()) {
        piece.pos.y++;
    }
    piece.pos.y--;
    drop();
}

// Clear completed lines
function clearLines() {
    let linesCleared = 0;
    
    outer: for (let y = board.length - 1; y >= 0; y--) {
        for (let x = 0; x < board[y].length; x++) {
            if (board[y][x] === 0) {
                continue outer;
            }
        }
        
        const row = board.splice(y, 1)[0].fill(0);
        board.unshift(row);
        linesCleared++;
        y++;
    }
    
    if (linesCleared > 0) {
        score += [40, 100, 300, 1200][linesCleared - 1] * level;
        level = Math.floor(score / 1000) + 1;
        dropInterval = Math.max(100, 1000 - (level - 1) * 100);
        updateScore();
    }
}

// Update score display
function updateScore() {
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
}

// Game loop
function update(time = 0) {
    if (!gameOver) {
        const deltaTime = time - lastTime;
        lastTime = time;
        dropCounter += deltaTime;
        
        if (dropCounter > dropInterval) {
            drop();
        }
        
        draw();
        requestAnimationFrame(update);
    }
}

// Event listeners
document.addEventListener('keydown', event => {
    if (!gameOver) {
        switch(event.keyCode) {
            case 37: // Left arrow
                move(-1);
                break;
            case 39: // Right arrow
                move(1);
                break;
            case 40: // Down arrow
                drop();
                break;
            case 38: // Up arrow
                rotate();
                break;
            case 32: // Space
                hardDrop();
                break;
        }
    }
});

// Start the game
init(); 