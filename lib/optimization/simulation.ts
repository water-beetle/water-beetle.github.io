import type { OptimizationPost } from './types';

export const simulationPosts = [
  {
    "slug": "foliage-render-batches",
    "number": "04",
    "topic": "식생 · 인스턴싱 · 렌더링 단위",
    "title": "풀을 지우지 않고, 풀을 관리하는 묶음을 줄이기",
    "summary": "PCG가 지형별로 만든 식생을 같은 렌더 설정끼리 묶었습니다. 배치가 틀어지거나 재질이 달라지지 않도록 제한한 조건과, A/B 측정에서 실제로 줄어든 비용을 설명합니다.",
    "startingPoint": "식생 수보다 식생을 표시하는 컴포넌트가 여러 패치에 흩어진 구조가 부담을 만든다.",
    "result": "간단한 장식 식생만 호환되는 렌더러로 묶고 원본 생성 데이터와 복구 경로를 유지한다.",
    "sections": [
      {
        "id": "patches",
        "title": "1. 왜 이미 인스턴싱한 식생을 또 묶었을까",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "PCG는 지형 조건을 읽고 풀이나 바위를 배치합니다. 이 프로젝트는 지형 청크와 레이어에 따라 패치를 나눠 관리합니다. 패치 단위는 지형 수정이나 필요한 구간의 재생성을 처리하기에 편합니다. 하지만 생성에 편한 단위가 렌더링에도 가장 가벼운 단위인 것은 아닙니다."
          },
          {
            "kind": "paragraph",
            "text": "ISM, 즉 Instanced Static Mesh는 같은 메시를 여러 위치에 배치하기 위한 컴포넌트입니다. 그런데 패치마다 작은 ISM이 따로 있으면 같은 풀 모델을 쓰면서도 엔진에 등록된 렌더러가 여러 개 남습니다. 식생 하나하나를 Actor로 만들지 않아도, 너무 잘게 나뉜 컴포넌트 구조의 비용은 남을 수 있습니다."
          },
          {
            "kind": "paragraph",
            "text": "이번 변경은 PCG를 없애거나 식생 밀도를 낮추는 방식이 아닙니다. 생성과 수정에 필요한 패치 데이터는 유지하고, 표시할 때만 호환되는 것들을 더 큰 묶음으로 모읍니다. 배치 전에는 여러 창고에 흩어진 같은 물건을 각각 운반했다면, 배치 후에는 같은 조건의 물건을 한 운반 단위로 묶는 셈입니다."
          }
        ]
      },
      {
        "id": "eligibility",
        "title": "2. 아무 식생이나 합치면 충돌과 사용자 설정이 깨진다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "현재 BatchPatch의 진입 조건은 의도적으로 좁습니다. 패치 생성이 끝났고, 프로필 설정을 쓰며, 이동을 막는 레이어가 아닐 때만 후보가 됩니다. 큰 바위처럼 캐릭터나 우주선의 이동을 막는 식생을 장식용 처리로 바꾸면 게임 동작이 달라지기 때문입니다."
          },
          {
            "kind": "code",
            "label": "실제 코드 발췌 · 지원하지 않는 컴포넌트가 있으면 패치 유지",
            "code": "for (auto* Component : Components)\n    if (Component->GetClass() != UInstancedStaticMeshComponent::StaticClass()\n        || Component->IsCollisionEnabled() || Component->NumCustomDataFloats != 0\n        || Component->GetAttachParent() != Patch->GetRootComponent()) return;",
            "source": "Planet/Foliage/PlanetFoliageRenderBatches.cpp · BatchPatch"
          },
          {
            "kind": "paragraph",
            "text": "첫 조건은 정확히 기본 ISM인지 확인합니다. 별도 하위 클래스의 특별한 기능을 무시하지 않기 위해서입니다. 둘째는 충돌, 셋째는 인스턴스별 사용자 데이터, 넷째는 중첩된 부모 변환을 확인합니다. 이런 예외가 있으면 억지로 합치지 않고 원래 PCG 렌더러를 유지합니다."
          },
          {
            "kind": "paragraph",
            "text": "한 컴포넌트라도 조건에 맞지 않으면 그 패치를 기존 경로로 돌려보냅니다. 적용 범위를 먼저 제한하면 식생 종류마다 숨은 동작을 새 렌더러에서 전부 재구현할 필요가 없습니다. 이것은 아직 지원하지 않는 기능을 소리 없이 버리지 않기 위한 경계입니다."
          }
        ]
      },
      {
        "id": "descriptor",
        "title": "3. 메시가 같아도 렌더 설정이 다르면 다른 묶음이다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "RebuildRenderBatches는 ElementId, 원래 그림자 설정, FISMComponentDescriptor가 호환되는 것끼리 모읍니다. Descriptor는 메시와 재질 등 렌더러를 구성하는 설정을 비교하는 자료입니다. 현재 SameDescriptor는 기본 비교에 InstanceLODDistanceScale도 추가로 확인합니다."
          },
          {
            "kind": "code",
            "label": "실제 코드 발췌",
            "code": "bool SameDescriptor(const FISMComponentDescriptor& A, const FISMComponentDescriptor& B)\n{\n    return A == B && A.InstanceLODDistanceScale == B.InstanceLODDistanceScale;\n}",
            "source": "Planet/Foliage/PlanetFoliageRenderBatches.cpp"
          },
          {
            "kind": "paragraph",
            "text": "같은 풀 메시여도 한쪽은 다른 재질을 쓰거나 LOD 전환 거리가 다를 수 있습니다. 모양이 같다는 이유로 같은 컴포넌트에 넣으면 한쪽 설정을 잃습니다. 이 비교는 합쳐도 동작과 외형 설정을 공유할 수 있는지 확인하는 장치입니다."
          }
        ]
      },
      {
        "id": "transforms",
        "title": "4. 패치의 로컬 좌표를 그대로 복사하면 엉뚱한 곳에 나타난다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "각 ISM 안의 인스턴스 위치는 원래 컴포넌트를 기준으로 저장됩니다. 새 렌더러는 행성의 지형 관리자 아래에 붙습니다. 두 부모의 기준이 다르므로 위치 숫자만 복사하면 식생이 행성 중심으로 몰리거나 다른 곳으로 이동할 수 있습니다."
          },
          {
            "kind": "code",
            "label": "실제 코드 발췌 · 두 좌표계를 연결",
            "code": "Source.PlanetLocalTransform = Component->GetComponentTransform().GetRelativeTransform(ManagerTransform);\n\n// 각 인스턴스를 모으는 루프 안\nSource.Component->GetInstanceTransform(Index, Transform, false);\nGroup->Transforms.Add(Transform * Source.PlanetLocalTransform);",
            "source": "Planet/Foliage/PlanetFoliageRenderBatches.cpp · BatchPatch / RebuildRenderBatches"
          },
          {
            "kind": "paragraph",
            "text": "첫 줄은 원래 렌더러가 행성 관리자 안에서 어디에 있는지 저장합니다. GetInstanceTransform의 false는 여기서 원본 컴포넌트 기준의 변환을 읽습니다. 두 변환을 합성하면 새 부모인 행성 관리자 기준의 인스턴스 배치가 됩니다. 위치뿐 아니라 회전과 크기도 포함됩니다."
          },
          {
            "kind": "paragraph",
            "text": "원본 컴포넌트는 등록과 연결을 해제하지만 RenderSources에 보관합니다. 복원할 때는 행성 내부 좌표에서 다시 패치 내부 좌표로 환산합니다. 2편과 3편에서 봤던 “분리된 오브젝트의 과거 월드 위치를 정답으로 쓰지 않기”가 식생에도 적용된 것입니다."
          }
        ]
      },
      {
        "id": "visuals",
        "title": "5. 랜덤 색과 바람, 그림자도 함께 보존해야 한다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "인스턴스 개수가 같아도 랜덤 시드가 달라지면 재질에서 사용하는 변형이나 색 분포가 달라질 수 있습니다. 현재 코드는 원본의 InstancingRandomSeed와 AdditionalRandomSeeds를 모으고, 새로운 묶음에서 각 시드가 시작하는 인스턴스 인덱스를 보정합니다."
          },
          {
            "kind": "paragraph",
            "text": "바람의 World Position Offset과 그림자 옵션도 새 렌더러에 연결합니다. World Position Offset은 재질이 정점 위치를 움직이는 기능이고 식생 바람 표현에 사용됩니다. 단, 현재 새 묶음은 레이 트레이싱용 WPO 평가를 false로 설정합니다. 화면상의 바람을 유지한다는 말이 모든 레이 트레이싱 애니메이션 경로까지 동일하다는 뜻은 아닙니다."
          },
          {
            "kind": "note",
            "title": "외형 검사의 범위",
            "text": "별도 식생 렌더 검증에서 인스턴스 39개를 전후 유지하고 배치 렌더러 2개를 확인했습니다. 두 결과는 픽셀 단위로 완전히 같지는 않았습니다. 이 검사는 가시성을 위해 노출을 조정한 분리 장면이며 실제 플레이 조명이나 FPS 검증을 대신하지 않습니다."
          }
        ]
      },
      {
        "id": "dirty",
        "title": "6. 그런데 합친 묶음을 매 프레임 다시 만들면 의미가 없다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "배치를 모으는 과정도 모든 관련 인스턴스 변환을 읽고 새 배열에 넣는 작업입니다. 행성이 회전할 때마다 재조립하면 갱신 비용을 다른 함수로 옮긴 셈이 될 수 있습니다. 그래서 bRenderBatchesDirty가 있을 때만 RebuildRenderBatches를 실행합니다."
          },
          {
            "kind": "code",
            "label": "실제 코드 발췌 · 변경이 없으면 즉시 반환",
            "code": "if (!bRenderBatchesDirty) return;\nCSV_SCOPED_TIMING_STAT_GLOBAL(CometFoliageBatchRebuild);\nbRenderBatchesDirty = false;",
            "source": "Planet/Foliage/PlanetFoliageRenderBatches.cpp · RebuildRenderBatches"
          },
          {
            "kind": "paragraph",
            "text": "패치가 새로 준비되거나 기존 패치가 없어지거나 배치 모드를 바꾸면 dirty 상태가 됩니다. 행성 자체의 이동은 부모 변환이 담당하므로, 행성 내부의 배치가 그대로라면 인스턴스 배열을 매번 다시 만들 필요가 없습니다. 원본과 새 표시 묶음을 분리한 덕분에 가능한 구조입니다."
          }
        ]
      },
      {
        "id": "ab",
        "title": "7. 같은 실행에서 끄고 켜며 무엇이 줄었는지 확인하기",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "보관된 batching-comparison은 같은 실행에서 배치 꺼짐→켜짐→꺼짐→켜짐을 비교했습니다. 출력은 아래 네 구간에서 2560×1440이며 자동 내부 화면 비율을 사용했습니다. 바람, 그림자, 레이 트레이싱은 유지했고 VSync와 프레임 제한을 껐습니다. 초기 위치에서 정지한 장면이며 도보·비행·패키징 실행은 아닙니다."
          },
          {
            "kind": "table",
            "caption": "배치 A/B 기록 · 평균 시간 ms, FPS는 평균 프레임 시간 환산",
            "columns": [
              "항목",
              "꺼짐 1",
              "켜짐 1",
              "꺼짐 2",
              "켜짐 2"
            ],
            "rows": [
              [
                "전체 프레임",
                "17.4562",
                "15.1363",
                "18.6708",
                "14.8773"
              ],
              [
                "행성 변환",
                "6.2897",
                "5.6017",
                "6.4302",
                "5.5119"
              ],
              [
                "EndOfFrameUpdates",
                "4.0448",
                "1.5960",
                "4.4188",
                "1.4872"
              ],
              [
                "RT 인스턴스 수집 구간",
                "2.1230",
                "0.0383",
                "2.3182",
                "0.0403"
              ],
              [
                "평균 FPS 환산",
                "57.29",
                "66.07",
                "53.56",
                "67.22"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "행성 변환 자체도 줄었지만 프레임 끝 갱신과 레이 트레이싱 인스턴스 수집 구간에서 더 뚜렷한 감소가 보입니다. 풀을 생성하는 알고리즘을 빠르게 만든 결과라기보다, 장면에 흩어진 렌더러 구조를 정리한 효과로 읽는 것이 맞습니다."
          },
          {
            "kind": "paragraph",
            "text": "켜짐 1차의 16.667ms 이내 프레임 비율은 92.0%, 2차는 92.6%입니다. 평균이 60FPS를 넘었어도 모든 프레임이 기준 안에 들어온 것은 아닙니다. 또 후속 개발로 장면이 바뀌므로 이 숫자를 최신 전체 게임 성능으로 재사용하면 안 됩니다."
          }
        ]
      },
      {
        "id": "next",
        "title": "8. 그래도 현재 행성의 변환 비용은 남았다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "배치는 같은 표현을 더 적은 호환 렌더러로 처리하는 변화였습니다. 그러나 상세 지형과 실제 충돌, 집과 여러 환경 객체까지 모두 하나로 합칠 수는 없습니다. 플레이어가 서 있는 행성은 여전히 복잡한 구조를 갖고 움직입니다."
          },
          {
            "kind": "paragraph",
            "text": "다음 단계에서는 더 근본적인 질문으로 넘어갑니다. 플레이어가 서 있는 행성 자체를 플레이 공간에서 고정하고, 태양계의 실제 운동은 별도의 논리 좌표에서 계산하면 어떨까요. 이 선택은 큰 비용을 줄일 여지가 있지만 속도, 물리, 지도의 기준까지 바꾸는 작업이 됩니다."
          }
        ]
      }
    ],
    "sources": [
      {
        "label": "현재 구현",
        "detail": "Planet/Foliage/PlanetFoliageRenderBatches.cpp — BatchPatch, RestorePatchRendering, RebuildRenderBatches. PlanetFoliageComponent.cpp — dirty 갱신과 실행 연결."
      },
      {
        "label": "실행 보고서",
        "detail": "outputs/planet-transform-performance/batching-comparison.json 및 foliage-render-validation.json. A/B 성능과 별도 39개 식생 렌더 검사를 구분했습니다.",
        "href": "/optimization/evidence.json"
      },
      {
        "label": "Epic Games · Instanced Static Mesh",
        "detail": "ISM의 기본 개념 참고. 프로젝트의 배치 조건과 성능값은 자체 코드·보고서 기준입니다.",
        "href": "https://dev.epicgames.com/documentation/unreal-engine/instanced-static-mesh-component-in-unreal-engine"
      }
    ]
  },
  {
    "slug": "planet-reference-frame",
    "number": "05",
    "topic": "행성 기준계 · 좌표 · 전환",
    "title": "현재 행성을 움직이지 않으면 어떨까",
    "summary": "자전과 공전을 없애지 않으면서 현재 행성의 복잡한 구조를 고정했습니다. 태양계 좌표와 플레이 좌표를 나눈 이유부터, 위치만 옮기면 속도가 틀어지는 문제까지 따라갑니다.",
    "startingPoint": "현재 행성에 필요한 상세 구조는 남겨야 하므로 컴포넌트 수만 줄이는 데 한계가 있다.",
    "result": "태양계의 논리 운동과 플레이 공간의 배치를 분리해 현재 행성의 변환 전파를 피한다.",
    "sections": [
      {
        "id": "idea",
        "title": "1. 공전을 멈추는 것이 아니라 관찰 기준을 바꾸기",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "기존 방식은 태양계 공간 안에서 행성 Actor를 이동·회전시킵니다. 행성에 붙은 지형과 집, 식생도 따라갑니다. 플레이어가 한 행성에서 생활하는 동안에도 그 행성 전체의 변환이 계속 바뀌는 구조입니다."
          },
          {
            "kind": "paragraph",
            "text": "새 접근은 현재 행성과 함께 이동하고 회전하는 좌표계를 플레이 공간으로 삼습니다. 그 기준에서 현재 행성은 고정돼 보이고 다른 천체가 상대적으로 움직입니다. 태양계에서 행성이 자전·공전한다는 논리 상태는 계속 계산합니다. 좌표 표현을 바꾸는 것이므로 행성의 물리적 운동 규칙을 단순히 정지시키는 기능은 아닙니다."
          },
          {
            "kind": "paragraph",
            "text": "기차 안에서 책상 위치를 기록할 때 지구 기준 좌표가 매 순간 달라져도 객실 기준 좌표는 그대로인 것과 비슷합니다. 다만 게임에서는 책상뿐 아니라 날아가는 우주선과 떨어지는 화물도 있으므로 위치만 바꾸면 끝나지 않습니다."
          }
        ]
      },
      {
        "id": "spaces",
        "title": "2. 코드의 S와 P를 먼저 구분하기",
        "blocks": [
          {
            "kind": "table",
            "caption": "이후 편에서 계속 사용하는 좌표 이름",
            "columns": [
              "이름",
              "의미",
              "주로 담는 정보"
            ],
            "rows": [
              [
                "S / Solar",
                "태양계 논리 공간",
                "천체의 궤도·자전 상태, 기준을 바꿔도 유지할 운동"
              ],
              [
                "P / Play",
                "현재 플레이 공간",
                "엔진에 배치된 Actor, 충돌, 카메라"
              ],
              [
                "행성 로컬",
                "특정 행성 내부 기준",
                "청크·식생·집·기다리는 화물의 배치"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "행성 로컬과 P도 항상 같은 것은 아닙니다. P는 현재 선택한 기준계에 따라 바뀌지만, 다른 행성 안의 집 위치는 그 다른 행성의 로컬 좌표로 보관해야 합니다. 셋을 구분하지 않고 WorldPosition이라는 말로 뭉치면 후속 버그를 찾기 어려워집니다."
          },
          {
            "kind": "code",
            "label": "실제 코드 발췌 · S 위치를 P 위치로 변환",
            "code": "return RotationSolar.UnrotateVector(SolarPosition - OriginSolar);",
            "source": "SolarSystem/ReferenceFrameTypes.cpp · SolarToPlayPosition"
          },
          {
            "kind": "paragraph",
            "text": "먼저 SolarPosition에서 기준계 원점 OriginSolar를 뺍니다. 그다음 기준계 회전을 거꾸로 적용합니다. UnrotateVector가 그 역회전입니다. 결과는 현재 기준으로 본 위치입니다. 반대 방향인 PlayToSolarPosition은 회전을 적용한 뒤 원점을 더합니다."
          }
        ]
      },
      {
        "id": "implementation",
        "title": "3. 논리 상태를 계산한 뒤 실제 배치에 옮기기",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "UpdateLogicalBodyStates는 태양계 기준의 천체 상태를 계산합니다. UpdateGeneratedBodies는 현재 기준계를 가져와 논리 위치·회전을 플레이 공간으로 바꿉니다. 활성 행성의 기준계에서는 그 행성의 실제 배치가 일정하므로 이전 변환과 같다면 위치·회전 setter를 호출하지 않습니다."
          },
          {
            "kind": "code",
            "label": "실제 코드 발췌 · 변화가 있을 때만 적용",
            "code": "if (!PreviousLocation.Equals(NewLocation, 1.e-6) || !PreviousRotation.Equals(NewRotation, 1.e-10))\n{\n    // 프로파일 측정 코드 생략\n    Body->SetActorLocationAndRotation(NewLocation, NewRotation);\n}",
            "source": "SolarSystem/SolarSystem.cpp · UpdateGeneratedBodies"
          },
          {
            "kind": "paragraph",
            "text": "Equals 뒤의 작은 숫자는 수치 비교 허용치입니다. 부동소수점 계산의 아주 작은 차이까지 전부 이동으로 처리하지 않도록 합니다. 중요한 변화는 if문 자체의 비용이 아니라, 현재 행성 아래의 전체 계층에 변환을 전파하는 호출을 건너뛸 수 있게 됐다는 점입니다."
          },
          {
            "kind": "paragraph",
            "text": "다른 천체는 현재 기준에서 상대적으로 움직이므로 계속 갱신합니다. 따라서 이 변경만으로 태양계 전체의 변환 비용이 사라지지는 않습니다. 먼 행성의 환경 휴면을 결합했을 때 추가 감소가 있었던 이유는 7편과 9편에서 연결합니다."
          }
        ]
      },
      {
        "id": "velocity",
        "title": "4. 그런데 위치만 변환하면 이륙 속도가 틀어진다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "회전하는 행성의 표면에 가만히 서 있어도 태양계 기준으로는 움직이고 있습니다. 표면의 점속도는 행성 중심의 이동 속도와 회전에 의한 속도를 합친 값입니다. 이륙하는 순간 그 운동을 잘못 빼거나 두 번 더하면 우주선의 속도가 갑자기 달라질 수 있습니다."
          },
          {
            "kind": "code",
            "label": "실제 코드 발췌 · 속도 변환",
            "code": "return SolarToPlayVector(SolarVelocity - LinearVelocitySolar\n    - FVector::CrossProduct(AngularVelocitySolar, SolarPosition - OriginSolar));",
            "source": "SolarSystem/ReferenceFrameTypes.cpp · SolarToPlayVelocity"
          },
          {
            "kind": "paragraph",
            "text": "LinearVelocitySolar는 기준계 원점의 이동 속도입니다. CrossProduct 항은 각속도와 원점에서의 거리로 계산하는 회전의 점속도입니다. 둘을 뺀 다음 기준계의 축 방향으로 바꿉니다. 따라서 같은 태양계 속도라도 어디에 있는 물체인지에 따라 플레이 공간 속도가 달라질 수 있습니다."
          },
          {
            "kind": "paragraph",
            "text": "예를 들어 회전판 중심과 가장자리는 같은 각도로 돌지만 가장자리의 이동 거리가 더 큽니다. 그러므로 속도 변환 함수에 속도뿐 아니라 위치도 들어갑니다. 각속도도 기준계의 회전 속도를 빼고 축을 바꿔야 합니다. “위치만 원점 근처로 옮기기”와 다른 작업입니다."
          }
        ]
      },
      {
        "id": "transition",
        "title": "5. 모든 객체가 한 번에 같은 기준으로 넘어가야 한다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "캐릭터만 먼저 새 좌표로 바꾸고 우주선이나 화물은 다음 프레임에 바꾸면 잠깐 서로 다른 공간을 기준으로 계산합니다. 충돌, 중력, 착륙 판정에서 같은 장면을 다르게 해석할 수 있습니다. 그래서 전환은 관련 객체와 물리 지원 조건을 먼저 점검한 뒤 하나의 변경으로 처리해야 합니다."
          },
          {
            "kind": "paragraph",
            "text": "PlanetReferenceFrameSubsystem은 기준계, 알려진 천체, 전환 상태와 revision을 관리합니다. 캐릭터와 우주선, 화물, 물리 어댑터가 해당 전환에 맞춰 위치·자세·속도와 저장된 값을 바꾸는 구조입니다. revision은 데이터가 어느 기준계 전환에 속하는지를 식별하는 번호입니다."
          },
          {
            "kind": "paragraph",
            "text": "전환할 때마다 쓸모 있는 태양계 기준 값까지 잃으면 반복 왕복에서 오차나 운동 변화가 쌓일 수 있습니다. 그래서 보관할 운동을 S로 유지하고 필요한 시점의 P로 변환하는 접근을 사용합니다. 변환을 적용하는 객체뿐 아니라 캐시와 대기 중인 값도 확인해야 합니다."
          }
        ]
      },
      {
        "id": "failure",
        "title": "6. 처음에는 구현했어도 기본으로 켜지 않았다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "초기 implementation 검증에서는 관련 검사 69개와 빌드를 통과했지만 전체 통합 조건은 남아 있었습니다. 접근 행성의 충돌을 기다리는 짧은 비행 정지, 지도 캐시 검증 범위, 실제 화물과 이동 코스 확인 등이 부족했습니다. 그래서 이 시기의 기능·실험 물리·환경 휴면 기본값은 꺼진 상태였습니다."
          },
          {
            "kind": "paragraph",
            "text": "후속 작업은 그 미완료 항목을 해결하고 검증했습니다. 최신 정본과 실제 INI에서는 세 설정이 모두 1이고, 명령줄 덮어쓰기 없이 시작한 default01도 통과했습니다. C++ fallback이 false/0으로 남은 것과 프로젝트의 실제 기본 실행이 켜진 것은 구분해야 합니다."
          },
          {
            "kind": "note",
            "title": "현재 상태 · 2026.09.08",
            "text": "프로젝트 INI의 Enable, AllowExperimentalPhysics, EnvironmentDormancy가 1입니다. 초기 보류 기록은 과거 상태로 보존합니다. 후속 해결 과정과 활성화 근거는 6~9편에서 이어집니다."
          }
        ]
      },
      {
        "id": "next",
        "title": "7. 좌표를 바꾸면 물리의 시간과 기준점도 맞춰야 한다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "좌표 변환의 왕복 계산이 맞는 것만으로 실제 물리가 같다는 보장은 없습니다. 프레임이 길어진 순간 물리 엔진이 진행한 시간과 행성 논리가 진행한 시간이 다를 수 있고, 물체 피벗과 질량 중심이 다른 경우도 있습니다."
          },
          {
            "kind": "paragraph",
            "text": "다음 편은 수식보다 실제 엔진의 실행 순서를 다룹니다. 물리가 받아들인 시간으로 천체를 진행시키고, 서브스텝과 질량 중심에서 변환을 적용하는 이유를 하나씩 읽습니다."
          }
        ]
      }
    ],
    "sources": [
      {
        "label": "현재 좌표·배치 구현",
        "detail": "SolarSystem/ReferenceFrameTypes.cpp — 위치·속도 변환. SolarSystem/SolarSystem.cpp — UpdateLogicalBodyStates, UpdateGeneratedBodies. PlanetReferenceFrameSubsystem.cpp — 전환과 revision."
      },
      {
        "label": "초기와 후속 검증 구분",
        "detail": "planet-reference-frame-implementation/validation-summary.json 및 최신 개발구조.xlsx RF38/RF44. 초기 69개 결과와 후속 기본 적용을 구분했습니다."
      },
      {
        "label": "현재 기본 실행 근거",
        "detail": "planet-reference-frame-followup/project-defaults-applied.json, startup-default-default01-process.json 및 실제 DefaultEngine.ini.",
        "href": "/optimization/evidence.json"
      }
    ]
  },
  {
    "slug": "physics-clock-and-center-of-mass",
    "number": "06",
    "topic": "동기 물리 · 공통 시계 · 질량 중심",
    "title": "행성은 고정됐는데, 물리는 같은 운동을 하고 있을까",
    "summary": "논리 시간과 물리 시간의 차이, 서브스텝, 질량 중심을 정리합니다. 회전 기준계에서 힘·속도·충돌을 다루는 코드와, 수식 검사만으로 완료를 선언할 수 없었던 이유를 설명합니다.",
    "startingPoint": "좌표 변환이 맞아도 시간 구간과 물리 기준점이 다르면 캐릭터·우주선·화물의 운동이 달라진다.",
    "result": "실제 물리 진행 시간과 시작·끝 기준계를 공유하고, 지원 강체의 질량 중심에서 운동을 맞춘다.",
    "sections": [
      {
        "id": "clock",
        "title": "1. 긴 프레임이 오면 두 시계가 어긋날 수 있다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "게임 프레임이 갑자기 길어져도 물리 엔진이 그 시간을 전부 한 번에 계산하지는 않을 수 있습니다. 한 번에 처리할 최대 시간과 서브스텝 개수 같은 설정이 있기 때문입니다. 그런데 태양계 논리가 화면 프레임 시간만큼 전부 진행하면, 행성은 더 먼 미래에 있는데 물체는 그보다 적은 시간만 움직인 상태가 됩니다."
          },
          {
            "kind": "paragraph",
            "text": "예를 들어 1초짜리 멈춤이 발생했을 때 행성 궤도는 1초 진행했지만 물리는 그 일부만 받아들였다면, 같은 프레임에 서로 다른 시각을 보게 됩니다. 이 1초 예시는 실제 회귀 검사에도 사용되는 hitch 상황입니다. 문제는 단순히 느려지는 것이 아니라 시간 기준이 달라지는 것입니다."
          },
          {
            "kind": "paragraph",
            "text": "현재 경로는 동기 물리에서 받아들일 수 있는 진행 시간으로 천체를 갱신하도록 연결합니다. 기능이 켜진 동안에는 행성 기준계뿐 아니라 우주 기준에 있을 때도 공통 물리 시계를 사용합니다. 기능 자체를 명시적으로 끈 기존 모드는 원래의 월드 프레임 시간 정책을 유지하므로, 두 경로가 완전히 같은 시계라고 설명하면 안 됩니다. 태양계 배속 요청과 실제 적용 배속도 따로 기록합니다."
          }
        ]
      },
      {
        "id": "interval",
        "title": "2. 기준계 하나가 아니라 시작과 끝의 구간이 필요하다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "물리 엔진은 한 프레임을 작은 여러 단계로 나눌 수 있습니다. 이를 서브스텝이라고 합니다. 각 단계에서 기준계가 얼마나 이동하고 회전했는지 알아야 하므로 프레임 마지막 변환 하나만 넘겨서는 충분하지 않습니다."
          },
          {
            "kind": "paragraph",
            "text": "FCometReferenceFrameInterval은 시작과 끝 기준계를 보관하고 구간 안 시점의 상태를 평가합니다. 두 끝점의 위치·속도·가속도와 회전 관련 값을 연결합니다. 코드가 이 연결을 길게 구현한 이유는 기준계가 이동하는 속도 자체가 물체의 속도 변환에 사용되기 때문입니다."
          },
          {
            "kind": "flow",
            "label": "동일한 시간 구간을 공유하는 흐름",
            "steps": [
              "이번 물리 진행 시간 결정",
              "천체와 기준계의 시작·끝 상태 계산",
              "각 서브스텝 시각의 기준계 평가",
              "같은 구간에서 강체 운동·충돌 처리"
            ]
          },
          {
            "kind": "paragraph",
            "text": "회전은 특히 조심해야 합니다. 한 바퀴 돈 뒤의 방향은 출발 방향과 같을 수 있습니다. 끝점의 방향 두 개만 단순 보간하면 그 사이에 한 바퀴 돌았다는 정보가 사라집니다. 현재 코드는 시작 각속도의 전체 회전을 보존하고 남은 회전 차이를 연결하는 경로를 갖습니다."
          }
        ]
      },
      {
        "id": "inertial",
        "title": "3. 회전하는 좌표에서는 속도와 가속도의 해석이 달라진다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "5편에서는 기준계의 이동 속도와 회전 점속도를 빼서 물체의 상대 속도를 구했습니다. 가속도에는 기준계 자체의 가속과 회전에서 오는 항도 필요합니다. ReferenceFrameTypes에는 이동 가속도 보정과 회전 관련 항을 계산하는 함수가 있습니다."
          },
          {
            "kind": "paragraph",
            "text": "다만 현재 강체 어댑터의 동작을 “원심력 하나를 더했다”로 설명하면 틀립니다. 실제 구현은 서브스텝의 힘·토크·임펄스, 감쇠와 속도 제한을 읽어 태양계 기준 운동을 계산하고, 그 결과의 질량 중심 자세와 속도를 플레이 공간으로 연결합니다. 좌표 변환 공식과 엔진의 강체 처리 경로를 구분해야 합니다."
          },
          {
            "kind": "paragraph",
            "text": "감쇠는 속도를 줄이는 처리이고, 임펄스는 짧은 순간에 운동을 바꾸는 입력입니다. 같은 변환을 적용해도 이 입력의 기준이나 적용 순서를 바꾸면 원래 게임과 다른 물리가 될 수 있습니다. 그래서 회귀 검사는 자유 낙하만으로 끝나지 않고 힘, 토크, 중앙 임펄스, 감쇠, 속도 제한 등을 나눠 확인합니다."
          }
        ]
      },
      {
        "id": "com",
        "title": "4. Actor 중심과 질량 중심은 다를 수 있다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "모델의 피벗은 제작자가 정한 기준점입니다. 질량 중심, COM은 물리가 선속도와 회전을 다룰 때 사용하는 기준점입니다. 비대칭 물체나 여러 형상이 연결된 선박에서는 둘이 다를 수 있습니다. 원점이 같은 단순 구로만 검사하면 이 차이를 놓치기 쉽습니다."
          },
          {
            "kind": "code",
            "label": "실제 코드 발췌 · 회전하는 물체의 지점 속도",
            "code": "const FVector Velocity = COMVelocity + FVector::CrossProduct(AngularVelocity, Position - CurrentCOM);",
            "source": "Spaceship/SpaceshipFlight.cpp · 상세 충돌 준비 예측 경로"
          },
          {
            "kind": "paragraph",
            "text": "COMVelocity는 질량 중심의 속도입니다. Position은 지금 검사하려는 지점이고, 그 지점과 COM의 차이에 각속도를 외적한 값을 더합니다. 회전 중인 선박의 앞부분이 어디로 움직일지 보려면 COM의 속도만으로는 부족하기 때문입니다."
          },
          {
            "kind": "paragraph",
            "text": "후속 이륙 처리도 실제 물리 활성화 뒤의 최종 COM을 기준으로 행성의 점속도를 계승합니다. 물리를 켜기 전 예상 중심으로 계산한 값을 그대로 쓰면 실제 물리 바디의 중심과 어긋날 수 있습니다. 착륙 상대속도 역시 같은 기준을 사용해야 합니다."
          }
        ]
      },
      {
        "id": "weld",
        "title": "5. 선박의 용접 자식을 따로 또 처리하지 않기",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "여러 부품이 하나의 물리 바디로 용접된 선박은 눈에 보이는 컴포넌트 수와 독립 물리 바디 수가 같지 않을 수 있습니다. 루트의 움직임을 보정한 뒤 용접 자식에 같은 보정을 다시 적용하면 중복 처리가 됩니다."
          },
          {
            "kind": "paragraph",
            "text": "현재 지원 경로는 독립 루트와 용접된 형상을 구분하고, 지원하는 선박 구조를 검사합니다. 장면에 PrimitiveComponent가 있다고 전부 독립 강체처럼 처리하는 식의 일반화는 하지 않습니다. 물체 목록의 수명과 등록 변화도 어댑터가 알아야 합니다."
          },
          {
            "kind": "note",
            "title": "지원 범위는 따로 있습니다",
            "text": "초기 지원은 동기 Chaos, gyro off, SixDOF와 프로젝트 중력 경로를 중심으로 합니다. 현재 기본 적용이 켜졌다고 모든 Unreal 물리 조합, 비동기 물리, 네트워크까지 검증됐다는 뜻은 아닙니다."
          }
        ]
      },
      {
        "id": "tests",
        "title": "6. 계산 테스트와 실제 물리 테스트를 나눠야 했던 이유",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "위치·회전·속도를 S→P→S로 왕복해 원래 값이 나오는 검사는 변환 수식의 일관성을 봅니다. 그러나 물리 엔진이 언제 힘을 적용하고 접촉을 계산하는지는 그 검사만으로 확인할 수 없습니다. 그래서 실제 UWorld와 Chaos 바디를 만드는 검사도 따로 사용했습니다."
          },
          {
            "kind": "paragraph",
            "text": "보관된 초기 물리 검증은 COM이 치우친 비구형 강체의 자유 운동, 힘·토크·중앙 임펄스, 감쇠, 속도 제한, 60초 접촉, 긴 프레임과 타원 궤도 구간을 다룹니다. 30/60/120FPS 및 30FPS+120Hz 서브스텝 구성도 구분합니다. 후속 full06에는 공통 시계와 행성의 실제 물리 시작·끝 자세 검사 등이 포함됩니다."
          },
          {
            "kind": "paragraph",
            "text": "그럼에도 최신 정본에서 TEST52, TEST53, TEST54 일부 범주는 부분 검증입니다. 일반화된 모든 물리·플레이 경우의 완료와 현재 지원 경로의 통과는 다릅니다. 90개 검사 통과를 모든 상황의 무결함으로 바꾸어 읽지 않습니다."
          }
        ]
      },
      {
        "id": "next",
        "title": "7. 물리 계산이 맞아도 아직 땅이 준비되지 않았을 수 있다",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "올바른 좌표, 시간, COM을 사용해도 충돌할 지형이 아직 Cook 중이면 정상 접촉을 기대할 수 없습니다. 반대로 먼 곳의 충돌 하나가 준비되지 않았다는 이유로 비행 전체를 멈추면 최적화의 사용감이 나빠집니다."
          },
          {
            "kind": "paragraph",
            "text": "다음 편에서는 준비를 미리 요청하는 구간과 정말 멈춰야 하는 짧은 구간을 나눕니다. 그리고 화물을 기다리게 했더니 움직이는 받침에서 벗어났던 실제 실패와 그 복원 순서의 수정을 연결합니다."
          }
        ]
      }
    ],
    "sources": [
      {
        "label": "현재 물리 구현",
        "detail": "SolarSystem/ReferenceFrameTypes.cpp, ReferenceFramePhysicsAdapter.cpp, PlanetReferenceFrameSubsystem.cpp, SolarSystem.cpp. Spaceship/SpaceshipFlight.cpp — COM 기준 지점 속도와 준비 예측."
      },
      {
        "label": "실행 기록과 판정",
        "detail": "planet-reference-frame-implementation/validation-summary.json의 물리 검사 범위, followup/tests-full06-process.json 및 최신 개발구조.xlsx TEST51~57. 초기 검사와 최신 회귀를 구분합니다.",
        "href": "/optimization/evidence.json"
      }
    ]
  }
] satisfies OptimizationPost[];
