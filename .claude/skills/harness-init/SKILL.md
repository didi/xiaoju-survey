# Skill: Harness 初始化

为当前仓库建立一套 AI-agent-friendly 的工程知识结构，同时服务 Claude Code、Cursor 及其他 coding agents。

## 触发条件

当一个新项目需要建立 harness 结构时，用户调用 `/harness-init`。

## 本 skill 目录结构

```
skills/harness-init/
├── SKILL.md              # 本文件（编排层）
├── step/                  # 详细执行指令
│   ├── step0.md           # 总约束
│   ├── step1a.md          # 盘点
│   ├── step1b.md          # 导航入口 + 产品 + 参考索引
│   ├── step2.md           # workflow.md
│   ├── step3a.md          # commands.md
│   ├── step3b.md          # 工程知识层
│   ├── step4a.md          # 架构层
│   ├── step4b.md          # 质量层
│   ├── step5.md           # 执行态工件模板
│   ├── step6a.md          # Claude 命令
│   ├── step6b.md          # 角色文件
│   ├── step6c.md          # Cursor 规则
│   ├── step7.md           # Claude Skills
│   └── step8.md           # 完整性自检
├── fullstack.md           # 全栈项目目标结构
├── frontend.md            # 纯前端项目目标结构
└── backend.md             # 纯后端项目目标结构
```

所有路径相对于本 SKILL.md 所在目录。

---

## 流程

### 第一步：加载约束

读取 `step/step0.md`，理解并遵守全部约束。这些约束贯穿后续所有阶段。

### 第二步：盘点

执行 `step/step1a.md`。只读不写，输出盘点表。

盘点结果中需确定：

1. **项目类型**（纯前端 / 纯后端 / 全栈），据此选择对应的目标结构模板：
   - 全栈 → 读取 `fullstack.md`
   - 纯前端 → 读取 `frontend.md`
   - 纯后端 → 读取 `backend.md`

2. **工具覆盖范围**：是否同时使用 Cursor？如果是，step6c 纳入执行计划。

**→ 输出盘点表 + 项目类型 + 工具覆盖范围，等待用户确认后继续。**

### 第三步：按 step 顺序执行

确认盘点后，按以下顺序依次执行。每个 step 执行前，先读取对应的 step 文件获取完整指令。

| 顺序 | 读取并执行 | 产出 |
|------|-----------|------|
| 1 | `step/step1b.md` | AGENTS.md / CLAUDE.md / product（overview + domains + key-flows）/ references |
| 2 | `step/step2.md` | workflow.md |
| 3 | `step/step3a.md` | commands.md |
| 4 | `step/step3b.md` | conventions / guidelines / contracts / pitfalls 等 |
| 5 | `step/step4a.md` | boundaries.md / invariants.md |
| 6 | `step/step4b.md` | checklist / known-issues / quality-score |
| 7 | `step/step5.md` | work/ 全套模板 + plans/active/README |
| 8 | `step/step6a.md` | .claude/commands/（review / ship / start / sync） |
| 9 | `step/step6b.md` | harness/roles/ + .claude/agents/ |
| 10 | `step/step6c.md` | .cursor/rules/（盘点阶段确认使用 Cursor 时执行） |
| 11 | `step/step7.md` | .claude/skills/ |
| 12 | `step/step8.md` | 完整性自检 + harness-init-report.md |

### 执行规则

- **每个 step 执行后**，输出产物摘要，等待用户确认再进入下一步
- 如果某步产出过多导致质量下降，主动拆分执行（先生成一半，确认后继续）
- 如果发现与前一步输出冲突，先指出冲突，再给修正方案，不直接覆盖
- step 文件中的指令是完整的执行规范，严格遵守其中的要求、格式和护栏

### 第四步：模板对照

step8 自检中的"模板对照"环节，使用第二步确定的目标结构模板文件（`template/fullstack.md` / `template/frontend.md` / `template/backend.md`），逐一比对每个模板要求的文件是否已生成。

---

## 输出

最终产物由各 step 文件定义，整体应覆盖目标结构模板中列出的所有文件（不适用的需在自检报告中标注原因）。

自检报告写入 `work/runs/harness-init-report.md`。

> 本 skill 是一次性初始化工具，不列入目标结构模板中的 `.claude/skills/` 条目。
> 初始化完成后可保留在仓库中供其他项目参考，也可移除。
