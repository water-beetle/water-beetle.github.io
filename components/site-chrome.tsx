'use client';
import { useState, type ReactNode } from 'react';
import { Orbit, ArrowUpRight, Menu, X } from 'lucide-react';
import { Button } from '@astryxdesign/core/Button';
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="ORBITAL FALL 홈">
        <Orbit size={27} strokeWidth={1.3} />
        <span>
          ORBITAL FALL<small>DEVELOPMENT JOURNAL</small>
        </span>
      </a>
      <button
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="main-nav"
        onClick={() => setOpen(!open)}
        aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
      >
        {open ? <X /> : <Menu />}
      </button>
      <nav
        id="main-nav"
        className={open ? 'nav-links is-open' : 'nav-links'}
        aria-label="주 메뉴"
      >
        <a href="/#journey" onClick={() => setOpen(false)}>
          플레이 과정
        </a>
        <a href="/updates/" onClick={() => setOpen(false)}>
          개발 기록
        </a>
        <a href="/#features" onClick={() => setOpen(false)}>
          게임 속 세계
        </a>
        <a
          className="github-link"
          href="https://github.com/water-beetle"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub <ArrowUpRight size={14} />
        </a>
      </nav>
      <span className="dev-status">개발 중</span>
    </header>
  );
}
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <a className="brand" href="/">
        <Orbit size={23} strokeWidth={1.3} />
        <span>
          ORBITAL FALL<small>A SMALL WORLD. A BIG JOURNEY.</small>
        </span>
      </a>
      <p>작은 행성에서 만들어 가는, 조금씩 더 큰 이야기.</p>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} water-beetle</span>
        <a
          href="https://github.com/water-beetle"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub ↗
        </a>
        <a href="#top">맨 위로 ↑</a>
      </div>
      <details className="privacy-note">
        <summary>방문 통계와 댓글 안내</summary>
        <p>
          Google Analytics 방문 통계는 DNT·GPC 설정을 존중합니다. URL 쿼리와
          해시, 이름·이메일은 추가 전송하지 않습니다. 댓글은 기존 GitHub
          Discussions와 giscus를 사용합니다.
        </p>
      </details>
    </footer>
  );
}
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div id="top" className="space-shell">
      <a className="skip-link" href="#main">
        본문으로 이동
      </a>
      <SiteHeader />
      <noscript>
        <style>
          {
            '@media(max-width:767px){.site-header{height:auto;min-height:79px;flex-wrap:wrap;padding-block:18px;gap:16px}.nav-toggle,.dev-status{display:none}.nav-links{display:flex!important;position:static!important;width:100%;flex-direction:row;flex-wrap:wrap;gap:16px;padding:0;border:0;background:transparent}.nav-links a{min-height:44px;display:flex;align-items:center}}.planet-hint button{display:none!important}'
          }
        </style>
      </noscript>
      <main id="main">{children}</main>
      <SiteFooter />
    </div>
  );
}
export function BackHome() {
  return (
    <Button
      label="플레이 과정으로 돌아가기"
      href="/#journey"
      variant="secondary"
    />
  );
}
