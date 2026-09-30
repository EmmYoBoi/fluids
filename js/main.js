//Basic DOM init
let canvas = document.getElementById('screen');
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', ()=>{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

//Test to see if ctx is working properly
ctx.fillRect(0,0,10,10);
