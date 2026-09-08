/* The production domain alone sends analytics; previews never affect reports. */
(function () {
  'use strict';
  const settings = document.currentScript && document.currentScript.dataset;
  if (!settings || !/^G-[A-Z0-9]+$/.test(settings.measurementId) ||
      window.location.origin !== settings.siteOrigin ||
      navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true ||
      window.__orbitalAnalyticsStarted) return;
  window.__orbitalAnalyticsStarted = true;

  function cleanUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' || url.protocol === 'http:' ? url.origin + url.pathname : '';
    } catch { return ''; }
  }
  window.dataLayer = window.dataLayer || [];
  // Preserve Google's documented command queue format.
  // eslint-disable-next-line prefer-rest-params
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  // config sends the page_view. Do not also send a manual page_view.
  window.gtag('config', settings.measurementId, {
    page_location: cleanUrl(window.location.href),
    page_referrer: cleanUrl(document.referrer),
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });
  const tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + settings.measurementId;
  document.head.appendChild(tag);

  // Several journal articles share one page. Count a visible article heading
  // separately after two seconds, without increasing the page-view total.
  if (!('IntersectionObserver' in window)) return;
  const visible = new Set();
  const recorded = new Set();
  const timers = new Map();
  function cancel(heading) {
    if (timers.has(heading)) window.clearTimeout(timers.get(heading));
    timers.delete(heading);
  }
  function start(heading) {
    const articleId = heading.dataset.analyticsArticle;
    if (document.hidden || recorded.has(articleId) || timers.has(heading)) return;
    timers.set(heading, window.setTimeout(function () {
      timers.delete(heading);
      if (document.hidden || !visible.has(heading) || recorded.has(articleId)) return;
      recorded.add(articleId);
      window.gtag('event', 'article_view', {
        article_id: articleId,
        article_title: heading.dataset.articleTitle,
        article_type: heading.dataset.articleType
      });
      observer.unobserve(heading);
      visible.delete(heading);
    }, 2000));
  }
  const observer = new window.IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
        visible.add(entry.target);
        start(entry.target);
      } else {
        visible.delete(entry.target);
        cancel(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-analytics-article]').forEach(function (heading) { observer.observe(heading); });
  document.addEventListener('visibilitychange', function () {
    visible.forEach(function (heading) {
      if (document.hidden) cancel(heading);
      else start(heading);
    });
  });
})();
