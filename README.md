# Orbital Days DevLog

우주 생활 시뮬레이터 개발일지. 영어 브랜드명, 한국어 본문, 반응형 화면, 이미지 확대 보기, MP4/WebM 재생을 지원합니다.

## 글 쓰기
1. 스크린샷이나 영상 파일을 `public/media/`에 넣습니다.
2. `lib/devlog.ts`의 `devlogs` 배열 맨 앞에 글을 추가합니다. 첫 번째 글이 메인에 표시됩니다.
3. 고유한 `id`, `number`, 제목, 요약, 태그, 본문 섹션을 입력합니다. `date: '2026.09.06'`처럼 작성일을 넣고, 주간 기록은 `period`에 기간을 적습니다.
4. 글 주소는 `/#글-id`입니다. 본문 섹션의 `media` 배열에 이미지를 넣으면 캡션과 확대 보기가 함께 표시됩니다.
5. 로컬 변경은 미리보기에 반영되며, 외부 사이트 반영은 새 게시가 필요합니다.

이미지 예:
```ts
media: {
  kind: 'image',
  src: '/media/cabin-01.jpg',
  alt: '플레이어가 선내 주방에서 식사를 준비하는 화면',
  caption: '선내 생활 구현 화면',
  width: 1920,
  height: 1080,
}
```

짧은 영상 예:
```ts
media: {
  kind: 'video',
  src: '/media/docking.webm',
  poster: '/media/docking-poster.jpg',
  alt: '우주선이 정거장에 도킹하는 과정',
  caption: '도킹 동작 테스트',
  captions: '/media/docking.ko.vtt', // 음성 설명이 있다면 한국어 자막 파일
}
```

영상은 자동 재생하지 않으며 기본 재생·볼륨·탐색·전체 화면 컨트롤을 사용합니다. 음성이 없는 클립은 captions를 생략할 수 있습니다. 실제 영상은 아직 포함되어 있지 않습니다. 방문자는 GitHub 계정으로 댓글을 남길 수 있으며 별도 웹 편집기나 업로드 관리자는 없습니다.

## 방문 통계와 댓글

