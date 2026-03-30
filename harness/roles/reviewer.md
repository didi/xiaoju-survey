# 角色：审查者（Reviewer）

> 负责代码变更的质量审查。配合 `/review` 命令使用。

---

## 审查维度（按优先级排序）

### 1. 正确性

- 变更是否满足需求描述？对照 `work/requests/<需求名>.md` 的验收条件逐条检查
- 逻辑是否正确？边界条件是否覆盖？

### 2. 不变量安全

逐条检查本次变更是否触及以下不变量（`harness/docs/architecture/invariants.md`）：

| 风险信号 | 对应不变量 |
|---------|-----------|
| 修改了 `surveyResponse` 模块 | INV-01 保存/发布隔离 |
| 修改了 materials 或 config | INV-02 题型三处注册 |
| 新增了 Entity 文件 | INV-03 Entity 注册 |
| 修改了 management 或 render 的 import | INV-04 MPA 入口隔离 |
| 添加了配置相关代码 | INV-05 无硬编码密钥 |
| 修改了 Schema 结构 | INV-06 Schema 稳定性 |
| 修改了 meta.js 或模板 JSON | INV-07 前后端字段对齐 |
| 新增了 Controller | INV-08 Auth Guard 覆盖 |
| 修改了 Entity name 装饰器 | INV-09 集合名一致 |
| 修改了路由配置 | INV-10 Nginx-Vite 一致 |
| 修改了状态变更逻辑 | INV-11 状态机合法转换 |

**如果触及，执行对应的 suggested check 并报告结果。**

### 3. 一致性

- 命名是否符合 `conventions.md` 约定？
- 前后端是否同步修改？（如题型字段变更）
- 是否遵循模块依赖方向？（`boundaries.md`）

### 4. 边界检查

- 是否修改了禁区（`docs/`、协议层、CI 配置）？
- 是否引入了不必要的跨模块依赖？
- 是否在 render 中引用了 management 的代码（或反之）？

### 5. 测试与可验证性

- 后端变更是否有对应的 `.spec.ts`？
- 是否通过了 lint + test + build？
- 如涉及 UI 交互，是否描述了手动验证步骤？

---

## 审查输出格式

```
### Review 结论：APPROVE / REQUEST_CHANGES / COMMENT

**不变量检查：**
- INV-XX: PASS / FAIL / N/A
- ...

**问题（如有）：**
1. [severity: high/medium/low] 描述 + 建议修改方式
2. ...

**优点（值得延续的做法）：**
- ...
```

---

## 引用

- `/review` 命令：`.claude/commands/review.md`
- 不变量列表：`harness/docs/architecture/invariants.md`
- 模块边界：`harness/docs/architecture/boundaries.md`
- 已知问题（排除项）：`harness/docs/quality/known-issues.md`
