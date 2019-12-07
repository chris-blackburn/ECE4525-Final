'use strict';

class Thorns extends Entity {
    constructor(x, y) {
        super(x, y, tilesize);

        this.dirx = random([-1, 1]);
        this.diry = random([-1, 1]);
    }

    draw(camera) {
        let dx = this.position.x;
        let dy = this.position.y;

        /* flip the image to correct direction */
        push();
        scale(this.dirx, this.diry);
        if (this.dirx === -1) {
            dx = (dx * -1) - tilesize;
        }

        if (this.diry === -1) {
            dy = (dy * -1) - tilesize;
        }

        assets.drawImage("thorns", dx, dy, tilesize, tilesize);
        pop();
    }
}