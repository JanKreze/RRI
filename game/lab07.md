Teden 7 — Score, valovi, HUD in refleksija
1. Model valov (Prompt A)
Izbral sem preprost sistem valov. Ko uničim vse sovražnike v trenutnem valu, se samodejno začne naslednji val. Vsak naslednji val ima enega sovražnika več kot prejšnji.
Pravilo valov
- Val 1 ima 2 sovražnika.
- Vsak naslednji val doda 1 sovražnika.
- Število sovražnikov v valu n izračunam z izrazom:
const count = WAVE_START_ENEMIES + WAVE_ENEMY_STEP * (n - 1);
V konfiguraciji imam WAVE_START_ENEMIES = 2 in WAVE_ENEMY_STEP = 1.
Psevdokoda
spawnWave(n):
    wave = n
    count = 2 + (n - 1)

    enemies = prazen seznam
    ponovi count-krat:
        poišči prosto mesto ob robu platna
        če mesto ni v zidu, predaleč od igralca
           in se ne prekriva z drugim sovražnikom:
            dodaj sovražnika

    če ni bilo mogoče ustvariti nobenega sovražnika:
        ustvari enega na rezervni lokaciji

    world.enemies = enemies

update:
    če je seznam sovražnikov prazen:
        spawnWave(wave + 1)
Sovražniki se ustvarijo ob robu platna, ne preblizu igralca, v zidu ali preblizu drugim sovražnikom. V tej različici se ne premikajo; AI za sledenje igralcu je predviden za 8. teden.
Kako preprečim spawn v zidu?
Pri ustvarjanju sovražnika preverim, ali se njegov pravokotnik prekriva z oviro. Za preverjanje uporabljam funkcijo aabbOverlap. Spawn pravokotnik še malo povečam z SPAWN_GAP, da sovražnik ne nastane tik ob oviri ali drugem sovražniku. Če lokacija ni ustrezna, poskusim izbrati drugo. Na voljo je največ 200 poskusov.
2. HUD (Prompt B)
HUD prikazuje pomembne podatke o igri, da jih lahko spremljam med igranjem.

V moji implementaciji:
- palica HP je zgoraj desno;
- val in točke sta pod palico, prav tako desno poravnana;
- HP palica prikazuje trenutno in maksimalno zdravje;
- v stanju GAME_OVER se prikažeta dosežen val in končne točke.
Podatke rišem na canvas z metodo fillText(), palico zdravja pa z fillRect(). Za boljšo berljivost je uporabljeno temno ozadje oziroma temna barva palice, svetlo besedilo in kontrastna barva polnjenja.

Primer risanja besedila:
ctx.fillStyle = "#e8eaed";
ctx.font = "bold 16px system-ui, sans-serif";
ctx.textAlign = "right";
ctx.textBaseline = "top";

ctx.fillText(`Val: ${world.wave}`, W - 12, 38);
ctx.fillText(`Točke: ${world.score}`, W - 12, 60);
HP palica se prilagaja zdravju igralca. Širina zelenega dela je izračunana glede na razmerje player.hp / player.maxHp, zato se skrajša, ko igralec prejme škodo.
3. Težavnost (Prompt C)
Za težavnost sem izbral, da se vsak val poveča za enega sovražnika. Začetni val ima 2 sovražnika, nato 3, 4, 5 in tako naprej. Sovražniki imajo v tej različici enako HP in se ne premikajo.
Možni predlogi za težavnost
Predlog	Sprememba	Občutek med igranjem
1	+1 sovražnik na val	Težavnost se povečuje postopoma in je lažje spremljati napredovanje.
2	+2 sovražnika na val	Arena se hitreje napolni in igra postane bolj zahtevna.
3	Sovražniki dobijo več HP v višjih valovih	Za uničenje sovražnikov je potrebnih več zadetkov, zato bo posamezen spopad trajal dlje.


