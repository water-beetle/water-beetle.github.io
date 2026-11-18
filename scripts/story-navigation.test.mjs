import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isReturnPoint,
  recordOrigin,
  resumePoint,
} from '../lib/story-navigation.mjs';
test('a direct record has no invented return origin', () => {
  assert.equal(recordOrigin({}, '/updates/first-workbench/'), null);
  assert.equal(recordOrigin({}, '/features/home/'), null);
});
test('full-document navigation preserves a scene and archive return independently', () => {
  const home = {
    path: '/',
    y: 2310,
    focusHref: '/updates/first-workbench/',
    focusLabel: '이 장면의 개발 기록',
    scopeId: 'scene-viewer',
  };
  const archive = {
    path: '/updates',
    y: 140,
    focusHref: '/updates/first-mining-drone/',
  };
  const data = {
    homePoint: home,
    origins: {
      '/updates/first-workbench': home,
      '/updates/first-mining-drone': archive,
    },
  };
  assert.deepEqual(recordOrigin(data, '/updates/first-workbench/'), home);
  assert.deepEqual(recordOrigin(data, '/updates/first-mining-drone/'), archive);
  assert.deepEqual(recordOrigin(data, '/updates/'), home);
});
test('scroll resumes only on its destination and explicit chapter links take priority', () => {
  const point = { path: '/', y: 2310 };
  const data = { resume: point };
  assert.deepEqual(resumePoint(data, '/', ''), point);
  assert.equal(resumePoint(data, '/updates/', ''), null);
  assert.equal(resumePoint(data, '/', '#step-home'), null);
});
test('invalid, external and looping return destinations are rejected', () => {
  for (const path of [
    'https://example.com',
    '//example.com',
    '/updates/first-workbench/',
    '../',
  ])
    assert.equal(isReturnPoint({ path, y: 4 }), false);
  for (const y of [-1, Infinity, NaN, '200', 10000001])
    assert.equal(isReturnPoint({ path: '/', y }), false);
  assert.equal(isReturnPoint({ path: '/updates/', y: 0 }), true);
});
