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

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const scoreEl = document.getElementById("score");

let hook = { x: canvas.width/2, y: 0, w: 10, h: 20, vy: 0, active: false };
let fishes = [];
let score = 0;

// Crear peces y basura
function spawnEntity() {
  let type = Math.random()<0.8 ? "fish" : "trash";
  let size = 30;
  fishes.push({
    x: Math.random()*canvas.width,
    y: canvas.height-100-Math.random()*200,
    w: size,
    h: size,
    type: type,
    vx: (Math.random()<0.5? -1:1)* (2+Math.random()*2)
  });
}
setInterval(spawnEntity, 1500);

function update() {
  if(hook.active){
    hook.y += hook.vy;
    if(hook.y>canvas.height-50){ hook.vy=-5; }
    if(hook.y<0){ hook.active=false; hook.y=0; hook.vy=0; }
  }

  fishes.forEach(f=>{
    f.x+=f.vx;
    if(f.x<0||f.x+f.w>canvas.width) f.vx*=-1;
  });

  // colisiones
  fishes.forEach((f,i)=>{
    if(hook.active &&
       hook.x<hook.x+hook.w && hook.x+hook.w>f.x &&
       hook.y<hook.y+hook.h && hook.y+hook.h>f.y){
      if(f.type==="fish"){ score+=10; }
      else { score-=5; }
      scoreEl.textContent="Puntos: "+score;
      fishes.splice(i,1);
      hook.active=false; hook.y=0; hook.vy=0;
    }
  });
}

function draw() {
  ctx.fillStyle="#1E90FF"; // agua
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // peces y basura
  fishes.forEach(f=>{
    if(f.type==="fish"){ ctx.fillStyle="orange"; }
    else { ctx.fillStyle="brown"; }
    ctx.fillRect(f.x,f.y,f.w,f.h);
  });

  // caña
  ctx.fillStyle="black";
  ctx.fillRect(hook.x,0,2,hook.y); // cuerda
  ctx.fillStyle="gray";
  ctx.fillRect(hook.x-5,hook.y,hook.w,hook.h); // anzuelo
}

function loop(){
  update(); draw();
  requestAnimationFrame(loop);
}
loop();

// controles
document.addEventListener("keydown",e=>{
  if(e.code==="ArrowLeft"){ hook.x-=20; }
  if(e.code==="ArrowRight"){ hook.x+=20; }
  if(e.code==="Space" && !hook.active){
    hook.active=true; hook.vy=5;
  }
});
