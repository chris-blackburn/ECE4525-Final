'use strict';

let game;
let assets;
let mouseGotClicked = false;

/* Globals for game world */
let gravity;

var keys = [];
function keyPressed() {
    keys[keyCode] = 1;
};

function keyReleased() {
    keys[keyCode] = 0;
};

function preload() {
  assets = new Assets();
  assets.addImage(loadImage('assets/main.png'), "main");
  assets.addImage(loadImage('assets/worker_bee.png'), "worker_bee");
  assets.addImage(loadImage('assets/mini_bee.png'), "mini_bee");
  assets.addImage(loadImage('assets/pollen.png'), "pollen");
  assets.addImage(loadImage('assets/pollen_small.png'), "pollen_small");
  assets.addImage(loadImage('assets/thorns.png'), "thorns");
  assets.addImage(loadImage('assets/queen_bee.png'), "queen_bee");
  assets.addImage(loadImage('assets/seed_spit.png'), "seed_spit");

  assets.addImage(loadImage('assets/instructions.png'), "controls");

  assets.addFont(loadFont('assets/A_Goblin_Appears.otf'), "options_font");
  assets.addImage(loadImage('assets/grassy_tileset_ordered.png'), "grassy_tileset");

  assets.addSound(loadSound('assets/seed_man_hurt'), 1, "seed_man_hurt");
  assets.addSound(loadSound('assets/seed_man_shoot'), 1, "seed_man_shoot");
  assets.addSound(loadSound('assets/seed_man_bullet_bounce'), 0.3, "seed_man_bullet_bounce");
  assets.addSound(loadSound('assets/seed_man_bullet_self'), 1, "seed_man_bullet_self");
  assets.addSound(loadSound('assets/boss_music'), 0.5, "boss_music");
  assets.addSound(loadSound('assets/game_over'), 0.5, "game_over");
  assets.addSound(loadSound('assets/game_win'), 0.5, "game_win");
  assets.addSound(loadSound('assets/main_music'), 0.4, "main_music");
}

function setup() {
  createCanvas(800, 400);
  frameRate(60);
  angleMode(DEGREES);
  rectMode(CORNER);
  imageMode(CORNER);
  textAlign(CENTER, CENTER);

  /* Enlarged images for the main menu screen. */
  assets.copyImage("pollen", "pollen_large").resizeNN(128 * 2, 128);
  assets.copyImage("worker_bee", "worker_bee_large").resizeNN(128 * 2, 128);

  gravity = createVector(0, 0.1);
  game = new Game();
}

function draw() {
  game.update();
  game.draw();

  /* Reset the event's for the next frame */
  mouseGotClicked = false;
}

function mouseClicked() {
  mouseGotClicked = true;

  return false;
}