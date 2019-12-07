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

        /* Raster order array of logical blocks */
        this.logicalMap = new Array(this.rows * this.cols);
        this.logicalMap.fill(null);

        this.totalCollectables = 0;

        this.enemies = [];

        this.hiddenTriggers = [];

        /* Reference to a player object */
        this.player = undefined;

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                let actual = createVector(col * this.tilesize, row * this.tilesize);
                let ridx = this.rasterIdx(row, col);

                /* Parse the tiles */
                switch (this.map[row][col]) {
                /* Walls */
                case 'w':
                    this.logicalMap[ridx] = new Entity(actual.x, actual.y, this.tilesize);
                    this.visualMap[ridx] = this.getTileNumber(row, col);
                    break;

                /* Thorns */
                case 't':
                    this.logicalMap[ridx] = new Thorns(actual.x, actual.y);
                    break;

                /* Collectables */
                case 'c':
                    this.logicalMap[ridx] = new Collectable(actual.x, actual.y);
                    this.totalCollectables += 1;
                    break;
                
                /* Simple enemies */
                case 's':
                    this.enemies.push(new SimpleEnemy(actual.x, actual.y, this.tilesize));
                    break;

                /* Trigger for activating final boss */
                case 'h':
                    this.logicalMap[ridx] = new HiddenTrigger(actual.x, actual.y);
                    this.hiddenTriggers.push(this.logicalMap[ridx]);
                    break;

                /* Queen bee boss */
                case 'B':
                    this.finalBoss = new Boss(actual.x, actual.y);
                    this.enemies.push(this.finalBoss);
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

    /* Return a list of objects from the logical grid where the rectangular
     * object overlaps */
    getSpanningLogicalTiles(x, y, w, h) {
        let gridStart = this.getGridIdx(x, y);
        let gridEnd = this.getGridIdx(x + w, y + h);

        let filteredTiles = [];
        for (let col = gridStart.col; col <= gridEnd.col; col++) {
            for (let row = gridStart.row; row <= gridEnd.row; row++) {
                let ltile = this.logicalMap[this.rasterIdx(row, col)];
                if (ltile !== null) {
                    filteredTiles.push(ltile);
                }
            }
        }

        return filteredTiles;
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
        } else if (n === 247) {
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

    drawUI() {
        fill(0, 0, 0, 80);
        noStroke();
        rect(4, 4, 172, 62, 5, 5);

        /* Draw the player's health bar */
        fill(0, 0, 0);
        stroke(0, 0, 0);
        strokeWeight(8);
        rect(10, 10, 160, 20, 5, 40, 5, 40);
        noStroke();
        fill(255, 0, 0);

        /* Draw player health, then overlay health added from collectables */
        let playerHealth = 160 * (this.player.health / this.player.baseHealth);
        let pollenHealth = 160 * (this.player.collectablesFound / this.totalCollectables);
        rect(10, 10, playerHealth, 20, 5, 40, 5, 40);
        if (pollenHealth !== 0) {
            fill(255, 255, 0);
            rect(10, 10, pollenHealth, 20, 5, 40, 5, 40);
        }

        /* Signal that the player is invincible */
        if (this.player.invincibleTimer.active) {
            stroke(211, 211, 211);
            strokeWeight(8);
            noFill();
            rect(10, 10, 160, 20, 5, 40, 5, 40);
        }

        /* Pollen collected */
        noStroke();
        assets.drawImage("pollen_small", 40, 40, 16, 16);
        fill(255, 255, 255);

        textFont(assets.getFont("options_font"));
        textAlign(LEFT, BASELINE);
        textSize(16);
        text(this.player.collectablesFound, 64, 40 + 16);

        this.player.shootCooldown.draw(20, 48);
    }

    drawBackground() {
        let b1 = color(175, 238, 238);
        let b2 = color(245, 245, 245);
        utils.setGradient(0, 0, width, height, b1, b2, 1);
    }

    /* Render the tilemap. Only draw tiles inside the camera */
    draw() {
        this.drawBackground();
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
                let ridx = this.rasterIdx(row, col);
                let vtile = this.visualMap[ridx];
                let ltile = this.logicalMap[ridx];
                let x = (col * this.tilesize) - this.camera.x;
                let y = (row * this.tilesize) - this.camera.y;

                if ("w".includes(tile)) {
                    fill(30, 30, 30);
                    noStroke();
                    this.drawTilesetImg(x, y, vtile);
                } else if (tile === "c" && !ltile.collected) {
                    push();
                    translate(-this.camera.x, -this.camera.y);
                    ltile.draw(this.camera);
                    pop();
                } else if (tile === "t") {
                    push();
                    translate(-this.camera.x, -this.camera.y);
                    ltile.draw(this.camera);
                    pop();
                }
            }
        }

        push();
        translate(-this.camera.x, -this.camera.y);
        this.enemies.forEach((enemy) => {
            enemy.draw(this.camera);
        });

        this.player.draw(this.camera);
        pop();

        /* UI elements on top */
        this.drawUI();
    }
}