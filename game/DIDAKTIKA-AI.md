# Teden 4 — AI prompti in refleksija


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
    ├── world.js    # world.state, world.walls, world.enemies + update(world, dt)
    ├── collision.js # aabbOverlap, hitsWall, moveWithWalls
    ├── enemies.js  # createEnemy (entiteta brez AI)
    ├── player.js   # podatki o igralcu + updatePlayer(dt)
    ├── render.js   # risanje
    └── main.js     # vstopna točka + game loop
```

## Teden 4 — ovire, AABB, entiteta sovražnika

- **`aabbOverlap(a, b)`** zazna prekrivanje dveh pravokotnikov (detect); **`moveWithWalls`** premakne po oseh ločeno in razveljavi os, ki zadene zid (resolve), zato igralec drsi ob zidu.
- **Ovire** so tabela `WALLS` v `config.js`; clamp na rob platna ostane posebej (meje sveta).
- **Sovražnik** je entiteta `{ x, y, w, h, color }` v `world.enemies` (brez AI, stoji na fiksni točki). Ob dotiku se igralec za frejm obarva rdeče (samo feedback; HP pride v tednu 6).


## Testni list (korak 4)
 
Testirano v brskalniku (igralec s sprintom in največjim `dt`, nato še ročno):
 
- [x] Skozi oviro **ne** grem (z leve, desne, zgoraj, spodaj).
- [x] Diagonala v vogal ovire ne uide "skozi špranjo" (vsi štirje vogali bloka pri `dt` = 0,05; igralec zdrsne mimo).
- [x] Sovražnik je viden vsak frejm (tudi v `PAUSED`).
- [x] `state !== PLAYING` → se ne premikam (v `PAUSED` igralec ne gre skozi zid, ker se sploh ne premika).
- [x] Sovražnik je trden: igralec ne more "čez" njega.
---
 

## Prompt A — overlap + resolve
 
**Detect (zaznava):** `aabbOverlap` ugotovi, ali se dva pravokotnika prekrivata. Prekrivanje je takrat, ko se prekrivata na obeh oseh hkrati.
 
```javascript
// Dva pravokotnika (levi zgornji kot) se prekrivata, ko se prekrivata na OBEH oseh
export function aabbOverlap(a, b) {
  return (
    a.x < b.x + b.w && // levi rob a je levo od desnega roba b
    a.x + a.w > b.x && // desni rob a je desno od levega roba b
    a.y < b.y + b.h && // zgornji rob a je nad spodnjim robom b
    a.y + a.h > b.y // spodnji rob a je pod zgornjim robom b
  );
}
```
 
**Resolve (reševanje):** `moveWithWalls` premakne entiteto po oseh ločeno in razveljavi tisto os, ki bi vodila v oviro.
 
```javascript
export function moveWithWalls(entity, dx, dy, walls) {
  // 1. os x: premakni, če zadene zid, vrni na prejšnji x
  const prevX = entity.x;
  entity.x += dx;
  if (hitsWall(entity, walls)) entity.x = prevX;
 
  // 2. os y: enako (x je že dokončen)
  const prevY = entity.y;
  entity.y += dy;
  if (hitsWall(entity, walls)) entity.y = prevY;
}
```
 
(`hitsWall` samo pregleda tabelo ovir in kliče `aabbOverlap`.)
 
**AI-jevo vprašanje: zakaj ločimo detect in resolve?**
Detect samo odgovori z da/ne, resolve pa odloči, kaj narediti. Isto zaznavo lahko uporabimo za različne odzive: pri zidu razveljavimo premik, pri sovražniku bo kasneje poškodba, pri predmetu pobiranje. Z ločitvijo je vsak del tudi lažje testirati.
 
**Moj test:** spremenil sem velikost in lego ovir v `WALLS` (`config.js`) in preveril vogale; igralec ne gre skozi in ob zidu drsi.
 
---
 
## Prompt B — preveri moj trk
 
AI-jeva ugotovitev za `aabbOverlap`:
 
- Pravilen je za konvencijo **levi zgornji kot** (`x, y` je zgornji levi rob, `w, h` velikost), kar je tudi moj dogovor.
- Ni napake za ena (off-by-one): ker so primerjave stroge (`<` in `>`), se pravokotnika, ki se samo dotikata po robu, **ne** štejeta za prekrivajoča. Tako igralec lahko stoji tik ob zidu.
- Pri center-based koordinatah bi bile primerjave drugačne; tukaj to ni relevantno.
Opažanje pri resolve: ker `moveWithWalls` razveljavi **cel korak**, igralec obstane do ene dolžine koraka od zidu (približno 5 px pri običajni hitrosti, približno 8 px s sprintom), ne točno ob robu. Za igro je to sprejemljivo; popravek bi bil poravnava (snap) na rob ovire.

Dogovor x, y je razumel.

---
 
## Prompt C — krogi (opcijsko)
 
```javascript
// Dva kroga se prekrivata, ko je razdalja med središčema manjša od vsote polmerov.
// Primerjamo kvadrate, da nam ni treba računati korena.
function circlesOverlap(a, b) {
  const dx = a.cx - b.cx;
  const dy = a.cy - b.cy;
  const r = a.r + b.r;
  return dx * dx + dy * dy < r * r;
}
```
 
- **Raje krog:** pri krogličnih predmetih (krogle, okrogli sovražniki), kjer ne želimo, da se vogali "zatikajo", in pri hitrih projektilih.
- **Raje AABB:** pri zidovih in p

## Refleksija
 
1. **Z lastnimi besedami: kaj je detect, kaj resolve?**
   Detect samo ugotovi, ali se dva predmeta prekrivata (da ali ne). Resolve pa odloči, kaj se zgodi zaradi tega: pri zidu premik razveljavim po tisti osi, ki je zadela. Ločena sta, ker isto zaznavo uporabim za več odzivov (zid, sovražnik, predmet). Resolve po oseh posebej omogoča tudi drsenje ob zidu.
2. **Ali moj igralec "lepi" na vogalu? Kaj sem poskusil?**
   Ne, ob vogalu zdrsne mimo, ker x in y razrešim ločeno: če je blokirana ena os, se druga še vedno premakne. Preizkusil sem vse štiri vogale bloka pri največjem `dt` in s sprintom. Opažam samo majhno režo (do enega koraka) med igralcem in zidom.
3. **Kje živi dummy sovražnik in zakaj nima `updateEnemy` še seek?**
   Sovražnik je ustvarjen v `js/enemies.js` (`createEnemy`) in shranjen v `world.enemies` v `js/world.js`; narisan je v `js/render.js`. Je enak oblikovni vzorec kot igralec (`x, y, w, h, color`), vendar stoji na fiksni točki. Seek (`updateEnemy`) pride šele v tednu 8; danes je cilj samo pripravljena entiteta, na katero bom lahko dodal HP, premikanje in valove.
4. **Ena stvar, ki jo je AI narobe predlagal.**
   Ni naredil napačnih predlogov, vendar pa je sovražnika ustvaril brez kolizije.