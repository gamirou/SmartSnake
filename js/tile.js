class Tile {
    constructor(x_index, y_index) {
        this.row = x_index;
        this.col = y_index;

        this.x = x_index * TILE_WIDTH;
        this.y = y_index * TILE_WIDTH;
    }
}
