import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
const root = resolve('dist/client');
const home = readFileSync(join(root, 'index.html'), 'utf8');
const entries = JSON.parse(
  readFileSync('content/published/index.json', 'utf8'),
);
const slugs = [
  'planets',
  'movement',
  'spaceship',
  'meteors',
  'factory',
  'research',
  'home',
  'interfaces',
];
const manifest = JSON.parse(
  readFileSync(join(root, '.vite/manifest.json'), 'utf8'),
);
assert.ok(
  manifest['components/showcase.tsx'].dynamicImports.includes(
    'components/planet-scene.tsx',
  ),
  '3D stays lazy-loaded',
);
assert.ok(!home.includes('planet-scene-'), 'Initial HTML does not preload 3D');
const pages = new Map([
  ['/', home],
  ['/updates/', readFileSync(join(root, 'updates/index.html'), 'utf8')],
  ...entries.map((p) => [
    `/updates/${p.slug}/`,
    readFileSync(join(root, 'updates', p.slug, 'index.html'), 'utf8'),
  ]),
  ...slugs.map((s) => [
    `/features/${s}/`,
    readFileSync(join(root, 'features', s, 'index.html'), 'utf8'),
  ]),
]);
assert.match(home, /ORBITAL FALL/);
assert.match(home, /id="journey"/);
assert.match(home, /id="features"/);
assert.match(home, /id="progress"/);
assert.match(home, /orbital-planet\.svg/);
assert.match(home, /5초/);
assert.ok(
  existsSync(join(root, '.nojekyll')) && existsSync(join(root, '404.html')),
);
assert.ok(
  !existsSync(join(root, 'drafts')) &&
    !existsSync(join(root, 'devlog')) &&
    !existsSync(join(root, 'optimization')),
);
for (const [path, html] of pages) {
  assert.match(html, /lang="ko"/);
  assert.equal(
    [...html.matchAll(/<h1(?:\s|>)/g)].length,
    1,
    'One main heading: ' + path,
  );
  assert.equal([...html.matchAll(/src="\/site-analytics\.js"/g)].length, 1);
  assert.ok(
    !/[A-Z]:[\\/](Users|UnrealProjects)/i.test(html),
    'No local paths: ' + path,
  );
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length, 'Unique anchors: ' + path);
  for (const [, raw] of html.matchAll(/(?:src|href)="((?:\/|#)[^"]*)"/g)) {
    const url = new URL(
      raw.replaceAll('&amp;', '&'),
      'https://water-beetle.github.io' + path,
    );
    let file = decodeURIComponent(url.pathname);
    if (file.endsWith('/')) file += 'index.html';
    assert.ok(
      existsSync(join(root, file)),
      'Missing link: ' + path + ' -> ' + file,
    );
    if (url.hash && url.pathname === path)
      assert.ok(
        ids.includes(decodeURIComponent(url.hash.slice(1))),
        'Missing anchor: ' + url.hash,
      );
  }
  if (path.startsWith('/updates/') && path !== '/updates/') {
    assert.match(html, /data-article-type="devlog"/);
    assert.match(html, /comments-devlog-/);
  }
  if (path.startsWith('/features/')) {
    assert.match(html, /data-article-type="feature"/);
    assert.match(html, /현재 범위와 남은 작업/);
  }
}
const media = JSON.parse(readFileSync('lib/journal-media.json', 'utf8'));
for (const item of Object.values(media))
  for (const key of ['src', 'thumbnail'])
    assert.ok(existsSync(join(root, item[key])), 'Missing image ' + item[key]);
const contentFiles = readdirSync('content/published').filter(
  (f) => f.endsWith('.json') && f !== 'index.json',
);
assert.equal(
  contentFiles.length,
  entries.length,
  'Published index stays synchronized',
);
assert.ok(
  entries.every((p) => p.status === 'published'),
  'Only reviewed publication data',
);
console.log(
  `Verified ${pages.size} pages, current journey, ${entries.length} posts, media, links, legacy routes, analytics and draft exclusion.`,
);
