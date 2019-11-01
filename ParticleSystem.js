'use strict';

/* A particle system allows you to control many particles at once and apply a
 * force to each particle in the system. */
class ParticleSystem {
    constructor(x, y, n, limit = 300) {
        this.position = createVector(x, y);
        this.particles = (() => {
            let arr = [];
            for (let i = 0; i < n; i++) {
                arr.push(new Particle(x, y));
            }
            return arr;
        })();

        this.limit = limit;
    }

    /* We may want to add particles to a system incrementally so they're lives
     * don't all match (or else they will dissappear all at once). */
    addParticle() {
        /* Limit the number of particles we can add to a single system. */
        if (this.particles.length <= this.limit) {
            this.particles.push(new Particle(this.position.x, this.position.y));
        }
    }

    /* Apply a force to the system of particles. */
    applyForce(force) {
        this.particles.forEach((particle) => {
            particle.applyForce(force);
        });
    }

    /* To satisfy a similar API for all objects, I include weak version of the
     * update function. */
    update() {
        return; /* Noop */
    }

    draw() {
        /* Instead of separating the update and draw functions, I put them in
         * the same call to avoid looping through each one unnecessarily. */
        this.particles.forEach((particle) => {
            /* Dead particles get reused. */
            if (particle.dead()) {
                particle.reset(this.position.x, this.position.y);
            }

            particle.update();
            particle.draw();
        });
    }
}