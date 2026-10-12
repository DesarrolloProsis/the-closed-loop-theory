// Keep the presentation self-contained; no runtime request is needed for scenery.
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const target = path.join(root, 'script-v2.html');
const html = fs.readFileSync(target, 'utf8');
const start = html.indexOf('// Source for the self-contained backdrops');
const end = html.indexOf('const BACKDROP_OF=', start);
if (start < 0 || end < 0) throw Error('Backdrop source markers missing');
const source = fs.readFileSync(path.join(__dirname, 'location-backdrops.js'), 'utf8');
fs.writeFileSync(target, html.slice(0, start) + source.trimEnd() + '\n' + html.slice(end));
console.log('Embedded location backdrops in script-v2.html');
