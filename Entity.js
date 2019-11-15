'use strict';

/* Base class for most entities in the game world */
class Entity {
    constructor(x, y, w, h) {
        this.position = createVector(x, y);

        /* 3 arguments for square shaped object */
        if (arguments.length === 4) {
            this.w = w;
            this.h = h;
        } else if (arguments.length === 3) {
            this.w = w;
            this.h = w;
        }

        this.oldPosition = this.position.copy();

        this.angle = 0;

        /* this.mass = 1; */
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
    }

    /* Returns the center x, y of this entity */
    getCenter() {
        return createVector(this.position.x + this.w / 2, this.position.y + this.h / 2);
    }

    update() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);

        this.acceleration.mult(0);

        this.oldPosition = this.position.copy();
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    draw() {
        let center = this.getCenter();

        /* Draw a bounding rectangle and a line from the center rotated at the
         * current angle. */
        rect(this.position.x, this.position.y, this.w, this.h);
        push();
        rotate(this.angle);
        line(center.x, center.y, max(this.w, this.h), center.y);
        pop();
    }
}