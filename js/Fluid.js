import { Particle } from './Particle.js';

export class Fluid {
  constructor(particles, density, k, viscosity, container) {
    this.particles = particles;
    this.density = density;
    this.k = k;
    this.viscosity = viscosity;
    this.container = container;
  }

  update(dt, g, kernel, Dkernel) {
    this.addGravity(g);
    this.addDensity(kernel);
    this.addPressure();
    this.addPressureForce(Dkernel);
    this.addViscosityForce(kernel);

    for (const p of this.particles) {
      p.update(dt);
    }

    this.addContainerInflection();
  }

  draw(ctx, BASIC_RADIUS) {
    for (const p of this.particles) {
      p.draw(ctx, BASIC_RADIUS);
    }
  }

  addGravity(g) {
    for (const p of this.particles) {
      p.addForce({
        x: p.mass * g.x,
        y: p.mass * g.y
      });
    }
  }

  addDensity(kernel) {
    for (const p of this.particles) {
      let density = 0;

      for (const q of this.particles) {
        const dx = p.pos.x - q.pos.x;
        const dy = p.pos.y - q.pos.y;

        const r = Math.hypot(dx, dy);

        density += q.mass * kernel(r);
      }

      // Prevent division by zero later.
      p.density = Math.max(density, 0.000001);
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
        if (p === q) continue;

        const dx = p.pos.x - q.pos.x;
        const dy = p.pos.y - q.pos.y;

        const gradient = Dkernel(dx, dy);

        const pressureTerm =
          p.pressure / (p.density * p.density) +
          q.pressure / (q.density * q.density);

        const factor = -q.mass * pressureTerm;

        p.addForce({
          x: factor * gradient.x,
          y: factor * gradient.y
        });
      }
    }
  }

  addViscosityForce(kernel) {
    for (const p of this.particles) {
      for (const q of this.particles) {
        if (p === q) continue;

        const dx = p.pos.x - q.pos.x;
        const dy = p.pos.y - q.pos.y;

        const r = Math.hypot(dx, dy);

        const influence = kernel(r);

        p.addForce({
          x:
            this.viscosity *
            q.mass *
            (q.vel.x - p.vel.x) *
            influence /
            q.density,

          y:
            this.viscosity *
            q.mass *
            (q.vel.y - p.vel.y) *
            influence /
            q.density
        });
      }
    }
  }

  addContainerInflection() {
    const r = 3;
  
    for (const p of this.particles) {
  
      // Left
      if (p.pos.x < this.container.x + r) {
        p.pos.x = this.container.x + r;
  
        if (p.vel.x < 0) {
          p.vel.x *= -1;
        }
      }
  
      // Right
      if (p.pos.x > this.container.x + this.container.dx - r) {
        p.pos.x = this.container.x + this.container.dx - r;
  
        if (p.vel.x > 0) {
          p.vel.x *= -1;
        }
      }
  
      // Top
      if (p.pos.y < this.container.y + r) {
        p.pos.y = this.container.y + r;
  
        if (p.vel.y < 0) {
          p.vel.y *= -1;
        }
      }
  
      // Bottom
      if (p.pos.y > this.container.y + this.container.dy - r) {
        p.pos.y = this.container.y + this.container.dy - r;
  
        if (p.vel.y > 0) {
          p.vel.y *= -1;
        }
      }
    }
  }
}
