'use client';
import { ArrowUpRight } from 'lucide-react';
import { ClickableCard } from '@astryxdesign/core/ClickableCard';
import { media, updateHref, formatDate, type DevlogEntry } from '@/lib/devlogs';
export function DevlogCards({ entries }: { entries: DevlogEntry[] }) {
  return (
    <div className="journal-grid">
      {entries.map((entry) => {
        const photo = media[entry.cover];
        return (
          <ClickableCard
            key={entry.slug}
            className="journal-card"
            label={entry.title + ' 읽기'}
            href={updateHref(entry.slug)}
            padding={0}
          >
            <div className="journal-cover">
              <img
                src={photo.thumbnail}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                loading="lazy"
              />
            </div>
            <div className="journal-meta">
              <span>{entry.category}</span>
              <time dateTime={entry.date}>{formatDate(entry.date)}</time>
            </div>
            <h3>{entry.title}</h3>
            <p>{entry.summary}</p>
            <span className="text-link">
              기록 읽기 <ArrowUpRight size={15} />
            </span>
          </ClickableCard>
        );
      })}
    </div>
  );
}
