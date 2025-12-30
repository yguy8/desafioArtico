//menu de juego que el usuario puede mover
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

let hook = { x: canvas.width/2, y: 0, w: 10, h: 20, vy: 0, active: false };
let entities = [];
let score = 0;

// sonidos
const goodSound = new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg");
// sonido corto tipo game over
const badSound = new Audio("https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg");

// Crear peces y algas
function spawnEntity() {
  let type = Math.random()<0.8 ? "fish" : "alga";
  let size = type==="fish" ? (Math.random()<0.5 ? 25 : 40) : 30; 
  let color = "orange";
  if(type==="fish"){
    color = size>30 ? "red" : "yellow"; // rojos grandes, amarillos pequeños
  } else {
    color = "green"; // alga
  }
  entities.push({
    x: Math.random()*canvas.width,
    y: canvas.height-100-Math.random()*200,
    w: size,
    h: size/2,
    type: type,
    color: color,
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

  entities.forEach(f=>{
    f.x+=f.vx;
    // peces solo hacia adelante
    if(f.type==="fish"){
      if(f.vx>0 && f.x>canvas.width+50) f.x=-50;
      if(f.vx<0 && f.x<-50) f.x=canvas.width+50;
    } else {
      // alga rebota
      if(f.x<0||f.x+f.w>canvas.width) f.vx*=-1;
    }
  });

  // colisiones
  entities.forEach((f,i)=>{
    if(hook.active &&
       hook.x<hook.x+hook.w && hook.x+hook.w>f.x &&
       hook.y<hook.y+hook.h && hook.y+hook.h>f.y){
      if(f.type==="fish"){ 
        score+=10; 
        goodSound.play();
      }
      else { 
        score-=5; 
        badSound.play();
      }
      scoreEl.textContent="Puntos: "+score;
      entities.splice(i,1);
      hook.active=false; hook.y=0; hook.vy=0;
    }
  });
}

function drawFish(f){
  ctx.fillStyle = f.color;
  ctx.beginPath();
  ctx.ellipse(f.x+f.w/2, f.y+f.h/2, f.w/2, f.h/2, 0, 0, Math.PI*2);
  ctx.fill();
  // cola
  ctx.beginPath();
  ctx.moveTo(f.x, f.y+f.h/2);
  ctx.lineTo(f.x-10, f.y);
  ctx.lineTo(f.x-10, f.y+f.h);
  ctx.closePath();
  ctx.fill();
  // ojo
  ctx.fillStyle="white";
  ctx.beginPath();
  ctx.arc(f.x+f.w/2+8, f.y+f.h/2-5, 4, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle="black";
  ctx.beginPath();
  ctx.arc(f.x+f.w/2+8, f.y+f.h/2-5, 2, 0, Math.PI*2);
  ctx.fill();
}

function drawAlga(f){
  ctx.fillStyle=f.color;
  ctx.beginPath();
  ctx.moveTo(f.x, f.y+f.h);
  ctx.lineTo(f.x+f.w/2, f.y); // tallo simple
  ctx.lineTo(f.x+f.w, f.y+f.h);
  ctx.closePath();
  ctx.fill();
}

function draw() {
  ctx.fillStyle="#1E90FF"; // agua
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // peces y algas
  entities.forEach(f=>{
    if(f.type==="fish"){ 
      drawFish(f);
    } else { 
      drawAlga(f);
    }
  });

  // caña mejorada
  ctx.strokeStyle="black";
  ctx.lineWidth=3;
  ctx.beginPath();
  ctx.moveTo(hook.x,0);
  ctx.lineTo(hook.x,hook.y);
  ctx.stroke();

  // anzuelo curvo
  ctx.strokeStyle="gray";
  ctx.lineWidth=2;
  ctx.beginPath();
  ctx.arc(hook.x, hook.y+hook.h/2, hook.w, Math.PI, Math.PI*2);
  ctx.stroke();
}

function loop(){
  update(); draw();
  requestAnimationFrame(loop);
}
loop();

// controles
document.addEventListener("keydown",e=>{
  if(e.code==="ArrowLeft" || e.key==="a"){ hook.x-=20; }
  if(e.code==="ArrowRight" || e.key==="d"){ hook.x+=20; }
  if((e.code==="Space" || e.key===" ") && !hook.active){
    hook.active=true; hook.vy=5;
  }
});
