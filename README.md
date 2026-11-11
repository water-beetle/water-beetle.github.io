# ORBITAL FALL 개발 기록

실제 게임 구현을 8개 주제와 48장의 촬영본으로 소개하는 GitHub Pages 사이트입니다.

## 수정과 실행

- 기능 설명과 이미지 목록은 `lib/features.ts`에서 관리합니다.
- 이미지는 `public/media/features/`에 전체 보기와 썸네일 WebP를 함께 둡니다.
- `npm install` 후 `npm run dev`로 로컬 미리보기를 실행합니다.
- `npx tsc --noEmit`, `npm run test:analytics`, `npm run build:pages`, `npm run check:pages`로 확인합니다.
- Astryx 0.7.13의 Theme, Badge, Button, Dialog를 사용하며, 공식 API는 `npx @astryxdesign/cli component 이름`으로 확인할 수 있습니다.

## 게시

저장소는 `water-beetle/water-beetle.github.io`, 공개 주소는 https://water-beetle.github.io/ 입니다. `main` push 후 기존 GitHub Actions가 타입·통계 검사와 정적 빌드를 거쳐 배포합니다. 출력은 `dist/client/`이며 직접 편집하지 않습니다. 기존 Sites 미리보기는 이번 개편의 배포 대상이 아닙니다.

기존 공개 기획 아틀라스와 로컬 개발일지·최적화 글의 공개 라우트는 구현 소개로 교체했습니다. 기존 Git 이력과 미커밋 최적화 원문은 보존했으며, 과거 원문 데이터 모듈은 새 페이지에서 가져오지 않습니다. 이전 주소는 404 화면에서 새 메인으로 안내합니다.

## 내용과 이미지 기준

현재 적용본과 이전 검증 장면을 캡션으로 구분합니다. 연구 카탈로그의 표시·실행 지원은 모든 장비 효과의 완성을 뜻하지 않습니다. 기존 MULE 기반 구현은 보존되지만 2026-11-05부터 현재 새 게임의 초기 우주선 생성은 꺼져 있습니다. 이미지 출처와 촬영 맥락은 `ASSETS.md`를 따릅니다.

## 통계와 댓글

기존 GA4 설정과 개인정보 보호 동작을 유지합니다. DNT/GPC를 존중하며 URL의 쿼리·해시·개인정보를 추가 전송하지 않습니다. 새 상세 페이지의 조회 이벤트 유형은 `feature`입니다. giscus 댓글 키는 `/features/주제/`이며 기존 Discussions는 삭제하지 않습니다. 댓글은 GitHub 계정으로 작성합니다.
