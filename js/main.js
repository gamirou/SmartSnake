// Game
let canvas, ctx;
let WIDTH, HEIGHT;
const TOTAL_SNAKES = 50;
const BEST_SNAKES = 6;

let currentSnake = 0;
let currentPopulation = 0;

let paused = false;
let frames = 0;

// It is used to draw pause screen only once to save memory
let pausedDraw = false;
let maxFrames = 50;

// Tiles
let TILE_WIDTH;
const TILE_ROWS = 20;
const TILE_COLS = 20;
let tiles = create2DArray(TILE_COLS, TILE_ROWS);

// Entities
let food;
let snakes = [];

// HTML reference to the debug slider
let slider;

function init() {
    canvas = document.getElementById('c');
    ctx = canvas.getContext('2d');

    WIDTH = canvas.width;
    HEIGHT = canvas.height;

    // Initializing tiles
    TILE_WIDTH = canvas.width / tiles.length;

    for (let i=0; i<TILE_ROWS; i++) {
        for (let j=0; j<TILE_COLS; j++) {
            tiles[i][j] = new Tile(i, j);
        }
    }

    // Initializing snakes
    for (let i=0; i<TOTAL_SNAKES; i++) {
        snakes[i] = new Snake();
    }

    // Pause event
    canvas.addEventListener("mousedown", function(event) {
        paused = !paused;
        pausedDraw = true;
    });

    food = new Food();
    slider = document.getElementById("myRange");

    slider.oninput = function() {
        maxFrames = this.value;
    }

    draw();
}

function draw() {
    window.requestAnimationFrame(draw);
    // for(let i = 0; i < 5; i++) {
    //     console.log(snakes[i].brain)
    // }

    if (frames >= maxFrames && !paused) {
        // Drawing and clearing background
        ctx.beginPath();
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.closePath();

        // Background
        ctx.fillStyle='black';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        snakes[currentSnake].think();
        snakes[currentSnake].draw();
        snakes[currentSnake].update();

        food.draw();

        // If food is eaten
        if (snakes[currentSnake].ate()) {
            snakes[currentSnake].score += 100;
            // Instead of making a new object, it only changes its position
            food.newSpot();
            let last_tail = snakes[currentSnake].tail[snakes[currentSnake].tail.length-1];
            snakes[currentSnake].tail.push(tiles[last_tail.row + snakes[currentSnake].dir.x][last_tail.col + snakes[currentSnake].dir.y]);
            console.log("FOOD EATEN")
        }

        updateHTML();
        frames = 0;

    } else if (paused && pausedDraw) {
        // Drawing and clearing background
        ctx.beginPath();
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.closePath();

        ctx.fillStyle='black';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        snakes[currentSnake].draw();
        food.draw();

        text("PAUSED", WIDTH/2, HEIGHT/2, "white", "center", 100);
        text("Click screen to resume!", WIDTH/2, HEIGHT/2 + 150, "white", "center", 30);

        pausedDraw = false;
    }

    frames++;
}

/**
 * It updates debug stats
 * @return {void}
 */
function updateHTML() {
    let paragraphs = document.getElementsByTagName("P");
    paragraphs[0].innerHTML = "Snake Number: " + currentSnake;
    paragraphs[1].innerHTML = "Generation Number: " + currentPopulation;
    paragraphs[2].innerHTML = "Snake Fitness: " + snakes[currentSnake].score;
}

/************************************
*             UTILITY               *
************************************/


/**
 * Creates an empty 2D array
 * @param  {Integer} lenI Number of columns
 * @param  {Integer} lenJ Number of rows (optional if lenI != lenJ)
 * @return {Array}       Returns the array
 */
function create2DArray(lenI, lenJ) {
    let x = new Array(lenI);

    if (lenJ) {
        for (let i = 0; i < lenI; i++) {
            x[i] = new Array(lenJ);
        }
    } else {
        for (let i = 0; i < lenI; i++) {
            x[i] = new Array(lenI);
        }
    }
    return x;
}

/**
 * Returns a random number
 * @param  {Number} min Lower bound
 * @param  {Number} max Upper bound
 * @return {Number}     Usually, it returns a float
 */
function random(min, max) {
    return Math.random() * (max - min + 1) + min;
}

/**
 * Returns a random integer
 * @param  {Number} min Lower bound
 * @param  {Number} max Upper bound
 * @return {Number}     Returns an integer
 */
function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a random item from array
 * @param  {Array} arr         The array given
 * @param  {Number} [offset=0] It lowers the range b yfirst and last "offset" items
 * @return {any type}          Returns the random item
 */
function randchoice(arr, offset = 0) {
    return arr[randint(offset, arr.length - 1 - offset)];
}

/**
Displays text with a given position, align and the size
 * @param  {String} t         Text given
 * @param  {Number} x         X coordinate
 * @param  {Number} y         Y coordinate
 * @param  {String} c         Colour of the text
 * @param  {String} align     Horizontal alignment
 * @param  {Number} [size=25] Font size
 * @return {void}
 */
function text(t, x, y, c, align, size = 25) {
    if (align) ctx.textAlign = align;
    ctx.font = "bold " +size+"px Arial";
    ctx.fillStyle = c;
    ctx.fillText(t,x,y);
}

/**
 * Returns the distance between two points
 * @param  {Number} x1 X coordinate of first point
 * @param  {Number} y1 Y coordinate of first point
 * @param  {Number} x2 X coordinate of second point
 * @param  {Number} y2 Y coordinate of second point
 * @return {Number}    Distance between two points
 */
function dist(x1, y1, x2, y2) {
    return (Math.sqrt((x1-x2) ** 2 + (y1-y2) ** 2))
}

/**
 * Returns maximum number from array
 * @return {Number} The maximum namber
 */
Array.prototype.max = function() {
    return Math.max.apply(null, this);
};

/**
 * Returns minimum number from array
 * @return {Number} The minimum namber
 */
Array.prototype.min = function() {
    return Math.min.apply(null, this);
};
