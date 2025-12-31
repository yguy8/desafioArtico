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

//instrucciones del juego 
const instructionsMenu = document.getElementById("instructions-menu");
const instructionsIcon = document.getElementById("instructions-icon");

let offsetX2, offsetY2, isDragging2 = false;

// --- Drag con mouse ---
instructionsMenu.addEventListener("mousedown", (e) => {
  if (e.target.closest("#instructions-icon")) return; // no arrastrar si clic en icono
  isDragging2 = true;
  offsetX2 = e.clientX - instructionsMenu.offsetLeft;
  offsetY2 = e.clientY - instructionsMenu.offsetTop;
});

document.addEventListener("mousemove", (e) => {
  if (isDragging2) {
    instructionsMenu.style.left = (e.clientX - offsetX2) + "px";
    instructionsMenu.style.top = (e.clientY - offsetY2) + "px";
  }
});

document.addEventListener("mouseup", () => {
  isDragging2 = false;
});

// --- Drag con touch ---
instructionsMenu.addEventListener("touchstart", (e) => {
  if (e.target.closest("#instructions-icon")) return;
  isDragging2 = true;
  const touch = e.touches[0];
  offsetX2 = touch.clientX - instructionsMenu.offsetLeft;
  offsetY2 = touch.clientY - instructionsMenu.offsetTop;
});

document.addEventListener("touchmove", (e) => {
  if (isDragging2) {
    const touch = e.touches[0];
    instructionsMenu.style.left = (touch.clientX - offsetX2) + "px";
    instructionsMenu.style.top = (touch.clientY - offsetY2) + "px";
  }
});

document.addEventListener("touchend", () => {
  isDragging2 = false;
});

