'use strict';

/* I wanted to make a more sophisticated tiling system so that I could separate
 * visual from logical tiles. I also wanted to make use of my own tile sets for
 * visuals - instead of manually picking what image goes into what tile, I
 * wanted to make that an automatic process. Finally, I wanted to tag advantage
 * of the original positioning of the tilemap to optimize collision search. */
class Tilemap {
    /* Takes a map of tiles and a tilesize (the size of each tile in pixels).
     * This only works with square tiles. */
    constructor(map, tilesize) {
        this.map = map;
        this.tilesize = tilesize;

        /* Easier to type. */
        this.rows = map.length;
        this.cols = map[0].length;

        /* Easier to create a camera for each tilemap (tilemaps are really just
         * levels or the representation of the game world)
         */
        this.camera = new Camera(this.rows, this.cols, this.tilesize);
        
        /* TODO: Initialize the visual map by collecting references to the
         * original sprite sheet. Depending on neigboring tiles, pick a
         * different image from the sprite sheet. */
        this.visualMap = [];
        /* TODO: turn into 2d array or configure raster order for better
         * searching (instead of doing O(n) search on collisions) */
        this.logicalMap = [];

        /* Reference to a player object */
        this.player = undefined;

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                let actual = createVector(col * this.tilesize, row * this.tilesize);

                /* Parse the tiles */
                switch (this.map[row][col]) {
                /* Walls */
                case 'w':
                    /* TODO: add to the visual map */
                    this.logicalMap.push(new Entity(actual.x, actual.y, this.tilesize));
                    break;

                /* Player character */
                case 'p':
                    this.player = new Player(actual.x, actual.y, this.tilesize);
                    this.camera.setPos(actual.x, actual.y);
                    break;
                }
            }
        }
    }

    /* Convert x and y values to a grid position for use with the 2d map
     * array */
    getGridIdx(x, y) {
        let col = floor(x / this.tilesize);
        let row = floor(y / this.tilesize);
        return {
            row: constrain(row, 0, this.rows - 1),
            col: constrain(col, 0, this.cols - 1)
        };
    }

    /* Floor an x, y position to a grid position (i.e. 12, 3 might clamp to 1, 0
     * for tilesize = 10) */
    getTilePos(x, y) {
        let tileX = floor(x / this.tilesize) * this.tilesize;
        let tileY = floor(y / this.tilesize) * this.tilesize;
        return createVector(tileX, tileY);
    }

    /* Render the tilemap. Only draw tiles inside the camera */
    draw() {
        /* Get the range of rows and columns to draw */
        let gridStart = this.getGridIdx(this.camera.x, this.camera.y);
        let gridEnd = {
            row: gridStart.row + (height / this.tilesize),
            col: gridStart.col + (width / this.tilesize)
        };

        /* only draw tiles the camera can see */
        for (let col = gridStart.col; col <= gridEnd.col; col++) {
            for (let row = gridStart.row; row <= gridEnd.row; row++) {
                let tile = this.map[row][col];
                let x = (col * this.tilesize) - this.camera.x;
                let y = (row * this.tilesize) - this.camera.y;

                if (tile === 'w') {
                    fill(30, 30, 30);
                    noStroke();
                    rect(x, y, this.tilesize, this.tilesize);
                }
            }
        }

        push();
        translate(-this.camera.x, -this.camera.y);
        this.player.draw(this.camera);
        pop();
    }
}