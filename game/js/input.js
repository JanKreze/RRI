/**
 * input.js — tipkovnica in miška.
 * Pravilo: listenerji samo ZABELEŽIJO stanje (keys, world.mouse).
 * Premik živi v player.js (updatePlayer), strel v world.js (update).
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

/**
 * Pretvori položaj miške iz okna v koordinate platna (800x450 ...), tudi če je
 * platno v CSS-u povečano/pomanjšano. clientLeft/clientTop/clientWidth ne
 * vključujejo obrobe (border), zato so koordinate natančne.
 * @param {MouseEvent} e
 * @param {HTMLCanvasElement} canvas
 */
export function mouseOnCanvas(e, canvas) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / canvas.clientWidth;
  const scaleY = canvas.height / canvas.clientHeight;
  return {
    x: (e.clientX - rect.left - canvas.clientLeft) * scaleX,
    y: (e.clientY - rect.top - canvas.clientTop) * scaleY,
  };
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{x:number, y:number, down:boolean}} mouse — world.mouse (listenerji ga samo zapisujejo)
 */
export function initInput(canvas, mouse) {
  canvas.addEventListener("mousemove", (e) => {
    Object.assign(mouse, mouseOnCanvas(e, canvas));
  });

  canvas.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return; // samo leva tipka
    Object.assign(mouse, mouseOnCanvas(e, canvas));
    mouse.down = true;
    e.preventDefault(); // brez izbiranja besedila ob vlečenju
  });

  // mouseup na window: igralec lahko spusti tipko tudi zunaj platna
  window.addEventListener("mouseup", (e) => {
    if (e.button === 0) mouse.down = false;
  });

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
    mouse.down = false;
  });
}