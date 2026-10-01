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
    for (const p of this.particles) p.update(dt);
    this.addContainerInflection();
  }

  draw(ctx, BASIC_RADIUS) {
    for (const p of this.particles) p.draw(ctx, BASIC_RADIUS);
  }

  addGravity(g) {
    for (const p of this.particles) {
      p.addForce({x: p.mass * g.x, y: p.mass * g.y});
    }
  }

  addDensity(kernel) {
    for (const p of this.particles) {
      p.density = 0;
      
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
        if (p === q) continue;
  
        const dx = p.pos.x - q.pos.x;
        const dy = p.pos.y - q.pos.y;
  
        const gradient = Dkernel(dx, dy);
  
        const factor =
          -q.mass *
          (p.pressure + q.pressure) /
          (2 * q.density);
  
        p.addForce({
          x: factor * gradient.x,
          y: factor * gradient.y
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

  addContainerInflection() {
    for (const p of this.particles) {
      if (p.pos.x <= this.container.x || p.pos.x >= this.container.x + this.container.dx) {
        this.vel.x *= -1;
        if (p.pos.x <= this.container.x) p.pos.x = this.container.x;
        else p.pos.x = this.conatiner.x + this.container.dx;
      }
      
      if (p.pos.y <= this.container.y || p.pos.y >= this.container.y + this.container.dy) {
        this.vel.y *= -1;
        if (p.pos.y <= this.container.y) p.pos.y = this.container.y;
        else p.pos.y = this.conatiner.y + this.container.dy;
      }
    }
  }
}
