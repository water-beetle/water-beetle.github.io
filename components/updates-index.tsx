'use client';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { devlogs, media, formatDate, updateHref } from '@/lib/devlogs';
import { features, featureHref } from '@/lib/features';
import { SceneImage } from './story-stage';
import { SiteShell } from './site-chrome';
import { StoryLink, useStory } from './story-context';
export function UpdatesIndex() {
  const story = useStory();
  const index = Math.max(
    0,
    devlogs.findIndex((e) => e.slug === story.archive.selected),
  );
  const active = devlogs[index];
  return (
    <SiteShell>
      <div className="journal-terminal">
        <header className="terminal-heading">
          <p className="overline">HOME COMPUTER / DEVELOPMENT JOURNAL</p>
          <h1>작은 세계의 작업 기록.</h1>
          <p>만들고, 플레이하고, 다시 다듬은 이야기.</p>
        </header>
        <div className="terminal-controls">
          <span className="terminal-led" />
          <label htmlFor="record-date">기록 선택</label>
          <select
            id="record-date"
            value={active.slug}
            onChange={(e) => story.setArchive({ selected: e.target.value })}
          >
            {devlogs.map((entry) => (
              <option key={entry.slug} value={entry.slug}>
                {formatDate(entry.date)} · {entry.title}
              </option>
            ))}
          </select>
          <span className="terminal-page" aria-live="polite">
            {String(index + 1).padStart(2, '0')} /{' '}
            {String(devlogs.length).padStart(2, '0')}
          </span>
        </div>
        <article className="journal-page" key={active.slug}>
          <div className="journal-image">
            <SceneImage mediaKey={active.cover} />
            <small>{media[active.cover].caption}</small>
          </div>
          <div className="journal-text">
            <p className="overline">
              {active.category} /{' '}
              <time dateTime={active.date}>{formatDate(active.date)}</time>
            </p>
            <h2>{active.title}</h2>
            <p>{active.summary}</p>
            <StoryLink className="journal-open" href={updateHref(active.slug)}>
              기록 펼치기
              <ArrowUpRight size={18} />
            </StoryLink>
          </div>
        </article>
        <nav className="journal-pagination" aria-label="개발 기록 넘기기">
          <button
            disabled={index === 0}
            onClick={() =>
              story.setArchive({ selected: devlogs[index - 1].slug })
            }
          >
            <ArrowLeft size={16} /> 앞 기록
          </button>
          <span>한 장면씩, 조금 더 나은 게임으로.</span>
          <button
            disabled={index === devlogs.length - 1}
            onClick={() =>
              story.setArchive({ selected: devlogs[index + 1].slug })
            }
          >
            다음 기록 <ArrowRight size={16} />
          </button>
        </nav>
        <details className="journal-subjects">
          <summary>
            이 세계를 이루는 것들 <span>주제별 기록 찾기 ＋</span>
          </summary>
          <nav aria-label="주제별 구현 기록">
            {features.map((feature) => (
              <StoryLink key={feature.slug} href={featureHref(feature.slug)}>
                {feature.title}
                <ArrowUpRight size={14} />
              </StoryLink>
            ))}
          </nav>
        </details>
        <noscript>
          <style>
            {'.terminal-controls,.journal-pagination{display:none!important}'}
          </style>
          <nav aria-label="모든 개발 기록">
            {devlogs.map((entry) => (
              <p key={entry.slug}>
                <a href={updateHref(entry.slug)}>{entry.title} ↗</a>
              </p>
            ))}
          </nav>
        </noscript>
      </div>
    </SiteShell>
  );
}
