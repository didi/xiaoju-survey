请基于已生成的 invariants.md、commands.md、CI 配置和现有测试框架，生成质量层文件：

## 1. `harness/docs/quality/checklist.md`
提交前检查清单，分为四层：

**第一层：静态检查（必须全部通过）**
- 自动化检查项直接引用 commands.md 中的真实命令

**第二层：不变量检查（涉及对应区域时）**
- 不变量检查项引用 invariants.md 中的 suggested check

**第三层：核心链路验证（涉及核心业务域时）**
- 引用 `harness/docs/product/key-flows.md` 中定义的核心端到端路径
- 判断本次变更影响哪些核心路径
- 对受影响路径执行最小验证（方式由 key-flows.md 定义）
- 标注验证结果：PASS / FAIL / 需手动确认

**第四层：提交前确认项**
- 变更范围确认、已知问题排除、蒸馏提醒

## 2. `harness/docs/quality/known-issues.md`
当前已知且暂时接受的问题：
- 从盘点中发现的缺口（如缺少测试框架、缺少 E2E）整理为已知问题
- 从 commands.md 的 TODO 项中提取
- 避免 agent 重复报告这些问题
- 每条格式：现状 / 影响 / 接受原因 / TODO（如有后续计划）

## 3. `harness/docs/quality/quality-score.md`
当前质量基线：
- 自动化检查覆盖度：哪些已有、哪些缺失、CI 覆盖情况
- 不变量覆盖度：哪些可自动化、哪些已有 suggested check
- 作为后续 harness-sync 更新的基线

要求：
- 已知问题只写真实存在的问题，不编造
- checklist 中的命令必须是 commands.md 中列出的真实命令
- quality-score 是当前状态快照，不是目标规划
