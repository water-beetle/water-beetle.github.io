// Ordinary links keep this static reading surface independent of client routing.
/* oxlint-disable next/no-html-link-for-pages */
import type { Metadata } from 'next';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { SiteHeader, SiteFooter } from '@/components/site-chrome';
import { optimizationPosts, optimizationHref } from '@/lib/optimization';

export const dynamic = 'force-static';
export const metadata: Metadata = {
  title: '최적화 기록 — Orbital Days',
  description: 'Comet의 복셀 생성, 행성 이동, 충돌과 GPU 비용을 조사하고 수정한 기록. 코드와 당시 측정 결과를 함께 남깁니다.',
};

export default function OptimizationIndex() {
  return <div className="site-shell">
    <a href="#series" className="skip-link">최적화 연재로 바로가기</a>
    <SiteHeader active="optimization" />
    <main id="top" className="wrap optimization-home">
      <div className="optimization-intro">
        <h1>최적화 메모</h1>
        <p className="optimization-lead">복셀 지형과 움직이는 행성을 만들면서 생긴 성능 문제들.<br />수정한 코드와 당시 측정 결과를 모았다.</p>
        <div className="series-actions">
          <a className="series-start" href={optimizationHref(optimizationPosts[0].slug)}>01편부터 읽기 <ArrowRight size={18} /></a>
          <a className="series-start" href={optimizationHref('shared-world-work-budget')}>9월 9일 추가 작업 <ArrowRight size={18} /></a>
        </div>
      </div>
      <section id="series" aria-labelledby="series-title">
        <div className="series-heading"><h2 id="series-title">목록</h2><span>{optimizationPosts.length}편 · 2026.09.08–09.09 작업</span></div>
        <ol className="series-list">{optimizationPosts.map(post => <li key={post.slug}>
          <a className="series-row" href={optimizationHref(post.slug)}>
            <span className="chapter-number">{post.number}</span>
            <div><p className="chapter-topic">{post.topic}</p><h3>{post.title}</h3><p className="chapter-summary">{post.summary}</p></div>
            <ArrowUpRight className="chapter-arrow" size={22} aria-hidden="true" />
          </a>
        </li>)}</ol>
      </section>
      <aside className="series-context">
        <h2>측정 시점</h2>
        <p>01~09편은 9월 8일, 10~14편은 9월 9일 기록이다. 수치는 당시 빌드와 화면 크기에서 나온 결과이며 최신 게임 성능을 뜻하지 않는다. 14편의 1440p 왕복 목표는 미달 상태다.</p>
      </aside>
    </main>
    <SiteFooter />
  </div>;
}
