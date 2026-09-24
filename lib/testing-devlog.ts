import type { Devlog } from './devlog';

export const testingDevlog: Devlog = {
  "id": "comet-tests-2026-09-09",
  "number": "007",
  "title": "걷기부터 왕복 비행까지 테스트 코스를 묶었다",
  "summary": "같은 저장 맵에서 다섯 코스를 반복 실행한다. 기본·도보·저공·왕복은 통과했고, 160m/s 고속 목표는 아직 실패다.",
  "tags": [
    "자동 테스트",
    "플레이 검증",
    "성능 기록"
  ],
  "date": "2026.09.09",
  "media": {
    "kind": "image",
    "src": "/media/2026-09-09/roundtrip-after-course.png",
    "alt": "행성 왕복 코스를 마친 뒤 우주선 선실 안에서 바라본 둥근 출입구와 계기판",
    "caption": "2026.09.09 왕복 코스의 CSV 측정 종료 후 저장한 실제 Unreal PIE 화면 · 관측 뷰포트 910×349. 전체 비행 장면을 촬영한 영상이나 고속 목표 달성의 증거는 아닙니다.",
    "width": 910,
    "height": 349
  },
  "sections": [
    {
      "title": "",
      "text": "지형이나 물리를 고칠 때마다 비슷한 외출을 다시 해야 했다. 조금 걷고, 조종석에 앉고, 떠났다가 돌아오는 과정이다. 손으로 하면 매번 경로가 달라져 전후를 비교하기 어려웠다.\n\n그래서 저장 맵에서 같은 순서를 실행하는 공용 테스트를 묶었다. 실행과 기록 수집, 결과 분석을 한 진입점으로 모았다. 9월 9일 기록 기준으로 기본·도보·저공·왕복 코스는 통과했다. 고속 코스는 목표 속도에 도달하지 못했다.",
      "media": [
        {
          "kind": "image",
          "src": "/media/2026-09-09/roundtrip-after-course.png",
          "alt": "행성 왕복 코스를 마친 뒤 우주선 선실 안에서 바라본 둥근 출입구와 계기판",
          "caption": "2026.09.09 왕복 코스의 CSV 측정 종료 후 저장한 실제 Unreal PIE 화면 · 관측 뷰포트 910×349. 전체 비행 장면을 촬영한 영상이나 고속 목표 달성의 증거는 아닙니다.",
          "width": 910,
          "height": 349
        }
      ]
    },
    {
      "title": "다섯 코스",
      "text": "짧은 시작 확인부터 긴 왕복까지 나눴다. 바꾼 기능에 해당하는 코스를 골라 실행한다. Run-CometTests.ps1이 준비와 순차 실행을, course.py가 플레이를, analyze.py가 판정과 요약을 맡는다.",
      "table": {
        "caption": "공용 실행기에서 선택하는 검사 코스",
        "columns": [
          "프로필",
          "플레이 흐름",
          "확인하려는 것"
        ],
        "rows": [
          [
            "smoke",
            "저장 맵 시작 → 짧은 정지 관찰 → 수집 종료",
            "플레이어의 지면 지지, 함선 착륙 상태, CSV·화면 기록이 함께 준비되는가"
          ],
          [
            "walking",
            "공통 시작 상태 → 집 주변에서 이동 입력 6초",
            "실제로 이동했고 관측 중 지면 지지가 유지되는가"
          ],
          [
            "low-flight",
            "도보 → 착석 → 약 7m 상승 목표 → 약 10m 횡이동 목표",
            "착석과 이륙이 연결되고 실제 물리 비행으로 목표 주변에 머무르는가"
          ],
          [
            "roundtrip",
            "도보·저공 → A 이탈 → B 접근·체류·이탈 → A 귀환·착륙 → 기립",
            "행성 사이를 왕복한 뒤 캐릭터 조작으로 돌아오는가"
          ],
          [
            "high-speed",
            "가속할 출발 경로를 길게 확보한 뒤 왕복",
            "관측 상대속도 156.8m/s 이상을 물리 시간 3초 연속 유지하는가"
          ]
        ]
      }
    },
    {
      "title": "통과했다고 60FPS라는 뜻은 아니다",
      "text": "기능 코스의 통과와 성능 목표는 따로 봐야 한다. 왕복이 끝났어도 도중에 긴 프레임이 있었다면 그 기록은 남긴다. 창 크기도 같이 기록한다. 이때 관측된 뷰포트는 910×349였으므로 1440p 결과로 읽으면 안 된다.\n\n고속 코스는 160m/s 목표에 못 미쳤다. 관측 속도는 약 79.34m/s였다. 별도 75m/s 코스의 성공으로 이 실패를 덮지 않았다."
    },
    {
      "title": "실행 명령",
      "text": "프로젝트 루트에서 아래 실행기를 쓴다. Unreal Editor를 닫고, C++을 바꿨다면 먼저 Editor 빌드를 갱신해야 한다. 실행기는 자동 빌드 없이 현재 DLL을 사용한다.\n\n처음에는 smoke로 시작 상태를 보고, 변경에 따라 walking·low-flight·roundtrip을 고른다. all은 다섯 코스를 별도 에디터 세션에서 순서대로 실행한다. 기존 Editor와 공용 실행 잠금을 확인해 동시 실행을 막는다.",
      "code": {
        "caption": "PowerShell · Comet 프로젝트 루트에서 실행",
        "value": "./Source/Comet/Tests/Run-CometTests.ps1 -List\n./Source/Comet/Tests/Run-CometTests.ps1 -Profile smoke\n./Source/Comet/Tests/Run-CometTests.ps1 -Profile walking\n./Source/Comet/Tests/Run-CometTests.ps1 -Profile low-flight\n./Source/Comet/Tests/Run-CometTests.ps1 -Profile roundtrip\n./Source/Comet/Tests/Run-CometTests.ps1 -Profile high-speed -TargetSpeedMps 160 -HoldSeconds 3\n\n# 다섯 코스를 순차 실행\n./Source/Comet/Tests/Run-CometTests.ps1 -Profile all"
      }
    },
    {
      "title": "전후 비교",
      "text": "양쪽 코스가 통과하고 프로필·설정·실제 뷰포트·렌더 크기·테스트 코드·맵·에셋·엔진·장비 조건이 맞아야 비교한다. 최적화 대상인 게임 코드와 DLL 변경은 허용한다. 고속 실패 기록은 성공한 실행과의 정식 비교에 넣지 않는다.\n\n조건이 같아도 비행 궤적과 캐시, 백그라운드 실행은 달라질 수 있다. 한 번의 평균으로 끝내지 않고 반복 실행과 느린 프레임을 같이 본다.",
      "code": {
        "caption": "Python · 기존 실행 기록의 비교와 분석기 단위 검사",
        "value": "python Source/Comet/Tests/Runtime/analyze.py outputs/comet-tests/BEFORE/walking --compare-to outputs/comet-tests/AFTER/walking\n\npython -m unittest discover -s Source/Comet/Tests/Runtime -p \"test_*.py\" -v"
      }
    },
    {
      "title": "고속 코스에서 다음에 볼 것",
      "text": "관측 가속도 1,200cm/s²와 코드의 선형 감쇠 기본값 0.15를 놓고 계산하면 약 80m/s가 나온다는 메모가 있다. 관측값과 가깝지만 아직 원인으로 확정하지 않았다. 실제 몸체에 적용된 값과 Blueprint 재정의, 힘을 넣는 경로를 확인해야 한다.\n\n다른 행성 표면 착륙, 저장·불러오기, 하드웨어 키 입력과 패키징 플레이는 이 코스의 확인 범위 밖이다. 아래 자료는 9월 9일 실행 기록의 발췌다."
    }
  ],
  "sources": [
    {
      "label": "2026.09.09 테스트 결과 공개용 발췌",
      "href": "/testing/evidence-2026-09-09.json",
      "detail": "다섯 코스의 실행 ID, 판정, 실제 뷰포트, 프레임 시간과 고속 관측값. 원본 보고서·관련 코드의 SHA-256을 포함하며 프로젝트 상대 경로를 사용합니다."
    },
    {
      "label": "Tests/README.md · Run-CometTests.ps1 · Runtime/scenarios.json",
      "detail": "Comet 소스 모듈 기준. 실행 방법, 다섯 코스의 범위, 기본 설정, 현재 DLL 사용, 동시 실행 방지와 기록 보존 규칙을 확인했습니다."
    },
    {
      "label": "Tests/Runtime/course.py · metrics.py · analyze.py",
      "detail": "실제 플레이 단계와 허용 조건, 질량중심 기준 상대속도, 연속 유지 판정, CSV 프레임 정렬, 통계와 비교 조건의 근거입니다."
    },
    {
      "label": "Tests/Runtime/test_metrics.py · test_analyze.py",
      "detail": "판정과 기록 처리의 단위 검사 8개. 통과 여부는 프로젝트 outputs/common-tests-20260909/unit-tests.txt, 실행별 결과의 선택과 한계는 같은 폴더의 validation.md를 확인했습니다."
    }
  ]
};
