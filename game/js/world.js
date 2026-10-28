/**
 * world.js — stanje sveta in posodobitev (update).
 * Tukaj živi vse, kar se spreminja med igro: stanje igre, igralec, kasneje
 * sovražniki in strele. Loop (main.js) samo kliče update(world, dt).
 */

import { DEBUG_DEFAULT, STATES } from "./config.js";
import { createPlayer, updatePlayer } from "./player.js";

/**
 * Ustvari svet.
 * @param {number} W — širina platna
 * @param {number} H — višina platna
 */
export function createWorld(W, H) {
  return {
    W,
    H,
    state: STATES.PLAYING, // MENU | PAUSED | PLAYING | GAME_OVER (glej config.js)
    debug: DEBUG_DEFAULT,
    player: createPlayer(W, H),
  };
}

/** Preklopi PLAYING <-> PAUSED. V drugih stanjih ne naredi nič. */
export function togglePause(world) {
  if (world.state === STATES.PLAYING) world.state = STATES.PAUSED;
  else if (world.state === STATES.PAUSED) world.state = STATES.PLAYING;
}

/**
 * Posodobi svet za en frejm. Fizika/premik se dogaja samo med igranjem.
 * @param {object} world
 * @param {number} dt — čas od zadnjega frejma v sekundah
 */
export function update(world, dt) {
  if (world.state !== STATES.PLAYING) return;

  updatePlayer(world.player, dt, world.W, world.H);
  // Kasneje (teden 4+): tukaj posodobiš tudi sovražnike in strele.
}