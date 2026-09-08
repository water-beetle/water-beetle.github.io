import type { OptimizationPost } from './types';

export const followupPosts = [
  {
    "slug": "dormancy-collision-and-cargo",
    "number": "07",
    "topic": "환경 휴면 · 충돌 준비 · 화물 복구",
    "title": "잠든 행성을 깨웠더니 우주선과 화물이 기다리기 시작했다",
    "summary": "먼 환경을 쉬게 만든 뒤 충돌 준비가 새로운 문제로 떠올랐습니다. 행성 전체를 기다리던 비행을 경로 중심으로 바꾸고, 대기 중 받침에서 벗어난 화물의 좌표와 재개 시점을 고쳤습니다.",
    "startingPoint": "원거리 환경을 쉬게 하면 가벼워지지만, 복귀 중인 장면을 안전하게 사용할 준비 상태가 필요하다.",
    "result": "국소 경로의 충돌 준비와 대기·복귀 상태를 분리하고, 화물의 행성 로컬 자세와 S 속도를 보존한다.",
    "sections": [
      {
        "id": "environment",
        "title": "1. 지형만 단순화해도 먼 마을과 식생은 남아 있다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "2편의 프록시는 원거리 복셀 지형을 다뤘습니다. 그러나 지형에 붙은 마을, 장식과 여러 환경 컴포넌트의 수명까지 자동으로 정리하는 것은 아닙니다. 5편에서 현재 행성을 고정해도 다른 행성의 복잡한 환경은 계속 움직일 수 있습니다. 그래서 환경 휴면을 별도의 기능으로 추가했습니다."
          },
          {
            "kind": "paragraph",
            "text": "PlanetSceneActivationComponent는 명시적으로 등록한 환경 묶음을 관리합니다. 아무 오브젝트나 전부 분리하지 않습니다. 동적 물리 바디, 특별한 하위 클래스, 자식이나 이벤트 소비자가 있는 구조 등 지원하지 않는 대상을 구분합니다. 환경을 관리한다는 이유로 다른 시스템의 수명까지 무조건 소유하지 않는 것입니다."
          },
          {
            "kind": "paragraph",
            "text": "등록할 때 원래 부모, 상대 변환, 가시성, Tick, 충돌과 겹침 상태 등을 보관합니다. 다시 켤 때 모든 설정을 임의의 기본값으로 바꾸면 원래 숨겨져 있던 객체가 나타나거나 충돌이 달라질 수 있기 때문입니다."
          }
        ]
      },
      {
        "id": "states",
        "title": "2. “켜짐/꺼짐” 두 상태로는 부족하다",
        "blocks": [
          {
            "kind": "table",
            "caption": "실제 상태 이름과 의미",
            "columns": [
              "상태",
              "의미"
            ],
            "rows": [
              [
                "DetailedReady",
                "상세 환경을 사용할 준비가 된 상태"
              ],
              [
                "RetirePending",
                "휴면으로 내려갈 조건과 지연을 확인하는 중"
              ],
              [
                "Dormant",
                "관리 대상이 활성 장면에서 쉬는 상태"
              ],
              [
                "Preparing",
                "상세 환경과 관련 준비를 복원하는 중"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "RetirePending은 경계 근처에서 곧바로 껐다 켜는 반복을 완화하고, Preparing은 화면에 보이는 것과 충돌 준비를 구분합니다. 휴면을 객체 삭제와 같게 취급해서도 안 됩니다. 바닥이 잠시 등록 해제됐다는 이유로 그 위의 화물을 받침이 파괴된 상태로 처리하면 안 되기 때문입니다."
          },
          {
            "kind": "paragraph",
            "text": "의존하는 화물 받침이 있으면 지원 상태를 유지하는 조건이 들어갑니다. 관심 객체의 위치와 이동 예측도 사용합니다. 거리는 전역 축에 맞춘 단순 상자만으로 판단하지 않고 행성 로컬 경계와 현재 변환을 함께 다룹니다. 회전한 행성에서도 같은 공간을 검사해야 합니다."
          }
        ]
      },
      {
        "id": "global-wait",
        "title": "3. 실제 첫 문제: 행성 전체의 충돌을 기다리며 비행이 멈췄다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "초기 implementation 검증에는 접근 행성 전체의 terrain Cook을 기다리는 짧은 비행 정지가 기록돼 있습니다. 우주선이 지나갈 곳과 멀리 떨어진 청크의 준비까지 모두 기다리면, 현재 비행에 필요 없는 작업이 진행을 막게 됩니다."
          },
          {
            "kind": "paragraph",
            "text": "후속 구현은 미래에 준비를 요청할 넓은 경로와, 지금 멈춰야 할 짧은 경로를 나눴습니다. 미리 깨우는 것은 여유 있게 하고 실제 정지는 임박한 충돌 경로가 준비되지 않았을 때만 결정합니다."
          },
          {
            "kind": "code",
            "label": "실제 코드 발췌 · 준비와 정지의 시간 범위를 분리",
            "code": "const double LookAhead = FMath::Max(2.0, double(Owner.GetWorld()->GetDeltaSeconds()));\nconst double StopHorizon = FMath::Max(0.05, double(Owner.GetWorld()->GetDeltaSeconds()) * 2.0);",
            "source": "Spaceship/SpaceshipFlight.cpp · 상세 충돌 준비 경로"
          },
          {
            "kind": "paragraph",
            "text": "LookAhead는 적어도 2초 앞을 보고 상세 준비를 요청하는 데 사용합니다. StopHorizon은 적어도 0.05초 또는 현재 프레임의 두 배를 봅니다. 여기에 선박의 크기를 반영해 경로와 경계의 교차를 검사합니다. 이 값만으로 모든 고속 충돌을 보장하는 것은 아니며, 현재 구현의 예측 정책입니다."
          },
          {
            "kind": "paragraph",
            "text": "속도는 선박의 월드 속도만 쓰지 않고 해당 지점에서 행성이 움직이는 속도를 뺍니다. 같은 방향으로 빠르게 공전하는 두 물체의 실제 접근 속도와, 반대 방향으로 접근하는 경우는 다르기 때문입니다."
          }
        ]
      },
      {
        "id": "cook",
        "title": "4. 준비 여부는 최신 메시와 최신 충돌의 관계로 판단한다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "화면 메시가 적용됐어도 해당 메시의 충돌 Cook은 진행 중일 수 있습니다. 게다가 땅을 다시 파면 기존 Cook이 끝난 뒤 더 새 요청이 필요합니다. 오래된 충돌 결과를 “끝났으니 사용 가능”으로 처리하면 화면과 바닥의 형태가 다를 수 있습니다."
          },
          {
            "kind": "paragraph",
            "text": "현재 준비 경로는 필요한 경로의 청크를 조사하고 요청·적용 revision과 Cook 상태를 다룹니다. 실패한 최신 Cook과 이미 지나간 이전 요청의 실패를 구분하고, 지원 경로에서 실제 새 충돌 body를 재시도합니다. 아무 실패 신호나 영원한 정지 상태로 바꾸거나, 실패를 무시한 채 진행시키는 방식은 아닙니다."
          },
          {
            "kind": "paragraph",
            "text": "integration06에는 먼 Cook 대기 때문에 멈추지 않는 경우와 가까운 실패를 주입한 뒤 실제 재시도·충돌 준비 후 재개하는 검사가 있습니다. 실패 주입은 문제 조건을 테스트에서 의도적으로 만든 것입니다. 자연 발생한 모든 Cook 오류를 실전에서 재현했다는 의미는 아닙니다."
          }
        ]
      },
      {
        "id": "sculpt",
        "title": "5. 잠든 동안 땅을 팠다면, 요청을 버리면 안 된다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "휴면이니까 RequestChunkBuild에서 무조건 반환한다고 생각하기 쉽습니다. 그러나 그 사이 Sculpt가 수정 밀도만 바꾸고 빌드 요청이 사라지면 복귀 시 화면 메시가 옛 상태로 남을 수 있습니다."
          },
          {
            "kind": "code",
            "label": "현재 요청 진입부 발췌 · 휴면 여부만으로 편집 요청을 버리지 않음",
            "code": "if (!IsValid(Chunk)) return;\nDesiredLODLevel = NormalizeLODStep(DesiredLODLevel);",
            "source": "Planet/Voxel/VoxelManager.cpp · RequestChunkBuild"
          },
          {
            "kind": "paragraph",
            "text": "현재 소스 주석은 휴면 중에도 편집을 기록한다고 명시합니다. 요청은 revision과 함께 유지하고 실제 워커 시작과 결과 적용 경로를 휴면 상태에 맞춰 제어합니다. 1편에서 나눈 “요청 → 계산 → 적용” 구조가 여기서 다시 필요해진 것입니다."
          },
          {
            "kind": "paragraph",
            "text": "저장된 통합 검사에서는 Planet7의 휴면 Sculpt, 최신 메시·Cook 복귀와 자동 휴면·복귀 2회를 확인했습니다. 관리 컴포넌트 30개와 그룹 1개, 기존 건물 중력 구역 25개도 보존했는지 확인합니다. 숫자가 복구됐다는 것뿐 아니라 개별 배치와 상태를 함께 봅니다."
          }
        ]
      },
      {
        "id": "cargo-failure",
        "title": "6. 실제 다음 실패: 화물은 기다렸는데 바닥은 계속 이동했다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "cargo05에서는 약 2.2초 대기 후 화물이 원래 받침에 다시 정착하지 못하는 실패가 기록됐습니다. 받침 로컬 XY는 대기 전 약 (3.135, 7.283)cm였지만 이후 약 (441.865, 871.822)cm가 됐습니다. 받침의 반폭은 400cm였으므로 이미 범위를 벗어났습니다."
          },
          {
            "kind": "paragraph",
            "text": "원인은 대기 중 화물의 플레이 공간 위치를 고정한 반면 먼 행성의 받침은 계속 움직였기 때문입니다. 물리를 잠시 멈춰도 화물이 그 행성과의 상대 위치를 유지해야 한다는 요구는 남아 있습니다. 단순히 “충돌 준비가 끝날 때까지 가만히 두기”가 올바른 대기는 아니었던 것입니다."
          },
          {
            "kind": "paragraph",
            "text": "그래서 TerrainWaitPlanet과 행성 로컬 위치·회전을 저장합니다. 기다리는 동안에는 그 행성의 현재 자세를 통해 화물의 위치를 다시 계산합니다. 중력 대상이 다른 행성으로 바뀌면 옛 행성의 캐시를 그대로 재사용하지 않고 실제 현재 자세에서 새 기준을 잡습니다."
          },
          {
            "kind": "note",
            "title": "실패 기록의 프로세스 코드는 0입니다",
            "text": "cargo05의 테스트 자체는 실패했지만 프로세스는 0으로 종료했습니다. 프로세스가 정상 종료했다는 것과 검사 조건을 통과했다는 것은 다릅니다. 이 차이는 마지막 편에서도 다시 확인합니다."
          }
        ]
      },
      {
        "id": "resume",
        "title": "7. 바닥을 따라가게 했어도 재개 시점이 한 단계 어긋날 수 있다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "6편에서 물리 구간의 시작과 끝을 구분했습니다. 준비 검사에 사용하는 실제 장면은 이번 구간의 끝 자세에 있을 수 있습니다. 하지만 재개할 첫 물리 적분은 구간 시작 자세와 속도에서 출발해야 합니다. 준비 확인에 사용한 끝 자세를 그대로 첫 시작으로 쓰면 한 단계를 앞당겨 적용할 수 있습니다."
          },
          {
            "kind": "flow",
            "label": "후속 화물 대기·복귀 계약",
            "steps": [
              "기다릴 때 행성 로컬 자세와 S 선·각속도 저장",
              "End 자세에서 충돌 준비 확인",
              "준비됐으면 보관한 Start 자세 복원",
              "실제 COM에서 S 속도를 P로 변환",
              "물리 재개"
            ]
          },
          {
            "kind": "paragraph",
            "text": "현재 코드는 GetPlanetPlayTransformForPhysicsStep으로 행성의 시작·끝 자세를 얻습니다. 대기 중에는 End 자세를 따라가며 준비를 확인하고, 재개 시 Start 자세를 복원합니다. 물리를 다시 켠 뒤 남은 kinematic End 목표를 정리하고 실제 COM에서 저장한 S 선속도와 각속도를 변환합니다."
          },
          {
            "kind": "code",
            "label": "실제 코드 발췌 · 재개 시 실제 COM에서 속도 복원",
            "code": "Body->SetPhysicsLinearVelocity(Frame.SolarToPlayVelocity(Frame.PlayToSolarPosition(Body->GetCenterOfMass()), PendingLinearSolar));\nBody->SetPhysicsAngularVelocityInRadians(Frame.SolarToPlayAngularVelocity(PendingAngularSolar));",
            "source": "Props/PropMotionComponent.cpp · 대기 후 재개 경로"
          },
          {
            "kind": "paragraph",
            "text": "PendingLinearSolar와 PendingAngularSolar는 대기 시작 때 저장한 태양계 기준 운동입니다. 그 숫자를 그대로 플레이 속도로 넣지 않고 재개 시점의 기준계로 변환합니다. 위치·시간·질량 중심 중 하나만 맞춰도 부족했던 문제입니다."
          }
        ]
      },
      {
        "id": "verified",
        "title": "8. 고친 뒤 같은 받침으로 돌아오는 과정을 다시 검사했다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "integration06은 실제 움직이는 8m 받침 위 화물이 약 2.650초와 2.567초의 대기를 거친 후 정착하는 흐름을 검사했습니다. 정착 뒤 10초 유지, 들었다 놓기, 재정착 뒤 10초 유지, 화물 제거 후 같은 받침의 휴면까지 통과했습니다. 보고된 정착 로컬 오차는 0cm입니다."
          },
          {
            "kind": "paragraph",
            "text": "이 결과는 해당 지원 단일플레이 통합 검사의 결과입니다. 예전 cargo05 실패는 지우지 않고 남겼습니다. 최신 정본에서 TEST55는 통과로 바뀌었고, 이 검증이 기본 활성화 판단의 한 근거가 됐습니다."
          },
          {
            "kind": "paragraph",
            "text": "다음에는 화면에 남은 문제를 봅니다. 기준계가 바뀌어도 행성 지형 자체가 새로 만들어진 것은 아닌데, 미니맵을 다시 만들면 불필요한 비용이 생깁니다. 동시에 지도 캡처와 클릭 위치가 서로 다른 시각의 데이터를 쓰면 정확성이 깨집니다."
          }
        ]
      }
    ],
    "sources": [
      {
        "label": "현재 상태·충돌·대기 구현",
        "detail": "Planet/PlanetSceneActivationComponent.h/.cpp, Planet/Voxel/VoxelManager.cpp, Spaceship/SpaceshipFlight.cpp, Props/PropMotionComponent.cpp — 등록, 경로 준비, 요청 최신성, Start/End 대기 복원."
      },
      {
        "label": "실패와 재검증 기록",
        "detail": "followup/tests-cargo05/index.json 및 Tests-cargo05.log, tests-integration06/index.json과 process 보고서. 최신 개발구조.xlsx TEST55와 교차 확인했습니다.",
        "href": "/optimization/evidence.json"
      }
    ]
  },
  {
    "slug": "map-snapshots-and-materials",
    "number": "08",
    "topic": "미니맵 · 캡처 · 재질 좌표 · 수명",
    "title": "행성은 같은데 지도와 바람의 기준이 달라졌다",
    "summary": "기준계 전환을 지형 재생성으로 취급하지 않도록 미니맵을 유지했습니다. 지도 그림과 표식의 시각을 맞추고, 월드 좌표에 기대던 재질과 프리뷰 자원 수명도 점검했습니다.",
    "startingPoint": "게임 좌표가 바뀌면 UI 캐시와 재질이 사용하는 월드 좌표도 함께 영향을 받는다.",
    "result": "미니맵 자원을 유지하고, 캡처와 표식을 같은 스냅샷으로 읽으며 좌표 의존 재질을 선별 보완한다.",
    "sections": [
      {
        "id": "cache",
        "title": "1. 기준계가 바뀌었다고 행성 지형이 새로 생긴 것은 아니다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "5편의 기준계 전환은 같은 세계를 다른 좌표로 표현합니다. 같은 행성에 있는 플레이어의 로컬 위치와 지형 형상은 그대로일 수 있습니다. 그런데 전환할 때마다 미니맵 캡처 Actor, 재질 인스턴스, 렌더 타깃을 전부 지웠다가 만들면 필요 없는 준비 비용이 생깁니다."
          },
          {
            "kind": "paragraph",
            "text": "현재 PlanetGlobeWidget은 표시 대상 행성이 바뀌었거나 캡처 객체가 유효하지 않은 경우에 캡처를 정리합니다. 같은 행성을 보는 단순한 기준계 전환을 지형 교체로 취급하지 않습니다. 지도의 카메라와 표식을 갱신하는 일과 지형 캡처 구조를 재구축하는 일도 구분합니다."
          },
          {
            "kind": "code",
            "label": "현재 코드의 조건식 발췌",
            "code": "CurrentPlanet.Get() != Planet || (GlobeCapture && !IsValid(GlobeCapture))",
            "source": "UI/HUD/PlanetGlobeWidget.cpp · 기존 캡처를 정리하는 조건"
          },
          {
            "kind": "paragraph",
            "text": "첫 항은 실제 행성 대상이 바뀌었는지, 둘째는 캡처가 존재하지만 더 이상 유효하지 않은지 봅니다. 행성이 같고 자원이 살아 있다면 같은 자원을 유지합니다. 기준계 revision 숫자가 바뀌었다는 이유만으로 이 전체 구조를 무조건 초기화하지 않는 것입니다."
          }
        ]
      },
      {
        "id": "count",
        "title": "2. “재빌드하지 않았다”를 느낌이 아니라 횟수로 확인하기",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "UI02와 후속 UI03은 같은 행성↔우주 기준을 반복 전환하며 미니맵 빌드 시도·성공·정리 횟수와 자원 정체성을 검사했습니다. 최신 UI03에서는 순수 전환 40회 동안 추가 재빌드가 0이었고, 캡처·재질·텍스처와 POI·선박 표식이 유지됐습니다."
          },
          {
            "kind": "table",
            "caption": "UI03 보고서의 미니맵 전후 상태",
            "columns": [
              "항목",
              "전환 전",
              "전환 후"
            ],
            "rows": [
              [
                "빌드 시도",
                "1",
                "1"
              ],
              [
                "빌드 성공",
                "1",
                "1"
              ],
              [
                "정리 횟수",
                "1",
                "1"
              ],
              [
                "일반 Refresh 횟수",
                "985",
                "2472"
              ],
              [
                "순수 전환 추가 재빌드",
                "—",
                "0"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "Refresh 횟수는 증가합니다. 지도가 멈춘 것이 아니라 기존 자원을 사용해 위치와 시선을 계속 갱신한 것입니다. 추가 재빌드 0을 전체 캡처 0이나 UI 작업 0으로 읽으면 안 됩니다. 무엇을 세는 카운터인지 이해하는 것이 중요합니다."
          },
          {
            "kind": "note",
            "title": "이 검사는 고속 비행 전체가 아닙니다",
            "text": "순수 기준계 전환과 캐시 유지 검증에는 논리 천체 시간을 멈춘 조건이 포함됩니다. 극점 이동과 이륙 표식 확인도 저장 위젯 fixture를 사용합니다. 실제 장시간 비행 결과와 구분합니다."
          }
        ]
      },
      {
        "id": "snapshot",
        "title": "3. 지도 그림은 과거인데 표식만 최신이면 어긋난다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "태양계 지도는 3D 장면을 캡처해 화면에 표시하고, 그 위에 선택 표시와 글자, 플레이어 표식을 그립니다. 캡처가 완료되는 동안 행성이나 카메라가 움직일 수 있습니다. 배경은 이전 카메라인데 표식과 클릭 판정은 최신 카메라를 사용하면 눈에 보이는 행성과 선택되는 위치가 다를 수 있습니다."
          },
          {
            "kind": "paragraph",
            "text": "그래서 FSolarMapCaptureSnapshot에 캡처의 시점, 관찰자 S 위치, 천체 위치와 기준계 revision을 묶습니다. PendingSnapshot과 CapturedSnapshot을 구분해 준비 중 데이터와 현재 화면에 표시된 데이터를 섞지 않습니다."
          },
          {
            "kind": "code",
            "label": "실제 코드 발췌 · 표시 중인 그림의 기준으로 플레이어 투영",
            "code": "const FSolarMapView& DisplayView=bSceneCaptured ? CapturedSnapshot.View : View;\nconst FVector Observer=bSceneCaptured ? CapturedSnapshot.ObserverSolarPosition : ObserverPosition();\nconst FVector2D P=DisplayView.Project(Observer);",
            "source": "UI/SolarSystem/SolarSystemMapWidget.cpp · 플레이어 표식 표시"
          },
          {
            "kind": "paragraph",
            "text": "캡처가 있다면 그 캡처와 짝인 View와 Observer를 사용합니다. 새로 발견한 천체도 아직 화면 스냅샷에 포함되지 않았다면 바로 클릭 대상으로 만들지 않는 검사 경로가 있습니다. 화면, 표식, 선택의 시점을 맞추기 위한 일입니다."
          }
        ]
      },
      {
        "id": "map-physics",
        "title": "4. 지도를 보려고 먼 행성의 물리까지 깨우면 안 된다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "지도에서는 멀리 있는 행성도 보여야 합니다. 그러나 보기 위한 자료 요청 때문에 실제 게임 월드의 상세 지형과 마을 충돌을 모두 깨우면 7편의 휴면 효과를 UI가 취소할 수 있습니다. 시각적 미리보기와 실제 물리 활성 상태를 분리해야 합니다."
          },
          {
            "kind": "paragraph",
            "text": "검증은 지도 열기 전후의 State, ManagedComponents, DormantComponents, TerrainDetailed를 비교합니다. 세 크기 1280×720, 1600×900, 2560×1080에서 선택·집중 보기·확대·회전·이동·초기화를 합쳐 18개 조작으로 확인하고 개폐 3회 뒤 입력도 복원했습니다."
          },
          {
            "kind": "paragraph",
            "text": "세 크기는 실제 지도 위젯의 오프스크린 렌더와 입력 좌표 검사입니다. 운영체제 창을 직접 세 크기로 바꿔 수동 플레이한 결과와는 다릅니다. 이 구분을 남겨야 실제 검증 범위를 나중에 이어갈 수 있습니다."
          }
        ]
      },
      {
        "id": "materials",
        "title": "5. 위치는 맞는데 풀 색이나 바람 무늬가 달라질 수 있다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "재질이 WorldPosition을 색이나 노이즈의 입력으로 쓰면, 기준계를 바꾼 뒤 같은 물체의 숫자 좌표가 달라져 무늬가 바뀔 수 있습니다. 바람 방향을 월드 축으로 고정한 재질이나 XY 평면으로 카메라를 향하게 하는 Billboard도 회전 기준계의 영향을 받을 수 있습니다."
          },
          {
            "kind": "paragraph",
            "text": "그렇다고 WorldPosition 노드가 있다는 이유만으로 전부 오류는 아닙니다. 행성 중심을 빼고 로컬 공간으로 바꾸거나, 두 위치의 거리만 구하는 식은 같은 변환 아래에서도 의미가 유지될 수 있습니다. 실제 연결된 재질 그래프와 인스턴스 설정을 봐야 합니다. 바람 함수가 있어도 최종 static switch가 꺼져 있으면 현재 사용 경로가 다릅니다."
          },
          {
            "kind": "paragraph",
            "text": "후속 점검은 실제 연결된 재질을 조사하고 기준계 원점과 축을 MPC로 전달하는 경로를 확장했습니다. MPC는 여러 재질이 공유하는 파라미터 묶음입니다. S 위치가 필요한 노이즈나 색에는 원점까지 포함해 위치를 복원하고, S 방향의 WPO는 P 방향으로 바꾸어 적용하는 식으로 선별 보완합니다."
          },
          {
            "kind": "flow",
            "label": "절대 좌표에 기대는 재질의 보완 개념",
            "steps": [
              "현재 P 위치",
              "기준계 원점과 축으로 S 위치 복원",
              "S 기준 노이즈·방향 계산",
              "필요한 변위는 다시 P로 변환"
            ]
          },
          {
            "kind": "paragraph",
            "text": "Billboard 검증은 프로젝트 함수와 실제 연결된 인스턴스를 확인하고 수식 64경우 및 재질 컴파일을 검사했습니다. 최신 정본은 재질/MPC/함수 11개와 cockpit 1개의 원본 보존·재확인을 기록합니다. 하지만 모든 GPU 픽셀, LOD 전환, 시간에 따른 바람 연속성 검사는 별도로 남아 있습니다."
          }
        ]
      },
      {
        "id": "cleanup",
        "title": "6. 미리보기 객체도 닫힐 때까지 책임져야 한다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "지도와 미니맵에는 캡처 Actor, 렌더 타깃, 동적 재질, Slate 위젯과 delegate 같은 연결이 생깁니다. delegate는 나중에 어떤 처리를 호출하도록 등록한 연결입니다. 화면을 닫았다는 것만으로 이런 자원의 수명이 모두 끝났다고 가정하면, 종료 중 이미 없어진 대상을 뒤늦게 참조할 수 있습니다."
          },
          {
            "kind": "paragraph",
            "text": "후속 preview01은 실제 PIE와 EnginePreExit에서 명시적 Release 호출이 없어도 프리뷰와 delegate가 정리되는지 검사했습니다. 화면 열기·닫기의 기능 검사와 앱 종료 단계의 자원 수명 검사는 서로 다른 확인입니다."
          },
          {
            "kind": "paragraph",
            "text": "마지막 편에는 별도의 측정 스크립트 종료 오류도 나옵니다. 이 프리뷰 정리 검증이 모든 에디터 종료 오류를 해결했다는 뜻은 아닙니다. 각 실패가 어느 자원과 실행 경로에서 일어났는지 따로 좁혀야 합니다."
          }
        ]
      },
      {
        "id": "status",
        "title": "7. 현재까지 확인한 화면과 남은 검증",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "UI03은 기본 ON에서 40전환, 추가 미니맵 재빌드 0, 자원·표식 유지, 세 오프스크린 크기의 지도 조작과 입력·설정 복원을 통과했습니다. UI02의 원점·축 게시 수치도 별도 근거로 보존합니다."
          },
          {
            "kind": "paragraph",
            "text": "최신 정본에서 TEST56은 부분 검증입니다. 대표 화면과 수식·컴파일 결과는 확인했지만 모든 재질의 GPU 시간 연속성과 실제 LOD 경계까지 다 검사한 것은 아닙니다. 이 상태를 숨기지 않아야 다음 시각 검증의 범위를 알 수 있습니다."
          },
          {
            "kind": "paragraph",
            "text": "마지막 편에서는 이 모든 작업이 실제 프레임 시간에 어떤 영향을 주었는지 봅니다. 정지 화면의 좋은 평균과 이동 중 여전히 남은 끊김을 나란히 놓고, 완료 판정과 다음 과제를 구분합니다."
          }
        ]
      }
    ],
    "sources": [
      {
        "label": "현재 UI 소스",
        "detail": "UI/HUD/PlanetGlobeWidget.cpp, UI/SolarSystem/SolarSystemMapWidget.h/.cpp와 Tests/SolarSystemMapTests.cpp — 캐시 유지, CapturedSnapshot, 클릭과 자원 해제."
      },
      {
        "label": "UI·재질 실행 기록",
        "detail": "followup/ui03.json, ui03-process.json, docs/ui02-verified-facts.json, billboard-reference-verify.json, preview-cleanup-preview01-process.json. 최신 개발구조.xlsx TEST56과 교차 확인했습니다.",
        "href": "/optimization/evidence.json"
      }
    ]
  },
  {
    "slug": "benchmarks-and-release",
    "number": "09",
    "topic": "성능 검증 · 종료 오류 · 현재 적용 상태",
    "title": "평균 60FPS를 넘겼지만, 최적화가 끝난 것은 아니다",
    "summary": "같은 조건의 정지·이동 비교를 각각 읽습니다. 측정 후 종료 실패를 해결한 과정과 최종 기본 적용 근거, 평균 숫자로 가릴 수 없는 긴 프레임과 남은 검증을 정리합니다.",
    "startingPoint": "빠른 한 장면이나 PASS 문자열만으로 전체 게임의 성능과 안정성을 판단할 수 없다.",
    "result": "정지·이동 성능과 검증·종료 결과를 분리하고, 지원 범위의 기본 적용 및 남은 과제를 명시한다.",
    "sections": [
      {
        "id": "conditions",
        "title": "1. 비교할 조건부터 맞추기",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "측정마다 해상도, 시점, 태양계의 논리 시간, 식생과 그림자, 빌드가 달라지면 숫자를 나란히 놓아도 무엇 때문인지 알기 어렵습니다. 3편에서 실제 출력이 요청값과 달랐던 사례가 있었으므로 출력 크기와 내부 렌더 크기도 구분했습니다."
          },
          {
            "kind": "paragraph",
            "text": "후속 비교는 기존 모드, 현재 행성 기준계, 기준계+환경 휴면의 세 모드를 사용했습니다. 하드웨어는 i5-10400F, RTX 3060 Ti, RAM 48GB이며 바람과 그림자는 켠 조건입니다. 게임 상태를 동일한 논리 구간과 대응 코스로 비교하되, 단일 실행의 변동과 에디터 비용도 포함된다는 한계를 남깁니다."
          },
          {
            "kind": "note",
            "title": "현재 코드 전체를 다시 벤치마크한 결과는 아닙니다",
            "text": "아래 정지·이동 비교는 최신 Prop 대기 보완 전의 보관 자료입니다. 이동 비교의 native 기준은 Build11입니다. 최종 Build16·DebugGame04와 full06은 후속 정확성 검증이며, 이 결과를 Build16 전체의 새 FPS 측정으로 바꾸어 부르지 않습니다."
          }
        ]
      },
      {
        "id": "stationary",
        "title": "2. 정지 화면에서는 무엇이 줄었나",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "final01은 저장 맵의 초기 정지 시야에서 논리 시간 [20,40)초, 모드마다 1,200프레임을 비교했습니다. 출력은 2560×1440이며 측정 뒤 관측한 TSR 내부 크기는 1552×873입니다. TSR은 내부에서 렌더한 화면을 출력 해상도로 복원하는 경로입니다. 내부 크기는 프레임별 기록이 아니라 구간 후 스냅샷입니다."
          },
          {
            "kind": "table",
            "caption": "정지 final01 · 평균 시간 ms",
            "columns": [
              "항목",
              "기존",
              "기준계",
              "기준계+휴면"
            ],
            "rows": [
              [
                "평균 프레임",
                "31.2520",
                "25.0295",
                "16.0396"
              ],
              [
                "평균 FPS 환산",
                "32.00",
                "39.95",
                "62.35"
              ],
              [
                "게임 스레드",
                "31.2275",
                "24.9172",
                "6.3866"
              ],
              [
                "GPU",
                "15.5626",
                "15.2958",
                "15.3418"
              ],
              [
                "행성 갱신 구간",
                "21.9751",
                "16.9246",
                "1.8813"
              ],
              [
                "16.667ms 이내 비율",
                "0%",
                "0%",
                "86.42%"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "기준계만 적용하면 현재 행성의 변환 부담을 줄입니다. 환경 휴면까지 적용하면 먼 행성의 관리 구조도 줄어 행성 갱신과 게임 스레드 시간이 더 크게 내려갑니다. 반면 GPU 시간은 약 15ms대로 비슷합니다. 이 표에서는 주요 감소가 CPU 측에 나타났다는 것을 읽을 수 있습니다."
          },
          {
            "kind": "paragraph",
            "text": "하지만 각 시간 구간을 빼거나 더해 완벽한 기여율을 계산하면 안 됩니다. 중첩된 타이밍과 병행 실행, 대기 시간이 있기 때문입니다. 세 모드의 전체 프레임과 주요 구간의 방향을 함께 보는 자료입니다."
          }
        ]
      },
      {
        "id": "tails",
        "title": "3. 평균 62.35FPS인데 왜 모든 프레임이 60FPS는 아닐까",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "FPS는 이 보고서에서 1000 ÷ 평균 프레임 시간으로 환산했습니다. 평균이 16.67ms보다 작아도 중간에 긴 프레임이 섞일 수 있습니다. 실제 기준계+휴면 정지 구간은 16.667ms 이내가 86.42%이고, 나머지는 그보다 길었습니다."
          },
          {
            "kind": "table",
            "caption": "정지 기준계+휴면의 분포",
            "columns": [
              "지표",
              "값",
              "뜻"
            ],
            "rows": [
              [
                "평균",
                "16.0396ms",
                "모든 프레임 시간을 합쳐 표본 수로 나눈 값"
              ],
              [
                "P95",
                "17.3558ms",
                "약 95%의 표본이 이 시간 이내"
              ],
              [
                "P99",
                "18.2896ms",
                "약 99%의 표본이 이 시간 이내"
              ],
              [
                "최대",
                "61.3360ms",
                "해당 구간의 가장 긴 한 프레임"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "P95와 P99는 느린 쪽 꼬리를 보는 지표입니다. 최대값은 가장 큰 끊김을 보여주지만 한 표본에 민감합니다. 평균, 분위수, 최대, 목표 시간 충족률을 함께 봐야 부드러움에 관한 결론을 과장하지 않을 수 있습니다."
          }
        ]
      },
      {
        "id": "moving",
        "title": "4. 이동 코스는 별도의 결과였다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "이동 비교는 실제 PIE 뷰포트 1829×824에서 진행했습니다. 측정 뒤 관측한 TSR 내부 크기는 1500×676입니다. 정지 비교와 해상도·장면·측정 방식이 다르므로 정지와 이동의 차이를 모두 이동 비용이라고 단정하지 않습니다. 대응하는 이동 코스 안에서 세 모드를 비교해야 합니다."
          },
          {
            "kind": "table",
            "caption": "전체 이동 코스 집계 · legacy/frame course02 + environment course03",
            "columns": [
              "항목",
              "기존",
              "기준계",
              "기준계+휴면"
            ],
            "rows": [
              [
                "표본 수",
                "12,742",
                "13,458",
                "13,462"
              ],
              [
                "평균 프레임",
                "45.0793ms",
                "37.4989ms",
                "26.6828ms"
              ],
              [
                "평균 FPS 환산",
                "22.18",
                "26.67",
                "37.48"
              ],
              [
                "P95",
                "54.8839ms",
                "45.6189ms",
                "35.6595ms"
              ],
              [
                "P99",
                "79.8222ms",
                "64.6820ms",
                "64.7119ms"
              ],
              [
                "최대",
                "607.5242ms",
                "441.0758ms",
                "681.3486ms"
              ],
              [
                "16.667ms 이내 비율",
                "0%",
                "0%",
                "4.64%"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "이동 평균은 개선됐지만 60FPS에는 미달합니다. 기준계+휴면의 최대 프레임은 오히려 더 컸습니다. 휴면과 복귀가 평소 비용을 줄였다는 것과 최악의 전환 프레임까지 해결했다는 것은 별개의 주장입니다."
          },
          {
            "kind": "paragraph",
            "text": "이 비교에는 준비 보류, 전환과 극단 프레임을 남겼습니다. 서로 다른 실제 궤적과 구간 길이 때문에 집계 가중치도 다릅니다. 일부 도보로 계획한 표본에 낙하 등이 섞이는 경우까지 있으므로 이 전체 값을 “순수 보행 FPS”라고 부르지 않습니다. 수동 Shipping 플레이 성능으로도 일반화하지 않습니다."
          }
        ]
      },
      {
        "id": "crash",
        "title": "5. 그런데 측정이 끝난 뒤 프로그램이 종료 중 실패했다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "이전 환경 이동 코스는 CSV와 경로 데이터를 남겼지만 종료 단계에서 0xc0000005가 반복됐습니다. 좋은 프레임 숫자가 있어도 프로세스 수명이 정상적으로 끝나지 않았다면 성공한 검증 실행으로 받아들일 수 없습니다. 당시 기본 활성화가 보류된 이유 중 하나입니다."
          },
          {
            "kind": "paragraph",
            "text": "덤프와 엔진 소스를 조사한 기록은 늦게 남은 Slate 텍스트·알림 정리와 ICU 종료 순서의 관계를 가리켰습니다. ICU는 텍스트 처리를 지원하는 라이브러리이고, 종료 뒤 남은 텍스트 객체가 정리되는 수명 순서가 문제가 될 수 있습니다. Python 실행 알림이 구체적인 후보였지만 덤프에 해당 객체의 전체 정보가 없어 정확한 생산자를 직접 식별했다고까지 주장하지 않습니다."
          },
          {
            "kind": "paragraph",
            "text": "후속 조치는 제품의 물리를 임의로 바꾸는 것이 아니라 측정 스크립트의 종료 절차를 바꾸는 것이었습니다. 측정과 기존 정리를 끝낸 뒤 keepalive를 해제하고 Python 실행기가 알림을 정리한 다음 종료하도록 제어를 돌려줬습니다."
          },
          {
            "kind": "code",
            "label": "종료 순서를 설명하는 의사 코드 · 중간 정리 작업 생략",
            "code": "측정을 끝내고 CSV와 보고서를 저장한다\nPIE와 프리뷰의 기존 정리를 끝낸다\nunreal.EditorPythonScripting.set_keep_python_script_alive(False)\n스크립트에서 반환한다\n실행기가 알림 완료와 종료 순서를 진행한다",
            "source": "followup/crash-investigation-summary.json 및 교정된 course03 종료 경로"
          },
          {
            "kind": "paragraph",
            "text": "이전 직접 quit 경로도 문서화된 API였습니다. 이를 지원하지 않는 사용법이라고 단정하지 않습니다. 해당 엔진·실행 경로에서 수명 정리가 너무 늦어질 수 있어 실행기 관리 종료로 바꾸어 검사한 것입니다."
          }
        ]
      },
      {
        "id": "comparison",
        "title": "6. 종료만 고친 측정도 무엇이 달랐는지 남긴다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "최종 이동 비교는 이전 성공한 legacy/frame course02와 종료를 교정한 environment course03을 선택했습니다. 측정·조종 코드는 같고 환경 코스의 캡처 이후 종료 경로만 별도로 교정됐다는 근거를 확인했습니다. 그래도 세 실행의 전체 하네스가 완전히 같다고 말하지는 않습니다."
          },
          {
            "kind": "paragraph",
            "text": "실패한 environment course02는 최종 집계에서 제외하고 실패 이력으로 보존했습니다. course03은 더 높은 FPS를 골라 쓰기 위해 선택한 것이 아니라 정상 종료와 수명 조건을 충족한 실행이기 때문에 사용합니다. 표본 하나의 성공으로 모든 에디터 종료 오류가 보편적으로 해결됐다고 결론내리지 않습니다."
          },
          {
            "kind": "paragraph",
            "text": "frame course02의 준비 사전 보류 3구간, 합계 2 accepted초도 보존했습니다. 이 숫자는 우주선이 멈춘 시간이나 충돌 Cook 시간과 같지 않습니다. 서로 다른 종류의 기다림을 하나의 “정지 시간”으로 합치지 않는 것이 측정의 중요한 부분입니다."
          }
        ]
      },
      {
        "id": "defaults",
        "title": "7. 후속 검사 후 실제 프로젝트 기본값에 적용하기",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "최신 기록은 Build16 Development와 DebugGame04 빌드 성공, full06 단일 실행 90개 통과를 보여줍니다. 90개는 경고 없는 78개와 경고가 있는 12개로 구성되고 경고 항목은 132개입니다. 별도의 integration06은 통합 검사 2개이며 full06에 합쳐 “단일 92개”라고 부르지 않습니다."
          },
          {
            "kind": "paragraph",
            "text": "7편의 실제 화물과 휴면 복귀 검증, 8편의 UI와 프리뷰 검사, 성능 조건을 확인한 뒤 프로젝트 INI의 세 설정을 1로 적용했습니다. C++ fallback은 false/0을 유지했습니다. 옵션의 코드 기본값만 읽으면 실제 프로젝트 기본 실행을 잘못 설명할 수 있는 경우입니다."
          },
          {
            "kind": "code",
            "label": "실제 프로젝트 INI의 적용값",
            "code": "Comet.ReferenceFrame.Enable=1\nComet.ReferenceFrame.AllowExperimentalPhysics=1\nComet.ReferenceFrame.EnvironmentDormancy=1",
            "source": "Config/DefaultEngine.ini · 2026.09.08 확인"
          },
          {
            "kind": "paragraph",
            "text": "그 뒤 feature 관련 명령줄 덮어쓰기 없이 시작한 default01이 process0으로 끝났고, 약 10.012 accepted초 동안 기본 실행 유지가 확인됐습니다. 설정 파일을 바꿨다는 사실과 그 설정으로 실제 시작한 검사를 따로 남긴 것입니다."
          },
          {
            "kind": "note",
            "title": "기능 적용 완료와 전체 확장 검증은 다릅니다",
            "text": "최신 정본에서 TASK021은 완료, TEST55·57은 통과입니다. TEST52·53·54·56 일부 범주는 부분 검증입니다. 지원 단일플레이 경로의 기본 적용과 모든 물리·재질·플레이 조합의 검증을 같은 의미로 사용하지 않습니다."
          }
        ]
      },
      {
        "id": "map",
        "title": "8. 지금까지의 변화는 어디에 남아 있는가",
        "blocks": [
          {
            "kind": "table",
            "caption": "전체 연재의 코드 지도",
            "columns": [
              "문제",
              "주요 위치",
              "변경의 중심"
            ],
            "rows": [
              [
                "생성·반영 쏠림",
                "VoxelManager",
                "작업 큐, 시간·개수 예산, revision"
              ],
              [
                "원거리 상세 지형",
                "Planet / VoxelChunk",
                "프록시, 분리·등록, 변환 복원"
              ],
              [
                "이동 구조의 불필요한 비용",
                "Planet / ScenePerformanceDiagnostics",
                "빈 청크, 겹침 소비자 확인, 측정"
              ],
              [
                "잘게 나뉜 식생 표시",
                "PlanetFoliageRenderBatches",
                "호환 장식 렌더러 묶음"
              ],
              [
                "현재 행성의 변환 전파",
                "PlanetReferenceFrameSubsystem",
                "논리 S와 플레이 P 분리"
              ],
              [
                "물리 시간·기준점",
                "ReferenceFramePhysicsAdapter",
                "accepted 시간, 서브스텝, COM"
              ],
              [
                "복귀 대기와 받침 이탈",
                "SceneActivation / PropMotionComponent",
                "국소 충돌, 로컬 대기, Start/End 재개"
              ],
              [
                "지도·재질 기준과 수명",
                "PlanetGlobeWidget / SolarSystemMapWidget",
                "캐시 유지, 스냅샷, 재질 좌표, 해제"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "같은 최적화라는 이름 아래 서로 다른 비용을 다뤘습니다. 생성 시간을 나누는 일, 활성 구조 수를 줄이는 일, 구조를 움직일 필요 자체를 줄이는 일, 정확성을 되찾는 후속 작업이 순서대로 연결됩니다. 하나의 옵션을 켜서 모든 문제가 해결된 과정은 아닙니다."
          }
        ]
      },
      {
        "id": "remaining",
        "title": "9. 다음에는 평균보다 이동 중 긴 프레임을 더 봐야 한다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "가장 분명한 남은 문제는 이동 코스의 평균 37.48FPS와 최대 681.3486ms입니다. 다음 성능 작업은 이 긴 프레임이 어느 준비·등록·메시 반영·렌더 단계와 겹쳤는지 원본 타임라인에서 좁히는 일부터 시작해야 합니다. 이 글만으로 단일 원인을 확정하지는 않습니다."
          },
          {
            "kind": "paragraph",
            "text": "최신 Prop 보완 이후의 같은 조건 재측정, 반복 실행의 변동, 실제 패키징 게임의 장시간 도보와 비행, GPU의 LOD·바람 시간 연속성도 별도로 확인할 과제입니다. 이번 글 작성 중 새로운 Unreal 빌드·플레이·벤치마크를 실행하지 않았습니다."
          },
          {
            "kind": "paragraph",
            "text": "코드를 읽을 때는 숫자 하나보다 각 편의 출발한 문제와 다음 문제를 함께 보면 좋습니다. 왜 큐가 두 개 필요한지, 왜 분리한 데이터의 로컬 좌표를 남기는지, 왜 화면과 충돌의 준비를 나누는지까지 이해하면 앞으로 기능을 고칠 때도 같은 기준을 적용할 수 있습니다."
          }
        ]
      }
    ],
    "sources": [
      {
        "label": "정지와 이동 비교의 공개 발췌",
        "detail": "followup/benchmark-final01-comparison.json 및 benchmark-course-corrected-final01-comparison.json. 전체 원본 대신 이 글에 필요한 조건·통계·제한을 발췌했습니다.",
        "href": "/optimization/evidence.json"
      },
      {
        "label": "종료 실패 조사",
        "detail": "followup/crash-investigation-summary.json과 최종 이동 비교의 source_and_finalizer_proof, excluded_failure_history. 정확한 런타임 알림 객체 식별의 한계를 보존했습니다."
      },
      {
        "label": "최종 빌드·검사·기본 실행",
        "detail": "Build16.log, Build-DebugGame04.log, tests-full06-process.json, tests-integration06-process.json, startup-default-default01-process.json, 최신 개발구조.xlsx RF38/RF44 및 TEST51~57."
      }
    ]
  }
] satisfies OptimizationPost[];

