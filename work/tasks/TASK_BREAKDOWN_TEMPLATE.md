# 任务拆解模板（Task Breakdown）

> 复制本文件，重命名为 `<需求名>-tasks.md`，填写后提交。
> 每个子任务应是可独立执行、可独立验收的原子步骤。

---

## 基本信息

- **对应需求：** `work/requests/<需求名>.md`
- **对应方案：** `work/specs/<需求名>-spec.md`
- **对应计划：** `harness/plans/active/<plan>.md`
- **拆解日期：** <!-- YYYY-MM-DD -->

---

## 任务列表

### 阶段一：<!-- 阶段名称 -->

| # | 任务 | 依赖 | 验收条件 | 状态 |
|---|------|------|---------|------|
| 1 | <!-- 具体操作 --> | 无 | <!-- 怎么确认做完了 --> | pending |
| 2 | <!-- 具体操作 --> | #1 | <!-- 怎么确认做完了 --> | pending |

### 阶段二：<!-- 阶段名称 -->

| # | 任务 | 依赖 | 验收条件 | 状态 |
|---|------|------|---------|------|
| 3 | <!-- 具体操作 --> | #2 | <!-- 怎么确认做完了 --> | pending |

---

## 状态说明

- `pending` — 未开始
- `in_progress` — 进行中
- `done` — 已完成并验收
- `blocked` — 被阻塞（注明原因）
- `skipped` — 跳过（注明原因）

---

## 阻塞记录

<!-- 如遇阻塞，记录在此，方便跨 session 接力 -->

| 任务 # | 阻塞原因 | 解决方案 | 状态 |
|--------|---------|---------|------|
| | | | |

---

## 完成检查

任务全部完成后，执行以下检查：

- [ ] 后端：`cd server && npm run lint && npm run test`
- [ ] 前端：`cd web && npm run type-check && npm run lint`
- [ ] 构建：`cd web && npm run build`
- [ ] 手动验证受影响功能（如需要）
- [ ] 填写 `work/evals/<需求名>-eval.md`

---

## 蒸馏提示

> 任务完成后检查：
> - 执行过程中发现的踩坑经验 → `harness/docs/engineering/pitfalls.md`
> - 阻塞记录中的通用问题 → 考虑更新 `harness/docs/engineering/commands.md` 的 Troubleshooting
