# Teden 8 — Vaja: seek, 2 tipa, milestone skupna baza

**Predviden čas:** ~3–4 ure.  
**Izhod:** igriva survival igra z seek AI in dvema tipoma sovražnikov; README “kako igrati”; pripravljen prehod v [`projekt/`](../projekt/).  
**Gradiva:** tvoja igra (teden 7), `PROMPTI.md`, referenca [`demo/js/`](../demo/js/).

Tvoja mapa `js/` naj se ujema z referenco. Ta teden dopolniš samo še seek in dva tipa:

| Datoteka | Kaj |
|----------|-----|
| `js/config.js` | `KINDS`: `walker` in `runner` (`speed`, `hp`, `color`, `points`) |
| `js/enemies.js` | `updateEnemy` — isti seek za oba; `spawnWave` od vala 2 doda runnerje |
| `js/game.js` | v `update` kliče `updateEnemy` za vsakega v `world.enemies` |
| `js/collision.js` | premik sovražnika gre skozi `moveWithWalls` |
| `js/render.js` | palica nad sovražnikom, če je `maxHp > 1` |

Zagon reference: `python3 -m http.server` v mapi `demo/`.

---

## Korak 0 (~10 min)

- [x] Valovi, score, HP, strel iz tedna 7 delujejo.

---

## Korak 1 — Seek (~40–50 min)

- [x] `updateEnemy(e, dt)`: vektor od središča sovražnika do središča igralca, deli z `Math.hypot`, premakni z `e.speed * dt`.
- [x] Vsak sovražnik v `PLAYING` kliče isto funkcijo. Tip ne menja smeri, samo številke.
- [x] Premik gre skozi `moveWithWalls` (isto kot igralec).
- [x] Test: stojiš pri miru — pridejo do tebe. Odmakneš se — sledijo.

Pathfindinga ni. Sovražnik se ob zidu ustavi. To zapiši v README kot znano omejitev.

---

## Korak 2 — Dva tipa (~40–50 min)

- [x] Objekt `KINDS` (ali podobno): `walker` in `runner` z različno **hitrostjo**, **HP**, **barvo**, **points**.
- [x] `spawnWave` od vala 2 doda oba. Val 1 je lahko samo walker.
- [x] V `js/render.js`: nad walkerjem (več HP) kratka palica `hp / maxHp`. Runner z 1 HP je nima.
- [x] GDD §6 tabela izpolnjena.

Test: vizualno ločiš tipa v 2 sekundah igranja.

---

## Korak 3 — Stabilizacija (~40–50 min)

Prehodi checklist **skupna baza**:

- [x] Premik + clamp / ovire
- [x] Loop + `dt` + `state`
- [x] Strel proti miški
- [x] HP, `hurtTimer`, GAME_OVER, R → `resetGame`
- [x] Score, valovi, HUD
- [x] Seek + 2 tipa
- [x] Ni očitnih crashov v konzoli (F12) pri 2–3 minutah igre *all good, no instability*

Popravi 1–2 kvardarja (npr. spawn v zidu, score se ne resetira). **Ne** začni particle-jev in menijev namesto stabilizacije.

---

## Korak 4 — README skupne baze (~20–30 min)

V svojem repoju:

- [ ] Kako zagnati
- [ ] Kontrole
- [ ] Kaj je “teden 8 baza” (2–5 stavkov)
- [ ] Znane omejitve (npr. ni pathfindinga)

---

## Korak 5 — AI (~25–35 min)

Prompt A: seek + dva tipa, **brez pathfindinga**.

- [ ] Spremeni številke enega tipa (npr. runner še hitrejši, 1 HP) in razloži meta (koga ubiješ prej).
- [ ] Commit: `teden 8: seek walker/runner — skupna baza`. *already tried changing the numbers bit I liked the original ones more*

---

## Korak 6 — Prehod v projekt (~15 min)

Preberi [`projekt/BRIEF.md`](../projekt/BRIEF.md).

Odgovori (oddaja tedna ali list):

1. Ali bom **nadgradil to bazo** ali začel **novo** Canvas igro?  
2. Ena stavčna ideja lastne igre (lahko osnutek).  
3. Česa iz tednov 1–8 **ne** bom vrgel stran (loop/input/trki/entitete)?

---

## Merila “opravil teden 8”

| Merilo | OK |
|--------|----|
| Sovražniki seekajo igralca z omejeno hitrostjo | |
| ≥2 tipa (hitrost/HP/barva) | |
| Checklist skupne baze (korak 3) | |
| README kako igrati | |
| AI + lastna sprememba stats + razlaga | |
| Zapisana odločitev: baza vs. nova igra za projekt | |
