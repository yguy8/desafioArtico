const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const scoreEl = document.getElementById("score");

let player = { x: 80, y: canvas.height-100, vy: 0, w: 40, h: 40, jumping: false };
let gravity = 0.6, jump = -12;
let obstacles = [];
let frame = 0, score = 0, gameOver = false;

function drawPlayer() {
  ctx.fillStyle="white";
  ctx.fillRect(player.x, player.y, player.w, player.h);
  ctx.fillStyle="orange";
  ctx.fillRect(player.x+10, player.y+30, 20,10); // pies
}

function drawObstacles() {
  ctx.fillStyle="lightblue";
  obstacles.forEach(o=>{
    ctx.fillRect(o.x,o.y,o.w,o.h);
  });
}

function update() {
  if(gameOver) return;
  frame++;
  player.vy+=gravity;
  player.y+=player.vy;

  if(player.y>canvas.height-100){
    player.y=canvas.height-100;
    player.vy=0;
    player.jumping=false;
  }

  if(frame%90===0){
    let size = Math.random()*40+30;
    obstacles.push({x:canvas.width, y:canvas.height-100, w:size, h:size});
  }
  obstacles.forEach(o=>o.x-=6);

  // colisiones
  obstacles.forEach(o=>{
    if(player.x<o.x+o.w && player.x+player.w>o.x &&
       player.y<o.y+o.h && player.y+player.h>o.y){
      gameOver=true;
    }
    if(!o.passed && o.x+o.w<player.x){
      score++; o.passed=true; scoreEl.textContent=score;
    }
  });

  obstacles = obstacles.filter(o=>o.x+o.w>0);
}

function draw() {
  ctx.fillStyle="#001f3f";
  ctx.fillRect(0,0,canvas.width,canvas.height);
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

// Controles
document.addEventListener("keydown",e=>{
  if(e.code==="Space" && !player.jumping){
    player.vy=jump; player.jumping=true;
  }
  if(gameOver && e.code==="Enter"){
    player={x:80,y:canvas.height-100,vy:0,w:40,h:40,jumping:false};
    obstacles=[]; score=0;
    scoreEl.textContent=0; gameOver=false;
  }
});
canvas.addEventListener("click",()=>{
  if(!player.jumping){ player.vy=jump; player.jumping=true; }
});
