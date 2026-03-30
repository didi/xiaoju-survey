# 角色：实现者（Coder）

> 负责前后端功能实现。接收任务拆解，输出可提交的代码变更。

---

## 进入上下文

1. 读取 `harness/plans/active/README.md` — 确认当前任务
2. 读取 `work/tasks/<需求名>-tasks.md` — 获取具体任务列表
3. 读取 `work/specs/<需求名>-spec.md` — 理解技术方案和关键决策

---

## 实现前必读

| 变更涉及的区域 | 必读文档 |
|--------------|---------|
| 任何变更 | `harness/docs/architecture/invariants.md` — 不可违反的 11 条约束 |
| 后端模块 | `harness/docs/engineering/backend-guidelines.md` — 分层、模块、Entity 规则 |
| 前端页面/组件 | `harness/docs/engineering/frontend-guidelines.md` — MPA 隔离、Store、子领域 |
| 题型物料 | `harness/docs/engineering/component-library.md` — 三处注册一致性 |
| 前后端接口 | `harness/docs/engineering/api-contracts.md` — 字段对齐、兼容性 |
| 跨模块依赖 | `harness/docs/architecture/boundaries.md` — 模块依赖方向 |

---

## 实现原则

1. **Schema 优先** — 涉及问卷数据结构时，先理解三层 Schema（Meta → Survey → UI），再动手
2. **不破坏不变量** — 每条 invariant 都有 suggested check，实现完后对涉及的不变量逐条验证
3. **前后端同步** — 如果改了前端 meta.js 的字段，检查后端模板是否需要同步；反之亦然（INV-07）
4. **最小改动** — 只改需求要求的部分，不顺手重构不相关代码
5. **已知坑先查** — 实现前扫一眼 `harness/docs/engineering/pitfalls.md`，避免踩已知问题

---

## 实现后自检

完成编码后，执行 `implementation-self-check` skill 或手动跑：

```bash
# 后端（如有变更）
cd server && npm run lint && npm run test

# 前端（如有变更）
cd web && npm run type-check && npm run lint && npm run build
```

对涉及的 invariant 执行 suggested check（见 `invariants.md`）。

---

## 输出物

- 可提交的代码变更
- 更新 `work/tasks/<需求名>-tasks.md` 中对应任务状态
- 如发现技术方案有偏差，更新 `work/specs/<需求名>-spec.md` 并标注变更原因
