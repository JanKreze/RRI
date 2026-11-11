/**
 * render.js — vse risanje na platno.
 */

import {
  BG_COLOR,
  EYE_COLOR,
  STATES,
  WALL_COLOR,
  PLAYER_HIT_COLOR,
  BULLET_COLOR,
  ENEMY_HIT_COLOR,
  MOUSE_MARKER_SIZE,
  MOUSE_MARKER_COLOR,
} from "./config.js";

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

  // Ovire
  ctx.fillStyle = WALL_COLOR;
  for (const wall of world.walls) {
    ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
  }

  // Sovražniki (vidni vsak frejm, tudi v PAUSED)
  for (const enemy of world.enemies) {
    ctx.fillStyle = enemy.flash > 0 ? ENEMY_HIT_COLOR : enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);
  }

  // Igralec (v PAUSED se še vedno nariše — zamrznjen svet);
  // rdeč, dokler se dotika sovražnika
  ctx.fillStyle = player.touchingEnemy ? PLAYER_HIT_COLOR : player.color;
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // Majhen "obraz" — vizualni hint
  ctx.fillStyle = EYE_COLOR;
  ctx.fillRect(player.x + 8, player.y + 8, 6, 6);
  ctx.fillRect(player.x + 18, player.y + 8, 6, 6);

  // Krogle (krog s središčem x, y)
  ctx.fillStyle = BULLET_COLOR;
  for (const b of world.bullets) {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Test (korak 1): kvadratek na položaju miške — mora sovpadati s kazalcem
  const m = world.mouse;
  ctx.fillStyle = MOUSE_MARKER_COLOR;
  ctx.fillRect(
    m.x - MOUSE_MARKER_SIZE / 2,
    m.y - MOUSE_MARKER_SIZE / 2,
    MOUSE_MARKER_SIZE,
    MOUSE_MARKER_SIZE
  );

  // Trenutno stanje igre
  ctx.fillStyle = "#e8eaed";
  ctx.font = "14px monospace";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(state, 12, 12);

  if (debug) drawDebug(ctx, world);
  if (state === STATES.PAUSED) drawPause(ctx, W, H);
}

/** Debug: pozicija igralca, miška in zadnja krogla pod oznako stanja. */
function drawDebug(ctx, world) {
  const { player, mouse, bullets } = world;
  const last = bullets[bullets.length - 1];
  ctx.fillStyle = "#e8eaed";
  ctx.font = "14px monospace";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(
    `x: ${player.x.toFixed(1)}  y: ${player.y.toFixed(1)}`,
    12,
    32
  );
  ctx.fillText(
    `miška: ${mouse.x.toFixed(0)}, ${mouse.y.toFixed(0)}  down: ${mouse.down}`,
    12,
    50
  );
  ctx.fillText(
    `krogle: ${bullets.length}` +
      (last ? `  zadnja v: ${last.vx.toFixed(2)}, ${last.vy.toFixed(2)}` : ""),
    12,
    68
  );
  ctx.fillText("F3 = skrij debug", 12, 86);
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