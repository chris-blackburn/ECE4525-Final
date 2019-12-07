'use strict';

class Collectable extends Entity {
    constructor(x, y) {
        super(x, y, tilesize);

        this.collected = false;

        this.idleFrames = new Keyframes([
            utils.makeRect(       0, 0),
            utils.makeRect(tilesize, 0)
        ], random(90, 110));
        this.idleFrames.start();

        this.dir = random([-1, 1]);
    }

    draw(camera) {
        if (!this.collected) {
            this.idleFrames.update();
            let dx = this.position.x;
            let dy = this.position.y;
            let cf = this.idleFrames.getCurrent();

            push();
            if (this.dir === -1) {
                scale(-1, 1);
                dx = (dx * -1) - tilesize;
            }

            image(assets.getImage("pollen"), floor(dx), dy, tilesize, tilesize, cf.x, cf.y, tilesize, tilesize);
            pop();
        }
    }
}