'use client';
import { useEffect } from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { chapters } from '@/lib/story';
import { media, devlogs, formatDate, updateHref } from '@/lib/devlogs';
import { features, featureHref } from '@/lib/features';
import { useStory, StoryLink } from './story-context';
import { MobileChapter } from './story-stage';
import { SiteFooter } from './site-chrome';
export function Showcase() {
  const story = useStory();
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const entry = visible[0];
        if (entry) {
          const chapter = chapters.find(
            (c) => 'step-' + c.id === entry.target.id,
          );
          if (chapter) story.setChapter(chapter.id);
        }
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: 0 },
    );
    document
      .querySelectorAll('[data-story-chapter]')
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return (
    <>
      <h1 className="sr-only">
        ORBITAL FALL — 실제 게임 화면으로 따라가는 첫 제작대와 채굴 드론
      </h1>
      <div id="journey" className="story-track">
        {chapters.map((chapter) => (
          <section
            key={chapter.id}
            id={'step-' + chapter.id}
            className="chapter-trigger"
            data-story-chapter
            aria-labelledby={'heading-' + chapter.id}
          >
            <MobileChapter chapter={chapter} />
            <div className="chapter-document">
              <span>{chapter.number} / 06</span>
              <h2 id={'heading-' + chapter.id}>
                {chapter.title.replace('\n', ' ')}
              </h2>
              <p>{chapter.description}</p>
              <p>{chapter.fact}</p>
              <noscript>
                {chapter.frames.map((frame) => (
                  <figure key={frame.id}>
                    <img
                      src={media[frame.media].src}
                      alt={media[frame.media].alt}
                      width={media[frame.media].width}
                      height={media[frame.media].height}
                      loading="lazy"
                    />
                    <figcaption>
                      {frame.label} — {frame.note} {media[frame.media].caption}
                    </figcaption>
                  </figure>
                ))}
              </noscript>
              <noscript>
                <a href={updateHref(chapter.article)}>
                  이 장면의 개발 기록 읽기
                </a>
              </noscript>
            </div>
          </section>
        ))}
      </div>
      <section className="story-outro" id="updates">
        <div className="outro-intro">
          <span className="overline">THE STORY CONTINUES</span>
          <h2>조금씩, 다음 장면으로.</h2>
          <p>
            플레이를 연결하고, 손에 익는 경험을 다듬습니다.
            <br />
            지금의 게임이 만들어지는 과정을 기록합니다.
          </p>
          <StoryLink className="story-link" href="/updates/">
            개발 기록실 열기 <ArrowUpRight size={17} />
          </StoryLink>
        </div>
        <div className="latest-log">
          {devlogs.slice(0, 3).map((entry, i) => (
            <StoryLink
              href={updateHref(entry.slug)}
              className="latest-row"
              key={entry.slug}
            >
              <span className="log-index">
                {String(i + 1).padStart(2, '0')}
              </span>
              <img
                src={media[entry.cover].thumbnail}
                alt={media[entry.cover].alt}
                width={160}
                height={90}
                loading="lazy"
              />
              <div>
                <span>
                  {formatDate(entry.date)} / {entry.category}
                </span>
                <h3>{entry.title}</h3>
                <p>{entry.summary}</p>
              </div>
              <ArrowUpRight size={22} />
            </StoryLink>
          ))}
        </div>
        <section className="implemented-section" id="features">
          <div>
            <p className="overline">BEHIND THE SCENES</p>
            <h2>이 세계를 이루는 것들.</h2>
            <p>현재의 시작 흐름과, 그 뒤에서 다듬어 온 구현 기록.</p>
          </div>
          <div className="feature-list">
            {features.map((feature) => (
              <StoryLink key={feature.slug} href={featureHref(feature.slug)}>
                <span>{feature.number}</span>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.status}</p>
                </div>
                <ArrowUpRight size={17} />
              </StoryLink>
            ))}
          </div>
        </section>
        <section id="progress" className="progress-note">
          <p className="overline">WHAT COMES NEXT</p>
          <h2>첫 기체 다음에는, 첫 공장.</h2>
          <p>
            지금은 간이 제작대 건설과 첫 연구, 드론 조립·수령까지 이어집니다.
            <br />
            드론 전개·동력·자동 채굴에서 공장 생산과 우주선 성장으로 나아갑니다.
          </p>
          <StoryLink href="/updates/first-mining-drone/" className="story-link">
            현재 진행과 남은 작업 <ArrowRight size={17} />
          </StoryLink>
        </section>
        <SiteFooter />
      </section>
    </>
  );
}
