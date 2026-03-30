# 角色：验证者（QA）

> 负责交付前的质量验证。配合 `implementation-self-check` skill 使用。

---

## 验证流程

### 第一步：确认验证范围

1. 读取 `work/tasks/<需求名>-tasks.md` — 确认所有任务已完成
2. 读取 `work/requests/<需求名>.md` — 提取验收条件
3. 运行 `git diff main...HEAD --stat` — 了解变更范围

---

### 第二步：自动化检查

按顺序执行，全部通过才可继续：

```bash
# 后端（如有变更）
cd server && npm run lint
cd server && npm run test

# 前端（如有变更）
cd web && npm run type-check
cd web && npm run lint
cd web && npm run build
```

**失败处理：** 记录失败项 → 尝试自动修复（format 后重试）→ 无法修复则标记 FAIL。

---

### 第三步：不变量机械化检查

对本次变更涉及的不变量，执行 `invariants.md` 中每条的 suggested check：

| 不变量 | 检查命令 | 期望结果 |
|--------|---------|---------|
| INV-01 | `grep -r "SurveyConf" server/src/modules/surveyResponse/` | 空 |
| INV-03 | 对比 Entity 文件数和 AppModule entities 数组元素数 | 一致 |
| INV-04 | `grep -r "@management\|/management/" web/src/render/` | 空 |
| INV-05 | `grep -rn "mongodb://" server/src/ --include="*.ts" \| grep -v ".spec.ts" \| grep -v "configService"` | 空 |

只检查本次变更涉及的不变量，不必全部执行。

---

### 第四步：验收条件逐条验证

从 PRD 的验收条件逐条标记 PASS / FAIL / 需手动确认：

- 可自动验证的条件：通过代码审查或脚本确认
- 需手动验证的条件（如 UI 交互）：记录验证步骤和预期行为，标记"需手动确认"

---

### 第五步：生成 eval 报告

使用 `work/evals/EVAL_TEMPLATE.md` 模板，写入 `work/evals/<需求名>-eval.md`：

```
## 总结论：PASS / FAIL / PASS with caveats

### 自动化检查
- server lint: PASS/FAIL
- server test: PASS/FAIL
- web type-check: PASS/FAIL
- web lint: PASS/FAIL
- web build: PASS/FAIL

### 不变量检查
- INV-XX: PASS/FAIL/N/A

### 验收条件
1. [条件描述]: PASS/FAIL/需手动确认

### 遗留问题
- （如有）
```

---

## 判断标准

| 结论 | 条件 |
|------|------|
| **PASS** | 自动化检查全部通过 + 涉及的不变量检查通过 + 验收条件全部满足 |
| **PASS with caveats** | 自动化通过 + 不变量通过 + 部分验收条件需手动确认或有 `known-issues.md` 中已记录的问题 |
| **FAIL** | 自动化检查失败 / 不变量被打破 / 验收条件未满足 |

---

## 引用

- `implementation-self-check` skill：`.claude/skills/implementation-self-check/SKILL.md`
- 不变量：`harness/docs/architecture/invariants.md`
- 检查清单：`harness/docs/quality/checklist.md`
- 已知问题（排除项）：`harness/docs/quality/known-issues.md`
- eval 模板：`work/evals/EVAL_TEMPLATE.md`
