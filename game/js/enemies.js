/**
 * enemies.js — sovražniki: tipi, seek, škoda in valovi.
 * Isti oblikovni vzorec kot igralec: { x, y, w, h, color } + hp, speed, points.
 * Teden 4: sovražnik stoji. Teden 6: stik odvzame igralcu HP.
 * Teden 7: HP, točke, valovi na robu. Teden 8: seek in dva tipa (KINDS).
 */

import {
  KINDS,
  CONTACT_MARGIN,
  CONTACT_DAMAGE,
  HURT_COOLDOWN,
  WAVE_START_ENEMIES,
  WAVE_ENEMY_STEP,
  WAVE_RUNNERS_FROM,
  WAVE_RUNNER_SHARE,
  SPAWN_MIN_PLAYER_DISTANCE,
  SPAWN_GAP,
} from "./config.js";
import { aabbOverlap, moveWithWalls } from "./collision.js";

/**
 * Ustvari sovražnika danega tipa (ključ v KINDS) na dani točki.
 * @param {number} x — levi rob
 * @param {number} y — zgornji rob
 * @param {string} kind — "walker" | "runner"
 */
export function createEnemy(x, y, kind = "walker") {
  const k = KINDS[kind];
  return {
    kind,
    x,
    y,
    w: k.size,
    h: k.size,
    speed: k.speed, // px/s
    color: k.color,
    hp: k.hp,
    maxHp: k.hp,
    points: k.points, // točke za igralca ob uničenju
    flash: 0, // sekunde, ko je še obarvan po zadetku s kroglo (samo feedback)
  };
}

// --- Seek -------------------------------------------------------------------

/**
 * Seek: sovražnik se premika proti središču igralca. Isti za vse tipe —
 * tip menja samo `speed`. Brez pathfindinga: ob zidu se ustavi (po oseh drsi).
 * Premik gre skozi moveWithWalls (isto kot pri igralcu); trdni so zidovi,
 * igralec in drugi sovražniki (da se ne prekrivajo in ne ujamejo igralca).
 * @param {object} e — sovražnik
 * @param {number} dt — sekunde
 * @param {object} world — { player, walls, enemies }
 */
export function updateEnemy(e, dt, world) {
  const { player } = world;

  // Vektor od središča sovražnika do središča igralca
  const dx = player.x + player.w / 2 - (e.x + e.w / 2);
  const dy = player.y + player.h / 2 - (e.y + e.h / 2);
  const dist = Math.hypot(dx, dy);
  if (dist < 1) return; // na istem mestu: smer ni določena

  // Enotski vektor * hitrost * dt
  const step = e.speed * dt;
  const solids = [
    ...world.walls,
    player,
    ...world.enemies.filter((o) => o !== e),
  ];
  moveWithWalls(e, (dx / dist) * step, (dy / dist) * step, solids);
}

/**
 * Stik: igralec je tik ob sovražniku. Sovražnik je trden, zato se z igralcem
 * nikoli ne prekriva — preverimo z majhno rezervo (CONTACT_MARGIN).
 */
function isTouching(player, enemy) {
  return aabbOverlap(player, {
    x: enemy.x - CONTACT_MARGIN,
    y: enemy.y - CONTACT_MARGIN,
    w: enemy.w + 2 * CONTACT_MARGIN,
    h: enemy.h + 2 * CONTACT_MARGIN,
  });
}

/**
 * Če se igralec dotika sovražnika in ni nedotakljiv (hurtTimer <= 0),
 * mu odštej HP in zaženi nedotakljivost. HP ne gre pod 0.
 */
export function hurtPlayerOnContact(player, enemies) {
  if (player.hurtTimer > 0 || player.hp <= 0) return;

  if (enemies.some((e) => isTouching(player, e))) {
    player.hp = Math.max(0, player.hp - CONTACT_DAMAGE);
    player.hurtTimer = HURT_COOLDOWN;
  }
}

// --- Valovi ---------------------------------------------------------------

/** Naključna točka (levi zgornji kot) tik ob robu platna za sovražnika velikosti size. */
function randomEdgePosition(W, H, size) {
  const side = Math.floor(Math.random() * 4); // 0 zgoraj, 1 desno, 2 spodaj, 3 levo
  const maxX = W - size;
  const maxY = H - size;
  if (side === 0) return { x: Math.random() * maxX, y: 0 };
  if (side === 1) return { x: maxX, y: Math.random() * maxY };
  if (side === 2) return { x: Math.random() * maxX, y: maxY };
  return { x: 0, y: Math.random() * maxY };
}

/** Pravokotnik povečan na vse strani (za razmik pri spawnu). */
function grow(rect, m) {
  return { x: rect.x - m, y: rect.y - m, w: rect.w + 2 * m, h: rect.h + 2 * m };
}

/**
 * Poišče prosto točko na robu: ne v zidu, ne blizu igralca, ne na drugem
 * sovražniku. Vrne null, če je po 200 poskusih ne najde.
 */
function findSpawnPosition(world, placed, size) {
  const { player, walls, W, H } = world;
  const pcx = player.x + player.w / 2;
  const pcy = player.y + player.h / 2;

  for (let attempt = 0; attempt < 200; attempt++) {
    const p = randomEdgePosition(W, H, size);
    const rect = { x: p.x, y: p.y, w: size, h: size };

    // dovolj daleč od igralca (da ga ne poškoduje takoj)
    const dist = Math.hypot(rect.x + rect.w / 2 - pcx, rect.y + rect.h / 2 - pcy);
    if (dist < SPAWN_MIN_PLAYER_DISTANCE) continue;

    // ne v zidu in ne na drugem sovražniku (z majhnim razmikom)
    const grown = grow(rect, SPAWN_GAP);
    if (walls.some((w) => aabbOverlap(grown, w))) continue;
    if (placed.some((e) => aabbOverlap(grown, e))) continue;

    return p;
  }
  return null;
}

/**
 * Nov val: nastavi world.wave = n in napolni world.enemies.
 * Skupno število: WAVE_START_ENEMIES + WAVE_ENEMY_STEP * (n - 1).
 * Val 1 so sami walkerji; od vala WAVE_RUNNERS_FROM je približno tretjina
 * runnerjev (vsaj eden), ostalo walkerji.
 *
 * PRAVILO VALOV: ko je world.enemies.length === 0 (arena prazna),
 * update pokliče spawnWave(world, world.wave + 1).
 */
export function spawnWave(world, n) {
  world.wave = n;

  const count = WAVE_START_ENEMIES + WAVE_ENEMY_STEP * (n - 1);
  const runners =
    n >= WAVE_RUNNERS_FROM
      ? Math.max(1, Math.round(count * WAVE_RUNNER_SHARE))
      : 0;

  // Najprej večji (walkerji), da jim je lažje najti prostor
  const kinds = [
    ...Array(count - runners).fill("walker"),
    ...Array(runners).fill("runner"),
  ];

  const enemies = [];
  for (const kind of kinds) {
    const p = findSpawnPosition(world, enemies, KINDS[kind].size);
    if (p) enemies.push(createEnemy(p.x, p.y, kind));
  }

  // Skrajna rešitev: arena nikoli ne sme ostati prazna (sicer bi se vali vrstili vsak frejm)
  if (enemies.length === 0) enemies.push(createEnemy(0, 0, "walker"));

  world.enemies = enemies;
}