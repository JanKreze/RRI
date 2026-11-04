/**
 * collision.js — zaznava (detect) in reševanje (resolve) trkov z ovirami.
 * Vsi objekti imajo obliko { x, y, w, h } (levi zgornji kot).
 */

/**
 * AABB: ali se dva pravokotnika prekrivata?
 * Prekrivanje je, ko se prekrivata na OBEH oseh hkrati.
 * Vrača True/False
 */
export function aabbOverlap(a, b) {
  return (
    a.x < b.x + b.w && // levi rob a je levo od desnega roba b
    a.x + a.w > b.x && // desni rob a je desno od levega roba b
    a.y < b.y + b.h && // zgornji rob a je nad spodnjim robom b
    a.y + a.h > b.y // spodnji rob a je pod zgornjim robom b
  );
}

/** DETECT: ali pravokotnik zadene katero koli oviro iz tabele? */
export function hitsWall(rect, walls) {
  for (const wall of walls) {
    if (aabbOverlap(rect, wall)) return true;
  }
  return false;
}

/**
 * RESOLVE: premakne entiteto po oseh ločeno. Če bi premik v ovira vodil,
 * ga na tej osi razveljavi — zato igralec drsi ob zidu, namesto da obstane.
 * @param {object} entity — { x, y, w, h }
 * @param {number} dx — premik v pikslih po x (že pomnožen z dt)
 * @param {number} dy — premik v pikslih po y (že pomnožen z dt)
 * @param {Array} walls — tabela ovir { x, y, w, h }
 */
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