'use strict';

class Game {
    constructor() {
        this.gameStates = {
            MENU: 1
        };

        this.currentGameState = this.gameStates.MENU;

        /* Some state values need to be kept in different screens. */
        this.stateValues = {
            menu: {
                fogSeed: random(1500),
                drawFog: function() {
                    let n1 = this.fogSeed;
                    for (let x = 0; x <= width; x += 4) {
                        let n2 = 0;
                        for (let y = 0; y <= height; y += 4) {
                            let c = map(noise(n1,n2),0,1,0,100);
                            fill(c + 50, c + 20, c, 200);
                            noStroke();
                            rect(x, y, 4, 4);
                            stroke(0, 0, 0);
                            n2 += 0.05; // step size in noise
                        }
    
                        n1 += 0.02; // step size in noise
                    }
    
                    this.fogSeed -= 0.01;  // speed of clouds
                },

                /* To simplify, this is an array of positions to draw clouds. */
                clouds: [],
                drawClouds: function() {
                    if (this.clouds.length === 0) {
                        this.clouds = (() => {
                            let arr = [];
                            for (let i = 0; i < 15; i++) {
                                arr.push(createVector(i * 40, random(0, 20)));
                            }

                            return arr;
                        })();
                    }

                    noStroke();
                    fill(150, 150, 150);
                    this.clouds.forEach((v, idx, me) => {
                        ellipse(v.x++, v.y, 60);
                        if (v.x - 25 > width) {
                            me[idx].x = -25;
                        }
                    });
                },

                cannonSmoke: new ParticleSystem(145, 320, 1, 100)
            }
        }
    }

    /* **************** BEGIN DRAW FUNCTIONS **************** */
    /* Draw the main menu */
    drawMenu() {
        push();
        background(255, 127, 80)
        this.stateValues.menu.drawFog();
        assets.drawImage("background", 200, 200);

        /* Clouds at the top */
        this.stateValues.menu.drawClouds();

        fill(60, 60, 60);
        rect(200, 375, width, 50);

        this.stateValues.menu.cannonSmoke.addParticle();
        this.stateValues.menu.cannonSmoke.applyForce(createVector(0.01, 0));
        this.stateValues.menu.cannonSmoke.draw();

        push();
        translate(100, 340);
        rotate(-20);
        assets.drawImage("cannon_menu", 0, 0);
        pop();
        assets.drawImage("myguy_menu", 70, 330);

        assets.drawImage("bugboi_menu", 330, 330);

        /* Draw the menu text and options text */
        
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