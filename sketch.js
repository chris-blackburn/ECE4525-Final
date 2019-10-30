'use strict';

let game;

function setup() {
  createCanvas(400, 400);
  frameRate(60);

  game = new Game();
}

function draw() {
  game.update();
  game.draw();
}