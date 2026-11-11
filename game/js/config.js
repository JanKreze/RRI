/**
 * config.js — konstante igre na enem mestu (lažje uravnavanje in GDD).
 */

// Velikost igralnega polja (mora se ujemati z width/height v index.html)
export const CANVAS_ID = "game";

// Igralec
export const PLAYER_SIZE = 32;
export const PLAYER_SPEED = 320; // piksli na sekundo
export const SPRINT_MULTIPLIER = 1.6; // Shift = 1.6x hitrost
export const PLAYER_COLOR = "#16a34a";

// Sovražnik (teden 4: samo entiteta, brez AI)
export const ENEMY_SIZE = 32;
export const ENEMY_COLOR = "#a3e635"; // limetno zelena, da se loči od igralca
export const ENEMY_START = { x: 640, y: 340 }; // fiksna točka, stran od ovir
export const ENEMY_HIT_COLOR = "#f97316"; // sovražnik zatrepeta ob zadetku
export const ENEMY_HIT_FLASH = 0.15; // s
export const PLAYER_HIT_COLOR = "#ef4444"; // igralec se obarva ob dotiku sovražnika
// px: "dotik" = igralec je tik ob sovražniku. Ker resolve razveljavi cel korak,
// igralec obstane do ene dolžine koraka (~5 px, ~8 px s sprintom) od roba.
export const CONTACT_MARGIN = 8;

// Strel (teden 5): krogla je krog { x, y, vx, vy, r }; x, y = SREDIŠČE kroga
export const BULLET_SPEED = 700; // px/s (uporabi se pri premiku krogel)
export const BULLET_RADIUS = 5;
export const BULLET_COLOR = "#fbbf24";
export const SHOT_COOLDOWN = 0.2; // s med dvema streloma
export const MIN_AIM_DISTANCE = 1; // px: bližje od tega miška ne določa smeri
export const MOUSE_MARKER_SIZE = 6; // testni kvadratek na položaju miške
export const MOUSE_MARKER_COLOR = "#d7e9ee";

// Stanja igre (world.state)
export const STATES = Object.freeze({
  MENU: "MENU",
  PAUSED: "PAUSED",
  PLAYING: "PLAYING",
  GAME_OVER: "GAME_OVER", // teden 6
});

// Game loop
export const MAX_DT = 0.05; // omejitev dt (ob zavihku v ozadju ne "skoči")

// Barve
export const BG_COLOR = "#1a1d23";
export const EYE_COLOR = "#93c5fd";

// Ovire (teden 4): { x, y, w, h } v pikslih. Clamp na rob platna ostane posebej.
export const WALL_COLOR = "#6b7280";
export const WALLS = [
  { x: 520, y: 100, w: 30, h: 250 }, // navpična stena
  { x: 150, y: 300, w: 200, h: 30 }, // vodoravna stena
  { x: 200, y: 90, w: 60, h: 60 }, // blok
];

// Debug (pozicija igralca na zaslonu) — preklop s tipko F3
export const DEBUG_DEFAULT = false;