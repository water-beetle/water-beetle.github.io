# Media provenance

## Solar-system map, cheese moon, and warm sun posts — 2026-09-08

Six existing Unreal renders were copied byte-for-byte into `public/media/2026-09-08/`. No crop, recoloring, labels, or image generation was applied to these captures for the blog. Originals remain in the Comet project.

| Public file | Source and capture context |
| --- | --- |
| solar-map.png | `G:/UnrealProjects/Comet/outputs/solar-map-restyle/map-3d-1600x900.png`, captured 2026-09-08. Actual map UI rendered during automated runtime validation in the game world. Planets, materials, positions and orbits come from the project; the starfield is a decorative generated image already used by the UI. This is not a hand-played screenshot or an image-generated UI mockup. |
| solar-map-rotated.png | Same directory, `map-3d-rotated.png`. Same runtime validation after rotating the map camera; no blog-side modification. |
| cheese-moon.png | `G:/UnrealProjects/Comet/Source/Comet/outputs/cheese-moon/CheeseMoon_Orbit.png`, captured 2026-09-07. Actual saved cheese-moon voxel preset and material rendered in an isolated Unreal scene with inspection lighting and temporary LOD step 2. |
| cheese-moon-surface.png | Same directory, `CheeseMoon_Surface.png`. Close view of an already generated cavity, not a player-dug hole or evidence of food rewards. |
| warm-sun.png | `G:/UnrealProjects/Comet/Source/Comet/outputs/warm-sun/WarmSun_Orbit.png`, captured 2026-09-07. Actual saved sun assets rendered by `EditorScripts/PreviewWarmSun.py` in an isolated scene at preview time 12 seconds, with fixed manual exposure and bloom. |
| warm-sun-time32.png | Same directory, `WarmSun_Time32.png`. Same camera and exposure, preview time 32 seconds. Two still renders compare material animation states; they are not a recorded gameplay sequence. |

Implementation and verification sources: `solar-map-restyle/final-validation.json`; `cheese-moon/assets.json` and `preview.json`; `warm-sun/assets.json`, `preview.json` and `runtime.json`; `solar-lighting/visual-qa.json`; `solar-lighting-occlusion/final-validation.json`, plus the associated current C++ and editor scripts. These reports were read on 2026-09-08; no new Unreal build, capture, or playtest was run for these posts. Long-duration flight performance and packaging are not established by the screenshots.

## Shared play tests — 2026-09-09

`public/media/2026-09-09/roundtrip-after-course.png` is copied byte-for-byte from Comet project-relative `outputs/comet-tests/shared-suite-01/roundtrip/comet-roundtrip-environment-shared-suite-01-after-course.png`. It is an actual Unreal Editor PIE render captured after the roundtrip CSV measurement ended on 2026-09-09. The requested editor window was 1280×720; the observed play viewport and PNG are 910×349. The frame shows the ship cabin after the course, not continuous visual coverage of the flight or evidence of the high-speed target being met. No generation, cropping, color adjustment, or overlays were applied.

## Weekly DevLog — 2026-09-06

These are captures of the user’s Comet / Orbital Days Unreal Engine project. No game screenshot was generated with image AI. PNG originals are kept locally; public JPEGs preserve the original composition.

| Public file | Source and capture context |
| --- | --- |
| public/media/2026-09-06/cockpit.jpg | Actual PIE cockpit test capture, 2026-09-06. Central lower camera shows a test floor and marker. Resource data is not yet connected. |
| public/media/2026-09-06/eldara.jpg | Fresh Unreal SceneCapture2D render of saved Eldara terrain, 2026-09-06. Isolated asset inspection scene, not gameplay. |
| public/media/2026-09-06/cryon.jpg | Fresh Unreal SceneCapture2D render of saved Cryon terrain, 2026-09-06. Same inspection lighting/camera proportions as Eldara. |

The terrain renders use the saved voxel/noise/material values with a temporary LOD setting for capture. No level or asset was saved. These captures do not demonstrate in-flight performance or LOD transitions.

