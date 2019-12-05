'use strict';

/* Simple enemy flys across the screen and changes direction when it hits a
 * wall. */
class SimpleEnemy extends Entity {
    constructor(x, y, s) {
        super(x, y, s);

        /* 1 is right, -1 is left */
        this.dir = random([-1, 1]);

        this.walkingForce = 0.5;
        this.forwardWalkingForce = createVector(this.walkingForce, 0);
        this.reverseWalkingForce = createVector(-this.walkingForce, 0);
    }

    update(game) {
        /* Move back and forth */
        if (this.dir === 1) {
            if (this.velocity.x >= -this.walkingForce) {
                this.applyForce(this.reverseWalkingForce);
            }
        } else {
            if (this.velocity.x <= this.walkingForce) {
                this.applyForce(this.forwardWalkingForce);
            }
        }

        super.update(game);
    }

    draw(camera) {
        super.draw(camera);
    }
}