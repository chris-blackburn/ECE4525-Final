'use strict';

let game;
let assets;
let mouseGotClicked = false;

let tilesize = 16;
let levels = [
  ["wwwwwwwwwwwwwwwwwwwwwwwww",
  "w                       w",
  "w                       w",
  "w                       w",
  "w                       w",
  "w                       w",
  "w                       w",
  "w                       w",
  "w                       w",
  "w                       w",
  "w                       w",
  "w                       w",
  "w                       w",
  "w                       w",
  "w                       w",
  "w                       w",
  "w                       w",
  "w                       w",
  "w                       w",
  "w                       w",
  "w                       w",
  "w                       w",
  "w                       w",
  "w   p                   w",
  "wwwwwwwwwwwwwwwwwwwwwwwww",]
];

function preload() {
  assets = new Assets();
  assets.addImage(loadImage('assets/myguy.png'), "myguy");
  assets.addImage(loadImage('assets/cannon.png'), "cannon");
  assets.addImage(loadImage('assets/hardbug.png'), "bugboi");
  assets.addImage(loadImage('assets/background.png'), "background");

  assets.addFont(loadFont('assets/A_Goblin_Appears.otf'), "options_font");
}

function setup() {
  createCanvas(400, 400);
  frameRate(60);
  angleMode(DEGREES);
  rectMode(CORNER);
  imageMode(CORNER);
  textAlign(CENTER, CENTER);

  /* Enlarged images for the main menu screen. */
  assets.copyImage("myguy", "myguy_menu").resizeNN(128, 128);
  assets.copyImage("cannon", "cannon_menu").resizeNN(144, 144);
  assets.copyImage("bugboi", "bugboi_menu").resizeNN(128, 128);

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