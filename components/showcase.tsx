'use client';
import { ArrowDown, ArrowRight, ArrowUpRight, MoveUpRight } from 'lucide-react';
import { Button } from '@astryxdesign/core/Button';
import { SiteShell } from '@/components/site-chrome';
import { PlanetHero } from '@/components/planet-hero';
import { Journey } from '@/components/journey';
import { Reveal } from '@/components/reveal';
import { DevlogCards } from '@/components/devlog-cards';
import { devlogs, updateHref, formatDate } from '@/lib/devlogs';
import { features, featureHref } from '@/lib/features';
export function Showcase() {
  const latest = devlogs[0];
  return (
    <SiteShell>
      <section className="hero section">
        <div className="hero-copy">
          <Reveal>
            <p className="eyebrow">
              <span className="line-mark" />
              SMALL PLANET. INFINITE POSSIBILITIES.
            </p>
            <h1>
              운석 하나로
              <br />
              시작하는 <em>이야기.</em>
            </h1>
            <p className="hero-description">
              집에서 도구를 들고, 운석을 캐고,
              <br />첫 작업장을 세우기까지.
              <br />
              작은 행성의 공장 게임을 만들어 가는 기록입니다.
            </p>
            <div className="hero-actions">
              <Button
                label="처음부터 둘러보기"
                href="#journey"
                variant="primary"
                size="lg"
                endContent={<ArrowDown size={17} />}
              />
              <a className="text-link" href="/updates/">
                개발 기록 읽기 <ArrowUpRight size={17} />
              </a>
            </div>
            <div className="hero-footnote">
              <span className="status-light" />
              Unreal Engine · 하나씩 만들어 가는 중
            </div>
          </Reveal>
        </div>
        <PlanetHero />
        <div className="hero-transmission">
          <span className="eyebrow">LATEST TRANSMISSION</span>
          <time dateTime={latest.date}>{formatDate(latest.date)}</time>
          <a href={updateHref(latest.slug)}>
            {latest.title} <ArrowUpRight size={16} />
          </a>
        </div>
      </section>
      <Journey />
      <section className="section latest-section" id="updates">
        <Reveal className="section-heading heading-row">
          <div>
            <p className="eyebrow">
              <span className="line-mark" />
              DEVELOPMENT LOG
            </p>
            <h2>조금씩, 달라지는 세계.</h2>
            <p>플레이를 연결하고, 손에 익는 경험을 다듬습니다.</p>
          </div>
          <a className="text-link" href="/updates/">
            모든 기록 <ArrowUpRight size={17} />
          </a>
        </Reveal>
        <DevlogCards entries={devlogs.slice(0, 3)} />
      </section>
      <section id="features" className="section world-section">
        <Reveal className="section-heading">
          <p className="eyebrow">
            <span className="line-mark" />A WORLD IN THE MAKING
          </p>
          <h2>작은 세계를 이루는 것들.</h2>
          <p>지금의 플레이와, 그 뒤에서 다듬어 온 구현 이야기.</p>
        </Reveal>
        <div className="world-grid">
          {features.map((feature) => (
            <a
              className="world-row"
              key={feature.slug}
              href={featureHref(feature.slug)}
            >
              <span className="world-number">{feature.number}</span>
              <div>
                <h3>{feature.title}</h3>
                <p>{feature.status}</p>
              </div>
              <MoveUpRight size={19} />
            </a>
          ))}
        </div>
      </section>
      <section id="progress" className="section progress-section">
        <Reveal>
          <p className="eyebrow">
            <span className="line-mark" />
            WHERE WE ARE HEADING
          </p>
          <h2>이제, 첫 공장을 향해.</h2>
          <div className="progress-columns">
            <div>
              <span className="progress-label">지금 이어지는 플레이</span>
              <p>
                곡괭이 채굴에서 간이 제작대 건설,
                <br />첫 연구와 드론 조립·수령까지.
              </p>
            </div>
            <ArrowRight className="progress-arrow" size={24} />
            <div>
              <span className="progress-label">다음에 만들어 갈 것</span>
              <p>
                드론 전개와 동력, 자동 채굴.
                <br />
                공장 생산에서 우주선 성장으로.
              </p>
            </div>
          </div>
          <a className="text-link" href="/updates/first-mining-drone/">
            현재 진행 더 알아보기 <ArrowUpRight size={16} />
          </a>
        </Reveal>
      </section>
    </SiteShell>
  );
}
