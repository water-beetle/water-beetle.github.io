# ORBITAL FALL · Development Journal

운석 하나에서 시작하는 게임의 플레이 과정과 실제 개발 기록을 소개합니다. 공개 주소는 **https://water-beetle.github.io/**이며 기존 GitHub Pages 워크플로를 유지합니다.

## 실행과 확인

```powershell
npm ci
npm run dev
npx tsc --noEmit
npm run test:analytics
npm run test:devlog
npm run build:pages
npm run check:pages
npm run preview:pages
```

`dist/client`가 정적 산출물입니다. `main`에 push하면 기존 Pages 워크플로가 검사와 배포를 수행합니다. 이번 개편은 로컬 검토를 먼저 거칩니다. 초안 도구는 Git push나 배포를 실행하지 않습니다.

## 화면과 기술

- Vinext / React 19 / TypeScript, Meta Astryx의 컴포넌트·토큰에 프로젝트 고유 `orbital` 테마 적용.
- Three.js + React Three Fiber의 별도 지연 로드 3D 행성. 장식물이며 게임의 실제 행성 지형을 재현한 화면은 아닙니다. 드래그 회전, 화면 밖·탭 숨김 시 정지. 모바일은 정적 SVG로 시작하고 3D를 직접 켭니다. 모션 감소 설정·WebGL 미지원·로드 오류에는 정적 화면을 제공합니다.
- Motion은 스크롤의 작은 위치 변화에 사용합니다. 본문은 JavaScript 없이도 읽히며, 모든 주요 탐색은 링크와 버튼을 사용합니다.
- 6단계 플레이 과정, `/updates/` 필터와 개별 글, 실제 이미지 확대, 버튼으로 전환하는 배치 비교. 기존 `/features/[slug]/` 8개 주소를 보존합니다.
- Google Analytics의 DNT/GPC·로컬 미수집 정책과 기존 giscus Discussions 연결을 유지합니다.

## 실제 기록에서 글 만들기

`Comet/outputs/<검증폴더>/README.md`와 해당 폴더의 이미지에서 **비공개 로컬 초안**을 만듭니다.

```powershell
npm run devlog:draft -- --source G:/UnrealProjects/Comet/outputs/선택한-검증폴더 --slug new-field-note --title "새로운 개발 기록"
```

1. Git에서 제외한 `drafts/<slug>/article.json`과 `REVIEW.md`가 생깁니다. 원본 경로와 발췌는 이 폴더에만 보관합니다. 초안을 만든 것만으로 공개 색인이나 페이지가 추가되지 않습니다.
2. 글을 플레이어가 읽기 쉬운 문장으로 다듬고 현재 구현·과거 촬영·후속 계획을 구분합니다. `sourceFacts`는 참고자료이고 공개되지 않습니다.
3. `candidates`에서 사용할 이미지를 골라 `assets`에 `{ "source": "원본 절대 경로", "id": "고유-image-id", "alt": "설명", "caption": "촬영 날짜와 맥락" }`를 추가합니다. `cover`와 본문의 `media`, 비교의 `before`/`after`에는 이미지 id를 씁니다. 기존 `lib/journal-media.json`의 키를 재사용할 수도 있습니다. 새 이미지 키는 기존 키와 중복할 수 없습니다.
4. 검토 후 `reviewed: true`로 바꾸고 아래 명령을 실행합니다.

```powershell
npm run devlog:publish -- --slug new-field-note --reviewed
```

명시적으로 검토한 글의 공개 필드만 `content/published/<slug>.json`과 `index.json`에 반영하고, 선택한 이미지만 WebP 원본·썸네일로 변환합니다. `sourceFacts`·`candidates`·원본 로컬 경로는 공개 데이터에서 제외합니다. 기존 글 수정은 `--replace`를 추가합니다. 이후 타입 검사·빌드·정적 검사를 거쳐 로컬 미리보기와 글을 검토하고 기존 Pages로 게시합니다.

`lib/journal-media.json`은 새 글의 사진, `lib/features.ts`는 기존 8개 구현 페이지의 사진을 관리합니다. 촬영본의 출처와 변환 규칙은 `ASSETS.md`를 따릅니다. 원본은 Comet 프로젝트에서 보존합니다.

현재 새 게임에서 연결된 범위는 **첫 제작대 건설·연구·첫 드론 조립과 수령**까지입니다. 드론 전개·동력·자동 채굴, 공장과 우주선 성장 연결은 후속입니다. 과거 기능 사진에는 당시 검증 맥락을 표시합니다.
