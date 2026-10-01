export class Particle {
  constructor(x, y, mass) {
    this.mass = mass;

    this.density = 0;
    this.pressure = 0;

    this.pos = {
      x,
      y
    };

    this.vel = {
      x: 0,
      y: 0
    };

    this.accel = {
      x: 0,
      y: 0
    };

    this.forces = [];
  }

  addForce(force) {
    this.forces.push(force);
  }

  update(dt) {
    let fx = 0;
    let fy = 0;

    for (const force of this.forces) {
      fx += force.x;
      fy += force.y;
    }

    this.forces.length = 0;

    this.accel.x = fx / this.mass;
    this.accel.y = fy / this.mass;

    this.vel.x += this.accel.x * dt;
    this.vel.y += this.accel.y * dt;

    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;
  }

  draw(ctx, radius) {
    ctx.beginPath();
    ctx.arc(
      this.pos.x,
      this.pos.y,
      radius * Math.sqrt(this.mass),
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}
