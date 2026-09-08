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

const series = readFileSync(join(root, 'optimization', 'index.html'), 'utf8');
const articlePaths = [...new Set([...series.matchAll(/href="(\/optimization\/[^"/#]+\/)"/g)].map(match => match[1]))];
assert.equal(articlePaths.length, 9, 'The complete optimization series must expose all nine articles.');
assert.match(html, /href="\/optimization\/"/, 'Home navigation must expose the optimization section.');
const pages = new Map([['/', html], ['/optimization/', series], ...articlePaths.map(path => [path, readFileSync(join(root, path, 'index.html'), 'utf8')])]);
const idsByPage = new Map();
for (const [path, content] of pages) {
  const ids = [...content.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'Duplicate anchors on ' + path);
  idsByPage.set(path, new Set(ids));
  assert.equal([...content.matchAll(/<h1(?:\s|>)/g)].length, 1, 'Exactly one page heading on ' + path);
  assert.match(content, /lang="ko"/);
  assert.ok(!/[A-Z]:[\\/](?:Users|UnrealProjects)/i.test(content), 'Private local path in ' + path);
  if (articlePaths.includes(path)) {
    assert.match(content, /id="article-content"/);
    assert.match(content, /코드와 확인 자료/);
    assert.ok([...content.matchAll(/<section id="/g)].length >= 7, 'Missing detailed sections on ' + path);
  }
}
for (const [path, content] of pages) {
  for (const [, href] of content.matchAll(/(?:href|src)="((?:\/|#)[^"]*)"/g)) {
    const url = new URL(href.replaceAll('&amp;', '&'), 'https://blog.example' + path);
    if (url.origin !== 'https://blog.example') continue;
    assert.ok(existsSync(join(root, decodeURIComponent(url.pathname))), 'Missing link or asset: ' + path + ' -> ' + href);
    if (url.hash && idsByPage.has(url.pathname)) {
      assert.ok(idsByPage.get(url.pathname).has(decodeURIComponent(url.hash.slice(1))), 'Broken anchor: ' + path + ' -> ' + href);
    }
  }
}
const evidence = JSON.parse(readFileSync(join(root, 'optimization', 'evidence.json'), 'utf8'));
assert.equal(evidence.records.default_startup.exit_code, 0);
assert.equal(evidence.records.full06.passed + evidence.records.full06.passed_with_warnings, 90);
assert.ok(evidence.records.movement_final01.aggregate_by_mode.environment.metrics.FrameTime.average_fps < 60);
console.log('Nine static optimization articles, navigation, unique anchors, metadata headings, and cited evidence verified.');
console.log('Static page, Korean content, starfield, and ' + assets.size + ' asset references verified.');
