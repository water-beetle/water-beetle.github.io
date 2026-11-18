import published from '@/content/published/index.json';
import journalMedia from './journal-media.json';
import type { FeatureMedia } from './features';
import type { ChapterId } from './story-types';
export type MediaKey = keyof typeof journalMedia;
export const media = journalMedia as Record<MediaKey, FeatureMedia>;
export interface DevlogEntry {
  slug: string;
  title: string;
  eyebrow: string;
  date: string;
  category: string;
  summary: string;
  readingMinutes: number;
  cover: MediaKey;
  chapterId?: ChapterId;
  status: 'published' | 'draft';
  sections: { title: string; text: string[]; media?: MediaKey }[];
  comparison?: { before: MediaKey; after: MediaKey; note: string };
  next: string;
}
export const devlogs = (published as DevlogEntry[])
  .filter((entry) => entry.status === 'published')
  .sort((a, b) => b.date.localeCompare(a.date));
export const updateHref = (slug: string) => `/updates/${slug}/`;
export const formatDate = (date: string) => date.replaceAll('-', '.');
