# R97B Core Shell Correction

```text
stage=1013V_VISUAL_SYSTEM_POLISH_LINE
phase=V0_VISUAL_AUDIT
correction=V0_R97B_CORE_SHELL_CORRECTION
```

## Correction

The original V0 screenshot set incorrectly treated `frontend/home.html` as the global/core shell. That page is an early 师维 homepage / lobby surface. It is useful for brand history and navigation reference, but it is not the current prep-room rendering substrate.

The current controlled core shell for the 1013R prep-room visual line is:

```text
outputs/PREP_ROOM_RENDER_CANVAS_DEEPEN_V1/1013R_R97B_TEACHER_SHELL_EXPERIENCE_POLISH_AND_STALE_CONTENT_CLEANUP/r97b_clean_shell_context_preview.html
```

## Evidence Captured

New screenshot:

```text
r97b_correction/screenshots/r97b_core_shell_current.png
```

New DOM manifest:

```text
r97b_correction/r97b_core_shell_screenshot_manifest.json
```

The manifest verifies:

```text
current_shell=R97B
r220b_shell_binding=true
has_ownership_map=true
has_resolve_shell_layer=true
has_resolve_render_slot=true
shell_layers_found=app-shell, workspace-shell, render-surface, lesson-content-renderer, right-rail, bottom-xiaojiao
render_slots_found=app-topbar, render-stage, active-render-layer, left-unit-tree, lesson-body, teaching-process, right-rail, bottom-xiaojiao
```

## Correct V0 Baseline

For visual-system work, the R97B shell should be treated as the current four-layer shell / render substrate:

```text
Layer 0: App Shell
Layer 1: Prep Room Workspace Shell
Layer 2: Render Surface / Canvas
Layer 3: Lesson Content Renderer
```

The early `home.html` screenshot should be moved to:

```text
historical_homepage_reference
```

It should not drive V1 visual-system decisions.

## Boundary

This correction only adds audit material.

```text
frontend_modified=false
backend_modified=false
provider_called=false
database_written=false
feishu_written=false
formal_apply_performed=false
```
