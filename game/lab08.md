# Teden 8 — AI prompti in refleksija

## Prompt A — seek + 2 tipa (obvezno)

**Odgovor na prompt** (brez pathfindinga, brez A*, brez knjižnic):

```javascript
// Dva tipa v istem seznamu enemies[]: razlikujeta se po številkah in barvi
const enemies = [
  { kind: "walker", x: 40,  y: 40,  w: 32, h: 32, speed: 60,  hp: 20, color: "#a3e635" }, // počasnejši, več HP
  { kind: "runner", x: 700, y: 380, w: 24, h: 24, speed: 150, hp: 10, color: "#c084fc" }, // hitrejši, manj HP
];

// Seek: konstantna hitrost proti igralcu, hypot, premik omejen na speed * dt
function updateEnemy(e, dt) {
  // Vektor od središča sovražnika do središča igralca
  const dx = player.x + player.w / 2 - (e.x + e.w / 2);
  const dy = player.y + player.h / 2 - (e.y + e.h / 2);
  const len = Math.hypot(dx, dy);

  if (len === 0) return; // na istem mestu: brez deljenja z 0

  // Enotski vektor * hitrost * dt (ne preskoči cilja)
  const step = Math.min(e.speed * dt, len);
  e.x += (dx / len) * step;
  e.y += (dy / len) * step;
}
```

**AI-jevo vprašanje: kaj naredim, ko je `len == 0`?**
Takrat sovražnik stoji natanko v središču igralca in smer ni določena. Deljenje z 0 bi dalo `NaN`, `x` in `y` sovražnika bi postala `NaN` in sovražnik bi izginil. Zato funkcija v tem primeru takoj vrne (se ne premakne). V moji kodi je pogoj `dist < 1`, ker se središči zaradi trdnih objektov skoraj nikoli ne ujemata.

**Kaj sem prilagodil v svoji kodi (in zakaj):**

- **Tipi v `KINDS` (`config.js`)**, `createEnemy(x, y, kind)` iz njega prebere hitrost, HP, velikost, barvo in točke. Vsi sovražniki so v `world.enemies` in vsi kličejo isti `updateEnemy`.
- **Premik skozi `moveWithWalls`** namesto `e.x += ...`: sovražnik ne gre skozi zidove in ob njih po oseh drsi.
- **Trdni objekti za sovražnika** so zidovi, igralec in drugi sovražniki. Brez igralca bi se sovražnik lahko prekrival z njim in ga zaklenil; brez drugih bi se sovražniki zlili v eno kopico.
- **Brez `Math.min(step, len)`:** igralec je trden, zato sovražnik ob njem tako ali tako obstane in cilja ne more preskočiti.

**Moja sprememba številk:** poskusil sem spremeniti številke runnerja in walkerja, da bi bil prednji hitrejši ter da bi walker imel več življenskih točk, a so mi bile originalne vrednosti boljše, zato sem jih obdržal. Spreemembe so preveč otežile igro, raje bi imel igro, ki ni stresna za igrat.

**Zavrnjeno:** Ai ni predlagal ne NavMesha ne raznih knjižnic niti ideje igro premakniti v game engine kot Unity, zavrnjene so bile neke spremembe v GDD-ju.

---

## Prompt B — razloži moj seek

```javascript
export function updateEnemy(e, dt, world) {
  const { player } = world;                                      // (1)

  const dx = player.x + player.w / 2 - (e.x + e.w / 2);          // (2)
  const dy = player.y + player.h / 2 - (e.y + e.h / 2);
  const dist = Math.hypot(dx, dy);                               // (3)
  if (dist < 1) return;                                          // (4)

  const step = e.speed * dt;                                     // (5)
  const solids = [                                               // (6)
    ...world.walls,
    player,
    ...world.enemies.filter((o) => o !== e),
  ];
  moveWithWalls(e, (dx / dist) * step, (dy / dist) * step, solids); // (7)
}
```

1. Vzame igralca iz sveta.
2. `dx`, `dy` je vektor od **središča** sovražnika do **središča** igralca (`x + w / 2`), zato velikost objektov ne vpliva na smer.
3. `dist` je dolžina tega vektorja (Pitagora).
4. Če sta središči skoraj skupaj, smer ni določena in funkcija vrne (prepreči deljenje z 0).
5. `step` je pot, ki jo sovražnik prepotuje v tem frejmu: hitrost v px/s krat `dt`.
6. Seznam trdnih objektov: zidovi, igralec in vsi **drugi** sovražniki (sam sebe izločimo s `filter`).
7. `(dx / dist, dy / dist)` je enotski vektor (dolžina 1), pomnožen s `step`. `moveWithWalls` premakne po oseh ločeno in razveljavi os, ki bi zadela trdni objekt.

