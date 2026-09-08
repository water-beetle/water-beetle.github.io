import type { OptimizationPost } from './types';

export const terrainPosts = [
  {
    "slug": "voxel-build-budget",
    "number": "01",
    "topic": "복셀 · 비동기 · 작업 예산",
    "title": "행성을 만드는 일을 한 프레임에 끝낼 수는 없다",
    "summary": "복셀 지형이 만들어지는 경로부터 읽습니다. 계산을 다른 스레드로 옮긴 뒤에도 왜 끊길 수 있는지, 작업 대기열과 최신성 검사가 각각 무엇을 해결하는지 살펴봅니다.",
    "startingPoint": "행성 생성이라는 짧은 호출 안에 밀도 계산, 삼각형 생성, 화면 반영이 모두 들어 있다.",
    "result": "계산과 반영을 분리하고, 프레임별 작업량과 오래된 결과의 적용을 제어한다.",
    "sections": [
      {
        "id": "terrain",
        "title": "1. 먼저, 우리가 만드는 지형은 무엇인가",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "이 게임의 행성은 완성된 구 모양 모델 하나를 불러오는 방식만으로 만들어지지 않습니다. 공간을 격자로 나누고, 각 지점이 땅 안인지 밖인지 나타내는 밀도를 계산한 뒤 그 경계에 삼각형을 만듭니다. 경계 추출은 Marching Cubes가 담당합니다. 플레이어가 땅을 파는 Sculpt도 밀도 데이터를 바꿔 지형에 반영합니다."
          },
          {
            "kind": "paragraph",
            "text": "행성 전체를 하나로 처리하면 수정한 곳이 작아도 거대한 지형을 다시 다뤄야 합니다. 그래서 공간을 청크로 나눕니다. 복셀은 밀도를 계산하는 격자 단위이고, 청크는 여러 복셀을 묶어 관리하는 단위입니다. 청크별로 계산하면 가까운 곳을 먼저 준비하고 수정된 곳만 다시 만들 수 있습니다."
          },
          {
            "kind": "flow",
            "label": "지형 생성의 책임 분리",
            "steps": [
              "APlanet: 프리셋 적용",
              "UVoxelManager: 요청과 순서 관리",
              "UVoxelChunk: 밀도·메시 데이터 계산",
              "게임 스레드: DynamicMesh에 반영"
            ]
          },
          {
            "kind": "note",
            "title": "이 편의 기록 범위",
            "text": "비동기 청크 생성은 초기 소스에도 있던 기반 구조입니다. 현재 코드를 읽기 위한 출발점이며, 특정 날짜에 단일 스레드 구현을 전부 교체했다고 재구성한 작업일지는 아닙니다. 초기 구현의 전후 FPS 자료는 확보하지 않았습니다."
          }
        ]
      },
      {
        "id": "time",
        "title": "2. 전체 생성 시간과 플레이 중 끊김은 다르다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "게임 스레드는 입력 처리, 캐릭터 이동, 상태 변경 같은 일을 진행합니다. 여기에 많은 청크의 계산과 메시 반영을 한꺼번에 넣으면 다음 화면을 준비하는 시간이 길어집니다. 예를 들어 한 프레임에 100ms가 걸리면 그 순간 화면 갱신이 약 0.1초 지연될 수 있습니다. 이 100ms는 설명용 예시이며 프로젝트 측정값은 아닙니다."
          },
          {
            "kind": "paragraph",
            "text": "전체 준비가 1초 걸려도 일을 잘게 나누면 조작을 이어갈 수 있습니다. 반대로 전체 준비 시간이 짧아도 한 프레임에 몰리면 크게 끊깁니다. 목표는 총 계산량을 줄이는 것과 함께 지금 프레임이 감당할 작업량을 관리하는 것입니다."
          },
          {
            "kind": "paragraph",
            "text": "60FPS의 프레임 간격은 1000 ÷ 60, 약 16.67ms입니다. 이동, 물리, UI, 렌더링도 이 시간 안에서 진행돼야 하므로 지형 작업에는 별도의 작은 시간 예산을 둡니다. 생성 속도를 무조건 높이는 것보다 플레이에 필요한 여유를 남기는 선택입니다."
          }
        ]
      },
      {
        "id": "worker",
        "title": "3. 계산은 워커로, 오브젝트 반영은 게임 스레드로",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "EnqueueBuildTask는 노이즈 설정, 행성 반지름, 해당 청크의 Sculpt 수정값을 복사해 작업에 넘깁니다. 이 묶음을 스냅샷이라고 부릅니다. 워커가 원본 설정을 계속 읽으면 계산 중간에 설정이 바뀌어 앞부분과 뒷부분을 다른 조건으로 만들 수 있습니다. 복사한 입력을 사용하면 한 작업은 같은 조건을 끝까지 사용합니다."
          },
          {
            "kind": "code",
            "label": "호출 흐름을 줄인 의사 코드 · 그대로 컴파일하는 코드는 아닙니다",
            "code": "설정과 수정 밀도를 복사한다\n워커에서:\n    결과 = GenerateChunkData(복사한 입력)\n게임 스레드로 돌아와서:\n    PushCompletedResult(결과, 요청 정보)\n지형 갱신에서:\n    GenerateCompletedChunk()",
            "source": "Planet/Voxel/VoxelManager.cpp · EnqueueBuildTask / GenerateCompletedChunk"
          },
          {
            "kind": "paragraph",
            "text": "UE::Tasks::Launch는 밀도와 메시 데이터 계산을 시작합니다. 계산이 끝나면 AsyncTask(ENamedThreads::GameThread, …)를 통해 결과를 전달합니다. 실제 청크 컴포넌트에 적용하는 경로는 게임 스레드에 남깁니다. 이 구현의 게임 오브젝트 접근을 워커로 통째로 옮기는 방식은 아닙니다."
          },
          {
            "kind": "paragraph",
            "text": "MoveTemp는 큰 결과 배열을 넘길 때 불필요한 복사를 피하려는 장치입니다. ManagerPtr은 약한 참조로, 계산하는 동안 관리자가 없어졌는지 완료 시점에 확인할 수 있게 합니다. 계산이 성공했다고 그 결과를 받을 대상까지 살아 있다는 보장은 없기 때문입니다."
          }
        ]
      },
      {
        "id": "limits",
        "title": "4. 비동기로 바꿔도 일을 무제한 시작하면 다시 밀린다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "청크 수만큼 동시에 계산을 시작하면 CPU와 메모리에 부담이 몰리고 결과도 한꺼번에 돌아올 수 있습니다. 따라서 아직 시작하지 않은 요청은 PendingBuildRequests에 두고, 이번 프레임에 새로 시작할 수와 동시에 진행할 수를 따로 제한합니다."
          },
          {
            "kind": "table",
            "caption": "현재 C++ 선언 기본값 · 저장 에셋에서 달라질 수 있습니다",
            "columns": [
              "설정",
              "기본값",
              "제한하는 것"
            ],
            "rows": [
              [
                "MaxTasksLaunchedPerFrame",
                "2",
                "한 프레임에 새로 시작할 계산"
              ],
              [
                "MaxConcurrentBuildTasks",
                "8",
                "동시에 진행 중인 계산"
              ],
              [
                "MaxChunksPerFrame",
                "20",
                "한 프레임에 완료 큐에서 처리할 결과"
              ],
              [
                "ChunkProcessingTimeBudgetMs",
                "2ms",
                "완료 결과 처리 시간 예산"
              ],
              [
                "LODUpdateInterval",
                "0.2초",
                "거리별 해상도 판단 간격"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "이미 8개가 계산 중이면 이번 프레임에 2개를 더 시작할 수 없습니다. 반대로 계산 중인 작업이 없어도 한 번에 8개를 채우지 않고 최대 2개만 시작합니다. 두 제한은 순간적인 작업 폭증과 지속적인 과부하를 서로 다른 방향에서 막습니다."
          },
          {
            "kind": "paragraph",
            "text": "현재 cpp는 플레이어와의 거리를 갱신하고, 먼 요청부터 정렬한 다음 배열 끝에서 꺼내 가까운 청크를 먼저 처리합니다. 헤더 주석에는 min-heap이라는 설명이 남아 있지만 실제 구현은 Sort와 Pop입니다. 이 글은 실행되는 cpp를 기준으로 설명합니다."
          }
        ]
      },
      {
        "id": "apply",
        "title": "5. 계산이 끝난 것과 화면에 반영된 것은 다르다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "완료 결과는 CompletedChunkDataQueue에 쌓입니다. GenerateCompletedChunk는 하나씩 꺼내 유효성을 확인하고 메시를 적용한 다음 개수와 시간 제한을 검사합니다. 워커가 먼저 끝났다고 화면에 당장 전부 반영하지는 않습니다."
          },
          {
            "kind": "code",
            "label": "실제 코드 발췌 · 결과 하나를 처리한 뒤 검사",
            "code": "const bool bReachedCountLimit = MaxChunksPerFrame > 0 && ProcessedCount >= MaxChunksPerFrame;\nconst bool bReachedTimeLimit = TimeBudgetSeconds > 0.0 && (FPlatformTime::Seconds() - StartTime) >= TimeBudgetSeconds;\n\nif (bReachedCountLimit || bReachedTimeLimit)\n    break;",
            "source": "Planet/Voxel/VoxelManager.cpp · GenerateCompletedChunk"
          },
          {
            "kind": "paragraph",
            "text": "||는 둘 중 하나라도 참이면 멈춘다는 뜻입니다. 처리 개수를 채워도 멈추고 시간이 먼저 소진돼도 멈춥니다. 남은 결과는 큐에 남아 다음 프레임에 이어집니다."
          },
          {
            "kind": "note",
            "title": "2ms는 절대 상한이 아닙니다",
            "text": "검사는 결과 하나를 처리한 뒤에 합니다. 메시 반영 하나가 오래 걸리면 2ms를 넘을 수 있습니다. 실행 중인 일을 강제로 중단하는 방식이 아니라, 결과 사이에서 다음 작업을 시작할지 결정하는 방식입니다."
          }
        ]
      },
      {
        "id": "revision",
        "title": "6. 그런데 늦게 끝난 작업이 최신 지형을 덮어쓸 수 있다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "플레이어가 가까이 있을 때 고해상도를 요청했다가 멀어져 저해상도를 요청했다고 생각해 봅시다. 먼저 시작한 고해상도 작업이 나중에 끝날 수 있습니다. 또는 땅을 판 직후, 땅을 파기 전의 입력으로 만든 결과가 돌아올 수 있습니다. 이는 비동기 처리에서 방지해야 하는 경우이며, 모든 예시가 실제 플레이에서 재현됐다는 뜻은 아닙니다."
          },
          {
            "kind": "paragraph",
            "text": "LOD 숫자만 비교해도 충분하지 않습니다. 땅을 파기 전과 후가 모두 LOD 1일 수 있습니다. 그래서 월드 전체 생성의 세대인 WorldGeneration과 청크 요청 번호인 BuildRevision을 함께 사용합니다. 세대는 행성 재생성 전후를 구분하고, revision은 같은 청크에 더 최신 요청이 있었는지 구분합니다."
          },
          {
            "kind": "code",
            "label": "실제 조건식 발췌",
            "code": "CompletedRequest.BuildResult.IsSet()\n    && Chunk->IsBuildRequestCurrent(CompletedRequest.Info)",
            "source": "Planet/Voxel/VoxelManager.cpp · GenerateCompletedChunk"
          },
          {
            "kind": "paragraph",
            "text": "결과가 있고 현재 요청에 해당할 때만 적용합니다. 시작 전의 같은 청크 요청은 최신 하나만 남기고, 이미 진행 중인 옛 계산은 돌아온 뒤 최신성 검사에서 걸러냅니다. 모든 옛 작업을 즉시 취소하는 구조와는 다릅니다."
          }
        ]
      },
      {
        "id": "complete",
        "title": "7. 같은 청크를 두 번 만들었다고 완료 개수를 두 번 세면 안 된다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "결과가 적용될 때마다 완료 개수에 1을 더하면, LOD 변경으로 같은 청크를 두 번 만든 것을 서로 다른 청크 두 개처럼 셀 수 있습니다. 다른 청크가 아직 준비되지 않았는데 전체 생성이 끝났다고 판단할 위험입니다."
          },
          {
            "kind": "paragraph",
            "text": "InitiallyBuiltChunks는 중복을 허용하지 않는 TSet입니다. 현재 세대에서 최초 메시 적용까지 마친 청크 인덱스를 넣고 집합 크기로 완료 개수를 셉니다. 하나의 청크가 여러 번 만들어져도 최초 완료에는 한 번만 기여합니다. 전체가 준비되면 재질 높이 범위를 계산하고 완료 이벤트를 보냅니다."
          },
          {
            "kind": "paragraph",
            "text": "여기서 완료는 최초 메시 적용까지의 완료입니다. 모든 위치의 물리 충돌이 최신으로 준비됐다는 뜻과는 다릅니다. 7편에서 우주선과 화물이 지형에 접근할 때 이 차이가 다시 중요해집니다."
          }
        ]
      },
      {
        "id": "next",
        "title": "8. 생성 부담은 나눴지만, 만들어진 행성은 계속 움직인다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "여기까지는 지형을 만들거나 다시 만드는 순간의 부하를 제어했습니다. 그런데 행성은 자전하고 공전합니다. 생성이 끝났어도 행성에 붙은 수많은 청크의 변환과 관련 장면 상태가 계속 갱신될 수 있습니다. 생성 최적화와 이동 최적화는 서로 다른 문제입니다."
          },
          {
            "kind": "paragraph",
            "text": "다음 편에서는 이 차이 때문에 등장한 원거리 프록시를 읽습니다. 먼 행성의 상세 지형을 잠시 장면에서 내리면 이동 부담을 줄일 수 있지만, 돌아왔을 때 위치·회전·크기를 정확히 복원하는 문제가 따라옵니다."
          }
        ]
      }
    ],
    "sources": [
      {
        "label": "현재 소스 · 2026.09.08 확인",
        "detail": "Planet/Voxel/VoxelManager.h/.cpp — RequestChunkBuild, ProcessBuildRequests, EnqueueBuildTask, GenerateCompletedChunk, CompleteInitialBuildIfReady. 기본값은 C++ 선언값입니다."
      },
      {
        "label": "이력 확인",
        "detail": "초기 소스와 2026.09.04 e59e435를 비교했습니다. 비동기 큐를 해당 최적화 커밋에서 새로 만들었다고 서술하지 않았습니다."
      }
    ]
  },
  {
    "slug": "distant-planet-proxy",
    "number": "02",
    "topic": "LOD · 원거리 프록시 · 좌표 복원",
    "title": "멀리 있는 행성까지 상세 지형으로 움직여야 할까",
    "summary": "상세 청크를 원거리 표시용 메시로 바꿨습니다. 하지만 돌아왔을 때 지형이 갈라질 수 있어, 분리와 재연결의 좌표·회전·충돌 준비를 함께 다뤄야 했습니다.",
    "startingPoint": "화면에서 작게 보이는 먼 행성도 수백 개의 상세 청크를 데리고 움직인다.",
    "result": "원거리에서는 병합 메시를 사용하고, 근거리 복귀 때 상세 지형을 정확히 재연결한다.",
    "sections": [
      {
        "id": "problem",
        "title": "1. 작은 점처럼 보여도 내부 구조는 작아지지 않는다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "1편의 예산은 생성 부담을 나눴습니다. 그러나 생성이 끝난 먼 행성의 청크도 엔진에 등록된 채 행성을 따라 움직입니다. 화면에 보이는 크기가 작아져도 컴포넌트 수와 부모·자식 갱신 관계는 자동으로 줄지 않습니다."
          },
          {
            "kind": "paragraph",
            "text": "2026년 9월 4일 최적화 커밋 e59e435에는 RuntimeProxyMesh와 청크 휴면 처리가 추가됐습니다. 먼 행성의 외형을 하나의 StaticMesh로 묶어 표시하고 상세 복셀 컴포넌트는 활성 장면에서 잠시 빼는 접근입니다. 프록시는 원본을 대신 표시하는 메시를 뜻합니다."
          },
          {
            "kind": "paragraph",
            "text": "밀도 데이터나 플레이어가 판 기록까지 버리는 기능은 아닙니다. 편집 데이터를 보관하는 수명과 지금 화면·물리에 참여하는 수명을 분리합니다. 그래야 다시 다가왔을 때 상세 지형으로 돌아갈 수 있습니다."
          }
        ]
      },
      {
        "id": "lod",
        "title": "2. 해상도를 줄이는 것과 객체 수를 줄이는 것",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "이 프로젝트의 복셀 LOD 값은 샘플링 간격입니다. 1이 가장 촘촘하고 큰 값일수록 성깁니다. 현재 C++의 프록시용 기본 간격은 8입니다. 이것이 곧 8배 빠르다는 뜻은 아닙니다. 실제 삼각형 수와 비용은 지형 형태 및 후속 처리에 달려 있습니다."
          },
          {
            "kind": "paragraph",
            "text": "프록시는 각 청크의 해상도를 낮추는 데서 더 나아가, 청크 메시를 행성 내부 좌표로 모아 하나의 표시용 메시를 만듭니다. 상세 청크는 분리합니다. 표면 정밀도와 함께 엔진이 관리하는 활성 구조를 바꾸는 것입니다."
          },
          {
            "kind": "flow",
            "label": "원거리 전환 개념",
            "steps": [
              "멀어짐 감지",
              "프록시용 LOD 요청",
              "해당 빌드 완료 대기",
              "병합 메시 생성",
              "프록시 표시·청크 휴면"
            ]
          },
          {
            "kind": "note",
            "title": "전환 자체도 작업입니다",
            "text": "BakeRuntimeProxyMesh는 실제 메시 구성 작업입니다. 캐시와 dirty 상태를 이용하지만 전환 비용이 0이 되는 것은 아닙니다. 전환 순간의 끊김은 평소 프레임 비용과 별도로 봐야 합니다."
          }
        ]
      },
      {
        "id": "thresholds",
        "title": "3. 같은 거리에서 켰다 껐다 반복하지 않도록",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "전환 경계를 하나만 두면 그 근처의 작은 이동으로 상세 지형과 프록시가 번갈아 켜질 수 있습니다. 지형 준비까지 반복되면 최적화 기능 자체가 부하를 만듭니다. 그래서 깨어나는 거리와 잠드는 거리를 다르게 둡니다."
          },
          {
            "kind": "table",
            "caption": "현재 C++ 거리 기본값 · 행성 표면 기준",
            "columns": [
              "설정",
              "값",
              "역할"
            ],
            "rows": [
              [
                "RuntimeProxySleepDistance",
                "40,000cm / 400m",
                "멀어졌을 때 전환 준비"
              ],
              [
                "RuntimeProxyWakeDistance",
                "30,000cm / 300m",
                "다가왔을 때 상세 지형 복귀"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "두 경계 사이에서는 기존 상태를 유지할 여지가 생깁니다. 진입과 이탈에 여유를 두는 방식을 히스테리시스라고 합니다. 이는 배포 환경에 맞춰 조절할 설정이며, 표의 숫자는 모든 에셋의 실제 값이 아니라 C++ 선언 기본값입니다."
          }
        ]
      },
      {
        "id": "detach",
        "title": "4. 숨기기만 해서는 이동 비용이 남는다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "SetHiddenInGame은 화면 표시를 숨깁니다. 부모·자식 연결과 장면 등록까지 없애지는 않습니다. 당시 SetVoxelChunksSuspended는 청크 충돌을 끄고 숨긴 뒤, 부모에서 분리하고 등록도 해제했습니다. 지형 관리자의 Tick도 멈췄습니다."
          },
          {
            "kind": "code",
            "label": "2026.09.04 구현의 핵심을 줄인 의사 코드",
            "code": "원거리로 전환:\n    청크의 충돌을 끈다\n    청크를 숨긴다\n    부모에서 분리한다\n    장면 등록을 해제한다\n    상세 지형 관리자의 Tick을 멈춘다",
            "source": "e59e435 · UVoxelManager::SetVoxelChunksSuspended"
          },
          {
            "kind": "paragraph",
            "text": "이후 환경 휴면과 편집 요청 처리가 추가됐으므로 초기 커밋이 현재 구현 전체는 아닙니다. 특히 휴면 중 새로 발생한 수정 요청까지 없애면 복귀 시 옛 지형이 보일 수 있습니다. 현재는 요청을 기록하는 것과 작업을 실행하는 것을 분리하며, 그 후속 문제는 7편에서 다룹니다."
          }
        ]
      },
      {
        "id": "restore",
        "title": "5. 그런데 위치만 복원하면 청크 경계가 갈라질 수 있다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "소스에 직접 남아 있는 주의점입니다. KeepWorldTransform으로 분리하면 분리 순간의 월드 변환이 유지됩니다. 행성이 회전한 뒤 다시 붙이면서 상대 위치만 고치면 이전 회전이 청크의 상대 회전으로 남을 수 있습니다. 조각마다 기준이 달라져 경계가 맞지 않을 수 있는 것입니다."
          },
          {
            "kind": "code",
            "label": "2026.09.04 실제 코드 발췌 · 상대 변환 전체 복원",
            "code": "Chunk->AttachToComponent(this, FAttachmentTransformRules::KeepRelativeTransform);\nChunk->SetRelativeTransform(FTransform(\n    FQuat::Identity,\n    Chunk->GetChunkLocalPosition(),\n    FVector::OneVector));",
            "source": "e59e435 · UVoxelManager::SetVoxelChunksSuspended"
          },
          {
            "kind": "paragraph",
            "text": "FQuat::Identity는 청크 자체의 추가 회전을 없앱니다. GetChunkLocalPosition은 행성 안에서 정해진 위치입니다. FVector::OneVector는 청크의 추가 배율을 1로 둡니다. 부모 행성의 현재 회전·배율은 부모에서 이어받으므로, 과거 월드 변환을 청크마다 중복 적용하지 않습니다."
          },
          {
            "kind": "paragraph",
            "text": "행성을 원점으로 되돌리는 코드가 아닙니다. 행성은 움직인 상태이고, 청크가 그 안에서 차지하는 배치를 복원합니다. “월드에서 어디인가”와 “행성 안에서 어디인가”를 구분하는 일은 이후 최적화에서도 반복됩니다."
          }
        ]
      },
      {
        "id": "collision",
        "title": "6. 돌아오는 순간 충돌 준비가 한꺼번에 몰릴 수 있다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "상세 청크를 등록할 때마다 즉시 복잡한 충돌 데이터를 만들면 많은 Cook이 한 시점에 몰릴 수 있습니다. 여기서 Cook은 패키징 전체가 아니라, 삼각형 메시를 물리 엔진의 충돌 판정에 쓸 수 있는 형태로 준비하는 과정입니다."
          },
          {
            "kind": "paragraph",
            "text": "같은 커밋은 OnRegister에서 충돌 갱신을 미루고 실제 충돌이 필요해질 때 갱신하도록 바꿨습니다. bUseAsyncCooking도 사용합니다. 또 지형 청크의 레이 트레이싱 참여를 꺼 많은 DynamicMesh의 관련 갱신 비용을 줄이도록 했습니다. 당시 주석은 지형에 래스터 그림자 경로를 사용한다고 설명합니다."
          },
          {
            "kind": "note",
            "title": "렌더링 경로의 선택도 포함됩니다",
            "text": "레이 트레이싱 참여를 끄는 변경까지 있었으므로 모든 반사와 그림자가 이전과 픽셀 단위로 동일하다고 주장하지 않습니다. 최적화마다 유지한 것과 바꾼 경로를 구분해야 합니다."
          },
          {
            "kind": "paragraph",
            "text": "새 문제가 남습니다. 화면에 지형이 돌아온 시점과 충돌 Cook 완료 시점이 다를 수 있습니다. 우주선이 그 사이에 접근할 때 “보인다”를 “충돌 가능하다”로 취급하면 안 됩니다. 7편에서는 이 준비 상태를 별도로 판단하는 과정을 다룹니다."
          }
        ]
      },
      {
        "id": "evidence",
        "title": "7. 구현 변화와 성능 수치를 구분하기",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "현재 VoxelScenePresence 검사에는 휴면 중 행성의 위치·회전·비균일 배율을 바꾸고 복귀시킨 뒤 변환과 정점 수를 확인하는 경로가 있습니다. 이 글은 소스와 보관된 검증 기록을 읽어 작성했고, 글 작성을 위해 새 Unreal 실행을 하지는 않았습니다."
          },
          {
            "kind": "paragraph",
            "text": "9월 4일 변경만 분리한 동일 조건 전후 프레임 자료는 확보하지 않았습니다. 따라서 프록시 하나로 몇 FPS 올랐다는 숫자는 붙이지 않습니다. 확인할 수 있는 것은 청크 분리, 등록 해제, 상대 변환 복원이라는 코드 변화입니다."
          },
          {
            "kind": "paragraph",
            "text": "다음 편의 진단에서는 현재 행성을 움직이는 비용이 크게 남았습니다. 원거리를 단순화해도 지금 서 있는 행성의 상세 구조는 계속 무거웠던 것입니다."
          }
        ]
      }
    ],
    "sources": [
      {
        "label": "2026.09.04 최적화 커밋",
        "detail": "e59e435 — Planet.cpp/.h, VoxelManager.cpp, VoxelChunk.cpp. 프록시와 청크 휴면, 상대 변환 복원, 지연 충돌 갱신."
      },
      {
        "label": "현재 코드와 검사",
        "detail": "Planet/Planet.cpp/.h — UpdateRuntimeProxyState, BakeRuntimeProxyMesh. Planet/Tests/VoxelScenePresenceTests.cpp — 휴면 후 변환과 메시 복원."
      }
    ]
  },
  {
    "slug": "profile-moving-planet",
    "number": "03",
    "topic": "프로파일링 · 빈 청크 · 중력 이벤트",
    "title": "느린 것은 지형 생성이 아니라 행성 이동이었다",
    "summary": "측정 항목을 나눠 보니 복셀 Tick보다 행성 Transform 갱신이 훨씬 컸습니다. 빈 청크와 사용하지 않는 겹침 이벤트를 줄이고, 결과가 기대만큼 단순하지 않았던 이유를 읽습니다.",
    "startingPoint": "복잡해 보이는 기능을 추측으로 줄이면 실제 병목을 놓칠 수 있다.",
    "result": "행성 이동과 프레임 끝 갱신을 주요 조사 대상으로 좁히고 불필요한 장면 참여를 줄였다.",
    "sections": [
      {
        "id": "profiling",
        "title": "1. 기능의 복잡도 대신 실제 시간을 나눠 보기",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "복셀, 식생, 3D 미니맵이 있으니 셋부터 의심하기 쉽습니다. 하지만 이미 생성된 지형의 Tick은 짧을 수 있고, 코드 한 줄의 행성 이동은 수백 개 자식 컴포넌트에 영향을 줄 수 있습니다. 눈에 보이는 복잡도와 프레임 비용은 같지 않습니다."
          },
          {
            "kind": "paragraph",
            "text": "CSV 타이밍 항목과 장면 구조 출력을 함께 사용했습니다. CometOrbitTransforms는 천체 갱신 구간을 재고, Comet.Perf.DumpScene은 등록된 청크, 표면 없는 청크, 충돌, 자식 컴포넌트, 식생 인스턴스 수를 출력합니다. 시간과 구조를 함께 봐야 비용이 어디서 증폭되는지 찾을 수 있습니다."
          },
          {
            "kind": "code",
            "label": "현재 함수 진입부 발췌 · 본문 생략",
            "code": "void ASolarSystem::UpdateGeneratedBodies(float DeltaSeconds)\n{\n    CSV_SCOPED_TIMING_STAT_GLOBAL(CometOrbitTransforms);\n    // 논리 천체 갱신과 실제 배치 처리\n}",
            "source": "SolarSystem/SolarSystem.cpp"
          },
          {
            "kind": "paragraph",
            "text": "매크로가 들어간 범위의 시간이 해당 이름으로 기록됩니다. 코드 변경에 따라 이 범위에 포함되는 일이 달라질 수 있으므로, 과거와 현재에 같은 항목명이 있어도 내부 작업까지 같다고 가정하지 않습니다."
          }
        ]
      },
      {
        "id": "diagnosis",
        "title": "2. 첫 진단에서 발견한 큰 차이",
        "blocks": [
          {
            "kind": "table",
            "caption": "diagnostic-before-summary.json의 시간값 · ms",
            "columns": [
              "항목",
              "기록값",
              "범위"
            ],
            "rows": [
              [
                "FrameTime",
                "30.8559",
                "전체 프레임 기준"
              ],
              [
                "GameThreadTime",
                "24.3971",
                "게임 스레드 측"
              ],
              [
                "GPUTime",
                "16.4942",
                "GPU 측"
              ],
              [
                "CometVoxelTick",
                "0.0629",
                "복셀 Tick 구간"
              ],
              [
                "CometFoliageUpdate",
                "0.3127",
                "식생 갱신 구간"
              ],
              [
                "CometGlobeRefresh",
                "0.2005",
                "미니맵 갱신 구간"
              ],
              [
                "CometOrbitTransforms",
                "8.1901",
                "천체 변환 구간"
              ],
              [
                "그중 Planet0",
                "7.9591",
                "특정 행성 변환 적용"
              ],
              [
                "EndOfFrameUpdates",
                "7.2442",
                "프레임 끝 갱신"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "이 구간에서는 복셀 Tick의 0.0629ms보다 행성 변환의 8.1901ms가 훨씬 컸습니다. Planet0의 변환 적용이 그 대부분이었습니다. 새 지형 계산보다 이미 있는 구조를 움직이는 경로가 더 큰 조사 대상이 된 것입니다."
          },
          {
            "kind": "note",
            "title": "시간값을 모두 더하면 안 됩니다",
            "text": "부모·자식 구간은 중첩되고 CPU와 GPU는 겹쳐 진행됩니다. Planet0를 CometOrbitTransforms에 더하면 중복입니다. 초기 요약만으로 모든 설정과 표본 조건을 복원할 수 없어 최종 성능 비교의 기준으로 사용하지 않습니다."
          }
        ]
      },
      {
        "id": "hierarchy",
        "title": "3. SetActorLocationAndRotation 한 줄이 하는 일",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "행성 아래에는 지형 관리자, 청크, 중력 범위, 식생, 환경 객체가 연결됩니다. 부모가 움직이면 자식의 실제 배치도 달라집니다. 엔진은 관련 변환과 장면 상태를 갱신해야 할 수 있습니다. 호출하는 코드 줄 수는 적어도 영향을 받는 구조는 작지 않습니다."
          },
          {
            "kind": "flow",
            "label": "비용 전파의 개념",
            "steps": [
              "행성 위치·회전 변경",
              "연결된 컴포넌트의 배치 변경",
              "충돌·겹침·렌더 상태 관련 갱신",
              "프레임 끝과 렌더 스레드 후속 처리"
            ]
          },
          {
            "kind": "paragraph",
            "text": "각 단계가 항상 모두 실행되거나 같은 비율로 늘어나는 것은 아닙니다. 실제 비용은 측정해야 합니다. 다만 부모 이동 시간만 보고 EndOfFrameUpdates와 렌더 스레드를 놓치면 후속 비용을 읽지 못할 수 있습니다."
          }
        ]
      },
      {
        "id": "empty",
        "title": "4. 표면이 없는 청크를 활성 장면에서 빼기",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "표면 삼각형이 없는 청크도 있습니다. 행성 바깥뿐 아니라 내부에 묻혀 표면이 드러나지 않는 공간도 해당할 수 있습니다. “빈 청크”는 현재 메시 표면이 없다는 뜻이지 편집 데이터까지 없다는 뜻은 아닙니다."
          },
          {
            "kind": "paragraph",
            "text": "RefreshScenePresence는 게임 월드에서 표면이 없고 편집용 유지 조건도 없으면 등록과 부모 연결을 해제합니다. ChunkMap의 주소, 수정 밀도, 요청 revision은 유지합니다. 나중에 땅을 파 표면이 생기면 같은 청크를 다시 사용할 수 있어야 합니다."
          },
          {
            "kind": "code",
            "label": "실제 코드 발췌",
            "code": "if (!bNeeded)\n{\n    if (IsRegistered()) UnregisterComponent();\n    if (GetAttachParent()) DetachFromComponent(FDetachmentTransformRules::KeepWorldTransform);\n    return;\n}",
            "source": "Planet/Voxel/VoxelChunk.cpp · RefreshScenePresence"
          },
          {
            "kind": "paragraph",
            "text": "bNeeded는 전체 지형 휴면 여부, 표면 유무, 에디터·진단용 유지 조건으로 결정합니다. 이 분기는 청크를 파괴하지 않습니다. 관리자는 여전히 같은 청크를 찾아 수정할 수 있고, 표면이 생기면 다시 등록합니다."
          }
        ]
      },
      {
        "id": "local",
        "title": "5. 분리하자 좌표가 낡을 수 있어 계산 기준도 바꿨다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "부모에서 떨어진 청크의 GetComponentLocation은 분리 이후 행성의 공전과 자전을 반영하지 않을 수 있습니다. 그 좌표로 LOD 우선순위나 주변 충돌 준비를 판단하면 잘못된 위치를 조사하게 됩니다. 그래서 현재 관리자의 변환과 청크의 행성 내부 위치로 월드 위치를 다시 계산합니다."
          },
          {
            "kind": "code",
            "label": "실제 코드 발췌",
            "code": "return OwningManager\n    ? OwningManager->GetComponentTransform().TransformPosition(ChunkInfo.ChunkPos)\n    : GetComponentLocation();",
            "source": "Planet/Voxel/VoxelChunk.cpp · GetChunkWorldLocation"
          },
          {
            "kind": "paragraph",
            "text": "ChunkPos는 행성 안의 위치입니다. 관리자의 현재 Transform을 적용하면 현재 플레이 공간의 위치가 됩니다. 빈 청크의 범위도 작은 렌더 경계 대신 편집 셀 전체를 씁니다. 보이는 표면이 없어도 수정 가능한 공간은 남아 있기 때문입니다."
          },
          {
            "kind": "paragraph",
            "text": "회귀 검사는 빈 청크 분리, 회전·이동·배율 변경, 새 표면 생성 후 재등록과 충돌 복구, 마지막 표면 제거 후 재휴면을 다룹니다. 빨라졌다는 조건에 다시 필요해지면 정확히 돌아온다는 조건을 붙인 것입니다."
          }
        ]
      },
      {
        "id": "overlaps",
        "title": "6. 중력은 필요해도 겹침 알림은 사용하지 않을 수 있다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "중력 범위 구에는 물체가 들어오고 나갈 때 알림을 받는 겹침 이벤트 설정이 있습니다. 반면 현재 중력 평가 경로는 위치와 거리를 계산합니다. 범위 표현에 같은 구를 쓰더라도 중력 계산과 이벤트 알림은 다른 역할입니다."
          },
          {
            "kind": "paragraph",
            "text": "OptimizeGravityFieldOverlaps는 겹침 추적 유지 옵션을 먼저 확인합니다. 이어 컴포넌트와 Actor의 Begin/EndOverlap에 호출 가능한 연결이 있는지, Blueprint에서 Actor 겹침 이벤트를 구현했는지 확인합니다. 실제로 쓰면 유지하고 사용하지 않는 경우에만 GenerateOverlapEvents를 끕니다."
          },
          {
            "kind": "paragraph",
            "text": "충돌 자체를 일괄로 끄는 것과 다릅니다. 그렇게 하면 별도의 쿼리나 실제 이벤트 소비자가 영향을 받을 수 있습니다. 현재 구현은 이름만 남은 오래된 Blueprint 바인딩과 실제 호출 가능한 바인딩도 구분합니다."
          }
        ]
      },
      {
        "id": "results",
        "title": "7. 일부 비용은 줄었지만 FPS가 매번 같은 방향은 아니었다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "초기 comparison.json에는 요청 해상도가 1600×900이었으나 실제 출력은 888×500으로 제한됐다고 기록돼 있습니다. 이를 900p 성능이라고 부르면 안 됩니다. 빈 청크 정리와 바람 설정을 바꾼 구간도 하나의 일관된 전체 프레임 개선율을 보여주지 않았습니다."
          },
          {
            "kind": "table",
            "caption": "2560×1440 출력의 별도 중력 이벤트 비교 · 평균 ms",
            "columns": [
              "구간",
              "행성 변환",
              "전체 프레임"
            ],
            "rows": [
              [
                "이벤트 유지 1차",
                "8.985",
                "29.439"
              ],
              [
                "이벤트 끔 1차",
                "6.243",
                "22.259"
              ],
              [
                "이벤트 유지 2차",
                "9.194",
                "25.724"
              ],
              [
                "이벤트 끔 2차",
                "7.209",
                "26.418"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "행성 변환은 두 번 모두 줄었지만 전체 프레임은 두 번째에 길어졌습니다. 다른 작업과 시점별 장면 변화도 있기 때문입니다. 이 결과로 무조건 몇 FPS 상승이라고 말할 수 없습니다. 국소 비용 감소와 전체 프레임 개선을 분리해야 합니다."
          },
          {
            "kind": "paragraph",
            "text": "다음 조사 대상은 수많은 패치에 흩어진 식생 렌더러였습니다. 풀의 개수를 그대로 유지하면서도 갱신할 컴포넌트를 줄일 수 있을까요. 다음 편에서는 생성 단위와 표시 단위를 분리합니다."
          }
        ]
      }
    ],
    "sources": [
      {
        "label": "보관된 측정 보고서",
        "detail": "outputs/planet-transform-performance/diagnostic-before-summary.json, comparison.json, target1440.json. 서로 다른 실행의 수치를 합치지 않았습니다.",
        "href": "/optimization/evidence.json"
      },
      {
        "label": "현재 소스",
        "detail": "SolarSystem/ScenePerformanceDiagnostics.cpp, Planet/Voxel/VoxelChunk.cpp, Planet/Planet.cpp — 진단, 빈 청크 수명, 좌표, 중력 겹침 정책."
      },
      {
        "label": "Epic Games · CSV Profiler",
        "detail": "타이밍 기록의 기본 개념 참고. 프로젝트 수치는 자체 보고서에 근거합니다.",
        "href": "https://dev.epicgames.com/documentation/en-us/unreal-engine/csv-profiler?application_version=4.27"
      }
    ]
  }
] satisfies OptimizationPost[];

