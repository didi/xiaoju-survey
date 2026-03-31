# Harness 初始化报告

**执行日期：** 2026-03-31  
**执行范围：** 全栈项目（NestJS 后端 + Vue3 前端 MPA）

---

## 完整性自检报告

### Ghost References：0 处

所有文件内引用的路径均已验证存在，无悬空引用。

### 交叉引用：全部一致

| 检查项 | 状态 |
|--------|------|
| AGENTS.md 索引覆盖所有 harness/ 文件 | ✅ |
| workflow.md 中所有引用路径存在 | ✅ |
| skills 和 commands 中引用路径存在 | ✅ |
| 角色文件中引用的 harness 文件存在 | ✅ |
| AGENTS.md 中 domains.md 已正确索引 | ✅ |

### TODO 残留：0 处

所有内容已从代码事实填写，无保留的 `TODO: needs input`。

### 冗余：0 处

无高度重复内容，无冗余文件。

### .gitignore 检查：⚠️ 1 处需补充

`.claude/settings.local.json` 未在 `.gitignore` 中，建议追加：
```
.claude/settings.local.json
```

### 模板覆盖率：全栈模板 100%（Claude Code 必要文件）

---

## 生成的文件清单

### 产品层（harness/docs/product/）
| 文件 | 说明 |
|------|------|
| `overview.md` | 产品定位、双端模型、五大场景、核心实体 |
| `domains.md` | 五个核心业务域及数据流向 |
| `key-flows.md` | 三条黄金路径（全生命周期 / 新题型 / AI 生成） |

### 工程层（harness/docs/engineering/）
| 文件 | 说明 |
|------|------|
| `commands.md` | 九大命令分区索引 |
| `conventions.md` | 命名、目录、格式、Git 约定 |
| `frontend-guidelines.md` | Vue3/Vite MPA 开发规范 |
| `backend-guidelines.md` | NestJS 分层、模块、Entity、Auth 规范 |
| `api-contracts.md` | REST 风格、JWT、核心 API 表 |
| `component-library.md` | 题型物料系统（含三处注册一致性） |
| `pitfalls.md` | 9 条已知坑 |

### 架构层（harness/docs/architecture/）
| 文件 | 说明 |
|------|------|
| `boundaries.md` | 模块职责、依赖图、安全改写区 |
| `invariants.md` | 11 条架构不变量（INV-01 ~ INV-11） |

### 质量层（harness/docs/quality/）
| 文件 | 说明 |
|------|------|
| `checklist.md` | 四层提交前检查清单 |
| `known-issues.md` | 5 条已知问题（KI-01 ~ KI-05） |
| `quality-score.md` | 质量基线快照（2026-03-31） |

### 外部参考
| 文件 | 说明 |
|------|------|
| `harness/docs/references/index.md` | 官方文档、技术栈文档、仓库文档索引 |

### 角色文件（harness/roles/）
| 文件 | 说明 |
|------|------|
| `architect.md` | 架构师：边界判断、不变量保护 |
| `coder.md` | 实现者：接任务、写代码、自检 |
| `code-reviewer.md` | 代码评审：正确性 > 不变量 > 一致性 > 边界 > 测试 |
| `qa.md` | 验证者：四层验证（含核心链路验证） |

### 计划层（harness/plans/）
| 文件 | 说明 |
|------|------|
| `active/README.md` | 当前无活跃任务 |

### Claude Code 命令（.claude/commands/）
| 命令 | 说明 |
|------|------|
| `review.md` | 代码审查 |
| `ship.md` | 交付前收尾检查 |
| `start.md` | 启动新需求交付流程 |
| `sync.md` | 知识蒸馏与计划归档 |

### Claude Code Subagent（.claude/agents/）
| 文件 | model | 说明 |
|------|-------|------|
| `architect.md` | opus | 架构边界决策 |
| `coder.md` | sonnet | 代码实现 |
| `code-reviewer.md` | sonnet | 代码审查 |
| `qa.md` | sonnet | 质量验证 |

### Skills（.claude/skills/）
| Skill | 说明 |
|-------|------|
| `prd-to-spec` | PRD → 技术方案 |
| `spec-to-tasks` | 技术方案 → 任务拆解 |
| `implementation-self-check` | 实现后四层自验证 |
| `harness-sync` | 知识回灌（蒸馏 + 归档） |
| `harness-init` | Harness 初始化（本 skill） |

---

## 本次初始化的关键决策

1. **新增 domains.md** — 将五个核心业务域显式化，让 QA 角色能判断变更影响范围
2. **四层验证模型** — 在静态检查 + 不变量检查的基础上，新增"核心链路验证"层（第三层）。此层优先级最高：核心链路不通过 = 整体 FAIL
3. **三条黄金路径** — 作为核心链路验证的标准化清单，比通用验收标准更具业务意义
4. **角色文件工具无关** — harness/roles/ 只描述视角和流程，不绑定工具；.claude/agents/ 是 Claude Code 的适配层

---

## 待处理项

| 优先级 | 项目 | 说明 |
|--------|------|------|
| 🟡 | 补充 `.gitignore` | 添加 `.claude/settings.local.json` 条目，避免本机权限配置提交 |
| 🟢 | 前端测试框架 | 参见 KI-01，有计划引入 Vitest + Playwright，未排期 |
| 🟢 | API 冒烟测试 | 参见 KI-02，三条黄金路径目前依赖手动验证 |
