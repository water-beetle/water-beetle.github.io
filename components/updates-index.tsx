'use client';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@astryxdesign/core/Button';
import { devlogs, media, formatDate, updateHref } from '@/lib/devlogs';
import { SceneImage } from './story-stage';
import { SiteShell } from './site-chrome';
import { StoryLink, useStory } from './story-context';
export function UpdatesIndex() {
  const story = useStory();
  const { filter, order, selected } = story.archive;
  const options = ['전체', ...new Set(devlogs.map((e) => e.category))];
  const entries = devlogs
    .filter((e) => filter === '전체' || e.category === filter)
    .sort((a, b) =>
      order === 'oldest'
        ? a.date.localeCompare(b.date)
        : b.date.localeCompare(a.date),
    );
  const active = entries.find((e) => e.slug === selected) || entries[0];
  return (
    <SiteShell>
      <header className="archive-heading">
        <p className="overline">FIELD NOTES / ORBITAL FALL</p>
        <h1>
          만들고, 플레이하고,
          <br />
          <em>다시 다듬는 기록.</em>
        </h1>
        <p>큰 변화도, 작은 디테일도. 실제 게임 화면과 함께 남깁니다.</p>
      </header>
      <div className="filter-bar" aria-label="개발 기록 필터">
        {options.map((option) => (
          <Button
            key={option}
            label={option}
            size="sm"
            variant={filter === option ? 'primary' : 'ghost'}
            aria-pressed={filter === option}
            onClick={() => story.setArchive({ filter: option })}
          />
        ))}
        <label>
          날짜순
          <select
            value={order}
            onChange={(event) =>
              story.setArchive({
                order: event.target.value as 'oldest' | 'newest',
              })
            }
          >
            <option value="newest">최신순</option>
            <option value="oldest">오래된 순</option>
          </select>
        </label>
      </div>
      <div className="archive-layout">
        {active && (
          <aside className="archive-preview" aria-label="선택한 기록 미리보기">
            <div className="archive-photo">
              <SceneImage mediaKey={active.cover} />
            </div>
            <p className="overline">{active.eyebrow}</p>
            <h2>{active.title}</h2>
            <p>{active.summary}</p>
            <small>{media[active.cover].caption}</small>
            <StoryLink className="solid-link" href={updateHref(active.slug)}>
              이 기록 읽기 <ArrowUpRight size={16} />
            </StoryLink>
          </aside>
        )}
        <section className="archive-timeline" aria-label="날짜별 개발 기록">
          <p className="result-count" aria-live="polite">
            {entries.length}개의 기록
          </p>
          {entries.map((entry) => (
            <article
              key={entry.slug}
              className={
                entry.slug === active?.slug
                  ? 'timeline-entry selected'
                  : 'timeline-entry'
              }
            >
              <div className="timeline-date">
                <i />
                <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                <span>{entry.category}</span>
              </div>
              <button
                className="preview-action"
                onClick={() => story.setArchive({ selected: entry.slug })}
                aria-pressed={entry.slug === active?.slug}
                aria-label={entry.title + ' 장면 미리보기'}
              >
                <img
                  src={media[entry.cover].thumbnail}
                  alt=""
                  width={112}
                  height={63}
                  loading="lazy"
                />
                <span>장면 미리보기</span>
              </button>
              <h2>
                <StoryLink href={updateHref(entry.slug)}>
                  {entry.title}
                  <ArrowUpRight size={17} />
                </StoryLink>
              </h2>
              <p>{entry.summary}</p>
              <StoryLink className="story-link" href={updateHref(entry.slug)}>
                기록 읽기 <ArrowUpRight size={14} />
              </StoryLink>
            </article>
          ))}
          {!entries.length && (
            <p className="empty-state">
              이 주제의 기록은 아직 없습니다. 다른 주제를 선택해 보세요.
            </p>
          )}
        </section>
      </div>
    </SiteShell>
  );
}
