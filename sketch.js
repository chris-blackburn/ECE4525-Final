'use strict';

let game;
let assets;

function preload() {
  assets = new Assets();
  assets.addImage(loadImage('assets/myguy.png'), "myguy");
  assets.addImage(loadImage('assets/cannon.png'), "cannon");
  assets.addImage(loadImage('assets/hardbug.png'), "bugboi");
  assets.addImage(loadImage('assets/background.png'), "background");
}

function setup() {
  createCanvas(400, 400);
  frameRate(60);
  angleMode(DEGREES);
  rectMode(CENTER);
  imageMode(CENTER);

  /* Enlarged images for the main menu screen. */
  assets.copyImage("myguy", "myguy_menu").resizeNN(128, 128);
  assets.copyImage("cannon", "cannon_menu").resizeNN(144, 144);
  assets.copyImage("bugboi", "bugboi_menu").resizeNN(128, 128);

  game = new Game();
}

function draw() {
  game.update();
  game.draw();
}