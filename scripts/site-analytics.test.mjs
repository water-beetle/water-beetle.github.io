import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const source = readFileSync(new URL('../public/site-analytics.js', import.meta.url), 'utf8');
function browser(overrides = {}) {
  const scripts = [], timers = new Map(), listeners = new Map();
  let nextTimer = 0, observe;
  const headings = ['one', 'two'].map(id => ({ dataset: { analyticsArticle: 'journal/' + id, articleTitle: id, articleType: 'journal' } }));
  const document = {
    currentScript: { dataset: { measurementId: overrides.id ?? 'G-TEST123', siteOrigin: 'https://water-beetle.github.io' } },
    hidden: false,
    referrer: 'https://example.com/ref?secret=private#fragment',
    head: { appendChild: script => scripts.push(script) },
    createElement: () => ({}),
    querySelectorAll: () => headings,
    addEventListener: (name, listener) => listeners.set(name, listener)
  };
  const window = {
    location: new URL(overrides.url ?? 'https://water-beetle.github.io/?giscus=private#one'),
    setTimeout: (fn, delay) => { assert.equal(delay, 2000); timers.set(++nextTimer, fn); return nextTimer; },
    clearTimeout: id => timers.delete(id),
    IntersectionObserver: class {
      constructor(callback) { observe = callback; }
      observe() {}
      unobserve() {}
    }
  };
  const context = vm.createContext({ window, document, navigator: overrides.navigator ?? {}, URL });
  const run = () => vm.runInContext(source, context);
  run();
  return {
    window, scripts, run,
    calls: () => Array.from(window.dataLayer ?? [], args => Array.from(args)),
    intersect: (index, visible, ratio = 1) => observe([{ target: headings[index], isIntersecting: visible, intersectionRatio: ratio }]),
    elapsed: () => { const pending = [...timers.values()]; timers.clear(); pending.forEach(fn => fn()); },
    hidden: value => { document.hidden = value; listeners.get('visibilitychange')(); }
  };
}
test('previews, missing IDs and browser opt-outs never load or send analytics', () => {
  for (const options of [{ id: '' }, { id: 'wrong' }, { url: 'http://localhost:3000/' }, { url: 'https://preview.example/' }, { navigator: { doNotTrack: '1' } }, { navigator: { globalPrivacyControl: true } }]) {
    const page = browser(options);
    assert.equal(page.scripts.length, 0);
    assert.equal(page.calls().length, 0);
  }
});
test('one pageview configuration, with authentication query and fragment removed', () => {
  const page = browser();
  page.run();
  assert.equal(page.scripts.length, 1);
  assert.equal(page.scripts[0].src, 'https://www.googletagmanager.com/gtag/js?id=G-TEST123');
  const configs = page.calls().filter(args => args[0] === 'config');
  assert.equal(configs.length, 1);
  assert.equal(configs[0][2].page_location, 'https://water-beetle.github.io/');
  assert.equal(configs[0][2].page_referrer, 'https://example.com/ref');
  assert.equal(configs[0][2].allow_google_signals, false);
  assert.equal(page.calls().filter(args => args[1] === 'page_view').length, 0);
});
test('fast scrolling and hidden tabs do not count as article views', () => {
  const page = browser();
  page.intersect(0, true);
  page.intersect(0, false);
  page.elapsed();
  page.intersect(1, true, 0.1);
  page.elapsed();
  assert.equal(page.calls().filter(args => args[0] === 'event').length, 0);
  page.intersect(0, true);
  page.hidden(true);
  page.elapsed();
  assert.equal(page.calls().filter(args => args[0] === 'event').length, 0);
  page.hidden(false);
  page.elapsed();
  assert.equal(page.calls().filter(args => args[0] === 'event').length, 1);
});
test('each inline article records once per page load, independent of pageviews', () => {
  const page = browser();
  page.intersect(0, true);
  page.elapsed();
  page.intersect(0, false);
  page.intersect(0, true);
  page.intersect(1, true);
  page.elapsed();
  const views = page.calls().filter(args => args[1] === 'article_view');
  assert.deepEqual(views.map(args => args[2].article_id), ['journal/one', 'journal/two']);
  assert.equal(page.calls().filter(args => args[0] === 'config').length, 1);
});
