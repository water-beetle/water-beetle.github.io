import { media, type MediaKey } from './devlogs';
import type { FeatureMedia } from './features';
import type { SceneId, SceneSelection } from './world-navigation.mjs';
export type WorldPhoto = FeatureMedia & { portrait?: string };
export type WorldTarget = {
  id: string;
  label: string;
  hint: string;
  x: number;
  y: number;
  mobile?: { x: number; y: number };
  labelPosition?: 'left' | 'above' | 'below';
  to?: SceneSelection;
  href?: string;
};
export type WorldShot = {
  id: string;
  name: string;
  photo: WorldPhoto;
  note: string;
  targets?: WorldTarget[];
};
export type WorldScene = {
  id: SceneId;
  name: string;
  english: string;
  title: string;
  intro: string;
  parent: SceneSelection;
  record: string;
  recordLabel: string;
  shots: WorldShot[];
  next?: { label: string; to: SceneSelection };
};
const real = (name: string, alt: string): WorldPhoto => ({
  src: '/media/world/' + name + '.webp',
  thumbnail: '/media/world/' + name + '.webp',
  portrait: '/media/world/' + name + '-portrait.webp',
  width: 1920,
  height: 1082,
  alt,
  caption:
    '2026-11-18 · 실제 UE5.8 게임 촬영. 장면 탐색용으로 HUD만 잠시 숨겼습니다.',
});
const shot = (
  id: string,
  name: string,
  key: MediaKey,
  note: string,
): WorldShot => ({ id, name, photo: media[key], note });
export const arrival: SceneSelection = { scene: 'clearing', shot: 'arrival' };
export const worldScenes: WorldScene[] = [
  {
    id: 'clearing',
    name: '집 앞의 작은 세계',
    english: 'P01 / A SMALL BEGINNING',
    title: '작은 행성에서,\n첫 작업장까지.',
    intro: '집 앞에 떨어진 운석 하나. 이곳에서 첫 기체를 만들기까지.',
    parent: arrival,
    record: '/updates/',
    recordLabel: '개발 기록',
    shots: [
      {
        id: 'arrival',
        name: 'P01',
        photo: real(
          'clearing',
          '작은 구형 행성의 집과 운석, 직접 건설한 제작대',
        ),
        note: '풍경 속 이름을 눌러 들어가 보세요.',
        targets: [
          {
            id: 'enter-home',
            label: '작은 집',
            hint: '곡괭이를 챙기러',
            x: 45.6,
            y: 47.2,
            mobile: { x: 44, y: 47.4 },
            labelPosition: 'left',
            to: { scene: 'home', shot: 'entry' },
          },
          {
            id: 'enter-meteor',
            label: '떨어진 운석',
            hint: '첫 자원이 있는 곳',
            x: 59.2,
            y: 57.7,
            mobile: { x: 64.4, y: 52.4 },
            labelPosition: 'above',
            to: { scene: 'meteor', shot: 'wide' },
          },
          {
            id: 'enter-bench',
            label: '나의 첫 제작대',
            hint: '원료가 기체가 되기까지',
            x: 51.4,
            y: 55.5,
            mobile: { x: 52.2, y: 52.3 },
            labelPosition: 'below',
            to: { scene: 'bench', shot: 'built' },
          },
        ],
      },
    ],
  },
  {
    id: 'home',
    name: '집 · 현관',
    english: '01 / BEFORE THE FIRST STRIKE',
    title: '첫 도구는,\n집 안에.',
    intro: '출발은 거창하지 않습니다. 현관에 놓인 곡괭이 한 자루면 됩니다.',
    parent: arrival,
    record: '/updates/pickaxe-at-home/',
    recordLabel: '곡괭이의 자리를 다듬은 이야기',
    shots: [
      {
        id: 'entry',
        name: '현관에서',
        photo: {
          ...real('entry', '게임을 시작한 집의 현관문'),
          portrait: undefined,
        },
        note: '현관문을 열면 첫 운석의 낙하 대기가 시작됩니다.',
        targets: [
          {
            id: 'find-pickaxe',
            label: '현관 살펴보기',
            hint: '수납장 옆 곡괭이',
            x: 42,
            y: 63,
            mobile: { x: 49, y: 63 },
            to: { scene: 'home', shot: 'pickaxe' },
          },
        ],
      },
      shot(
        'pickaxe',
        '곡괭이 챙기기',
        'pickaxe',
        '현관 수납장 옆 곡괭이를 보고 E로 집어 듭니다. 실제 플레이 화면입니다.',
      ),
    ],
    next: { label: '밖의 운석으로', to: { scene: 'meteor', shot: 'wide' } },
  },
  {
    id: 'meteor',
    name: '집 앞 · 운석',
    english: '02 / SOMETHING HAS LANDED',
    title: '하늘에서 온,\n첫 번째 재료.',
    intro:
      '가까이 다가가 곡괭이로 채굴합니다. 모인 원료는 첫 작업장의 재료가 됩니다.',
    parent: arrival,
    record: '/updates/first-workbench/',
    recordLabel: '원료에서 제작대까지의 기록',
    shots: [
      {
        id: 'wide',
        name: '낙하한 운석',
        photo: real('meteor', '집 앞에 떨어진 운석의 가까운 실제 모습'),
        note: '채굴 장면을 따라가며 원료가 모이는 과정을 볼 수 있습니다.',
        targets: [
          {
            id: 'mine-meteor',
            label: '표면 가까이',
            hint: '채굴 과정 보기',
            x: 53,
            y: 54,
            mobile: { x: 51, y: 50 },
            to: { scene: 'meteor', shot: 'close' },
          },
        ],
      },
      shot(
        'close',
        '운석 표면',
        'meteor',
        '게임에서는 운석 가까이에서 곡괭이를 사용합니다.',
      ),
      shot(
        'mining',
        '직접 채굴',
        'mining',
        'LMB를 꾹 누르면 연속으로 채굴합니다. 채굴 조작을 확인한 실제 장면입니다.',
      ),
      shot(
        'inventory',
        '원료 네 개',
        'ore',
        '개인 인벤토리에 원료 4개가 모였습니다. 가공 없이 간이 제작대에 바로 사용합니다.',
      ),
    ],
    next: { label: '첫 제작대로', to: { scene: 'bench', shot: 'built' } },
  },
  {
    id: 'bench',
    name: '집 밖 · 간이 제작대',
    english: '03 / A PLACE TO MAKE THINGS',
    title: '원료 네 개로,\n내 작업 공간.',
    intro:
      '마음에 드는 지면을 고르고 한 번 클릭합니다. 5초 뒤 첫 제작대가 섭니다.',
    parent: arrival,
    record: '/updates/first-workbench/',
    recordLabel: '첫 제작대를 만든 과정',
    shots: [
      {
        id: 'built',
        name: '완성된 제작대',
        photo: real('bench', '운석 원료 네 개로 실제 건설한 간이 제작대'),
        note: '개인 원료 4개 · 현장 건설 5초 · 연구와 전력 없이 건설',
        targets: [
          {
            id: 'bench-process',
            label: '어떻게 만들었을까?',
            hint: '설치 전부터 따라보기',
            x: 48,
            y: 58,
            mobile: { x: 46, y: 58 },
            labelPosition: 'below',
            to: { scene: 'bench', shot: 'menu' },
          },
          {
            id: 'bench-assembly',
            label: '첫 드론 조립',
            hint: '제작대 위에서',
            x: 52,
            y: 48,
            mobile: { x: 51, y: 48 },
            to: { scene: 'drone', shot: 'ready' },
          },
        ],
      },
      shot(
        'menu',
        '01 건설 메뉴',
        'build-menu',
        'B → 간이 제작대 → 위치 선택. 개인 원료 4개를 확인합니다.',
      ),
      shot(
        'preview',
        '02 위치 선택',
        'ground-preview',
        '설치 가능한 지면을 보고 LMB 한 번으로 건설을 시작합니다.',
      ),
      shot(
        'building',
        '03 건설 중',
        'bench-building',
        '실제 5초 현장 건설 장면. 계속 누를 필요가 없고 G·Esc로 취소할 수 있습니다.',
      ),
      shot(
        'complete',
        '04 완성',
        'bench-complete',
        '완성 순간에만 원료 4개가 차감됩니다. 다음은 집 컴퓨터에서 첫 연구입니다.',
      ),
    ],
    next: { label: '집 컴퓨터로', to: { scene: 'computer', shot: 'desk' } },
  },
  {
    id: 'computer',
    name: '집 · 컴퓨터',
    english: '04 / AN IDEA BECOMES A BLUEPRINT',
    title: '다음 기체는,\n하나의 발견에서.',
    intro:
      '집 컴퓨터에서 첫 제작법을 연구합니다. 이 게임을 다듬어 온 기록도 여기서 펼쳐 보세요.',
    parent: { scene: 'home', shot: 'entry' },
    record: '/updates/first-mining-drone/',
    recordLabel: '첫 연구와 드론의 개발 기록',
    shots: [
      {
        id: 'desk',
        name: '컴퓨터 앞에서',
        photo: real('computer', '집 안 책상과 첫 연구를 진행하는 컴퓨터'),
        note: '원료 2개로 기본 채굴 드론 제작법을 연구합니다.',
        targets: [
          {
            id: 'computer-research',
            label: '첫 연구 살펴보기',
            hint: '기본 채굴 드론',
            x: 50,
            y: 51,
            mobile: { x: 50, y: 51 },
            to: { scene: 'computer', shot: 'ready' },
          },
          {
            id: 'computer-records',
            label: '개발 기록 열기',
            hint: '만들고, 고친 이야기',
            x: 50.7,
            y: 69,
            mobile: { x: 51, y: 69 },
            labelPosition: 'left',
            href: '/updates/',
          },
        ],
      },
      shot(
        'ready',
        '연구 준비',
        'research-ready',
        '개인 원료 2개 · 연구 10초. 공장이나 전원 없이 집 컴퓨터에서 진행합니다.',
      ),
      shot(
        'running',
        '연구 중',
        'research-running',
        '원료를 지불하면 연구가 진행됩니다. 게임에서는 컴퓨터를 떠나도 계속됩니다.',
      ),
      shot(
        'complete',
        '제작법 발견',
        'research-current',
        '연구 완료는 제작법 해금입니다. 기체는 제작대에서 직접 조립합니다.',
      ),
    ],
    next: {
      label: '제작대에서 드론 보기',
      to: { scene: 'drone', shot: 'ready' },
    },
  },
  {
    id: 'drone',
    name: '제작대 · 첫 드론',
    english: '05 / THE FIRST MACHINE',
    title: '첫 기체를,\n손에 넣기까지.',
    intro:
      '연구한 제작법과 원료 네 개. 제작대에서 조립을 마치면 첫 채굴 드론을 수령합니다.',
    parent: { scene: 'bench', shot: 'built' },
    record: '/updates/first-mining-drone/',
    recordLabel: '첫 드론을 연결한 이야기',
    shots: [
      shot(
        'ready',
        '조립 준비',
        'drone-current-ready',
        '기본 채굴 드론 연구 완료 후 · 개인 원료 4개 · 조립 10초.',
      ),
      shot(
        'assembling',
        '조립 중',
        'drone-current-building',
        '실제 조립 중인 장면입니다. 게임에서는 화면을 닫으면 조립이 일시정지합니다.',
      ),
      shot(
        'complete',
        '완성품 수령',
        'drone-current-complete',
        '조립이 끝난 뒤 완성품을 한 번 수령합니다.',
      ),
      shot(
        'inventory',
        '첫 기체, 내 인벤토리에',
        'drone-current-inventory',
        '현재 새 게임은 첫 드론 조립·수령까지 연결됩니다. 전개·동력·자동 채굴, 이후 공장과 우주선 성장은 다음 작업입니다.',
      ),
    ],
    next: { label: '작은 세계로 돌아가기', to: arrival },
  },
];
export function worldScene(id: SceneId) {
  return worldScenes.find((s) => s.id === id)!;
}
export function worldShot(value: SceneSelection) {
  const scene = worldScene(value.scene);
  return scene.shots.find((s) => s.id === value.shot) || scene.shots[0];
}
