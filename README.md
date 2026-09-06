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

영상은 자동 재생하지 않으며 기본 재생·볼륨·탐색·전체 화면 컨트롤을 사용합니다. 음성이 없는 클립은 captions를 생략할 수 있습니다. 실제 영상은 아직 포함되어 있지 않습니다. 일반 방문자는 읽기와 미디어 재생만 할 수 있으며 별도 웹 편집기나 업로드 관리자는 없습니다.

## 로컬 실행
- `npm install`
- `npm run dev`
- `npm run build:pages`
- `npx tsc --noEmit`

## 게시된 기록과 이미지
2026.08.31–2026.09.06 주간 개발일지에 실제 Comet 프로젝트 촬영본을 사용합니다. 게임 화면의 촬영 맥락과 장식용 별빛 배경의 출처는 `ASSETS.md`에 기록합니다. 예시 글 두 개와 컨셉 이미지 두 개는 제거했습니다.

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
