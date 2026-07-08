from __future__ import annotations

import argparse
import json
from pathlib import Path


STAGE = "1013V_VISUAL_SYSTEM_POLISH_LINE"
PHASE = "V0_VISUAL_AUDIT"


REQUIRED_FILES = [
    "README.md",
    "visual_surface_inventory.md",
    "current_visual_problem_notes.md",
    "screenshot_manifest.json",
    "visual_smoke_result.json",
    "tools/capture_1013V_visual_audit.cjs",
    "r97b_correction/README_R97B_CORE_SHELL_CORRECTION.md",
    "r97b_correction/r97b_render_substrate_evidence.md",
    "r97b_correction/r97b_related_version_inventory.md",
    "r97b_correction/r97b_core_shell_screenshot_manifest.json",
    "r97b_correction/screenshots/r97b_core_shell_current.png",
    "r97b_correction/tools/capture_r97b_core_shell.cjs",
]


def fail(errors: list[str], message: str) -> None:
    errors.append(message)


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def validate(root: Path) -> dict:
    audit_dir = root / "outputs" / STAGE / PHASE
    errors: list[str] = []
    warnings: list[str] = []

    if not audit_dir.exists():
        fail(errors, f"missing audit dir: {audit_dir}")
        return {"ok": False, "errors": errors, "warnings": warnings}

    for rel in REQUIRED_FILES:
        path = audit_dir / rel
        if not path.exists():
            fail(errors, f"missing required file: {rel}")
        elif path.is_file() and path.stat().st_size == 0:
            fail(errors, f"empty required file: {rel}")

    manifest_path = audit_dir / "screenshot_manifest.json"
    smoke_path = audit_dir / "visual_smoke_result.json"
    if manifest_path.exists() and smoke_path.exists():
        manifest = read_json(manifest_path)
        smoke = read_json(smoke_path)
        if manifest.get("stage") != STAGE or manifest.get("phase") != PHASE:
            fail(errors, "screenshot_manifest stage/phase mismatch")
        if smoke.get("stage") != STAGE or smoke.get("phase") != PHASE:
            fail(errors, "visual_smoke_result stage/phase mismatch")
        if smoke.get("visual_smoke_completed") is not True:
            fail(errors, "visual smoke did not complete")
        if smoke.get("case_count") != 18:
            fail(errors, f"expected 18 screenshot cases, got {smoke.get('case_count')}")
        if smoke.get("fail_count") != 0:
            fail(errors, f"expected fail_count 0, got {smoke.get('fail_count')}")

        boundary = manifest.get("boundary") or {}
        expected_false = [
            "frontend_modified",
            "backend_modified",
            "provider_called",
            "database_written",
            "feishu_written",
            "formal_apply_performed",
        ]
        for key in expected_false:
            if boundary.get(key) is not False:
                fail(errors, f"boundary flag must remain false: {key}")
        if boundary.get("visual_audit_only") is not True:
            fail(errors, "visual_audit_only must be true")

        generated = smoke.get("generated_files") or []
        if len(generated) != 18:
            fail(errors, f"expected 18 generated screenshot files, got {len(generated)}")
        for rel in generated:
            shot = audit_dir / rel
            if not shot.exists():
                fail(errors, f"missing screenshot: {rel}")
            elif shot.stat().st_size < 1500:
                fail(errors, f"screenshot too small: {rel}")

        records = manifest.get("records") or []
        if len(records) != 18:
            fail(errors, f"expected 18 manifest records, got {len(records)}")
        for record in records:
            if record.get("pass") is not True:
                fail(errors, f"manifest record did not pass: {record.get('id')}")
            source = record.get("source_path")
            if source and not (root / source).exists():
                fail(errors, f"missing source path for {record.get('id')}: {source}")
            metrics = record.get("dom_metrics") or {}
            if metrics.get("body_text_length", 0) <= 0:
                fail(errors, f"empty body text for {record.get('id')}")

    correction_path = audit_dir / "r97b_correction" / "r97b_core_shell_screenshot_manifest.json"
    if correction_path.exists():
        correction = read_json(correction_path)
        if correction.get("pass") is not True:
            fail(errors, "R97B core shell correction manifest did not pass")
        target_shell = correction.get("target_shell", "")
        if "1013R_R97B_TEACHER_SHELL_EXPERIENCE_POLISH_AND_STALE_CONTENT_CLEANUP" not in target_shell:
            fail(errors, "R97B correction target shell is not the controlled R97B shell path")
        dom = correction.get("dom_metrics") or {}
        if dom.get("current_shell") != "R97B":
            fail(errors, f"R97B correction current_shell mismatch: {dom.get('current_shell')}")
        if dom.get("r220b_shell_binding") != "true":
            fail(errors, "R97B correction missing R220B shell binding marker")
        if dom.get("has_resolve_shell_layer") is not True or dom.get("has_resolve_render_slot") is not True:
            fail(errors, "R97B correction missing shell/render resolver functions")
        for group_name in ("shell_layers", "render_slots"):
            for key, item in (dom.get(group_name) or {}).items():
                if not item.get("found"):
                    fail(errors, f"R97B correction missing {group_name}.{key}")

    result = {
        "stage": STAGE,
        "phase": PHASE,
        "ok": not errors,
        "errors": errors,
        "warnings": warnings,
        "audit_dir": str(audit_dir),
    }
    return result


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".", help="repo root")
    args = parser.parse_args()
    root = Path(args.root).resolve()
    result = validate(root)
    out = root / "outputs" / STAGE / PHASE / "validate_1013V_V0_visual_audit_result.json"
    out.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
