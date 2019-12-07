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

        this.flyingFrames = new Keyframes([
            utils.makeRect(       0, 0),
            utils.makeRect(tilesize, 0)
        ], random(60, 80));
        this.flyingFrames.start();
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
        this.flyingFrames.update();
    }

    draw(camera) {
        let dx = this.position.x;
        let dy = this.position.y;

        let cf = this.flyingFrames.getCurrent();

        /* flip the image to correct direction */
        push();
        if (this.velocity.x < 0 || cos(this.angle) < 0) {
            scale(-1, 1);
            dx = (dx * -1) - tilesize;
        }

        image(assets.getImage("worker_bee"), floor(dx), dy, tilesize, tilesize, cf.x, cf.y, tilesize, tilesize);
        pop();
    }
}