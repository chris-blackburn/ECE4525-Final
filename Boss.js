'use strict';

/* The final boss */
class Boss extends Entity {
    constructor(x, y) {
        super(x, y, tilesize * 2);
        this.size = tilesize * 2;

        /* Final boss should not try to attack until activated */
        this.active = false;

        this.totalHealth = 50;
        this.health = this.totalHealth;

        this.moveTimer = new Cooldown(5000);
        this.invincibleTimer = new Cooldown(300);
        this.attackTimer = new Cooldown(3000);

        this.currentProjectile = 0;
        this.projectiles = (() => {
            let arr = [];
            for (let i = 0; i < 5; i++) {
                arr.push(new Projectile(0, 0));
            }
            return arr;
        })();

        this.flyingFrames = new Keyframes([
            utils.makeRect(            0, 0),
            utils.makeRect(    this.size, 0),
            utils.makeRect(this.size * 2, 0),
            utils.makeRect(    this.size, 0),
        ], 50);
        this.flyingFrames.start();

        this.dir = 1;
    }

    activate() {
        this.active = true;
        assets.stopSound("main_music");
        assets.loopSound("boss_music");
    }

    /* Take more health depending on progression */
    takeHealth(tilemap) {
        if (this.invincibleTimer.expired) {
            this.invincibleTimer.start();
            let damage = map(tilemap.player.collectablesFound, 0, tilemap.totalCollectables, 1, 5);
            this.health = max(0, this.health - damage);
        }
    }

    shoot(from, to) {
        let p = this.projectiles[this.currentProjectile++];
        p.position = from.copy();
        p.fired = true;

        let shootForce = p5.Vector.sub(to, from);
        shootForce.normalize();
        shootForce.mult(2.2);
        p.applyForce(shootForce);

        if (this.currentProjectile >= this.projectiles.length) {
            this.currentProjectile = 0;
        }
    }

    update(game) {
        if (this.active) {
            let player = game.tilemaps[game.currentLevel].player;
            if (this.attackTimer.expired) {
                this.attackTimer.start();
                this.shoot(this.getCenter(), player.getCenter());
            }

            if (this.moveTimer.expired) {
                this.moveTimer.start();

                /* Set another attraction point */
                this.attractPointAngle = p5.Vector.fromAngle(random(190, 350));
                this.attractPointAngle.setMag(180);

            } else {
                let attractPoint = p5.Vector.add(this.attractPointAngle, player.position);
                let attractForce = p5.Vector.sub(attractPoint, this.position);
                attractForce.mult(0.01);
                this.velocity.mult(0.95);
                this.applyForce(attractForce);
            }

            let toPlayer = p5.Vector.sub(player.position, this.position);
            this.dir = toPlayer.x;

            super.update(game);
            this.attackTimer.update();
            this.moveTimer.update();
            this.invincibleTimer.update();
            this.flyingFrames.update();
            this.projectiles.forEach((projectile) => {
                if (projectile.fired && utils.checkBoxCollision(player.getCollisionBox(), projectile.getCollisionBox())) {
                    projectile.fired = false;
                    player.takeHealth(1);
                }
                projectile.update(game);
            });
        }
    }

    draw(camera) {
        if (this.active) {
            let dx = this.position.x;
            let dy = this.position.y;

            let cf = this.flyingFrames.getCurrent();

            push();
            if (this.dir < 0) {
                scale(-1, 1);
                dx = (dx * -1) - tilesize;
            }
    
            image(assets.getImage("queen_bee"), floor(dx), dy, this.size, this.size, cf.x, cf.y, this.size, this.size);
            pop();

            this.projectiles.forEach((projectile) => {
                projectile.draw(camera);
            });
        }
    }
}