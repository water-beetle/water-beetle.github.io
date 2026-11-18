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

- 첫 화면은 실제 P01 촬영 장면입니다. 집·운석·제작대를 눌러 가까운 장소로 이동합니다. 메인에는 게시글 목록이나 썸네일 띠가 없습니다.
- 현관에서 곡괭이, 운석에서 채굴과 원료, 제작대에서 건설·조립 과정을 살펴봅니다. 게임 화면은 실제 촬영본이며 방문자의 조작은 장면 탐색입니다.
- 집 컴퓨터에서 연구와 개발 기록을 엽니다. 기록실에서는 한 편씩 넘기거나 날짜를 골라 읽고, 주제 찾기에서 기존 기능 기록을 엽니다.
- PC·모바일은 같은 장소를 탐색합니다. 주요 장소는 별도 세로 촬영본을 제공하며, 실제 사진의 cover 변환을 계산해 대상 표식을 배치합니다. 과정 UI는 원본 전체를 contain으로 표시합니다.
- 주소의 scene·shot 해시와 브라우저 뒤로 가기, 기존 step 해시를 지원합니다. 글의 주소·giscus·통계는 유지하며 보던 장소와 기록의 출발점을 세션에 보존합니다.
- JavaScript가 없어도 모든 과정 사진과 기록 링크를 읽을 수 있습니다. 움직임 감소·키보드 탐색·사진 재시도·원본 확대를 지원합니다.

GitHub Pages는 RSC 탐색 요청에 HTML을 반환하므로 글 이동은 기본 문서 링크와 세션 상태 복원으로 처리합니다. 장소 이동은 같은 문서의 History API를 사용합니다. 기존 Motion은 장면 전환, Astryx는 사진 확대와 읽기 화면 컴포넌트에 사용합니다. 별도 서버나 3D 런타임은 없습니다.

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

장소와 탐색 대상은 `lib/world.ts`, 주소 해석은 `lib/world-navigation.mjs`, 기존 챕터 연결은 `lib/story.ts`, 실제 사진은 `lib/journal-media.json`, 기존 기능 자료는 `lib/features.ts`에서 관리합니다. 촬영 출처·원본 SHA256과 변환 규칙은 `ASSETS.md`를 따릅니다. 원본 게임 촬영본은 Comet 프로젝트에 보존합니다.
