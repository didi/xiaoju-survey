纯盘点，不写文件。

请读取并分析以下信息源：
- 仓库根目录 README
- docs/ 或现有文档目录
- package.json / pnpm-workspace.yaml / turbo.json / nx.json / tsconfig / vite / next / jest / vitest / playwright / eslint / CI 配置
- scripts/ 目录
- 现有 .claude / .cursor / 其他 agent 配置（如果有）
- 用户提供的文档链接（如果有）

输出一张盘点表，字段如下：

| 类别 | 已有事实来源 | 可直接复用的内容 | 主要缺口 | 建议落入哪个目标文件 |
|------|------------|----------------|---------|-------------------|
| 产品 | | | | |
| 架构 | | | | |
| 工程 | | | | |
| 质量 | | | | |
| 动态流程 | | | | |

同时输出：
1. 项目类型判断：纯前端 / 纯后端 / 全栈 / monorepo
2. 技术栈摘要（框架、语言、包管理器、构建工具、测试框架、CI）
3. 已有的 agent 配置（.claude / .cursor / AGENTS.md 等）
4. 项目特有的架构模式或领域概念（如有）

只盘点，不生成文件。等确认后再执行下一步。
