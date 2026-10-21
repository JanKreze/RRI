/**
 * input.js — tipkovnica.
 * Pravilo: listenerji samo ZABELEŽIJO stanje tipk.
 * Premik živi v player.js (updatePlayer).
 */

// true = tipka je trenutno pritisnjena (imena so male črke)
export const keys = {
  w: false,
  a: false,
  s: false,
  d: false,
  arrowup: false,
  arrowdown: false,
  arrowleft: false,
  arrowright: false,
  shift: false,
};

// Tipke, ki jih ne smemo pustiti brskalniku (scroll strani)
const PREVENT_DEFAULT = new Set([
  "w", "a", "s", "d",
  "arrowup", "arrowdown", "arrowleft", "arrowright",
]);

// Enkratni dogodki (npr. preklop debug načina) — brez stanja
const pressListeners = [];

/** Registriraj funkcijo, ki se pokliče ob pritisku tipke (brez ponavljanja). */
export function onKeyPress(callback) {
  pressListeners.push(callback);
}

export function initInput() {
  window.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    if (k in keys) {
      keys[k] = true;
      if (PREVENT_DEFAULT.has(k)) e.preventDefault();
    }
    if (!e.repeat) {
      for (const cb of pressListeners) cb(k);
    }
  });

  window.addEventListener("keyup", (e) => {
    const k = e.key.toLowerCase();
    if (k in keys) keys[k] = false;
  });

  // Če igralec zamenja okno med držanjem tipke, keyup ne pride — ponastavi vse
  window.addEventListener("blur", () => {
    for (const k in keys) keys[k] = false;
  });
}