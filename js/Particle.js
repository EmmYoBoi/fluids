export class Particle {
  constructor(x, y, mass) {
    this.mass = mass;
    this.density = 0;
    
    this.pos = {
      x: x,
      y: y
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

    this.sf = {
      x: 0,
      y: 0
    }
  }
  
  update(dt) {
    for (const f in this.forces) {
      this.sf.x += f.x;
      this.sf.y += f.y;
    }

    this.forces = [];

    this.accel.x = this.sf.x/this.mass;
    this.accel.y = this.sf.y/this.mass;

    this.vel.x += this.accel.x * dt;
    this.vel.y += this.accel.y * dt;

    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;
  }

  draw(ctx, BASIC_RADIUS) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, BASIC_RADIUS*Math.sqrt(this.mass), 0, Math.PI*2);
    ctx.fill();
  }

  addForce(f) {
    this.forces.push(f);
  }
}
