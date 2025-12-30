//menu que el usuario puede mover
const menu = document.getElementById("another-games");
const icon = document.getElementById("menu-icon");

let offsetX, offsetY, isDragging = false;

// --- Drag con mouse ---
menu.addEventListener("mousedown", (e) => {
  if (e.target.closest("#menu-icon")) return; // no arrastrar si clic en icono
  isDragging = true;
  offsetX = e.clientX - menu.offsetLeft;
  offsetY = e.clientY - menu.offsetTop;
});

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    menu.style.left = (e.clientX - offsetX) + "px";
    menu.style.top = (e.clientY - offsetY) + "px";
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

// --- Drag con touch ---
menu.addEventListener("touchstart", (e) => {
  if (e.target.closest("#menu-icon")) return;
  isDragging = true;
  const touch = e.touches[0];
  offsetX = touch.clientX - menu.offsetLeft;
  offsetY = touch.clientY - menu.offsetTop;
});

document.addEventListener("touchmove", (e) => {
  if (isDragging) {
    const touch = e.touches[0];
    menu.style.left = (touch.clientX - offsetX) + "px";
    menu.style.top = (touch.clientY - offsetY) + "px";
  }
});

document.addEventListener("touchend", () => {
  isDragging = false;
});

// --- Toggle expand/collapse ---
icon.addEventListener("click", () => {
  menu.classList.toggle("expanded");

  if (menu.classList.contains("expanded")) {
    // SVG lleno (abierto)
    icon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e1ff00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-device-gamepad-3"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 12l-3 -3h-2a1 1 0 0 0 -1 1v4a1 1 0 0 0 1 1h2z" /><path d="M15 12l3 -3h2a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-2z" /><path d="M12 15l-3 3v2a1 1 0 0 0 1 1h4a1 1 0 0 0 1 -1v-2z" /><path d="M12 9l-3 -3v-2a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v2z" /></svg>
    `;
  } else {
    // SVG outline (cerrado)
    icon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#e1ff00" class="icon icon-tabler icons-tabler-filled icon-tabler-device-gamepad-3"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12.707 14.293l3 3a1 1 0 0 1 .293 .707v2a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-2a1 1 0 0 1 .293 -.707l3 -3a1 1 0 0 1 1.414 0m-6.707 -6.293a1 1 0 0 1 .707 .293l3 3a1 1 0 0 1 0 1.414l-3 3a1 1 0 0 1 -.707 .293h-2a2 2 0 0 1 -2 -2v-4a2 2 0 0 1 2 -2zm14 0a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-2a1 1 0 0 1 -.707 -.293l-3 -3a1 1 0 0 1 0 -1.414l3 -3a1 1 0 0 1 .707 -.293zm-6 -6a2 2 0 0 1 2 2v2a1 1 0 0 1 -.293 .707l-3 3a1 1 0 0 1 -1.414 0l-3 -3a1 1 0 0 1 -.293 -.707v-2a2 2 0 0 1 2 -2z" /></svg>
    `;
  }
});

//canvas del juego 
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const scoreEl = document.getElementById("score");

let player = { x: 80, y: canvas.height/2, w: 40, h: 60, vy: 0 };
let bullets = [];
let enemies = [];
let score = 0;
let gameOver = false;

// posición de la barrera
const barrierX = 150;

