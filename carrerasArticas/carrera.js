//menu general que se puede mover
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

let player = { x: canvas.width/2-25, y: canvas.height-120, w: 60, h: 60, vx: 0 };
let obstacles = [];
let krillList = [];
let distance = 0;
let krillCount = 0;
let gameOver = false;

// control de velocidad
let baseSpeed = 5;        // velocidad normal de obstáculos/krill
let boostSpeed = 10;      // velocidad con boost de obstáculos/krill
let currentSpeed = baseSpeed;

let boostActive = false;
let boostTimer = 0;

let playerBaseSpeed = 9;   // velocidad lateral normal del jugador
let playerBoostSpeed = 15; // velocidad lateral con boost
let currentPlayerSpeed = playerBaseSpeed;


// dibujar pingüino con trineo
function drawPenguinConTrineo(x,y,w,h,colorTrineo){
  ctx.fillStyle = colorTrineo;
  ctx.fillRect(x-10, y+h-10, w+20, 15);

  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.ellipse(x+w/2, y+h/2, w/2, h/2, 0, 0, Math.PI*2);
  ctx.fill();

  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.ellipse(x+w/2, y+h/2+5, w/3, h/3, 0, 0, Math.PI*2);
  ctx.fill();

  ctx.fillStyle = "orange";
  ctx.beginPath();
  ctx.moveTo(x+w/2-10, y+h/2-5);
  ctx.lineTo(x+w/2+10, y+h/2-5);
  ctx.lineTo(x+w/2, y+h/2+5);
  ctx.closePath();
  ctx.fill();

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
  drawPenguinConTrineo(player.x, player.y, player.w, player.h, "royalblue");
}

function drawObstacles() {
  obstacles.forEach(o=>{
    drawPenguinConTrineo(o.x,o.y,o.w,o.h,"red");
  });
}

// dibujar krill
function drawKrill(x,y){
  ctx.fillStyle = "#ff9999";
  ctx.beginPath();
  ctx.ellipse(x, y, 18, 6, 0, 0, Math.PI*2);
  ctx.fill();

  ctx.strokeStyle = "#cc6666";
  ctx.lineWidth = 2;
  for(let i=-12; i<=12; i+=6){
    ctx.beginPath();
    ctx.moveTo(x+i, y-6);
    ctx.lineTo(x+i, y+6);
    ctx.stroke();
  }

  ctx.fillStyle = "#ff6666";
  ctx.beginPath();
  ctx.arc(x+20, y, 6, 0, Math.PI*2);
  ctx.fill();

  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(x+22, y-2, 2, 0, Math.PI*2);
  ctx.fill();

  ctx.strokeStyle = "#ff6666";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x+24, y-2);
  ctx.lineTo(x+32, y-8);
  ctx.moveTo(x+24, y);
  ctx.lineTo(x+32, y+4);
  ctx.stroke();
}

function drawKrillList(){
  krillList.forEach(k=>{
    drawKrill(k.x,k.y);
  });
}

