import { Particle } from './Particle.js';
import { Fluid } from './Fluid.js';

// ========================
// Basic DOM init
// ========================

const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener('resize', resizeCanvas);


// ========================
// Simulation constants
// ========================

const CONTAINER_DIMENSIONS = {
  x: 50,
  y: 50,
  dx: 250,
  dy: 250
};

// Physics uses small fixed timesteps.
// Several steps are performed per rendered frame.
const DT = 0.01;


// ========================
// Physical constants
// ========================

const GRAVITY_ACCEL = {
  x: 0,
  y: 500
};

const PARTICLE_RADIUS = 3;

const PARTICLE_MASS = 1;

const FLUID_DENSITY = 0.03;
const FLUID_K = 3000;
const FLUID_VISCOSITY = 8;

const PARTICLE_NUM = 1000;


// ========================
// SPH kernel
// ========================

// Smoothing radius.
// Particles only interact with particles
// within this distance.
const H = 20;


// Poly6 kernel.
//
// W(r) = 4/(πh^8) * (h²-r²)^3
//
// for 0 <= r < h
// and 0 otherwise.

const KERNEL = (r) => {
  if (r >= H) return 0;

  const h2 = H * H;
  const diff = h2 - r * r;

  return (
    4 / (Math.PI * Math.pow(H, 8))
  ) * Math.pow(diff, 3);
};


// Gradient of the poly6 kernel.
//
// ∇W = -24/(πh^8)
//      * (h²-r²)²
//      * (dx, dy)

const DKERNEL = (dx, dy) => {
  const r2 = dx * dx + dy * dy;

  if (r2 >= H * H || r2 === 0) {
    return {
      x: 0,
      y: 0
    };
  }

  const diff = H * H - r2;

  const factor =
    -24 /
    (Math.PI * Math.pow(H, 8)) *
    diff * diff;

  return {
    x: factor * dx,
    y: factor * dy
  };
};


// ========================
// Particle generation
// ========================

// Generate a roughly rectangular blob rather than
// randomly scattering particles through the container.

const generateParticles = (n) => {
  const particles = [];

  const spacing = 10;

  const startX = CONTAINER_DIMENSIONS.x + 100;
  const startY =
    CONTAINER_DIMENSIONS.y +
    CONTAINER_DIMENSIONS.dy -
    180;

  const columns = 20;
  const rows = Math.ceil(n / columns);

  for (let i = 0; i < n; i++) {
    const column = i % columns;
    const row = Math.floor(i / columns);

    // Tiny random displacement prevents a perfectly
    // crystalline initial configuration.
    const jitter = 1.5;

    const x =
      startX +
      column * spacing +
      (Math.random() - 0.5) * jitter;

    const y =
      startY +
      row * spacing +
      (Math.random() - 0.5) * jitter;

    particles.push(
      new Particle(
        x,
        y,
        PARTICLE_MASS
      )
    );
  }

  return particles;
};


// ========================
// Fluid
// ========================

const FLUID = new Fluid(
  generateParticles(PARTICLE_NUM),
  FLUID_DENSITY,
  FLUID_K,
  FLUID_VISCOSITY,
  CONTAINER_DIMENSIONS
);


// ========================
// Simulation
// ========================

function simulate() {
    FLUID.update(
      DT,
      GRAVITY_ACCEL,
      KERNEL,
      DKERNEL
    );
}


// ========================
// Rendering
// ========================

function draw() {
  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  // Container
  ctx.beginPath();

  ctx.rect(
    CONTAINER_DIMENSIONS.x,
    CONTAINER_DIMENSIONS.y,
    CONTAINER_DIMENSIONS.dx,
    CONTAINER_DIMENSIONS.dy
  );

  ctx.stroke();

  // Fluid
  FLUID.draw(
    ctx,
    PARTICLE_RADIUS
  );
}


// ========================
// Main loop
// ========================

function loop() {
  simulate();
  draw();
}

setInterval(()=>{loop()}, DT*1000);
