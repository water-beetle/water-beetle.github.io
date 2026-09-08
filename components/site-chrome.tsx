// Ordinary links intentionally load GitHub Pages directory indexes without client routing.
/* oxlint-disable next/no-html-link-for-pages */
import { ArrowUpRight, Orbit } from 'lucide-react';

export function SiteHeader({ active = 'journal' }: { active?: 'journal' | 'optimization' }) {
  return (
    <header className="site-header wrap">
      <a href="/" className="brand" aria-label="Orbital Days, 처음으로">
        <span className="brand-icon"><Orbit size={30} strokeWidth={1.35} /></span>
        <span><strong>Orbital Days</strong><small>SPACE LIFE SIM / DEVLOG</small></span>
      </a>
      <nav aria-label="주 메뉴">
        <a href="/#journal" className={active === 'journal' ? 'active' : undefined} aria-current={active === 'journal' ? 'page' : undefined}>개발일지</a>
        <a href="/optimization/" className={active === 'optimization' ? 'active' : undefined} aria-current={active === 'optimization' ? 'page' : undefined}>최적화</a>
        <a href="/#about">게임 소개 <ArrowUpRight size={14} /></a>
      </nav>
      <span className="header-note"><i /> 우주 생활 시뮬레이터</span>
    </header>
  );
}

export function SiteFooter() {
  return <footer className="site-footer wrap"><span><Orbit size={18} /> ORBITAL DAYS</span><p>어제보다 조금 더 넓어진 우주.</p><a href="#top">맨 위로 ↑</a></footer>;
}
