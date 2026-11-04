/**
 * player.js — podatki o igralcu in njegovo posodabljanje.
 * Sovražnik bo kasneje isti oblikovni vzorec: { x, y, w, h, speed, color }.
 */

import {
  PLAYER_SIZE,
  PLAYER_SPEED,
  SPRINT_MULTIPLIER,
  PLAYER_COLOR,
} from "./config.js";
import { keys } from "./input.js";
import { moveWithWalls } from "./collision.js";

/**
 * Ustvari igralca na sredini platna.
 * @param {number} W — širina platna
 * @param {number} H — višina platna
 */
export function createPlayer(W, H) {
  return {
    x: W / 2 - PLAYER_SIZE / 2,
    y: H / 2 - PLAYER_SIZE / 2,
    w: PLAYER_SIZE,
    h: PLAYER_SIZE,
    speed: PLAYER_SPEED,
    color: PLAYER_COLOR,
  };
}

/** Omeji vrednost na [min, max]. */
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Premakne igralca glede na WASD / puščice (+ Shift za sprint)
 * in ga omeji na rob platna.
 * @param {object} player
 * @param {number} dt — čas od zadnjega frejma v sekundah
 * @param {number} W — širina platna
 * @param {number} H — višina platna
 * @param {Array} solids — trdni objekti { x, y, w, h } (ovire, sovražniki)
 */
export function updatePlayer(player, dt, W, H, solids) {
  let dx = 0;
  let dy = 0;

  // WASD ali puščice — oboje daje isti dx/dy
  if (keys.w || keys.arrowup) dy -= 1;
  if (keys.s || keys.arrowdown) dy += 1;
  if (keys.a || keys.arrowleft) dx -= 1;
  if (keys.d || keys.arrowright) dx += 1;

  // Diagonala: normaliziraj v enotski vektor (brez tega bi bila ~41 % hitrejša)
  if (dx !== 0 || dy !== 0) {
    const len = Math.hypot(dx, dy);
    dx /= len;
    dy /= len;
  }

  // Sprint: začasno večja hitrost (player.speed ostane nespremenjen)
  const speed = keys.shift ? player.speed * SPRINT_MULTIPLIER : player.speed;

  // Premik gre skozi trde objekte: po oseh ločeno, zato igralec drsi ob njih
  moveWithWalls(player, dx * speed * dt, dy * speed * dt, solids);

  // Clamp na rob platna (meje sveta — to NI isto kot walls)
  player.x = clamp(player.x, 0, W - player.w);
  player.y = clamp(player.y, 0, H - player.h);
}