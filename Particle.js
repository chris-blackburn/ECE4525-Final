'use strict';

/* A general particle class. Useful for all sorts of things like explosions,
 * smoke, or other cool special effects. */

class Particle {
    constructor(x, y, w = 10, h = 10) {
        this.reset(x, y);

        this.width = w;
        this.height = h;
    }

    /* Instead of re-creating a particle, you can optionally reset it's values
     * like position or life. */
    reset(x, y) {
        this.position = createVector(x, y);
        this.velocity = createVector(randomGaussian() * 0.1,
            randomGaussian() * 0.1 - 1);
        this.acceleration = createVector();
        this.life = 100;
    }

    dead() {
        return this.life <= 0;
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    /*  */
    update() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.life -= 1;
        this.acceleration.mult(0);
    }

    /* Draw the particle. Transparency is linked to the life left of the
     * particle. */
    draw() {
        let transparency = map(this.life, 0, 100, 0, 255);
        noStroke();
        fill(220, 220, 220, transparency);
        ellipse(this.position.x, this.position.y, this.width, this.height);
    }
}