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

let slider;

function init() {
    canvas = document.getElementById('c');
    ctx = canvas.getContext('2d');

    WIDTH = canvas.width;
    HEIGHT = canvas.height;

    TILE_WIDTH = canvas.width / tiles.length;

    for (let i=0; i<TILE_ROWS; i++) {
        for (let j=0; j<TILE_COLS; j++) {
            tiles[i][j] = new Tile(i, j);
        }
    }

    for (let i=0; i<TOTAL_SNAKES; i++) {
        snakes[i] = new Snake();
    }

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

        ctx.fillStyle='white';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        snakes[currentSnake].think();
        snakes[currentSnake].draw();
        snakes[currentSnake].update();

        food.draw();

        if (snakes[currentSnake].ate()) {
            snakes[currentSnake].score += 100;
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

function updateHTML() {
    let paragraphs = document.getElementsByTagName("P");
    paragraphs[0].innerHTML = "Snake Number: " + currentSnake;
    paragraphs[1].innerHTML = "Genertion Number: " + currentPopulation;
    paragraphs[2].innerHTML = "Snake Fitness: " + snakes[currentSnake].score;
}


// UTILITY
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


function random(min, max) {
    return Math.random() * (max - min + 1) + min;
}

// Inclusive
function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Inclusive
function randchoice(arr, offset = 0) {
    return arr[randint(offset, arr.length - 1 - offset)];
}

/*
Displays text with a given position, align and the size
*** t - {String} - The text
*** x, y - {Number} - X and y coordinates
*** c - {String} - Colour of the text
*** align - {String} - It aligns the text to center, left etc.
*** size - {Number} - Size of the text
*/
function text(t, x, y, c, align, size = 25) {
    if (align) ctx.textAlign = align;
    ctx.font = "bold " +size+"px Arial";
    ctx.fillStyle = c;
    ctx.fillText(t,x,y);
}

function dist(x1, y1, x2, y2) {
    return (Math.sqrt((x1-x2) ** 2 + (y1-y2) ** 2))
}

Array.prototype.max = function() {
    return Math.max.apply(null, this);
};

Array.prototype.min = function() {
    return Math.min.apply(null, this);
};
