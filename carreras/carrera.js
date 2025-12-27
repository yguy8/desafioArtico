const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const scoreEl = document.getElementById("score");

let player = { x: canvas.width/2-25, y: canvas.height-100, w: 50, h: 80, vx: 0 };
let obstacles = [];
let distance = 0;
let gameOver = false;

function drawPlayer() {
  ctx.fillStyle="blue";
  ctx.fillRect(player.x, player.y, player.w, player.h);
}

function drawObstacles() {
  ctx.fillStyle="red";
  obstacles.forEach(o=>{
    ctx.fillRect(o.x,o.y,o.w,o.h);
  });
}

function update() {
  if(gameOver) return;

  // mover jugador
  player.x += player.vx;
  if(player.x<0) player.x=0;
  if(player.x+player.w>canvas.width) player.x=canvas.width-player.w;

  // generar obstáculos
  if(Math.random()<0.02){
    let lane = Math.floor(Math.random()*3);
    let laneWidth = canvas.width/3;
    obstacles.push({x:lane*laneWidth+laneWidth/2-25,y:-100,w:50,h:80});
  }

  // mover obstáculos
  obstacles.forEach(o=>o.y+=6);

  // colisiones
  obstacles.forEach(o=>{
    if(player.x<o.x+o.w && player.x+player.w>o.x &&
       player.y<o.y+o.h && player.y+player.h>o.y){
      gameOver=true;
    }
  });

  // limpiar obstáculos fuera
  obstacles = obstacles.filter(o=>o.y<canvas.height);

  // distancia
  distance++;
  scoreEl.textContent="Distancia: "+distance;
}

function draw() {
  ctx.fillStyle="#333";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // carriles
  ctx.strokeStyle="white";
  ctx.lineWidth=4;
  ctx.setLineDash([20,20]);
  ctx.beginPath();
  ctx.moveTo(canvas.width/3,0);
  ctx.lineTo(canvas.width/3,canvas.height);
  ctx.moveTo(2*canvas.width/3,0);
  ctx.lineTo(2*canvas.width/3,canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  drawPlayer();
  drawObstacles();

  if(gameOver){
    ctx.fillStyle="red"; ctx.font="40px sans-serif";
    ctx.fillText("GAME OVER",canvas.width/2-100,canvas.height/2);
    ctx.font="20px sans-serif";
    ctx.fillText("Presiona Enter para reiniciar",canvas.width/2-120,canvas.height/2+40);
  }
}

function loop(){
  update(); draw();
  requestAnimationFrame(loop);
}
loop();

// controles
document.addEventListener("keydown",e=>{
  if(e.code==="ArrowLeft"){ player.vx=-6; }
  if(e.code==="ArrowRight"){ player.vx=6; }
  if(gameOver && e.code==="Enter"){
    player={x:canvas.width/2-25,y:canvas.height-100,w:50,h:80,vx:0};
    obstacles=[]; distance=0;
    scoreEl.textContent="Distancia: 0"; gameOver=false;
  }
});
document.addEventListener("keyup",e=>{
  if(e.code==="ArrowLeft"||e.code==="ArrowRight"){ player.vx=0; }
});
