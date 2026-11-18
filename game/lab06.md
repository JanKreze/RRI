# Teden 6 — HP, škoda, game over

## Prompt A — HP in state

**Odgovor na prompt:**

```javascript
// Vsak update: nedotakljivost se izteka, nato preverimo stik s sovražnikom
function updateHealth(dt) {
  player.hurtTimer = Math.max(0, player.hurtTimer - dt);

  // Škoda samo, če se dotikata IN igralec ni več nedotakljiv
  if (aabbOverlap(player, enemy) && player.hurtTimer <= 0) {
    player.hp = Math.max(0, player.hp - CONTACT_DAMAGE); // HP ne gre pod 0
    player.hurtTimer = HURT_COOLDOWN; // naslednja škoda šele čez cooldown

    if (player.hp <= 0) state = "GAME_OVER";
  }
}

// Nova igra brez osveževanja strani
function resetGame() {
  player.hp = player.maxHp;
  player.x = START_X;
  player.y = START_Y;
  player.hurtTimer = 0;
  bullets.length = 0; // brez "duhov" iz prejšnje igre
  state = "PLAYING";
}
```

**AI-jevo vprašanje: zakaj `hurtTimer` obstaja?**
Brez njega bi `update` ob vsakem frejmu, ko se igralec dotika sovražnika, spet odštel HP. Škoda bi bila odvisna od frekvence osveževanja (pri 60 FPS desetkrat na sekundo več kot pri 6 FPS) in igralec bi umrl v nekaj frejmih. `hurtTimer` je kratka nedotakljivost: po zadetku igralec nekaj časa ne more biti poškodovan, zato je škoda na sekundo predvidljiva.

**Kaj sem prilagodil v svoji kodi (in zakaj):**

- **Stik namesto prekrivanja:** sovražnik je trden (igralec ne more skozenj), zato `aabbOverlap(player, enemy)` nikoli ne bi bil `true`. V `enemies.js` zato preverjam stik z majhno rezervo (`CONTACT_MARGIN`, 8 px) okoli sovražnika.
- **Mesto kode:** `hurtTimer` odštevam v `updatePlayer` (`player.js`), škodo daje `hurtPlayerOnContact` (`enemies.js`), prehod v `GAME_OVER` pa je v `update` (`world.js`), ki se od takrat ustavi (`state !== PLAYING`).
- **`resetGame`** ustvari novega igralca in sovražnika (`createPlayer`, `createEnemy`) namesto da ponastavlja polje za poljem; novo polje se tako ponastavi samo od sebe.

**Lastna sprememba številk:**

| Parameter | Prej | Zdaj | Občutek |
|-----------|------|------|---------|
| `PLAYER_MAX_HP` | 50 | 30 | Pri 50 HP je trajalo ~4 s, da je igralec umrl ob stiku, kar je bilo predolgo. Pri 30 HP je to ~2 s. |
| `CONTACT_DAMAGE` | 1 | 10 | Tri zadetke je jasno videti na palici HP. |
| `HURT_COOLDOWN` | 1,0 s | 1,0 s | Dovolj dolg, da se igralec umakne (pri 320 px/s v sekundi preteče 320 px), dovolj kratek, da stanje ob sovražniku kaznuje. |

---

## Prompt B — feedback

Tri preproste ideje (Canvas 2D, brez slik, brez particlov in brez utripanja):

1. **Drugačna barva igralca:** `fillStyle` je rdeč, dokler je `hurtTimer > 0`, sicer običajna zelena. Brez dodatnega stanja.
2. **Besedilo HP:** ob zadetku izpiši `-10` ali `HP 20/30` ob palici.
3. **Krajši kvadratek:** med nedotakljivostjo narišemo igralca manjšega.

**Implementiral sem 1. idejo** (barva), ki jo dopolnjuje palica zdravja iz koraka 1:

```javascript
// render.js: rdeč, dokler je nedotakljiv po zadetku (hurtTimer > 0)
ctx.fillStyle = player.hurtTimer > 0 ? PLAYER_HIT_COLOR : player.color;
```

**Prilagoditev:** rdeča barva traja natanko `HURT_COOLDOWN`, zato pokaže tudi nedotakljivost (dokler je rdeč, ga ne more zadeti). Idejo 3 sem zavrnil: manjši kvadratek bi pokazal drugačno velikost, kot jo ima trk (hitbox), kar bi zavajalo igralca.

---

## Prompt C — preveri moj reset

