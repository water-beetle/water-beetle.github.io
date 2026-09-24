/* oxlint-disable next/no-html-link-for-pages, jsx-a11y/no-noninteractive-tabindex */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteHeader, SiteFooter } from '@/components/site-chrome';
import { LogMedia } from '@/components/log-media';
import { ArticleComments } from '@/components/article-comments';
import { devlogs } from '@/lib/devlog';

export const dynamic = 'force-static';
export const dynamicParams = false;
export const generateStaticParams = () => devlogs.map(post => ({ slug: post.id }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = devlogs.find(entry => entry.id === slug);
  return post ? { title: `${post.title} — Orbital Days`, description: post.summary, alternates: { canonical: `/devlog/${post.id}/` } } : { title: '글을 찾을 수 없습니다' };
}

export default async function JournalArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = devlogs.findIndex(post => post.id === slug);
  if (index < 0) notFound();
  const post = devlogs[index];
  const older = devlogs[index + 1];
  const newer = devlogs[index - 1];
  return <div className="site-shell">
    <a href="#article-content" className="skip-link">본문으로</a>
    <SiteHeader />
    <main id="top" className="wrap journal-reader">
      <a className="back-to-series" href="/#journal">← 개발일지</a>
      <article id="article-content" className="log-body">
        <header className="journal-header">
          <p className="post-meta"><time dateTime={post.date.replaceAll('.', '-')}>{post.date}</time><span>개발일지 {post.number}</span></p>
          <h1 data-analytics-article={'journal/' + post.id} data-article-title={post.title} data-article-type="journal">{post.title}</h1>
          {post.period && <p className="log-period">작업 기간 {post.period}</p>}
        </header>
        {post.sections.map((section, sectionIndex) => <section key={sectionIndex}>
          {section.title && <h2>{section.title}</h2>}
          {section.text.split('\n\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          {section.table && <section className="article-table" aria-label={section.table.caption} tabIndex={0}><table><caption>{section.table.caption}</caption><thead><tr>{section.table.columns.map(column => <th scope="col" key={column}>{column}</th>)}</tr></thead><tbody>{section.table.rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => cellIndex === 0 ? <th scope="row" key={cellIndex}>{cell}</th> : <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></section>}
          {section.code && <figure className="article-code"><figcaption>{section.code.caption}</figcaption><pre tabIndex={0} aria-label={section.code.caption}><code>{section.code.value}</code></pre></figure>}
          {section.media && <div className="log-gallery">{section.media.map(media => <figure key={media.src}><LogMedia media={media} featured={sectionIndex === 0} />{media.kind === 'image' && <figcaption>{media.caption}</figcaption>}</figure>)}</div>}
        </section>)}
        {post.sources && <details className="journal-sources"><summary>작업 기록·검증 자료</summary><ul>{post.sources.map(source => <li key={source.label}><strong>{source.href ? <a href={source.href}>{source.label}</a> : source.label}</strong><p>{source.detail}</p></li>)}</ul></details>}
        <nav className="article-pagination" aria-label="다른 개발일지">
          {older ? <a href={`/devlog/${older.id}/`}><span>← 이전 글</span><strong>{older.title}</strong></a> : <a href="/#journal">전체 글</a>}
          {newer && <a href={`/devlog/${newer.id}/`}><span>다음 글 →</span><strong>{newer.title}</strong></a>}
        </nav>
        {/* Preserve the existing Discussion identity. */}
        <ArticleComments articleId={post.id} articlePath={'/#' + post.id} />
      </article>
    </main>
    <SiteFooter />
  </div>;
}
