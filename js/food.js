class Food {
    constructor() {
        this.newSpot();
    }

    newSpot() {
        let rows = new Array(TILE_ROWS);
        let cols = new Array(TILE_COLS);

        let row = 0;
        let col = 0;

        let snake = snakes[currentSnake];

        for (let i = 0; i < rows.length; i++) {
            rows[i] = i;
            cols[i] = i;
        }

        let in_snake = true;

        while (in_snake) {
            row = randchoice(rows);
            col = randchoice(cols);

            for (let i = 0; i < snake.tail.length; i++) {
                let tile = snake.tail[i];
                if (tile.row == row && tile.col == col) {
                    rows.splice(rows.indexOf(row), 1);
                    cols.splice(cols.indexOf(col), 1);
                    break;
                } else if (i == snake.tail.length - 1) {
                    in_snake = false;
                }
            }
        }

        this.spot = tiles[row][col];
        this.centre = {x: this.spot.x + TILE_WIDTH/2, y: this.spot.y + TILE_WIDTH/2};
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = "aqua";
        ctx.arc(this.spot.x+TILE_WIDTH/2, this.spot.y+TILE_WIDTH/2, TILE_WIDTH/2-5, 0, 2*Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}
