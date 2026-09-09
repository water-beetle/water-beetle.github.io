// Directory links use browser navigation; overflow regions need keyboard focus
// so readers can scroll code and wide tables without a pointing device.
/* oxlint-disable next/no-html-link-for-pages, jsx-a11y/no-noninteractive-tabindex */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SiteHeader, SiteFooter } from '@/components/site-chrome';
import { optimizationPosts, optimizationHref } from '@/lib/optimization';
import type { ArticleBlock } from '@/lib/optimization/types';
import { ArticleComments } from '@/components/article-comments';

export const dynamic = 'force-static';
export const dynamicParams = false;
export function generateStaticParams() {
  return optimizationPosts.map(post => ({ slug: post.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = optimizationPosts.find(entry => entry.slug === slug);
  if (!post) return { title: '기록을 찾을 수 없습니다 — Orbital Days' };
  return { title: `${post.number}. ${post.title} — Orbital Days`, description: post.summary };
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.kind) {
    case 'paragraph': return <p>{block.text}</p>;
    case 'code': return <figure className="article-code"><figcaption>{block.label}</figcaption><pre tabIndex={0} aria-label={block.label}><code>{block.code}</code></pre>{block.source && <p className="code-source">{block.source}</p>}</figure>;
    case 'note': return <aside className="article-note"><h4>{block.title}</h4><p>{block.text}</p></aside>;
    case 'list': return <ul className="article-list">{block.items.map(item => <li key={item}>{item}</li>)}</ul>;
    case 'flow': return <figure className="article-flow"><figcaption>{block.label}</figcaption><ol>{block.steps.map(step => <li key={step}>{step}</li>)}</ol></figure>;
    case 'table': return <section className="article-table" aria-label={block.caption} tabIndex={0}><table><caption>{block.caption}</caption><thead><tr>{block.columns.map(column => <th key={column} scope="col">{column}</th>)}</tr></thead><tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => cellIndex === 0 ? <th scope="row" key={cellIndex}>{cell}</th> : <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></section>;
  }
}

export default async function OptimizationArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = optimizationPosts.findIndex(post => post.slug === slug);
  if (index < 0) notFound();
  const post = optimizationPosts[index];
  const previous = optimizationPosts[index - 1];
  const next = optimizationPosts[index + 1];
  return <div className="site-shell">
    <a href="#article-content" className="skip-link">본문으로 바로가기</a>
    <SiteHeader active="optimization" />
    <main id="top" className="wrap optimization-reader">
      <a className="back-to-series" href="/optimization/"><ArrowLeft size={16} /> 최적화 기록 전체 보기</a>
      <header className="article-header">
        <p className="eyebrow">OPTIMIZATION {post.number} / {String(optimizationPosts.length).padStart(2, '0')}</p>
        <p className="chapter-topic">{post.topic}</p>
        <h1 data-analytics-article={'optimization/' + post.slug} data-article-title={post.title} data-article-type="optimization">{post.title}</h1><p className="optimization-lead">{post.summary}</p>
        <p className="article-date">2026.09.08 작성{post.updatedDate && <> · {post.updatedDate} 보완</>} · 소스와 보관된 검증 기록 기준</p>
      </header>
      <div className="reader-grid">
        <aside className="article-toc" aria-label="이 글의 목차"><h2>이 글의 흐름</h2><ol>{post.sections.map(section => <li key={section.id}><a href={'#' + section.id}>{section.title}</a></li>)}</ol><a className="toc-series-link" href="/optimization/">전체 {optimizationPosts.length}편 목차 ↗</a></aside>
        <article id="article-content" className="optimization-article">
          <div className="article-premise"><div><span>출발한 문제</span><p>{post.startingPoint}</p></div><div><span>이번 편의 변화</span><p>{post.result}</p></div></div>
          {post.sections.map(section => <section id={section.id} key={section.id}><h2>{section.title}</h2>{section.blocks.map((block, blockIndex) => <Block block={block} key={blockIndex} />)}</section>)}
          <section className="article-sources" aria-labelledby="sources-title"><h2 id="sources-title">코드와 확인 자료</h2><p>프로젝트 파일명은 Comet 소스 모듈 기준입니다. 수치가 있는 편은 공개용 발췌 자료에서 측정 조건을 함께 확인할 수 있습니다.</p><ul>{post.sources.map(source => <li key={source.label}><strong>{source.href ? <a href={source.href}>{source.label} ↗</a> : source.label}</strong><p>{source.detail}</p></li>)}</ul></section>
          <ArticleComments articleId={post.slug} articlePath={optimizationHref(post.slug)} />
          <nav className="article-pagination" aria-label="연재 이어 읽기">
            {previous ? <a href={optimizationHref(previous.slug)}><span><ArrowLeft size={15} /> 이전 · {previous.number}편</span><strong>{previous.title}</strong></a> : <a href="/optimization/"><span><ArrowLeft size={15} /> 연재 목차</span><strong>전체 흐름 살펴보기</strong></a>}
            {next ? <a href={optimizationHref(next.slug)}><span>다음 · {next.number}편 <ArrowRight size={15} /></span><strong>{next.title}</strong></a> : <a href="/optimization/"><span>연재 목차 <ArrowRight size={15} /></span><strong>전체 기록으로 돌아가기</strong></a>}
          </nav>
        </article>
      </div>
    </main><SiteFooter />
  </div>;
}
