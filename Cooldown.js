'use strict';

/* Cooldown to encapsulate time information */
class Cooldown {
    constructor(total) {
        this.totalTime = total;
        this.currentTime = total;

        this.expired = false;
        this.active = false;
    }

    /* Refresh the cooldown */
    reset() {
        this.currentTime = this.totalTime;
        this.expired = false;
        this.active = false;
    }

    /* If not already active and expired, start the timer */
    start() {
        if (!this.active) {
            this.currentTime = this.totalTime;
            this.expired = false;
            this.active = true;
        }
    }

    update() {
        if (this.active && !this.expired) {
            this.currentTime -= deltaTime;
            if (this.currentTime <= 0) {
                this.expired = true;
                this.active = false;
            }
        }
    }

    /* Draw a cooldown symbol somewhere on the screen */
    draw(x, y, camera) {
        if (this.active) {
            stroke(255, 255, 0);
            strokeWeight(6);
            noFill();
            arc(x + camera.x, y + camera.y, tilesize / 2, tilesize / 2, 0, 360 * (this.currentTime / this.totalTime));
        }
    }
}