import published from '@/content/published/index.json';
import journalMedia from './journal-media.json';
import type { FeatureMedia } from './features';
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
export interface JourneyStep {
  id: string;
  number: string;
  title: string;
  description: string;
  detail: string;
  media: MediaKey;
  article: string;
}
export const journey: JourneyStep[] = [
  {
    id: 'home',
    number: '01',
    title: '집에서, 도구를 들고',
    description: '현관문을 열고 곡괭이를 집어 듭니다.',
    detail:
      '문을 처음 열면 첫 운석의 낙하 대기가 시작됩니다. 현관 쪽 수납장 옆의 곡괭이를 보고 E를 눌러 집어 드세요.',
    media: 'pickaxe',
    article: 'pickaxe-at-home',
  },
  {
    id: 'meteor',
    number: '02',
    title: '하늘에서 찾아온 첫 자원',
    description: '집 앞에 떨어진 운석이 첫 목표가 됩니다.',
    detail:
      '낙하를 확인하고 운석 가까이 다가갑니다. 작은 행성에서 무엇을 만들지 고민하는 이야기가 여기서 시작됩니다.',
    media: 'meteor',
    article: 'first-workbench',
  },
  {
    id: 'mining',
    number: '03',
    title: '곡괭이로 원료 네 개',
    description: 'LMB를 꾹 눌러 연속으로 채굴합니다.',
    detail:
      'I를 열어 개인 운석 원료를 확인합니다. 원료를 손으로 가공하는 단계 없이 바로 건설에 쓸 수 있습니다.',
    media: 'mining',
    article: 'first-workbench',
  },
  {
    id: 'bench',
    number: '04',
    title: '내가 세우는 첫 작업 공간',
    description: 'B → 간이 제작대 → 위치 선택.',
    detail:
      '바닥을 보고 LMB를 한 번 누르면 5초 뒤 완성됩니다. 연구와 전력은 필요하지 않고, 취소하면 원료를 그대로 보존합니다.',
    media: 'build-menu',
    article: 'first-workbench',
  },
  {
    id: 'research',
    number: '05',
    title: '집으로 돌아와, 첫 연구',
    description: '원료 두 개와 10초로 제작법을 발견합니다.',
    detail:
      '제작대를 세운 뒤 원료 2개를 더 모아 집 컴퓨터에서 기본 채굴 드론을 연구합니다. 연구가 끝나는 것은 제작법이 열리는 순간입니다. 기체는 직접 만들어야 합니다.',
    media: 'research',
    article: 'first-mining-drone',
  },
  {
    id: 'drone',
    number: '06',
    title: '제작대에서 첫 드론을',
    description: '연구를 마치고 원료 네 개로 조립합니다.',
    detail:
      '제작대 앞 E로 조립 화면을 엽니다. 10초 동안 직접 조립하고 완성품을 수령합니다. 전개·동력·자동 채굴 연결은 다음 단계입니다.',
    media: 'bench-screen',
    article: 'first-mining-drone',
  },
];
