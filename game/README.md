# P16 — Zombie survival (brskalniška igra)

Majhna igra v HTML Canvas + vanilla JS, brez knjižnic. Del predmeta Razvoj iger.

## Kaj je "teden 8 baza"

Top-down survival: igralec se premika (WASD ali puščice), strelja proti miški in preživi čim več valov sovražnikov. Sovražniki se pojavijo na robu arene in teče(jo) proti igralcu (seek): počasni **walkerji** (20 HP, 2 zadetka) in hitri **runnerji** (10 HP, 1 zadetek, od vala 2). Stik odvzame HP (z nedotakljivostjo), HP 0 pomeni GAME OVER, `R` začne novo igro. Nov val se začne, ko je arena prazna; vsak val ima enega sovražnika več. HUD kaže HP, val in točke.

## Kako zagnati

Igra uporablja ES module, zato jo odpri prek lokalnega strežnika (ne z dvoklikom na `index.html`):

```powershell
cd game
py -m http.server 8080
```

Nato odpri <http://localhost:8080>.

> Če se po spremembi kode nič ne spremeni, je v predpomnilniku stara različica.
> Odpri DevTools (F12) → Network → obkljukaj **Disable cache** in osveži s **Ctrl+Shift+R**.

## Kontrole

| Tipka | Akcija |
|-------|--------|
| `W` `A` `S` `D` ali puščice | Premik |
| `Shift` (držati) | Sprint (1,6× hitrost) |
| `P` | Pavza (PLAYING ↔ PAUSED) |
| Miška: leva tipka (držati) | Strel proti kazalcu (vsakih 0,3 s) |
| `R` | Nova igra (po GAME OVER) |
| `F3` | Prikaži/skrij debug (igralec, miška, krogle, HP) |

## Struktura projekta

```
game/
├── index.html      # stran + <canvas>
├── style.css       # izgled
├── README.md
├── GDD.md
├── lab03.md … lab08.md   # prompti in refleksije po tednih
└── js/
    ├── config.js   # konstante (hitrost, barve, ...)
    ├── input.js    # stanje tipkovnice (listenerji samo beležijo)
    ├── world.js    # world.state/walls/enemies/mouse/bullets + update(world, dt)
    ├── collision.js # aabbOverlap, hitsWall, moveWithWalls
    ├── enemies.js  # KINDS (walker/runner), updateEnemy (seek), spawnWave, škoda ob stiku
    ├── bullets.js  # createBullet, updateBullets (premik, izginotje, zadetki, točke)
    ├── popups.js   # lebdeče številke škode ("-10")
    ├── player.js   # podatki o igralcu + updatePlayer(dt)
    ├── render.js   # risanje
    └── main.js     # vstopna točka + game loop
```

## Teden 2 — kaj sem naredil

- **Normalizacija diagonale:** `dx`/`dy` delim z `Math.hypot(dx, dy)`, da je diagonalni premik enako hiter kot ravni (brez tega ~41 % hitrejši).
- **Puščice** poleg WASD (isti `dx`/`dy`).
- **Sprint** s Shiftom: začasna hitrost `speed * SPRINT_MULTIPLIER`, `player.speed` se ne spreminja.
- **Konstante** (`PLAYER_SPEED`, `SPRINT_MULTIPLIER`, ...) premaknjene v `js/config.js`.
- **Debug izpis** pozicije igralca (F3).
- **Reset tipk ob `blur`**, da igralec ne ostane "zataknjen" po menjavi okna.
- **Modularna struktura** v mapi `js/` (input / player / render / main).

## Teden 3 — loop, delta, stanje

- **Uporabljam delta time; max dt = 0,05 s** (`MAX_DT` v `config.js`). `dt` je v sekundah; prvi frejm in vrnitev iz skritega zavihka sta zaščitena z `lastTime` in zgornjo mejo.
- **Stanja** v `config.js` (`STATES`: MENU, PAUSED, PLAYING, GAME_OVER); `world.state` v `world.js`. `update` ne premika igralca, če stanje ni PLAYING.
- **Pavza** s tipko `P`: svet je zamrznjen, a se še riše, z napisom PAUZA.

## Teden 4 — ovire, AABB, sovražnik

- **`aabbOverlap(a, b)`** zazna prekrivanje dveh pravokotnikov (detect); **`moveWithWalls`** premakne po oseh ločeno in razveljavi os, ki zadene zid (resolve), zato igralec drsi ob zidu.
- **Ovire** so tabela `WALLS` v `config.js`; clamp na rob platna ostane posebej (meje sveta).
- **Sovražnik** je entiteta `{ x, y, w, h, color }` v `world.enemies` (brez AI, stoji na fiksni točki). Je trden (igralec ne more čez); ko je igralec tik ob njem, se obarva rdeče (samo feedback; HP pride v tednu 6).

