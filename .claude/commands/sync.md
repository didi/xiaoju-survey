需求完成后的知识蒸馏与计划归档。触发 harness-sync 流程。

请按以下步骤执行，**所有写入先输出草稿，用户确认后再写入文件**。

## 1. 读取上下文

```bash
git diff main...HEAD --stat
git diff main...HEAD
```

同时读取：
- `harness/plans/active/README.md`（当前计划）
- `work/specs/`（技术方案）
- `work/evals/`（验证结果）

## 2. 回答四个蒸馏问题

逐一检查并输出草稿答案：

**Q1：是否发现了新的架构约束或不变量？**
- 参照 `harness/docs/architecture/invariants.md` 现有的 11 条
- 如有新约束：起草追加内容（格式与现有条目一致）

**Q2：是否踩了新坑？**
- 参照 `harness/docs/engineering/pitfalls.md`
- 如有新坑：起草追加内容（格式：症状 → 根因 → 规避方式）

**Q3：是否有边界变化？**
- 参照 `harness/docs/architecture/boundaries.md`
- 如有变化：起草更新内容

**Q4：是否有新的已知问题或已修复的已知问题？**
- 参照 `harness/docs/quality/known-issues.md`
- 如有变化：起草追加或删除内容

输出格式：
```
### 蒸馏草稿

**Q1 新不变量：** 无 / <草稿内容>
**Q2 新坑：** 无 / <草稿内容>
**Q3 边界变化：** 无 / <草稿内容>
**Q4 已知问题变化：** 无 / <草稿内容>
```

## 3. 用户确认蒸馏内容

等待用户确认或修改草稿，然后写入对应文件。

## 4. 归档计划

确认写入后，执行计划归档：

1. 将 `harness/plans/active/<计划文件>.md` 移动到 `harness/plans/recent/`
2. 更新 `harness/plans/active/README.md`，清空"当前默认任务"
3. 更新 `harness/plans/archive-index.md`（追加本次归档记录）

归档记录格式：
```markdown
| YYYY-MM-DD | <需求名称> | recent/<计划文件名>.md | <一句话摘要> |
```

## 5. 输出结论

```
### Sync 完成

**蒸馏：** 已写入 N 处 / 无需蒸馏
**计划归档：** harness/plans/recent/<文件名>.md
**active/README.md：** 已清空当前任务
```
