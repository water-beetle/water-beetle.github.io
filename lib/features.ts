export interface FeatureMedia { src: string; thumbnail: string; alt: string; caption: string; width: number; height: number; }
export interface Feature { slug: string; number: string; title: string; english: string; status: string; summary: string; points: string[]; result: string; limit: string; date: string; cover: number; tags: string[]; sources: string[]; media: FeatureMedia[]; }
export const features: Feature[] = [
  {
    "slug": "planets",
    "number": "01",
    "title": "행성과 지형",
    "english": "PLANETS & TERRAIN",
    "status": "현재 적용 · 일부 시안",
    "summary": "구형 행성을 만들고, 운석이 닿은 자리에 실제로 땅이 파이도록 구현했습니다. 숲이 있는 P01과 회색 월면의 P02를 구성했습니다.",
    "points": [
      "시드와 프리셋을 사용하는 복셀 지형 생성, 거리별 메시와 충돌 준비",
      "운석 충돌에 따른 지형 편집과 변경 지형의 저장·복원",
      "P01 식생과 P02 다중 규모 크레이터·암반·근거리 조각층"
    ],
    "result": "P02 월면 단계에서 86.71m 보행과 운석에 의한 약 2.5m 추가 파임·저장 복원을 확인했습니다. 이후 조각층 시안에서도 20.10m 보행과 파임 후 재생성을 확인했습니다.",
    "limit": "조각층은 약 24×20m 한 구역 시안입니다. 원거리 경계, 초기 생성 비용과 최종 외형 승인은 남아 있습니다.",
    "date": "2026.11.11",
    "cover": 1,
    "tags": [
      "복셀 지형",
      "지형 편집",
      "PCG"
    ],
    "sources": [
      "Docs/Art/Planet/06_TERRAIN_PRESETS.md",
      "outputs/p02-layered-lunar-20261110/README.md",
      "outputs/p02-dense-cover-pilot-20261111/status.json"
    ],
    "media": [
      {
        "src": "/media/features/planets-01.webp",
        "thumbnail": "/media/features/planets-01-thumb.webp",
        "alt": "P01 구형 행성과 숲",
        "caption": "2026-10-28 환경 검토 화면. 작은 행성의 곡률과 식생을 확인한 촬영본.",
        "width": 1280,
        "height": 720
      },
      {
        "src": "/media/features/planets-02.webp",
        "thumbnail": "/media/features/planets-02-thumb.webp",
        "alt": "P02 월면 전체",
        "caption": "2026-11-11 월면 적용 단계의 실제 게임 화면. 이후 한 구역 조각층 시안이 추가됐다.",
        "width": 1820,
        "height": 815
      },
      {
        "src": "/media/features/planets-03.webp",
        "thumbnail": "/media/features/planets-03-thumb.webp",
        "alt": "P02 분화구 가장자리",
        "caption": "2026-11-11 최종 저장본 재로드 화면. 낮은 조각층은 약 24×20m 한 구역 시안이다.",
        "width": 1820,
        "height": 815
      },
      {
        "src": "/media/features/planets-04.webp",
        "thumbnail": "/media/features/planets-04-thumb.webp",
        "alt": "P02 작업 분지",
        "caption": "2026-11-11 실제 게임 화면. 지형 굴곡을 따르는 회색 조각층을 적용했다.",
        "width": 1820,
        "height": 815
      },
      {
        "src": "/media/features/planets-05.webp",
        "thumbnail": "/media/features/planets-05-thumb.webp",
        "alt": "P02 지표 근접",
        "caption": "2026-11-11 한 구역 시안의 근접 촬영. 원거리 경계와 초기 생성 비용은 개선 대상이다.",
        "width": 1820,
        "height": 815
      },
      {
        "src": "/media/features/planets-06.webp",
        "thumbnail": "/media/features/planets-06-thumb.webp",
        "alt": "운석으로 파인 지형",
        "caption": "2026-11-11 운석 추가 파임 뒤 조각층 재생성을 확인한 검증 화면.",
        "width": 1820,
        "height": 815
      }
    ]
  },
  {
    "slug": "movement",
    "number": "02",
    "title": "중력과 상호작용",
    "english": "MOVEMENT & INTERACTION",
    "status": "기반 구현",
    "summary": "작은 행성의 곡면을 따라 걷고, 문과 장비를 사용하고, 물건을 직접 들고 옮기는 기반을 만들었습니다. 도보와 조종 전환도 같은 캐릭터의 입력 흐름에서 처리합니다.",
    "points": [
      "행성 방향 중력과 구형 지면을 따라가는 캐릭터 이동",
      "거리와 가림을 확인하는 상호작용, 문 개폐와 물체 운반·놓기",
      "메뉴·지도·컴퓨터를 열고 닫을 때 시선과 이동 입력 복구"
    ],
    "result": "P01 한 바퀴 자동 보행 코스에서 약 225.2m 이동과 출발점 복귀를 확인했습니다. 최근 주택 코스에서는 현관·계단·실내·야외 이동과 컴퓨터 사용 후 입력 복귀를 확인했습니다.",
    "limit": "한 바퀴 화면은 2026년 10월 촬영본으로 현재 주택 교체 이전입니다. 자동 입력 보행 검증과 사람의 하드웨어 조작 검수는 구분합니다.",
    "date": "2026.11.10",
    "cover": 0,
    "tags": [
      "행성 중력",
      "1인칭 이동",
      "실물 운반"
    ],
    "sources": [
      "Docs/Development/CodeMap/캐릭터상호작용.md",
      "outputs/planet-walk-20261029/README.md",
      "outputs/home-polish-20261110/README.md"
    ],
    "media": [
      {
        "src": "/media/features/movement-01.webp",
        "thumbnail": "/media/features/movement-01-thumb.webp",
        "alt": "P01 지면 보행 시작",
        "caption": "2026-10-29 자동 입력 보행 코스의 실제 영상 프레임. 현재 주택 교체 이전 촬영본.",
        "width": 640,
        "height": 360
      },
      {
        "src": "/media/features/movement-02.webp",
        "thumbnail": "/media/features/movement-02-thumb.webp",
        "alt": "구형 행성의 다른 면",
        "caption": "2026-10-29 실제 지형·나무·암릉 충돌을 유지한 자동 보행 중 촬영본.",
        "width": 640,
        "height": 360
      },
      {
        "src": "/media/features/movement-03.webp",
        "thumbnail": "/media/features/movement-03-thumb.webp",
        "alt": "곡면을 따라 걷기",
        "caption": "2026-10-29 행성 한 바퀴 보행 검증 영상의 프레임. 사람이 직접 조종한 녹화는 아니다.",
        "width": 640,
        "height": 360
      },
      {
        "src": "/media/features/movement-04.webp",
        "thumbnail": "/media/features/movement-04-thumb.webp",
        "alt": "급유 노즐 운반 자세",
        "caption": "기존 노즐 운반 자세 검토 촬영본. 현재 새 게임 진행과 최종 캐릭터 아트 완성 여부는 별개다.",
        "width": 1600,
        "height": 900
      },
      {
        "src": "/media/features/movement-05.webp",
        "thumbnail": "/media/features/movement-05-thumb.webp",
        "alt": "물체별 운반 자세",
        "caption": "기존 종이팩 운반 자세 검토 촬영본. 물체를 드는 기능과 표현을 확인한 장면.",
        "width": 1600,
        "height": 900
      },
      {
        "src": "/media/features/movement-06.webp",
        "thumbnail": "/media/features/movement-06-thumb.webp",
        "alt": "현관에서 지형으로 이동",
        "caption": "2026-11-10 실제 입력 경로 검증 화면. 현관·계단·야외 지면을 이어 이동했다.",
        "width": 1298,
        "height": 761
      }
    ]
  },
  {
    "slug": "spaceship",
    "number": "03",
    "title": "우주선과 비행",
    "english": "SPACESHIP & FLIGHT",
    "status": "기존 기반 구현",
    "summary": "MULE 기체의 출입·조종·비행·착륙과 계기 표시를 구현했습니다. 연료와 배터리, 시동·퓨즈·부위 손상, 홀드 수리와 조종 피드백을 연결했습니다.",
    "points": [
      "기체 문과 조종석 탑승·기립, 이동·회전·착륙 판정",
      "항법·비행·하부 카메라·시스템 상태를 읽는 조종석 화면",
      "주유 연결, 기체 손상과 정비, 추력 소리와 카메라 반응"
    ],
    "result": "기존 MULE 검증에서 시동·추력·지도 전환·기립과 수리·상태 표시를 확인했습니다. 아래 화면은 당시 기체 검토 및 기능 검증 촬영본입니다.",
    "limit": "2026년 11월 5일부터 현재 새 게임의 초기 우주선 생성은 꺼져 있습니다. 연구로 첫 배를 제작하고 개조하는 성장 경로와 다행성 공장 운송은 후속 작업입니다.",
    "date": "2026.11.05",
    "cover": 0,
    "tags": [
      "MULE",
      "조종석",
      "비행 · 정비"
    ],
    "sources": [
      "Docs/Development/CodeMap/우주선.md",
      "outputs/no-initial-spaceship-20261105/README.md"
    ],
    "media": [
      {
        "src": "/media/features/spaceship-01.webp",
        "thumbnail": "/media/features/spaceship-01-thumb.webp",
        "alt": "MULE 외관",
        "caption": "2026-09-22 Unreal 적용 검토 촬영본. 현재 새 게임에는 초기 우주선이 생성되지 않는다.",
        "width": 1440,
        "height": 810
      },
      {
        "src": "/media/features/spaceship-02.webp",
        "thumbnail": "/media/features/spaceship-02-thumb.webp",
        "alt": "MULE 실내와 통로",
        "caption": "2026-09-22 기존 우주선 에셋의 Unreal 실내 검토 화면.",
        "width": 1440,
        "height": 810
      },
      {
        "src": "/media/features/spaceship-03.webp",
        "thumbnail": "/media/features/spaceship-03-thumb.webp",
        "alt": "MULE 화물 공간",
        "caption": "2026-09-22 기존 기체 내부 공간 검토. 연구 기반 신규 화물 개조 완료 화면은 아니다.",
        "width": 1440,
        "height": 810
      },
      {
        "src": "/media/features/spaceship-04.webp",
        "thumbnail": "/media/features/spaceship-04-thumb.webp",
        "alt": "조종석 시점",
        "caption": "2026-09 기존 MULE 비행 피드백 검증 촬영본. 현재 새 게임 진행과 구분한다.",
        "width": 1280,
        "height": 720
      },
      {
        "src": "/media/features/spaceship-05.webp",
        "thumbnail": "/media/features/spaceship-05-thumb.webp",
        "alt": "기체 손상 계기",
        "caption": "2026-09-14 실제 기체 손상 상태를 표시하는 시스템 계기 검증 화면.",
        "width": 960,
        "height": 360
      },
      {
        "src": "/media/features/spaceship-06.webp",
        "thumbnail": "/media/features/spaceship-06-thumb.webp",
        "alt": "부위 수리 진행",
        "caption": "2026-09-14 정비 검증 준비 상태에서 홀드 수리를 확인한 장면. 자연 착륙 성공의 증거는 아니다.",
        "width": 1280,
        "height": 720
      }
    ]
  },
  {
    "slug": "meteors",
    "number": "04",
    "title": "운석과 수신 알림",
    "english": "METEORS & SIGNALS",
    "status": "현재 적용",
    "summary": "첫 현관문을 열면 집 앞에 운석이 떨어지는 도입을 만들었습니다. 일반 운석의 낙하·접촉과 사전 경고, 휴대폰 기록·위치 수신·크기별 알림을 연결했습니다.",
    "points": [
      "첫 현관 개방 20초 뒤 착지, 도입·일반 운석의 8초 낙하와 불꽃·연기",
      "낙하 시작 5초 전 접근 경고, 실제 착지 후 알림과 최근 50건 기록",
      "실물 수신 모듈 I·II의 제작·장착과 위치·크기별 알림 선별"
    ],
    "result": "새 게임의 첫 착지·자연 낙하와 알림 중복 방지를 확인했습니다. 모듈 I·II는 유료 연구·제작·수령·장착 및 저장·별도 프로세스 이어하기를 검증했습니다.",
    "limit": "모듈 시험의 선행 재료와 관찰 위치는 명시적인 시험 준비 상태였습니다. 장기 관측 예보와 다른 행성의 원격 수신 확장은 후속입니다.",
    "date": "2026.11.08",
    "cover": 2,
    "tags": [
      "낙하 VFX",
      "접근 경고",
      "휴대폰 수신"
    ],
    "sources": [
      "Docs/Development/Tests/TEST74.md",
      "outputs/meteor-fab-vfx-20261107/README.md",
      "outputs/meteor-notification-nc-20261104/README.md"
    ],
    "media": [
      {
        "src": "/media/features/meteors-01.webp",
        "thumbnail": "/media/features/meteors-01-thumb.webp",
        "alt": "하늘에서 시작하는 낙하",
        "caption": "2026-11-07 실제 도입 운석의 초기 낙하. 보유 Fab 파생 Niagara를 사용했다.",
        "width": 1274,
        "height": 682
      },
      {
        "src": "/media/features/meteors-02.webp",
        "thumbnail": "/media/features/meteors-02-thumb.webp",
        "alt": "비행 중 불꽃과 연기",
        "caption": "2026-11-07 실제 낙하 중간 촬영. 운석을 보기 위한 관찰 카메라를 준비했다.",
        "width": 1274,
        "height": 682
      },
      {
        "src": "/media/features/meteors-03.webp",
        "thumbnail": "/media/features/meteors-03-thumb.webp",
        "alt": "지면에 접근하는 운석",
        "caption": "2026-11-07 실제 도입 낙하 후반. 착지 평면 먼지는 11월 8일 후속에서 제거했다.",
        "width": 1274,
        "height": 682
      },
      {
        "src": "/media/features/meteors-04.webp",
        "thumbnail": "/media/features/meteors-04-thumb.webp",
        "alt": "새 착지 위치 수신",
        "caption": "2026-11-04 수신 모듈 I 장착 후 실제 접촉 위치와 직선거리 표시 검증. 선행 생산은 시험 준비 상태다.",
        "width": 1280,
        "height": 720
      },
      {
        "src": "/media/features/meteors-05.webp",
        "thumbnail": "/media/features/meteors-05-thumb.webp",
        "alt": "크기별 알림 선별",
        "caption": "2026-11-04 유료 수신 모듈 II 연구·제작·교체 후 폰 설정 검증 화면. 선행 재료는 시험 준비 상태다.",
        "width": 1280,
        "height": 720
      },
      {
        "src": "/media/features/meteors-06.webp",
        "thumbnail": "/media/features/meteors-06-thumb.webp",
        "alt": "접촉 후 운석",
        "caption": "2026-11-08 실제 접촉 후 화면. 큰 평면 먼지판 제거를 확인한 촬영본.",
        "width": 1274,
        "height": 682
      }
    ]
  },
  {
    "slug": "factory",
    "number": "05",
    "title": "채굴과 공장 생산",
    "english": "MINING & PRODUCTION",
    "status": "P01 기본 코스 검증",
    "summary": "시작 원료로 채굴기를 연구·제작한 뒤, 운석 원료를 소재와 부품으로 바꾸는 첫 생산 코스를 연결했습니다. 장비 소유·설치·전력·재고와 생산 결과가 실제 상태로 이어집니다.",
    "points": [
      "기초 채굴기 제작·운반·배치와 운석 채굴 및 원료 입고",
      "제련기·전주·전선의 실제 전력 연결, 정전 시 작업 진행 보존",
      "회수 드론·독립 하역장의 충전과 부분 하역, 성형기의 소재→부품 생산"
    ],
    "result": "한 새 게임의 시작 원료 6개부터 유료 연구·제작·채굴·제련·전력·회수·성형을 거쳐 첫 부품 1개 인출까지 확인했습니다. 바닥 없이 생산한 뒤 선택 바닥을 검증했습니다.",
    "limit": "현재 통합 검증은 P01 지역 공급 범위입니다. 벨트 기반 생산 연결·새 게임의 구동 조립·다행성 생산망과 설비 최종 아트는 후속입니다.",
    "date": "2026.10.28",
    "cover": 4,
    "tags": [
      "채굴 드론",
      "전력망",
      "부품 생산"
    ],
    "sources": [
      "outputs/stage01-integrated-20261028/README.md",
      "outputs/starter-former-20261028/README.md",
      "outputs/recovery-dock-20261027/README.md"
    ],
    "media": [
      {
        "src": "/media/features/factory-01.webp",
        "thumbnail": "/media/features/factory-01-thumb.webp",
        "alt": "기초 채굴기 운반",
        "caption": "2026-10-26 실제 채굴 검증 영상의 프레임. 운석 앞에 기체를 다시 놓는 단계이며 초기 임시 표현을 사용한다.",
        "width": 384,
        "height": 256
      },
      {
        "src": "/media/features/factory-02.webp",
        "thumbnail": "/media/features/factory-02-thumb.webp",
        "alt": "기초 제련기 보유",
        "caption": "2026-10-27 유료 제작·설치와 수동 제련 검증 단계의 UI. 이후 제작대 외형이 개편됐다.",
        "width": 2560,
        "height": 1442
      },
      {
        "src": "/media/features/factory-03.webp",
        "thumbnail": "/media/features/factory-03-thumb.webp",
        "alt": "전력 장비 제작",
        "caption": "2026-10-28 새 게임 통합 코스의 전력 장비 화면. 실제 자원을 소비한 진행 상태다.",
        "width": 2560,
        "height": 1442
      },
      {
        "src": "/media/features/factory-04.webp",
        "thumbnail": "/media/features/factory-04-thumb.webp",
        "alt": "회수 드론과 독립 하역장",
        "caption": "2026-10-27 기능 검증 단계의 월드 촬영본. 기체·하역장 외형은 초기 기능용 표현이다.",
        "width": 1280,
        "height": 720
      },
      {
        "src": "/media/features/factory-05.webp",
        "thumbnail": "/media/features/factory-05-thumb.webp",
        "alt": "부품 성형기 설치",
        "caption": "2026-10-28 저장 복원 후 실제 설비와 출력 상태를 확인한 화면.",
        "width": 2560,
        "height": 1442
      },
      {
        "src": "/media/features/factory-06.webp",
        "thumbnail": "/media/features/factory-06-thumb.webp",
        "alt": "성형기와 부품 생산 상태",
        "caption": "2026-10-28 실제 유료 진행을 이어 부품 생산·인출을 확인한 화면.",
        "width": 2560,
        "height": 1442
      }
    ]
  },
  {
    "slug": "research",
    "number": "06",
    "title": "연구와 제작",
    "english": "RESEARCH & CRAFTING",
    "status": "공통 기반과 초반 실물 구현",
    "summary": "연구 트리에서 조건과 비용을 확인하고, 시간을 들여 제작법을 해금하는 흐름을 만들었습니다. 제작대에서 실제 재료를 소비해 장비를 조립하고 수령·설치합니다.",
    "points": [
      "선행 연구·다재료 비용·연구 시간과 완료 상태를 보여주는 트리",
      "제작대의 조립 진행·완성품 수령과 인벤토리 보유·설치",
      "선택 바닥의 설치·회수·같은 물건 재설치와 소유 ID 저장"
    ],
    "result": "연구 비용 차감·시간 진행·완료 해금과 진행 중 저장·복원을 확인했습니다. 초반 장비 코스와 수신 모듈은 실물 거래까지 검증했고, 바닥은 설치·보관 각각을 새 프로세스에서 복원했습니다.",
    "limit": "카탈로그의 119개 연구 정의와 실행 지원 115개는 모든 장비 효과의 완성을 뜻하지 않습니다. 고급 20재료 생산 설비와 다수 후반 장비 효과는 별도 구현 대상입니다.",
    "date": "2026.11.04",
    "cover": 0,
    "tags": [
      "연구 트리",
      "실물 제작",
      "선택 건설"
    ],
    "sources": [
      "Docs/Development/Research_Core.md",
      "outputs/research-approved-20261028/README.md",
      "outputs/stage01-integrated-20261028/README.md"
    ],
    "media": [
      {
        "src": "/media/features/research-01.webp",
        "thumbnail": "/media/features/research-01-thumb.webp",
        "alt": "연구 트리 전체 보기",
        "caption": "2026-10-28 실제 게임 연구 화면. 이후 위치 수신·크기 선별 연구가 추가됐다.",
        "width": 1286,
        "height": 760
      },
      {
        "src": "/media/features/research-02.webp",
        "thumbnail": "/media/features/research-02-thumb.webp",
        "alt": "시간이 흐르는 연구",
        "caption": "2026-10-28 실제 연구 진행 상태. 연구 완료는 제작법 해금이며 실물 지급과 구분한다.",
        "width": 1280,
        "height": 721
      },
      {
        "src": "/media/features/research-03.webp",
        "thumbnail": "/media/features/research-03-thumb.webp",
        "alt": "연구 완료 표시",
        "caption": "2026-10-28 실제 게임 완료 상태. 표시된 모든 고급 장비의 효과가 구현된 것은 아니다.",
        "width": 1280,
        "height": 721
      },
      {
        "src": "/media/features/research-04.webp",
        "thumbnail": "/media/features/research-04-thumb.webp",
        "alt": "제작대 조립 중",
        "caption": "2026-10-27 실제 제작대의 조립 진행 화면. 재료·시간·전력과 연결된다.",
        "width": 1274,
        "height": 716
      },
      {
        "src": "/media/features/research-05.webp",
        "thumbnail": "/media/features/research-05-thumb.webp",
        "alt": "완성품 수령",
        "caption": "2026-10-27 제작 완료 후 수령을 기다리는 실제 게임 UI.",
        "width": 1274,
        "height": 716
      },
      {
        "src": "/media/features/research-06.webp",
        "thumbnail": "/media/features/research-06-thumb.webp",
        "alt": "선택 바닥 보관",
        "caption": "2026-10-28 같은 GUID의 바닥 회수·보관·무상 재설치 검증 화면.",
        "width": 2560,
        "height": 1442
      }
    ]
  },
  {
    "slug": "home",
    "number": "07",
    "title": "집과 운영 본부",
    "english": "HOME & OPERATIONS",
    "status": "현재 적용",
    "summary": "P01의 시작 공간을 작은 목조 주택으로 구성하고, 작업 책상·독서 자리·주방과 식탁을 배치했습니다. 집 컴퓨터에서 연구와 연결된 공장의 가동·재고·정지 사유를 확인합니다.",
    "points": [
      "보유 Fab 주택을 활용한 외관과 현관·실내·야외 동선",
      "작업 책상·독서 의자·조명·소품과 실제 사용 공간 배치",
      "물리 컴퓨터 화면의 공장 조회·연구 열기·스크롤 및 입력 복귀"
    ],
    "result": "실제 입력 경로에서 현관 출입·컴퓨터 사용을 확인했습니다. 집 1곳·야외 2곳의 저장 복원과 새 프로세스 이어하기에서 위치와 실제 카메라 시선 복원을 검증했습니다.",
    "limit": "가구 배치와 검수용 앉은 카메라는 새로운 앉기·조리·식사 기능을 뜻하지 않습니다. 실내 외형의 사용자 최종 승인과 전체 성능 평가는 별도입니다.",
    "date": "2026.11.10",
    "cover": 0,
    "tags": [
      "P01 주택",
      "실내 배치",
      "본부 컴퓨터"
    ],
    "sources": [
      "outputs/home-polish-20261110/README.md",
      "outputs/home-residual-fix-20261110/README.md"
    ],
    "media": [
      {
        "src": "/media/features/home-01.webp",
        "thumbnail": "/media/features/home-01-thumb.webp",
        "alt": "P01 시작 주택 외관",
        "caption": "2026-11-10 현재 목조 단층집의 Unreal 검토 촬영본. 외형 최종 승인은 별도다.",
        "width": 1274,
        "height": 682
      },
      {
        "src": "/media/features/home-02.webp",
        "thumbnail": "/media/features/home-02-thumb.webp",
        "alt": "현관과 실내 동선",
        "caption": "2026-11-10 최종 저장본 검토 화면. 실제 문·계단·지형 이동을 별도 검증했다.",
        "width": 1274,
        "height": 682
      },
      {
        "src": "/media/features/home-03.webp",
        "thumbnail": "/media/features/home-03-thumb.webp",
        "alt": "작업 책상과 컴퓨터",
        "caption": "2026-11-10 현재 집의 작업 자리 검토. 컴퓨터에서 연결된 공장 상태와 연구를 조회한다.",
        "width": 1274,
        "height": 682
      },
      {
        "src": "/media/features/home-04.webp",
        "thumbnail": "/media/features/home-04-thumb.webp",
        "alt": "독서 자리와 창",
        "caption": "2026-11-10 의자·옆 탁자·조명·러그를 다듬은 검토 화면. 새 앉기 기능은 추가하지 않았다.",
        "width": 1274,
        "height": 682
      },
      {
        "src": "/media/features/home-05.webp",
        "thumbnail": "/media/features/home-05-thumb.webp",
        "alt": "주방과 1인 식탁",
        "caption": "2026-11-10 실내 배치 검토. 조리·식사 게임 시스템 완료를 의미하지 않는다.",
        "width": 1274,
        "height": 682
      },
      {
        "src": "/media/features/home-06.webp",
        "thumbnail": "/media/features/home-06-thumb.webp",
        "alt": "주택 전체 배치",
        "caption": "2026-11-10 검수 카메라로 본 실내 평면. 플레이어가 실제로 이용하는 동선을 대조했다.",
        "width": 1274,
        "height": 682
      }
    ]
  },
  {
    "slug": "interfaces",
    "number": "08",
    "title": "게임 UI와 저장",
    "english": "INTERFACE & PERSISTENCE",
    "status": "현재 적용 · 기반 검증",
    "summary": "태양계 지도와 장비 인벤토리, 핫바와 본부 화면을 실제 게임 상태에 연결했습니다. 장비 소유·재고·연구·변경 지형과 플레이어 위치를 저장하고 다시 이어가는 기반을 다듬었습니다.",
    "points": [
      "회전·확대·행성 선택이 가능한 태양계 지도와 항법 연결",
      "장비 인벤토리와 하단 9칸 핫바, 설치·취소·재보관",
      "생산·정지·만재 사유 조회와 별도 프로세스 저장 복원"
    ],
    "result": "장비 GUID·생산 재고·연구 진행과 폰 설정의 복원을 단계별로 확인했습니다. 최근 주택 코스에서는 새 프로세스 이어하기 후 실제 카메라와 컴퓨터 사용·입력 복귀까지 확인했습니다.",
    "limit": "지도 이미지는 이전 행성 외형의 촬영본입니다. 모든 구저장의 무조건적인 호환을 보장하지 않으며, 콘텐츠 변경 시 기존 지문 검사 정책을 따릅니다.",
    "date": "2026.11.10",
    "cover": 0,
    "tags": [
      "태양계 지도",
      "인벤토리",
      "저장 복원"
    ],
    "sources": [
      "Docs/Development/Research_Core.md",
      "Docs/Development/CodeMap/UI조명.md",
      "outputs/home-polish-20261110/README.md"
    ],
    "media": [
      {
        "src": "/media/features/interfaces-01.webp",
        "thumbnail": "/media/features/interfaces-01-thumb.webp",
        "alt": "태양계 지도",
        "caption": "2026-09 실제 게임 지도 UI 검증 화면. 당시 행성 배치·재질 촬영본이다.",
        "width": 1280,
        "height": 720
      },
      {
        "src": "/media/features/interfaces-02.webp",
        "thumbnail": "/media/features/interfaces-02-thumb.webp",
        "alt": "지도를 회전하며 탐색",
        "caption": "2026-09 실제 지도 카메라 회전 후 촬영. 최신 P02 외형과 구분한다.",
        "width": 1600,
        "height": 900
      },
      {
        "src": "/media/features/interfaces-03.webp",
        "thumbnail": "/media/features/interfaces-03-thumb.webp",
        "alt": "장비 인벤토리",
        "caption": "2026-10-27 실제 게임 UI. 보유 장비와 설치 흐름을 기존 소유 기록에 연결했다.",
        "width": 2566,
        "height": 1480
      },
      {
        "src": "/media/features/interfaces-04.webp",
        "thumbnail": "/media/features/interfaces-04-thumb.webp",
        "alt": "하단 9칸 핫바",
        "caption": "2026-10-27 실제 게임 HUD. 숫자 선택과 인벤토리·설치 상태를 연결했다.",
        "width": 2566,
        "height": 1480
      },
      {
        "src": "/media/features/interfaces-05.webp",
        "thumbnail": "/media/features/interfaces-05-thumb.webp",
        "alt": "본부의 실제 생산 조회",
        "caption": "2026-11-10 격리 검증 슬롯에서 상류 재료를 준비하고 실제 설비 전력·출력을 조회한 화면.",
        "width": 1455,
        "height": 818
      },
      {
        "src": "/media/features/interfaces-06.webp",
        "thumbnail": "/media/features/interfaces-06-thumb.webp",
        "alt": "새 프로세스 이어하기",
        "caption": "2026-11-10 별도 에디터 프로세스에서 야외 위치·실제 카메라·입력 복원을 확인한 화면.",
        "width": 1298,
        "height": 761
      }
    ]
  }
];
export const featureHref = (slug: string) => `/features/${slug}/`;
export const imageCount = features.reduce((sum, feature) => sum + feature.media.length, 0);
