# XIAOJUSURVEY — Agent 导航入口

> 轻量、安全的问卷调研系统。前端 Vue3 + ElementPlus，后端 NestJS + MongoDB，Schema 驱动的问卷全生命周期管理。

---

## 第一次进入项目的阅读顺序

1. **本文件** — 了解项目定位和导航结构
2. `harness/docs/product/overview.md` — 产品上下文和核心场景
3. `harness/docs/product/key-flows.md` — 关键用户路径
4. `harness/docs/engineering/commands.md` — 常用命令
5. `harness/workflow.md` — 任务交付流程

---

## Agent 默认读取范围

**主动读取：**
- `harness/docs/` — 长期知识层（产品、架构、工程、质量）
- `harness/plans/active/` — 当前活跃计划
- `work/` — 执行态工件（PRD、技术方案、任务、验证结果）

**不要主动扫描：**
- `harness/plans/recent/` — 已完成计划，仅在需要历史上下文时按需读取
- `harness/plans/archive-index.md` — 归档索引，指向外部系统，不要尝试展开

---

## 核心事实来源索引

### 产品
| 内容 | 位置 |
|------|------|
| 产品定位与场景 | `harness/docs/product/overview.md` |
| 关键用户路径 | `harness/docs/product/key-flows.md` |
| 功能矩阵（详细） | `docs/document/2-产品手册/1-概述.md` |
| AI 生成问卷 | `docs/document/3-开发手册/6-智能问卷.md` |

### 架构与设计原理
| 内容 | 位置 |
|------|------|
| 系统边界（模块职责、依赖方向、改写安全区）| `harness/docs/architecture/boundaries.md` |
| 架构不变量（11 条不可打破的约束） | `harness/docs/architecture/invariants.md` |
| 协议规范（Schema 设计） | `docs/document/4-设计原理/2-协议规范.md` |
| 服务端架构与 ER 图 | `docs/document/4-设计原理/3-服务端架构.md` |
| 编辑页五大子领域 | `docs/document/4-设计原理/4-问卷搭建领域化设计.md` |
| 题型物料化设计 | `docs/document/4-设计原理/6-题型物料化设计/` |
| 题型场景化设计 | `docs/document/4-设计原理/5-题型场景化设计.md` |
| Meta 协议规范 | `docs/agreement/1-《问卷Meta协议》.md` |
| 业务协议规范 | `docs/agreement/2-《问卷业务协议规范》.md` |
| 物料协议规范 | `docs/agreement/3-《题型物料协议规范》.md` |

### 工程
| 内容 | 位置 |
|------|------|
| 命令索引 | `harness/docs/engineering/commands.md` |
| 通用工程约定 | `harness/docs/engineering/conventions.md` |
| 前端开发指南 | `harness/docs/engineering/frontend-guidelines.md` |
| 后端开发指南 | `harness/docs/engineering/backend-guidelines.md` |
| API 契约 | `harness/docs/engineering/api-contracts.md` |
| 组件库与物料体系 | `harness/docs/engineering/component-library.md` |
| 已知坑 | `harness/docs/engineering/pitfalls.md` |
| 工程结构说明 | `docs/document/3-开发手册/1-工程结构.md` |
| 工程配置化 | `docs/document/3-开发手册/2-工程配置化.md` |
| 题型扩展 | `docs/document/3-开发手册/3-题型扩展.md` |
| 设置器扩展 | `docs/document/3-开发手册/4-设置器扩展.md` |
| 服务端入口 | `server/src/app.module.ts` |
| 前端 Vite 配置 | `web/vite.config.ts` |
| Docker 部署 | `docker-compose.yaml`、`Dockerfile`、`Dockerfile.full` |
| CI 流水线 | `.github/workflows/`（codecov / server-lint / web-lint） |

### 质量
| 内容 | 位置 |
|------|------|
| 提交前检查清单 | `harness/docs/quality/checklist.md` |
| 已知问题 | `harness/docs/quality/known-issues.md` |
| 质量概览 | `harness/docs/quality/quality-score.md` |

### 角色
| 角色 | 位置 | 适用场景 |
|------|------|---------|
| 实现者（Coder） | `harness/roles/coder.md` | 接任务、写代码、自检 |
| 审查者（Reviewer） | `harness/roles/reviewer.md` | 代码审查、配合 `/review` 命令 |
| 验证者（QA） | `harness/roles/qa.md` | 交付前验证、配合 `self-check` skill |

### 外部参考
| 内容 | 位置 |
|------|------|
| 外部参考索引 | `harness/docs/references/index.md` |
| 官方文档站 | https://xiaojusurvey.didi.cn |
| GitHub 仓库 | https://github.com/didi/xiaoju-survey |

