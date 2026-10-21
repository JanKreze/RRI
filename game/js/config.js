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

// Game loop
export const MAX_DT = 0.05; // omejitev dt (ob zavihku v ozadju ne "skoči")

// Barve
export const BG_COLOR = "#1a1d23";
export const EYE_COLOR = "#93c5fd";

// Debug (pozicija igralca na zaslonu) — preklop s tipko F3
export const DEBUG_DEFAULT = false;