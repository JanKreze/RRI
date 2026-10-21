# Starter — teden 1

Minimalna igriva osnova za **P16 Razvoj računalniških iger**.

## Kaj že dela

- Temno platno (Canvas), centrirano na strani
- Modri pravokotnik = igralec
- Premikanje: **W A S D**
- Game loop z `requestAnimationFrame` in delta time
- Igralec ne gre čez rob platna

## Zagon

Iz mape `starter/`:

```bash
python3 -m http.server 8080
```

Odpri brskalnik: [http://localhost:8080](http://localhost:8080)

(Druge možnosti: VS Code Live Server, `npx serve .` …)

## Datoteke

| Datoteka | Namen |
|----------|--------|
| `index.html` | stran + canvas |
| `style.css` | centiranje, temno ozadje |
| `game.js` | logika igre |
| `assets/` | prazno v tednu 1; sprite/zvok v **projektni fazi** (glej `../projekt/`) |

Tedni 2–8 nadgrajujejo **tvojo kopijo** te mape, ne predmetni `starter/` na GitHubu. Pregled: [`../TEDENSKI-NACRT.md`](../TEDENSKI-NACRT.md), vaje: [`../lab02/`](../lab02/) … [`../lab08/`](../lab08/).

## Naloga tedna 1

1. Zaženi igro in preveri WASD.
2. Preberi komentarje v `game.js` (slovenščina).
3. Izpolni osnutek GDD: `../docs/GDD-predloga.md` (Zombie Survival ali Dungeon Escape).
4. (Opcijsko) spremeni barvo ali hitrost igralca — in v enem stavku razloži, *kaj* si spremenil.

## Priprava na teden 2

- Kje v kodi bi dodal sovražnika (`x, y, w, h`)?
- Uredi si Git: prvi commit “teden 1: starter teče”.

Več: `../TEDENSKI-NACRT.md`, `../DIDAKTIKA-AI.md`.
