# Teden 7 — Vaja: score, valovi, HUD

**Predviden čas:** ~3–4 ure.  
**Izhod:** točke ob uničenju, vsaj 2 vala, HUD (score, val, HP).  
**Gradiva:** tvoja igra (teden 6), `PROMPTI.md`, svoj GDD.

| Datoteka | Kaj |
|----------|-----|
| `js/bullets.js` | trk s sovražnikom: `hp`, ob `hp <= 0` odstrani in prištej `points` k `world.score` |
| `js/enemies.js` | `spawnWave(n)` — več sovražnikov na robu; klic, ko je `world.enemies.length === 0` |
| `js/render.js` | HUD: palica HP iz tedna 6 ostane; zraven `fillText` za točke in val |
| `js/game.js` | `resetGame` ponastavi `score`, `wave` in pokliče `spawnWave(1)` |
| `js/world.js` | `world.score`, `world.wave` |

Seek (`updateEnemy`) je še vedno teden 8. Danes sovražniki smejo stati.

---

## Korak 0 (~10 min)

- [x] HP / game over / strel delujejo.
- [x] Imaš vsaj eno entiteto sovražnika.

---

## Korak 1 — Uničenje in score (~40–50 min)

- [x] Sovražnik ima lahko `hp` (1 zadetek = smrt je OK). *jaz osebno bi raje imel 2 zadetka = smrt ter manj sovražnikov*
- [x] Trk `bullet` vs. `enemy`: odstrani kroglo, zmanjšaj/ubit sovražnika, `score += …`.
- [x] Konstanta `POINTS_PER_KILL`.

Test: ustreli dummy — izgine (ali umre), score zraste, v HUD se vidi.

Če imaš samo enega in po smrti arena ostane prazna: to reši korak 2 (spawn).

---

## Korak 2 — Valovi (~50–70 min)

- [x] `wave` začne pri 1. Funkcija `spawnWave(n)` nastavi `wave = n` in napolni `enemies`.
- [x] Spawn na robu platna, ne v zidu in ne na igralcu.
- [x] Naslednji val: ko je `enemies.length === 0`, pokliči `spawnWave(wave + 1)`. To pravilo zapiši v komentar in v GDD.
- [x] Val 2 ima več sovražnikov kot val 1 (npr. `2 + wave`).

Sovražniki smejo stati. Seek in dva tipa sta **teden 8**.

- [x] `resetGame` ponastavi `score`, `wave`, `enemies`.

---

## Korak 3 — HUD (~25–35 min)

- [x] Med PLAYING: palica HP (teden 6) plus točke in val (`fillText`) na temnem pravokotniku, da se berejo.
- [x] GAME_OVER: končne točke vidne.
- [x] Palica se ujema s `player.hp` — če zadeneš, se takoj skrajša.

Ne delaj HTML CSS menija namesto zanke — če dodaš HTML HUD, naj se ujema s `state`.

---

## Korak 4 — GDD (~20–30 min)

- [x] §4/§7: progressija (kako se val otežuje).
- [x] Win condition, če ga imaš; sicer “endless survival” + lose = HP 0.

---

## Korak 5 — AI (~25–35 min)

Prompt A: model `wave` + spawn, **pseudokoda ali majhen kos**.

- [x] Spremeni krivuljo težavnosti (npr. +1 enemy na val vs. +2) in opiši občutek.
- [x] Commit: `teden 7: score, valovi, HUD`.

---

## Korak 6 — Zapri

### Priprava na teden 8 (milestone)

> Skupna baza = premik, loop, trki, strel, HP, score, valovi + **seek in 2 tipa**. Kaj ti še manjka?

---

## Merila “opravil teden 7”

| Merilo | OK |
|--------|----|
| Uničenje da score | |
| Vsaj prehod val 1 → val 2 po jasnem pravilu | |
| HUD: score, val, HP | |
| Restart ponastavi napredek | |
| GDD progressija dopolnjena | |
| AI model valov + lastna sprememba težavnosti | |
