import { ArrowUpRight, ArrowUp, Orbit } from 'lucide-react';
import { googleAnalyticsDashboard, isGoogleAnalyticsConfigured } from '@/lib/site-integrations';
export function SiteHeader() {
 return <header className="site-header wrap"><a className="brand" href="/" aria-label="ORBITAL FALL 개발 기록 처음으로"><Orbit size={27} aria-hidden="true"/><span>ORBITAL FALL<small>개발 기록</small></span></a><nav aria-label="주 메뉴"><a href="/#features">구현한 기능</a><a href="/#progress">개발 현황</a><a className="github-link" href="https://github.com/water-beetle" target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={14} aria-hidden="true"/></a></nav></header>;
}
export function SiteFooter() {
 return <footer className="site-footer wrap"><div className="footer-main"><a className="footer-brand" href="/">ORBITAL FALL<span>작은 행성을 만드는 개발 기록</span></a><a href="#top" className="back-top">맨 위로 <ArrowUp size={16} aria-hidden="true"/></a></div><div className="footer-bottom"><p>© {new Date().getFullYear()} water-beetle · Unreal Engine 프로젝트</p><div>{isGoogleAnalyticsConfigured() && <a href={googleAnalyticsDashboard} target="_blank" rel="noopener noreferrer">방문 통계 · 관리자 <ArrowUpRight size={12}/></a>}<details className="privacy-note"><summary>통계와 댓글 안내</summary><p>방문 통계는 Google Analytics를 사용합니다. DNT 또는 GPC 설정이 켜져 있으면 통계 태그를 실행하지 않으며, 이름·이메일·GitHub 계정 정보를 추가 전송하지 않습니다. 댓글은 giscus와 GitHub Discussions를 사용합니다. <a href="https://policies.google.com/technologies/partner-sites?hl=ko" target="_blank" rel="noopener noreferrer">Google 데이터 처리 안내</a></p></details></div></div></footer>;
}
