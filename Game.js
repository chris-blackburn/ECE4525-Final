'use strict';

class Game {
    constructor() {
        this.gameStates = {
            MENU: 1,
            INSTR: 2,
            MAIN: 3,
            LOSE: 4,
            WIN: 5
        };

        this.currentGameState = this.gameStates.MENU;
        assets.loopSound("main_music");

        /* For main menu */
        this.menu_mainchar_wframes = new Keyframes([
            utils.makeRect(           0,        0),
            utils.makeRect(2 * tilesize,        0),
            utils.makeRect(3 * tilesize,        0),
            utils.makeRect(           0, tilesize)
        ], 150);
        this.menu_mainchar_wframes.start();

        /* for win screen */
        this.fallingPollen = [];

        /* Create tilemap ojects from the levels */
        this.tilemaps = [];
        this.currentLevel = 0;
        levels.forEach((level) => {
            this.tilemaps.push(new Tilemap(level, tilesize));
        });
    }

    /* **************** BEGIN DRAW FUNCTIONS **************** */
    /* Draw the main menu */
    drawMenu(noText = false) {
        rectMode(CENTER);
        imageMode(CENTER);
        push();
        let b1 = color(175, 238, 238);
        let b2 = color(245, 245, 245);
        utils.setGradient(0, 0, width, height, b1, b2, 1);

        if (!noText) {
            textAlign(CENTER, CENTER);
            /* Title of the game */
            fill(255, 50, 20);
            textFont(assets.getFont("options_font"));
            textSize(30);
            noStroke();
            text("Seed Boi", width / 2, 75);

            /* Draw the menu text and options text */
            fill(1, 142, 14);
            textSize(15);
            text("Start Game", width / 2, 200, 170, 20);
            text("Instructions", width / 2, 250, 180, 20);

            textSize(8);
            text("Chris Blackburn", 70, 10);

            imageMode(CORNER);
            for (let i = 0; i < width + tilesize; i += tilesize) {
                image(assets.getImage("grassy_tileset"), i, height - tilesize, tilesize, tilesize, 2 * tilesize, 3 * tilesize, tilesize, tilesize);
            }

            let main_xpos = map(frameCount % 480, 0, 479, -tilesize, width + tilesize * 4);
            let main_cf = this.menu_mainchar_wframes.getCurrent();
            image(assets.getImage("main"), main_xpos, height - tilesize * 2, tilesize, tilesize, main_cf.x, main_cf.y, tilesize, tilesize);

            let pollenFrame = 0;
            if (frameCount % 60 < 30) {
                pollenFrame = tilesize;
            }

            image(assets.getImage("pollen"), floor(3 * width / 4 + 50), floor(2 * height / 3 - 20), tilesize, tilesize, pollenFrame, 0, tilesize, tilesize);
            push();
            scale(-1, 1);
            image(assets.getImage("pollen"), floor(-(width / 4) - tilesize), floor(height / 3 + 30), tilesize, tilesize, pollenFrame, 0, tilesize, tilesize);
            pop();
            image(assets.getImage("pollen"), floor(width / 4 - 100), floor(height / 3 + 140), tilesize, tilesize, pollenFrame, 0, tilesize, tilesize);

            push();
            let wBeeFrame = 0;
            if (frameCount % 20 < 10) {
                wBeeFrame = tilesize;
            }

            scale(-1, 1);
            image(assets.getImage("worker_bee"), -(3 * width / 4 - 30) - tilesize, height / 4 + 30, tilesize, tilesize, wBeeFrame, 0, tilesize, tilesize);
            pop();
            image(assets.getImage("worker_bee"), width / 4 - 30, 2 * height / 4 + 30, tilesize, tilesize, wBeeFrame, 0, tilesize, tilesize);
        }

        pop();
        rectMode(CORNER);
        imageMode(CORNER);
    }

    drawInstr() {
        this.drawMenu(true);
        textAlign(CENTER, CENTER);
        rectMode(CENTER);
        imageMode(CENTER);
        textFont(assets.getFont("options_font"));

        fill(1, 142, 14);
        textSize(15);
        text("How to Play", width / 2, 20);

        textSize(10);
        text("Click to return", width / 2, 385);

        textSize(12);
        text("Use AWD to move left, jump, and move right. Pressing spacebar will shoot a projectile towards your mouse. The projectile bounces - hit yourself for an extra boost!",
            width / 4, height / 3, 300, 300);
        assets.drawImage("controls", width / 4, 2 * height / 3);

        text("You're a seed! In your search for somewhere to plant yourself, collect as much pollen as you can! Those nasty bees don't want you to have any. Make sure not to hit any bees or thorns or else you'll lose pollen for good!",
            3 * width / 4, height / 3, 300, 300);
        if (frameCount % 60 < 30) {
            image(assets.getImage("pollen_large"), 3 * width / 4 + 100, 2 * height / 3 + 30, 128, 128, 0, 0, 128, 128);
        } else {
            image(assets.getImage("pollen_large"), 3 * width / 4 + 100, 2 * height / 3 + 30, 128, 128, 128, 0, 128, 128);
        }

        if (frameCount % 20 < 10) {
            image(assets.getImage("worker_bee_large"), 3 * width / 4 - 100, 2 * height / 3 + 30, 128, 128, 0, 0, 128, 128);
        } else {
            image(assets.getImage("worker_bee_large"), 3 * width / 4 - 100, 2 * height / 3 + 30, 128, 128, 128, 0, 128, 128);
        }
    }

    drawMain() {
        this.tilemaps[this.currentLevel].draw();
    }

