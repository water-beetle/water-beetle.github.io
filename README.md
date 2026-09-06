# Orbital Days DevLog

우주 생활 시뮬레이터 개발일지. 영어 브랜드명, 한국어 본문, 반응형 화면, 이미지 확대 보기, MP4/WebM 재생을 지원합니다.

## 글 쓰기
1. 스크린샷이나 영상 파일을 `public/media/`에 넣습니다.
2. `lib/devlog.ts`의 `devlogs` 배열 맨 앞에 글을 추가합니다. 첫 번째 글이 메인에 표시됩니다.
3. 고유한 `id`, `number`, 제목, 요약, 태그, 본문 섹션을 입력합니다. 실제 글은 `example: false`로 설정하고 `date: '2026.09.06'`처럼 작성일을 넣습니다.
4. 글 주소는 `/#글-id`입니다. 예시 글은 실제 기록이 준비되면 배열에서 제거하거나 수정하세요.
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
- `npm run build`
- `npx tsc --noEmit`

## 예시 이미지
내장 image_gen 도구로 생성한 컨셉 아트이며 실제 게임 화면이 아닙니다.
- `public/images/cabin.jpg`: 따뜻한 조명, 작은 주방, 식물과 생활 공간이 있는 우주선 내부.
- `public/images/station.jpg`: 푸른 행성 앞의 작은 거주 정거장과 탐사선.
- 생성 프롬프트: `ASSETS.md`.

사이트는 최초 게시 시 소유자만 볼 수 있는 비공개 상태입니다.
