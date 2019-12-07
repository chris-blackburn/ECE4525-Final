'use strict';

/* Used to trigger the boss, becomes a wall once passed through */
class HiddenTrigger extends Entity {
    constructor(x, y) {
        super(x, y, tilesize);

        this.triggered = false;
    }

    disable() {
        this.triggered = true;
    }
}