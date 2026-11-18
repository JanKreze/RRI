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
export const PLAYER_MAX_HP = 30; // začetni HP (zapiši tudi v GDD)
export const CONTACT_DAMAGE = 10; // HP, ki ga odnese en stik s sovražnikom
export const HURT_COOLDOWN = 1.0; // s nedotakljivosti po zadetku (30 HP / 10 = 3 zadetki)

// Palica zdravja (HUD, zgoraj desno)
export const HP_BAR_W = 160;
export const HP_BAR_H = 18; // dovolj visoka, da je v njej berljivo število HP
export const HP_BAR_BG = "#374151";
export const HP_BAR_FILL = "#22c55e";

// Sovražnik (teden 4: samo entiteta, brez AI)
export const ENEMY_SIZE = 32;
export const ENEMY_COLOR = "#a3e635"; // limetno zelena, da se loči od igralca
export const ENEMY_HP = 20; // 20 HP / 10 škode = 2 zadetka do smrti
export const BULLET_DAMAGE = 10; // HP, ki ga krogla odvzame sovražniku
export const POINTS_PER_KILL = 50;

// Lebdeče številke škode ("-10") nad sovražnikom
export const POPUP_LIFETIME = 0.7; // s
export const POPUP_RISE_SPEED = 45; // px/s navzgor
export const POPUP_COLOR = "#fef08a";

// Valovi (teden 7): krivulja težavnosti = število sovražnikov v valu n:
//   WAVE_START_ENEMIES + WAVE_ENEMY_STEP * (n - 1)   (2, 3, 4, ... pri koraku 1)
export const WAVE_START_ENEMIES = 2;
export const WAVE_ENEMY_STEP = 1; // +1 sovražnik na val (poskusi 2)

// Palica nad sovražnikom
export const ENEMY_BAR_H = 4;
export const ENEMY_BAR_FILL = "#ef4444";
export const SPAWN_MIN_PLAYER_DISTANCE = 200; // px od središča igralca do sovražnika ob spawnu
export const SPAWN_GAP = 8; // px: min. razmik med sovražniki in do ovir ob spawnu
export const ENEMY_HIT_COLOR = "#f97316"; // sovražnik zatrepeta ob zadetku
export const ENEMY_HIT_FLASH = 0.15; // s
export const PLAYER_HIT_COLOR = "#ef4444"; // igralec je rdeč, dokler je hurtTimer > 0
// px: "dotik" = igralec je tik ob sovražniku. Ker resolve razveljavi cel korak,
// igralec obstane do ene dolžine koraka (~5 px, ~8 px s sprintom) od roba.
export const CONTACT_MARGIN = 8;

// Strel (teden 5): krogla je krog { x, y, vx, vy, r }; x, y = SREDIŠČE kroga
export const BULLET_SPEED = 700; // px/s (uporabi se pri premiku krogel)
export const BULLET_RADIUS = 5;
export const BULLET_COLOR = "#fbbf24";
export const SHOT_COOLDOWN = 0.3; // s med dvema streloma (~3,3 strela/s)
export const MIN_AIM_DISTANCE = 1; // px: bližje od tega miška ne določa smeri
export const SHOW_MOUSE_MARKER = false; // true = spet pokaži testni kvadratek
export const MOUSE_MARKER_SIZE = 6; // testni kvadratek na položaju miške
export const MOUSE_MARKER_COLOR = "#f472b6";

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