/**
 * render.js — vse risanje na platno.
 */

import { BG_COLOR, EYE_COLOR, STATES } from "./config.js";

/**
 * Nariše en frejm.
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} world — { state, player, debug }
 * @param {number} W
 * @param {number} H
 */
export function draw(ctx, world, W, H) {
  const { player, debug, state } = world;

  // Počisti platno
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, W, H);

  // Igralec (v PAUSED se še vedno nariše — zamrznjen svet)
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // Majhen "obraz" — vizualni hint
  ctx.fillStyle = EYE_COLOR;
  ctx.fillRect(player.x + 8, player.y + 8, 6, 6);
  ctx.fillRect(player.x + 18, player.y + 8, 6, 6);

  // Trenutno stanje igre
  ctx.fillStyle = "#e8eaed";
  ctx.font = "14px monospace";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(state, 12, 12);

  if (debug) drawDebug(ctx, player);
  if (state === STATES.PAUSED) drawPause(ctx, W, H);
}

/** Debug: izpiše pozicijo igralca pod oznako stanja. */
function drawDebug(ctx, player) {
  ctx.fillStyle = "#e8eaed";
  ctx.font = "14px monospace";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(
    `x: ${player.x.toFixed(1)}  y: ${player.y.toFixed(1)}`,
    12,
    32
  );
  ctx.fillText("F3 = skrij debug", 12, 50);
}

/** Zatemnitev in napis PAUZA čez zamrznjen svet. */
function drawPause(ctx, W, H) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#e8eaed";
  ctx.font = "bold 48px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("PAUZA", W / 2, H / 2);

  ctx.font = "16px system-ui, sans-serif";
  ctx.fillText("P = nadaljuj", W / 2, H / 2 + 40);
}