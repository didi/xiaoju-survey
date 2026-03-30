# Skill: 技术方案 → 任务拆解

## 触发条件

当 `work/specs/` 中有已确认的技术方案，需要拆解为可执行任务时执行。

## 输入

- 一个已确认的技术方案文件路径（如 `work/specs/<需求名>-spec.md`）

## 流程

### 第一步：读取上下文

1. 读取指定的技术方案，提取：影响范围、实现步骤概览、风险项
2. 读取对应的 PRD：`work/requests/<需求名>.md`，提取验收条件
3. 读取 `harness/workflow.md` § Required Checks — 确认完成检查清单
4. 读取 `AGENTS.md` § 常用命令 — 确认可用的 lint / test / build 命令

### 第二步：拆解任务

将技术方案的"实现步骤概览"细化为原子任务，每个任务必须满足：

1. **可独立执行** — 一个任务不依赖同阶段其他任务的中间态（除非声明依赖）
2. **可独立验收** — 每个任务有明确的验收条件（如：文件存在、测试通过、lint 无报错）
3. **可收尾** — 每个任务完成后系统应处于可运行状态，不留半成品

拆解规则：
- 按"阶段"组织（如：数据层 → 服务层 → 控制层 → 前端 → 验证）
- 标注依赖关系（哪个任务必须在哪个之后）
- 最后一个阶段固定为"验证与收尾"，包含 lint / test / build / 手动验证
- 如有风险项或待确认项，作为独立任务标注为 `blocked`

### 第三步：生成任务文件

1. 复制 `work/tasks/TASK_BREAKDOWN_TEMPLATE.md` 为 `work/tasks/<需求名>-tasks.md`
2. 填写所有任务，确保：
   - 每个任务有编号、描述、依赖、验收条件、初始状态（pending）
   - "完成检查"章节包含来自 workflow.md 的 Required Checks
   - 任务总数合理（一般 5-15 个，太少说明粒度不够，太多说明过度拆解）

### 第四步：输出

1. 将任务文件写入 `work/tasks/<需求名>-tasks.md`
2. 如果对应的 `harness/plans/active/` 计划文件存在，更新其"关联工件"和"当前状态"
3. 输出任务清单摘要供用户确认

## 输出

- `work/tasks/<需求名>-tasks.md` — 完整任务拆解
- 控制台输出任务清单摘要（编号、任务名、依赖）

## 引用

- `AGENTS.md` — 常用命令
- `harness/workflow.md` — Required Checks、交付链路
- `harness/docs/architecture/boundaries.md` — 确认拆解不越界
- `work/README.md` — 工件层使用规范、plans/active 与 work/tasks 的区别
