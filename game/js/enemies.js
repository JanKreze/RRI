/**
 * enemies.js — entiteta sovražnika in njegova škoda.
 * Isti oblikovni vzorec kot igralec: { x, y, w, h, color }.
 * Teden 4: sovražnik samo stoji. Teden 6: stik z njim odvzame igralcu HP.
 * Seek (teden 8) in valovi pridejo kasneje.
 */

import {
  ENEMY_SIZE,
  ENEMY_COLOR,
  CONTACT_MARGIN,
  CONTACT_DAMAGE,
  HURT_COOLDOWN,
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
 * mu odštej HP in zaženi nedotakljivost. HP ne pade pod 0.
 */
export function hurtPlayerOnContact(player, enemies) {
  if (player.hurtTimer > 0 || player.hp <= 0) return;

  if (enemies.some((e) => isTouching(player, e))) {
    player.hp = Math.max(0, player.hp - CONTACT_DAMAGE);
    player.hurtTimer = HURT_COOLDOWN;
  }
}