---

## 项目结构速览

```
├── server/                  # 后端：NestJS + TypeORM + MongoDB
│   ├── src/modules/
│   │   ├── survey/          # 问卷管理（CRUD、模板、AI 生成）
│   │   ├── surveyResponse/  # 问卷投放（填写、提交、校验）
│   │   ├── auth/            # 用户认证（登录、注册、JWT）
│   │   ├── workspace/       # 空间管理
│   │   ├── channel/         # 渠道管理
│   │   ├── message/         # 消息推送
│   │   ├── file/            # 文件上传
│   │   └── appManager/      # 应用管理
│   └── scripts/run-local.ts # 本地启动（内存 MongoDB）
├── web/                     # 前端：Vue3 + Vite MPA
│   └── src/
│       ├── management/      # B 端（问卷管理端）
│       ├── render/          # C 端（问卷投放端）
│       ├── materials/       # 题型物料库
│       └── common/          # 公共模块
├── docs/                    # 原始文档（协议、设计、手册）
├── harness/                 # 长期知识层（agent 工程知识）
├── work/                    # 执行态工件层
│   ├── requests/            # PRD
│   ├── specs/               # 技术方案
│   ├── tasks/               # 任务拆解
│   ├── evals/               # 验证结果
│   └── runs/                # 运行日志（构建/CI/调试临时产出）
└── .claude/                 # Claude Code 专属适配
    └── commands/            # 自定义命令
```

---

## 常用命令

```bash
# 后端
cd server && npm install          # 安装依赖
cd server && npm run local        # 本地启动（内存 MongoDB，无需安装数据库）
cd server && npm run dev          # 开发模式（需配置 MongoDB）
cd server && npm run test         # 运行测试
cd server && npm run test:cov     # 测试 + 覆盖率
cd server && npm run lint         # ESLint

# 前端
cd web && npm install             # 安装依赖
cd web && npm run dev             # 开发模式（localhost:8080）
cd web && npm run build           # 构建
cd web && npm run type-check      # 类型检查
cd web && npm run lint            # ESLint

# Docker
docker-compose up -d              # 启动服务（需配置环境变量）
```

**访问地址（开发模式）：**
- B 端管理：http://localhost:8080/management
- C 端投放：http://localhost:8080/render/:surveyPath
- API 代理：前端 /api → http://127.0.0.1:3000

---

## 高风险区域 / 禁止事项

1. **协议层（Schema）是系统基石** — 修改 `docs/agreement/` 下的协议定义、`server/src/modules/survey/template/` 下的模板 JSON、`web/src/materials/questions/widgets/*/meta.js` 的字段定义前，必须理解 Meta Schema → 问卷 Schema → UI Schema 的三层关系
2. **保存/发布双表设计** — 保存写 SurveyConf，发布复制到 ResponseSchema，投放端读 ResponseSchema。不要合并这两张表
3. **题型物料注册** — 新增题型需要同时修改前端物料 + 后端模板 + 题型菜单配置，缺一不可
4. **环境变量** — `XIAOJU_SURVEY_MONGO_URL` 等数据库配置、`AImodel_API_URL/KEY/MODEL` 等 AI 配置，不要硬编码到代码中
5. **不要删除 `docs/` 目录** — 这是原始文档，`harness/` 引用而非替代它们

---

## work/ 与 harness/ 的使用边界

| 层 | 用途 | 生命周期 | 示例 |
|----|------|---------|------|
| `work/requests/` | PRD、需求描述 | 活跃期 | 新题型需求、性能优化需求 |
| `work/specs/` | 技术方案 | 活跃期 | 某功能的实现方案 |
| `work/tasks/` | 任务拆解 | 活跃期 | 按步骤拆解的实现任务 |
| `work/evals/` | 自验证结果 | 活跃期 | 测试报告、验证截图 |
| `work/runs/` | 运行日志 | 短期 | 构建日志、CI 输出、调试记录 |
| `harness/docs/` | 长期知识 | 长期 | 架构、边界、命令索引 |
| `harness/workflow.md` | 交付流程 | 长期 | PRD→Spec→Task→实现→验证 |
| `harness/plans/active/` | 活跃计划 | 中期 | 当前迭代计划 |
| `harness/plans/recent/` | 近期完成 | 归档 | 上个迭代的计划 |

**交付链路：** `work/requests/` → `work/specs/` → `work/tasks/` → 实现 → `work/evals/` → 知识回灌 `harness/docs/` → 计划归档 `harness/plans/recent/`
