/**
 * world.js — stanje sveta in posodobitev (update).
 * Tukaj živi vse, kar se spreminja med igro: stanje igre, igralec, kasneje
 * sovražniki in strele. Loop (main.js) samo kliče update(world, dt).
 */

import {
  DEBUG_DEFAULT,
  STATES,
  WALLS,
  ENEMY_START,
  CONTACT_MARGIN,
} from "./config.js";
import { createPlayer, updatePlayer } from "./player.js";
import { createEnemy } from "./enemies.js";
import { aabbOverlap } from "./collision.js";

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
    walls: WALLS,
    enemies: [createEnemy(ENEMY_START.x, ENEMY_START.y)],
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

  // Trdni objekti: ovire in sovražniki (igralec ne more skozi nobenega)
  const solids = [...world.walls, ...world.enemies];
  updatePlayer(world.player, dt, world.W, world.H, solids);

  // Samo feedback (HP je teden 6): dotik = igralec je tik ob sovražniku.
  // Ker sta trdna, se ne moreta prekrivati, zato preverimo z majhno rezervo.
  world.player.touchingEnemy = world.enemies.some((e) =>
    aabbOverlap(world.player, {
      x: e.x - CONTACT_MARGIN,
      y: e.y - CONTACT_MARGIN,
      w: e.w + 2 * CONTACT_MARGIN,
      h: e.h + 2 * CONTACT_MARGIN,
    })
  );
  // Kasneje (teden 8): updateEnemy za vsakega sovražnika; strele.
}