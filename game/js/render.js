/**
 * render.js — vse risanje na platno.
 */

import { BG_COLOR, EYE_COLOR } from "./config.js";

/**
 * Nariše en frejm.
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} state — { player, debug }
 * @param {number} W
 * @param {number} H
 */
export function draw(ctx, state, W, H) {
  const { player, debug } = state;

  // Počisti platno
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, W, H);

  // Igralec
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // Majhen "obraz" — vizualni hint
  ctx.fillStyle = EYE_COLOR;
  ctx.fillRect(player.x + 8, player.y + 8, 6, 6);
  ctx.fillRect(player.x + 18, player.y + 8, 6, 6);

  if (debug) drawDebug(ctx, player);
}

/** Debug: izpiše pozicijo igralca v kotu platna. */
function drawDebug(ctx, player) {
  ctx.fillStyle = "#e8eaed";
  ctx.font = "14px monospace";
  ctx.textBaseline = "top";
  ctx.fillText(
    `x: ${player.x.toFixed(1)}  y: ${player.y.toFixed(1)}`,
    10,
    10
  );
  ctx.fillText("F3 = skrij debug", 10, 28);
}