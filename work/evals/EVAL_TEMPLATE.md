# 自验证模板（Eval）

> 复制本文件，重命名为 `<需求名>-eval.md`，填写后提交。
> 记录验证结果，作为需求交付的证据。

---

## 基本信息

- **对应需求：** `work/requests/<需求名>.md`
- **对应任务：** `work/tasks/<需求名>-tasks.md`
- **验证日期：** <!-- YYYY-MM-DD -->
- **验证人：** <!-- 姓名或 agent -->

---

## 自动化检查结果

### 后端

```bash
cd server && npm run lint
# 结果：PASS / FAIL
# 如 FAIL，粘贴关键错误信息
```

```bash
cd server && npm run test
# 结果：PASS / FAIL
# 通过数 / 失败数 / 跳过数
```

### 前端

```bash
cd web && npm run type-check
# 结果：PASS / FAIL
```

```bash
cd web && npm run lint
# 结果：PASS / FAIL
```

```bash
cd web && npm run build
# 结果：PASS / FAIL
```

---

## 验收条件逐项验证

<!-- 从 work/requests/<需求名>.md 的验收条件复制过来，逐条标记 -->

| # | 验收条件 | 结果 | 说明 |
|---|---------|------|------|
| 1 | <!-- 条件 --> | PASS / FAIL | <!-- 如何验证的 --> |
| 2 | <!-- 条件 --> | PASS / FAIL | |

---

## 手动验证记录

<!-- 如需手动操作验证，记录步骤和结果 -->

1. 操作：<!-- 做了什么 -->
   结果：<!-- 看到了什么 -->

---

## 不变量检查

<!-- 检查本次变更是否违反 harness/docs/architecture/invariants.md 中的不变量 -->

- [ ] INV-01 保存/发布隔离 — 未违反
- [ ] INV-02 题型三处注册 — 未违反 / 不涉及
- [ ] INV-03 Entity 注册 — 未违反 / 不涉及
- [ ] 其他涉及的不变量：

---

## 遗留问题

<!-- 验证中发现的未解决问题 -->

| 问题 | 严重程度 | 是否阻塞交付 | 后续计划 |
|------|---------|-------------|---------|
| | 高/中/低 | 是/否 | |

---

## 总结

- **整体结论：** PASS / FAIL / PASS with caveats
- **是否可交付：** 是 / 否

---

## 蒸馏提示

> 验证完成后检查：
> - 遗留问题中的已知 bug → `harness/docs/quality/known-issues.md`
> - 验证过程中发现的新检查方法 → `harness/docs/engineering/commands.md`
> - 不变量检查中发现的新约束 → `harness/docs/architecture/invariants.md`
