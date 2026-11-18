'use client';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@astryxdesign/core/Button';
import { devlogs } from '@/lib/devlogs';
import { SiteShell } from './site-chrome';
import { DevlogCards } from './devlog-cards';
export function UpdatesIndex() {
  const [filter, setFilter] = useState('전체');
  const [order, setOrder] = useState('newest');
  const options = ['전체', ...new Set(devlogs.map((p) => p.category))];
  const entries = devlogs
    .filter((p) => filter === '전체' || p.category === filter)
    .sort((a, b) =>
      order === 'oldest'
        ? a.date.localeCompare(b.date)
        : b.date.localeCompare(a.date),
    );
  return (
    <SiteShell>
      <section className="section updates-page">
        <p className="eyebrow">
          <span className="line-mark" />
          FIELD NOTES FROM A SMALL PLANET
        </p>
        <h1>개발 기록.</h1>
        <p className="page-description">
          큰 변화도, 작은 디테일도.
          <br />
          직접 만들고 플레이하며 발견한 것들을 남깁니다.
        </p>
        <div className="filter-bar" aria-label="기록 주제 필터">
          {options.map((option) => (
            <Button
              key={option}
              label={option}
              variant={option === filter ? 'primary' : 'ghost'}
              onClick={() => setFilter(option)}
              aria-pressed={option === filter}
            />
          ))}
          <label className="date-sort">
            날짜순
            <select value={order} onChange={(e) => setOrder(e.target.value)}>
              <option value="newest">최신순</option>
              <option value="oldest">오래된 순</option>
            </select>
          </label>
        </div>
        <noscript>
          <style>{'.filter-bar{display:none}'}</style>
          <p className="result-count">모든 기록을 최신순으로 표시합니다.</p>
        </noscript>
        <p className="result-count" aria-live="polite">
          {entries.length}개의 기록
        </p>
        <motion.div
          key={filter + order}
          initial={false}
          animate={{ opacity: 1 }}
        >
          <DevlogCards entries={entries} />
        </motion.div>
      </section>
    </SiteShell>
  );
}
