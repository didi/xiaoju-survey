请继续为当前仓库生成两个文件：

1. `harness/docs/architecture/boundaries.md`
2. `harness/docs/architecture/invariants.md`

要求：
- 必须基于真实代码结构、现有脚本、现有文档、目录分层、依赖关系来写
- 不要写抽象空话
- 不确定的内容标记 `TODO: needs input`
- 优先找那些会引发高返工、高风险、系统性错误的边界与不变量

`boundaries.md` 需要包含：
- 主要模块 / 目录职责
- 依赖方向（画出模块依赖图）
- 哪些区域适合读写
- 哪些区域不应被 agent 随意修改
- 数据流边界（核心数据如何在模块间流转）
- 外部接口 / 平台 / 服务边界
- 如是 monorepo，写清 package / app / shared 之间的关系

`invariants.md` 每条统一格式：
- ID（编号格式为 `INV-01`、`INV-02`……，角色文件和 checklist 中通过编号引用）
- Name
- Rule
- Why
- Scope / Example
- Mechanically checkable? (Yes / No / Partial)
- Suggested check（可执行的命令或 grep 语句，不创建新脚本文件）
- Trigger timing: pre-commit / CI / harness-sync

至少给出 5~12 条候选 invariant。
不要为了凑数写"普通代码风格规则"。