    drawLose() {
        background(0, 0, 0);
        textAlign(CENTER, CENTER);
        textFont(assets.getFont("options_font"));

        textSize(30);
        fill(255, 255, 255);
        noStroke();
        text("Game Over", width / 2, height / 2);

        textSize(10);
        text("Click to return to main menu", width / 2, 385);
    }

    drawWin() {
        let b1 = color(175, 238, 238);
        let b2 = color(245, 245, 245);
        utils.setGradient(0, 0, width, height, b1, b2, 1);
        textAlign(CENTER, CENTER);
        textFont(assets.getFont("options_font"));

        textSize(30);
        fill(1, 142, 14);
        noStroke();
        text("You Win!!!", width / 2, height / 2);

        textSize(20);
        text("Final Score: " + this.tilemaps[this.currentLevel].player.collectablesFound + "/" + this.tilemaps[this.currentLevel].totalCollectables,
            width / 2, (height / 2) + 50);

        textSize(10);
        text("Click to return to main menu", width / 2, 30);

        imageMode(CORNER);
        for (let i = 0; i < width + tilesize; i += tilesize) {
            image(assets.getImage("grassy_tileset"), i, height - tilesize, tilesize, tilesize, 2 * tilesize, 3 * tilesize, tilesize, tilesize);
        }

        image(assets.getImage("main"), tilesize * 4, height - tilesize * 2, tilesize, tilesize, tilesize, 0, tilesize, tilesize);

        this.fallingPollen.forEach((pollen) => {
            pollen.draw();
        }); 
    }

    /* To be called every frame. Redirects to the appropriate draw function
     * depending on the game state. */
    draw() {
        background(255, 255, 255);
        switch(this.currentGameState) {
        case this.gameStates.MENU:
            this.drawMenu();
            break;
        case this.gameStates.INSTR:
            this.drawInstr();
            break;
        case this.gameStates.MAIN:
            this.drawMain();
            break;
        case this.gameStates.LOSE:
            this.drawLose();
            break;
        case this.gameStates.WIN:
            this.drawWin();
            break;
        }
    }
    /* **************** END DRAW FUNCTIONS **************** */

    /* **************** BEGIN UPDATE FUNCTIONS **************** */
    /* update the game's main menu (wait for events, animations) */
    updateMenu() {
        if (mouseGotClicked) {
            if (utils.mouseWithin(width / 2, 200, 170, 40)) {
                /* Easiest way to reset is to just re-construct tilemaps */
                this.currentLevel = 0;
                for (let i = 0; i < this.tilemaps.length; i++) {
                    this.tilemaps[i] = new Tilemap(levels[i], tilesize);
                }

                this.currentGameState = this.gameStates.MAIN;
            } else if (utils.mouseWithin(width / 2, 250, 190, 40)) {
                this.currentGameState = this.gameStates.INSTR;
            }
        }

        this.menu_mainchar_wframes.update();
    }

    updateInstr() {
        if (mouseGotClicked) {
            this.currentGameState = this.gameStates.MENU;
        }
    }

    updateMain() {
        let currentTilemap = this.tilemaps[this.currentLevel];
        let player = currentTilemap.player;

        player.applyForce(gravity);
        player.update(this);

        /* If the player has no more base health, then game over */
        if (player.health <= 0) {
            this.currentGameState = this.gameStates.LOSE;
            assets.stopSound("boss_music");
            assets.stopSound("main_music");
            assets.playSound("game_over");
            return;
        }

        let playercb = player.getCollisionBox();
        currentTilemap.enemies.forEach((enemy) => {
            enemy.update(this);

            /* Check collision against the player */
            let enemycb = enemy.getCollisionBox();
            if (utils.checkBoxCollision(playercb, enemycb)) {
                if (!(enemy instanceof Boss && !enemy.active)) {
                    player.takeHealth(1);
                }
            }
        });

        if (currentTilemap.finalBoss.health <= 0) {
            this.currentGameState = this.gameStates.WIN;
            assets.stopSound("boss_music");
            assets.stopSound("main_music");
            assets.playSound("game_win");
            return;
        }

        /* Set the camera position to track the player */
        let playerCenter = player.getCenter();
        currentTilemap.camera.setPos(playerCenter.x - (width / 2),
            playerCenter.y - (height / 2));
    }

    updateLose() {
        if (mouseGotClicked) {
            this.currentGameState = this.gameStates.MENU;
            assets.loopSound("main_music");
        }
    }

    upateWin() {
        if (mouseGotClicked) {
            this.currentGameState = this.gameStates.MENU;
            assets.loopSound("main_music");
        }

        if (this.fallingPollen.length < 20) {
            let e = new Collectable(random(width), random(-height, -tilesize));
            e.velocity.y = random(1, 3);
            this.fallingPollen.push(e);
        }

        this.fallingPollen.forEach((pollen) => {
            pollen.update();
            if (pollen.position.y > height) {
                pollen.position.y = -tilesize;
                pollen.position.x = random(width);
            }
        }); 
    }

    /* To be called every frame. Redirects to the appropriate update function
     * depending on the game state. */
    update() {
        switch(this.currentGameState) {
        case this.gameStates.MENU:
            this.updateMenu();
            break;
        case this.gameStates.INSTR:
            this.updateInstr();
            break;
        case this.gameStates.MAIN:
            this.updateMain();
            break;
        case this.gameStates.LOSE:
            this.updateLose();
            break;
        case this.gameStates.WIN:
            this.upateWin();
            break;
        }
    }
    /* **************** END UPDATE FUNCTIONS **************** */
}