/**
 * main.js — vstopna točka: platno, stanje igre in game loop.
 * Kasneje (teden 3+): tukaj posodobiš tudi sovražnike in strele.
 */

import { CANVAS_ID, MAX_DT, DEBUG_DEFAULT } from "./config.js";
import { initInput, onKeyPress } from "./input.js";
import { createPlayer, updatePlayer } from "./player.js";
import { draw } from "./render.js";

// --- Platno ---------------------------------------------------------------
const canvas = document.getElementById(CANVAS_ID);
const ctx = canvas.getContext("2d");
const W = canvas.width;
const H = canvas.height;

// --- Stanje igre ----------------------------------------------------------
const state = {
  player: createPlayer(W, H),
  debug: DEBUG_DEFAULT,
};

// --- Vhod -----------------------------------------------------------------
initInput();
onKeyPress((key) => {
  if (key === "f3") state.debug = !state.debug;
});

// --- Game loop (delta time) -----------------------------------------------
let lastTime = 0;

function loop(timestamp) {
  // Prvi frejm: nastavi lastTime, da dt ni ogromen
  if (!lastTime) lastTime = timestamp;

  let dt = (timestamp - lastTime) / 1000;
  lastTime = timestamp;
  if (dt > MAX_DT) dt = MAX_DT;

  updatePlayer(state.player, dt, W, H);
  draw(ctx, state, W, H);

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);