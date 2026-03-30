交付前收尾检查。

请按以下流程执行完成前的统一检查和收尾：

## 1. 执行 Required Checks

参照 `harness/workflow.md` § Required Checks Before Completion：

```bash
# 后端（如有变更）
cd server && npm run lint && npm run test

# 前端（如有变更）
cd web && npm run type-check && npm run lint && npm run build
```

逐个执行，记录每项结果。任一失败则停止并报告。

## 2. 不变量检查

读取 `harness/docs/architecture/invariants.md`，对本次变更涉及的不变量执行机械化检查（如有 suggested check script 则运行）。

## 3. 变更总结

运行 `git diff --stat` 汇总变更，输出以下格式：

```
### 变更总结

**涉及文件：** N 个
**涉及模块：** <列出>

**改动摘要：**
- <一句话描述每个关键改动>

**检查结果：**
- [ ] server lint: PASS/FAIL
- [ ] server test: PASS/FAIL
- [ ] web type-check: PASS/FAIL
- [ ] web lint: PASS/FAIL
- [ ] web build: PASS/FAIL
- [ ] 不变量检查: PASS/FAIL
```

## 4. 蒸馏检查

参照 `harness/workflow.md` § Knowledge Distillation，检查本次任务中是否有内容需要回灌：

- 新的架构约束 → `harness/docs/architecture/invariants.md`
- 踩坑经验 → `harness/docs/engineering/pitfalls.md`
- 已知遗留问题 → `harness/docs/quality/known-issues.md`
- 命令变更 → `harness/docs/engineering/commands.md`

如有需要回灌的内容，执行更新。如无，明确说明"无需蒸馏"。

## 5. 工件收尾

检查 `work/` 中对应的工件状态：
- `work/tasks/<需求名>-tasks.md` 中所有任务是否标记为 done？
- `work/evals/<需求名>-eval.md` 是否已填写？如未填写，现在填写。
- `harness/plans/active/README.md` 是否需要更新状态？

## 6. 输出结论

```
### Ship 结论：READY / NOT READY

**阻塞项：** 无 / <列出未通过的检查>
**蒸馏：** 已完成 / 无需蒸馏
**建议的 commit message：** <基于变更生成>
```

如结论为 READY，等待用户确认后再执行 commit。
