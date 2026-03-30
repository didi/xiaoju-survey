# work/ — 执行态工件层

> 存放当前活跃需求的全链路工件。任务完成后收敛归档，不做长期知识库。

---

## 子目录职责

| 目录 | 职责 | 交付链路阶段 | 命名约定 |
|------|------|-------------|---------|
| `requests/` | PRD — 需求描述、目标、范围、验收条件 | 需求输入 | `<需求名>.md` |
| `specs/` | 技术方案 — 方案选型、影响范围、接口设计 | 技术方案 | `<需求名>-spec.md` |
| `tasks/` | 任务拆解 — 原子步骤、依赖关系、验收条件 | 任务拆解 | `<需求名>-tasks.md` |
| `evals/` | 自验证 — 检查结果、测试输出、验证截图 | 自验证 | `<需求名>-eval.md` |
| `runs/` | 运行日志 — 构建输出、CI 日志、调试记录 | 实现过程（可选） | `<需求名>-run-<序号>.md` |

**完整交付链路：** `requests/` → `specs/` → `tasks/` → 代码实现 → `evals/` → 知识回灌 → 计划归档

---

## 默认工作方式

- 每次只处理当前任务的工件，不在 `work/` 中堆积历史
- 每个文件对应一个需求，用需求名做文件名前缀保持关联
- 模板文件（`*_TEMPLATE.md`）是空白模板，不要直接编辑模板，复制后改名使用

---

## 任务完成后如何收敛

```
1. 检查 work/evals/ 中的验证是否通过
2. 蒸馏有价值的知识回 harness/docs/（见下节）
3. 将 harness/plans/active/ 中的计划移到 harness/plans/recent/
4. work/ 中的工件可以保留一段时间供回溯，但不进入默认上下文
5. 纯过程记录（runs/）可在归档后清理
```

---

## 什么该进 harness/，什么不该长期保留

| 内容类型 | 去向 | 示例 |
|---------|------|------|
| 发现的架构不变量 | `harness/docs/architecture/invariants.md` | "新增 Entity 必须在 AppModule 注册" |
| 踩坑经验 | `harness/docs/engineering/pitfalls.md` | "meta.js 和后端模板必须同步改" |
| 已知遗留问题 | `harness/docs/quality/known-issues.md` | "web 端无自动化测试" |
| 命令变更 | `harness/docs/engineering/commands.md` | 新增了检查脚本 |
| PRD 原文 | **不进 harness** — 留在 work/requests/ | 需求描述是短期工件 |
| 技术方案原文 | **不进 harness** — 留在 work/specs/ | 方案细节是短期工件 |
| 测试日志 | **不进 harness** — 留在 work/evals/ 或清理 | 过程记录无长期价值 |
| 运行日志 | **不进 harness** — 留在 work/runs/ 或清理 | 纯调试产出 |

---

## `harness/plans/active/` 与 `work/tasks/` 的区别

这两者是**父子关系**，不是重复：

| | `harness/plans/active/task-*.md` | `work/tasks/<需求名>-tasks.md` |
|---|---|---|
| **定位** | 作战地图（Strategic Map） | 可执行清单（Tactical Checklist） |
| **内容** | 背景、目标、关键决策、状态跟踪、风险项、跨 session 接力点 | 原子步骤列表、每步依赖、验收条件、完成状态 |
| **粒度** | 一个需求/计划一个文件 | 一个需求的全部子任务在一个文件 |
| **谁写** | 需求分析阶段写，过程中持续更新状态和决策 | 技术方案确认后写，实现过程中逐个勾选 |
| **生命周期** | 活跃 → 移到 recent/ → 归档 | 活跃 → 任务完成后保留在 work/ |
| **跨 session** | 是 — agent 每次进入项目时从 active/ 恢复上下文 | 否 — 只在执行阶段使用 |

**默认工作方式：**
1. 收到需求 → 在 `harness/plans/active/` 创建计划文件（作战地图）
2. 计划中指定 → `work/requests/`、`work/specs/`、`work/tasks/` 的对应工件路径
3. 执行时 → 按 `work/tasks/` 中的步骤逐个推进
4. 每个 session 开始 → 从 `harness/plans/active/README.md` 恢复上下文，读取当前计划状态
5. 完成后 → 计划移到 `recent/`，work 工件保留供回溯
