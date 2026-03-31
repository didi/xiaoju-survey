# 一体化全栈项目（前端 + 后端）

```
repo-root/
├── AGENTS.md
│   # 跨工具导航入口；所有 coding agents 的统一入口
│   # 只放阅读路径、索引和规则入口，不做百科全书
│
├── CLAUDE.md
│   # Claude Code 薄适配入口；极薄，通过 @path 导入关键文件
│
│   # ↓ 以下 packages/ 结构仅适用于 monorepo；
│   # 非 monorepo 项目（如根目录直接放 server/ + web/）跳过此段
├── packages/                          # monorepo 时存在
│   ├── ui/
│   │   # 共享组件库 / design system
│   ├── shared/
│   │   # 共享工具、hooks、constants、类型
│   ├── api-contract/
│   │   # 前后端共享契约（OpenAPI / zod / DTO / schema / 类型）
│   └── config/
│       # eslint / tsconfig / build / lint / test 等共享配置
│
├── harness/
│   ├── workflow.md
│   │   # 项目级 AI 工作流：阅读路由、交付链路、检查清单、蒸馏规则、计划生命周期
│   │
│   ├── docs/
│   │   ├── architecture/
│   │   │   ├── boundaries.md
│   │   │   │   # 系统边界：前后端模块职责、依赖方向、数据流、改写安全区
│   │   │   └── invariants.md
│   │   │       # 系统不变量；每条带 suggested check 命令
│   │   │
│   │   ├── engineering/
│   │   │   ├── commands.md
│   │   │   │   # 真实存在的开发/测试/构建命令 + 一键检查组合
│   │   │   ├── conventions.md
│   │   │   │   # 通用工程约定：命名、目录组织、格式化、Git
│   │   │   ├── frontend-guidelines.md
│   │   │   │   # 前端规则：框架、状态、路由、样式（含样式系统）、组件、隔离
│   │   │   │   # 样式相关内容统一写在此文件中，不单独建 styling-system.md
│   │   │   ├── backend-guidelines.md
│   │   │   │   # 后端规则：分层架构、模块系统、数据模型、认证、配置、测试
│   │   │   ├── api-contracts.md
│   │   │   │   # 前后端接口契约：风格、认证、数据结构、兼容性、共享 schema
│   │   │   ├── component-library.md
│   │   │   │   # 组件库 / 物料体系：使用约束、扩展规则、第三方组件清单
│   │   │   │   # 相关外部链接写在此文件中，不在 references/ 中重复
│   │   │   └── pitfalls.md
│   │   │       # 已知坑：症状 → 根因 → 规避方式
│   │   │
│   │   ├── quality/
│   │   │   ├── checklist.md
│   │   │   │   # 提交前检查清单（自动化检查 + 不变量检查 + 手动验证）
│   │   │   ├── known-issues.md
│   │   │   │   # 已知且暂时接受的问题，避免 agent 重复报告
│   │   │   └── quality-score.md
│   │   │       # 当前质量基线：检查覆盖度、不变量覆盖度
│   │   │
│   │   ├── product/
│   │   │   ├── overview.md
│   │   │   │   # 产品定位 + 核心用户场景（3-5 个）
│   │   │   ├── domains.md
│   │   │   │   # 核心业务域：3-7 个域的职责、数据归属、域间数据流
│   │   │   │   # 这是判断变更影响范围和架构决策的基础
│   │   │   └── key-flows.md
│   │   │       # 核心端到端路径（Golden Path）：跨域的完整业务流程
│   │   │       # 每条路径标注验证方式，QA 用作交付前的最小验证基准
│   │   │
│   │   └── references/
│   │       └── index.md
│   │           # 统一参考索引：官方资源 + 技术栈文档 + 仓库内文档目录
│   │           # 不单独拆分 component-library-index / external-docs-index
│   │
│   ├── plans/
│   │   ├── active/
│   │   │   ├── README.md
│   │   │   │   # 当前任务入口；agent 默认从这里进入当前任务
│   │   │   └── task-*.md
│   │   │       # 当前任务的"作战地图"：背景、关键决策、状态、风险、跨 session 接力
│   │   ├── recent/
│   │   │   # 最近完成的计划；短期复盘/回滚有用，但不进默认上下文
│   │   └── archive-index.md
│   │       # 历史索引；指向外部系统
│   │
│   └── roles/
│       ├── architect.md
│       │   # 架构师角色（复杂项目）：边界、不变量、依赖方向、结构决策
│       ├── coder.md
│       │   # 统一实现者角色（前后端一体）：上下文加载、实现原则、自检流程
│       ├── code-reviewer.md
│       │   # 代码评审角色：5 维审查框架、不变量风险信号映射表
│       └── qa.md
│           # 验证者角色：静态检查 + 不变量检查 + 核心链路验证 + 验收条件
│
├── work/
│   ├── README.md
│   │   # 执行态工件层说明：目录职责、收敛流程、plans vs tasks 的区别
│   ├── requests/
│   │   # PRD / 需求输入
│   ├── specs/
│   │   # 技术方案
│   ├── tasks/
│   │   # 可执行任务拆解
│   ├── evals/
│   │   # 自验证结果 / 回归验证结果
│   └── runs/
│       # 运行日志 / agent 执行记录
│
├── .claude/
│   ├── settings.json
│   │   # Claude Code 权限与行为设置
│   ├── commands/
│   │   # review / ship / start / sync 快捷命令
│   ├── skills/
│   │   # prd-to-spec / spec-to-tasks / implementation-self-check / harness-sync
│   └── agents/
│       # Claude Code subagent 定义（与 harness/roles/ 一一对应）
│       # 每个文件引用对应的角色知识 + 定义触发条件和工具权限
│       # 不放 README.md — AGENTS.md 是唯一导航入口
│
└── .cursor/
    └── rules/
        ├── project.mdc
        │   # Cursor 薄适配入口；一句话项目说明 + 阅读路径
        │   # 通过 @file 引用 AGENTS.md / harness/workflow.md，不复制正文
        ├── coding.mdc
        │   # 编码规则路由：指向 conventions / guidelines / invariants / pitfalls
        │   # Cursor 特有配置（Composer 约束、补全偏好、文件排除）
        └── code-review.mdc
            # 审查规则路由：指向 harness/roles/code-reviewer.md + quality/checklist.md
            # 每个文件 ≤ 30 行，只做路由，不放知识正文
```