## Teden 5 — strel proti miški

- **Miška v koordinatah platna:** `world.mouse = { x, y, down }`; listenerji so v `input.js`. Pretvorba `mouseOnCanvas` upošteva CSS povečavo in obrobo platna (`clientWidth`, `clientLeft`). Testni roza kvadratek na kazalcu je izklopljen (`SHOW_MOUSE_MARKER` v `config.js`).
- **Strel:** držanje leve tipke ustvari kroglo `{ x, y, vx, vy, r }` v središču igralca; `vx, vy` je enotski vektor proti kazalcu (`Math.hypot`). Če je kazalec skoraj v središču igralca, krogle ni.
- **Cooldown:** `shotTimer` se zmanjšuje z `dt`; strel je možen, ko je `<= 0`, nato se nastavi na `SHOT_COOLDOWN` (0,2 s, torej 5 strelov na sekundo).
- **Premik in izginotje:** `updateBullets` premakne kroglo za `vx * BULLET_SPEED * dt` (700 px/s) in z `Array.filter` odstrani tiste, ki zapustijo platno ali zadanejo zid ali sovražnika.
- **Sovražnik** ob zadetku za 0,15 s zasveti oranžno (kill/score pride v tednu 7).

## Teden 6 — HP, škoda, game over

- **HP:** igralec ima `hp`, `maxHp` (30) in `hurtTimer`; palica zdravja zgoraj desno (`drawHpBar` v `render.js`) se krajša sorazmerno z `hp / maxHp`.
- **Škoda:** stik s sovražnikom odvzame `CONTACT_DAMAGE` (10) HP (`hurtPlayerOnContact` v `enemies.js`). Nato je igralec `HURT_COOLDOWN` (1 s) nedotakljiv in rdeč, zato škoda ni vsak frejm. Ob stiku ~2 s igralec umre.
- **Game over:** ko `hp <= 0`, `world.state = GAME_OVER`; update sveta se ustavi, na platnu je napis GAME OVER. Tipka `R` kliče `resetGame` (nov igralec in sovražnik, prazne krogle, `state = PLAYING`).
- **Pavza** in `GAME_OVER` ne povzročata škode (update se ne izvaja).

## Teden 7 — točke, valovi, HUD

- **Sovražnik ima HP**; krogla odvzame `BULLET_DAMAGE` (10). Ob `hp <= 0` sovražnik izgine in `world.score` zraste za njegove točke. Ob zadetku se nad njim pokaže `-10` (`popups.js`).
- **Valovi:** `spawnWave(world, n)` postavi sovražnike na rob (ne v zid, ne blizu igralca). Ko je `world.enemies.length === 0`, se začne val `wave + 1`. Val n ima `WAVE_START_ENEMIES + WAVE_ENEMY_STEP * (n - 1)` sovražnikov (2, 3, 4, …).
- **HUD:** palica HP s številom, val in točke na temni plošči; majhna palica nad sovražnikom z več HP; na GAME OVER so vidne končne točke. `resetGame` ponastavi `score`, `wave` in sovražnike.

## Teden 8 — seek in dva tipa

- **`KINDS` v `config.js`:** `walker` (hitrost 60, 20 HP, 50 točk) in `runner` (hitrost 150, 10 HP, 30 točk, manjši in vijoličen). Val 1 so sami walkerji; od vala 2 je približno tretjina runnerjev.
- **Seek:** `updateEnemy` v `enemies.js` vzame enotski vektor od središča sovražnika do središča igralca in ga pomnoži s `speed * dt`. Isti za oba tipa; tip menja samo številke.
- **Trki:** premik gre skozi `moveWithWalls`. Trdni so zidovi, igralec in drugi sovražniki, zato se ne prekrivajo.
- **Palica HP** nad sovražnikom je samo pri tistih, ki zdržijo več kot en zadetek (walker).

## Znane omejitve

- **Brez pathfindinga:** sovražniki (seek) se premikajo naravnost proti igralcu. Če je med njima zid, se sovražnik ob njem ustavi (po oseh še drsi) in čaka, da se igralec premakne.
- **Ni menija:** stanje `MENU` obstaja samo kot ime; igra se začne takoj.
- **En sam tip orožja** in brez zvokov ter spritov (pravokotniki).

## Naslednje

Projektna faza: lastna igra (glej `projekt/BRIEF.md`).