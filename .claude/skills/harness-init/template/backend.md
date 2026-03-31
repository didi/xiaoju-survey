# 后端项目（Node 等）

```
repo-root/
├── AGENTS.md
│   # 跨工具导航入口；所有 coding agents 的统一入口
│   # 只放阅读路径、索引和规则入口，不做百科全书
│
├── CLAUDE.md
│   # Claude Code 薄适配入口；极薄，通过 @path 导入关键文件
│
├── harness/
│   ├── workflow.md
│   │   # 项目级 AI 工作流：阅读路由、交付链路、检查清单、蒸馏规则、计划生命周期
│   │
│   ├── docs/
│   │   ├── architecture/
│   │   │   ├── boundaries.md
│   │   │   │   # route/service/repo/domain/infra 边界、模块依赖图、改写安全区
│   │   │   └── invariants.md
│   │   │       # 不变量：事务、幂等、鉴权、接口兼容性等
│   │   │
│   │   ├── engineering/
│   │   │   ├── commands.md
│   │   │   │   # dev / test / migrate / lint / build 真实命令 + 一键检查组合
│   │   │   ├── conventions.md
│   │   │   │   # 通用工程约定：命名、目录组织、格式化、Git
│   │   │   ├── backend-guidelines.md
│   │   │   │   # 分层架构、模块系统、数据模型、认证鉴权、配置管理、测试约定
│   │   │   ├── api-contracts.md
│   │   │   │   # API 契约：接口风格、认证、数据结构、兼容性原则
│   │   │   └── pitfalls.md
│   │   │       # 已知坑：症状 → 根因 → 规避方式
│   │   │
│   │   ├── quality/
│   │   │   ├── checklist.md
│   │   │   │   # 提交前检查清单（自动化检查 + 不变量检查 + 手动验证）
│   │   │   ├── known-issues.md
│   │   │   │   # 已知且暂时接受的问题
│   │   │   └── quality-score.md
│   │   │       # 当前质量基线
│   │   │
│   │   ├── product/
│   │   │   ├── overview.md
│   │   │   │   # 产品定位 + 核心用户场景
│   │   │   ├── domains.md
│   │   │   │   # 核心业务域：3-7 个域的职责、数据归属、域间数据流
│   │   │   └── key-flows.md
│   │   │       # 核心端到端路径（Golden Path）：跨域的完整业务流程
│   │   │       # QA 用作交付前的最小验证基准
│   │   │
│   │   └── references/
│   │       └── index.md
│   │           # 统一参考索引：官方资源 + 技术栈文档 + 仓库内文档目录
│   │
│   ├── plans/
│   │   ├── active/
│   │   │   ├── README.md
│   │   │   │   # 当前任务入口
│   │   │   └── task-*.md
│   │   │       # 当前任务作战地图
│   │   ├── recent/
│   │   │   # 近期完成的计划
│   │   └── archive-index.md
│   │       # 历史索引
│   │
│   └── roles/
│       ├── coder.md
│       │   # 实现者角色
│       ├── code-reviewer.md
│       │   # 代码评审角色
│       └── qa.md
│           # 验证者角色：静态检查 + 不变量检查 + 核心链路验证 + 验收条件
│
├── work/
│   ├── README.md
│   │   # 执行态工件说明
│   ├── requests/
│   │   # PRD
│   ├── specs/
│   │   # 技术方案
│   ├── tasks/
│   │   # 任务拆解
│   ├── evals/
│   │   # 验证结果
│   └── runs/
│       # 运行日志
│
├── .claude/
│   ├── settings.json
│   ├── commands/
│   │   # review / ship / start / sync 快捷命令
│   ├── skills/
│   │   # prd-to-spec / spec-to-tasks / implementation-self-check / harness-sync
│   └── agents/
│       # Claude Code subagent 定义（与 harness/roles/ 一一对应）
│       # 不放 README.md — AGENTS.md 是唯一导航入口
│
└── .cursor/
    └── rules/
        ├── project.mdc
        │   # Cursor 薄适配入口；一句话项目说明 + 阅读路径
        │   # 通过 @file 引用 AGENTS.md / harness/workflow.md，不复制正文
        ├── coding.mdc
        │   # 编码规则路由：指向 conventions / backend-guidelines / invariants / pitfalls
        │   # Cursor 特有配置（Composer 约束、补全偏好、文件排除）
        └── code-review.mdc
            # 审查规则路由：指向 harness/roles/code-reviewer.md + quality/checklist.md
            # 每个文件 ≤ 30 行，只做路由，不放知识正文
```
