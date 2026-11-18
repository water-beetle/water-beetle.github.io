export interface FeatureMedia {
  src: string;
  thumbnail: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}
export interface Feature {
  slug: string;
  number: string;
  title: string;
  english: string;
  status: string;
  summary: string;
  points: string[];
  result: string;
  limit: string;
  date: string;
  cover: number;
  tags: string[];
  sources: string[];
  media: FeatureMedia[];
}
export const features: Feature[] = [
  {
    slug: 'planets',
    number: '01',
    title: '작은 행성의 지형과 환경',
    english: 'PLANETS & TERRAIN',
    status: '환경 구현 · 계속 다듬는 중',
    summary:
      '구형 행성의 곡률을 따라 걷고, 운석이 닿은 곳에서는 지형이 실제로 파입니다. P01의 숲과 P02의 건조한 환경을 다듬고 있습니다.',
    points: [
      '시드와 프리셋을 사용하는 복셀 지형 생성, 거리별 메시와 충돌 준비',
      '운석 충돌에 따른 지형 편집과 변경 지형의 저장·복원',
      'P01 식생과 P02 다중 규모 크레이터·암반·근거리 조각층',
    ],
    result:
      'P02 월면 단계에서 86.71m 보행과 운석에 의한 약 2.5m 추가 파임·저장 복원을 확인했습니다. 이후 조각층 시안에서도 20.10m 보행과 파임 후 재생성을 확인했습니다.',
    limit:
      '기존 월면 사진은 당시 환경 검토 기록입니다. P02의 현재 방향은 건조한 지표와 식생이며, 다른 행성의 산업 역할은 아직 미정입니다.',
    date: '2026.11.18',
    cover: 1,
    tags: ['복셀 지형', '지형 편집', 'PCG'],
    sources: [
      'Docs/Art/Planet/06_TERRAIN_PRESETS.md',
      'outputs/p02-layered-lunar-20261110/README.md',
      'outputs/p02-dense-cover-pilot-20261111/status.json',
    ],
    media: [
      {
        src: '/media/features/planets-01.webp',
        thumbnail: '/media/features/planets-01-thumb.webp',
        alt: 'P01 구형 행성과 숲',
        caption:
          '2026-10-28 환경 검토 화면. 작은 행성의 곡률과 식생을 확인한 촬영본.',
        width: 1280,
        height: 720,
      },
      {
        src: '/media/features/planets-02.webp',
        thumbnail: '/media/features/planets-02-thumb.webp',
        alt: 'P02 월면 전체',
        caption:
          '2026-11-11 월면 적용 단계의 실제 게임 화면. 이후 한 구역 조각층 시안이 추가됐다.',
        width: 1820,
        height: 815,
      },
      {
        src: '/media/features/planets-03.webp',
        thumbnail: '/media/features/planets-03-thumb.webp',
        alt: 'P02 분화구 가장자리',
        caption:
          '2026-11-11 최종 저장본 재로드 화면. 낮은 조각층은 약 24×20m 한 구역 시안이다.',
        width: 1820,
        height: 815,
      },
      {
        src: '/media/features/planets-04.webp',
        thumbnail: '/media/features/planets-04-thumb.webp',
        alt: 'P02 작업 분지',
        caption:
          '2026-11-11 실제 게임 화면. 지형 굴곡을 따르는 회색 조각층을 적용했다.',
        width: 1820,
        height: 815,
      },
      {
        src: '/media/features/planets-05.webp',
        thumbnail: '/media/features/planets-05-thumb.webp',
        alt: 'P02 지표 근접',
        caption:
          '2026-11-11 한 구역 시안의 근접 촬영. 원거리 경계와 초기 생성 비용은 개선 대상이다.',
        width: 1820,
        height: 815,
      },
      {
        src: '/media/features/planets-06.webp',
        thumbnail: '/media/features/planets-06-thumb.webp',
        alt: '운석으로 파인 지형',
        caption:
          '2026-11-11 운석 추가 파임 뒤 조각층 재생성을 확인한 검증 화면.',
        width: 1820,
        height: 815,
      },
    ],
  },
  {
    slug: 'movement',
    number: '02',
    title: '걷고, 도구를 들고, 세계와 만나기',
    english: 'MOVEMENT & INTERACTION',
    status: '기반 구현',
    summary:
      '작은 행성의 곡면을 따라 걷고, 문을 열고, 도구와 물건을 직접 드는 상호작용을 연결했습니다.',
    points: [
      '행성 방향 중력과 구형 지면을 따라가는 캐릭터 이동',
      '거리와 가림을 확인하는 상호작용, 문 개폐와 물체 운반·놓기',
      '메뉴·지도·컴퓨터를 열고 닫을 때 시선과 이동 입력 복구',
    ],
    result:
      'P01 한 바퀴 자동 보행 코스에서 약 225.2m 이동과 출발점 복귀를 확인했습니다. 최근 주택 코스에서는 현관·계단·실내·야외 이동과 컴퓨터 사용 후 입력 복귀를 확인했습니다.',
    limit:
      '화면 일부는 이전 환경에서 촬영했습니다. 기존 보행·상호작용 구현과 현재 새 게임의 외형을 구분합니다.',
    date: '2026.11.18',
    cover: 0,
    tags: ['행성 중력', '1인칭 이동', '실물 운반'],
    sources: [
      'Docs/Development/CodeMap/캐릭터상호작용.md',
      'outputs/planet-walk-20261029/README.md',
      'outputs/home-polish-20261110/README.md',
    ],
    media: [
      {
        src: '/media/features/movement-01.webp',
        thumbnail: '/media/features/movement-01-thumb.webp',
        alt: 'P01 지면 보행 시작',
        caption:
          '2026-10-29 자동 입력 보행 코스의 실제 영상 프레임. 현재 주택 교체 이전 촬영본.',
        width: 640,
        height: 360,
      },
      {
        src: '/media/features/movement-02.webp',
        thumbnail: '/media/features/movement-02-thumb.webp',
        alt: '구형 행성의 다른 면',
        caption:
          '2026-10-29 실제 지형·나무·암릉 충돌을 유지한 자동 보행 중 촬영본.',
        width: 640,
        height: 360,
      },
      {
        src: '/media/features/movement-03.webp',
        thumbnail: '/media/features/movement-03-thumb.webp',
        alt: '곡면을 따라 걷기',
        caption:
          '2026-10-29 행성 한 바퀴 보행 검증 영상의 프레임. 사람이 직접 조종한 녹화는 아니다.',
        width: 640,
        height: 360,
      },
      {
        src: '/media/features/movement-04.webp',
        thumbnail: '/media/features/movement-04-thumb.webp',
        alt: '급유 노즐 운반 자세',
        caption:
          '기존 노즐 운반 자세 검토 촬영본. 현재 새 게임 진행과 최종 캐릭터 아트 완성 여부는 별개다.',
        width: 1600,
        height: 900,
      },
      {
        src: '/media/features/movement-05.webp',
        thumbnail: '/media/features/movement-05-thumb.webp',
        alt: '물체별 운반 자세',
        caption:
          '기존 종이팩 운반 자세 검토 촬영본. 물체를 드는 기능과 표현을 확인한 장면.',
        width: 1600,
        height: 900,
      },
      {
        src: '/media/features/movement-06.webp',
        thumbnail: '/media/features/movement-06-thumb.webp',
        alt: '현관에서 지형으로 이동',
        caption:
          '2026-11-10 실제 입력 경로 검증 화면. 현관·계단·야외 지면을 이어 이동했다.',
        width: 1298,
        height: 761,
      },
    ],
  },
  {
    slug: 'spaceship',
    number: '03',
    title: '공장에서 우주선으로',
    english: 'SPACESHIP & FLIGHT',
    status: '기존 기반 · 성장 연결은 후속',
    summary:
      '우주선의 조종과 내부 공간, 손상·수리 기반을 만들었습니다. 장기적으로는 공장 생산이 우주선 성장으로 이어지는 게임을 지향합니다.',
    points: [
      '기체 문과 조종석 탑승·기립, 이동·회전·착륙 판정',
      '항법·비행·하부 카메라·시스템 상태를 읽는 조종석 화면',
      '주유 연결, 기체 손상과 정비, 추력 소리와 카메라 반응',
    ],
    result:
      '기존 MULE 검증에서 시동·추력·지도 전환·기립과 수리·상태 표시를 확인했습니다. 아래 화면은 당시 기체 검토 및 기능 검증 촬영본입니다.',
    limit:
      '사진은 기존 MULE 기반 검증 기록입니다. 현재 새 게임에 초기 우주선을 무료로 생성하거나 첫 우주선 제작·개조가 연결된 상태는 아닙니다.',
    date: '2026.11.18',
    cover: 0,
    tags: ['MULE', '조종석', '비행 · 정비'],
    sources: [
      'Docs/Development/CodeMap/우주선.md',
      'outputs/no-initial-spaceship-20261105/README.md',
    ],
    media: [
      {
        src: '/media/features/spaceship-01.webp',
        thumbnail: '/media/features/spaceship-01-thumb.webp',
        alt: 'MULE 외관',
        caption:
          '2026-09-22 Unreal 적용 검토 촬영본. 현재 새 게임에는 초기 우주선이 생성되지 않는다.',
        width: 1440,
        height: 810,
      },
      {
        src: '/media/features/spaceship-02.webp',
        thumbnail: '/media/features/spaceship-02-thumb.webp',
        alt: 'MULE 실내와 통로',
        caption: '2026-09-22 기존 우주선 에셋의 Unreal 실내 검토 화면.',
        width: 1440,
        height: 810,
      },
      {
        src: '/media/features/spaceship-03.webp',
        thumbnail: '/media/features/spaceship-03-thumb.webp',
        alt: 'MULE 화물 공간',
        caption:
          '2026-09-22 기존 기체 내부 공간 검토. 연구 기반 신규 화물 개조 완료 화면은 아니다.',
        width: 1440,
        height: 810,
      },
      {
        src: '/media/features/spaceship-04.webp',
        thumbnail: '/media/features/spaceship-04-thumb.webp',
        alt: '조종석 시점',
        caption:
          '2026-09 기존 MULE 비행 피드백 검증 촬영본. 현재 새 게임 진행과 구분한다.',
        width: 1280,
        height: 720,
      },
      {
        src: '/media/features/spaceship-05.webp',
        thumbnail: '/media/features/spaceship-05-thumb.webp',
        alt: '기체 손상 계기',
        caption:
          '2026-09-14 실제 기체 손상 상태를 표시하는 시스템 계기 검증 화면.',
        width: 960,
        height: 360,
      },
      {
        src: '/media/features/spaceship-06.webp',
        thumbnail: '/media/features/spaceship-06-thumb.webp',
        alt: '부위 수리 진행',
        caption:
          '2026-09-14 정비 검증 준비 상태에서 홀드 수리를 확인한 장면. 자연 착륙 성공의 증거는 아니다.',
        width: 1280,
        height: 720,
      },
    ],
  },
  {
    slug: 'meteors',
    number: '04',
    title: '집 앞에 떨어진 첫 운석',
    english: 'METEORS & SIGNALS',
    status: '현재 시작 흐름',
    summary:
      '현관문을 처음 연 뒤 떨어지는 운석이 첫 자원이 됩니다. 낙하를 확인하고, 집의 곡괭이를 들고 직접 채굴하러 갑니다.',
    points: [
      '첫 현관문 개방 뒤 운석 낙하',
      '실제 운석을 곡괭이로 채굴',
      '기본 낙하 경고와 기존 위치 수신 기록',
    ],
    result:
      '첫 운석의 낙하·채굴과 기본 경고, 이전 유료 위치 수신 모듈의 동작을 각각 검증한 기록입니다.',
    limit:
      '폰 수신 모듈 사진은 이전 기능 검증 기록입니다. 새 시작의 첫 운석과 현재 기본 경고를 과거 유료 모듈 조건과 혼동하지 않도록 구분합니다.',
    date: '2026.11.18',
    cover: 2,
    tags: ['낙하 VFX', '접근 경고', '휴대폰 수신'],
    sources: [
      'Docs/Development/Tests/TEST74.md',
      'outputs/meteor-fab-vfx-20261107/README.md',
      'outputs/meteor-notification-nc-20261104/README.md',
    ],
    media: [
      {
        src: '/media/features/meteors-01.webp',
        thumbnail: '/media/features/meteors-01-thumb.webp',
        alt: '하늘에서 시작하는 낙하',
        caption:
          '2026-11-07 실제 도입 운석의 초기 낙하. 보유 Fab 파생 Niagara를 사용했다.',
        width: 1274,
        height: 682,
      },
      {
        src: '/media/features/meteors-02.webp',
        thumbnail: '/media/features/meteors-02-thumb.webp',
        alt: '비행 중 불꽃과 연기',
        caption:
          '2026-11-07 실제 낙하 중간 촬영. 운석을 보기 위한 관찰 카메라를 준비했다.',
        width: 1274,
        height: 682,
      },
      {
        src: '/media/features/meteors-03.webp',
        thumbnail: '/media/features/meteors-03-thumb.webp',
        alt: '지면에 접근하는 운석',
        caption:
          '2026-11-07 실제 도입 낙하 후반. 착지 평면 먼지는 11월 8일 후속에서 제거했다.',
        width: 1274,
        height: 682,
      },
      {
        src: '/media/features/meteors-04.webp',
        thumbnail: '/media/features/meteors-04-thumb.webp',
        alt: '새 착지 위치 수신',
        caption:
          '2026-11-04 수신 모듈 I 장착 후 실제 접촉 위치와 직선거리 표시 검증. 선행 생산은 시험 준비 상태다.',
        width: 1280,
        height: 720,
      },
      {
        src: '/media/features/meteors-05.webp',
        thumbnail: '/media/features/meteors-05-thumb.webp',
        alt: '크기별 알림 선별',
        caption:
          '2026-11-04 유료 수신 모듈 II 연구·제작·교체 후 폰 설정 검증 화면. 선행 재료는 시험 준비 상태다.',
        width: 1280,
        height: 720,
      },
      {
        src: '/media/features/meteors-06.webp',
        thumbnail: '/media/features/meteors-06-thumb.webp',
        alt: '접촉 후 운석',
        caption:
          '2026-11-08 실제 접촉 후 화면. 큰 평면 먼지판 제거를 확인한 촬영본.',
        width: 1274,
        height: 682,
      },
    ],
  },
  {
    slug: 'factory',
    number: '05',
    title: '원료 네 개로 세우는 첫 제작대',
    english: 'MINING & PRODUCTION',
    status: '현재 시작 흐름',
    summary:
      '직접 캔 운석 원료 4개로 간이 제작대를 건설합니다. 손 가공 없이 작업 공간을 세우고, 연구를 거쳐 첫 채굴 드론을 조립합니다.',
    points: [
      '개인 운석 원료 4개로 간이 제작대 건설',
      'LMB 한 번으로 5초 현장 건설 · 취소 시 미완료 무차감',
      '제작대 앞 E로 첫 드론 조립/수령',
    ],
    result:
      '현재 원료 직접 건설과 첫 연구/조립·수령 경로를 각각 실제 게임에서 확인했습니다.',
    limit:
      '현재 새 시작의 완료점은 제작대 건설과 첫 드론 조립·수령입니다. 기존 제련·전력·성형 설비 구현은 남아 있지만 새 시작의 자동 생산 연결은 후속입니다.',
    date: '2026.11.18',
    cover: 3,
    tags: ['채굴 드론', '전력망', '부품 생산'],
    sources: [
      'outputs/stage01-integrated-20261028/README.md',
      'outputs/starter-former-20261028/README.md',
      'outputs/recovery-dock-20261027/README.md',
    ],
    media: [
      {
        src: '/media/journal/mining.webp',
        thumbnail: '/media/journal/mining-thumb.webp',
        alt: '운석을 직접 채굴하는 순간',
        caption:
          'LMB를 꾹 누르면 곡괭이로 연속 채굴합니다. 2026.11.18 실제 화면.',
        width: 1280,
        height: 722,
      },
      {
        src: '/media/journal/ore.webp',
        thumbnail: '/media/journal/ore-thumb.webp',
        alt: '개인 인벤토리의 원료 네 개',
        caption:
          '채굴한 운석 원료 4개를 확인합니다. 손 가공 없이 바로 건설에 사용합니다.',
        width: 1280,
        height: 722,
      },
      {
        src: '/media/journal/build-menu.webp',
        thumbnail: '/media/journal/build-menu-thumb.webp',
        alt: '간이 제작대 건설 메뉴',
        caption:
          'B에서 간이 제작대를 선택합니다. 개인 운석 원료 4개와 현장 건설 5초가 필요합니다.',
        width: 1280,
        height: 722,
      },
      {
        src: '/media/journal/bench.webp',
        thumbnail: '/media/journal/bench-thumb.webp',
        alt: '직접 세운 첫 간이 제작대',
        caption:
          '위치를 정하고 LMB 한 번으로 건설을 시작하면 5초 뒤 완성됩니다. 2026.11.18 실제 화면.',
        width: 1280,
        height: 722,
      },
      {
        src: '/media/journal/bench-screen.webp',
        thumbnail: '/media/journal/bench-screen-thumb.webp',
        alt: '제작대에서 확인하는 드론 조립 조건',
        caption:
          '제작대 앞 E로 여는 현재 조립 화면. 연구와 원료를 갖추기 전에는 조립을 시작할 수 없습니다.',
        width: 1280,
        height: 722,
      },
      {
        src: '/media/journal/drone.webp',
        thumbnail: '/media/journal/drone-thumb.webp',
        alt: '조립을 마치고 수령을 기다리는 드론',
        caption:
          '2026.11.17 조립 검증 촬영본. 화면의 제작대 명칭은 현재 간이 제작대로 바뀌었으며, 연구·원료 4개·10초 조립·단일 수령 규칙은 유지됩니다.',
        width: 1280,
        height: 722,
      },
    ],
  },
  {
    slug: 'research',
    number: '06',
    title: '제작법을 발견하고, 직접 조립하기',
    english: 'RESEARCH & CRAFTING',
    status: '개인 원료 연구·첫 조립 연결',
    summary:
      '집 컴퓨터에서 원료 2개·10초로 첫 채굴 드론을 연구합니다. 이후 제작대에서 원료 4개를 지불하고 10초 동안 조립합니다.',
    points: [
      '개인 원료 2개·10초의 첫 연구',
      '연구 후 원료 4개·10초의 드론 조립',
      '조립 화면을 닫으면 일시정지 · 완성품 단일 수령',
    ],
    result:
      '개인 원료 지불·연구 해금·조립 시간·단일 수령과 저장 원장 보존을 확인했습니다.',
    limit:
      '연구 완료는 제작법 해금입니다. 카탈로그 전체의 표시가 모든 장비 효과나 현재 새 게임 진행의 완성을 뜻하지 않습니다.',
    date: '2026.11.18',
    cover: 0,
    tags: ['연구 트리', '실물 제작', '선택 건설'],
    sources: [
      'Docs/Development/Research_Core.md',
      'outputs/research-approved-20261028/README.md',
      'outputs/stage01-integrated-20261028/README.md',
    ],
    media: [
      {
        src: '/media/journal/research.webp',
        thumbnail: '/media/journal/research-thumb.webp',
        alt: '집 컴퓨터에서 완료한 첫 연구',
        caption:
          '2026.11.17 개인 원료 연구 검증 화면. 첫 연구의 원료 2개·10초 규칙은 현재도 유지됩니다.',
        width: 1280,
        height: 722,
      },
      {
        src: '/media/journal/bench-screen.webp',
        thumbnail: '/media/journal/bench-screen-thumb.webp',
        alt: '제작대에서 확인하는 드론 조립 조건',
        caption:
          '제작대 앞 E로 여는 현재 조립 화면. 연구와 원료를 갖추기 전에는 조립을 시작할 수 없습니다.',
        width: 1280,
        height: 722,
      },
      {
        src: '/media/journal/drone.webp',
        thumbnail: '/media/journal/drone-thumb.webp',
        alt: '조립을 마치고 수령을 기다리는 드론',
        caption:
          '2026.11.17 조립 검증 촬영본. 화면의 제작대 명칭은 현재 간이 제작대로 바뀌었으며, 연구·원료 4개·10초 조립·단일 수령 규칙은 유지됩니다.',
        width: 1280,
        height: 722,
      },
    ],
  },
  {
    slug: 'home',
    number: '07',
    title: '다시 돌아올 작은 집',
    english: 'HOME & OPERATIONS',
    status: '현재 적용',
    summary:
      '현관과 주방, 책상과 수납장이 있는 작은 집에서 시작합니다. 곡괭이를 들고 나가고, 돌아와 컴퓨터에서 첫 연구를 진행합니다.',
    points: [
      '현관문 개방으로 시작되는 첫 운석',
      '현관 수납장 옆의 곡괭이와 실제 E 줍기',
      '집 컴퓨터의 첫 연구',
    ],
    result:
      '현재 곡괭이의 실제 벽/바닥 접점·E 줍기와 기존 문 개방을 확인했습니다.',
    limit:
      '가구가 놓인 모습은 별도 생활 기능의 구현을 뜻하지 않습니다. 기존 공장 운영 화면과 현재 개인 원료 연구 경로는 구분합니다.',
    date: '2026.11.18',
    cover: 1,
    tags: ['P01 주택', '실내 배치', '본부 컴퓨터'],
    sources: [
      'outputs/home-polish-20261110/README.md',
      'outputs/home-residual-fix-20261110/README.md',
    ],
    media: [
      {
        src: '/media/journal/door.webp',
        thumbnail: '/media/journal/door-thumb.webp',
        alt: '현관문 앞에서 시작',
        caption:
          '집 현관문을 처음 열면 첫 운석의 낙하 대기가 시작됩니다. 2026.11.18 실제 화면.',
        width: 1280,
        height: 722,
      },
      {
        src: '/media/journal/pickaxe-wide.webp',
        thumbnail: '/media/journal/pickaxe-wide-thumb.webp',
        alt: '도구가 제자리를 찾은 집',
        caption:
          '사선으로 둔 곡괭이가 벽과 바닥에 닿도록 보정한 모습. 2026.11.18 실제 화면.',
        width: 1280,
        height: 722,
      },
      {
        src: '/media/journal/pickaxe.webp',
        thumbnail: '/media/journal/pickaxe-thumb.webp',
        alt: '집 안에 기대어 둔 곡괭이',
        caption:
          '현관 쪽 수납장 옆에서 E로 곡괭이를 줍습니다. 2026.11.18 최종 보정 화면.',
        width: 1280,
        height: 722,
      },
      {
        src: '/media/features/home-01.webp',
        thumbnail: '/media/features/home-01-thumb.webp',
        alt: 'P01 시작 주택 외관',
        caption:
          '2026-11-10 현재 목조 단층집의 Unreal 검토 촬영본. 외형 최종 승인은 별도다.',
        width: 1274,
        height: 682,
      },
      {
        src: '/media/features/home-02.webp',
        thumbnail: '/media/features/home-02-thumb.webp',
        alt: '현관과 실내 동선',
        caption:
          '2026-11-10 최종 저장본 검토 화면. 실제 문·계단·지형 이동을 별도 검증했다.',
        width: 1274,
        height: 682,
      },
      {
        src: '/media/features/home-03.webp',
        thumbnail: '/media/features/home-03-thumb.webp',
        alt: '작업 책상과 컴퓨터',
        caption:
          '2026-11-10 현재 집의 작업 자리 검토. 컴퓨터에서 연결된 공장 상태와 연구를 조회한다.',
        width: 1274,
        height: 682,
      },
    ],
  },
  {
    slug: 'interfaces',
    number: '08',
    title: '손에 익는 조작과 화면',
    english: 'INTERFACE & PERSISTENCE',
    status: '현재 적용 · 계속 개선',
    summary:
      'I는 인벤토리, B는 건설, 제작대 앞 E는 조립. 채굴은 꾹 누르고 건설은 한 번 클릭하는 입력으로 정리했습니다.',
    points: [
      '회전·확대·행성 선택이 가능한 태양계 지도와 항법 연결',
      '장비 인벤토리와 하단 9칸 핫바, 설치·취소·재보관',
      '생산·정지·만재 사유 조회와 별도 프로세스 저장 복원',
    ],
    result:
      '장비 GUID·생산 재고·연구 진행과 폰 설정의 복원을 단계별로 확인했습니다. 최근 주택 코스에서는 새 프로세스 이어하기 후 실제 카메라와 컴퓨터 사용·입력 복귀까지 확인했습니다.',
    limit:
      '지도와 일부 UI 이미지는 이전 검증 시점의 화면입니다. 저장은 현행 버전25와 콘텐츠 지문 정책을 따르며 모든 과거 저장의 호환을 뜻하지 않습니다.',
    date: '2026.11.18',
    cover: 1,
    tags: ['태양계 지도', '인벤토리', '저장 복원'],
    sources: [
      'Docs/Development/Research_Core.md',
      'Docs/Development/CodeMap/UI조명.md',
      'outputs/home-polish-20261110/README.md',
    ],
    media: [
      {
        src: '/media/journal/ore.webp',
        thumbnail: '/media/journal/ore-thumb.webp',
        alt: '개인 인벤토리의 원료 네 개',
        caption:
          '채굴한 운석 원료 4개를 확인합니다. 손 가공 없이 바로 건설에 사용합니다.',
        width: 1280,
        height: 722,
      },
      {
        src: '/media/journal/build-menu.webp',
        thumbnail: '/media/journal/build-menu-thumb.webp',
        alt: '간이 제작대 건설 메뉴',
        caption:
          'B에서 간이 제작대를 선택합니다. 개인 운석 원료 4개와 현장 건설 5초가 필요합니다.',
        width: 1280,
        height: 722,
      },
      {
        src: '/media/journal/bench-screen.webp',
        thumbnail: '/media/journal/bench-screen-thumb.webp',
        alt: '제작대에서 확인하는 드론 조립 조건',
        caption:
          '제작대 앞 E로 여는 현재 조립 화면. 연구와 원료를 갖추기 전에는 조립을 시작할 수 없습니다.',
        width: 1280,
        height: 722,
      },
      {
        src: '/media/features/interfaces-01.webp',
        thumbnail: '/media/features/interfaces-01-thumb.webp',
        alt: '태양계 지도',
        caption:
          '2026-09 실제 게임 지도 UI 검증 화면. 당시 행성 배치·재질 촬영본이다.',
        width: 1280,
        height: 720,
      },
      {
        src: '/media/features/interfaces-02.webp',
        thumbnail: '/media/features/interfaces-02-thumb.webp',
        alt: '지도를 회전하며 탐색',
        caption:
          '2026-09 실제 지도 카메라 회전 후 촬영. 최신 P02 외형과 구분한다.',
        width: 1600,
        height: 900,
      },
      {
        src: '/media/features/interfaces-03.webp',
        thumbnail: '/media/features/interfaces-03-thumb.webp',
        alt: '장비 인벤토리',
        caption:
          '2026-10-27 실제 게임 UI. 보유 장비와 설치 흐름을 기존 소유 기록에 연결했다.',
        width: 2566,
        height: 1480,
      },
    ],
  },
];
export const featureHref = (slug: string) => `/features/${slug}/`;
export const imageCount = features.reduce(
  (sum, feature) => sum + feature.media.length,
  0,
);
