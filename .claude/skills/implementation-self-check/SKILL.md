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

1. 读取 `harness/docs/product/key-flows.md` — 加载核心端到端路径定义
2. 读取 `harness/docs/product/domains.md` — 判断本次变更涉及哪些业务域
3. 确认本地服务已启动（后端 + 前端），未启动则先启动
4. 对涉及的核心路径执行浏览器验证：
   - 探测当前可用的浏览器工具（/chrome / Playwright MCP / browser-use / cursor-ide-browser 均可）
   - 如有浏览器工具 → 按 key-flows.md 中的步骤表逐步执行，每步对比预期结果，截图记录
   - 如无浏览器工具 → 输出手动验证清单（逐步标注 PASS / FAIL / 需手动确认）
   - 如有 API 冒烟测试 → 作为辅助验证，但不替代浏览器验证

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

### 第七步：输出

1. 将报告写入 `work/evals/<需求名>-eval.md`
2. 更新 `work/tasks/<需求名>-tasks.md` 中验证相关任务的状态
3. 如果对应的 `harness/plans/active/` 计划存在，更新"当前状态"
4. 控制台输出结论摘要

**如结论为 FAIL：** 列出所有失败项，优先修复后重新运行本 skill。

## 输出

- `work/evals/<需求名>-eval.md` — 完整验证报告
- 控制台输出结论（PASS / FAIL / PASS with caveats）

## 引用

- `AGENTS.md` — 常用命令
- `harness/workflow.md` — Required Checks
- `harness/docs/architecture/invariants.md` — 不变量及其 check script
- `work/README.md` — 工件层使用规范
