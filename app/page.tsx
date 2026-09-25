// Images are pre-sized files served directly by GitHub Pages.
/* oxlint-disable next/no-html-link-for-pages, next/no-img-element */
import { SiteHeader, SiteFooter } from '@/components/site-chrome';
import { devlogs } from '@/lib/devlog';
import { optimizationPosts, optimizationHref } from '@/lib/optimization';

export const dynamic = 'force-static';

export default function Home() {
  const latest = devlogs[0];
  return <div className="site-shell">
    <a href="#journal" className="skip-link">글 목록으로</a>
    <SiteHeader />
    <main id="top" className="wrap home-page">
      <header className="home-intro">
        <h1>개발 노트</h1>
        <p>Unreal로 작은 행성에서 사는 게임을 만들고 있습니다.<br />최근에는 흙 채취 카트와 시작 화면을 손봤습니다.</p>
      </header>
      <div className="home-layout">
        <div>
          {latest && <article className="latest-post" id={latest.id}>
            <a className="latest-image" href={`/devlog/${latest.id}/`} aria-label={latest.title}>
              <img src={latest.media.kind === 'image' ? latest.media.src : latest.media.poster} alt={latest.media.alt} width={latest.media.kind === 'image' ? latest.media.width : 1600} height={latest.media.kind === 'image' ? latest.media.height : 900} fetchPriority="high" />
            </a>
            <div className="latest-copy">
            <p className="post-meta"><time dateTime={latest.date.replaceAll('.', '-')}>{latest.date}</time><span>최근 글</span></p>
            <h2><a href={`/devlog/${latest.id}/`}>{latest.title}</a></h2>
            <p className="latest-summary">{latest.summary}</p>
            <a className="read-link" href={`/devlog/${latest.id}/`}>개발일지 읽기 ↗</a>
            </div>
          </article>}
          <section id="journal" className="journal-index" aria-labelledby="journal-title">
            <div className="index-heading"><h2 id="journal-title">개발일지</h2><span>{devlogs.length}편</span></div>
            <ol className="post-list">{devlogs.map(post => <li key={post.id} id={post.id === latest?.id ? undefined : post.id}>
              <a className="archive-image" href={`/devlog/${post.id}/`} aria-label={post.title}><img src={post.media.kind === 'image' ? post.media.src : post.media.poster} alt={post.media.alt} loading="lazy" width={post.media.kind === 'image' ? post.media.width : 1600} height={post.media.kind === 'image' ? post.media.height : 900} /></a>
              <div className="archive-copy"><p className="post-meta"><time dateTime={post.date.replaceAll('.', '-')}>{post.date}</time><span>LOG {post.number}</span></p><h3><a href={`/devlog/${post.id}/`}>{post.title}</a></h3><p>{post.summary}</p><a className="read-link" href={`/devlog/${post.id}/`}>기록 읽기 ↗</a></div>
            </li>)}</ol>
          </section>
        </div>
        <aside className="home-sidebar">
          <section id="about"><h2>만드는 게임</h2><p className="game-name">ORBITAL FALL</p><p>작은 행성에 집이 있고, 우주선을 타고 장을 보러 갑니다. 운석이 떨어지면 마당에서 요격하고, 파인 땅은 흙을 가져와 메웁니다.</p><p>아직 개발 중입니다. 예전 글에는 당시 작업명인 Orbital Days와 Comet이 함께 나옵니다.</p></section>
          <section><h2><a href="/optimization/">최적화 메모 <span aria-hidden="true">→</span></a></h2><p>지형 생성, 움직이는 행성, 물리와 렌더링에서 막혔던 부분들.</p><ul>{optimizationPosts.filter(post => ['01', '05', '14'].includes(post.number)).map(post => <li key={post.slug}><a href={optimizationHref(post.slug)}>{post.title}</a></li>)}</ul><a className="plain-link" href="/optimization/">전체 {optimizationPosts.length}편</a></section>
        </aside>
      </div>
    </main>
    <SiteFooter />
  </div>;
}
