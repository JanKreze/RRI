/**
 * bullets.js — krogle igralca.
 * Krogla je krog { x, y, vx, vy, r }:
 *  - x, y  = SREDIŠČE kroga (ne levi zgornji kot, ker gre za krog),
 *  - vx, vy = ENOTSKI vektor smeri (hitrost BULLET_SPEED se doda pri premiku),
 *  - r      = polmer.
 */

import {
  BULLET_RADIUS,
  BULLET_SPEED,
  BULLET_DAMAGE,
  MIN_AIM_DISTANCE,
  ENEMY_HIT_FLASH,
} from "./config.js";
import { circleRectOverlap } from "./collision.js";
import { addPopup } from "./popups.js";

/**
 * Ustvari kroglo v središču igralca, usmerjeno proti miški.
 * Vrne null, če je miška (skoraj) v središču igralca — smer ni določena.
 * @param {object} player — { x, y, w, h }
 * @param {object} mouse — { x, y } v koordinatah platna
 */
export function createBullet(player, mouse) {
  // Smer računamo od SREDIŠČA igralca
  const cx = player.x + player.w / 2;
  const cy = player.y + player.h / 2;

  const dx = mouse.x - cx;
  const dy = mouse.y - cy;
  const dist = Math.hypot(dx, dy);

  if (dist < MIN_AIM_DISTANCE) return null;

  return {
    x: cx,
    y: cy,
    vx: dx / dist, // enotski vektor
    vy: dy / dist,
    r: BULLET_RADIUS,
  };
}

/** Ali je krogla celotna zunaj platna? */
function isOutside(b, W, H) {
  return b.x + b.r < 0 || b.x - b.r > W || b.y + b.r < 0 || b.y - b.r > H;
}

/**
 * Premakne vse krogle in jih nadomesti z NOVIM seznamom brez tistih, ki so
 * izginile (zunaj platna, zadele zid ali sovražnika). Array.filter ne spreminja
 * polja med iteracijo, zato ne more preskočiti sosednje krogle (za razliko
 * od splice v zanki naprej).
 * Zadetek: sovražnik izgubi BULLET_DAMAGE HP; ob hp <= 0 se odstrani iz
 * world.enemies, igralec dobi sovražnikove točke (world.score += points).
 * @param {object} world — { bullets, enemies, walls, W, H, score }
 * @param {number} dt — sekunde
 */
export function updateBullets(world, dt) {
  const { W, H, walls, enemies } = world;

  world.bullets = world.bullets.filter((b) => {
    // Premik (px/s * dt)
    b.x += b.vx * BULLET_SPEED * dt;
    b.y += b.vy * BULLET_SPEED * dt;

    if (isOutside(b, W, H)) return false;

    // Zid: krogla izgine (isti detect kot pri igralcu, samo krog proti pravokotniku)
    if (walls.some((wall) => circleRectOverlap(b, wall))) return false;

    // Sovražnik: krogla izgine, sovražnik izgubi HP in zatrepeta.
    // (hp > 0: že uničenega sovražnika v tem frejmu krogla ne zadene še enkrat)
    const hit = enemies.find((e) => e.hp > 0 && circleRectOverlap(b, e));
    if (hit) {
      hit.hp -= BULLET_DAMAGE;
      addPopup(world, hit.x + hit.w / 2, hit.y, `-${BULLET_DAMAGE}`); // nad sovražnikom
      hit.flash = ENEMY_HIT_FLASH;
      if (hit.hp <= 0) world.score += hit.points;
      return false;
    }

    return true; // krogla ostane
  });

  // Uničeni sovražniki izginejo (nov seznam, kot pri kroglah)
  world.enemies = enemies.filter((e) => e.hp > 0);
}