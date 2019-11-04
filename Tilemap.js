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
        this.cols = map.length;
        this.rows = map[0].length;

        /* TODO: Initialize the visual map by collecting references to the
         * original sprite sheet. Depending on neigboring tiles, pick a
         * different image from the sprite sheet. */
        this.visualMap = undefined;
    }

    /* Convert absolute coordinates into grid coordinates. */
    getTilePos(x, y) {
        let tileX = Math.floor(x / this.tilesize) * this.tilesize;
        let tileY = Math.floor(y / this.tilesize) * this.tilesize;
        return createVector(tileX, tileY);
    }

    /* Render the tilemap. */
    draw() {
         
    }
}