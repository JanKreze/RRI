/**
 * P16 — starter igra (teden 1)
 * HTML Canvas + vanilla JS, brez knjižnic.
 *
 * Cilj: igralec (modri pravokotnik) + WASD + game loop.
 * Teden 2+: tukaj dodamo sovražnika, trke, strele …
 */

(function () {
  "use strict";

  // --- Platno ---------------------------------------------------------------
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  // --- Konstante (lažje uravnavanje in GDD) ---------------------------------
  const PLAYER_SPEED = 320;      // piksli na sekundo
  const SPRINT_MULTIPLIER = 1.6; // Shift = 1.6x hitrost

  // --- Igralec --------------------------------------------------------------
  // Kasneje: sprite namesto fillRect; hitrost boš uravnaval v vajah.
  const player = {
    x: W / 2 - 16,
    y: H / 2 - 16,
    w: 32,
    h: 32,
    speed: PLAYER_SPEED, // piksli na sekundo (delta-time)
    color: "#001400", // spremenil sem v zeleno barvo, spremenil sem hitrost
  };

  // --- Tipkovnica -----------------------------------------------------------
  // true = tipka je trenutno pritisnjena
  const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    arrowup: false,
    arrowdown: false,
    arrowleft: false,
    arrowright: false,
    shift: false,
  };

  window.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    if (k in keys) {
      keys[k] = true;
      e.preventDefault(); // prepreči scroll strani pri tipkah
    }
  });

  window.addEventListener("keyup", (e) => {
    const k = e.key.toLowerCase();
    if (k in keys) {
      keys[k] = false;
    }
  });

  // --- Posodobitev igralca --------------------------------------------------
  /**
   * Premakne igralca glede na WASD in omeji na rob platna.
   * @param {number} dt — čas od zadnjega frejma v sekundah
   */
  function updatePlayer(dt) {
    let dx = 0;
    let dy = 0;

    // WASD ali puščice — oboje daje isti dx/dy
    if (keys.w || keys.arrowup) dy -= 1;
    if (keys.s || keys.arrowdown) dy += 1;
    if (keys.a || keys.arrowleft) dx -= 1;
    if (keys.d || keys.arrowright) dx += 1;

    // Diagonala: normaliziraj v enotski vektor
    if (dx !== 0 || dy !== 0) {
      const len = Math.hypot(dx, dy);
      dx /= len;
      dy /= len;
    }

    // Sprint: začasno večja hitrost
    const speed = keys.shift ? player.speed * SPRINT_MULTIPLIER : player.speed;

    player.x += dx * speed * dt;
    player.y += dy * speed * dt;

    // Clamp na rob platna (to še ni trk z ovirami — teden 4)
    player.x = Math.max(0, Math.min(W - player.w, player.x));
    player.y = Math.max(0, Math.min(H - player.h, player.y));
  }

  // --- Risanje --------------------------------------------------------------
  function draw() {
    // Počisti platno (temno ozadje — dopolnjuje CSS)
    ctx.fillStyle = "#1a1d23";
    ctx.fillRect(0, 0, W, H);

    // Igralec
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.w, player.h);

    // Majhen "obraz" / smer — samo vizualni hint (opcijsko)
    ctx.fillStyle = "#93c5fd";
    ctx.fillRect(player.x + 8, player.y + 8, 6, 6);
    ctx.fillRect(player.x + 18, player.y + 8, 6, 6);
  }

  // --- Game loop (delta time) -----------------------------------------------
  let lastTime = 0;

  /**
   * Glavna zanka: requestAnimationFrame kliče to funkcijo vsak frejm.
   * @param {number} timestamp — čas iz rAF (ms)
   */
  function loop(timestamp) {
    // Prvi frejm: nastavi lastTime, da dt ni ogromen
    if (!lastTime) lastTime = timestamp;

    // dt v sekundah; omejimo, da ob zavihku v ozadju ne "skoči"
    let dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    if (dt > 0.05) dt = 0.05; // max ~20 FPS ekvivalent skoka

    updatePlayer(dt);
    // Kasneje (teden 4+): tukaj posodobiš tudi sovražnike in strele.
    draw();

    requestAnimationFrame(loop);
  }

  // Start
  requestAnimationFrame(loop);
})();
