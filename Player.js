'use strict';

class Player extends Entity {
    constructor(x, y, s) {
        super(x, y, s);

        this.walkingForce = 1.5;
        this.forwardWalkingForce = createVector(this.walkingForce, 0);
        this.reverseWalkingForce = createVector(-this.walkingForce, 0);

        this.jumping = false;
        this.jumpForce = createVector(0, -4);

        /* Only one cannon ball at a time */
        this.myCannonball = new Cannonball(this.x, this.y);
    }

    update(game) {
        /* Left/right movement. Limit how much velocity can be added by the
         * user. */
        if (keys[65] && !keys[68]) {
            if (this.velocity.x >= -this.walkingForce) {
                this.applyForce(this.reverseWalkingForce);
            }
        } else if (keys[68] && !keys[65]) {
            if (this.velocity.x <= this.walkingForce) {
                this.applyForce(this.forwardWalkingForce);
            }
        }

        /* Jumping */
        if (keys[32] && !this.jumping) {
            this.velocity.y = 0;
            this.applyForce(this.jumpForce);
            this.jumping = true;
        }

        /* Decay horizontal velocity if on the ground */
        if (abs(this.velocity.x) < 0.1) {
            this.velocity.x = 0;
        } else {
            this.applyForce(createVector(this.velocity.x * -0.5, 0));
        }

        super.update(game);
    }

    draw() {
        super.draw();

        /* Dotted line from player to mouse */
        stroke(200, 200, 200);
        strokeWeight(4);

        let center = this.getCenter();
        utils.dottedLine(center.x, center.y, mouseX, mouseY);
        strokeWeight(1);
    }
}