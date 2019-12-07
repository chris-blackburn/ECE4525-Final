'use strict';

class Player extends Entity {
    constructor(x, y, s) {
        super(x, y, s);

        this.walkingForce = 1.8;
        this.forwardWalkingForce = createVector(this.walkingForce, 0);
        this.reverseWalkingForce = createVector(-this.walkingForce, 0);
        this.walkingFrames = new Keyframes([
            utils.makeRect(           0,        0),
            utils.makeRect(2 * tilesize,        0),
            utils.makeRect(3 * tilesize,        0),
            utils.makeRect(           0, tilesize)
        ], 150);

        this.jumping = false;
        this.jumpForce = createVector(0, -5);

        /* Only one cannon ball at a time. keep state of being hit */
        this.shootCooldown = new Cooldown(500);
        this.myCannonball = new Cannonball(this.x, this.y);
        this.cannonHit = false;

        this.baseHealth = 3;
        this.health = this.baseHealth;
        this.collectablesFound = 0;

        this.invincibleTimer = new Cooldown(1000);
    }

    /* Take health away from the player, start by taking away from collectables
     * then move to base health. */
    takeHealth(amt) {
        if (this.invincibleTimer.expired) {
            assets.playSound("seed_man_hurt");
            this.invincibleTimer.start();
            if (this.collectablesFound > 0) {
                this.collectablesFound = max(0, this.collectablesFound - amt);
            } else {
                this.health = max(0, this.health - amt);
            }
        }
    }

    update(game) {
        /* Left/right movement. Limit how much velocity can be added by the
         * user. If we just hit a cannonball, then walking force acts more like
         * a decay. */
        if (keys[65] && !keys[68]) {
            if (this.velocity.x >= -this.walkingForce) {
                this.applyForce(this.reverseWalkingForce);
            }

            this.walkingFrames.startOnce();
        } else if (keys[68] && !keys[65]) {
            if (this.velocity.x <= this.walkingForce) {
                this.applyForce(this.forwardWalkingForce);
            }

            this.walkingFrames.startOnce();
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

            this.walkingFrames.reset();
        }

        /* Jumping */
        if (keys[87] && !this.jumping) {
            this.velocity.y = 0;
            this.applyForce(this.jumpForce);
            this.jumping = true;
            this.walkingFrames.reset();
        }

        /* Shooting */
        let camera = game.tilemaps[game.currentLevel].camera;
        if (keys[32] && !this.shootCooldown.active) {
            assets.playSound("seed_man_shoot");
            this.shootCooldown.start();
            this.myCannonball.reset();
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
                assets.playSound("seed_man_bullet_self");
                this.velocity.y = 0;
                let ricochetForce = this.myCannonball.velocity;
                ricochetForce.setMag(5);
                this.applyForce(ricochetForce);
                this.myCannonball.reset();
                this.cannonHit = true;

                /* Allow the player to jump again if the hit the cannon ball */
                this.jumping = false;
                this.walkingFrames.reset();
            }
        } else {
            /* reset cannonHit when velocity is low */
            if (this.cannonHit && this.velocity.mag() < 0.1) {
                this.cannonHit = false;
                this.walkingFrames.reset();
            }
        }

        super.update(game);
        this.myCannonball.update(game);
        this.shootCooldown.update();
        this.walkingFrames.update();
        this.invincibleTimer.update();
    }

    draw(camera) {
        let sx = 0;
        let sy = 0;
        let dx = this.position.x;
        let dy = this.position.y;

        /* Dotted line from player to mouse */
        stroke(200, 200, 200);
        strokeWeight(4);

        let center = this.getCenter();
        utils.dottedLine(center.x, center.y,
            mouseX + camera.x, mouseY + camera.y);
        strokeWeight(1);

        push();
        if (this.jumping || this.cannonHit) {
            sx = 1 * tilesize;
        } else if (!this.jumping && !this.cannonHit && (keys[65] || keys[68])) {
            /* animation */
            let cf = this.walkingFrames.getCurrent();
            sx = cf.x;
            sy = cf.y;
        }

        /* flip the image to correct direction */
        if ((keys[65] && !keys[68]) || this.velocity.x < 0 || cos(this.angle) < 0) {
            scale(-1, 1);
            dx = (dx * -1) - tilesize;
        }

        image(assets.getImage("main"), floor(dx), dy, tilesize, tilesize, sx, sy, tilesize, tilesize);
        pop();

        this.myCannonball.draw();
    }
}