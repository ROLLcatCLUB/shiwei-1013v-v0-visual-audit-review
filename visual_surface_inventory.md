# Visual Surface Inventory

```text
stage=1013V_VISUAL_SYSTEM_POLISH_LINE
phase=V0_VISUAL_AUDIT
inventory_type=current_visual_surface_inventory
```

## Source Contracts Used As Audit Lens

- `docs/1013R_product_frame_four_level.md` defines: level 1 global shell, level 2 room workspace, level 3 tool frame, level 4 content frame.
- `docs/1013R_R13_xiaojiao_task_state_contract.md` defines 小教 in 备课室 as task state / render surface map, not a generic chatbot.
- `docs/1013R_R14_teacher_action_gate_contract.md` defines preview-before-confirm and no formal apply.

## Captured Surfaces

| id | surface | source | screenshot | V0 reading |
| --- | --- | --- | --- | --- |
| 01 | 历史首页 / 师维大厅 desktop | `frontend/home.html` | `screenshots/01_home_global_shell_desktop.png` | 更正：这是早期首页/大厅参考，不是当前核心渲染底座。 |
| 02 | 历史首页 / 师维大厅 mobile | `frontend/home.html` | `screenshots/02_home_global_shell_mobile.png` | 更正：可作为移动首页参考，但不能代表 R97B 四层壳。 |
| 03 | 小教新工作面 / 今日重点 | `frontend/xiaojiao-preview.html` | `screenshots/03_xiaojiao_preview_home.png` | 轻量、聚焦、像教师工作流；但全局壳层弱，页面像独立试稿。 |
| 04 | 小教新工作面 / 课时草稿 | `frontend/xiaojiao-preview.html` | `screenshots/04_xiaojiao_lesson_draft_focus.png` | 教案结构和小教建议容易理解，底部输入清楚；右侧记录卡和材料夹相对孤立。 |
| 05 | 小教新工作面 / 教师确认门 | `frontend/xiaojiao-preview.html` | `screenshots/05_xiaojiao_teacher_confirm_gate.png` | 确认动作清楚，不压迫；但影响范围、来源标签、确认后写效应需要更稳定的组件位置。 |
| 06 | 小教新工作面 / 材料夹 | `frontend/xiaojiao-preview.html` | `screenshots/06_xiaojiao_material_folder.png` | 材料候选状态可见；证据反思存在，但不够像完整证据链。 |
| 07 | 备课室 / 当前任务 | `frontend/xiaobei_workbench.html` | `screenshots/07_xiaobei_workbench_pick.png` | 四级壳层最完整，左侧小教和顶部工具清楚；左侧聊天密度过高，压主内容。 |
| 08 | 备课室 / 草稿字段 | `frontend/xiaobei_workbench.html` | `screenshots/08_xiaobei_workbench_draft_fields.png` | 字段、来源、等待确认都可见；工程语义较多，教师正文不够突出。 |
| 09 | 备课室 / 维度编辑 | `frontend/xiaobei_workbench.html` | `screenshots/09_xiaobei_workbench_dimension_edit.png` | 字段槽和确认状态表达明确；字段标签、编号、技术边界信息过重。 |
| 10 | 快速备课 | `frontend/xiaobei_quick_prep.html` | `screenshots/10_xiaobei_quick_prep.png` | 最小入口跑通，老师能看到三步；整体像蓝色表单后台，不像师维主工作台。 |
| 11 | 草稿内部审核页 | `frontend/xiaobei_quick_drafts.html` | `screenshots/11_quick_drafts_internal_review.png` | 审核边界说明清楚；静态审计下只有失败态，缺少可视化 fixture。 |
| 12 | 评价维度确认门 | `frontend/assignment_dimension_manage.html` | `screenshots/12_assignment_dimension_confirm_gate.png` | 确认规则完整；视觉更像传统管理后台，字段密度高。 |
| 13 | 作品馆 / 作品小评 | `frontend/xiaoping_review.html` | `screenshots/13_xiaoping_review_gallery.png` | 静态审计落到学生登录/接口失败态，无法判断真实作品卡视觉。 |
| 14 | 评阅室 / 总览 | `frontend/semester_review_room.html` | `screenshots/14_semester_review_room_overview.png` | 壳层统一，但内容区 API parse error；V1 前必须有 fixture 降级。 |
| 15 | 评阅室 / 课堂证据 | `frontend/semester_review_room.html` | `screenshots/15_semester_review_room_evidence.png` | 和 14 一样被 API 错误阻断，不能作为视觉验收页面。 |
| 16 | 教学系统入口 | `frontend/teacher_teach.html` | `screenshots/16_teacher_teach_entry.png` | 是课堂链路入口，不是课堂大屏；可作为入口页审计，不应当替代 teacher display。 |
| 17 | R221G 精设备课静态原型 | `outputs/PREP_ROOM_RENDER_CANVAS_DEEPEN_V1/.../r221g_r97b_precise_prep_workbench_static_prototype.html` | `screenshots/17_r221g_precise_prep_static_prototype.png` | 四级框架和决策卡最接近未来方向；但 `static only`、`affected_fields` 等工程词应降权或藏到审核层。 |
| 18 | R220E-P1 教案正文样本 | `outputs/PREP_ROOM_RENDER_CANVAS_DEEPEN_V1/.../visual_harness/real_downpour_docx.html` | `screenshots/18_r220e_lesson_body_readability_sample.png` | 最像正式教师文本，适合作为 LessonPreviewCard / ContentDocument 的视觉靶子。 |

## Correct Core Shell Capture

| surface | source | screenshot | evidence |
| --- | --- | --- | --- |
| R97B 四层壳 / 当前核心渲染底座 | `outputs/PREP_ROOM_RENDER_CANVAS_DEEPEN_V1/1013R_R97B_TEACHER_SHELL_EXPERIENCE_POLISH_AND_STALE_CONTENT_CLEANUP/r97b_clean_shell_context_preview.html` | `r97b_correction/screenshots/r97b_core_shell_current.png` | `r97b_correction/r97b_core_shell_screenshot_manifest.json` confirms `current_shell=R97B`, R220B binding, shell-layer resolvers and render-slot resolvers. |

R97B should now be treated as the visual V0 baseline. The `home.html` screenshots remain historical reference only.

## Current vs Reference Surfaces

Current frontend surfaces:

```text
frontend/home.html
frontend/xiaojiao-preview.html
frontend/xiaobei_workbench.html
frontend/xiaobei_quick_prep.html
frontend/xiaobei_quick_drafts.html
frontend/assignment_dimension_manage.html
frontend/xiaoping_review.html
frontend/semester_review_room.html
frontend/teacher_teach.html
```

Recent reference surfaces:

```text
R97B controlled prep-room shell
R220A render substrate and shell-layer audit
R220B R97B shell-layer slot ownership binding
R220D R97B render slot DOM smoke
R221G precise prep static prototype
R220E-P1 lesson body readability smoke
```

Do not treat `frontend/home.html`, R100-P1, or R221G as the core shell replacement. R97B is the current shell target; R221G/R220E are visual/component references.
