# 项目交付工作流（Workflow）

---

## 1. Principles（工作原则）

1. **Schema 优先** — 本项目是 Schema 驱动的系统。任何涉及题型、问卷结构、数据模型的改动，必须先确认对 Meta Schema → 问卷 Schema → UI Schema 三层协议的影响，再动手写代码。
2. **前后端对齐** — 题型字段定义在前端 `meta.js` 和后端 `template/*.json` 中各有一份。改动题型时必须双端同步，否则会出现搭建/渲染不一致。
3. **不跳步** — 遵循交付链路：PRD → 技术方案 → 任务拆解 → 实现 → 自验证 → 知识回灌。不要在没有技术方案的情况下直接实现复杂功能。
4. **猜测不落盘** — 无法从代码、配置、文档直接确认的信息，标记 `TODO: needs input`，不要写成既定事实。
5. **保存/发布隔离** — 保存写 SurveyConf 表，发布复制到 ResponseSchema 表。任何时候不要让投放端直接读取编辑态数据。
6. **现有事实优先** — 优先从 `docs/`、`package.json`、CI 配置、代码注释中获取信息，不要凭空发明流程或命令。

---

## 2. Reading Route（阅读路由）

### 理解项目
```
AGENTS.md → harness/docs/product/overview.md → harness/docs/product/domains.md
→ harness/docs/product/key-flows.md → docs/document/4-设计原理/2-协议规范.md
→ docs/document/3-开发手册/1-工程结构.md
```

### 理解当前需求
```
work/requests/<当前需求>.md → work/specs/<对应方案>.md（如已有）
→ harness/plans/active/<相关计划>.md（如已有）
```

### 写代码前
```
harness/docs/product/key-flows.md（确认涉及的核心路径）
→ harness/docs/product/domains.md（确认涉及的业务域）
→ 相关模块源码（server/src/modules/ 或 web/src/）
→ docs/agreement/（如涉及协议层）
→ docs/document/3-开发手册/（如涉及扩展机制）
→ AGENTS.md § 高风险区域（检查是否触及禁区）
```

### 排查 bug 前
```
harness/docs/engineering/pitfalls.md（先看已知坑，避免重复踩）
→ harness/docs/quality/known-issues.md（排除已知问题）
→ 相关模块源码
→ harness/docs/architecture/invariants.md（检查是否不变量被打破）
```

### 做架构判断前
```
docs/document/4-设计原理/2-协议规范.md（Schema 设计原理）
→ docs/document/4-设计原理/3-服务端架构.md（ER 图、双表设计）
→ docs/document/4-设计原理/4-问卷搭建领域化设计.md（五大子领域）
→ harness/docs/product/domains.md（核心业务域和边界）
→ server/src/app.module.ts（模块注册全景）
→ web/vite.config.ts（MPA 入口配置）
→ harness/docs/architecture/invariants.md
→ harness/docs/architecture/boundaries.md
```

### 做验证前
```
AGENTS.md § 常用命令（确认可用的 lint / test 命令）
→ harness/docs/product/key-flows.md（确认涉及的核心路径）
→ .github/workflows/（了解 CI 会跑什么）
→ 本文件 § Required Checks Before Completion
```

### 做收尾归档前
```
本文件 § Knowledge Distillation（确认需要回灌的内容）
→ 本文件 § Plan Lifecycle（确认计划归档流程）
```

---

## 3. Delivery Flow（交付链路）

```
需求输入 ──→ PRD ──→ 技术方案 ──→ 任务拆解 ──→ 实现 ──→ 自验证 ──→ 知识回灌 ──→ 计划归档
              │         │            │                      │            │
              ▼         ▼            ▼                      ▼            ▼
         work/       work/       work/                  work/       harness/
         requests/   specs/      tasks/                 evals/      docs/
```

### 各环节说明

| 环节 | 工件位置 | 产出物 | 触发条件 |
|------|---------|--------|---------|
| PRD | `work/requests/` | `<需求名>.md` — 问题描述、目标、范围、验收条件 | 收到新需求时 |
| 技术方案（Tech Spec） | `work/specs/` | `<需求名>-spec.md` — 方案选型、影响范围、接口设计 | PRD 确认后 |
| 任务拆解 | `work/tasks/` | `<需求名>-tasks.md` — 分步任务列表、依赖关系 | 技术方案确认后 |
| 实现 | 代码仓库 | 代码变更 | 任务拆解完成后逐步执行 |
| 自验证 | `work/evals/` | `<需求名>-eval.md` — 验证结果、测试命令输出 | 实现完成后 |
| 运行日志（可选） | `work/runs/` | 构建日志、CI 输出、调试记录等临时产出 | 需要保留过程记录时 |
| 知识回灌 | `harness/docs/` | 更新或新增长期知识文件 | 自验证通过后 |
| 计划归档 | `harness/plans/recent/` | 将活跃计划从 `active/` 移到 `recent/` | 需求完全交付后 |

### 简单任务的快捷路径

