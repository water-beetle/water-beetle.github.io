'use client';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { journey, media, updateHref } from '@/lib/devlogs';
export function Journey() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            const n = journey.findIndex(
              (s) => 'step-' + s.id === entry.target.id,
            );
            if (n >= 0) setActive(n);
          }
      },
      { rootMargin: '-30% 0px -40% 0px', threshold: 0 },
    );
    document
      .querySelectorAll('[data-journey-step]')
      .forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  const selected = journey[active];
  const photo = media[selected.media];
  return (
    <section id="journey" className="section journey-section">
      <div className="section-heading">
        <p className="eyebrow">
          <span className="line-mark" />
          THE JOURNEY SO FAR
        </p>
        <h2>
          처음은, 집 앞의
          <br />
          운석 하나에서.
        </h2>
        <p>
          지금 게임에서 이어지는 여섯 번의 작은 행동.
          <br />
          사진을 따라 처음부터 둘러보세요.
        </p>
      </div>
      <nav className="journey-nav" aria-label="플레이 단계">
        {journey.map((s, i) => (
          <a
            key={s.id}
            href={'#step-' + s.id}
            onClick={() => setActive(i)}
            aria-current={active === i ? 'step' : undefined}
          >
            <span>{s.number}</span>
            {['집', '첫 운석', '채굴', '제작대', '연구', '드론'][i]}
          </a>
        ))}
      </nav>
      <div className="journey-layout">
        <figure className="journey-media">
          <div className="journey-picture">
            <motion.img
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: reduced ? 0 : 0.25 }}
            />
            <span className="photo-label">
              IN-GAME CAPTURE · {selected.number}/06
            </span>
          </div>
          <figcaption>
            <span>{selected.title}</span>
            <p>{photo.caption}</p>
          </figcaption>
        </figure>
        <div className="journey-steps">
          {journey.map((step, i) => (
            <article
              id={'step-' + step.id}
              key={step.id}
              data-journey-step
              className={active === i ? 'journey-step active' : 'journey-step'}
            >
              <span className="step-index">{step.number} / 06</span>
              <h3>{step.title}</h3>
              <p className="step-lead">{step.description}</p>
              <p>{step.detail}</p>
              <figure className="step-mobile-media">
                <img
                  src={media[step.media].src}
                  alt={media[step.media].alt}
                  width={media[step.media].width}
                  height={media[step.media].height}
                  loading="lazy"
                />
                <figcaption>{media[step.media].caption}</figcaption>
              </figure>
              <a className="text-link" href={updateHref(step.article)}>
                이 이야기 자세히 보기 <ArrowUpRight size={15} />
              </a>
            </article>
          ))}
        </div>
      </div>
      <noscript>
        <style>
          {
            '.journey-media{display:none!important}.journey-layout{display:block!important}.step-mobile-media{display:block!important}'
          }
        </style>
      </noscript>
    </section>
  );
}
