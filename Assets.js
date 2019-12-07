'use strict';

/* Instead of having globals for any assets I need to include, I created a class
 * for them. Management of assets is encapsulated here. */
class Assets {
    images;
    fonts;

    constructor() {
        soundFormats("mp3");
        this.images = {};
        this.fonts = {};
        this.sounds = {};
    }

    addFont(font, name) {
        this.fonts[name] = font;
    }

    getFont(name) {
        return this.fonts[name];
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

    addSound(sound, volume, name) {
        this.sounds[name] = sound;
        this.sounds[name].setVolume(volume);
    }

    playSound(name) {
        this.sounds[name].play();
    }

    drawImage(name, x, y, w, h) {
        image(this.images[name], x, y, w, h);
    }
}