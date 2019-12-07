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
            let dx = this.position.x;

            push();
            if (this.velocity.x < 0 || cos(this.angle) < 0) {
                scale(-1, 1);
                dx = (dx * -1) - tilesize;
            }

            assets.drawImage("mini_bee", dx, this.position.y, 8, 8);
            pop();
        }
    }
}