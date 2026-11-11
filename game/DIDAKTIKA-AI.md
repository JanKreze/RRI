# P16 — Zombie survival (brskalniška igra)

Majhna igra v HTML Canvas + vanilla JS, brez knjižnic. Del predmeta Razvoj iger.

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
| Miška: leva tipka (držati) | Strel proti kazalcu (vsakih 0,2 s) |
| `F3` | Prikaži/skrij debug (igralec, miška, krogle) |

## Struktura projekta

```
game/
├── index.html      # stran + <canvas>
├── style.css       # izgled
├── README.md
├── lab05.md
└── js/
    ├── config.js   # konstante (hitrost, barve, ...)
    ├── input.js    # stanje tipkovnice (listenerji samo beležijo)
    ├── world.js    # world.state/walls/enemies/mouse/bullets + update(world, dt)
    ├── collision.js # aabbOverlap, hitsWall, moveWithWalls
    ├── enemies.js  # createEnemy (entiteta brez AI)
    ├── bullets.js  # createBullet, updateBullets (premik + izginotje)
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

- **Miška v koordinatah platna:** `world.mouse = { x, y, down }`; listenerji so v `input.js`. Pretvorba `mouseOnCanvas` upošteva CSS povečavo in obrobo platna (`clientWidth`, `clientLeft`). Roza kvadratek kaže položaj kazalca.
- **Strel:** držanje leve tipke ustvari kroglo `{ x, y, vx, vy, r }` v središču igralca; `vx, vy` je enotski vektor proti kazalcu (`Math.hypot`). Če je kazalec skoraj v središču igralca, krogle ni.
- **Cooldown:** `shotTimer` se zmanjšuje z `dt`; strel je možen, ko je `<= 0`, nato se nastavi na `SHOT_COOLDOWN` (0,2 s, torej 5 strelov na sekundo).
- **Premik in izginotje:** `updateBullets` premakne kroglo za `vx * BULLET_SPEED * dt` (700 px/s) in z `Array.filter` odstrani tiste, ki zapustijo platno ali zadanejo zid ali sovražnika.
- **Sovražnik** ob zadetku za 0,15 s zasveti oranžno (kill/score pride v tednu 7).

## Načrt (naslednji tedni)

- Teden 6: HP in GAME_OVER.
- Teden 8: seek (sovražnik sledi igralcu).