# 1013V_VISUAL_SYSTEM_POLISH_LINE / V0_VISUAL_AUDIT

```text
stage=1013V_VISUAL_SYSTEM_POLISH_LINE
phase=V0_VISUAL_AUDIT
scope=visual_audit_only
current_product=师维智教
current_agent_name=小教
```

## Boundary

V0 仅为现状视觉审计，不是视觉改造。

```text
frontend_modified=false
backend_modified=false
provider_called=false
database_written=false
feishu_written=false
formal_apply_performed=false
business_contract_modified=false
R21_R36_core_contract_modified=false
```

本包只新增 `outputs/1013V_VISUAL_SYSTEM_POLISH_LINE/V0_VISUAL_AUDIT/` 下的审计材料、截图 smoke 和 review ZIP。

## What Was Captured

本轮用本地静态服务和 Edge headless 截取 18 个现状页面/状态：

- 全局壳层：`frontend/home.html` desktop / mobile
- 小教工作面：`frontend/xiaojiao-preview.html` 今日重点、课时草稿、教师确认门、材料夹
- 备课室/精修工作台：`frontend/xiaobei_workbench.html`
- 快速备课与草稿审核：`frontend/xiaobei_quick_prep.html`、`frontend/xiaobei_quick_drafts.html`
- 教师确认门：`frontend/assignment_dimension_manage.html`
- 作品馆 / 评阅室：`frontend/xiaoping_review.html`、`frontend/semester_review_room.html`
- 教学入口 / 课堂链路候选：`frontend/teacher_teach.html`
- 最近备课室输出原型：R221G 静态精设备课原型、R220E-P1 教案正文可读性样本

Smoke result:

```text
visual_smoke_completed=true
case_count=18
pass_count=18
fail_count=0
```

结果文件：

- `screenshot_manifest.json`
- `visual_smoke_result.json`
- `screenshots/`
- `visual_surface_inventory.md`
- `current_visual_problem_notes.md`
- `validator/validate_1013V_V0_visual_audit.py`
- `validate_1013V_V0_visual_audit_result.json`

## Current Judgment

项目已经有可用的视觉方向，但还没有统一视觉系统。

最接近未来主线的是 R221G/R220E 这组：R221G 把四级框架、决策卡、字段槽、来源边界放进同一壳层；R220E-P1 的教案正文最像教师可读文本。但 R221G 仍有明显工程语言和字段噪声，R220E 还只是正文 harness，不是完整 route。

`home.html` 和 `semester_review_room.html` 有统一的师维壳层气质，但静态审计下评阅室/作品相关页面暴露出 API 失败态，说明 V1 前需要先补可审 fixture 或静态降级态。

## Recommended Next Step

V1 不应先大面积美化页面。建议先定视觉底座和组件语义：

```text
Shell / RoomFrame / ToolRail / ContentDocument / FieldEditBlock
TeacherConfirmGate / EvidenceBar / SourceAnchorChip / XiaojiaoComposer
QualityStatusBadge / StudentWorkCard / ProcessStepCard
```

第一批改造应优先围绕备课室正文、字段降权、教师确认门和小教输入栏，避免把 Figma 或页面改造变成新的主战场。
