'use strict';

class Projectile extends Entity {
    constructor(x, y) {
        super(x, y, 8);

        this.fired = false;
    }

    update(game) {
        if (this.fired) {
            super.update(game);
        }
    }

    draw(camera) {
        if (this.fired) {
            super.draw(camera);
        }
    }
}