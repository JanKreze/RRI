/**
 * popups.js — lebdeče številke (npr. "-10" nad sovražnikom ob zadetku).
 * Popup je { x, y, text, age }: se dviga in po POPUP_LIFETIME izgine.
 */

import { POPUP_LIFETIME, POPUP_RISE_SPEED } from "./config.js";

/**
 * Doda popup na dano točko (rahlo naključen x, da se zaporedni ne prekrivajo).
 * @param {object} world — { popups }
 */
export function addPopup(world, x, y, text) {
  world.popups.push({ x: x + (Math.random() - 0.5) * 16, y, text, age: 0 });
}

/**
 * Premakne popupe navzgor, postara jih in vrne NOV seznam brez izteklih
 * (Array.filter, kot pri kroglah).
 */
export function updatePopups(world, dt) {
  for (const p of world.popups) {
    p.age += dt;
    p.y -= POPUP_RISE_SPEED * dt;
  }
  world.popups = world.popups.filter((p) => p.age < POPUP_LIFETIME);
}