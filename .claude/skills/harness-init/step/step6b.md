请基于已生成的 harness 知识层，生成角色文件和 Claude Code subagent 定义。

## 一、角色文件（harness/roles/）

角色文件是**工具无关的角色知识**——定义"视角 + 流程"，不绑定任何特定 AI 工具。

根据项目类型选择角色组合：
- 前端项目：coder.md / code-reviewer.md / qa.md
- 后端项目：coder.md / code-reviewer.md / qa.md
- 全栈项目：coder.md（统一前后端）/ code-reviewer.md / qa.md
- 如架构复杂度高（微服务、多端、多域），额外生成 architect.md

目标目录：`harness/roles/`

**不要在 `harness/roles/` 下生成 README.md** — AGENTS.md 是唯一导航入口。

每个角色文件需包含：

### coder.md（实现者）
- 角色定位：接收任务拆解，输出可提交的代码变更
- 进入上下文：从 plans/active/ → work/tasks/ → work/specs/ 的阅读路径
- 实现前必读：按变更区域列出对应的 harness 文档（表格形式）
- 实现原则（3-5 条）
- 实现后自检流程（引用 commands.md 中的命令 + invariants 的 suggested check）
- 输出物定义

### code-reviewer.md（代码评审）
- 审查维度按优先级排序（正确性 > 不变量安全 > 一致性 > 边界检查 > 测试）
- 不变量风险信号映射表（"修改了 X" → 对应 INV-XX）
- 审查输出格式模板
- 与 /review 命令配合

### qa.md（验证者）
验证流程必须覆盖三个层次：

**第一层：静态检查**
- lint / type-check / unit test / build

**第二层：不变量机械化检查**
- 对涉及的 invariant 执行 suggested check

**第三层：核心链路验证**（这是最关键的一层）
- 引用 `harness/docs/product/key-flows.md` 中定义的核心端到端路径（Golden Path）
- 判断本次变更涉及哪些业务域（参考 `harness/docs/product/domains.md`）
- 确认本地服务已启动，然后对涉及的核心路径执行浏览器验证：
  - 探测当前可用的浏览器工具（不绑定特定工具，/chrome / Playwright MCP / browser-use / cursor-ide-browser 均可）
  - 按 key-flows.md 中 Golden Path 步骤表逐步操作浏览器，每步对比预期结果，截图记录
  - 如无浏览器工具 → 输出手动验证清单供用户走查
  - API 冒烟测试作为辅助验证，但不替代浏览器验证
- 核心链路验证不通过 = 整体 FAIL，不管静态检查是否全过

**第四层：验收条件逐条验证**
- 从 PRD 提取验收条件，逐条标记

PASS / FAIL / PASS with caveats 判断标准
- 与 implementation-self-check skill 配合

### architect.md（架构师，如需要）
- 核心关注：边界是否正确、依赖方向是否合法、不变量是否被打破
- 引用 boundaries.md / invariants.md / domains.md
- 产出：边界判断、风险说明、是否接受

---

## 二、Claude Code Subagent 定义（.claude/agents/）

基于 `harness/roles/` 中的角色，生成对应的 Claude Code subagent 定义。

目标目录：`.claude/agents/`

**不要在 `.claude/agents/` 下生成 README.md** — AGENTS.md 是唯一导航入口。

每个 subagent 文件必须包含 YAML frontmatter + Markdown 正文：

```markdown
---
name: <角色名，小写+连字符>
description: <一句话描述，用于模型自动判断何时调用>
tools: <逗号分隔的工具白名单，如 Read, Write, Edit, Bash, Grep, Glob>
model: <模型选择：haiku / sonnet / opus / inherit>
---

# <角色名> Subagent

角色知识见 @harness/roles/<对应角色>.md

## 触发条件
<什么时候调用这个 subagent>

## 工具权限
- 允许：<列出>
- 不允许：<列出>

## 输出要求
<输出到哪里、什么格式>
```

### 模型分配建议

| 角色 | 推荐模型 | 理由 |
|------|---------|------|
| architect | `opus` | 需要深度跨模块推理和结构决策 |
| coder | `sonnet` | 日常编码，性价比高 |
| code-reviewer | `sonnet` | 需要理解上下文，不需要写代码 |
| qa | `sonnet` | 需要理解测试逻辑和业务链路 |

用户可根据成本偏好调整（如 qa 降为 `haiku`、architect 降为 `sonnet`）。

### 生成的 subagent 列表（与 roles/ 一一对应）

| Subagent | 角色知识 | model | 关键约束 |
|----------|---------|-------|---------|
| `.claude/agents/coder.md` | `harness/roles/coder.md` | sonnet | 允许修改业务代码，不允许修改 harness/docs/ |
| `.claude/agents/code-reviewer.md` | `harness/roles/code-reviewer.md` | sonnet | 只读，不允许修改代码 |
| `.claude/agents/qa.md` | `harness/roles/qa.md` | sonnet | 允许读取和运行测试，不允许修改业务代码 |
| `.claude/agents/architect.md`（如有） | `harness/roles/architect.md` | opus | 允许读取和修改 harness/docs/architecture/ |

---

## 三、AGENTS.md 角色段落

确认 AGENTS.md 中的角色部分使用以下格式（一张表同时列出角色知识和 subagent）：

```markdown
## 角色

角色知识（工具无关）定义在 `harness/roles/`，Claude Code subagent 定义在 `.claude/agents/`。

| 角色 | 角色知识 | Subagent | 职责 |
|------|---------|----------|------|
| ... | harness/roles/... | .claude/agents/... | ... |
```

不要有第二张角色表，不要有"哪些角色需要隔离"的讨论段落。

---

## 要求
- 角色文件是"视角 + 流程"，不重复长期知识正文
- 引用 invariants.md / boundaries.md / domains.md / key-flows.md / checklist.md 等已有文件，不复制内容
- 每个角色都要引用具体的 harness 文件路径，不要只写"参见相关文档"
- QA 角色必须包含核心链路验证层，这是业务质量的最后一道防线
