import { ArrowDown, ArrowUpRight, Orbit, Sparkles } from 'lucide-react';
import { LogMedia } from '@/components/log-media';
import { devlogs, type Devlog } from '@/lib/devlog';

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
      <header className="site-header wrap">
        <a href="#top" className="brand" aria-label="Orbital Days, 처음으로">
          <span className="brand-icon"><Orbit size={30} strokeWidth={1.35} /></span>
          <span><strong>Orbital Days</strong><small>SPACE LIFE SIM / DEVLOG</small></span>
        </a>
        <nav aria-label="주 메뉴"><a href="#journal" className="active">개발일지</a><a href="#about">게임 소개 <ArrowUpRight size={14} /></a></nav>
        <span className="header-note"><i /> 우주 생활 시뮬레이터</span>
      </header>
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
          <div className="full-logs">{devlogs.map(post => <article className="log-body" id={post.id} key={post.id}><div className="log-heading"><span className="eyebrow">LOG {post.number}</span><a href="#journal">목록으로 ↑</a></div><h2>{post.title}</h2>{post.period && <p className="log-period">{post.period} · WEEKLY DEVLOG</p>}{post.sections.map(section => <section key={section.title}><h3>{section.title}</h3><p>{section.text}</p>{section.media && <div className={section.media.length > 1 ? 'log-gallery' : 'log-gallery single'}>{section.media.map(media => <figure key={media.src}><LogMedia media={media} />{media.kind === 'image' && <figcaption>{media.caption}</figcaption>}</figure>)}</div>}</section>)}</article>)}</div>
        </section>
        <section id="about" className="about"><div><p className="eyebrow">ABOUT THE GAME</p><h2>머나먼 우주에서도,<br />우리의 하루는 계속되니까.</h2></div><div><p>우주를 무대로 살아가는 생활 시뮬레이터를 개발하고 있습니다. 이곳에는 구현한 기능과 바뀌어가는 장면들, 그리고 개발 과정에서의 작은 발견을 남깁니다.</p><span className="working-title"><i /> ORBITAL DAYS · 우주 생활 시뮬레이터</span></div></section>
      </main>
      <footer className="site-footer wrap"><span><Orbit size={18} /> ORBITAL DAYS</span><p>어제보다 조금 더 넓어진 우주.</p><a href="#top">맨 위로 ↑</a></footer>
    </div>
  );
}
