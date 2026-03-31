请基于当前仓库真实情况，生成文件：

`harness/workflow.md`

要求：
- 这是项目级 workflow，不是工具说明
- 只写当前仓库真实存在或明确适合新增的流程
- 不确定信息标记 `TODO: needs input`

必须包含这些部分：

1. Principles
用 3~6 条简短原则写清楚：
- 这个项目对 agent 最重要的工作方式是什么
- 改动时优先遵守什么
- 什么情况下不能直接推进

2. Reading Route
按场景给出路由：
- 理解项目
- 理解当前需求
- 写代码前
- 排查 bug 前（先看 pitfalls.md + known-issues.md，避免重复踩已知坑）
- 做架构判断前
- 做验证前
- 做收尾归档前

3. Delivery Flow
明确"需求 → 技术方案 → 任务拆解 → 实现 → 自验证 → 知识回灌"的标准路径
并指出动态工件应放在：
- `work/requests/`
- `work/specs/`
- `work/tasks/`
- `work/evals/`
- `work/runs/`

4. Required Checks Before Completion
列出完成任务前必须执行的检查，分为三层：

**第一层：静态检查（必须全通过）**
- lint / type-check / unit test / build
- 优先引用现有命令
- 没有统一入口时，给出一行可直接执行的组合命令（如 `(cd server && npm run lint && npm run test) && (cd web && npm run lint && npm run build)`），不建议创建新的脚本文件

**第二层：不变量检查（涉及对应区域时）**
- 引用 invariants.md 中的 suggested check

**第三层：核心链路验证（涉及核心域时）**
- 引用 `harness/docs/product/key-flows.md` 中定义的核心端到端路径
- 判断本次变更涉及哪些核心路径，对涉及的路径执行最小验证
- 验证方式由 key-flows.md 中定义（API 冒烟 / 手动走查 / E2E 脚本）
- 如果项目尚无自动化 E2E，写清手动验证步骤，标记"需手动确认"

5. Knowledge Distillation
明确任务结束后，哪些内容应蒸馏回：
- `harness/docs/architecture/invariants.md`
- `harness/docs/engineering/pitfalls.md`
- `harness/docs/quality/known-issues.md`
- 其他合适文件

6. Plan Lifecycle
明确：
- 活跃计划放 `harness/plans/active/`
- 近期完成放 `harness/plans/recent/`
- 完成计划不进入默认上下文
- 纯历史通过 `archive-index.md` 指向外部系统

请直接输出完整文件内容。