Izbral sem prvi predlog: +1 sovražnik na val. Tako se težavnost povečuje postopoma, brez prevelikega skoka. V konfiguraciji lahko korak spreminjam s konstanto WAVE_ENEMY_STEP.
4. GDD — napredovanje in pogoji igre
Napredovanje
Igra je zasnovana kot endless survival. Začne se z 2 sovražnikoma v prvem valu. Ko igralec odstrani vse sovražnike, se začne naslednji val, ki vsebuje enega dodatnega sovražnika.
- Val 1: 2 sovražnika
- Val 2: 3 sovražniki
- Val 3: 4 sovražniki
- Val 4: 5 sovražnikov
- Vsak naslednji val doda 1 sovražnika.
Sovražniki imajo 20 HP. Vsak strel povzroči 10 škode, zato sta potrebna 2 zadetka za uničenje sovražnika. Za vsakega uničenega sovražnika igralec prejme 50 točk.
Pogoji igre
- Zmaga / napredovanje: ni končne zmage; cilj je preživeti čim več valov in zbrati čim več točk.
- Konec igre: igralčevo HP pade na 0.
- Nova igra: po koncu igre pritisnem R. Ponastavijo se igralec, HP, točke, krogle, popupi, časovnik streljanja in val; igra se začne znova pri valu 1.
Občutek težavnosti
Ker se število sovražnikov povečuje, je v vsakem novem valu več nevarnosti in je treba bolj paziti na položaj ter gibanje. Za zdaj sovražniki stojijo na mestu, zato težavnost povečujem samo s številom sovražnikov.
5. AI prompti in refleksija
Prompt A — model valov
AI sem uporabil kot pomoč pri razmišljanju o preprostem modelu valov: število sovražnikov, ustvarjanje novega vala, točke in osnovna struktura podatkov. Predlog sem prilagodil svoji igri in implementiral funkcijo spawnWave(world, n). Val se poveča, ko je world.enemies.length === 0.
Prompt B — HUD
HUD sem uredil tako, da so podatki vidni na canvasu in ne prekrivajo glavnega dela igre. V moji končni implementaciji so HP, val in točke zgoraj desno. Uporabljam fillText() za besedilo ter fillRect() za palico zdravja.
Prompt C — težavnost
Izbral sem postopno povečanje števila sovražnikov za 1 na val. To sem določil s konstantama WAVE_START_ENEMIES in WAVE_ENEMY_STEP, zato lahko težavnost spreminjam brez spreminjanja glavne logike valov.
6. Pričakovana refleksija
1. Kakšno pravilo vala sem izbral in zakaj?
Izbral sem, da se vsak val poveča za enega sovražnika. Prvi val ima 2 sovražnika, vsak naslednji pa enega več. To sem izbral, ker se težavnost povečuje postopoma in je sistem preprost za razumevanje ter spreminjanje.
2. Kako se val 3 razlikuje od vala 1 (številke)?
Val 1 ima 2 sovražnika, val 3 pa 4 sovražnike. Število sovražnikov se poveča za 2. Vsak sovražnik ima 20 HP, zato ima val 1 skupaj 40 HP sovražnikov, val 3 pa 80 HP sovražnikov, če vsi uspešno nastanejo.
3. Kaj resetiram ob R?
Ob R po koncu igre ustvarim novega igralca na začetni poziciji z začetnim HP. Ponastavim score na 0, krogle in popupe na prazna seznama, časovnik streljanja na 0 in ustvarim val 1. Stanje igre spremenim v PLAYING. Ovire in nastavitve debug ostanejo.
4. Kje je AI predlagal procedural dungeon ali Phaser group — in kaj sem zavrnil?
V tej vaji sem se držal obsega navodil in obstoječe vanilla JavaScript Canvas strukture. Proceduralnega dungeon-a ali Phaser skupin nisem vključil, ker bi to dodalo nove sisteme, ki niso potrebni za cilj 7. tedna. Osredotočil sem se na score, valove in HUD ter ohranil obstoječo strukturo projekta.
7. Povzetek implementacije
- world.score spremlja dosežene točke.
- world.wave spremlja trenutni val.
- spawnWave(world, n) ustvari sovražnike za izbrani val.
- Ko ni več sovražnikov, se sproži naslednji val.
- POINTS_PER_KILL določa število točk za uničenje sovražnika.
- HUD prikazuje HP, val in točke.
- resetGame(world) ponastavi igro po koncu.
- Sovražniki v tej različici stojijo; sledenje igralcu (seek) je predvideno za 8. teden.