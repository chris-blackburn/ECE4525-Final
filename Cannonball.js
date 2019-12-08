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
        this.shootForceMag = 10;
    }

    reset() {
        this.fired = false;
        this.bouncesLeft = this.totalBounces;
    }

    /* Shoot the cannonball */
    shoot(from, to) {
        let bulletOffset = createVector(this.w / 2, this.h / 2);
        let mouse = createVector(to.x, to.y);
        from.add(bulletOffset);
        mouse.sub(bulletOffset);
        
        this.position.set(from.x - this.w, from.y - this.h);
        this.velocity.mult(0);

        let shootForce = p5.Vector.sub(mouse, this.position);
        shootForce.setMag(this.shootForceMag);

        this.applyForce(shootForce);
        this.fired = true;
    }

    hasBounced() {
        return this.bouncesLeft < this.totalBounces;
    }

    update(game) {
        if (this.fired) {
            super.update(game);
        }
    }

    draw() {
        if (this.fired) {
            assets.drawImage("seed_spit", this.position.x, this.position.y);
        }
    }
}