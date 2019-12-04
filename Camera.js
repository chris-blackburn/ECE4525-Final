'use strict';

/* Camera class to track the player. The camera is essentially a rectangle where
 * the corner is its x, y position and the width and height match the canvas
 * size. */
class Camera {
    constructor(rows, cols, tilesize) {
        this.x = 0;
        this.y = 0;

        /* The maximum x and y values are where the camera does not try to seek
         * past the last tile in a given direction. For example, if we have a 
         * 400x400 canvas, where we have a 3x2 grid of size 200, then the max x
         * value for the camera should be 200 (it would look at the rightmost 4
         * tiles). */
        this.maxX = cols * tilesize - width;
        this.maxY = rows * tilesize - height;
    }

    /* Set the camera position. Do not go outside the tilemap */
    setPos(x, y) {
        this.x = floor(constrain(x, 0, this.maxX));
        this.y = floor(constrain(y, 0, this.maxY));
    }
}