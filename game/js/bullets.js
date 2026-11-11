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
  MIN_AIM_DISTANCE,
  ENEMY_HIT_FLASH,
} from "./config.js";
import { circleRectOverlap } from "./collision.js";

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
 * Premakne vse krogle in vrne NOV seznam brez tistih, ki so izginile
 * (zunaj platna, zadele zid ali sovražnika). Array.filter ne spreminja
 * polja med iteracijo, zato ne more preskočiti sosednje krogle (za razliko
 * od splice v zanki naprej).
 * @param {Array} bullets
 * @param {number} dt — sekunde
 * @param {number} W
 * @param {number} H
 * @param {Array} walls — { x, y, w, h }
 * @param {Array} enemies — { x, y, w, h, flash }
 */
export function updateBullets(bullets, dt, W, H, walls, enemies) {
  return bullets.filter((b) => {
    // Premik (px/s * dt)
    b.x += b.vx * BULLET_SPEED * dt;
    b.y += b.vy * BULLET_SPEED * dt;

    if (isOutside(b, W, H)) return false;

    // Zid: krogla izgine (isti detect kot pri igralcu, samo krog proti pravokotniku)
    if (walls.some((wall) => circleRectOverlap(b, wall))) return false;

    // Sovražnik: krogla izgine, sovražnik zatrepeta (kill/score je teden 7)
    const hit = enemies.find((e) => circleRectOverlap(b, e));
    if (hit) {
      hit.flash = ENEMY_HIT_FLASH;
      return false;
    }

    return true; // krogla ostane
  });
}