// --- Toggle expand/collapse ---
instructionsIcon.addEventListener("click", () => {
  instructionsMenu.classList.toggle("expanded");

  if (instructionsMenu.classList.contains("expanded")) {
    // SVG abierto (outline libro)
    instructionsIcon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
           viewBox="0 0 24 24" fill="none" stroke="#c8ff00" stroke-width="2" 
           stroke-linecap="round" stroke-linejoin="round" 
           class="icon icon-tabler icons-tabler-outline icon-tabler-book">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
        <path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
        <path d="M3 6l0 13" />
        <path d="M12 6l0 13" />
        <path d="M21 6l0 13" />
      </svg>
    `;
  } else {
    // SVG cerrado (libro lleno)
    instructionsIcon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
           viewBox="0 0 24 24" fill="#c8ff00" 
           class="icon icon-tabler icons-tabler-filled icon-tabler-book">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M21.5 5.134a1 1 0 0 1 .493 .748l.007 .118v13a1 1 0 0 1 -1.5 .866a8 8 0 0 0 -7.5 -.266v-15.174a10 10 0 0 1 8.5 .708m-10.5 -.707l.001 15.174a8 8 0 0 0 -7.234 .117l-.327 .18l-.103 .044l-.049 .016l-.11 .026l-.061 .01l-.117 .006h-.042l-.11 -.012l-.077 -.014l-.108 -.032l-.126 -.056l-.095 -.056l-.089 -.067l-.06 -.056l-.073 -.082l-.064 -.089l-.022 -.036l-.032 -.06l-.044 -.103l-.016 -.049l-.026 -.11l-.01 -.061l-.004 -.049l-.002 -13.068a1 1 0 0 1 .5 -.866a10 10 0 0 1 8.5 -.707" />
      </svg>
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
//variables globales
const scoreEl = document.getElementById("score");

let hook = { x: canvas.width/2, y: 90, w: 10, h: 20, vy: 0, active: false };
let entities = [];
let score = 0;
let floatTexts = [];

// --- Sonidos con Oscillator ---
let soundOn = true;

// función genérica para reproducir un tono
const playTone = (freq = 440, time = 0.1, type = "sine") => {
  if (!soundOn) return;
  try {
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = 0.08; // volumen
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start();
    setTimeout(() => { osc.stop(); ac.close(); }, time * 1000);
  } catch (_) { /* silencioso */ }
};

// sonidos adaptados al juego
const goodSound = () => {
  // tono alegre: dos notas rápidas ascendentes
  playTone(440, 0.08, "triangle"); // A4
  setTimeout(() => playTone(660, 0.08, "triangle"), 100); // E5
};

const badSound = () => {
  // tono negativo: nota descendente corta
  playTone(220, 0.15, "sawtooth"); // A3
  setTimeout(() => playTone(150, 0.15, "sawtooth"), 120); // F#3
};


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

  // límite inferior
  if(hook.y > canvas.height - 50){
    hook.y = canvas.height - 50; // se queda en el fondo
    hook.vy = 0;                 // detiene movimiento hacia abajo
  }

  // límite superior
  if(hook.y < 0){
    hook.y = 0;   // se queda arriba
    hook.vy = 0;  // detiene movimiento hacia arriba
  }
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
  if(hook.active){
    // Rectángulo del hook
    const hookLeft   = hook.x;
    const hookRight  = hook.x + hook.w;
    const hookTop    = hook.y;
    const hookBottom = hook.y + hook.h;

    // Rectángulo de la entidad
    const fLeft   = f.x;
    const fRight  = f.x + f.w;
    const fTop    = f.y;
    const fBottom = f.y + f.h;

    // Checar colisión (AABB)
    const collision = hookLeft < fRight &&
                      hookRight > fLeft &&
                      hookTop < fBottom &&
                      hookBottom > fTop;

    if(collision){
      if(f.type === "fish"){ 
        score += 10; 
        goodSound();
        floatTexts.push({ text:"+10", x:f.x, y:f.y, color:"#2cbb09ff", life:60 });
      } else { 
        score -= 5; 
        if(score < 0) score = 0; //evita negativos
        badSound();
        floatTexts.push({ text:"-5", x:f.x, y:f.y, color:"#bd0000ff", life:60 });
      }
      scoreEl.textContent = "Puntos: " + score;
      entities.splice(i,1);
      hook.active = false; 
      hook.y = 0; 
      hook.vy = 0;
    }
  }
});

  // actualizar textos flotantes
floatTexts.forEach(t => {
  t.y -= 1;      // sube poco a poco
  t.life -= 1;   // reduce vida
});
floatTexts = floatTexts.filter(t => t.life > 0); // elimina los que ya murieron

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

function drawAlga(f) {
  // Degradado vertical para dar más realismo
  const gradient = ctx.createLinearGradient(f.x, f.y, f.x, f.y + f.h);
  gradient.addColorStop(0, "#006400"); // verde oscuro arriba
  gradient.addColorStop(1, f.color);   // color base abajo

  ctx.fillStyle = gradient;
  ctx.beginPath();

  // Punto de inicio en la base izquierda
  ctx.moveTo(f.x, f.y + f.h);

  // Curva izquierda del tallo
  ctx.bezierCurveTo(
    f.x - f.w/2, f.y + f.h/2,   // control 1
    f.x, f.y + f.h/3,           // control 2
    f.x + f.w/4, f.y            // punto final arriba
  );

  // Curva derecha del tallo
  ctx.bezierCurveTo(
    f.x + f.w/2, f.y + f.h/3,   // control 1
    f.x + f.w*1.2, f.y + f.h/2, // control 2
    f.x + f.w, f.y + f.h        // punto final base derecha
  );

  ctx.closePath();
  ctx.fill();

  // Dibujar hojas laterales para más detalle
  ctx.beginPath();
  ctx.moveTo(f.x + f.w/4, f.y + f.h/2);
  ctx.quadraticCurveTo(f.x - f.w/2, f.y + f.h/2, f.x + f.w/6, f.y + f.h);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(f.x + f.w/2, f.y + f.h/3);
  ctx.quadraticCurveTo(f.x + f.w*1.2, f.y + f.h/2, f.x + f.w/1.5, f.y + f.h);
  ctx.fill();
}


function draw() {
  ctx.fillStyle="#5ba6f1ff"; // agua
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // peces y algas
  entities.forEach(f=>{
    if(f.type==="fish"){ 
      drawFish(f);
    } else { 
      drawAlga(f);
    }

    // dibujar textos flotantes
  floatTexts.forEach(t => {
    ctx.font = "bold 20px Arial";
    ctx.lineWidth = 3;            // grosor del borde
    ctx.strokeStyle = "black";    // color del borde
    ctx.strokeText(t.text, t.x, t.y);

    ctx.fillStyle = t.color;      // color del relleno
    ctx.fillText(t.text, t.x, t.y);
  });


  });

  // caña mejorada
  ctx.strokeStyle="black";
  ctx.lineWidth=6;
  ctx.beginPath();
  ctx.moveTo(hook.x,0);
  ctx.lineTo(hook.x,hook.y);
  ctx.stroke();

  // anzuelo curvo
  ctx.strokeStyle="gray";
  ctx.lineWidth=4;
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
document.addEventListener("keydown", e => {
  // mover caña a la izquierda/derecha
  if(e.code==="ArrowLeft" || e.key==="a"){ hook.x -= 20; }
  if(e.code==="ArrowRight" || e.key==="d"){ hook.x += 20; }

  // mover caña hacia arriba
  if(e.code==="ArrowUp" || e.key==="w"){
    hook.active = true;
    hook.vy = -5;   // velocidad hacia arriba
  }

  // mover caña hacia abajo
  if(e.code==="ArrowDown" || e.key==="s"){
    hook.active = true;
    hook.vy = 5;    // velocidad hacia abajo
  }

  // espacio: lanzar caña hasta el fondo
  if(e.code==="Space" || e.key===" "){
    hook.active = true;
    hook.vy = 10;   // baja rápido
  }

  // Toggle sonido con la tecla M
  if(e.code==="KeyM" || e.key==="m"){
    soundOn = !soundOn;
    console.log("Sonido: " + (soundOn ? "ON" : "OFF"));
  }
});