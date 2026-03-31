**（可选步骤）** 如果团队同时使用 Cursor，请生成 Cursor 规则文件。

目标目录：`.cursor/rules/`

## 设计原则

Cursor rules 是**薄路由层**：只放导航指引和 Cursor 特有的编辑器规则，不复制 `harness/` 中的知识正文。

## 生成文件

### 1. `.cursor/rules/project.mdc`

项目级规则，包含：
- 一句话项目说明
- 进入项目的阅读路径（指向 AGENTS.md → harness/workflow.md → harness/docs/）
- 语言约定（与 CLAUDE.md 保持一致）
- `@file` 引用关键 harness 文件，不要把内容搬进来

### 2. `.cursor/rules/coding.mdc`

编码规则，包含：
- 指向 `harness/docs/engineering/conventions.md` 和对应的 guidelines 文件
- 指向 `harness/docs/architecture/invariants.md`（提醒 Cursor 在修改高风险区域时参照不变量）
- 指向 `harness/docs/engineering/pitfalls.md`
- Cursor 特有规则（如有），例如：
  - Composer 使用约束
  - 自动补全偏好
  - 文件排除模式

### 3. `.cursor/rules/review.mdc`（可选）

审查规则：
- 指向 `harness/roles/code-reviewer.md`
- 指向 `harness/docs/quality/checklist.md`

## 要求

- 每个 `.mdc` 文件控制在 30 行以内
- 所有实质性规则通过 `@file` 引用 `harness/` 下的文件，不在 rules 中重复
- 如果 `harness/` 中某个文件尚未生成，不要引用它
- 不确定的 Cursor 特有配置标记 `TODO: needs input`
