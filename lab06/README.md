# Teden 6 — Vaja: HP, škoda, game over

**Predviden čas:** ~3–4 ure.  
**Izhod:** stik z nevarnostjo zmanjša HP (z `hurtTimer`); ob 0 game over; R kliče `resetGame`.  
**Gradiva:** tvoja igra (teden 5), `PROMPTI.md`.

| Datoteka | Kaj |
|----------|-----|
| `js/player.js` | `hp`, `maxHp`, `hurtTimer`; v `updatePlayer` odštej `hurtTimer` |
| `js/config.js` | `PLAYER_MAX_HP`, `HURT_COOLDOWN` |
| `js/enemies.js` | ob `aabbOverlap` z igralcem in `hurtTimer <= 0` zmanjšaj HP |
| `js/game.js` | `resetGame` postavi igralca, prazne sezname in `world.state = "PLAYING"` |
| `js/render.js` | palica HP (`fillRect`, širina `hp / maxHp`); ob `GAME_OVER` besedilo na platnu |
| `js/input.js` | tipka **R** kliče `resetGame` |
| `js/world.js` | `world.state` dobi vrednost `"GAME_OVER"` |

---

## Korak 0 (~10 min)

- [x] Streljanje in trki z ovirami delujejo.
- [x] `state` obstaja (teden 3).

---

## Korak 1 — HP (~25–35 min)

- [x] `player.hp` in `player.maxHp` (npr. 5 — bodi dosleden z `PLAYER_MAX_HP` v `js/config.js`).
- [x] V `js/render.js`, med `PLAYING`: palica zdravja. Temno ozadje, nanj zelen `fillRect` širine `barW * (player.hp / player.maxHp)`. Ko pade HP, se palica skrajša. Besedilo samo po sebi ni dovolj.
- [x] GDD: zapiši začetni HP.

---

## Korak 2 — Škoda + pavza (`hurtTimer`) (~40–50 min)

Nevarnost: dummy `enemy` in/ali `hazard` `{x,y,w,h}`.

- [x] `hurtTimer` (sekunde). Vsak frejm v PLAYING: zmanjšaj z `dt`.
- [x] Če `aabbOverlap(player, nevarnost)` in `hurtTimer <= 0`: odštej HP, nastavi `hurtTimer`.
- [x] Dokler je `hurtTimer > 0`: igralec ima drugačno barvo (utripanje ni potrebno).

Test: stoj na nevarnosti 2 s — umreš postopoma, ne v 3 frejmih (razen če imaš 3 HP in kratek cooldown — prilagodi številke).

- [x] Konstanti `CONTACT_DAMAGE` in `HURT_COOLDOWN`.

---

## Korak 3 — GAME_OVER (~30–40 min)

- [x] Ko `hp <= 0`: `state = "GAME_OVER"`.
- [x] Update sveta (premik, streli) se ustavi.
- [x] Draw: temnejši overlay ali samo veliko besedilo na canvasu.
- [x] `keydown` **r** / **R** kliče `resetGame()`.

`resetGame` naj vsaj:

- HP na max,
- igralec na začetno pozicijo,
- `hurtTimer = 0`,
- (priporočeno) sprazni `bullets`,
- `state = "PLAYING"`.

Test: umri, pritisni R, igraj znova **brez** osvežitve strani.

---

## Korak 4 — Robni primeri (~20 min)

- [x] Škoda se ne dogaja v `GAME_OVER`.
- [x] Več ovir + nevarnost hkrati ne pokvari clamp/trkov.
- [x] Pause (če ga imaš): med pauzo ni škode.

---

## Korak 5 — AI (~30 min)

Prompt A: hp, hurtTimer, preklop state.

- [x] Spremeni `maxHp` **ali** `HURT_COOLDOWN` in opiši občutek (lažje/težje).
- [x] Commit: `teden 6: HP, hurtTimer, GAME_OVER + R`.

---

## Korak 6 — Zapri

- [x] GDD §7 lose condition v 1–2 stavkih.

### Priprava na teden 7

> Kaj šteješ za “val”: čas, število ubitih, ali spawn, ko je arena prazna?

---

## Merila “opravil teden 6”

| Merilo | OK |
|--------|----|
| Palica HP se med igro vidi in krajša ob zadetku | |
| Stik zmanjša HP; `hurtTimer` prepreči škodo vsak frejm | |
| `GAME_OVER` na canvasu | |
| R restart brez F5 (`resetGame`) | |
| AI + lastna sprememba številk + razlaga | |
