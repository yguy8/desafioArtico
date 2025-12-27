const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const scoreEl = document.getElementById("score");

let player = { x: 80, y: canvas.height/2, w: 40, h: 40, vy: 0 };
let bullets = [];
let enemies = [];
let score = 0;
let gameOver = false;

// Dibujar jugador
function drawPlayer() {
  ctx.fillStyle="white";
  ctx.fillRect(player.x, player.y, player.w, player.h);
}

// Dibujar balas
function drawBullets() {
  ctx.fillStyle="yellow";
  bullets.forEach(b=>{
    ctx.fillRect(b.x,b.y,b.w,b.h);
  });
}

// Dibujar enemigos
function drawEnemies() {
  ctx.fillStyle="red";
  enemies.forEach(e=>{
    ctx.fillRect(e.x,e.y,e.w,e.h);
  });
}

// Actualizar lógica
function update() {
  if(gameOver) return;

  // Movimiento jugador
  player.y += player.vy;
  if(player.y<0) player.y=0;
  if(player.y+player.h>canvas.height) player.y=canvas.height-player.h;

  // Balas
  bullets.forEach((b,i)=>{
    b.x+=8;
    if(b.x>canvas.width) bullets.splice(i,1);
    enemies.forEach((e,j)=>{
      if(b.x<b.x+b.w && b.x+b.w>e.x &&
         b.y<b.y+b.h && b.y+b.h>e.y){
        enemies.splice(j,1);
        bullets.splice(i,1);
        score++;
        scoreEl.textContent=score;
      }
    });
  });

  // Enemigos
  if(Math.random()<0.02){
    let size=30;
    enemies.push({x:canvas.width, y:Math.random()*(canvas.height-50), w:size, h:size});
  }
  enemies.forEach((e,i)=>{
    e.x-=4;
    if(e.x+e.w<0) enemies.splice(i,1);
    if(player.x<e.x+e.w && player.x+player.w>e.x &&
       player.y<e.y+e.h && player.y+player.h>e.y){
      gameOver=true;
    }
  });
}

// Dibujar todo
function draw() {
  ctx.fillStyle="#001f3f";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  drawPlayer();
  drawBullets();
  drawEnemies();
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
  if(e.code==="ArrowUp"){ player.vy=-6; }
  if(e.code==="ArrowDown"){ player.vy=6; }
  if(e.code==="Space"){ bullets.push({x:player.x+player.w,y:player.y+player.h/2,w:10,h:4}); }
  if(gameOver && e.code==="Enter"){
    player={x:80,y:canvas.height/2,w:40,h:40,vy:0};
    bullets=[]; enemies=[]; score=0;
    scoreEl.textContent=0; gameOver=false;
  }
});
document.addEventListener("keyup",e=>{
  if(e.code==="ArrowUp"||e.code==="ArrowDown"){ player.vy=0; }
});
