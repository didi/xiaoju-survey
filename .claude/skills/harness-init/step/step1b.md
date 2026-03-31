基于盘点结果，生成以下文件。

## 1. `AGENTS.md`

要求：
- 跨工具导航入口，不是百科全书
- 80~150 行
- 明确 agent 默认读取范围：
  1) `harness/docs/`
  2) `harness/plans/active/`
  3) `work/`
- 明确不要主动扫描：
  - `harness/plans/recent/`
  - `harness/plans/archive-index.md` 指向的外部系统
- 至少包含：
  - 项目一句话说明
  - 第一次进入项目的阅读顺序
  - 核心事实来源索引（产品 / 架构 / 工程 / 质量 / 外部参考）
  - 常用命令（从 package.json 提取，不发明）
  - 高风险区域 / 禁止事项
  - work/ 与 harness/ 的使用边界

## 2. `CLAUDE.md`

要求：
- 极薄（20 行以内）
- 不重复 `AGENTS.md` 正文
- 使用 `@path` 导入关键文件
- 明确 Claude Code 进入后应先读：
  - `@AGENTS.md`
  - `@harness/workflow.md`
  - `@harness/docs/engineering/commands.md`
- 尚未生成的文件不要引用，只引用本步已生成的文件和已确认存在的文件

## 3. 产品文档（如盘点发现缺失）

- `harness/docs/product/overview.md`
  内容：项目一句话定位 + 核心用户场景（3-5 个）

- `harness/docs/product/domains.md`（核心业务域）
  内容：
  - 列出项目的 3-7 个核心业务域（例如电商有商品域、购物车域、支付域、履约域）
  - 每个域的职责：拥有什么数据、暴露什么能力、对应哪些代码模块
  - 域间数据流图：数据如何从一个域流向下一个域
  - 域边界：什么逻辑属于这个域，什么不属于
  - 这是架构决策和影响范围判断的基础，必须从代码事实中提炼

- `harness/docs/product/key-flows.md`（核心业务流程）
  内容：
  - 定义 1-3 条**核心端到端路径**（Golden Path）——这些路径跨越多个业务域，是产品最基本的价值链
  - 每条路径写清：起点 → 经过哪些域 → 每步的输入输出 → 终点
  - 标注哪些路径是"必须永远工作的"（打破 = 严重回归）
  - 这些核心路径将被 QA 角色用作**交付前的最小验证基准**
  - 每条路径用表格格式定义步骤：`| # | 操作 | 页面/URL | 预期结果 |`
    表格不绑定任何特定浏览器工具（不写 browser_click 等），纯业务语言描述操作和预期
    QA 验证时根据当前可用的浏览器工具（/chrome / Playwright MCP / browser-use / cursor-ide-browser）自动执行
  - 对每条核心路径，标注验证方式优先级：
    1. 浏览器工具自动执行（如可用）
    2. API 级冒烟测试（如有）
    3. 手动走查步骤（兜底）

- 不确定内容标记 `TODO: needs input`
- 不要复制 README 正文，只提炼 AI 工作时真正需要的产品上下文

## 4. 外部参考索引

- `harness/docs/references/index.md`
  包含：官方资源 + 技术栈文档链接 + 仓库内文档目录索引
  一个文件即可，不单独拆分 component-library-index / external-docs-index

每条记录格式：
- 文档名 | 链接 | 适用场景 | 是否权威来源 | 注意事项

输出顺序：
1. `AGENTS.md`
2. `CLAUDE.md`
3. product 文档（如需要）
4. references 索引
