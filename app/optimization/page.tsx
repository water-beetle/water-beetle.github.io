// Ordinary links keep this static reading surface independent of client routing.
/* oxlint-disable next/no-html-link-for-pages */
import type { Metadata } from 'next';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { SiteHeader, SiteFooter } from '@/components/site-chrome';
import { optimizationPosts, optimizationHref } from '@/lib/optimization';

export const dynamic = 'force-static';
export const metadata: Metadata = {
  title: '최적화 기록 — Orbital Days',
  description: '복셀 생성부터 행성 이동, 충돌 재사용, GPU 메모리와 1440p TSR까지. Comet의 최적화 과정을 쉬운 예시와 실제 검증 기록으로 따라가는 14편의 연재.',
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
        <div className="series-actions">
          <a className="series-start" href={optimizationHref(optimizationPosts[0].slug)}>01편부터 읽기 <ArrowRight size={18} /></a>
          <a className="series-start" href={optimizationHref('shared-world-work-budget')}>추가 최적화 · 10편부터 읽기 <ArrowRight size={18} /></a>
        </div>
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
        <p>01~09편은 2026년 9월 8일의 조사 기록을 바탕으로 작성했습니다. 10~14편은 9월 9일에 추가한 공통 작업 예산, 충돌 재사용, 경로별 준비, 그래픽 자원 관리와 1440p 검증을 이어서 설명합니다. 일상적인 예시부터 원리, 코드와 실제 결과 순서로 읽을 수 있습니다.</p>
        <p>실제 코드와 설명용 계산을 구분하고 측정한 화면 크기·실행 조건을 함께 적었습니다. 과거 수치는 그대로 보존하며, 14편의 1440p 왕복 목표와 최신 수정의 재검증은 진행 중인 상태로 기록합니다. 글 작성 중 Unreal 검사를 새로 실행하지 않았습니다.</p>
      </aside>
    </main>
    <SiteFooter />
  </div>;
}
