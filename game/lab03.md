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
| `F3` | Prikaži/skrij debug (pozicija igralca) |

## Struktura projekta

```
game/
├── index.html      # stran + <canvas>
├── style.css       # izgled
├── README.md
└── js/
    ├── config.js   # konstante (hitrost, barve, ...)
    ├── input.js    # stanje tipkovnice (listenerji samo beležijo)
    ├── player.js   # podatki o igralcu + updatePlayer(dt)
    ├── render.js   # risanje
    └── main.js     # vstopna točka + game loop
    └── world.js    # ustvarjanje sveta, stanje sveta world.state + update (world, dt)
```

## Teden 3 — kaj sem naredil

- **Premikanje:** Normalizacija igralčeve hitrosti (pravzaprav hitrost celega game sveta) glede na real time elapsed, max premik (`MAX_DT` v `config.js`) določen za primer tab out-a iz strani..
- **Uporabljam delta time; max dt = 0,05 s** `dt` je v sekundah; prvi frejm in vrnitev iz skritega zavihka sta zaščitena z `lastTime` in zgornjo mejo.
- **Stanja** v `config.js` (`STATES`: MENU, PAUSED, PLAYING, GAME_OVER); `world.state` v `world.js`. `update` ne premika igralca, če stanje ni PLAYING.
- **Pavza** s tipko `P`: svet je zamrznjen, a se še riše, z napisom PAUZA.

## Načrt (naslednji tedni)

- Teden 4: entitete (sovražnik), trki z ovirami.

