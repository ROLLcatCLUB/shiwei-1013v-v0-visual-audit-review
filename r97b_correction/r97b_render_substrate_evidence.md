# R97B Render Substrate Evidence

## Primary Shell

| item | evidence | reading |
| --- | --- | --- |
| current controlled shell | `outputs/PREP_ROOM_RENDER_CANVAS_DEEPEN_V1/1013R_R97B_TEACHER_SHELL_EXPERIENCE_POLISH_AND_STALE_CONTENT_CLEANUP/r97b_clean_shell_context_preview.html` | Active target for prep-room shell work. |
| R97B validation | `validate_1013R_R97B_teacher_shell_experience_polish_result.json` | PASS; removes stale teacher-visible mock content; preserves preview-only boundary. |
| screenshot | `r97b_correction/screenshots/r97b_core_shell_current.png` | Captures current four-layer shell and current prep-room work surface. |
| DOM markers | `r97b_correction/r97b_core_shell_screenshot_manifest.json` | Confirms R220B shell binding and render slot resolvers. |

## Contract Chain

| stage | file / package | role |
| --- | --- | --- |
| R108 | `docs/handoff/1013R_R108_prep_room_import_shell_handoff_20260705.md` | Canonical handoff saying R97B is current controlled shell; R100-P1 is legacy. |
| R220A | `1013R_R220A_RENDER_SUBSTRATE_AND_SHELL_LAYER_AUDIT/R220A_RENDER_SUBSTRATE_AND_SHELL_LAYER_AUDIT.md` | Names the render substrate and maps shell layers. |
| R13 map | `1013R_R220A.../source_anchors/prep-room-render-surface-map.md` | Defines render slots such as lesson_body, teaching_process, source_evidence, confirm_actions, bottom_composer. |
| R220B | `1013R_R220B_R97B_SHELL_LAYER_SLOT_OWNERSHIP_BINDING/README_FOR_GPT_REVIEW.md` | Adds readonly shell-layer markers to R97B only. |
| R220B resolver | `1013R_R220B.../r220b_render_slot_resolver_contract.md` | Defines `resolveShellLayer()` and `resolveRenderSlot()`. |
| R220D | `1013R_R220D_R97B_RENDER_SLOT_DOM_SMOKE/r220d_dom_smoke_summary.md` | PASS for parent slots, child slots, payload rebind, right rail isolation, bottom Xiaojiao isolation and wrong-shell guard. |

## Four-Layer Reading

```text
Layer 0: App Shell
  topbar, global identity, global nav, bottom status/composer zone

Layer 1: Prep Room Workspace Shell
  context bar, workspace area, notebook/binder frame, tool strip

Layer 2: Render Surface / Canvas
  prep-render-canvas, canvasStage, renderLayer, active render slots

Layer 3: Lesson Content Renderer
  current lesson body, teaching process, section renderers, right rail update, bottom Xiaojiao context
```

## Visual Implication

V1 should start from this R97B shell. The first design standard should not be based on `frontend/home.html`.

Priority visual questions:

```text
1. How should the four-layer shell read at first glance?
2. How much of the left unit tree should be visible by default?
3. How should the central teacher document become calmer and more readable?
4. How should right rail and bottom Xiaojiao stay present but not dominate?
5. How should R220B engineering markers remain hidden from teacher-facing UI?
```
