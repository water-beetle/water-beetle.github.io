'use client';
import { useEffect, type ReactNode } from 'react';
import { ArrowLeft, ArrowUpRight, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { StoryLink, useStory } from './story-context';
import { devlogs } from '@/lib/devlogs';
import { featureChapters } from '@/lib/story';
export function SiteHeader() {
  const path = usePathname() || '/';
  return (
    <header className="site-header">
      <StoryLink
        href="/#scene=clearing&shot=arrival"
        className="brand"
        aria-label="ORBITAL FALL 첫 장면"
      >
        <span className="brand-symbol" aria-hidden="true" />
        <span>
          ORBITAL<span className="brand-light">FALL</span>
          <small>A GAME IN THE MAKING</small>
        </span>
      </StoryLink>
      <nav aria-label="주 메뉴">
        <StoryLink
          href="/#scene=clearing&shot=arrival"
          aria-current={path === '/' ? 'page' : undefined}
        >
          작은 세계로
        </StoryLink>
        <StoryLink
          href="/updates/"
          aria-current={path.startsWith('/updates') ? 'page' : undefined}
        >
          개발 기록{' '}
          <span className="nav-count">
            {String(devlogs.length).padStart(2, '0')}
          </span>
        </StoryLink>
      </nav>
      <span className="header-status">
        <i />
        개발 중인 게임
      </span>
    </header>
  );
}
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>© {new Date().getFullYear()} water-beetle · ORBITAL FALL</span>
      <div>
        <a
          href="https://github.com/water-beetle"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub ↗
        </a>
        <a href="#top">맨 위로 ↑</a>
      </div>
      <details>
        <summary>방문 통계와 댓글 안내</summary>
        <p>
          Google Analytics는 DNT·GPC 설정을 존중합니다. URL 쿼리와 해시,
          이름·이메일은 추가 전송하지 않습니다. 댓글은 GitHub Discussions와
          giscus를 사용합니다.
        </p>
      </details>
    </footer>
  );
}
export function SiteShell({ children }: { children: ReactNode }) {
  const path = usePathname() || '/';
  const story = useStory();
  const chapter =
    devlogs.find((p) => path.includes('/updates/' + p.slug))?.chapterId ||
    featureChapters[path.split('/')[2]] ||
    (/^\/updates\/?$/.test(path) ? 'research' : undefined);
  const archive = /^\/updates\/?$/.test(path);
  useEffect(() => {
    if (path === '/') return;
    const escape = (e: KeyboardEvent) => {
      if (
        e.key === 'Escape' &&
        !e.defaultPrevented &&
        !document.querySelector('[role="dialog"][aria-modal="true"]')
      )
        story.closeRecord(chapter);
    };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [path, story.returnPoint, chapter]);
  if (path === '/') return <>{children}</>;
  return (
    <section
      className={archive ? 'reader-panel archive-panel' : 'reader-panel'}
      aria-label={archive ? '개발 기록실' : '개발 기록 읽기'}
    >
      <div className="reader-bar">
        <a
          className="reader-return"
          href={'/#step-' + (chapter || story.chapter)}
          onClick={(event) => {
            if (
              event.button === 0 &&
              !event.metaKey &&
              !event.ctrlKey &&
              !event.shiftKey &&
              !event.altKey
            ) {
              event.preventDefault();
              story.closeRecord(chapter);
            }
          }}
        >
          <ArrowLeft size={15} />
          {story.returnPoint ? '보던 화면으로' : '플레이 장면으로'}
        </a>
        <span>
          ORBITAL FALL / {archive ? 'FIELD NOTES' : 'DEVELOPMENT RECORD'}
        </span>
        <a
          className="close-reader"
          href={'/#step-' + (chapter || story.chapter)}
          onClick={(event) => {
            if (
              event.button === 0 &&
              !event.metaKey &&
              !event.ctrlKey &&
              !event.shiftKey &&
              !event.altKey
            ) {
              event.preventDefault();
              story.closeRecord(chapter);
            }
          }}
          aria-label="기록창 닫기"
        >
          <X size={19} />
        </a>
      </div>
      <div className="reader-content">{children}</div>
      <SiteFooter />
    </section>
  );
}
export function BackHome() {
  return (
    <StoryLink className="solid-link" href="/#step-home">
      플레이 과정으로 돌아가기 <ArrowUpRight size={16} />
    </StoryLink>
  );
}
