# Teden 5 — Strel proti miški

> Odgovori na prompte so pripravljeni z AI in preverjeni glede na mojo kodo (`js/bullets.js`, `js/world.js`, `js/input.js`).

---

## Prompt A — projektil (spawn + update)

**Odgovor na prompt** (pravokotna krogla, `x, y` = levi zgornji kot, zanka od konca):

```javascript
// Ustvari kroglo: smer od SREDIŠČA igralca proti miški, vx in vy sta enotski vektor
function shoot() {
  const cx = player.x + player.w / 2;
  const cy = player.y + player.h / 2;
  const dx = mouse.x - cx;
  const dy = mouse.y - cy;
  const dist = Math.hypot(dx, dy);
  if (dist < 1) return; // miška v središču: smer ni določena

  bullets.push({
    x: cx - BULLET_W / 2, // levi zgornji kot, da je kvadratek okoli središča
    y: cy - BULLET_H / 2,
    w: BULLET_W,
    h: BULLET_H,
    vx: dx / dist,
    vy: dy / dist,
  });
}

// Premik z dt; zanka OD KONCA, da splice ne preskoči naslednje krogle
function updateBullets(dt) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.x += b.vx * BULLET_SPEED * dt;
    b.y += b.vy * BULLET_SPEED * dt;
    if (b.x + b.w < 0 || b.x > W || b.y + b.h < 0 || b.y > H) {
      bullets.splice(i, 1); // zunaj platna
    }
  }
}
```

**AI-jevo vprašanje: zakaj delimo z `hypot`?**
Brez deljenja bi bil vektor `(dx, dy)` dolg toliko, kot je kazalec oddaljen, zato bi krogle, namerjene na oddaljeno miško, letele hitreje kot tiste na bližnjo. Z deljenjem z dolžino (`Math.hypot(dx, dy)`) dobimo enotski vektor (dolžina 1), tako da hitrost določa samo `BULLET_SPEED`.

**Kaj sem prilagodil v svoji kodi (in zakaj):**

- Moja krogla je **krog** `{ x, y, vx, vy, r }`, kjer sta `x, y` **središče** kroga (ne levi zgornji kot). Narisana je z `arc`, trk pa je `circleRectOverlap`.
- Namesto zanke od konca uporabljam **`Array.filter`**: vrne nov seznam brez odstranjenih krogel, zato med iteracijo ni spreminjanja polja in ni nevarnosti preskoka.
- Poleg roba platna krogla izgine tudi ob zidu in sovražniku (sovražnik za 0,15 s zasveti).

```javascript
// Moja različica (js/bullets.js)
export function updateBullets(bullets, dt, W, H, walls, enemies) {
  return bullets.filter((b) => {
    b.x += b.vx * BULLET_SPEED * dt;
    b.y += b.vy * BULLET_SPEED * dt;
    if (isOutside(b, W, H)) return false;
    if (walls.some((wall) => circleRectOverlap(b, wall))) return false;
    const hit = enemies.find((e) => circleRectOverlap(b, e));
    if (hit) { hit.flash = ENEMY_HIT_FLASH; return false; }
    return true;
  });
}
```

**Lastna sprememba parametra:**

| Parameter | Privzeto | Preizkus | Občutek |
|-----------|----------|----------|---------|
| `BULLET_SPEED` | 700 px/s (platno prečka v ~1,1 s) | npr. 300 / 1400 | zdi se mi pravilne hitrosti |
| `SHOT_COOLDOWN` | 0,2 s (5 strelov/s) | npr. 0,05 / 0,5 | 5-6 izstrelkov naenkrat je dovolj |
| `BULLET_RADIUS` | 5 px | npr. 3 / 10 | izstrelki zgledajo dovolj veliki, vendar ne gigantski |

---

## Prompt B — koordinate

`clientX` je položaj miške glede na **okno brskalnika**, `mouse.x` pa mora biti položaj glede na **platno** v njegovih lastnih pikslih (0 do `canvas.width`). Razlikujeta se iz dveh razlogov:

1. Platno ni v kotu okna: `getBoundingClientRect()` vrne njegov položaj (`left`, `top`) in prikazano velikost, zato `clientX - rect.left` da položaj znotraj platna.
2. Platno je lahko v CSS-u prikazano v drugi velikosti, kot je `width` v HTML-ju (npr. 800 px platno, prikazano kot 1000 px). Zato je treba pomnožiti z razmerjem `canvas.width / rect.width`.

Kratek primer (iz navodil):

```javascript
const rect = canvas.getBoundingClientRect();
const x = (e.clientX - rect.left) * (canvas.width / rect.width);
const y = (e.clientY - rect.top) * (canvas.height / rect.height);
```

