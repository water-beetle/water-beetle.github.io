'use client';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { StoryProvider } from './story-context';
import { StoryStage, ChapterNav } from './story-stage';
import { SiteHeader } from './site-chrome';
export function StoryExperience({ children }: { children: ReactNode }) {
  const path = usePathname() || '/';
  const home = path === '/';
  return (
    <StoryProvider>
      <div
        id="top"
        className={home ? 'experience is-home' : 'experience is-reading'}
      >
        <a className="skip-link" href="#main">
          본문으로 이동
        </a>
        <SiteHeader />
        <StoryStage />
        <main id="main">{children}</main>
        {home && <ChapterNav />}
        <noscript>
          <style>
            {
              '.story-stage,.chapter-rail,.scene-only,.preview-action,.mobile-chapter{display:none!important}.chapter-trigger{height:auto!important;padding:42px 0!important}.chapter-document{display:block!important;position:static!important;clip-path:none!important;width:auto!important;height:auto!important;overflow:visible!important;white-space:normal!important}.chapter-document img{display:block!important}.story-track{padding:60px 20px!important}.site-header{position:relative!important}.reader-panel{margin-top:20px!important}.filter-bar{display:none!important}.story-outro{margin-top:0!important}.experience{background:#101213!important}'
            }
          </style>
        </noscript>
      </div>
    </StoryProvider>
  );
}
