import { Particle } from './Particle.js';

export class Fluid {
  constructor(particles) {
    this.particles = particles;
  }

  addGravity(g) {
    for (const p of particles) {
      p.addForce({x: p.mass * g.x, y: p.mass * g.y});
    }
  }
}
