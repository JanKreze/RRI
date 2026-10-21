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
```

## Teden 2 — kaj sem naredil

- **Normalizacija diagonale:** `dx`/`dy` delim z `Math.hypot(dx, dy)`, da je diagonalni premik enako hiter kot ravni (brez tega ~41 % hitrejši).
- **Puščice** poleg WASD (isti `dx`/`dy`).
- **Sprint** s Shiftom: začasna hitrost `speed * SPRINT_MULTIPLIER`, `player.speed` se ne spreminja.
- **Konstante** (`PLAYER_SPEED`, `SPRINT_MULTIPLIER`, ...) premaknjene v `js/config.js`.
- **Debug izpis** pozicije igralca (F3).
- **Reset tipk ob `blur`**, da igralec ne ostane "zataknjen" po menjavi okna.
- **Modularna struktura** v mapi `js/` (input / player / render / main).

## Načrt (naslednji tedni)

- Teden 3: stanja igre, delta time utrjevanje.
- Teden 4: entitete (sovražnik), trki z ovirami.