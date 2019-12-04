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
  assets.addImage(loadImage('assets/myguy.png'), "myguy");
  assets.addImage(loadImage('assets/cannon.png'), "cannon");
  assets.addImage(loadImage('assets/hardbug.png'), "bugboi");
  assets.addImage(loadImage('assets/background.png'), "background");

  assets.addFont(loadFont('assets/A_Goblin_Appears.otf'), "options_font");

  assets.addImage(loadImage('assets/grassy_tileset_ordered.png'), "grassy_tileset");
}

function setup() {
  createCanvas(1000, 400);
  frameRate(60);
  angleMode(DEGREES);
  rectMode(CORNER);
  imageMode(CORNER);
  textAlign(CENTER, CENTER);

  /* Enlarged images for the main menu screen. */
  assets.copyImage("myguy", "myguy_menu").resizeNN(128, 128);
  assets.copyImage("cannon", "cannon_menu").resizeNN(144, 144);
  assets.copyImage("bugboi", "bugboi_menu").resizeNN(128, 128);

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