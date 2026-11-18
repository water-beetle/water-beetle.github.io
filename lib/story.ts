import { media, type MediaKey } from './devlogs';
import type { ChapterId } from './story-types';
export interface StoryFrame {
  id: string;
  label: string;
  media: MediaKey;
  note: string;
  hotspot?: { x: number; y: number; target: string; label: string };
}
export interface StoryChapter {
  id: ChapterId;
  number: string;
  short: string;
  eyebrow: string;
  title: string;
  description: string;
  fact: string;
  article: string;
  frames: StoryFrame[];
}
export const chapters: StoryChapter[] = [
  {
    id: 'home',
    number: '01',
    short: '집에서',
    eyebrow: 'A SMALL WORLD, A FIRST STEP',
    title: '작은 행성에서,\n첫 작업장까지.',
    description:
      '현관문을 열고 곡괭이를 집어 듭니다. 이 작은 시작이 첫 제작대와 채굴 드론으로 이어집니다.',
    fact: '실제 게임 화면으로 따라가는 플레이 과정',
    article: 'pickaxe-at-home',
    frames: [
      {
        id: 'exterior',
        label: '작은 집',
        media: 'home-wide',
        note: '이야기가 시작되는 P01의 집. 아래로 스크롤해 실제 진행을 따라가세요.',
      },
      {
        id: 'door',
        label: '현관에서',
        media: 'home-start',
        note: '현관문을 처음 열면 첫 운석의 낙하 대기가 시작됩니다.',
      },
      {
        id: 'pickaxe',
        label: '곡괭이 줍기',
        media: 'pickaxe',
        note: '현관 수납장 옆 곡괭이를 보고 E로 집어 듭니다.',
      },
    ],
  },
  {
    id: 'meteor',
    number: '02',
    short: '첫 운석',
    eyebrow: 'SOMETHING HAS LANDED',
    title: '집 앞에 떨어진,\n첫 번째 가능성.',
    description:
      '하늘에서 찾아온 운석이 첫 자원이 됩니다. 집에서 챙긴 곡괭이를 들고 다가갑니다.',
    fact: '문을 연 뒤 시작되는 첫 운석 낙하',
    article: 'first-workbench',
    frames: [
      {
        id: 'wide',
        label: '낙하한 운석',
        media: 'meteor-wide',
        note: 'P01에 떨어진 첫 운석의 실제 모습입니다.',
      },
      {
        id: 'close',
        label: '가까이 다가가기',
        media: 'meteor',
        note: '운석 표면에 다가가 곡괭이로 원료를 모읍니다.',
      },
    ],
  },
  {
    id: 'mining',
    number: '03',
    short: '채굴',
    eyebrow: 'FOUR PIECES TO BEGIN WITH',
    title: '곡괭이로,\n원료 네 개.',
    description:
      'LMB를 꾹 누르면 연속으로 채굴합니다. 모은 원료는 가공 없이 바로 첫 제작대의 재료가 됩니다.',
    fact: '채굴은 꾹 누르기 · I에서 원료 확인',
    article: 'first-workbench',
    frames: [
      {
        id: 'mining',
        label: '직접 채굴',
        media: 'mining',
        note: '곡괭이를 휘두르는 실제 게임 장면입니다.',
        hotspot: {
          x: 95,
          y: 89.5,
          target: 'inventory',
          label: '원료 확인 화면 보기',
        },
      },
      {
        id: 'inventory',
        label: '원료 4개 확인',
        media: 'ore',
        note: '개인 인벤토리에 모인 운석 원료 4개. 다음은 첫 제작대 건설입니다.',
      },
    ],
  },
  {
    id: 'bench',
    number: '04',
    short: '제작대',
    eyebrow: 'A PLACE TO MAKE THINGS',
    title: '내가 세우는,\n첫 작업 공간.',
    description:
      'B에서 간이 제작대를 골라 위치를 정합니다. LMB 한 번으로 건설이 시작되고, 5초 뒤 첫 작업장이 생깁니다.',
    fact: '개인 원료 4개 · 현장 건설 5초 · 연구와 전력 불필요',
    article: 'first-workbench',
    frames: [
      {
        id: 'menu',
        label: '01 건설 메뉴',
        media: 'build-menu',
        note: 'B → 간이 제작대 → 위치 선택. 원료 4개를 확인합니다.',
        hotspot: {
          x: 77.5,
          y: 77.2,
          target: 'preview',
          label: '설치 위치 선택 화면 보기',
        },
      },
      {
        id: 'preview',
        label: '02 위치 선택',
        media: 'ground-preview',
        note: '설치 가능한 지면을 보고 LMB 한 번으로 위치를 확정합니다.',
      },
      {
        id: 'building',
        label: '03 건설 중',
        media: 'bench-building',
        note: '실제 5초 현장 건설 중의 화면. 계속 누를 필요가 없고 G·Esc로 취소할 수 있습니다.',
      },
      {
        id: 'complete',
        label: '04 완성',
        media: 'bench-complete',
        note: '완성 순간 원료 4개가 차감됩니다. 제작대 앞 E로 드론 조립 화면을 엽니다.',
      },
    ],
  },
  {
    id: 'research',
    number: '05',
    short: '연구',
    eyebrow: 'KNOWING HOW COMES FIRST',
    title: '집으로 돌아와,\n첫 연구.',
    description:
      '원료 2개를 더 모아 집 컴퓨터에서 기본 채굴 드론을 연구합니다. 연구가 끝나면 제작법이 열립니다.',
    fact: '개인 원료 2개 · 연구 10초',
    article: 'first-mining-drone',
    frames: [
      {
        id: 'ready',
        label: '연구 준비',
        media: 'research-ready',
        note: '집 컴퓨터의 기본 채굴 드론 연구. 공장이나 전원 없이 개인 원료를 사용합니다.',
      },
      {
        id: 'running',
        label: '연구 중',
        media: 'research-running',
        note: '원료 2개를 지불해 실제 연구가 진행 중입니다. 컴퓨터를 떠나도 계속됩니다.',
      },
      {
        id: 'complete',
        label: '제작법 발견',
        media: 'research-current',
        note: '연구 완료는 제작법 해금입니다. 기체는 제작대에서 직접 조립해야 합니다.',
      },
    ],
  },
  {
    id: 'drone',
    number: '06',
    short: '첫 드론',
    eyebrow: 'THE FIRST MACHINE, IN YOUR HANDS',
    title: '첫 기체를,\n손에 넣기까지.',
    description:
      '원료 4개를 더 모아 제작대에서 드론을 조립합니다. 완성품을 수령하면 첫 채굴 드론이 인벤토리에 들어옵니다.',
    fact: '연구 완료 후 · 원료 4개 · 조립 10초 · 단일 수령',
    article: 'first-mining-drone',
    frames: [
      {
        id: 'ready',
        label: '조립 준비',
        media: 'drone-current-ready',
        note: '현재 간이 제작대의 실제 드론 조립 화면입니다.',
      },
      {
        id: 'assembling',
        label: '조립 중',
        media: 'drone-current-building',
        note: '10초 동안 조립합니다. 화면을 닫으면 남은 시간 그대로 일시정지합니다.',
      },
      {
        id: 'complete',
        label: '완성품 수령',
        media: 'drone-current-complete',
        note: '조립이 끝난 뒤 완성품을 한 번 수령합니다.',
      },
      {
        id: 'inventory',
        label: '내 인벤토리에',
        media: 'drone-current-inventory',
        note: '첫 드론의 조립·수령까지 이어진 현재 진행입니다. 전개·동력·자동 채굴 연결은 후속입니다.',
      },
    ],
  },
];
export const getChapter = (id: ChapterId) => chapters.find((c) => c.id === id)!;
export const frameFor = (
  id: ChapterId,
  frames: Partial<Record<ChapterId, string>>,
) => {
  const c = getChapter(id);
  return c.frames.find((f) => f.id === frames[id]) || c.frames[0];
};
export const featureChapters: Record<string, ChapterId> = {
  home: 'home',
  movement: 'home',
  planets: 'meteor',
  meteors: 'meteor',
  factory: 'bench',
  research: 'research',
  spaceship: 'drone',
  interfaces: 'bench',
};
export const chapterFromHash = (hash: string): ChapterId | undefined => {
  const id = hash.replace(/^#/, '').replace(/^step-/, '');
  return chapters.some((c) => c.id === id)
    ? (id as ChapterId)
    : hash === '#journey'
      ? 'home'
      : undefined;
};
export const framePhoto = (frame: StoryFrame) => media[frame.media];
