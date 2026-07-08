# Current Visual Problem Notes

```text
stage=1013V_VISUAL_SYSTEM_POLISH_LINE
phase=V0_VISUAL_AUDIT
notes_type=current_visual_problem_notes
```

## Top Findings

0. Correction: the core visual baseline is R97B, not the early home page.

The screenshot `screenshots/01_home_global_shell_desktop.png` is an early 师维 homepage / lobby. It should not be used as the current visual-system shell. The current baseline is `r97b_correction/screenshots/r97b_core_shell_current.png`, backed by R220A render substrate audit, R220B shell-layer slot ownership binding, and R220D DOM smoke.

1. The system currently has three visual languages.

R97B / R221G / `semester_review_room.html` use the green 师维 shell language; `xiaojiao-preview.html` uses warm orange focused workflow; quick prep, draft review, dimension confirm and older review pages use blue admin SaaS styling. This makes the product feel like stitched surfaces rather than one teacher workbench.

2. The four-level framework is present, but not consistently expressed.

R221G and `xiaobei_workbench.html` are closest to level 1 shell + level 2 room + level 3 tools + level 4 content. `xiaojiao-preview.html` has a good focused task flow but reads as an independent screen. `home.html` has a strong level 1 shell but lacks the persistent bottom 小教 entry on desktop.

3. Field weight is still too high.

Quick prep and dimension confirm pages expose fields as form blocks. R221G exposes affected fields and template slots very clearly, but the terms are still engineering-facing. V1 should keep fields available while moving them behind quieter labels, chips, or expandable source/evidence zones.

4. Lesson body readability has a strong reference.

R220E-P1 is the best current sample for "教案正文像正式教师文本". It has section hierarchy, quiet confirmation chips and readable density. Its limitation is that it is a harness, not a full route.

5. 小教 can be helpful, but the left rail can overpower.

`xiaobei_workbench.html` makes 小教 persistent and operational, but repeated bubbles and dark rail take too much attention away from the teacher's current content. `xiaojiao-preview.html` is calmer, but loses the full workbench shell.

6. Teacher confirmation gates are understandable but split.

`xiaojiao-preview.html` has a clean teacher confirmation moment. `assignment_dimension_manage.html` has the complete rule language but looks like an admin form. R221G has the best impact/source/field context but is too technical.

7. Review room and work gallery need reviewable fixture states.

`semester_review_room.html`, `xiaoping_review.html` and `xiaobei_quick_drafts.html` show JSON/API failure or login-like empty states in static smoke. Before visual polish, they need stable fixture data or graceful static fallback, otherwise screenshots cannot represent the actual teacher review surface.

8. Mobile needs safe-area treatment.

`home.html` mobile is readable, but the bottom nav floats over the main task card. V1 should define mobile bottom navigation/composer spacing before expanding to classroom display or student-side pages.

## Priority For V1

P0 visual foundation:

```text
color tokens
type hierarchy
spacing density
card / panel levels
status colors
teacher-confirm states
source/evidence chips
field downweighting rules
```

P0 component contracts:

```text
Shell
RoomFrame
ToolRail
ContentDocument
LessonPreviewCard
FieldEditBlock
TeacherConfirmGate
EvidenceBar
SourceAnchorChip
XiaojiaoComposer
QualityStatusBadge
StudentWorkCard
ProcessStepCard
```

P1 first implementation target:

```text
R97B 备课室四层壳
备课室正文阅读面
字段降权
教师确认门
小教输入栏 / 状态条
```

P2 later:

```text
评阅室 fixture polish
作品馆学生作品卡
课堂大屏
移动端 / 平板横屏
```

## Do Not Do In V1

```text
do_not_connect_provider=true
do_not_write_database=true
do_not_connect_feishu=true
do_not_formal_apply=true
do_not_delete_fields=true
do_not_rebuild_business_contracts=true
do_not_replace_current_system_with_figma=true
```
