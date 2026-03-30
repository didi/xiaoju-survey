# Skill: PRD → 技术方案

## 触发条件

当 `work/requests/` 中有已填写的 PRD 文件，需要产出技术方案时执行。

## 输入

- 一个已填写的 PRD 文件路径（如 `work/requests/<需求名>.md`）

## 流程

### 第一步：读取上下文

1. 读取指定的 PRD 文件，提取：目标、范围、验收条件
2. 读取 `AGENTS.md` — 确认项目结构和高风险区域
3. 读取 `harness/workflow.md` § Delivery Flow — 确认当前处于技术方案阶段
4. 读取 `harness/docs/architecture/boundaries.md` — 确认模块边界和依赖方向
5. 读取 `harness/docs/architecture/invariants.md` — 确认不变量约束

### 第二步：分析影响范围

基于 PRD 中的目标和范围，在**真实代码**中确认：

1. **涉及哪些模块？** — 搜索相关文件，确认实际模块结构
2. **涉及哪些 Entity？** — 检查 `server/src/models/` 中是否需要变更
3. **涉及哪些前端页面/组件？** — 检查 `web/src/` 中的对应目录
4. **是否触及不变量？** — 逐条比对 invariants.md
5. **是否涉及外部服务？** — 检查环境变量和外部依赖

**禁止：**
- 不允许凭空发明接口、模块、能力
- 不允许假设不存在的文件或函数
- 对无法从代码确认的部分标记 `TODO: needs input`

### 第三步：生成技术方案

1. 复制 `work/specs/TECH_SPEC_TEMPLATE.md` 为 `work/specs/<需求名>-spec.md`
2. 填写所有章节，确保：
   - "影响范围 → 涉及模块"中列出的每个文件都真实存在
   - "影响范围 → 涉及不变量"中逐条标注是否涉及
   - "方案选型"至少列出一个可行方案（如有多个则对比）
   - "接口设计"基于现有 Controller 的风格模式
   - "实现步骤概览"粒度适中，后续可被 spec-to-tasks 细化

### 第四步：输出

1. 将方案文件写入 `work/specs/<需求名>-spec.md`
2. 如果对应的 `harness/plans/active/` 计划文件存在，更新其"关联工件"和"当前状态"
3. 输出方案摘要供用户确认

## 输出

- `work/specs/<需求名>-spec.md` — 完整技术方案
- 控制台输出方案摘要

## 引用

- `AGENTS.md` — 项目结构、高风险区域
- `harness/workflow.md` — 交付链路
- `harness/docs/architecture/boundaries.md` — 模块边界
- `harness/docs/architecture/invariants.md` — 不变量
- `work/README.md` — 工件层使用规范
