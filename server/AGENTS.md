# Server 任务指南

先遵循 [根目录任务入口](../AGENTS.md) 和 [贡献与验证要求](../CONTRIBUTING.md)。本目录是 NestJS + TypeORM/MongoDB 服务。

## 找到改动位置

- `src/main.ts`、`src/app.module.ts`：服务启动、模块装配与配置；业务实现位于 `src/modules/<module>/controllers/`、`services/`、`dto/`。
- `survey/` 管理问卷，`surveyResponse/` 处理答卷；`auth/`、`workspace/`、`file/` 等模块承载对应业务。
- `src/guards/`、`src/securityPlugin/`、`src/exceptions/`：鉴权、权限、安全插件和错误响应；`src/models/`、`src/interfaces/`：持久化实体和类型。
- 对照 [服务端 API、数据库和协议文档](../CONTRIBUTING.md#已有文档) 核实输入、输出与兼容性；文档示例不能替代当前控制器、实体及测试。

## 验证要求

- 根目录 `npm run verify:server` 执行后端验证；`npm --prefix server run test:ci` 可单独运行测试。定向示例：`npm --prefix server test -- --runInBand src/modules/workspace/_test/splitMember.spec.ts`。
- 按模块现有目录放置 `*.spec.ts` 回归用例，使用 mock 或隔离的测试数据。覆盖正常路径、无效输入和适用的未登录/无权限路径；记录修复前失败、修复后通过的证据。
- `lint` 不修改源码；仅在有意修复时运行 `lint:fix`。完成后审查 diff 并重跑验证。
- 如需服务/数据库联调，只使用明确隔离的本地或测试环境。`npm --prefix server run local` 可能下载 MongoDB 二进制并启动临时数据库，不属于纯静态验证；先读 [官方快速开始](https://xiaojusurveysrc.didi.cn/docs/next/document/概述/快速开始)。
- `npm --prefix server run test:e2e` 单独运行已有 HTTP 集成用例；它不属于默认 `verify`/CI，运行结果及失败单独记录。不要为了纳入门禁擅自改变鉴权或响应行为。
- Jest 单元测试、HTTP 集成测试、数据库迁移和端到端验收分别报告，不因单元测试通过而宣称后者已通过；说明真实外部依赖是否参与。

## 保持边界

- 未明确授权时，不修改 guard、令牌/密钥机制、响应协议、实体字段、迁移脚本或生产配置来绕过验证失败。
- 不使用生产数据库、真实答卷或密钥；不得把环境文件中的敏感值输出到日志或提交到证据中。数据库清理仅限已确认的临时测试数据。
