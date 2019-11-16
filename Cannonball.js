'use strict';

class Cannonball extends Entity {
    constructor(x, y) {
        super(x, y, tilesize / 2);

        /* Has not been shot yet */
        this.fired = false;

        /* The cannonball will richochet a limited number of times */
        this.totalBounces = 2;
        this.bouncesLeft = this.totalBounces;

        /* Shoot for magnitude */
        this.shootForceMag = 8;
    }

    /* Shoot the cannonball starting from... from */
    shoot(from) {
        let mouse = createVector(mouseX, mouseY);
        this.position.set(from.x - this.w, from.y - this.h);
        this.velocity.mult(0);

        let shootForce = p5.Vector.sub(mouse, this.position);
        shootForce.setMag(this.shootForceMag);

        this.applyForce(shootForce);
        this.fired = true;
    }

    update(game) {
        if (this.fired) {
            super.update(game);
        }
    }

    draw() {
        if (this.fired) {
            super.draw();
        }
    }
}