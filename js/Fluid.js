import { Particle } from './Particle.js';

export class Fluid {
  constructor(particles, density) {
    this.particles = particles;
    this.density = density;
  }

  addGravity(g) {
    for (const p of particles) {
      p.addForce({x: p.mass * g.x, y: p.mass * g.y});
    }
  }

  addDensity(kernel) {
    for (const p of particles) {
      for (const q of particles) {
        p.density += q.mass * kernel(Math.hypot(
          Math.abs(p.pos.x-q.pos.x),
          Math.abs(p.pos.y-q.pos.y)
        ));
      }
    }
  }
}
