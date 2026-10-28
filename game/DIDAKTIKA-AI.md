# Teden 3 — AI prompti in refleksija


## Prompt A — delta time vs. fiksni korak

**Delta time:** vsak frame izmerim realni čas od prejšnjega frame-a (`dt`) in z njim pomnožim premik (`x += speed * dt`).

- *Prednost:* preprosto; hitrost v pikslih na sekundo je enaka pri 30, 60 ali 144 FPS.
- *Past:* `dt` niha in je lahko ogromen (zavihek v ozadju, lag), zato predmeti skočijo ali gredo skozi stene; fizika ni povsem deterministična.
- *Kdaj izbrati:* pri preprostih igrah brez natančne fizike in brez ponovitev (replay).

**Fiksni korak:** logika vedno napreduje v enakih rezinah (npr. 1/60 s). Preostali realni čas se zbira v akumulatorju, `update` pa se požene tolikokrat, kolikor rezin gre vanj.

- *Prednost:* deterministično in stabilno; trki in fizika se enako obnašajo na vsakem računalniku.
- *Past:* več kode, po dolgem premoru se lahko `update` požene večkrat naenkrat ("spiral of death"), če števila ne omejiš.
- *Kdaj izbrati:* pri natančni fiziki, trkih, ki ne smejo "tunelirati", ali pri ponovitvah.

**Minimalen vzorec z `lastTime` in clamp `dt`:**

```javascript
let lastTime = 0;

function loop(timestamp) {
  // Prvi frame: lastTime še ni nastavljen, da dt ni prevelik
  if (!lastTime) lastTime = timestamp;

  let dt = (timestamp - lastTime) / 1000; // ms -> sekunde
  lastTime = timestamp;

  // Zgornja meja: ob vrnitvi iz ozadja dt ne sme biti ogromen
  if (dt > 0.05) dt = 0.05;

  update(dt);
  draw();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
```

**AI-jevo vprašanje: kaj narediš z `dt`, ko je zavihek v ozadju?**
Brskalnik v ozadju ustavi `requestAnimationFrame`, zato ima prvi frame po vrnitvi ogromen razmik. `dt` je omejen (`MAX_DT = 0.05`); alternativa bi bila, da se ta frame preskoči.

**Primerjava z mojim loopom:** vzorec je enak, zato ničesar ne zamenjam. Uporabljam delta time.

---

## Prompt B — razlaga mojega loopa

```javascript
let lastTime = 0;                          // čas prejšnjega frame-a; 0 = še ni bil nastavljen
function loop(timestamp) {                 // rAF poda timestamp v ms
  if (!lastTime) lastTime = timestamp;     // 1. frame: dt bo 0, ne ogromen
  let dt = (timestamp - lastTime) / 1000;  // razlika v ms -> sekunde
  lastTime = timestamp;                    // zapomni si za naslednji frame
  if (dt > MAX_DT) dt = MAX_DT;            // zgornja meja 0.05 s
  update(world, dt);                       // logika sveta
  draw(ctx, world, world.W, world.H);      // risanje
  requestAnimationFrame(loop);             // zahteva naslednji frame
}
requestAnimationFrame(loop);               // zažene zanko
```

1. **V čem je `dt`:** v sekundah; realni čas od prejšnjega frame-a (pri 60 FPS približno 0,0167), omejen navzgor na `MAX_DT` = 0,05.
2. **Kdaj se kliče `update`:** enkrat na frame, po izračunu `dt` in pred `draw`. Znotraj `update` se svet premakne samo, če je `world.state === PLAYING`; `update` se kliče vedno.
3. **Zakaj je rAF na koncu:** naroči naslednji frame in tako vzdržuje zanko; zadnji klic zunaj funkcije zanko zažene.

**"Tega ni v tem izseku":** vrednost `MAX_DT`, vsebina `update` in `draw`, obdelava tipkovnice (zanka ne bere vhoda).

**Opažanja (zadetki in pasti):**
- Ker je `requestAnimationFrame` na koncu, izjema v `update` ali `draw` trajno ustavi zanko.
- `!lastTime` bi se sprožil tudi pri `timestamp === 0`, kar se v praksi ne zgodi.

---

## Prompt C — stanja (skica)

```javascript
// config.js — dovoljena stanja (ena spremenljivka: world.state)
export const STATES = Object.freeze({ MENU: "MENU", PAUSED: "PAUSED", PLAYING: "PLAYING", GAME_OVER: "GAME_OVER" });

// update: premik samo v PLAYING; v drugih stanjih svet miruje
if (world.state !== STATES.PLAYING) return;

// draw: svet se riše vedno (zamrznjen v PAUSED), napis le v PAUSED
if (state === STATES.PAUSED) drawPause(ctx, W, H);
```

Danes uporabljam `PLAYING` in `PAUSED` (tipka P). `MENU` in `GAME_OVER` obstajata samo kot imeni v `config.js`; logika pride v tednu 6 (takrat po potrebi `switch (world.state)`).

---

## Prompt D — "popravi moj dt"

Pri meni igralec ob vrnitvi na zavihek ne skoči, ker `if (dt > MAX_DT) dt = MAX_DT` že je najmanjši popravek; brez te vrstice bi bil `dt` po 10 s v ozadju približno 10 s. Za vajo: `MAX_DT` ročno nastavim na 1, opazujem skok in ga vrnem na 0,05.

---

## Refleksija

1. **Delta ali fiksni korak? Zakaj?**
   Uporabljam delta time, ker je igra preprosta, nima natančne fizike, hitrost v pikslih na sekundo pa je enaka na vsakem računalniku. Fiksni korak bi dodal nepotrebno kodo.

2. **Kaj je AI narobe rekel o mojem `loop`?**
   Ni posebej omenil napak, dal mi je rešitev in razlago, zakaj rešitev deluje. Napake v originalnem loop-u so bile neomenjena točka.

3. **Kaj se zgodi, če je `dt` 2 sekundi — pred in po popravku?**
   Pred popravkom: igralec se v enem frame-u premakne za 320 × 2 = 640 px (s sprintom 1024 px), torej čez skoraj celo platno; `clamp` ga ustavi na robu. Po popravku je `dt` omejen na 0,05 s, torej samo 16 px na frame.

4. **Česa `draw()` ne sme delati?**
   `draw()` ne sme spreminjati stanja sveta (premikati igralca, spreminjati `world.state`, brati tipk za logiko), ker je njegova naloga samo risanje; logika sodi v `update`.