'use strict';

/* Base class for most entities in the game world */
class Entity {
    constructor(x, y, w, h) {
        this.position = createVector(x, y);

        /* 3 arguments for square shaped object */
        if (arguments.length === 4) {
            this.w = w;
            this.h = h;
        } else if (arguments.length === 3) {
            this.w = w;
            this.h = w;
        }

        this.oldPosition = this.position.copy();

        this.angle = 0;

        /* this.mass = 1; */
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
    }

    /* Get the effective collision box of this entity */
    getCollisionBox() {
        return {
            x: this.position.x,
            y: this.position.y,
            w: this.w,
            h: this.h
        }
    }

    /* Given 2 collision boxes, resolve a collision */
    resolveCollision(cb, othercb) {
        /* I was above */
        if (this.oldPosition.y + cb.h <= othercb.y) {
            this.position.y = othercb.y - cb.h;
            /* TODO: Move to cannonball */
            if (this instanceof Cannonball) {
                this.velocity.y *= -1;
            } else {
                this.velocity.y = 0;
            }

            /* TODO: make more sophisticated collision to move this to
            * player class */
            if (this instanceof Player) {
                this.jumping = false;
                this.cannonHit = false;
            }

        /* I was below */
        } else if (this.oldPosition.y >= othercb.y + othercb.h) {
            this.position.y = othercb.y + othercb.h;
            /* TODO: Move to cannonball */
            if (this instanceof Cannonball) {
                this.velocity.y *= -1;
            } else {
                this.velocity.y = 0;
            }

        /* I was to the left */
        } else if (this.oldPosition.x + cb.w <= othercb.x) {
            this.position.x = othercb.x - cb.w;
            /* TODO: Move to cannonball */
            if (this instanceof Cannonball) {
                this.velocity.x *= -1;
            } else {
                this.velocity.x = 0;
            }

        /* I was to the right */
        } else if (this.oldPosition.x >= othercb.x + othercb.w) {
            this.position.x = othercb.x + othercb.w;
            /* TODO: Move to cannonball */
            if (this instanceof Cannonball) {
                this.velocity.x *= -1;
            } else {
                this.velocity.x = 0;
            }
        }
    }

    /* Instead of checking a list of objects, only check surrounding objects */
    fixWallCollisionsFast(tilemap) {
        if (this instanceof Boss || this instanceof Projectile) {
            return false;
        }

        let cb = this.getCollisionBox();
        let filteredTiles = tilemap.getSpanningLogicalTiles(cb.x, cb.y, cb.w, cb.h);
        return this.fixWallCollisions(tilemap, filteredTiles);
    }

    /* Fix collision between this object and another */
    fixWallCollisions(tilemap, objs) {
        let cb = this.getCollisionBox();

        for (let i = 0; i < objs.length; i++) {
            let othercb = objs[i].getCollisionBox();

            if (utils.checkBoxCollision(cb, othercb)) {
                /* Collect the collectable */
                if (objs[i] instanceof Collectable) {
                    if (this instanceof Player && !objs[i].collected) {
                        this.collectablesFound += 1;
                        objs[i].collected = true;
                    }

                    continue;

                /* No bounce off thorns, player loses health */
                } else if (objs[i] instanceof Thorns) {
                    if (this instanceof Cannonball) {
                        this.bouncesLeft = 0;
                    } else if (this instanceof Player) {
                        this.takeHealth(2);
                        this.resolveCollision(cb, othercb);
                    }

                /* Trigger the final boss */
                } else if (objs[i] instanceof HiddenTrigger) {
                    if (this instanceof Player && !objs[i].triggered) {
                        tilemap.finalBoss.activate();
                        tilemap.hiddenTriggers.forEach((ht) => {
                            ht.disable();
                        });
                    }

                    continue;
                } else {
                    this.resolveCollision(cb, othercb);
                }

                return true;
            }
        }

        return false;
    }

    /* For use with cannonball primarily */
    fixEnemyCollisions(tilemap) {
        let cb = this.getCollisionBox();

        for (let i = 0; i < tilemap.enemies.length; i++) {
            if (tilemap.enemies[i] instanceof Boss && !tilemap.finalBoss.active) {
                continue;
            }

            let enemycb = tilemap.enemies[i].getCollisionBox();

            if (utils.checkBoxCollision(cb, enemycb)) {
                this.resolveCollision(cb, enemycb);
                if (tilemap.enemies[i] instanceof Boss) {
                    tilemap.enemies[i].takeHealth(tilemap);
                }

                return true;
            }
        }

        return false;
    }

    /* Returns the center x, y of this entity */
    getCenter() {
        return createVector(this.position.x + this.w / 2, this.position.y + this.h / 2);
    }

    /* update the entity - pass in a backreference to the game */
    update(game) {
        this.oldPosition = this.position.copy();
        this.velocity.add(this.acceleration);

        if (game) {
            let collided = false;
            /* To allow wall sliding, we need to update and check x/y separately */
            this.position.x += this.velocity.x;
            collided |= this.fixWallCollisionsFast(game.tilemaps[game.currentLevel]);

            /* Cannon ball collision with enemies */
            if (this instanceof Cannonball && this.fired) {
                collided |= this.fixEnemyCollisions(game.tilemaps[game.currentLevel]);
            }

            /* Simple enemy changes direction when it hits a wall */
            if (this instanceof SimpleEnemy && collided) {
                this.dir *= -1;
            }

            this.position.y += this.velocity.y;
            collided |= this.fixWallCollisionsFast(game.tilemaps[game.currentLevel]);

            if (this instanceof Cannonball && this.fired) {
                collided |= this.fixEnemyCollisions(game.tilemaps[game.currentLevel]);
            }

            /* TODO: make specific to cannonball */
            if (this instanceof Cannonball && collided) {
                if (this.bouncesLeft > 0) {
                    assets.playSound("seed_man_bullet_bounce");
                }

                if (--this.bouncesLeft < 0) {
                    this.reset();
                }
            }

            if (this instanceof Player && this.velocity.y <= 0) {
                this.velocity.limit(8);
            }
        } else {
            this.position.add(this.velocity);
        }
        
        this.acceleration.mult(0);

        /* Only change angle if velocity is non-zero */
        if (this.velocity.mag() !== 0) {
            this.angle = this.velocity.heading();
        }
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    draw() {
        let center = this.getCenter();

        /* Draw a bounding rectangle and a line from the center rotated at the
         * current angle. */
        fill(255, 0, 0);
        stroke(0, 0, 0);
        strokeWeight(1);
        rect(this.position.x, this.position.y, this.w, this.h);
        push();
        translate(center.x, center.y);
        rotate(this.angle);
        line(0, 0, max(this.w, this.h), 0);
        pop();
    }
}