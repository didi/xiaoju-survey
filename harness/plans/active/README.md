# 活跃计划目录

> Agent 每次进入项目时从本文件恢复上下文。
> 只扫描本文件和它指向的活跃计划，不主动扫描 `../recent/`。

---

## 当前默认任务

`TODO: no active task`

<!-- 有活跃任务时替换为：
- [task-<需求名>.md](task-<需求名>.md) — 一句话描述当前状态
-->

---

## 并行任务列表

无

<!-- 有多个并行任务时，每行一个：
- [task-<需求名A>.md](task-<需求名A>.md) — 状态描述
- [task-<需求名B>.md](task-<需求名B>.md) — 状态描述
-->

---

## 最近归档

无

<!-- 有归档时替换为：
- [../recent/<plan>.md](../recent/<plan>.md) — 完成日期，一句话总结
-->

---

## 使用说明

### 创建新计划

1. 在本目录创建 `task-<需求名>.md`
2. 填写：背景、目标、关键决策、当前状态、风险、跨 session 接力点
3. 更新本文件的"当前默认任务"指向新文件
4. 在 `work/` 中创建对应的 requests / specs / tasks 工件

### 计划文件内容建议

```markdown
# task-<需求名>

## 背景
<!-- 为什么做这个 -->

## 目标
<!-- 做完后的预期状态 -->

## 关键决策
<!-- 过程中做出的重要选择和理由 -->

## 当前状态
<!-- 最新进展，最近一次更新时间 -->

## 关联工件
- PRD: work/requests/<需求名>.md
- Spec: work/specs/<需求名>-spec.md
- Tasks: work/tasks/<需求名>-tasks.md
- Eval: work/evals/<需求名>-eval.md

## 风险与阻塞
<!-- 已知风险、阻塞项 -->

## 跨 session 接力
<!-- 下次进入时应从哪里继续 -->
```

### 完成计划

1. 确认 `work/evals/` 中验证通过
2. 执行知识蒸馏（见 `harness/workflow.md § Knowledge Distillation`）
3. 将计划文件从 `active/` 移到 `../recent/`
4. 更新本文件的"当前默认任务"和"最近归档"
