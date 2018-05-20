class Snake {
    constructor() {
        this.tail = new Array(3);
        this.score = 0;

        this.dir = {};

        this.score = 0;
        this.fitness = 0;
        this.dead = false;
        this.brain = new NeuralNetwork(5, 6, 3);

        this.reset();
    }

    reset(new_game="none") {
        if (new_game == "new_game") {
            this.tail = new Array(3);
            this.head = null;
            this.score = 0;
            this.fitness = 0;
        }

        this.head = tiles[randint(5, TILE_ROWS-5)][randint(5, TILE_COLS-5)];
        this.tail[0] = this.head;

        for (let tile = 1; tile<this.tail.length; tile++) {
            let i = this.tail[tile-1].row;
            let j = this.tail[tile-1].col;

            let choices = [-2, -1, 0, 1]
            if (tile != 1) {
                let tile_not_chosen = this.tail[tile-2];
                if (tile_not_chosen.row > i) {
                    choices.splice(0, 1);
                } else if (tile_not_chosen.row < i) {
                    choices.splice(2, 1);
                } else if (tile_not_chosen.col > j) {
                    choices.splice(1, 1);
                } else if (tile_not_chosen.col < j) {
                    choices.splice(3, 1);
                }
            }

            let dir = randchoice(choices);
            switch (dir) {
                // Left
                case -2:
                    this.tail[tile] = tiles[i+1][j];
                    break;

                // Down
                case -1:
                    this.tail[tile] = tiles[i][j+1];
                    break;

                // Right
                case 0:
                    this.tail[tile] = tiles[i-1][j];
                    break;

                // Down
                case 1:
                    this.tail[tile] = tiles[i][j-1];
                    break;

                default:
                    break;

            }
        }
        this.dir = {x: this.head.row - this.tail[1].row, y: this.head.col - this.tail[1].col};
    }

    setBrain(brain) {
        this.reset("new_game");
        this.brain = brain.copy();
    }

    draw() {
        for (let tile = this.tail.length - 1; tile>=0; tile--) {
            if (tile == 0) {
                ctx.fillStyle = 'red';
            } else {
                ctx.fillStyle = 'green';
            }
            ctx.fillRect(this.tail[tile].x+1, this.tail[tile].y+1, TILE_WIDTH-2, TILE_WIDTH-2);
        }
    }

    ate() {
        return (this.head == food.spot);
    }

    inTail() {
        for (let i = this.tail.length - 1; i>=0; i--) {
            for (let j = this.tail.length - 1; j>=0; j--) {
                if (i == j) continue;

                if (this.tail[i] == this.tail[j]) return true;
            }
        }

        return false;
    }

    move(movement) {
        // 0 - straight, 1-left 2-right
        let temp =this.dir.x;
        switch (movement) {
            case 0:
                break;
            case 1:
                this.dir.x = this.dir.y;
                this.dir.y = -temp;

                break;
            case 2:
                this.dir.x = -this.dir.y;
                this.dir.y = temp;

                break;

        }
    }

    think() {
        let centre = {x: this.head.x + TILE_WIDTH/2, y: this.head.y + TILE_WIDTH/2};
        let inputs = [];
        // Distance to walls, food
        // top wall
        inputs[0] = dist(centre.x, centre.y, centre.x, 0) / HEIGHT;
        // bottom wall
        inputs[1] = dist(centre.x, centre.y, centre.x, WIDTH) / HEIGHT;
        // left wall
        inputs[2] = dist(centre.x, centre.y, 0, centre.y) / WIDTH;
        // right wall
        inputs[3] = dist(centre.x, centre.y, WIDTH, centre.y) / WIDTH;
        // food
        inputs[4] = dist(centre.x, centre.y, food.centre.x, food.centre.y);

        // FINDING BIGGEST DISTANCE POSSIBLE OF FOOD FROM WALL TO NORMALIZE
        let max_x = food.centre.x > WIDTH / 2 ? 0 : WIDTH;
        let max_y = food.centre.y > HEIGHT / 2 ? 0 : HEIGHT;
        inputs[4] = inputs[4] / dist(food.centre.x, food.centre.y, max_x, max_y);

        // console.log(this.dir)
        let outputs = this.brain.predict(inputs);
        this.move(outputs.indexOf(outputs.max()));
        // console.log("OUTPUTS ARE")
        // console.log(outputs)
    }

    update() {
        // DIRECTIA
        // Stanga sau dreapta


        // console.log(this.dir);

        let new_row = this.head.row+this.dir.x;
        let new_col = this.head.col+this.dir.y;

        if ((new_row == -1 || new_row == TILE_ROWS || new_col == -1 || new_col == TILE_COLS)
            || this.tail.indexOf(tiles[new_row][new_col]) != -1
            || this.score <= -15
            ) {
            this.dead = true;
            food.newSpot();

            if (++currentSnake >= TOTAL_SNAKES) {
                currentPopulation++;
                nextGeneration();
                currentSnake = 0;
            }

            return;
        }

        let oldDist = dist(this.head.x, this.head.y, food.centre.x, food.centre.y);
        this.head = tiles[new_row][new_col];

        this.tail.unshift(this.head);
        this.tail.splice(this.tail.length-1, 1);

        let newDist = dist(this.head.x, this.head.y, food.centre.x, food.centre.y);

        this.score = oldDist > newDist ? this.score + 1 : this.score - 10;
    }
}
