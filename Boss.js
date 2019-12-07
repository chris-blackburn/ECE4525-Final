'use strict';

/* The final boss */
class Boss extends Entity {
    constructor(x, y) {
        super(x, y, tilesize * 2);

        /* Final boss should not try to attack until activated */
        this.active = false;

        this.totalHealth = 10;
        this.health = this.totalHealth;
    }

    activate() {
        this.active = true;
    }

    /* Take more health depending on progression */
    takeHealth(tilemap) {
        let damage = map(tilemap.player.collectablesFound, 0, tilemap.totalCollectables, 1, 5);
        this.health = max(0, this.health - damage);
    }

    update(game) {
        if (this.active) {
            super.update(game);
        }
    }

    draw(camera) {
        if (this.active) {
            super.draw(camera);
        }
    }
}