对于改动范围明确、风险低的小任务（如修复明确 bug、调整 UI 文案）：
- 可以跳过 PRD 和技术方案，但必须在 `work/tasks/` 中记录任务描述
- 实现后仍需执行 Required Checks
- 如果发现新的架构知识或踩坑经验，仍需回灌

---

## 4. Required Checks Before Completion（完成前检查）

### 第一层：静态检查（必须全通过）

```bash
# 后端（如有变更）
cd server && npm run lint         # ESLint 检查
cd server && npm run test         # 单元测试

# 前端（如有变更）
cd web && npm run type-check      # TypeScript 类型检查
cd web && npm run lint            # ESLint 检查
cd web && npm run build           # 构建验证（确保无编译错误）
```

**一键执行：**
```bash
(cd server && npm run lint && npm run test) && (cd web && npm run type-check && npm run lint && npm run build)
```

### 第二层：不变量检查（涉及对应区域时）

对本次变更涉及的不变量，执行 `harness/docs/architecture/invariants.md` 中每条的 suggested check。

通用检查项（任何变更都应确认）：
- [ ] 变更是否涉及协议层？如涉及，确认三层 Schema 一致性
- [ ] 变更是否涉及题型？如涉及，确认前端 `meta.js` + 后端 `template/*.json` + 题型菜单配置已同步
- [ ] 变更是否涉及环境变量？如涉及，确认 `docker-compose.yaml` 和文档已同步
- [ ] 变更是否涉及数据库 Entity？如涉及，确认 `app.module.ts` 的 entities 数组已更新
- [ ] 是否有新增依赖？确认 `package.json` 中版本范围合理

### 第三层：核心链路验证（涉及核心域时）

参考 `harness/docs/product/key-flows.md` 中定义的核心端到端路径：

| 变更涉及的域 | 必须验证的路径 |
|-------------|--------------|
| 问卷管理域 / 投放域 | 路径一（问卷全生命周期） |
| 共享层（物料） | 路径一 + 路径二（新题型端到端） |
| AI 模块 | 路径三（AI 生成问卷） |

验证方式：
- 如有 API 冒烟测试脚本 → 运行脚本
- 如无自动化 → 按 key-flows.md 中的手动走查步骤执行，逐步标注 PASS / FAIL / 需手动确认

> 当前状态：尚无自动化 E2E 或 API 冒烟测试。核心链路验证需手动执行。

详见 `harness/docs/engineering/commands.md` § Local Verification Flow。

---

## 5. Knowledge Distillation（知识回灌）

任务完成后，检查以下内容是否需要更新：

| 发现类型 | 回灌目标 | 示例 |
|---------|---------|------|
| 架构不变量（Invariant） | `harness/docs/architecture/invariants.md` | "投放端永远只读 ResponseSchema 表" |
| 边界变化 | `harness/docs/architecture/boundaries.md` | 新增模块、依赖方向调整 |
| 踩坑经验（Pitfall） | `harness/docs/engineering/pitfalls.md` | "新增题型必须同时改 meta.js 和后端模板" |
| 已知问题（Known Issue） | `harness/docs/quality/known-issues.md` | "web 端无自动化测试框架" |
| 命令变更 | `harness/docs/engineering/commands.md` | 新增了检查脚本 |
| 产品逻辑 | `harness/docs/product/` 相关文件 | 发现了隐藏的提交限制规则 |
| 核心路径变化 | `harness/docs/product/key-flows.md` | 新增了核心路径或验证步骤 |

**回灌原则：**
- 只回灌对未来 agent 仍有价值的信息
- 不回灌一次性调试细节或纯历史记录
- 如果发现既有内容已过时，直接更新而非追加

---

## 6. Plan Lifecycle（计划生命周期）

```
创建计划 → harness/plans/active/<plan-name>.md
  │
  ├─ 执行中：agent 默认读取 active/ 目录
  │
  ├─ 完成：移到 harness/plans/recent/<plan-name>.md
  │         从默认上下文中移出，仅按需读取
  │
  └─ 长期归档：从 recent/ 移出仓库
              在 harness/plans/archive-index.md 中记录指针
              格式：计划名 | 完成日期 | 外部位置（如 Issue/PR 链接）
```

### 规则

1. **活跃计划（Active）** — 放在 `harness/plans/active/`，agent 每次进入项目时主动读取
2. **近期完成（Recent）** — 放在 `harness/plans/recent/`，不进入默认上下文，需要时手动查阅
3. **纯历史（Archive）** — 不保留在仓库中，通过 `harness/plans/archive-index.md` 指向外部系统（GitHub Issue / PR / 外部文档）
4. **蒸馏优先** — 计划从 active 移出前，先检查是否有内容需要回灌到 `harness/docs/`。有复用价值的知识蒸馏回长期知识层，不要让它埋在归档计划里
5. **计划文件命名** — 使用 `YYYY-MM-DD-<简短描述>.md` 格式，如 `2026-03-30-ai-survey-generation.md`
