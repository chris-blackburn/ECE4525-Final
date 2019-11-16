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

    /* Get the effective collision box of this entity */
    getCollisionBox() {
        return {
            x: this.position.x,
            y: this.position.y,
            w: this.w,
            h: this.h
        }
    }

    /* Fix collision between this object and another */
    fixCollisions(objs) {
        var cb = this.getCollisionBox();
        var collision = false;

        for (var i = 0; i < objs.length; i++) {
            var othercb = objs[i].getCollisionBox();

            if (utils.checkBoxCollision(cb, othercb)) {
                collision = true;

                /* I was above */
                if (this.oldPosition.y + cb.h <= othercb.y) {
                    this.position.y = othercb.y - cb.h;
                    this.velocity.y = 0;

                    /* TODO: make more sophisticated collision to move this to
                     * player class */
                    this.jumping = false;

                /* I was below */
                } else if (this.oldPosition.y >= othercb.y + othercb.h) {
                    this.position.y = othercb.y + othercb.h;
                    this.velocity.y = 0;

                /* I was to the left */
                } else if (this.oldPosition.x + cb.w <= othercb.x) {
                    this.position.x = othercb.x - cb.w;
                    this.velocity.x = 0;

                /* I was to the right */
                } else if (this.oldPosition.x >= othercb.x + othercb.w) {
                    this.position.x = othercb.x + othercb.w;
                    this.velocity.x = 0;
                }
            }
        }

        return collision;
    }

    /* Returns the center x, y of this entity */
    getCenter() {
        return createVector(this.position.x + this.w / 2, this.position.y + this.h / 2);
    }

    update() {
        this.oldPosition = this.position.copy();

        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.mult(0);

        /* Only change angle if velocity is non-zero */
        if (this.velocity.mag() !== 0) {
            this.angle = this.velocity.heading();
        }
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    draw() {
        let center = this.getCenter();

        /* Draw a bounding rectangle and a line from the center rotated at the
         * current angle. */
        fill(255, 0, 0);
        stroke(0, 0, 0);
        rect(this.position.x, this.position.y, this.w, this.h);
        push();
        translate(center.x, center.y);
        rotate(this.angle);
        line(0, 0, max(this.w, this.h), 0);
        pop();
    }
}