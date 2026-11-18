import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {
  sceneFromHash,
  sceneHref,
  validScene,
  coverPoint,
} from '../lib/world-navigation.mjs';

test('shared scene addresses and old chapter links resolve to real selections', () => {
  const selection = { scene: 'bench', shot: 'building' };
  assert.deepEqual(sceneFromHash(sceneHref(selection).slice(1)), selection);
  assert.deepEqual(sceneFromHash('#step-mining'), {
    scene: 'meteor',
    shot: 'mining',
  });
  assert.deepEqual(sceneFromHash('#step-research'), {
    scene: 'computer',
    shot: 'desk',
  });
  assert.deepEqual(sceneFromHash('#features'), {
    scene: 'computer',
    shot: 'desk',
  });
  for (const hash of [
    '#scene=__proto__',
    '#scene=home&shot=missing',
    '#scene=../updates',
    '#scene=drone&shot=menu',
    '#step-missing',
  ])
    assert.equal(sceneFromHash(hash), null);
  assert.equal(validScene(null), false);
});
test('target projection follows the real photo through wide and portrait cover crops', () => {
  assert.deepEqual(
    coverPoint(
      { x: 50, y: 50 },
      { width: 1920, height: 1080 },
      { width: 1280, height: 800 },
    ),
    { x: 640, y: 400 },
  );
  const left = coverPoint(
    { x: 0, y: 50 },
    { width: 1920, height: 1080 },
    { width: 390, height: 844 },
  );
  assert.ok(left.x < 0);
  assert.equal(left.y, 422);
  const portrait = coverPoint(
    { x: 50, y: 50 },
    { width: 1080, height: 1602 },
    { width: 390, height: 844 },
  );
  assert.ok(Math.abs(portrait.x - 195) < 0.00001);
  assert.equal(portrait.y, 422);
});
function loadWorld() {
  const exports = {};
  const media = JSON.parse(readFileSync('lib/journal-media.json', 'utf8'));
  const js = ts.transpileModule(readFileSync('lib/world.ts', 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  vm.runInNewContext(js, {
    exports,
    require: (name) => {
      assert.equal(name, './devlogs');
      return { media };
    },
  });
  return exports;
}
test('every place and process links to real photos and an exported record', () => {
  const { worldScenes } = loadWorld();
  const routes = [
    '/updates/',
    ...JSON.parse(readFileSync('content/published/index.json', 'utf8')).map(
      (d) => '/updates/' + d.slug + '/',
    ),
  ];
  const ids = new Set();
  for (const scene of worldScenes) {
    assert.ok(validScene(scene.parent));
    assert.ok(routes.includes(scene.record));
    if (scene.next) assert.ok(validScene(scene.next.to));
    for (const shot of scene.shots) {
      assert.ok(validScene({ scene: scene.id, shot: shot.id }));
      assert.ok(existsSync('public' + shot.photo.src), shot.photo.src);
      if (shot.photo.portrait)
        assert.ok(existsSync('public' + shot.photo.portrait));
      for (const target of shot.targets || []) {
        assert.ok(!ids.has(target.id), 'unique focus target');
        ids.add(target.id);
        assert.ok(
          target.x > 0 && target.x < 100 && target.y > 0 && target.y < 100,
        );
        if (target.to) assert.ok(validScene(target.to));
        else assert.ok(routes.includes(target.href));
      }
    }
  }
});
test('the actual start screen reaches every place without unlocking or a simulated inventory', () => {
  const { worldScenes } = loadWorld(),
    visited = new Set(),
    queue = ['clearing'];
  while (queue.length) {
    const id = queue.shift();
    if (visited.has(id)) continue;
    visited.add(id);
    const scene = worldScenes.find((s) => s.id === id);
    if (scene.next) queue.push(scene.next.to.scene);
    for (const shot of scene.shots)
      for (const t of shot.targets || []) if (t.to) queue.push(t.to.scene);
  }
  assert.equal(visited.size, worldScenes.length);
});

test('all scene targets remain inside the photographed frame on supported screen shapes', async () => {
  const { default: sharp } = await import('sharp');
  const { worldScenes } = loadWorld();
  for (const viewport of [
    { width: 375, height: 667 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
    { width: 1920, height: 1080 },
  ]) {
    for (const scene of worldScenes)
      for (const shot of scene.shots) {
        if (!shot.targets?.length) continue;
        const portrait = viewport.width <= 700;
        const file =
          portrait && shot.photo.portrait
            ? shot.photo.portrait
            : shot.photo.src;
        const image = await sharp('public' + file).metadata();
        for (const target of shot.targets) {
          const p = coverPoint(
            portrait && target.mobile ? target.mobile : target,
            { width: image.width, height: image.height },
            viewport,
          );
          assert.ok(
            p.x >= 24 && p.x <= viewport.width - 24,
            target.id + ' horizontal ' + JSON.stringify(viewport),
          );
          assert.ok(
            p.y >= 82 && p.y <= viewport.height - 100,
            target.id + ' vertical ' + JSON.stringify(viewport),
          );
        }
      }
  }
});
