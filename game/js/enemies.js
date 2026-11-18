/**
 * enemies.js — entiteta sovražnika, njegova škoda in valovi.
 * Isti oblikovni vzorec kot igralec: { x, y, w, h, color } + hp.
 * Teden 4: sovražnik stoji. Teden 6: stik odvzame igralcu HP.
 * Teden 7: sovražnik ima HP in točke, valovi ga spawnajo na robu.
 * Seek (teden 8) pride kasneje: danes sovražniki stojijo.
 */

import {
  ENEMY_SIZE,
  ENEMY_COLOR,
  ENEMY_HP,
  POINTS_PER_KILL,
  CONTACT_MARGIN,
  CONTACT_DAMAGE,
  HURT_COOLDOWN,
  WAVE_START_ENEMIES,
  WAVE_ENEMY_STEP,
  SPAWN_MIN_PLAYER_DISTANCE,
  SPAWN_GAP,
} from "./config.js";
import { aabbOverlap } from "./collision.js";

/**
 * Ustvari sovražnika na dani točki.
 * @param {number} x — levi rob
 * @param {number} y — zgornji rob
 */
export function createEnemy(x, y) {
  return {
    x,
    y,
    w: ENEMY_SIZE,
    h: ENEMY_SIZE,
    color: ENEMY_COLOR,
    hp: ENEMY_HP,
    maxHp: ENEMY_HP,
    points: POINTS_PER_KILL, // točke za igralca ob uničenju
    flash: 0, // sekunde, ko je še obarvan po zadetku s kroglo (samo feedback)
  };
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

/** Naključna točka (levi zgornji kot) tik ob robu platna. */
function randomEdgePosition(W, H) {
  const side = Math.floor(Math.random() * 4); // 0 zgoraj, 1 desno, 2 spodaj, 3 levo
  const maxX = W - ENEMY_SIZE;
  const maxY = H - ENEMY_SIZE;
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
function findSpawnPosition(world, placed) {
  const { player, walls, W, H } = world;
  const pcx = player.x + player.w / 2;
  const pcy = player.y + player.h / 2;

  for (let attempt = 0; attempt < 200; attempt++) {
    const p = randomEdgePosition(W, H);
    const rect = { x: p.x, y: p.y, w: ENEMY_SIZE, h: ENEMY_SIZE };

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
 * Val n ima WAVE_START_ENEMIES + WAVE_ENEMY_STEP * (n - 1) sovražnikov na robu
 * platna. Sovražniki stojijo.
 *
 * PRAVILO VALOV: ko je world.enemies.length === 0 (arena prazna),
 * update pokliče spawnWave(world, world.wave + 1).
 */
export function spawnWave(world, n) {
  world.wave = n;

  const enemies = [];
  const count = WAVE_START_ENEMIES + WAVE_ENEMY_STEP * (n - 1);
  for (let i = 0; i < count; i++) {
    const p = findSpawnPosition(world, enemies);
    if (p) enemies.push(createEnemy(p.x, p.y));
  }

  // Skrajna rešitev: arena nikoli ne sme ostati prazna (sicer bi se vali vrstili vsak frejm)
  if (enemies.length === 0) enemies.push(createEnemy(0, 0));

  world.enemies = enemies;
}