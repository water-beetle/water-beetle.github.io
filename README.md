# ORBITAL FALL · Play Journal

실제 게임 화면을 따라 집에서 첫 제작대·채굴 드론까지 진행하고, 각 장면에서 개발 기록을 여는 정적 웹사이트입니다. 공개 주소는 https://water-beetle.github.io/이며 기존 GitHub Pages 워크플로를 사용합니다.

## 실행과 검사

```powershell
npm ci
npm run dev
npx tsc --noEmit
npm run test:analytics
npm run test:devlog
npm run test:story
npm run build:pages
npm run check:pages
npm run preview:pages
```

`preview:pages`는 빌드한 `dist/client`를 http://127.0.0.1:4173 에서 제공합니다. 공개 게시 전 실제 브라우저의375·768·1440px 화면과 조작을 확인합니다. `main` push는 기존 Pages 워크플로를 실행합니다.

## 사이트 구성

- 데스크톱: 실제 촬영본을 크게 유지하고 기본 브라우저 스크롤로6개 챕터를 따라갑니다. 장면 안 주석과 필름 스트립으로 실제 과정의 다른 화면을 펼칩니다. 채굴·건설을 실행하는 웹 미니게임은 없습니다.
- 모바일: 자연스러운 세로 흐름으로 장면을 읽고 과정 사진을 선택합니다. 사진 비율·HUD를 유지하고 원본 확대를 제공합니다.
- 개발 기록실: 날짜별 타임라인과 선택 장면 미리보기, 주제 필터와 날짜 정렬.
- 기록을 열고 닫을 때 보던 장면·선택 사진·스크롤과 목록 필터를 복원합니다. 직접 링크는 독립적으로 읽을 수 있습니다.
- JavaScript가 없어도 각 챕터의 모든 과정 사진·설명과 글을 읽을 수 있습니다. 모션 감소 설정을 존중하고, 이미지 로드 실패에는 재시도·원본 링크를 제공합니다.
- 기존8개 기능 URL·giscus·통계의 DNT/GPC·로컬 미수집 정책을 유지합니다.

GitHub Pages는 RSC 탐색 요청에 HTML을 반환하므로 내부 이동은 기본 문서 링크와 세션 상태 복원으로 처리합니다. 지원 브라우저에서는 동일 출처 문서 전환(View Transitions)으로 연결하고, 미지원 환경에서는 기본 탐색을 사용합니다. 새로고침·직접 링크·뒤로가기는 서버 API 없이 동작합니다.

Three.js 장식용 첫 화면을 실제 게임 사진의 연속된 장면으로 교체했습니다. Motion은 장면 전환, Astryx는 버튼·필터·이미지 확대에 사용하며 별도의 서버·계정·유료 API는 없습니다.

## 실제 기록에서 글 만들기

```powershell
npm run devlog:draft -- --source G:/UnrealProjects/Comet/outputs/선택한-검증폴더 --slug new-field-note --title "새로운 개발 기록"
```

Git에서 제외한 `drafts/<slug>/article.json`과 `REVIEW.md`를 만듭니다. 원본 경로와 발췌는 이 폴더에만 보관하며 공개 색인·페이지에 추가하지 않습니다.

글을 플레이어 관점으로 다듬고 현재 구현·과거 촬영·후속 계획을 구분합니다. `candidates`에서 사용할 이미지를 골라 `assets`에 `{ "source": "원본 절대 경로", "id": "고유-image-id", "alt": "설명", "caption": "촬영 날짜와 맥락" }`를 추가합니다. `cover`·본문의 `media`·비교의 `before`/`after`는 이미지 id입니다. 기존 `lib/journal-media.json`의 키를 재사용할 수 있습니다.

선택 항목 `chapterId`는 `home`, `meteor`, `mining`, `bench`, `research`, `drone` 중 하나입니다. 직접 방문한 기록을 닫을 때 관련 플레이 장면으로 돌아갑니다. 미지정 글은 자신의 표지 사진을 사용하고 기본 플레이 장면으로 복귀합니다.

검토 후 `reviewed: true`로 바꾸고 실행합니다.

```powershell
npm run devlog:publish -- --slug new-field-note --reviewed
```

검토한 글의 공개 필드만 `content/published`에 옮기고 선택한 이미지만 WebP·썸네일로 변환합니다. 원본 경로·`sourceFacts`·후보 목록은 공개 데이터에서 제외합니다. 기존 글 수정은 `--replace`를 추가합니다. 이 명령은 Git push·배포를 실행하지 않습니다.

장면과 과정은 `lib/story.ts`, 실제 사진은 `lib/journal-media.json`, 기존 기능 자료는 `lib/features.ts`에서 관리합니다. 촬영 출처·원본 SHA256과 변환 규칙은 `ASSETS.md`를 따릅니다. 원본 게임 촬영본은 Comet 프로젝트에 보존합니다.
