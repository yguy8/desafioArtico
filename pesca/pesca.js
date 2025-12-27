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
