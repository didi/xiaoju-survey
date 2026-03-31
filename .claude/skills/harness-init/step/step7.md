请生成以下 Claude Code skills：

1. `.claude/skills/prd-to-spec/SKILL.md`
2. `.claude/skills/spec-to-tasks/SKILL.md`
3. `.claude/skills/implementation-self-check/SKILL.md`
4. `.claude/skills/harness-sync/SKILL.md`

要求：
- skills 是完整流程模板，不是长期知识正文
- 所有 skills 都必须引用：
  - `AGENTS.md`
  - `harness/workflow.md`
  - `work/README.md`
- 不得把长期知识复制进 SKILL.md
- skill 中引用的 harness 文件会在运行时动态读取，不嵌入正文。确保引用路径与 step1b-step4b 生成的实际文件路径一致即可

四个 skill 的职责分别是：

### prd-to-spec
- 读取 `work/requests/*.md`（如用户提供 Cooper 文档 ID，先通过 cooper skill 拉取内容落盘）
- 结合 repo 事实与 `harness/docs/`
- 生成 `work/specs/*.md`
- 不允许凭空发明接口、模块、能力

### spec-to-tasks
- 读取 `work/specs/*.md`
- 生成 `work/tasks/*.md`
- 任务拆解应可执行、可验证、可收尾

### implementation-self-check
- 在实现后执行统一自验证，分为四层：
  1. **静态检查**：lint / type-check / unit test / build
  2. **不变量检查**：对涉及的不变量执行 suggested check
  3. **核心链路验证**（浏览器验证）：
     - 读取 `harness/docs/product/key-flows.md` 中的核心端到端路径（Golden Path）
     - 判断本次变更涉及哪些核心路径（参考 `harness/docs/product/domains.md`）
     - 确认本地服务已启动，探测可用浏览器工具（/chrome / Playwright MCP / browser-use / cursor-ide-browser，不绑定特定工具）
     - 按 key-flows.md 步骤表逐步操作浏览器，每步对比预期结果，截图记录
     - 无浏览器工具时输出手动验证清单
     - 核心链路不通过 = 整体 FAIL
  4. **验收条件逐条验证**
- 生成 `work/evals/*.md`
- 失败时先修复再结束
- 触发时机：PR merge 前

### harness-sync
- 在需求完成、PR merge 后触发
- 读取本次 PR diff + `work/specs/*.md` + `work/evals/*.md`
- 回答 4 个问题：
  1. 新 invariant？→ 更新 `harness/docs/architecture/invariants.md`
  2. 新坑？→ 更新 `harness/docs/engineering/pitfalls.md`
  3. 边界变化？→ 更新 `harness/docs/architecture/boundaries.md`
  4. 新的可自动化检测约束？→ 追加到 invariants.md 对应条目的 suggested check 字段
- 如果四个问题都答不出来，输出"无新增长期知识"
- 将 `harness/plans/active/` 中已完成任务移动到 `harness/plans/recent/`
- 所有写入先输出草稿，待确认后再写入
