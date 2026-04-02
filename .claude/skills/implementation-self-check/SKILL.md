# Skill: 实现后自验证

## 触发条件

代码实现完成后、PR merge 前执行。用于统一自验证并生成 eval 报告。

## 输入

- 对应的需求名（用于定位 `work/` 中的工件）
- 如无需求名，默认对当前 git diff 做通用检查

## 流程

### 第一步：读取上下文

1. 读取 `work/tasks/<需求名>-tasks.md` — 确认所有任务状态
2. 读取 `work/requests/<需求名>.md` — 提取验收条件
3. 读取 `harness/workflow.md` § Required Checks — 加载检查清单
4. 读取 `harness/docs/architecture/invariants.md` — 加载不变量列表

### 第二步：执行自动化检查

按顺序执行，逐项记录结果：

```bash
# 后端（如有变更）
cd server && npm run lint        # ESLint
cd server && npm run test        # Jest 单测

# 前端（如有变更）
cd web && npm run type-check     # TypeScript 类型检查
cd web && npm run lint           # ESLint
cd web && npm run build          # 构建验证
```

**失败处理：** 任一步骤失败时：
1. 记录失败信息
2. 尝试修复（如 lint 问题可自动修复则执行 `npm run format` 后重试）
3. 如无法自动修复，标记为失败并继续后续检查（收集全部问题）
4. 全部检查完成后，如有失败项，先修复再生成 eval 报告

### 第三步：不变量机械化检查

对本次变更涉及的不变量执行 suggested check（见 invariants.md 中每条的 check script）：

- INV-01: `grep -r "SurveyConf" server/src/modules/surveyResponse/` 应为空
- INV-03: 对比 Entity 文件数和 AppModule entities 数组元素数
- INV-04: `grep -r "@management\|/management/" web/src/render/` 应为空
- INV-05: `grep -rn "mongodb://" server/src/ --include="*.ts" | grep -v ".spec.ts" | grep -v "configService"` 应为空
- 其他涉及的不变量

### 第四步：核心链路验证（最关键的一层）

**本步必须自动执行浏览器验证，不允许直接跳到手动清单。**

1. 读取 `harness/docs/product/key-flows.md` — 加载核心端到端路径定义
2. 读取 `harness/docs/product/domains.md` — 判断本次变更涉及哪些业务域
3. **启动本地服务**（不要跳过，不要只输出启动命令让用户去跑）：
   - 后端：`cd server && npm run local`（后台运行，等待启动完成）
   - 前端：`cd web && npm run dev`（后台运行，等待启动完成）
   - 确认服务可访问后再继续
4. **打开浏览器，执行 Golden Path 验证**：
   - 依次尝试以下浏览器工具，使用第一个可用的：`/chrome` → `@playwright/mcp` → `browser-use` → `cursor-ide-browser`
   - 按 key-flows.md 中 Golden Path 步骤表**逐步操作浏览器**：打开页面、点击、输入、提交
   - 每步对比预期结果，标记 PASS / FAIL
   - 关键步骤截图，截图路径记入 eval 报告
5. **仅在确认所有浏览器工具均不可用时**，才降级为手动验证清单——但必须先实际尝试过，不能未尝试就降级

**核心链路验证不通过 = 整体 FAIL，不管静态检查是否全过。**

| 变更域 | 对应核心路径 |
|--------|------------|
| survey 模块、B 端编辑页 | 路径一：问卷全生命周期 |
| surveyResponse 模块、C 端渲染 | 路径一 |
| materials/、meta.js、模板 JSON | 路径二：新题型端到端 |
| survey/ai 相关代码 | 路径三：AI 生成问卷 |

### 第五步：验收条件逐条验证

从 PRD 的验收条件逐条检查，标记 PASS / FAIL。
如需手动验证（如 UI 交互），记录验证步骤和预期行为，标记为"需手动确认"。

### 第六步：生成 eval 报告

1. 复制 `work/evals/EVAL_TEMPLATE.md` 为 `work/evals/<需求名>-eval.md`
2. 填写所有章节：自动化检查结果、不变量检查、核心链路验证、验收条件验证、遗留问题
3. 给出总结论：PASS / FAIL / PASS with caveats

### 第七步：输出 eval 报告

1. 将报告写入 `work/evals/<需求名>-eval.md`
2. 更新 `work/tasks/<需求名>-tasks.md` 中验证相关任务的状态
3. 如果对应的 `harness/plans/active/` 计划存在，更新"当前状态"
4. 控制台输出结论摘要

**如结论为 FAIL：** 列出所有失败项，优先修复后重新运行本 skill。不进入下一步。

### 第八步：自动触发代码审查

eval 报告生成且结论非 FAIL 后，**自动执行代码审查**（不需要用户手动运行 /review）：

1. 调用 code-reviewer（参照 `harness/roles/code-reviewer.md` 和 `.claude/commands/review.md`）
2. code-reviewer 会读取刚生成的 eval 报告 + git diff，输出 review 结论
3. 将 review 结论追加到 eval 报告或输出为 `work/evals/review-<需求名>.md`
4. 最终向用户展示**完整交付摘要**：

```
### 交付摘要

**测试报告：** work/evals/<需求名>-eval.md
- 静态检查：全部 PASS
- 不变量检查：涉及 N 条，全部 PASS
- 核心链路浏览器验证：PASS / FAIL（含截图）
- 验收条件：X/Y 通过

**代码审查：** work/evals/review-<需求名>.md
- Review 结论：APPROVE / REQUEST_CHANGES / COMMENT
- 发现项：N 条（block: X / attention: Y / note: Z）

**下一步：**
- 如全部通过 → 运行 /sync 进行知识回灌和计划归档
- 如有问题 → 修复后重新运行本 skill
```

## 输出

- `work/evals/<需求名>-eval.md` — 完整验证报告（含浏览器截图）
- `work/evals/review-<需求名>.md` — 代码审查报告
- 控制台输出交付摘要

## 引用

- `AGENTS.md` — 常用命令
- `harness/workflow.md` — Required Checks
- `harness/docs/architecture/invariants.md` — 不变量及其 check script
- `work/README.md` — 工件层使用规范
