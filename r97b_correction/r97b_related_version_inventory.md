# R97B Related Version Inventory

## Current / Active

| version | role | current status |
| --- | --- | --- |
| R97B | current controlled prep-room work shell | Active visual-system baseline. |
| R108 | R97B import modal wired to backend uploaded lesson preview route | Canonical handoff / route evidence. |
| R220A | render substrate and shell-layer audit | Defines layer map and R97B as target. |
| R220B | R97B shell-layer slot ownership binding | Adds readonly markers/resolvers to R97B. |
| R220D | R97B render slot DOM smoke | Verifies slot isolation and wrong-shell guard. |
| R220E-P1 | center-body readability smoke | Useful content-rendering reference, not the full shell. |
| R221G | precise prep workbench static prototype | Useful decision-card/slot reference, but still a static prototype overlay. |

## Historical / Reference Only

| version | role | do not treat as |
| --- | --- | --- |
| `frontend/home.html` | early 师维 homepage / lobby | current core render substrate |
| R36 | historical static patch consolidation | current active shell |
| 1013L M1 | canonical shell milestone / app shell baseline | current prep-room work shell |
| R100-P1 | uploaded lesson clean-shell preview | current shell target |
| R91A / R39 | shell lineage/source candidates | direct current implementation target without checking R97B |

## Correct Capture Priority For Visual V0

1. Capture R97B current shell.
2. Capture R97B DOM layer/slot marker evidence after R220B.
3. Keep R220A/B/D docs as source anchors.
4. Use R220E-P1 only for center-body readability reference.
5. Use R221G only as a decision-card / field-slot visual reference.
6. Move `home.html` to historical homepage reference.

## Do Not Repeat

```text
do_not_promote_home_html_as_core_shell=true
do_not_promote_R100_P1_as_current_shell=true
do_not_treat_R221G_as_formal_shell_replacement=true
do_not_skip_R220A_R220B_R220D_when_starting_visual_line=true
```