**Primerjava z mojo pretvorbo (`mouseOnCanvas` v `input.js`):** enaka zamisel, vendar uporabljam `canvas.clientWidth`, `clientLeft` in `clientTop` namesto `rect.width` in `rect.left`. Moje platno ima 2 px CSS obrobo (`border`), ki je v `rect` všteta, v `clientWidth` pa ne; s tem je pretvorba natančna na piksel.

```javascript
const scaleX = canvas.width / canvas.clientWidth;
x: (e.clientX - rect.left - canvas.clientLeft) * scaleX
```

AI ni pozabil ničesar, sledil je zahtevam.

---

## Prompt C — cooldown

```javascript
// world.js (update): časovnik teče z dt; strelja samo, ko je <= 0 in je miška pritisnjena
world.shotTimer = Math.max(0, world.shotTimer - dt);
if (world.mouse.down && world.shotTimer <= 0) {
  const bullet = createBullet(world.player, world.mouse);
  if (bullet) {
    world.bullets.push(bullet);
    world.shotTimer = SHOT_COOLDOWN; // 0,2 s
  }
}
```

- Konstanta se pri meni imenuje `SHOT_COOLDOWN` (v navodilih `BULLET_COOLDOWN`) in je 0,2 s namesto 0,25 s.
- Časovnik se ponastavi samo, če krogla res nastane (miška v središču igralca ne porabi cooldowna).
- V GDD zapišem isto vrednost: **0,2 s (5 strelov na sekundo)**.

---

## Refleksija

1. **Kako izračunaš smer?**
   Od središča igralca do miške: `dx = mouse.x - cx`, `dy = mouse.y - cy`. Dolžina je `dist = Math.hypot(dx, dy)`, smer pa je enotski vektor `vx = dx / dist`, `vy = dy / dist`. Pri premiku ga pomnožim z `BULLET_SPEED * dt`.

2. **Kaj se zgodi, če ne pretvorim `clientX`?**
   Kazalec in krogle se ne ujemajo: napaka je enaka odmiku platna od roba okna plus povečavi. V mojem testnem primeru (platno pri 60 px, prikazano 996 px široko namesto 800) bi miška na koordinati platna 600 dala `clientX` ≈ 809, torej skoraj 210 px stran. AI ni pozabil CSS scale.

3. **Kakšen cooldown sem izbral in zakaj?**
   0,2 s, torej 5 strelov na sekundo. To prepreči "mitraljez" (tisoč strelov na sekundo, vsak frejm nova krogla), a še vedno deluje odzivno. Pri hitrosti 700 px/s je hkrati na platnu običajno do 5 ali 6 krogel.

4. **Kje je AI predlagal cel `game.js` ali Phaser in sem zavrnil?**
   Pri meni je AI v prompt A predlagal pravokotno kroglo in array filter, jaz pa sem uporabil krog, array filter sem pustil.

---

## Merila "opravil teden 5"

| Merilo | OK |
|--------|----|
| Miška v koordinatah canvasa (kvadratek se ujema s kazalcem) | ✓ |
| Strel v smeri miške | ✓ |
| Projektili se premikajo z `dt` in izginejo ob robu | ✓ |
| Ni "mitraljeza" 1000/s *ali* zavesten cooldown (0,2 s) | ✓ |
| AI kos + lastna sprememba parametra | ✓ |

---

## Korak 6 — Zapri

- [ ] Commit: `teden 5: strel proti miški + cooldown`
- [ ] GDD: vrstica streljanja (vhod / pravilo / feedback).

Predlog vrstice za GDD:

> **Streljanje:** *Vhod:* leva tipka miške (držanje), cilj je kazalec. *Pravilo:* en strel vsakih 0,2 s (5 na sekundo); krogla leti 700 px/s v ravni črti od središča igralca proti kazalcu in izgine ob robu platna, zidu ali sovražniku; med pavzo ni streljanja. *Feedback:* rumena/oranžna krogla; sovražnik ob zadetku za 0,15 s zasveti oranžno; jekleno-siv kvadratek kaže kazalec.

---

## Priprava na teden 6

**Kaj se zgodi, če te dummy sovražnik "dotakne" vsak frejm, koliko HP na sekundo?**
Če bi se HP odštel ob vsakem frejmu, bi bila škoda odvisna od frekvence osveževanja: pri 60 FPS in 1 HP na frejm bi izgubil 60 HP na sekundo, pri 144 FPS pa 144. Igralec s 100 HP bi umrl v manj kot dveh sekundah. Škodo je zato treba izraziti **na sekundo** (množenje z `dt`, npr. 10 HP/s) ali kot **fiksno škodo na zadetek z začasno nedotakljivostjo** (npr. 10 HP, nato 0,5 s brez škode). Tako je tempo enak ne glede na FPS.