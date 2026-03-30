# CLAUDE.md — Claude Code 入口

@AGENTS.md

## 进入项目后优先读取

1. `@AGENTS.md` — 项目导航、事实来源索引、高风险区域
2. `@harness/workflow.md` — 交付流程
3. `@harness/docs/engineering/commands.md` — 命令索引

## 语言约定

- 除文件路径、命令、代码标识符外，所有输出使用中文
- 关键术语采用"中文 + 英文括号首提"格式，如：架构不变量（Invariant）
- 不要整篇英文，不要中英混乱切换

## 工作约定

- 未确认信息标记 `TODO: needs input`，不要把猜测写成事实
- 优先复用 `docs/`、`package.json`、CI 配置等现有事实来源
- 遵循交付链路：PRD → 技术方案 → 任务拆解 → 实现 → 自验证 → 知识回灌，不跳步

## Claude Code 专属配置

- 自定义命令：`.claude/commands/`
- 项目记忆：`.claude/` 下的 memory 相关内容
