// Ordinary links intentionally load GitHub Pages directory indexes without client routing.
/* oxlint-disable next/no-html-link-for-pages */
import { ArrowUpRight, Orbit } from 'lucide-react';
import { googleAnalyticsDashboard, isGoogleAnalyticsConfigured } from '@/lib/site-integrations';

export function SiteHeader({ active = 'journal' }: { active?: 'journal' | 'optimization' }) {
  return (
    <header className="site-header wrap">
      <a href="/" className="brand" aria-label="Orbital Days, 처음으로">
        <Orbit size={32} aria-hidden="true" />
        <strong>Orbital Days<span className="brand-separator"> / </span><span className="brand-note">개발 노트</span></strong>
      </a>
      <nav aria-label="주 메뉴">
        <a href="/#journal" className={active === 'journal' ? 'active' : undefined} aria-current={active === 'journal' ? 'page' : undefined}>개발일지</a>
        <a href="/optimization/" className={active === 'optimization' ? 'active' : undefined} aria-current={active === 'optimization' ? 'page' : undefined}>최적화 메모</a>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return <footer className="site-footer wrap">
    <span>Orbital Days · 개발 노트</span>
    <div className="footer-links">{isGoogleAnalyticsConfigured() && <a href={googleAnalyticsDashboard} target="_blank" rel="noopener noreferrer">방문 통계 · 관리자 <ArrowUpRight size={14} aria-hidden="true" /></a>}<a href="#top">맨 위로 ↑</a></div>
    <details className="privacy-note"><summary>방문 통계·댓글 안내</summary>
      <p>이 블로그는 Google Analytics를 사용해 조회수, 방문 경로, 기기 종류와 이용 시간을 파악합니다. 방문 구분에 쿠키가 사용될 수 있으며, 통계는 관리자만 확인합니다. 이름·이메일·GitHub 계정 정보를 통계에 추가로 보내지 않습니다. 브라우저의 추적 거부(DNT) 또는 GPC 설정이 켜져 있으면 통계 태그를 실행하지 않습니다.</p>
      <p><a href="https://policies.google.com/technologies/partner-sites?hl=ko" target="_blank" rel="noopener noreferrer">Google의 데이터 처리 안내</a> · <a href="https://tools.google.com/dlpage/gaoptout?hl=ko" target="_blank" rel="noopener noreferrer">Google Analytics 수집 거부 도구</a></p>
      <p>댓글 창은 giscus에서 제공하며 댓글과 GitHub 프로필은 공개 저장소의 Discussions에 표시됩니다. 댓글은 GitHub에서 수정·삭제할 수 있습니다.</p>
    </details>
  </footer>;
}
