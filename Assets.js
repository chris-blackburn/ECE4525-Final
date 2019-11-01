'use strict';

/* Instead of having globals for any assets I need to include, I created a class
 * for them. Management of assets is encapsulated here. */
class Assets {
    images;

    constructor() {
        this.images = {};
    }

    addImage(img, name) {
        this.images[name] = img;
    }

    getImage(name) {
        return this.images[name];
    }

    copyImage(sourceName, destName) {
        this.images[destName] = this.images[sourceName].get();
        return this.images[destName];
    }

    drawImage(name, x, y, w, h) {
        image(this.images[name], x, y, w, h);
    }
}