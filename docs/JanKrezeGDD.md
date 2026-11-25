# Game Design Document — predloga (P16)

Izpolni med tednom 1 in dopolnjuj skozi semester.  
Tedni 01–08 (skupna baza): **Top-down Zombie Survival**
Projektna faza: **lastna igra**

---

## 1. Osnovni podatki

| Polje | Vsebina |
|-------|---------|
| Naslov igre | *Zombie Warfare* |
| Avtor / *Jan Kreže* | |
| Žanr | *top-down survival* / … |
| Platforma | *brskalnik (HTML5 Canvas + JS)* |
| Ciljna dolžina ene seje | *3-4 min* |
| Datum / verzija GDD | *25.11.2026* |

## 2. Elevator pitch (2–3 stavki)

> Kaj igraš, zakaj je zabavno, kako “umreš” ali zmagaš?
*Zombie top-down game, zabavno videti, kako daleč lahko prideš, umreš ko izgubiš vse življenske točke, zaenkrat endless, mogoče pozneje da zmagaš, ko premagaš 10 valov zombijev.*

## 3. Fantazija / tema

- Svet in ton (npr. mesto ponoči, podzemlje …): *mesto ponoči*
- Referenčne igre (2–3): *SAS 4 Zombie Assault, Zombie Assault Resurgence*
- Zakaj Canvas / ta sklop mehanik ustreza temi: *zato ker ima večina zombie iger setting, da se dogaja v mestih*

## 4. Jedrne mehanike

Za vsako mehaniko: **vhod → pravilo → feedback**.

| # | Mehanika | Vhod | Pravilo | Feedback |
|---|----------|------|---------|----------|
| 1 | Premikanje | *WASD, arrowkeys* | *clamp na robu play-area-je ter poševno premikanje* | *premikanje igralca* |
| 2 | Streljanje | *miška - leftclick (držanje)* | *0.3 secs cooldown, izstrelek leti 700 px/s proti kazalcu* | *rumen okrogel izstrelek, "-10" nad zadetim sovražnikom* |
| 3 | Škoda / HP | *kontakt z sovražnikom* | *30 starting HP, 10 škode/kontakt, 1 sec invulnerability timer* | *igralec postane rdeč za 1 s, palica HP s številom* |
| 4 | Valovi / napredek | */* | *nov val, ko je arena prazna; val n ima n + 1 sovražnikov, od vala 2 tudi runnerji; walker 50 točk, runner 30* | *HUD: val in točke, izpis točk ob smrti* |
| 5 | *menjava orožij, uporaba več orožij na enkrat (1 primary, 1 secondary) - omogoča dodajanje težjih sovražnikov* | */* | */* | */* |
| 6 | *power-upi (health regen, shields, movement speed boost), 1-2x na opravljen val, vsaki igri doda edinstvenost, zaenkrat so še neimplementirani* | */* | */* | */* |
| 7 | *ranged sovražniki, oteži preživetje igralca* | */* | */* | */* |

## 5. Igralec

- Velikost / hitrost (začetne vrednosti): *32, 320*
- Zdravje: *starting HP 30*
- Orožje / cooldown: *različna orožja planirana, trenutno samo eno - 0.3s cooldown*
- Omejitve: *trenutno neznane*

## 6. Sovražniki / ovire

| Tip | Vedenje | HP | Hitrost | Nagrada (score) |
|-----|---------|----|--------|-----------------|
| walker | sledi | *20* | *60 px/s* | *50* |
| runner | sledi hitro | *10* | *150 px/s* | *30* |
| *(opcijsko)* | *sledi počasi, počasno strelja v igralca* | *?* | *?* | *?* |

Za **Dungeon Escape**: namesto valov opiši sobe, ključe, izhod.

## 7. Napredek in težavnost

- Score: *50 na walkerja, 30 na runnerja*
- Valovi / sobe: *trenutno endless; nov val, ko je arena prazna*
- Kako se otežuje: *več in več sovražnikov, linear scaling (vsakič en več: 2, 3, 4, …); od vala 2 je približno tretjina hitrih runnerjev*
- Win condition (če obstaja) / lose condition: */ ga še ni*

## 8. Stanja igre

- `MENU` → `PLAYING` → `GAME_OVER` → `PAUSE`
- Kaj vidi igralec v vsakem stanju: *MENU ni implementiran, v PLAYING stanju vidi stanje igre + sebe + sovražnike, izstrelke etc. valove, score, svoj HP, enemy HP, v PAUSE vidi freeze frame + "PAUSE" text, v GAME_OVER vidi napis Game Over ter svoj score*

## 9. UI / HUD

- Med igro (HP, score, val …): *v PLAYING stanju vidi stanje igre + sebe + sovražnike, izstrelke, valove, score, svoj HP, enemy HP etc.*
- Meni / game over: *Obadva obstajata in delujeta kot napisano zgoraj*
- Dostopnost (kontrast, velikost besedila): *sans serif*

## 10. Asseti

| Asset | Opis | Vir / licenca | Status |
|-------|------|---------------|--------|
| sprite igralec | | | |
| sprite sovražnik | | | |
| SFX strel | | | |
| … | | | |

## 11. Tehnični okvir

- Datoteke: `index.html`, `style.css`, `assets/`, `js/`
- Brez Phaser / Three.js (dogovor predmeta)
- Znane omejitve: *brez pathfindinga (sovražnik se ob zidu ustavi), brez menija, en tip orožja*

## 12. Lastna igra (projektna faza)

Po tednu 8: lastna igra, ne dodatni tedni polisha skupne baze kot glavni cilj. Glej `projekt/BRIEF.md`.

- Izhodišče: baza tedna 8 / nova Canvas igra:
- Ideja / pitch:
- Zakaj je doable v preostanku semestra:
- Merilo “končano” (vertical slice + demo):
- Asseti (sprite/zvok, vir, licenca):

## 13. Tveganja in plan B

- Kaj lahko odpade, če zmanjka časa: *več player orožij*
- Minimalni igrivi rez (MVP): *narejen (teden 8): premik, strel, HP, valovi, seek in dva tipa sovražnikov*

## 14. Dnevnik sprememb GDD

| Datum | Spremeba |
|-------|----------|
| 14.10.2026 | Prva verzija |
| 21.10.2026 | Game + js mapa |
| 28.10.2026 | Časovne mehanike |
| 4.11.2026 | Ovire, entiteta sovražnik |
| 11.11.2026 | Bullets, streljanje |
| 18.11.2026 | HP, škoda, game over |
| 18.11.2026 | Score, valovi, HUD |
| 25.11.2026 | Runnerji, premik proti igralcu |
| 25.11.2026 | Stabilizacija, README skupne baze, GDD uskladen z igro |
---

*Oddaja: ta GDD + povezava do repozitorija. Posodobi pred demom lastne igre (`projekt/`).*