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