- 방문 통계는 Google Analytics 4 관리자에서 확인합니다. 사이트 하단 **방문 통계 · 관리자**로 이동하며, 통계 조회 권한이 있는 Google 계정으로 로그인해야 합니다. 공개 조회수 숫자는 표시하지 않습니다.
- 연결 정보는 `lib/site-integrations.ts`에 있습니다. 측정 ID는 공개 식별자이며 비밀번호나 API 비밀 키가 아닙니다.
- GA의 **보고서 → 실시간**에서 최근 방문, **페이지 및 화면**에서 조회수, **트래픽 획득**에서 유입 경로를 확인합니다. 일반 보고서는 수집·처리에 시간이 걸립니다. 새 속성을 만든 이후의 방문부터 집계되며 과거 방문은 복원되지 않습니다.
- `public/site-analytics.js`는 공개 블로그 도메인에서만 실행합니다. 기본 `page_view`를 중복 전송하지 않습니다. URL의 쿼리와 해시, 이름·이메일·GitHub 계정 정보를 추가 전송하지 않으며 광고 개인화와 Google 신호를 사용하지 않습니다. 브라우저의 DNT/GPC 설정으로 수집을 거부한 경우 태그를 실행하지 않습니다. 광고 차단기 등으로 모든 방문이 잡히지는 않습니다.
- 여러 개발일지가 한 페이지 안에 있으므로 별도 `article_view` 이벤트도 보냅니다. 글 제목이 화면에 50% 이상 나타난 채 2초가 지나면 한 번 기록하며, 빠르게 지나치거나 숨겨진 탭은 제외합니다. 완독 수치는 아닙니다. `article_id`, `article_title`, `article_type` 매개변수를 사용하며 페이지 조회수와 별도로 해석합니다.
- 댓글은 giscus와 이 저장소의 GitHub Discussions를 사용합니다. 저장소에 [giscus 앱](https://github.com/apps/giscus)이 설치되어 있어야 합니다. 앱 권한은 이 블로그 저장소에만 허용하면 됩니다.
- 댓글은 `Announcements` 카테고리에 저장되며 첫 댓글이 달릴 때 해당 글의 Discussion이 생성됩니다. 개발일지는 `/#글-id`, 최적화 글은 `/optimization/글-slug/`로 연결하므로 제목을 고쳐도 댓글이 유지됩니다. 기존 id와 slug는 바꾸지 마세요.
- `giscus.json`은 댓글을 표시할 수 있는 사이트 출처를 제한합니다. 댓글 삭제·숨김 등 관리는 GitHub Discussions에서 합니다.
- 검사: `npm run test:analytics`, `npx tsc --noEmit`, `npm run build:pages`, `npm run check:pages`.

## 로컬 실행
- `npm install`
- `npm run dev`
- `npm run build:pages`
- `npx tsc --noEmit`

## 최적화 연재

`/optimization/`에 전체 14편 목차를 두고, 각 글은 `/optimization/글-slug/`의 독립된 정적 페이지로 제공합니다. 주 메뉴의 **최적화**에서 이동합니다. 본문 목차와 이전·다음 편 링크로 한 편씩 읽습니다. 목차 상단에서 추가 최적화 10편으로 바로 이동할 수 있습니다.

- `lib/optimization/terrain.ts`: 01~03편 — 생성 예산, 원거리 프록시, 행성 이동 진단.
- `lib/optimization/simulation.ts`: 04~06편 — 식생 배치, 기준계, 물리 시계와 COM.
- `lib/optimization/followup.ts`: 07~09편 — 충돌·화물, 지도·재질, 성능 및 적용 검증.
- `lib/optimization/additional.ts`: 10~14편 — 공통 작업 예산, 화면 LOD와 충돌 재사용, 경로별 활성화·분할 해제, GPU 자원 할당·메모리, 실제 1440p TSR 검증. 일상 비유, 용어 풀이, 흐름도와 전후 표를 포함합니다.
- `lib/optimization/types.ts`: 문단, 코드, 주석, 표, 순서도와 출처의 형식.
- 새 글을 해당 배열에 추가하면 목차, 개별 정적 주소, 메타데이터, 이전·다음 링크가 함께 생성됩니다. 기존 slug와 섹션 id는 공유 주소 보존을 위해 유지합니다.
- 실제 코드 발췌와 의사 코드를 구분합니다. 수치의 측정 날짜·빌드·해상도·표본과 제한을 같이 기록하고, 새 검증 없이 과거 수치를 최신 결과로 바꾸지 않습니다.
- `public/optimization/evidence.json`은 2026.09.08에 읽은 보고서의 공개용 발췌입니다. 원본 경로는 Comet 모듈 상대 경로로 표시하고, 원문 SHA-256을 함께 보관합니다. 원본 전체나 로컬 계정 경로를 공개하지 않습니다.
- `public/optimization/additional-evidence-2026-09-09.json`은 추가 연재의 소스·보고서 해시와 선택한 실행 결과입니다. 이 자료의 경로는 Comet 프로젝트 루트 기준입니다. 실제 910×349 PIE 결과와 2560×1440 비패키지 Native 결과를 구분합니다. 160m/s 실패, 별도 75m/s 성공과 1440p 왕복 목표 미달을 함께 보존합니다. 진행 중인 식생·CPU 수정은 실행 검증 완료로 표시하지 않습니다.
- 글별 `date`를 지정하면 작성일에 표시됩니다. 생략한 기존 글은 2026.09.08을 유지하며, 기존 `updatedDate`는 보완일입니다.

검사 명령은 기존과 같이 `npm run build:pages`, `npm run check:pages`입니다. 새 검사는 각 글의 정적 출력, 한국어 본문, 고유한 앵커, 목차·이전/다음 및 파일 링크를 확인합니다.

현재 vinext beta.5는 `trailingSlash: true`일 때 하위 경로의 사전 렌더 요청이 자체 308 리디렉션으로 실패합니다. Pages 빌드는 끝 슬래시 없이 내보낸 HTML/RSC를 보존하고, 빌드 스크립트에서 동일한 HTML을 디렉터리 `index.html`로도 배치해 공개 주소를 유지합니다. 라이브러리 파일은 수정하지 않습니다.

## 게시된 기록과 이미지
2026년 9월 9일 공용 플레이 테스트 개발일지(LOG 007)를 `lib/testing-devlog.ts`에 추가했습니다. 다섯 코스, 실제 입력과 물리 검증, 고속 목표 미달, 기록 수집·분석과 실행 방법을 설명합니다. `public/testing/evidence-2026-09-09.json`은 기존 실행 보고서의 공개용 발췌이며, 이미지 한 장은 왕복 코스 측정 종료 후 촬영본입니다. 블로그 작성 중 Unreal 검사를 새로 실행하지 않았습니다. 개발일지 섹션은 빈 줄로 나눈 문단과 선택적 표·코드 블록, 글별 출처를 지원합니다.

2026년 9월 8일에는 태양계 지도, 달치즈 행성, 태양 제작 글을 각각 추가했습니다. Comet에 저장된 실제 Unreal 렌더 6장을 원본 그대로 사용하며, 지도 실행 검증과 별도 에셋 렌더의 촬영 맥락을 캡션에 구분했습니다.

주간 개발일지, foliage, 3D 미니맵 글에 실제 Comet 프로젝트 촬영본과 검증 렌더를 사용합니다. 게임 화면의 촬영 맥락과 장식용 별빛 배경의 출처는 `ASSETS.md`에 기록합니다. 예시 글 두 개와 컨셉 이미지 두 개는 제거했습니다.

기존 Sites 미리보기는 비공개입니다. GitHub Pages 블로그는 공개 사이트로 배포합니다.

## GitHub Pages 배포
대상 저장소는 `water-beetle/water-beetle.github.io`, 사이트 주소는 `https://water-beetle.github.io/`입니다. GitHub Pages용으로 서버 없이 실행되는 HTML/CSS/JavaScript를 만듭니다.

- 공개 저장소의 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 설정합니다.
- `main` 브랜치에 push하면 `.github/workflows/pages.yml`이 검사, 정적 빌드, 배포를 실행합니다.
- 확인 명령: `npm run build:pages`, `npm run check:pages`.
- 공개되는 파일: `dist/client/`. 생성된 파일을 직접 편집하지 마세요.
- 이 설정은 사용자 블로그의 루트 주소용입니다. 저장소 하위 경로 인자는 받지 않습니다.
- 소스와 사이트가 공개되므로 게시할 수 있는 자료를 사용하세요.
- 기존 Sites 미리보기는 별도로 배포되어 있으며 GitHub Pages 설정만으로 삭제되거나 변경되지 않습니다.
