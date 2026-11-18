import { WorldExplorer } from './world-explorer';
import { worldScenes } from '@/lib/world';
import { devlogs, updateHref } from '@/lib/devlogs';
import { features, featureHref } from '@/lib/features';
export function Showcase() {
  return (
    <>
      <h1 className="sr-only">ORBITAL FALL — 작은 행성에서, 첫 작업장까지.</h1>
      <WorldExplorer />
      <noscript>
        <style>
          {
            '.world-explorer{display:none!important}.is-home .site-header{position:relative!important}.world-fallback{display:block!important}.is-home{height:auto!important;overflow:visible!important}'
          }
        </style>
        <article className="world-fallback">
          <h2>ORBITAL FALL — 작은 행성에서, 첫 작업장까지.</h2>
          <p>실제 게임의 장소와 제작 과정을 따라가 보세요.</p>
          {worldScenes
            .filter((s) => s.id !== 'clearing')
            .map((s) => (
              <section
                key={s.id}
                id={'step-' + (s.id === 'computer' ? 'research' : s.id)}
              >
                <h2>{s.name}</h2>
                <p>{s.intro}</p>
                {s.shots.map((shot) => (
                  <figure key={shot.id}>
                    <img
                      src={shot.photo.src}
                      alt={shot.photo.alt}
                      width={shot.photo.width}
                      height={shot.photo.height}
                      loading="lazy"
                    />
                    <figcaption>
                      {shot.name} — {shot.note}
                    </figcaption>
                  </figure>
                ))}
                <a href={s.record}>{s.recordLabel} ↗</a>
              </section>
            ))}
          <h2>개발 기록</h2>
          {devlogs.map((d) => (
            <p key={d.slug}>
              <a href={updateHref(d.slug)}>{d.title}</a>
            </p>
          ))}
          <h2>이 세계를 다듬은 기록</h2>
          {features.map((f) => (
            <p key={f.slug}>
              <a href={featureHref(f.slug)}>{f.title}</a>
            </p>
          ))}
        </article>
      </noscript>
    </>
  );
}
