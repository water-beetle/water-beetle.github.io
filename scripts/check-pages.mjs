import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const root = join(project, 'dist', 'client');
const html = readFileSync(join(root, 'index.html'), 'utf8');
assert.match(html, /Orbital Days/);
assert.match(html, /lang="ko"/);
assert.match(html, /id="journal"/);
assert.match(html, /starfield\.jpg/);
assert.ok(existsSync(join(root, '.nojekyll')), 'GitHub Pages must preserve _next assets.');
const assets = new Set([...html.matchAll(/(?:src|href)="(\/[^"?#]*)(?:[^"]*)"/g)].map(match => match[1]));
for (const asset of assets) {
  if (asset === '/') continue;
  assert.ok(existsSync(join(root, decodeURIComponent(asset))), 'Missing public asset: ' + asset);
}
for (const filename of ['starfield.jpg']) {
  assert.ok(existsSync(join(root, 'images', filename)), 'Missing image: ' + filename);
}
assert.ok(!/예시 기록|예시 콘텐츠|예시 컨셉 이미지|예시 글/.test(html), 'Sample posts must not appear in the published page.');
assert.ok(!existsSync(join(root, 'images', 'cabin.jpg')) && !existsSync(join(root, 'images', 'station.jpg')), 'Sample images must not be published.');
assert.ok(!html.includes('localhost:'), 'Public HTML must not reference a local server.');
console.log('Static page, Korean content, starfield, and ' + assets.size + ' asset references verified.');
