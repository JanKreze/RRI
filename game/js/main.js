/**
 * main.js — vstopna točka: platno, vhod in game loop.
 * Stanje in posodobitev sta v world.js, risanje v render.js.
 *
 * Uporabljam delta time; max dt = 0.05 s (MAX_DT v config.js).
 * dt je v sekundah. Prvi frejm in vrnitev iz skritega zavihka bi dala
 * ogromen dt, zato ga omejimo — igralec tako ne preskoči čez pol mape.
 */

import { CANVAS_ID, MAX_DT } from "./config.js";
import { initInput, onKeyPress } from "./input.js";
import { createWorld, update, togglePause } from "./world.js";
import { draw } from "./render.js";

// --- Platno ---------------------------------------------------------------
const canvas = document.getElementById(CANVAS_ID);
const ctx = canvas.getContext("2d");

// --- Svet -----------------------------------------------------------------
const world = createWorld(canvas.width, canvas.height);

// --- Vhod -----------------------------------------------------------------
initInput();
onKeyPress((key) => {
  if (key === "f3") world.debug = !world.debug;
  if (key === "p") togglePause(world);
});

// --- Game loop (delta time) -----------------------------------------------
let lastTime = 0;

function loop(timestamp) {
  // Prvi frejm: nastavi lastTime, da dt ni ogromen
  if (!lastTime) lastTime = timestamp;

  let dt = (timestamp - lastTime) / 1000;
  lastTime = timestamp;
  if (dt > MAX_DT) dt = MAX_DT;

  update(world, dt);
  draw(ctx, world, world.W, world.H);

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);