const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const scoreEl = document.getElementById("score");

let player = { x: canvas.width/2-25, y: canvas.height-120, w: 60, h: 60, vx: 0 };
let obstacles = [];
let distance = 0;
let gameOver = false;

// función para dibujar un pingüino
function drawPenguin(x,y,w,h){
  // cuerpo
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.ellipse(x+w/2, y+h/2, w/2, h/2, 0, 0, Math.PI*2);
  ctx.fill();

  // panza blanca
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.ellipse(x+w/2, y+h/2+5, w/3, h/3, 0, 0, Math.PI*2);
  ctx.fill();

  // pico naranja
  ctx.fillStyle = "orange";
  ctx.beginPath();
  ctx.moveTo(x+w/2-10, y+h/2-5);
  ctx.lineTo(x+w/2+10, y+h/2-5);
  ctx.lineTo(x+w/2, y+h/2+5);
  ctx.closePath();
  ctx.fill();

  // ojos
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(x+w/2-10, y+h/2-15, 5, 0, Math.PI*2);
  ctx.arc(x+w/2+10, y+h/2-15, 5, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(x+w/2-10, y+h/2-15, 2, 0, Math.PI*2);
  ctx.arc(x+w/2+10, y+h/2-15, 2, 0, Math.PI*2);
  ctx.fill();
}

function drawPlayer() {
  drawPenguin(player.x, player.y, player.w, player.h);
}

function drawObstacles() {
  obstacles.forEach(o=>{
    drawPenguin(o.x,o.y,o.w,o.h);
  });
}

function update() {
  if(gameOver) return;

  // mover jugador
  player.x += player.vx;
  if(player.x<0) player.x=0;
  if(player.x+player.w>canvas.width) player.x=canvas.width-player.w;

  // generar obstáculos (en cualquiera de los 3 carriles)
  if(Math.random()<0.02){
    let lane = Math.floor(Math.random()*3);
    let laneWidth = canvas.width/3;
    obstacles.push({
      x: lane*laneWidth + laneWidth/2 - 30,
      y: -100,
      w: 60,
      h: 60
    });
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
  // fondo ártico
  ctx.fillStyle="#cceeff";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // ❌ ya no dibujamos las líneas punteadas de los carriles

  drawPlayer();
  drawObstacles();

  if(gameOver){
    ctx.fillStyle="darkblue"; ctx.font="40px sans-serif";
    ctx.fillText("¡GAME OVER!",canvas.width/2-120,canvas.height/2);
    ctx.font="20px sans-serif";
    ctx.fillText("Presiona Enter para reiniciar",canvas.width/2-140,canvas.height/2+40);
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
    player={x:canvas.width/2-25,y:canvas.height-120,w:60,h:60,vx:0};
    obstacles=[]; distance=0;
    scoreEl.textContent="Distancia: 0"; gameOver=false;
  }
});
document.addEventListener("keyup",e=>{
  if(e.code==="ArrowLeft"||e.code==="ArrowRight"){ player.vx=0; }
});
