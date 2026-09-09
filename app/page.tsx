import { ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react';
import { SiteHeader, SiteFooter } from '@/components/site-chrome';
import { LogMedia } from '@/components/log-media';
import { devlogs, type Devlog } from '@/lib/devlog';
import { ArticleComments } from '@/components/article-comments';

export const dynamic = 'force-static';

function PostMeta({ post }: { post: Devlog }) {
  return <p className="post-meta"><span>LOG {post.number}</span><span>{post.date}</span></p>;
}
function Tags({ post }: { post: Devlog }) {
  return <div className="tags">{post.tags.map(tag => <span key={tag}>{tag}</span>)}</div>;
}
export default function Home() {
  const [latest, ...previous] = devlogs;
  return (
    <div className="site-shell">
      <a href="#journal" className="skip-link">개발일지로 바로가기</a>
      <SiteHeader />
      <main id="top" className="wrap">
        <section className="intro" aria-labelledby="page-title">
          <div><p className="eyebrow"><span className="tiny-cross">✳</span> A LITTLE LIFE IN A BIG UNIVERSE</p><h1 id="page-title">작은 우주를 만드는 기록<span>.</span></h1><p className="intro-copy">행성 위의 발걸음부터, 우주선 안의 일상까지.<br className="mobile-break" /> 한 장면씩 쌓아가는 우주 생활 시뮬레이터 개발일지.</p></div>
          <a href="#journal" className="explore-link"><ArrowDown size={19} /><span>기록 둘러보기</span></a>
        </section>
        <section id="journal" className="journal" aria-labelledby="journal-title">
          <div className="section-heading"><h2 id="journal-title">개발일지 <span>DEVELOPMENT LOG</span></h2></div>
          {latest ? <article className="featured">
            <div className="featured-media"><LogMedia media={latest.media} featured />{latest.media.kind === 'image' && <div className="image-caption"><span><Sparkles size={14} /> 개발 스크린샷</span><span>{latest.tags[0]}</span></div>}</div>
            <div className="featured-copy"><PostMeta post={latest} /><Tags post={latest} /><h3>{latest.title}</h3><p>{latest.summary}</p><a className="read-link" href={'#' + latest.id}>개발일지 읽기 <ArrowUpRight size={19} /></a><div className="card-foot"><span>ORBITAL DAYS</span><span>BUILDING A PLACE TO CALL HOME</span></div></div>
          </article> : <p className="empty-note">첫 번째 개발일지를 준비하고 있습니다.</p>}
          {previous.length > 0 && <><div className="archive-heading"><span>이전 기록</span><span>천천히, 한 걸음씩.</span></div>{previous.map(post => <article className="archive-post" key={post.id}><div className="archive-media"><LogMedia media={post.media} /></div><div><PostMeta post={post} /><Tags post={post} /><h3><a href={'#' + post.id}>{post.title}</a></h3><p>{post.summary}</p><a className="text-link" href={'#' + post.id}>기록 읽기 <ArrowUpRight size={17} /></a></div></article>)}</>}
          <div className="full-logs">{devlogs.map(post => <article className="log-body" id={post.id} key={post.id}>
            <div className="log-heading"><span className="eyebrow">LOG {post.number}</span><a href="#journal">목록으로 ↑</a></div>
            <h2 data-analytics-article={'journal/' + post.id} data-article-title={post.title} data-article-type="journal">{post.title}</h2>
            {post.period && <p className="log-period">{post.period} · WEEKLY DEVLOG</p>}
            {post.sections.map(section => <section key={section.title}>
              <h3>{section.title}</h3>
              {section.text.split('\n\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              {section.table && <div className="article-table" role="region" aria-label={section.table.caption} tabIndex={0}>
                <table><caption>{section.table.caption}</caption><thead><tr>{section.table.columns.map(column => <th scope="col" key={column}>{column}</th>)}</tr></thead><tbody>{section.table.rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => cellIndex === 0 ? <th scope="row" key={cellIndex}>{cell}</th> : <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table>
              </div>}
              {section.code && <figure className="article-code"><figcaption>{section.code.caption}</figcaption><pre tabIndex={0} aria-label={section.code.caption}><code>{section.code.value}</code></pre></figure>}
              {section.media && <div className={section.media.length > 1 ? 'log-gallery' : 'log-gallery single'}>{section.media.map(media => <figure key={media.src}><LogMedia media={media} />{media.kind === 'image' && <figcaption>{media.caption}</figcaption>}</figure>)}</div>}
            </section>)}
            {post.sources && <section className="article-sources" aria-labelledby={post.id + '-sources'}><h3 id={post.id + '-sources'}>코드와 확인 자료</h3><ul>{post.sources.map(source => <li key={source.label}><strong>{source.href ? <a href={source.href}>{source.label} ↗</a> : source.label}</strong><p>{source.detail}</p></li>)}</ul></section>}
            <ArticleComments articleId={post.id} articlePath={'/#' + post.id} />
          </article>)}</div>
        </section>
        <section id="about" className="about"><div><p className="eyebrow">ABOUT THE GAME</p><h2>머나먼 우주에서도,<br />우리의 하루는 계속되니까.</h2></div><div><p>우주를 무대로 살아가는 생활 시뮬레이터를 개발하고 있습니다. 이곳에는 구현한 기능과 바뀌어가는 장면들, 그리고 개발 과정에서의 작은 발견을 남깁니다.</p><span className="working-title"><i /> ORBITAL DAYS · 우주 생활 시뮬레이터</span></div></section>
      </main>
      <SiteFooter />
    </div>
  );
}
