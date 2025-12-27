(() => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const hudScore = document.getElementById("score");
  const hudBest = document.getElementById("best");
  const menu = document.getElementById("menu");
  const btnPlay = document.getElementById("btn-play");
  const selDiff = document.getElementById("difficulty");
  const overlay = document.getElementById("gameover");
  const finalScore = document.getElementById("final-score");
  const finalBest = document.getElementById("final-best");
  const btnTryAgain = document.getElementById("btn-try-again");
  const btnPause = document.getElementById("btn-pause");
  const btnRestart = document.getElementById("btn-restart");
  const btnSound = document.getElementById("btn-sound");

  // Audio minimalista (generado con Oscillator)
  let soundOn = true;
  const playTone = (freq = 440, time = 0.06, type = "sine") => {
    if (!soundOn) return;
    try {
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.value = 0.06;
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start();
      setTimeout(() => { osc.stop(); ac.close(); }, time * 1000);
    } catch (_) { /* silencioso */ }
  };

  // Estado del juego
  let running = false;
  let paused = false;
  let score = 0;
  let best = Number(localStorage.getItem("pf_best") || 0);
  hudBest.textContent = best;

  // Configuración
  const configByDiff = {
    easy:   { gap: 200, speed: 2.8, gravity: 0.22, jump: -5.2, spawn: 1400 },
    normal: { gap: 170, speed: 3.4, gravity: 0.26, jump: -5.6, spawn: 1200 },
    hard:   { gap: 150, speed: 4.0, gravity: 0.30, jump: -6.0, spawn: 1000 },
  };
  let cfg = configByDiff.normal;

  // Escala y física
  const W = canvas.width, H = canvas.height;
  const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
  skyGrad.addColorStop(0, "#003");
  skyGrad.addColorStop(1, "#046");

  const penguin = {
    x: 96,
    y: H / 2,
    vx: 0,
    vy: 0,
    r: 22,
    angle: 0,
  };

  const pipes = [];
  let lastSpawn = 0;

  // Entrada
  const flap = () => {
    if (!running) return;
    if (paused) { paused = false; return; }
    penguin.vy = cfg.jump;
    playTone(880, 0.05, "triangle");
  };

  const onKey = (e) => {
    if (e.code === "Space") { e.preventDefault(); flap(); }
    if (e.code === "KeyP") { paused = !paused; }
    if (e.code === "Enter" && !running) start();
    if (e.code === "Escape" && running) toMenu();
  };
  document.addEventListener("keydown", onKey);
  canvas.addEventListener("mousedown", flap);
  canvas.addEventListener("touchstart", (e) => { e.preventDefault(); flap(); }, { passive: false });

  btnPlay.onclick = () => start();
  btnTryAgain.onclick = () => start();
  btnPause.onclick = () => { if (running) paused = !paused; };
  btnRestart.onclick = () => { start(); };
  btnSound.onclick = () => {
    soundOn = !soundOn;
    btnSound.textContent = soundOn ? "🔊" : "🔇";
  };
  selDiff.onchange = () => { cfg = configByDiff[selDiff.value]; };

  // Bucle principal
  let lastTime = 0;
  const loop = (t) => {
    requestAnimationFrame(loop);
    const dt = Math.min(32, t - lastTime);
    lastTime = t;
    if (!running || paused) return;

    update(dt);
    draw();
  };
  requestAnimationFrame(loop);

  // Inicio y fin
  function start() {
    score = 0;
    hudScore.textContent = score;
    penguin.x = 96;
    penguin.y = H / 2;
    penguin.vy = 0;
    pipes.length = 0;
    lastSpawn = performance.now();
    overlay.classList.add("hidden");
    menu.style.display = "none";
    running = true;
    paused = false;
    playTone(523, 0.08, "square");
  }

  function gameOver() {
    running = false;
    playTone(196, 0.18, "sawtooth");
    finalScore.textContent = score;
    best = Math.max(best, score);
    localStorage.setItem("pf_best", String(best));
    finalBest.textContent = best;
    overlay.classList.remove("hidden");
    menu.style.display = "flex";
  }

  function toMenu() {
    running = false;
    overlay.classList.add("hidden");
    menu.style.display = "flex";
  }

  // Lógica
  function spawnPipe() {
    const margin = 60;
    const minTop = margin;
    const maxTop = H - margin - cfg.gap;
    const top = Math.floor(minTop + Math.random() * (maxTop - minTop));
    const pipe = {
      x: W + 20,
      top: top,
      gap: cfg.gap,
      w: 60,
      passed: false,
    };
    pipes.push(pipe);
  }

  function update(dt) {
    // Spawning
    const now = performance.now();
    if (now - lastSpawn > cfg.spawn) {
      spawnPipe();
      lastSpawn = now;
    }

    // Progresión de dificultad suave
    cfg.speed += 0.0008; // leve incremento con el tiempo

    // Física del pingüino
    penguin.vy += cfg.gravity;
    penguin.y += penguin.vy;
    penguin.angle = Math.max(-0.5, Math.min(0.7, penguin.vy / 8));

    // Limites verticales
    if (penguin.y < 0) penguin.y = 0;
    if (penguin.y > H) gameOver();

    // Mover y colisiones de tubos
    for (let i = pipes.length - 1; i >= 0; i--) {
      const p = pipes[i];
      p.x -= cfg.speed;

      // Puntuación
      if (!p.passed && p.x + p.w < penguin.x - penguin.r) {
        p.passed = true;
        score++;
        hudScore.textContent = score;
        playTone(660, 0.05, "triangle");
      }

      // Quitar fuera de pantalla
      if (p.x + p.w < -10) pipes.splice(i, 1);
    }

    // Colisión precisa con rectángulos
    for (const p of pipes) {
      const px = penguin.x, py = penguin.y, pr = penguin.r;
      // Tubo superior
      if (circleRect(px, py, pr, p.x, 0, p.w, p.top)) return gameOver();
      // Tubo inferior
      if (circleRect(px, py, pr, p.x, p.top + p.gap, p.w, H - (p.top + p.gap))) return gameOver();
    }
  }

  // Dibujo
  function draw() {
    // Fondo
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H);
    drawParallax();

    // Tubos (hielo)
    for (const p of pipes) drawIcePipe(p);

    // Pingüino
    drawPenguin(penguin);

    // Suelo hielo
    ctx.fillStyle = "#0af";
    ctx.fillRect(0, H - 14, W, 14);

    // Pausa
    if (paused) {
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#fff";
      ctx.font = "24px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Pausado (P)", W / 2, H / 2);
    }
  }

  // Utilidades de colisión
  function circleRect(cx, cy, r, rx, ry, rw, rh) {
    const nearestX = clamp(cx, rx, rx + rw);
    const nearestY = clamp(cy, ry, ry + rh);
    const dx = cx - nearestX;
    const dy = cy - nearestY;
    return dx * dx + dy * dy <= r * r;
  }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  // Parallax nieve y estalactitas lejanas
  const snow = Array.from({ length: 60 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 2 + 1,
    s: Math.random() * 0.6 + 0.2,
  }));
  function drawParallax() {
    // Nieve
    for (const n of snow) {
      n.y += n.s;
      if (n.y > H) { n.y = -5; n.x = Math.random() * W; }
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
    }
    // Crestas de hielo lejanas
    ctx.strokeStyle = "rgba(180,220,255,0.35)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 6; i++) {
      const y = 120 + i * 80;
      ctx.beginPath();
      for (let x = 0; x <= W; x += 20) {
        const oy = Math.sin((x + i * 37) * 0.02) * 6;
        ctx.lineTo(x, y + oy);
      }
      ctx.stroke();
    }
  }

  // Dibujo de tubos de hielo
  function drawIcePipe(p) {
    // cuerpo
    ctx.fillStyle = "#9be1ff";
    ctx.fillRect(p.x, 0, p.w, p.top);
    ctx.fillRect(p.x, p.top + p.gap, p.w, H - (p.top + p.gap));
    // bordes brillantes
    ctx.fillStyle = "#c8f3ff";
    ctx.fillRect(p.x, p.top - 10, p.w, 10);
    ctx.fillRect(p.x, p.top + p.gap, p.w, 10);
    // textura
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    for (let y = 10; y < p.top; y += 18) {
      ctx.beginPath(); ctx.moveTo(p.x + 6, y); ctx.lineTo(p.x + p.w - 6, y + 6); ctx.stroke();
    }
    for (let y = p.top + p.gap + 10; y < H; y += 18) {
      ctx.beginPath(); ctx.moveTo(p.x + 6, y); ctx.lineTo(p.x + p.w - 6, y + 6); ctx.stroke();
    }
    // puntas
    ctx.fillStyle = "#7cd6ff";
    ctx.beginPath();
    ctx.moveTo(p.x, p.top);
    ctx.lineTo(p.x + p.w, p.top);
    ctx.lineTo(p.x + p.w / 2, p.top - 18);
    ctx.closePath(); ctx.fill();

    ctx.beginPath();
    ctx.moveTo(p.x, p.top + p.gap);
    ctx.lineTo(p.x + p.w, p.top + p.gap);
    ctx.lineTo(p.x + p.w / 2, p.top + p.gap + 18);
    ctx.closePath(); ctx.fill();
  }

  // Dibujo del pingüino (sprite en canvas)
  function drawPenguin(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);

    // cuerpo
    ctx.fillStyle = "#1c2530"; // negro
    roundRect(ctx, -22, -22, 44, 56, 20, true, false);
    // barriga
    ctx.fillStyle = "#ffffff";
    roundRect(ctx, -16, -8, 32, 34, 12, true, false);
    // pico
    ctx.fillStyle = "#ffa726";
    ctx.beginPath();
    ctx.moveTo(8, -6); ctx.lineTo(26, 0); ctx.lineTo(8, 6); ctx.closePath(); ctx.fill();
    // ojos
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(-4, -10, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#000"; ctx.beginPath(); ctx.arc(-3, -10, 2, 0, Math.PI * 2); ctx.fill();
    // alas
    ctx.fillStyle = "#1c2530";
    roundRect(ctx, -28, -6, 12, 24, 6, true, false);
    roundRect(ctx, 16, -6, 12, 24, 6, true, false);
    // pies
    ctx.fillStyle = "#ffb74d";
    roundRect(ctx, -14, 22, 12, 6, 3, true, false);
    roundRect(ctx, 2, 22, 12, 6, 3, true, false);

    ctx.restore();
  }

  function roundRect(ctx, x, y, w, h, r, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }
})();
