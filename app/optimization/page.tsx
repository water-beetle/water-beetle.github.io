// Ordinary links keep this static reading surface independent of client routing.
/* oxlint-disable next/no-html-link-for-pages */
import type { Metadata } from 'next';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { SiteHeader, SiteFooter } from '@/components/site-chrome';
import { optimizationPosts, optimizationHref } from '@/lib/optimization';

export const dynamic = 'force-static';
export const metadata: Metadata = {
  title: '최적화 기록 — Orbital Days',
  description: '복셀 생성부터 행성 이동, 식생, 기준계, 충돌과 지도까지. Comet의 최적화 과정을 실제 코드와 검증 기록으로 따라가는 트러블슈팅 연재.',
};

export default function OptimizationIndex() {
  return <div className="site-shell">
    <a href="#series" className="skip-link">최적화 연재로 바로가기</a>
    <SiteHeader active="optimization" />
    <main id="top" className="wrap optimization-home">
      <div className="optimization-intro">
        <p className="eyebrow">OPTIMIZATION JOURNAL</p>
        <h1>왜 느렸고,<br />어떻게 고쳤을까<span>.</span></h1>
        <p className="optimization-lead">행성을 만들고, 움직이고, 그 위에서 살아가기까지.<br />한 문제를 해결한 뒤 마주친 다음 문제를 코드와 함께 따라갑니다.</p>
        <a className="series-start" href={optimizationHref(optimizationPosts[0].slug)}>01편부터 읽기 <ArrowRight size={18} /></a>
      </div>
      <section id="series" aria-labelledby="series-title">
        <div className="series-heading"><h2 id="series-title">최적화 과정</h2><span>{optimizationPosts.length}편 · 순서대로 읽는 기록</span></div>
        <ol className="series-list">{optimizationPosts.map(post => <li key={post.slug}>
          <a className="series-row" href={optimizationHref(post.slug)}>
            <span className="chapter-number">{post.number}</span>
            <div><p className="chapter-topic">{post.topic}</p><h3>{post.title}</h3><p className="chapter-summary">{post.summary}</p></div>
            <ArrowUpRight className="chapter-arrow" size={22} aria-hidden="true" />
          </a>
        </li>)}</ol>
      </section>
      <aside className="series-context">
        <h2>이 기록을 읽는 기준</h2>
        <p>2026년 9월 8일까지의 소스, 변경 이력, 저장된 검증 보고서를 확인했습니다. 생성 구조부터 후속 문제로 이어지도록 학습 순서로 재구성했으며, 확인되지 않은 과거 증상이나 성능 수치는 만들어 넣지 않았습니다.</p>
        <p>각 편에서 실제 코드 발췌와 설명용 의사 코드를 구분합니다. 최신 구현 상태, 과거 측정 조건, 이번 글 작성 중 새로 실행하지 않은 검증도 각각 표시합니다.</p>
      </aside>
    </main>
    <SiteFooter />
  </div>;
}
