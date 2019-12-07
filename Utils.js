'use strict';

let utils = {
  half: function(n) {
      return n >> 1;
  },

  /* Returns true if the mouse is within a certain boxed region. x, y is center */
  mouseWithin: function(x, y, w, h) {
    return mouseX >= x - w / 2 &&
           mouseX <= x + w / 2 &&
           mouseY >= y - h / 2 &&
           mouseY <= y + h / 2;
  },

  /* Helper function that checks collision between two rectangles.
   * This assumes the rectangles given have parameters x, y, w, h,
   * and that the x, y coordinates represent the center of the rect. */
  checkBoxCollision: function(r1, r2) {
    if (r1.x < r2.x + r2.w &&
        r1.x + r1.w > r2.x &&
        r1.y < r2.y + r2.h &&
        r1.y + r1.h > r2.y) {
        return true;
    }

    return false;
  },

  dottedLine: function(x1, y1, x2, y2) {
    for (let i = 0; i <= 10; i++) {
      let x = lerp(x1, x2, i / 10.0);
      let y = lerp(y1, y2, i / 10.0);
      point(x, y);
    }
  },

  makeRect: function(x, y, w, h) {
    let r = {
      x: x,
      y: y,
      w: w,
      h: h
    }

    /* Replace height with width for 3 args passed */
    if (arguments.length === 3) {
      r.w = w;
      r.h = w;
    } else if (arguments.length === 2) {
      r.w = tilesize;
      r.h = tilesize;
    }

    return r;
  },

  /* From p5js reference https://p5js.org/examples/color-linear-gradient.html */
  setGradient: function(x, y, w, h, c1, c2, axis) {
    noFill();
  
    if (axis === 1) {
      // Top to bottom gradient
      for (let i = y; i <= y + h; i++) {
        let inter = map(i, y, y + h, 0, 1);
        let c = lerpColor(c1, c2, inter);
        stroke(c);
        line(x, i, x + w, i);
      }
    } else if (axis === 2) {
      // Left to right gradient
      for (let i = x; i <= x + w; i++) {
        let inter = map(i, x, x + w, 0, 1);
        let c = lerpColor(c1, c2, inter);
        stroke(c);
        line(i, y, i, y + h);
      }
    }
  }
};

/**
 * Found on https://github.com/processing/p5.js/issues/1845
 * Credit to gncgnc
 * 
 * I made some pixel art, and I wanted to be able to scale it here with
 * nearest neighbors (so it doesn't make it fuzzy).
 * 
 * Resize the image to a new width and height using nearest neigbor algorithm. To make the image scale
 * proportionally, use 0 as the value for the wide or high parameter.
 * For instance, to make the width of an image 150 pixels, and change
 * the height using the same proportion, use resize(150, 0). 
 * Otherwise same usage as the regular resize().
 * 
 * Note: Disproportionate resizing squashes the "pixels" from squares to rectangles. 
 * This works about 10 times slower than the regular resize. Any suggestions for performance increase are welcome.
 */

p5.Image.prototype.resizeNN = function(width, height) {
    if (width === 0 && height === 0) {
      width = this.canvas.width;
      height = this.canvas.height;
    } else if (width === 0) {
      width = this.canvas.width * height / this.canvas.height;
    } else if (height === 0) {
      height = this.canvas.height * width / this.canvas.width;
    }
  
    width = Math.floor(width);
    height = Math.floor(height);
  
    var temp = createImage(width,height),
      xScale = width / this.width ,
      yScale = height / this.height
  
    this.loadPixels()
    temp.loadPixels()
    for(var x=0; x<temp.width; x++) {
      for(var y=0; y<temp.height; y++) {
        var sourceInd = 4*(Math.floor(y/yScale)*this.width + Math.floor(x/xScale))
        var targetInd = 4*(y*temp.width + x)
        var sourceP = this.pixels.slice(sourceInd,sourceInd+4)//this.get(x/wScale, y/hScale)
        temp.pixels[targetInd] = sourceP[0]
        temp.pixels[targetInd+1] = sourceP[1]
        temp.pixels[targetInd+2] = sourceP[2]
        temp.pixels[targetInd+3] = sourceP[3]
      }
    }
    temp.updatePixels()
    this.updatePixels()
  
    this.canvas.width = this.width = width;
    this.canvas.height = this.height = height;
  
    this.drawingContext.drawImage(temp.canvas,
      0, 0, width, height,
      0, 0, width, height
    )
  };