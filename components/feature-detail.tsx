'use client';
import { ArrowUpRight, Check } from 'lucide-react';
import { SiteShell } from './site-chrome';
import { StoryLink } from './story-context';
import { Gallery } from './gallery';
import { ArticleComments } from './article-comments';
import { featureHref, type Feature } from '@/lib/features';
export function FeatureDetail({
  feature,
  next,
}: {
  feature: Feature;
  next: Feature;
}) {
  return (
    <SiteShell>
      <article id="article-content" className="article-page feature-page">
        <StoryLink href="/#features" className="story-link">
          만들어 온 것들 <ArrowUpRight size={14} />
        </StoryLink>
        <header className="article-header">
          <p className="overline">
            {feature.number} / {feature.english}
          </p>
          <h1
            data-analytics-article={'feature/' + feature.slug}
            data-article-title={feature.title}
            data-article-type="feature"
          >
            {feature.title}
          </h1>
          <p className="article-summary">{feature.summary}</p>
          <div className="article-meta">
            <span>{feature.status}</span>
            <span>실제 화면 {feature.media.length}장</span>
            <span>최근 관련 기록 {feature.date}</span>
          </div>
        </header>
        <section className="feature-facts">
          <h2>구현한 내용</h2>
          <ul>
            {feature.points.map((point) => (
              <li key={point}>
                <Check size={15} />
                {point}
              </li>
            ))}
          </ul>
        </section>
        <section className="feature-gallery" aria-labelledby="screens-title">
          <h2 id="screens-title">실제 게임 화면</h2>
          <p>사진을 누르면 원본을 크게 볼 수 있습니다.</p>
          <Gallery media={feature.media} title={feature.title} />
        </section>
        <section className="feature-validation">
          <p className="overline">WHAT WE VERIFIED</p>
          <h2>확인한 범위</h2>
          <p>{feature.result}</p>
          <h3>현재 범위와 남은 작업</h3>
          <p>{feature.limit}</p>
        </section>
        <nav className="article-next" aria-label="다른 구현">
          <StoryLink className="story-link" href={featureHref(next.slug)}>
            다음 기록: {next.title}
            <ArrowUpRight size={16} />
          </StoryLink>
        </nav>
        <ArticleComments
          articleId={'feature-' + feature.slug}
          articlePath={featureHref(feature.slug)}
        />
      </article>
    </SiteShell>
  );
}
