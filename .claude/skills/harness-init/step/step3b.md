请基于当前仓库的真实代码、配置和依赖，生成工程知识层文件。

根据项目类型选择生成（前端项目只生成前端相关，后端只生成后端相关，全栈全部生成）：

## 1. `harness/docs/engineering/conventions.md`
通用工程约定：
- 命名约定（从代码目录结构和现有文件名中提取模式）
- 目录组织（从实际目录结构中提取标准结构）
- 代码格式化（从 eslintrc / prettier / tsconfig 中提取真实配置）
- Git 约定（从 .gitignore / husky / lint-staged 中提取）
- 包管理器约定

## 2. `harness/docs/engineering/frontend-guidelines.md`（前端/全栈项目）
前端开发指南：
- 框架版本、构建工具
- 状态管理方案和 Store 组织
- 路由结构
- 样式系统（预处理器、样式隔离、主题机制）
- 如有组件库/物料体系，写清使用约束和扩展规则
- 如有 MPA / 微前端等特殊架构，写清隔离规则和约束

## 3. `harness/docs/engineering/backend-guidelines.md`（后端/全栈项目）
后端开发指南：
- 分层架构（Controller / Service / Repository 等）
- 模块系统和依赖规则
- 数据模型 / Entity / ORM 约定
- 认证鉴权机制
- 配置管理方式
- 测试约定

## 4. `harness/docs/engineering/api-contracts.md`（全栈项目）
前后端接口约定：
- 接口风格（REST / GraphQL / RPC）
- 认证方式
- 请求/响应数据结构约定
- 兼容性原则
- 如有共享 Schema / DTO / 契约层，写清位置和使用方式

## 5. `harness/docs/engineering/component-library.md`（前端/全栈项目，有组件库时）
组件库与物料体系：
- UI 组件库版本、导入方式、使用约束
- 自建组件/物料体系（如有）：目录结构、注册方式、扩展步骤
- 第三方组件清单及用途

## 6. `harness/docs/engineering/pitfalls.md`
已知坑：
- 从 commands.md 的 Troubleshooting 中提炼
- 从代码中明显的"陷阱模式"中提炼（invariants.md 的检查场景在 step4a 生成后再回补）
- 格式：症状 → 根因 → 规避方式

要求：
- 每个文件只写当前仓库真实存在的约定，不发明规则
- 从 eslintrc / tsconfig / vite.config / package.json / 源码目录结构中提取事实
- 不确定的标记 `TODO: needs input`
- 如果某个文件对当前项目不适用，跳过并说明原因
- 注意去重：前端指南中已覆盖的样式内容不要另建 styling-system.md；
  组件库使用指南中已覆盖的链接不要在 references/ 中重复
- 在本步骤输出末尾，汇总所有被跳过的文件及跳过原因，方便 step8 自检时区分"主动跳过"和"遗漏"
