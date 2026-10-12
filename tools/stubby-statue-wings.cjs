// Recorta las alas altas de la Estatua de la Diosa y deja alas cortas y redondeadas en los hombros, como las de Hylia.
// Conserva el original en assets/sprites/statue-tall-wings.png y siempre parte de él, así que puede volver a ejecutarse.
// Uso: node tools/stubby-statue-wings.cjs [vista-ampliada.png]
const fs = require('fs');
const path = require('path');
const { decode, encode } = require('./png-rgba.cjs');
const root = path.resolve(__dirname, '..');
const sprites = path.join(root, 'assets/sprites');
const original = path.join(sprites, 'statue-tall-wings.png'), target = path.join(sprites, 'statue.png');
if (!fs.existsSync(original)) fs.copyFileSync(target, original);

const src = decode(fs.readFileSync(original)), W = src.width, H = src.height;
const at = (img, x, y) => (y * W + x) * 4;
const opaque = (img, x, y) => x >= 0 && y >= 0 && x < W && y < H && img.data[at(img, x, y) + 3] > 20;

// Contorno del cuerpo por fila (cabeza, hombros y túnica), medido sobre el sprite original.
function bodySpan(y) {
  if (y <= 27) return [32, 46];
  if (y <= 29) return [30, 48];
  if (y <= 30) return [28, 50];
  if (y <= 38) return [27, 51];
  // Por debajo de los hombros: el tramo opaco que contiene la línea central.
  let l = 39, r = 39;
  while (opaque(src, l - 1, y)) l--;
  while (opaque(src, r + 1, y)) r++;
  return [l, r];
}
// Alas cortas: óvalos estrechos que nacen en cada hombro y apuntan hacia arriba y afuera, como las de Hylia.
// tilt es la inclinación del eje largo respecto a la vertical; la derecha es el reflejo de la izquierda.
const TILT = 35 * Math.PI / 180;
// Las puntas quedan a la altura de la barbilla, por debajo de la cabeza, como en el sprite de Hylia.
const WINGS = [{ cx: 25, cy: 32, len: 7, half: 4.5, ax: -Math.sin(TILT), ay: -Math.cos(TILT) }, { cx: 54, cy: 32, len: 7, half: 4.5, ax: Math.sin(TILT), ay: -Math.cos(TILT) }];
const inWing = (x, y) => WINGS.some(w => {
  const dx = x - w.cx, dy = y - w.cy, along = dx * w.ax + dy * w.ay, across = -dx * w.ay + dy * w.ax;
  return (along / w.len) ** 2 + (across / w.half) ** 2 <= 1;
});

const out = { width: W, height: H, data: Buffer.from(src.data) };
const PEDESTAL_TOP = 60;
for (let y = 0; y < PEDESTAL_TOP; y++) for (let x = 0; x < W; x++) {
  if (!opaque(src, x, y)) continue;
  const [l, r] = bodySpan(y);
  if (x >= l && x <= r) continue;
  if (!inWing(x, y)) out.data[at(out, x, y) + 3] = 0;
}

// Color de contorno: el más frecuente entre los píxeles del borde original.
const counts = new Map();
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  if (!opaque(src, x, y)) continue;
  if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => !opaque(src, x + dx, y + dy))) {
    const i = at(src, x, y), key = [...src.data.subarray(i, i + 4)].join(',');
    counts.set(key, (counts.get(key) || 0) + 1);
  }
}
const outline = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0].split(',').map(Number);

// Redibuja el contorno donde se cortó: píxel conservado junto a uno que era opaco y ya no lo es.
const cut = [];
for (let y = 0; y < PEDESTAL_TOP; y++) for (let x = 0; x < W; x++) {
  if (!opaque(out, x, y)) continue;
  if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => opaque(src, x + dx, y + dy) && !opaque(out, x + dx, y + dy))) cut.push([x, y]);
}
for (const [x, y] of cut) Buffer.from(outline).copy(out.data, at(out, x, y));
fs.writeFileSync(target, encode(out));

// Límites del arte para el manifiesto.
let top = H, left = W, bottom = -1, right = -1;
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (opaque(out, x, y)) { top = Math.min(top, y); left = Math.min(left, x); bottom = Math.max(bottom, y); right = Math.max(right, x); }
const dataUri = 'data:image/png;base64,' + fs.readFileSync(target).toString('base64');
const manifestFile = path.join(sprites, 'manifest.json'), manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8').replace(/^﻿/, ''));
const oldUri = manifest.statue.data;
manifest.statue.data = dataUri;
manifest.statue.height = bottom - top + 1;
manifest.statue.bounds = [{ top, left, width: right - left + 1, height: bottom - top + 1 }];
fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n');

// La presentación v2 lleva los sprites incrustados: solo se sustituye la imagen de la estatua.
const v2 = path.join(root, 'script-v2.html');
let html = fs.readFileSync(v2, 'utf8');
const marker = '"statue":{"data":"', start = html.indexOf(marker);
if (start < 0) throw Error('Statue sprite not found in script-v2.html');
const end = html.indexOf('"', start + marker.length);
html = html.slice(0, start + marker.length) + dataUri + html.slice(end);
fs.writeFileSync(v2, html);
console.log(`Statue wings trimmed: ${cut.length} outline pixels redrawn; art ${right - left + 1}x${bottom - top + 1}; script-v2.html updated${oldUri === dataUri ? ' (unchanged)' : ''}.`);

// Vista ampliada opcional para revisar el resultado.
if (process.argv[2]) {
  const S = 6, big = { width: W * S, height: H * S, data: Buffer.alloc(W * S * H * S * 4) };
  for (let y = 0; y < H * S; y++) for (let x = 0; x < W * S; x++) {
    const i = at(out, Math.floor(x / S), Math.floor(y / S)), j = (y * W * S + x) * 4;
    if (out.data[i + 3] > 20) out.data.copy(big.data, j, i, i + 4);
    else { const c = ((x >> 3) + (y >> 3)) % 2 ? 60 : 80; big.data[j] = big.data[j + 1] = c; big.data[j + 2] = c + 10; big.data[j + 3] = 255; }
  }
  fs.writeFileSync(process.argv[2], encode(big));
}
