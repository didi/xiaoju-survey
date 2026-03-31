请为当前仓库生成执行态工件模板，目录与文件如下：

work/
  README.md
  requests/
    REQUEST_TEMPLATE.md
  specs/
    TECH_SPEC_TEMPLATE.md
  tasks/
    TASK_BREAKDOWN_TEMPLATE.md
  evals/
    EVAL_TEMPLATE.md
  runs/
    RUN_LOG_TEMPLATE.md

> 如果项目规模较小（模块数 < 5），REQUEST_TEMPLATE 和 RUN_LOG_TEMPLATE 可简化为内嵌在 README.md 中的示例段落，不必单独建文件。

同时生成：

harness/plans/active/
  README.md

harness/plans/archive-index.md

要求：
- 这套模板要支撑：
  需求输入 → 技术方案 → 任务拆解 → 代码实现 → 自验证 → 结果归档
- 语言简洁、工程化、可直接使用
- 区分哪些内容来自需求，哪些来自代码事实，哪些来自验证结果
- 每个模板最后要注明：哪些信息在任务完成后应蒸馏回 `harness/`

`work/README.md` 必须写清：
- 每个子目录的职责
- 默认只处理当前任务工件
- 任务完成后如何收敛
- 什么该进 `harness/`，什么不该长期保留
- 明确区分：
  - `harness/plans/active/task-*.md` = 当前任务作战地图（背景、决策、状态、风险、跨 session 接力）
  - `work/tasks/*.md` = 具体可执行子任务列表（原子步骤、依赖、验收条件）
- 必须包含一节：`harness/plans/active/` 与 `work/tasks/` 的区别
  解释二者的职责边界、父子关系、默认工作方式

`harness/plans/active/README.md` 必须写清：
- 当前默认任务：（指向当前 task 文件）
- 并行任务列表：（如果有多个）
- 最近归档：（指向 `../recent/` 最新条目）
- agent 默认只从该 README 进入当前计划，不主动扫描 recent/
- 如果当前没有任务，明确写 `TODO: no active task`

`harness/plans/archive-index.md`：
- 归档位置说明
- 空的归档记录表（日期 / 计划文件 / 需求名 / 归档位置）
- 使用说明（由 harness-sync skill 在计划归档时更新）
