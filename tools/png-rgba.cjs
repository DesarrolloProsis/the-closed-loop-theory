// Lectura y escritura mínimas de PNG RGBA de 8 bits (sin dependencias), para retocar sprites píxel a píxel.
const zlib = require('zlib');

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

// Devuelve { width, height, data } con data en RGBA (4 bytes por píxel).
function decode(buffer) {
  if (buffer.readUInt32BE(0) !== 0x89504e47) throw Error('Not a PNG');
  let pos = 8, width, height, depth, type, palette, alpha, idat = [];
  while (pos < buffer.length) {
    const len = buffer.readUInt32BE(pos), name = buffer.toString('ascii', pos + 4, pos + 8), body = buffer.subarray(pos + 8, pos + 8 + len);
    if (name === 'IHDR') { width = body.readUInt32BE(0); height = body.readUInt32BE(4); depth = body[8]; type = body[9]; if (body[12]) throw Error('Interlaced PNG not supported'); }
    else if (name === 'PLTE') palette = body;
    else if (name === 'tRNS') alpha = body;
    else if (name === 'IDAT') idat.push(body);
    pos += 12 + len;
  }
  if (depth !== 8 || ![2, 3, 6].includes(type)) throw Error(`Unsupported PNG: depth ${depth}, type ${type}`);
  const channels = { 2: 3, 3: 1, 6: 4 }[type], stride = width * channels, raw = zlib.inflateSync(Buffer.concat(idat));
  const pixels = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)], line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? pixels[y * stride + x - channels] : 0, b = y ? pixels[(y - 1) * stride + x] : 0, c = x >= channels && y ? pixels[(y - 1) * stride + x - channels] : 0;
      const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
      const pred = [0, a, b, (a + b) >> 1, pa <= pb && pa <= pc ? a : pb <= pc ? b : c][filter];
      pixels[y * stride + x] = (line[x] + pred) & 0xff;
    }
  }
  const data = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    if (type === 6) pixels.copy(data, i * 4, i * 4, i * 4 + 4);
    else if (type === 2) { pixels.copy(data, i * 4, i * 3, i * 3 + 3); data[i * 4 + 3] = 255; }
    else { const k = pixels[i]; palette.copy(data, i * 4, k * 3, k * 3 + 3); data[i * 4 + 3] = alpha && k < alpha.length ? alpha[k] : 255; }
  }
  return { width, height, data };
}

function chunk(name, body) {
  const out = Buffer.alloc(12 + body.length);
  out.writeUInt32BE(body.length, 0); out.write(name, 4, 'ascii'); body.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + body.length)), 8 + body.length);
  return out;
}
function encode({ width, height, data }) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4); ihdr[8] = 8; ihdr[9] = 6;
  const raw = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) data.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}

module.exports = { decode, encode };