**"Tega ni v tem izseku":** iskanje poti okoli zidov (ga ni, sovražnik se ob zidu samo ustavi ali po oseh drsi), HP, spawn, škoda igralcu, različnost tipov (to je v `KINDS`).

**Halucinacije:** Ni bilo pravih halucinacij, edina stvar ki je bila relevantna so bile nekatere barvne odločitve, ter statistike igralca in sovražnikov.

---

## Prompt C — prehod v lastno igro (ideje)

Osem idej za lastno igro, doable v preostanku semestra (težavnost 1–5), vse na isti tehnični bazi (loop, input, AABB, entitete, valovi):

| # | Ideja | Kratek opis | Težavnost |
|---|-------|-------------|-----------|
| 1 | **Dungeon escape** | sobe, ključi, izhod, sovražniki s sledenjem; cilj je pobegniti | 3 |
| 2 | **Roguelite arena** | po vsakem valu izbereš eno izmed treh nadgradenj (hitrost, škoda, HP) | 3 |
| 3 | **Tower defense lite** | postavljaš stolpe ob poti, sovražniki hodijo po fiksni poti | 3 |
| 4 | **Stealth** | stražarji z vidnim stožcem, zbiraš predmete in se izogibaš zaznavi | 4 |
| 5 | **Space shooter z vztrajnostjo** | Asteroids-stil, ladja z vztrajnostjo, zaslon se ovije | 2 |
| 6 | **Boss rush** | zaporedje bossov z vzorci strelov (bullet hell) | 4 |
| 7 | **Sokoban + akcija** | potiskaš bloke, da odpreš pot, medtem ko te lovijo sovražniki | 3 |
| 8 | **Snake-survival** | kača, ki raste z zbiranjem, na polju so ovire in lovci | 2 |

**Izbrana smer:** Rougelite Arena, podobno igri, narejeni v zadnjih tednjih, boljše razumevanje realne izvedbe, še vseeno srednje zahtevno, tista ideja, ki bi jo najraje igral.

---

## Refleksija

1. **Formula seeka z lastnimi besedami**
   Vektor od središča sovražnika do središča igralca: `dx = cx_igralca − cx_sovražnika`, `dy = cy_igralca − cy_sovražnika`. Dolžina je `dist = Math.hypot(dx, dy)`. Delim z dolžino (enotski vektor) in pomnožim z `speed * dt`: sovražnik se v vsakem frejmu premakne za `speed * dt` pikslov naravnost proti igralcu, ne glede na razdaljo.

2. **Razlika walker vs. runner (številke)**

   | | walker | runner |
   |---|---|---|
   | hitrost | 60 px/s | 150 px/s (2,5×) |
   | HP | 20 (2 zadetka) | 10 (1 zadetek) |
   | velikost | 32 px | 24 px |
   | točke | 50 | 30 |
   | čas do igralca (~460 px) | ~6,9 s | ~2,8 s |

   Runner te doseže prej in ga ubiješ z enim strelom; walkerja lahko igralec (320 px/s) pusti za seboj in ga ubije kasneje.

3. **Kaj v bazi še šepa in ne bom silil v polish tednov**
   Brez pathfindinga (sovražniki se ustavijo ob zidu), brez menija, samo eno orožje, brez power-upov in ranged sovražnikov, brez zvoka in spritov. Pathfinding in meni vzamem v projekt, če ju izbrana igra potrebuje; dodatna orožja in power-upe pustim ali prenesem v projekt kot del izbrane igre.

4. **Baza ali nova igra — odločitev in zakaj**
   Nova igra, 

---

## Korak 3 — stabilizacija

- [x] Premik + clamp / ovire
- [x] Loop + `dt` + `state`
- [x] Strel proti miški
- [x] HP, `hurtTimer`, GAME_OVER, R → `resetGame`
- [x] Score, valovi, HUD
- [x] Seek + 2 tipa
- [x] Brez očitnih crashov v konzoli pri 2–3 minutah igre

## Korak 4 in 5

- [x] README skupne baze (kako zagnati, kontrole, kaj je baza, znane omejitve)
- [x] Commit: `teden 8: seek walker/runner — skupna baza`