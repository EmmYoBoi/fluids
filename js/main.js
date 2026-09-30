//Basic DOM init
let canvas = document.getElementById('screen');
let ctx = canvas.getContext("2d");

canvas.width = window.getInnerWidth;
canvas.height = window.getInnerHeight;

window.addEventListener('resize', ()=>{
  canvas.width = window.getInnerWidth;
  canvas.height = window.getInnerHeight;
});

//Test to see if ctx is working properly
ctx.fillRect(0,0,10,10);
