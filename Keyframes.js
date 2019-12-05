'use strict';

/* Helper class to cycle through frames of a sprite sheet */
class Keyframes {

    /* Slices should be an array of x, y positions on a sprite sheet with w and
     * h values for extracting images */
    constructor(slices, commonTime) {
        this.frames = slices;
        this.totalFrames = slices.length;
        this.currentFrame = 0;

        this.frameTimer = new Cooldown(commonTime);
    }

    getCurrent() {
        return this.frames[this.currentFrame];
    }

    reset() {
        this.currentFrame = 0;
        this.frameTimer.reset();
    }

    startOnce() {
        if (!this.frameTimer.active) {
            this.start();
        }
    }

    start() {
        this.frameTimer.reset();
        this.frameTimer.start();
    }

    update() {
        if (this.frameTimer.active) {
            this.frameTimer.update();
            if (this.frameTimer.expired) {
                this.start();
                /* Loop the frames */
                if (++this.currentFrame >= this.totalFrames) {
                    this.currentFrame = 0;
                }
            }
        }
    }


}