## Decorative background

## Starfield background
Project path: public/images/starfield.jpg
Generated with the built-in image_gen tool at the user's request for a starry space background.

Prompt: Use case: stylized-concept. Asset type: standalone full-page website background bitmap for a Korean indie space life simulator DevLog. Primary request: A quiet realistic dark navy and teal deep-space starfield photograph-like texture, wide 16:9 landscape, ideally 2048x1152. Scene/backdrop: Star-filled outer space with many restrained tiny white stars, natural irregular distribution and subtle variation in star sizes. Composition/framing: The center is mostly very dark negative space for readable page text; tiny stars remain visible throughout. Barely visible wispy cool-blue interstellar dust rests at the edges. Lighting/mood: Quiet, restrained, low contrast, believable distant starlight. Clearly recognizable as outer space while calm enough behind website content. Constraints: Exactly one standalone background image. No planets, no spacecraft, no typography, no interface, no logos, no watermark, no dramatic colorful nebula, no large bright glow.

## Foliage and minimap posts — 2026-09-06

- `public/media/2026-09-06/foliage-avoria.jpg`: new Unreal capture of Avoria’s actual voxel terrain and 657 PCG instances. The saved `MI_Planet_Avoria` material and `DA_Foliage_Avoria` profile are retained. Captured on 2026-09-07 in Unlit mode with sRGB output to inspect the material colors and placement; no terrain or foliage material was replaced. This is an isolated render of project assets, not a manual gameplay capture. The previous plain-material image has been removed.
- `public/media/2026-09-06/hud-overview.png`: saved UMG HUD rendered by the Unreal validation helper using an actual generated planet and test inputs, from the successful auto-fit validation. It is a HUD preview rather than a direct PIE screenshot. Oxygen and money values are test data.
- `public/media/2026-09-06/minimap-front.png` and `minimap-facing-right.png`: unaltered pixel crops of the corresponding 1600×900 HUD validation frames; crop rectangle x=1200, y=20, width=380, height=440. No labels or markers were added. The second frame turns the view by 90 degrees.
- The original post captures were produced on 2026-09-06; the Avoria replacement was captured on 2026-09-07. No image AI was used for these assets.
# 2026.09.25 개발일지 사진 추가

LOG 008~014는 Comet에 보관된 실제 제작·검증 화면 7장을 사용합니다. `public/media/2026-09-25/`의 JPEG는 원본에서 최대 가로 1600px로 축소·압축했으며 색 보정이나 생성형 편집은 하지 않았습니다. 아래 원본 경로는 Comet 프로젝트 기준입니다.

| 파일 | 원본 | 촬영 맥락 |
| --- | --- | --- |
| home.jpg | outputs/terrain-relief-20260912/bad-orbit-home-play-04/BO_Sofa.png | 집 마감 후 재로드·PIE, 후속 마당 변경 이전 |
| mart.jpg | outputs/p02-mart-20260913/play/01_FridgePickup.png | 플레이 월드 별도 SceneCapture, HUD·몸 제외 |
| radar.jpg | outputs/meteor/visual02/03-radar-passage.png | 초기 운석 연동 모니터, 최신 UI 아님 |
| interceptor.jpg | outputs/backyard-interceptor/coupled-play02/PracticeVisible.png | 실제 PIE를 포함한 에디터 창, 연습 목표 |
| soil.jpg | outputs/soil-realism/studio.png | Blender v02 모델 렌더, 게임 화면 아님 |
| mule.jpg | outputs/ship-orange-20260922/ue_exterior.png | Unreal 검토 장면, 후면 보강 이전 |
| menu.jpg | outputs/orbital-fall-menu-speeds-20260925/validation-final/menu-2560x1440.png | 설치된 메뉴 재생 검증, 별도 촬영 장면의 영상 |

원본 에셋과 내부 보고서는 배포하지 않습니다. 본문은 9월 25일에 기존 기록을 회고한 글이며, 새 Unreal 실행 검증을 수행한 것으로 표시하지 않습니다.
