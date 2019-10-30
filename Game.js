'use strict';

class Game {
    constructor() {
        this.gameStates = {
            MENU: 1
        };

        this.currentGameState = this.gameStates.MENU;
    }

    /* **************** BEGIN DRAW FUNCTIONS **************** */
    /* Draw the main menu */
    drawMenu() {
        push();
        translate(utils.half(width), utils.half(height));
        ellipse(0, 0, 150, 150);
        pop();
    }

    /* To be called every frame. Redirects to the appropriate draw function
     * depending on the game state. */
    draw() {
        background(255, 255, 255);
        switch(this.currentGameState) {
        case this.gameStates.MENU:
            this.drawMenu();
            break;
        }
    }
    /* **************** END DRAW FUNCTIONS **************** */

    /* **************** BEGIN UPDATE FUNCTIONS **************** */
    /* update the game's main menu (wait for events, animations) */
    updateMenu() {
        return;
    }

    /* To be called every frame. Redirects to the appropriate update function
     * depending on the game state. */
    update() {
        switch(this.currentGameState) {
        case this.gameStates.MENU:
            this.updateMenu();
            break;
        }
    }
    /* **************** END UPDATE FUNCTIONS **************** */
}