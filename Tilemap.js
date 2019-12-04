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
        
        /* Initialize the visual map by collecting references to the
         * original sprite sheet. Depending on neigboring tiles, pick a
         * different image from the sprite sheet. */
        this.visualMap = new Array(this.rows * this.cols);
        this.visualMap.fill(0)

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
                    this.logicalMap.push(new Entity(actual.x, actual.y, this.tilesize));
                    this.visualMap[this.rasterIdx(row, col)] = this.getTileNumber(row, col);
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

    rasterIdx(row, col) {
        return col + (this.cols * row);
    }

    /* explanation of what I'm doing for auto-tiling:
     * http://www.angryfishstudios.com/2011/04/adventures-in-bitmasking/ */
    getTileNumber(row, col) {
        let sum = 0;
        let rm = max(0, row - 1);
        let rp = min(this.rows - 1, row + 1);
        let cm = max(0, col - 1);
        let cp = min(this.cols - 1, col + 1);

        /* TOP */
        if (this.map[rm][col] === 'w') {
            sum += 16;
        }

        /* LEFT */
        if (this.map[row][cm] === 'w') {
            sum += 128;
        }

        /* RIGHT */
        if (this.map[row][cp] === 'w') {
            sum += 32;
        }

        /* BOTTOM */
        if (this.map[rp][col] === 'w') {
            sum += 64;
        }

        /* TOP LEFT */
        if (this.map[rm][cm] === 'w') {
            sum += 8;
        }

        /* TOP RIGHT */
        if (this.map[rm][cp] === 'w') {
            sum += 1;
        }

        /* BOTTOM LEFT */
        if (this.map[rp][cm] === 'w') {
            sum += 4;
        }

        /* BOTTOM RIGHT */
        if (this.map[rp][cp] === 'w') {
            sum += 2;
        }

        return sum;
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

    /* Grabs a snippet from the tileset and draws it. The actual snippet depends
     * on the number, n. */
    drawTilesetImg(x, y, n) {
        let sx = 0;
        let sy = 0;

        /* Diagonals, 4th row of my tileset */
        if (n === 254) {
            sx = 0 * this.tilesize;
            sy = 4 * this.tilesize;
        } else if (n === 253) {
            sx = 1 * this.tilesize;
            sy = 4 * this.tilesize;
        } else if (n === 251) {
            sx = 2 * this.tilesize;
            sy = 4 * this.tilesize;
        }  else if (n === 247) {
            sx = 3 * this.tilesize;
            sy = 4 * this.tilesize;
        } else {
            /* Only looking at a few corner cases, so for the most part, we look at
             * NSEW. */
            let nsew = n >> 4;
            sx = (nsew % 4) * this.tilesize;
            sy = (floor(nsew / 4)) * this.tilesize;
        }

        image(assets.getImage("grassy_tileset"), x, y, this.tilesize, this.tilesize, sx, sy, this.tilesize, this.tilesize);
    }

    /* Render the tilemap. Only draw tiles inside the camera */
    draw() {
        assets.drawImage("background", -this.camera.x, -this.camera.y);
        /* Get the range of rows and columns to draw */
        let gridStart = this.getGridIdx(this.camera.x, this.camera.y);
        let gridEnd = {
            row: min(this.rows - 1, gridStart.row + (height / this.tilesize) + 1),
            col: min(this.cols - 1, gridStart.col + (width / this.tilesize))
        };

        /* only draw tiles the camera can see */
        for (let col = gridStart.col; col <= gridEnd.col; col++) {
            for (let row = gridStart.row; row <= gridEnd.row; row++) {
                let tile = this.map[row][col];
                let vtile = this.visualMap[this.rasterIdx(row, col)];
                let x = (col * this.tilesize) - this.camera.x;
                let y = (row * this.tilesize) - this.camera.y;

                if (tile === 'w') {
                    fill(30, 30, 30);
                    noStroke();
                    this.drawTilesetImg(x, y, vtile);
                }
            }
        }

        push();
        translate(-this.camera.x, -this.camera.y);
        this.player.draw(this.camera);
        pop();
    }
}