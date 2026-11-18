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
const chapterIds = ['home', 'meteor', 'mining', 'bench', 'research', 'drone'];
const manifest = JSON.parse(
  readFileSync(join(root, '.vite/manifest.json'), 'utf8'),
);
assert.ok(
  !Object.keys(manifest).some((key) => key.includes('planet-scene')),
  'No decorative 3D runtime',
);
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
for (const marker of [
  'ORBITAL FALL',
  'id="journey"',
  'id="features"',
  'id="progress"',
  '/media/story/home-wide.webp',
  '03 건설 중',
  '04 완성',
  '5초',
])
  assert.ok(home.includes(marker), 'Homepage story: ' + marker);
for (const chapter of chapterIds)
  assert.ok(home.includes(`id="step-${chapter}"`), 'Chapter anchor ' + chapter);
assert.ok(
  !home.includes('orbital-planet.svg'),
  'Actual game imagery replaces decorative planet',
);
assert.ok(
  home.includes('<noscript>') && home.includes('ground-preview.webp'),
  'No-JS actual process images',
);
assert.ok(
  existsSync(join(root, '.nojekyll')) && existsSync(join(root, '404.html')),
);
for (const retired of ['drafts', 'devlog', 'optimization'])
  assert.ok(
    !existsSync(join(root, retired)),
    'No private/retired route ' + retired,
  );
for (const [path, html] of pages) {
  if(path!=='/'){assert.match(html, /class="experience is-reading"/);assert.match(html, /<section class="reader-panel/);assert.match(html, /<aside[^>]*inert=""/)}
  assert.match(html, /lang="ko"/);
  assert.equal(
    [...html.matchAll(/<h1(?:\s|>)/g)].length,
    1,
    'One heading: ' + path,
  );
  assert.equal([...html.matchAll(/src="\/site-analytics\.js"/g)].length, 1);
  assert.ok(
    !/[A-Z]:[\\/](Users|UnrealProjects)/i.test(html),
    'No private paths: ' + path,
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
const source = JSON.parse(readFileSync('content/published/index.json', 'utf8'));
for (const entry of source) {
  assert.ok(entry.status === 'published');
  assert.ok(!entry.chapterId || chapterIds.includes(entry.chapterId));
  assert.deepEqual(
    entry,
    JSON.parse(
      readFileSync('content/published/' + entry.slug + '.json', 'utf8'),
    ),
    'Index matches article ' + entry.slug,
  );
}
assert.equal(
  readdirSync('content/published').filter(
    (f) => f.endsWith('.json') && f !== 'index.json',
  ).length,
  entries.length,
);
console.log(
  `Verified ${pages.size} pages, six chapters, real construction frames, ${Object.keys(media).length} image pairs, legacy URLs, analytics, comments and private-draft exclusion.`,
);
