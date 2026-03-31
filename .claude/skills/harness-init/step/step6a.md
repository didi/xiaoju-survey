请生成以下 Claude Code commands：

1. `.claude/commands/review.md`
2. `.claude/commands/ship.md`
3. `.claude/commands/start.md`
4. `.claude/commands/sync.md`

要求：
- commands 只做快捷触发，不承担完整需求流编排
- 所有长期规则引用 `harness/` 下的文件，不要重复长期知识正文

---

### review.md
围绕当前 diff 做 correctness / risk / consistency / boundary / tests review：
- risk 检查必须逐条引用 invariants.md，给出"风险信号 → 对应不变量"的映射表
- boundary 检查引用 boundaries.md

### ship.md
围绕完成前统一检查、总结、收尾：
- 执行 workflow.md § Required Checks 中的命令（三层：静态检查 + 不变量检查 + 核心链路验证）
- 蒸馏检查（是否有内容需回灌 harness）
- 工件收尾（tasks 状态、eval 报告、plans 更新）

### start.md
启动一个新需求的交付流程：
- 在 `harness/plans/active/` 创建计划文件（命名格式 `YYYY-MM-DD-<简短描述>.md`）
- 在 `work/requests/` 创建 PRD 文件（基于 REQUEST_TEMPLATE.md）
- 更新 `harness/plans/active/README.md` 的当前默认任务指向
- 输出提示：PRD 确认后调用 prd-to-spec skill 生成技术方案

### sync.md
作为 harness-sync skill 的快捷触发入口：
- 读取本次变更 diff + work/specs/ + work/evals/
- 回答四个蒸馏问题（新 invariant？新坑？边界变化？新自动化检查？）
- 将完成的计划从 active/ 移到 recent/
- 所有写入先输出草稿，待确认后再写入
