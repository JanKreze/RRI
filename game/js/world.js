/**
 * world.js — stanje sveta in posodobitev (update).
 * Tukaj živi vse, kar se spreminja med igro: stanje igre, igralec, kasneje
 * sovražniki in strele. Loop (main.js) samo kliče update(world, dt).
 */

import {
  DEBUG_DEFAULT,
  STATES,
  WALLS,
  SHOT_COOLDOWN,
} from "./config.js";
import { createPlayer, updatePlayer } from "./player.js";
import { spawnWave, updateEnemy, hurtPlayerOnContact } from "./enemies.js";
import { createBullet, updateBullets } from "./bullets.js";
import { updatePopups } from "./popups.js";

/**
 * Ustvari svet.
 * @param {number} W — širina platna
 * @param {number} H — višina platna
 */
export function createWorld(W, H) {
  const world = {
    W,
    H,
    state: STATES.PLAYING, // MENU | PAUSED | PLAYING | GAME_OVER (glej config.js)
    debug: DEBUG_DEFAULT,
    player: createPlayer(W, H),
    walls: WALLS,
    enemies: [], // napolni spawnWave
    score: 0,
    wave: 0, // spawnWave(world, 1) ga nastavi na 1
    mouse: { x: 0, y: 0, down: false }, // koordinate platna; listenerji v input.js
    bullets: [],
    popups: [], // lebdeče številke škode
    shotTimer: 0, // sekunde do naslednjega dovoljenega strela
  };
  spawnWave(world, 1); // potrebuje world.player in world.walls
  return world;
}

/**
 * Nova igra brez osveževanja strani: nov igralec (max HP, začetna pozicija,
 * hurtTimer = 0), score = 0, prazne krogle, val 1 z novimi sovražniki,
 * state = PLAYING. Miška, debug in ovire ostanejo.
 */
export function resetGame(world) {
  world.player = createPlayer(world.W, world.H); // pred spawnom: spawn gleda igralca
  world.bullets = [];
  world.popups = [];
  world.shotTimer = 0;
  world.score = 0;
  spawnWave(world, 1); // nastavi wave = 1 in zamenja enemies
  world.state = STATES.PLAYING;
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

  // Seek: vsak sovražnik se premika proti igralcu (isti updateEnemy za vse tipe)
  for (const e of world.enemies) updateEnemy(e, dt, world);

  // Škoda ob stiku s sovražnikom (hurtTimer v updatePlayer že teče z dt)
  hurtPlayerOnContact(world.player, world.enemies);

  // Konec igre: update sveta se od naslednjega frejma ustavi (state != PLAYING)
  if (world.player.hp <= 0) {
    world.state = STATES.GAME_OVER;
    return;
  }

  // Krogle: premik + izginotje (zunaj platna, zid, sovražnik)
  updatePopups(world, dt); // pred krogli: nov popup se prvi frejm še ne premakne
  updateBullets(world, dt);

  // PRAVILO VALOV: ko je arena prazna (vsi sovražniki uničeni), se začne
  // naslednji val z več sovražniki: spawnWave(world, world.wave + 1)
  if (world.enemies.length === 0) spawnWave(world, world.wave + 1);

  // Zatrepetanje sovražnika po zadetku usahne
  for (const e of world.enemies) e.flash = Math.max(0, e.flash - dt);

  // Strel: časovnik teče z dt; strelja samo, ko je <= 0 in je miška pritisnjena
  world.shotTimer = Math.max(0, world.shotTimer - dt);
  if (world.mouse.down && world.shotTimer <= 0) {
    const bullet = createBullet(world.player, world.mouse);
    if (bullet) {
      world.bullets.push(bullet);
      world.shotTimer = SHOT_COOLDOWN;
    }
  }
}