// Dibujar pingüino (jugador)
function drawPlayer() {
  let p = player;
  // cuerpo
  ctx.fillStyle="black";
  ctx.beginPath();
  ctx.ellipse(p.x+p.w/2, p.y+p.h/2, p.w/2, p.h/2, 0, 0, Math.PI*2);
  ctx.fill();
  // barriga blanca
  ctx.fillStyle="white";
  ctx.beginPath();
  ctx.ellipse(p.x+p.w/2, p.y+p.h/2+10, p.w/3, p.h/3, 0, 0, Math.PI*2);
  ctx.fill();
  // cabeza
  ctx.fillStyle="black";
  ctx.beginPath();
  ctx.arc(p.x+p.w/2, p.y+15, p.w/3, 0, Math.PI*2);
  ctx.fill();
  // ojos
  ctx.fillStyle="white";
  ctx.beginPath();
  ctx.arc(p.x+p.w/2-8, p.y+12, 5, 0, Math.PI*2);
  ctx.arc(p.x+p.w/2+8, p.y+12, 5, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle="black";
  ctx.beginPath();
  ctx.arc(p.x+p.w/2-8, p.y+12, 2, 0, Math.PI*2);
  ctx.arc(p.x+p.w/2+8, p.y+12, 2, 0, Math.PI*2);
  ctx.fill();
  // pico
  ctx.fillStyle="orange";
  ctx.beginPath();
  ctx.moveTo(p.x+p.w/2-5, p.y+20);
  ctx.lineTo(p.x+p.w/2+5, p.y+20);
  ctx.lineTo(p.x+p.w/2, p.y+25);
  ctx.closePath();
  ctx.fill();
}

// Dibujar bolas de nieve
function drawBullets() {
  ctx.fillStyle="white";
  bullets.forEach(b=>{
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
    ctx.fill();
  });
}

// Dibujar cormorán imperial (enemigo simplificado)
function drawEnemies() {
  enemies.forEach(e=>{
    ctx.fillStyle="darkslategray";
    ctx.beginPath();
    ctx.ellipse(e.x+e.w/2, e.y+e.h/2, e.w/2, e.h/2, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle="black";
    ctx.beginPath();
    ctx.arc(e.x+e.w/2, e.y+10, e.w/3, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle="yellow";
    ctx.beginPath();
    ctx.moveTo(e.x+e.w/2, e.y+10);
    ctx.lineTo(e.x+e.w/2+15, e.y+15);
    ctx.lineTo(e.x+e.w/2, e.y+20);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle="black";
    ctx.fillRect(e.x-10, e.y+e.h/2-10, 10, 30);
    ctx.fillRect(e.x+e.w, e.y+e.h/2-10, 10, 30);
  });
}

// Actualizar lógica
function update() {
  if(gameOver) return;

  // Movimiento jugador limitado por la barrera
  player.y += player.vy;
  if(player.y<0) player.y=0;
  if(player.y+player.h>canvas.height) player.y=canvas.height-player.h;
  if(player.x<barrierX) player.x=barrierX; // no puede pasar la barrera

  // Balas
  bullets.forEach((b,i)=>{
    b.x+=8;
    if(b.x>canvas.width) bullets.splice(i,1);
    enemies.forEach((e,j)=>{
      if(b.x-b.r<e.x+e.w && b.x+b.r>e.x &&
         b.y-b.r<e.y+e.h && b.y+b.r>e.y){
        enemies.splice(j,1);
        bullets.splice(i,1);
        score++;
        scoreEl.textContent=score;
      }
    });
  });

  // Enemigos
  if(Math.random()<0.02){
    let size=50;
    enemies.push({x:canvas.width, y:Math.random()*(canvas.height-80), w:size, h:size});
  }
  enemies.forEach((e,i)=>{
    e.x-=4;
    if(e.x+e.w<0) enemies.splice(i,1);
    // si pasan la barrera → game over
    if(e.x<barrierX){
      gameOver=true;
    }
    // colisión con jugador
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

  // dibujar barrera
  ctx.fillStyle="lightblue";
  ctx.fillRect(barrierX-5,0,10,canvas.height);

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
  if(e.code==="ArrowUp" || e.key==="w"){ player.vy=-6; }
  if(e.code==="ArrowDown" || e.key==="s"){ player.vy=6; }
  if(e.code==="Space"){ 
    bullets.push({x:player.x+player.w,y:player.y+player.h/2,r:6}); 
  }
  if(gameOver && e.code==="Enter"){
    player={x:80,y:canvas.height/2,w:40,h:60,vy:0};
    bullets=[]; enemies=[]; score=0;
    scoreEl.textContent=0; gameOver=false;
  }
});

document.addEventListener("keyup",e=>{
  if(e.code==="ArrowUp"||e.code==="ArrowDown"||e.key==="w"||e.key==="s"){ 
    player.vy=0; 
  }
});
