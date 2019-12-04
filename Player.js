'use strict';

class Player extends Entity {
    constructor(x, y, s) {
        super(x, y, s);

        this.walkingForce = 1.8;
        this.forwardWalkingForce = createVector(this.walkingForce, 0);
        this.reverseWalkingForce = createVector(-this.walkingForce, 0);

        this.jumping = false;
        this.jumpForce = createVector(0, -5);

        /* Only one cannon ball at a time. keep state of being hit */
        this.myCannonball = new Cannonball(this.x, this.y);
        this.cannonHit = false;
    }

    update(game) {
        /* Left/right movement. Limit how much velocity can be added by the
         * user. If we just hit a cannonball, then walking force acts more like
         * a decay. */
        if (keys[65] && !keys[68]) {
            if (!this.cannonHit && this.velocity.x >= -this.walkingForce) {
                this.applyForce(this.reverseWalkingForce);
            } else if (this.cannonHit) {
                let decayWalkingForce = this.reverseWalkingForce.copy();
                decayWalkingForce.setMag(0.3);
                this.applyForce(decayWalkingForce);
            }
        } else if (keys[68] && !keys[65]) {
            if (!this.cannonHit && this.velocity.x <= this.walkingForce) {
                this.applyForce(this.forwardWalkingForce);
            } else if (this.cannonHit) {
                let decayWalkingForce = this.forwardWalkingForce.copy();
                decayWalkingForce.setMag(0.3);
                this.applyForce(decayWalkingForce);
            }
        } else if (!keys[65] && !keys[68]) {
            /* Decay horizontal velocity */
            if (abs(this.velocity.x) < 0.1) {
                this.velocity.x = 0;
            } else {
                let xVelocity = createVector(this.velocity.x, 0);
                let decayVector = createVector(this.velocity.x, 0);
                if (this.jumping) {
                    decayVector.setMag(-0.4);
                } else {
                    decayVector.setMag((this.cannonHit) ? -0.3 : -0.6);
                }

                /* Decay shouldn't make the player change direction */
                decayVector.setMag(min(abs(decayVector.mag()), abs(xVelocity.mag())));
                this.applyForce(decayVector);
            }
        }

        /* Jumping */
        if (keys[87] && !this.jumping) {
            this.velocity.y = 0;
            this.applyForce(this.jumpForce);
            this.jumping = true;
        }

        /* Shooting */
        let camera = game.tilemaps[game.currentLevel].camera;
        if (keys[32] && !this.myCannonball.fired) {
            this.myCannonball.shoot(this.getCenter(),
                createVector(mouseX + camera.x, mouseY + camera.y));
        } else if (this.myCannonball.fired && this.myCannonball.hasBounced()) {
            /* If the cannon ball is out and about, check if we collided with
             * it. */
            let collided = utils.checkBoxCollision(this.getCollisionBox(),
                this.myCannonball.getCollisionBox());

            /* If the cannonball hit us, then we need to reset it and apply its
             * velocity to us */
            if (collided) {
                let ricochetForce = this.myCannonball.velocity;
                ricochetForce.setMag(5);
                this.applyForce(ricochetForce);
                this.myCannonball.reset();
                this.cannonHit = true;

                /* Allow the player to jump again if the hit the cannon ball */
                this.jumping = false;
            }
        } else {
            /* reset cannonHit when velocity is low */
            if (this.cannonHit && this.velocity.mag() < 0.1) {
                this.cannonHit = false;
            }
        }

        super.update(game);
        this.myCannonball.update(game);
    }

    draw(camera) {
        super.draw();

        /* Dotted line from player to mouse */
        stroke(200, 200, 200);
        strokeWeight(4);

        let center = this.getCenter();
        utils.dottedLine(center.x, center.y,
            mouseX + camera.x, mouseY + camera.y);
        strokeWeight(1);

        this.myCannonball.draw();
    }
}