```javascript
// world.js
export function resetGame(world) {
  world.player = createPlayer(world.W, world.H);
  world.enemies = [createEnemy(ENEMY_START.x, ENEMY_START.y)];
  world.bullets = [];
  world.shotTimer = 0;
  world.state = STATES.PLAYING;
}
```

**Pregled (kaj bi lahko pozabil sprazniti):**

- **Krogle:** `bullets = []`, zato ni "duhov" iz prejšnje igre.
- **`shotTimer`:** ponastavljen na 0, da lahko igralec takoj strelja.
- **HP in `hurtTimer`:** `createPlayer` ju ponastavi (`hp = maxHp`, `hurtTimer = 0`), zato ni negativnega ali ostanka nedotakljivosti. HP se pri škodi omeji na 0 z `Math.max`, zato ne more biti negativen (preizkus: 2000 frejmov ob sovražniku, najnižji HP je bil 0).
- **Sovražnik:** ustvarjen na novo, zato je njegov `flash` spet 0 (in položaj je začetni).
- **Namerno ne ponastavljeno:** položaj in pritisk miške (`mouse`), `debug` (F3), ovire (`walls`, so konstantne) in trenutno držane tipke.

Opazka: če igralec ob pritisku na R še drži levo tipko miške, `mouse.down` ostane `true` in strelja takoj po začetku nove igre. To je sprejemljivo.

---

## Refleksija

1. **Koliko HP in kakšen `HURT_COOLDOWN` — zakaj te številke?**
   30 HP, škoda 10 in `HURT_COOLDOWN` 1,0 s: igralec zdrži tri zadetke, torej ~2 s stika (preizkus: HP 20 pri 0,02 s, 10 pri 1,02 s, 0 pri 2,03 s). 50 HP je bilo predolgo, 1 s nedotakljivosti pa omogoča, da se igralec umakne, a ga stoja ob sovražniku hitro kaznuje.

2. **Kaj bi se zgodilo brez `hurtTimer`?**
   Škoda bi se odštela vsak frejm: pri 10 škode in 30 HP bi igralec umrl v 3 frejmih (~48 ms pri 60 FPS), hitrost smrti pa bi bila odvisna od FPS. Preizkusil sem tako, da sem `hurtTimer` pred vsakim frejmom nastavil na 0: `GAME_OVER` po 3 frejmih.

3. **Kaj `resetGame` ponastavi in kaj sem zavestno pustil?**
   Ponastavi igralca (HP, položaj, `hurtTimer`), sovražnika, krogle, `shotTimer` in `state = PLAYING`. Zavestno pusti miško, `debug` in ovire, ker niso del stanja ene igre.

4. **AI napaka ali odvečen feature, ki sem ga zavrnil.**
   Ni naredil napak, vendar če bi moral kaj omeniti je uporabljal player PLAYER_MAX_HP = 5 in CONTACT_DAMAGE = 1, kar ni posebej razširljivo (sovražniki ki delajo več/manj škode na kontakt), plus ta rešitev ima preveč dolg time to kill, jaz sem spremenil na 30/10.

---

## Korak 5 in 6

- [x] Sprememba številk z opisom občutka (HP 50 → 30).
- [x] Commit: `teden 6: HP, hurtTimer, GAME_OVER + R`
- [x] GDD: začetni HP in §7 lose condition.

Predlog za GDD:

> **Začetni HP:** 30.
> **§7 Lose condition:** igralec izgubi, ko mu HP pade na 0. Vsak stik s sovražnikom odvzame 10 HP, nato je igralec 1 s nedotakljiv. Ob porazu se prikaže GAME OVER, s tipko R se igra začne znova.

### Priprava na teden 7

**Kaj štejem za "val": čas, število ubitih, ali spawn, ko je arena prazna?**
Predlog: **nov val se začne, ko je arena prazna** (ko ni več sovražnikov), vsak val pa ima več sovražnikov kot prejšnji. Razlogi: pravilo je preprosto (`enemies.length === 0`), igralec sam določa tempo, in ne pride do kopičenja sovražnikov, kot bi se lahko zgodilo pri valovih na čas. Zahteva, da lahko sovražnike ubijemo (teden 7: sovražnik dobi HP, krogle mu ga odvzamejo).

---

## Merila "opravil teden 6"

| Merilo | OK |
|--------|----|
| Palica HP se med igro vidi in krajša ob zadetku | ✓ |
| Stik zmanjša HP; `hurtTimer` prepreči škodo vsak frejm | ✓ |
| `GAME_OVER` na canvasu | ✓ |
| R restart brez F5 (`resetGame`) | ✓ |
| AI + lastna sprememba številk + razlaga | ✓ |