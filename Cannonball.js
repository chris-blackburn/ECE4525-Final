'use strict';

class Cannonball extends Entity {
    constructor(x, y) {
        super(x, y, tilesize / 2);

        /* Has not been shot yet */
        this.fired = false;

        /* The cannonball will richochet a limited number of times */
        this.totalBounces = 2;
        this.bouncesLeft = this.totalBounces;
    }

    update() {
        if (this.fired) {
            super.update();
        }
    }

    draw() {
        if (this.fired) {
            super.draw();
        }
    }
}