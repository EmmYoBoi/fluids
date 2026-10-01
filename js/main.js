import { Particle } from './Particle.js';
import { Fluid } from './Fluid.js';

//Basic DOM init
let canvas = document.getElementById('screen');
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', ()=>{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

//Sim consts
const CONTAINER_DIMENSIONS = {
  x: 50,
  y: 50,
  dx: 500,
  dy: 500
};
const DT = 0.1;

//Physic consts
const GRAVITY_ACCEL = 9.81;
const PARTICLE_RADIUS = 3;
const FLUID_DENSITY = 1;
const FLUID_K = 1;
const FLUID_VISCOSITY = 1;
const PARTICLE_NUM = 50;

//kernels

const KERNEL = (r) => {
  return (1/(r*r)+1);
}

const DKERNEL = (dx, dy) => {
  const r2 = dx * dx + dy * dy;

  return {
    x: -2 * dx / Math.pow(r2 + 1, 2),
    y: -2 * dy / Math.pow(r2 + 1, 2)
  };
}

const generateParticles = (x, y, dx, dy, n) => {
  let res = [];
  for (const i in [...Array(n)]) {
    let rx = Math.random()*dx + x;
    let ry = Math.random()*dy + y;
    res.push(new Particle(rx, ry, 1));
  }
  return res;
}

const FLUID = new Fluid(
  generateParticles(
    CONTAINER_DIMENSIONS.x,
    CONTAINER_DIMENSIONS.y,
    CONTAINER_DIMENSIONS.dx,
    CONTAINER_DIMENSIONS.dy,
    PARTICLE_NUM
  ), 
  FLUID_DENSITY,
  FLUID_K,
  FLUID_VISCOSITY
);

const Sim = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  FLUID.update(DT, GRAVITY_ACCEL, KERNEL, DKERNEL);
  FLUID.draw(ctx, PARTICLE_RADIUS);
  console.log('drew');
}

setInterval(() => {Sim()}, DT*1000);