// tablero
function drawBoard(){
  const boardWidth = 240;
  const boardHeight = 90;
  const boardX = (canvas.width - boardWidth) / 2; // centrado horizontal
  const boardY = 20; // arriba

  // fondo del tablero
  ctx.fillStyle = "rgba(0,0,50,0.7)";
  ctx.fillRect(boardX, boardY, boardWidth, boardHeight);

  // borde
  ctx.strokeStyle = "white";
  ctx.lineWidth = 3;
  ctx.strokeRect(boardX, boardY, boardWidth, boardHeight);

  // texto
  ctx.fillStyle = "white";
  ctx.font = "20px Verdana, sans-serif";
  ctx.fillText("Distancia: " + distance, boardX + 20, boardY + 30);
  ctx.fillText("Krill: " + krillCount, boardX + 20, boardY + 60);

  if(boostActive){
    ctx.fillStyle = "yellow";
    ctx.font = "16px Verdana, sans-serif";
    ctx.fillText("¡Acelerador activo!", boardX + 90, boardY + 60);
  }
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
    obstacles.push({
      x: lane*laneWidth + laneWidth/2 - 30,
      y: -100,
      w: 60,
      h: 60
    });
  }

  // generar krill
  if(Math.random()<0.01){
    let lane = Math.floor(Math.random()*3);
    let laneWidth = canvas.width/3;
    krillList.push({
      x: lane*laneWidth + laneWidth/2,
      y: -50
    });
  }

  // mover obstáculos
  obstacles.forEach(o=>o.y+=currentSpeed);

  // mover krill
  krillList.forEach(k=>k.y+=currentSpeed);

  // colisiones con obstáculos
  obstacles.forEach(o=>{
    if(player.x<o.x+o.w && player.x+player.w>o.x &&
       player.y<o.y+o.h && player.y+player.h>o.y){
      gameOver=true;
      onGameOver();
    }
  });

  // colisiones con krill
  krillList.forEach((k,i)=>{
    if(player.x<k.x+10 && player.x+player.w>k.x-10 &&
       player.y<k.y+10 && player.y+player.h>k.y-10){
      krillCount++;
      krillList.splice(i,1);
      onKrillCollected();

      // activar boost cada 5 krill
      if(krillCount % 5 === 0){
        boostActive = true;
        currentSpeed = boostSpeed;
        boostTimer = Date.now();
        onBoostActivated();
      }
    }
  });

  // controlar duración del boost
  if(boostActive && Date.now() - boostTimer > 10000){
    boostActive = false;
    currentSpeed = baseSpeed;
  }

  // limpiar fuera de pantalla
  obstacles = obstacles.filter(o=>o.y<canvas.height);
  krillList = krillList.filter(k=>k.y<canvas.height);

  // distancia
  distance++;
}

function draw() {
  ctx.fillStyle="#cceeff";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  drawPlayer();
  drawObstacles();
  drawKrillList();
  drawBoard();

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
  if(e.code==="ArrowLeft" || e.key==="a" || e.key==="A"){ player.vx = -currentPlayerSpeed; }
  if(e.code==="ArrowRight" || e.key==="d" || e.key==="D"){ player.vx = currentPlayerSpeed; }
  if(gameOver && e.code==="Enter"){
    player={x:canvas.width/2-25,y:canvas.height-120,w:60,h:60,vx:0};
    obstacles=[]; krillList=[]; distance=0; krillCount=0;
    gameOver=false;
    currentSpeed = baseSpeed;
    boostActive = false;

    onGameStart();
  }
});

document.addEventListener("keyup", e => {
  if(e.code==="ArrowLeft" || e.code==="ArrowRight" || e.key==="a" || e.key==="A" || e.key==="d" || e.key==="D"){ 
    player.vx = 0; 
  }
});

// --- Sistema de sonido minimalista con AudioContext ---
let soundOn = true;

// Función auxiliar para reproducir un tono
function playTone(freq, duration, type = "sine", volume = 0.08) {
  if (!soundOn) return;
  const ac = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = volume;
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + duration);
  setTimeout(() => ac.close(), duration * 1000 + 200);
}

// --- Sonido al recoger krill (suave y alegre) ---
function onKrillCollected() {
  playTone(1000, 0.15, "sine", 0.1);   // nota aguda corta
  playTone(1500, 0.1, "triangle", 0.08); // segunda nota brillante
}

// --- Sonido de boost activado (rápido y energético) ---
function onBoostActivated() {
  const ac = new (window.AudioContext || window.webkitAudioContext)();
  [600, 900, 1200].forEach((freq, i) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "square";
    osc.frequency.value = freq;
    gain.gain.value = 0.1;
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(ac.currentTime + i * 0.2);
    osc.stop(ac.currentTime + i * 0.2 + 0.25);
  });
  setTimeout(() => ac.close(), 1500);
}

// --- Sonido de Game Over (tranquilo y descendente) ---
function onGameOver() {
  const ac = new (window.AudioContext || window.webkitAudioContext)();
  [440, 330, 220].forEach((freq, i) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.value = 0.07;
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(ac.currentTime + i * 0.5);
    osc.stop(ac.currentTime + i * 0.5 + 0.6);
  });
  setTimeout(() => ac.close(), 2500);
}

// --- Reinicio del juego (silencioso, pero puedes añadir sonido si quieres) ---
function onGameStart() {
  // Aquí podrías poner un sonido de inicio si lo deseas
}

// --- Control con tecla M para activar/desactivar sonido ---
document.addEventListener("keydown", e => {
  if (e.code === "KeyM") {
    soundOn = !soundOn;
  }
});
