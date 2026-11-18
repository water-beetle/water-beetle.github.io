'use client';
import { useState } from 'react';
import { ArrowUpRight, ArrowLeft } from 'lucide-react';
import { Button } from '@astryxdesign/core/Button';
import { SiteShell } from './site-chrome';
import { StoryLink } from './story-context';
import { Gallery } from './gallery';
import { ArticleComments } from './article-comments';
import { media, formatDate, updateHref, type DevlogEntry } from '@/lib/devlogs';
export function DevlogArticle({
  entry,
  next,
}: {
  entry: DevlogEntry;
  next: DevlogEntry;
}) {
  const [comparison, setComparison] = useState<'before' | 'after'>('after');
  const cover = media[entry.cover];
  const pair = entry.comparison;
  const compared = pair ? media[pair[comparison]] : null;
  return (
    <SiteShell>
      <article className="article-page">
        <StoryLink className="story-link" href="/updates/">
          <ArrowLeft size={14} />
          개발 기록실
        </StoryLink>
        <header className="article-header">
          <p className="overline">{entry.eyebrow}</p>
          <h1
            data-analytics-article={'devlog/' + entry.slug}
            data-article-title={entry.title}
            data-article-type="devlog"
          >
            {entry.title}
          </h1>
          <p className="article-summary">{entry.summary}</p>
          <div className="article-meta">
            <time dateTime={entry.date}>{formatDate(entry.date)}</time>
            <span>{entry.category}</span>
            <span>약 {entry.readingMinutes}분</span>
          </div>
        </header>
        <figure className="article-cover">
          <img
            src={cover.src}
            alt={cover.alt}
            width={cover.width}
            height={cover.height}
            fetchPriority="high"
          />
          <figcaption>{cover.caption}</figcaption>
        </figure>
        <div className="article-body">
          {entry.sections.map((section, i) => (
            <section key={section.title} className="article-section">
              <span className="section-index">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h2>{section.title}</h2>
              {section.text.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {section.media && (
                <Gallery media={[media[section.media]]} title={section.title} />
              )}
            </section>
          ))}
          {pair && compared && (
            <section className="comparison-section">
              <p className="overline">BEFORE / AFTER</p>
              <h2>어떻게 달라졌을까요?</h2>
              <div className="compare-controls" aria-label="전후 사진 선택">
                <Button
                  label="이전 배치"
                  aria-pressed={comparison === 'before'}
                  variant={comparison === 'before' ? 'primary' : 'secondary'}
                  onClick={() => setComparison('before')}
                />
                <Button
                  label="현재 배치"
                  aria-pressed={comparison === 'after'}
                  variant={comparison === 'after' ? 'primary' : 'secondary'}
                  onClick={() => setComparison('after')}
                />
              </div>
              <figure aria-live="polite">
                <img
                  src={compared.src}
                  alt={compared.alt}
                  width={compared.width}
                  height={compared.height}
                  loading="lazy"
                />
                <figcaption>{compared.caption}</figcaption>
              </figure>
              <p className="comparison-note">{pair.note}</p>
              <noscript>
                <figure>
                  <img
                    src={media[pair.before].src}
                    alt={media[pair.before].alt}
                    width={media[pair.before].width}
                    height={media[pair.before].height}
                    loading="lazy"
                  />
                  <figcaption>{media[pair.before].caption}</figcaption>
                </figure>
                <style>{'.compare-controls{display:none}'}</style>
              </noscript>
            </section>
          )}
          <aside className="next-note">
            <p className="overline">WHAT COMES NEXT</p>
            <p>{entry.next}</p>
          </aside>
          <nav className="article-next" aria-label="다음 기록">
            <StoryLink className="story-link" href={updateHref(next.slug)}>
              다음 기록: {next.title}
              <ArrowUpRight size={17} />
            </StoryLink>
          </nav>
          <ArticleComments
            articleId={'devlog-' + entry.slug}
            articlePath={updateHref(entry.slug)}
          />
        </div>
      </article>
    </SiteShell>
  );
}
