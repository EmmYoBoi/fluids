import { Particle } from './Particle.js';

export class Fluid {
  constructor(particles, density, k, viscosity) {
    this.particles = particles;
    this.density = density;
    this.k = k;
    this.viscosity = viscosity;
  }

  addGravity(g) {
    for (const p of this.particles) {
      p.addForce({x: p.mass * g.x, y: p.mass * g.y});
    }
  }

  addDensity(kernel) {
    for (const p of this.particles) {
      for (const q of this.particles) {
        p.density += q.mass * kernel(Math.hypot(
          p.pos.x-q.pos.x,
          p.pos.y-q.pos.y
        ));
      }
    }
  }

  addPressure() {
    for (const p of this.particles) {
      p.pressure = this.k * (p.density - this.density);
    }
  }

  addPressureForce(Dkernel) {
    for (const p of this.particles) {
      for (const q of this.particles) {
        let r = Math.hypot(p.pos.x-q.pos.x, p.pos.y-q.pos.y);
        p.addForce({
          x: -1 * q.mass * (p.pressure + q.pressure) * Dkernel(r).x / (2 * q.density),
          y: -1 * q.mass * (p.pressure + q.pressure) * Dkernel(r).y / (2 * q.density)
        });
      }
    }
  }

  addViscosityForce(kernel) {
    for (const p of this.particles) for (const q of this.particles) {
      let r = Math.hypot(p.pos.x-q.pos.x, p.pos.y-q.pos.y);
      p.addForce({
        x: this.viscosity * (q.vel.x - p.vel.x) * kernel(r),
        y: this.viscosity * (q.vel.y - p.vel.y) * kernel(r)
      });
    }
  }
}
