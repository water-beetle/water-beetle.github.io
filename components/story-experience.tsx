'use client';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { StoryProvider } from './story-context';
import { WorldBackdrop } from './world-explorer';
import { SiteHeader } from './site-chrome';
export function StoryExperience({ children }: { children: ReactNode }) {
  const home = (usePathname() || '/') === '/';
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
        {!home && <WorldBackdrop />}
        <main id="main">{children}</main>
      </div>
    </StoryProvider>
  );
}
