'use strict';

class Collectable extends Entity {
    constructor(x, y) {
        super(x, y, tilesize);

        this.collected = false;
    }

    update(tilemap) {
        return;
    }

    draw(camera) {
        if (!this.collected) {
            fill(255, 255, 0);
            // TODO: img with animation
            rect(this.position.x, this.position.y, tilesize, tilesize, 10);
        }
    }
}