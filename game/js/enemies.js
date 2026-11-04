/**
 * enemies.js — entiteta sovražnika.
 * Isti oblikovni vzorec kot igralec: { x, y, w, h, color }.
 * Teden 4: sovražnik samo stoji. HP (teden 6), seek (teden 8) in valovi pridejo kasneje.
 */

import { ENEMY_SIZE, ENEMY_COLOR } from "./config.js";

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
  };
}