# Skill: 知识回灌（Harness Sync）

## 触发条件

需求完成、PR merge 后执行。将本次交付中产生的长期知识回灌到 harness 层。

## 输入

- 对应的需求名（用于定位 `work/` 中的工件）
- 本次 PR 的 diff（通过 `git diff main...HEAD` 或指定 base branch）

## 流程

### 第一步：收集信息

1. 运行 `git diff main...HEAD --stat` 了解变更范围
2. 读取 `work/specs/<需求名>-spec.md` — 技术方案中的决策和风险
3. 读取 `work/evals/<需求名>-eval.md` — 验证中发现的问题和遗留项
4. 读取当前 harness 层文件：
   - `harness/docs/architecture/invariants.md`
   - `harness/docs/architecture/boundaries.md`
   - `harness/docs/engineering/pitfalls.md`（如存在）
   - `harness/docs/quality/known-issues.md`（如存在）

### 第二步：回答四个问题

逐个分析，对每个问题给出明确结论：

#### Q1: 是否发现新的架构不变量（Invariant）？

- 本次实现中是否暴露了一个"如果违反会导致系统性错误"的约束？
- 如有 → 草拟新的 invariant 条目（遵循 invariants.md 的格式）
- 目标文件：`harness/docs/architecture/invariants.md`

#### Q2: 是否踩到了新坑（Pitfall）？

- 本次实现中是否遇到了不明显、容易重犯的问题？
- 如有 → 草拟 pitfall 条目（规则 / 原因 / 触发场景）
- 目标文件：`harness/docs/engineering/pitfalls.md`（如不存在则创建）

#### Q3: 是否改变了模块边界（Boundary）？

- 本次实现是否新增了模块、改变了依赖方向、修改了数据流？
- 如有 → 草拟 boundaries.md 的更新内容
- 目标文件：`harness/docs/architecture/boundaries.md`

#### Q4: 是否有可自动化检测的新约束？

- 本次实现中是否发现了可以自动化检测的约束？
- 如有 → 草拟新的 invariant 条目的 suggested check 命令（写入对应 invariant 的 `Suggested check` 字段）
- 目标文件：`harness/docs/architecture/invariants.md`（追加到对应条目）

### 第三步：输出草稿

**所有写入操作先输出草稿，待用户确认后再执行。**

对每个有内容的问题，输出：

```
### Q[N]: [问题标题]
**结论：** 有新增内容 / 无新增内容
**目标文件：** <文件路径>
**草稿内容：**
<具体要追加或修改的内容>
```

如果四个问题都无新增内容，输出：
```
### 回灌结论：无新增长期知识
本次交付未产生需要回灌到 harness 的新知识。
```

### 第四步：执行写入（用户确认后）

用户确认草稿后，依次写入目标文件。
对于新建文件（如 pitfalls.md 首次创建），使用合理的初始结构。

### 第五步：计划归档

1. 检查 `harness/plans/active/` 中是否有对应的计划文件
2. 如有且需求已完成：
   - 将计划文件从 `harness/plans/active/` 移到 `harness/plans/recent/`
   - 更新 `harness/plans/active/README.md`：
     - "当前默认任务"移除或指向下一个任务
     - "最近归档"更新为刚移动的文件
3. 如无活跃计划，跳过此步

### 第六步：输出总结

```
### Harness Sync 完成

**回灌内容：**
- invariants.md: 新增 N 条 / 未变更
- pitfalls.md: 新增 N 条 / 未变更 / 新建
- boundaries.md: 已更新 / 未变更
- invariants suggested checks: 新增 N 条 / 未变更

**计划归档：**
- <计划文件> → harness/plans/recent/

**质量评估：**
- 本次交付的知识回灌密度：高 / 中 / 低
```

## 输出

- 更新后的 harness 文件（经用户确认）
- 归档后的计划文件
- 控制台输出回灌总结

## 引用

- `AGENTS.md` — 项目结构
- `harness/workflow.md` — Knowledge Distillation、Plan Lifecycle
- `harness/docs/architecture/invariants.md` — 不变量格式参考
- `harness/docs/architecture/boundaries.md` — 边界格式参考
- `work/README.md` — 什么该进 harness、什么不该
