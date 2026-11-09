# 贡献与验证要求

本指南补充仓库内的执行和验收要求；产品说明、设计原理及部署手册继续使用 [官方文档](https://xiaojusurvey.didi.cn/)，无需复制一套平行文档。请同时遵守 [行为准则](CODE_OF_CONDUCT.md) 和 [许可证](LICENSE)。

## 已有文档

- [贡献流程](https://xiaojusurvey.didi.cn/docs/next/share/贡献流程)：分支、Issue、commit 和 PR 约定。
- [快速开始](https://xiaojusurvey.didi.cn/docs/next/document/概述/快速开始)、[工程结构](https://xiaojusurvey.didi.cn/docs/next/document/开发手册/工程结构)、[架构](https://xiaojusurvey.didi.cn/docs/next/document/设计原理/架构)：本地运行与模块背景。
- [服务端 API](https://xiaojusurvey.didi.cn/docs/next/api/服务端API)、[问卷 Meta 协议](https://xiaojusurvey.didi.cn/docs/next/agreement/《问卷Meta协议》)、[数据库](https://xiaojusurvey.didi.cn/docs/next/document/概述/数据库)：接口与数据契约。

官方 `next` 文档与仓库提交可能不同步。改动前对照当前源码、配置和测试，遇到差异在 PR 中说明，不直接据旧示例改写现有契约。

## 开始贡献

1. 按官方流程先 fork 工程，同步主仓库最新 `develop`，再从 fork 的 `develop` 创建独立改动分支；PR 目标为主仓库 `develop`。已有工作区先检查 `git status --short`，不要覆盖他人的修改。
2. 一个 PR 聚焦一个问题；较大改动先建 Issue 说明范围、风险与验收条件。提交说明使用官方约定的 `<type>: <description>`；PR 标题沿用 `[Feature]: xxx`（功能/优化）或 `[Fix]: xxx`（修复），正文保留改动原因、改动内容、改动验证和 Issue。
3. Agent 辅助开发先读 [AGENTS.md](AGENTS.md) 及对应的 [web](web/AGENTS.md) / [server](server/AGENTS.md) 指南。人工贡献同样需要下面的可复现证据。

## 验证入口

从仓库根目录执行。最低兼容版本为 **Node 18.20.8**；Node 20 系列从 **20.20.2** 起验证，`.nvmrc` 保留 Node 20.20.2 作为开发默认版本。npm 固定为根 `package.json` 的 `packageManager` 所示 **10.9.9**（Node 18 自带的 npm 10.8.2 需先升级）。CI 使用 Node 18.20.8、20.20.2、22.x、24.x 矩阵验证前后端单元测试与构建，lint 和覆盖率使用 `.nvmrc` 的默认版本。记录每次实际的 `node --version`、`npm --version`；这里不保证更早的 Node 18/20 小版本、奇数主版本或未来主版本均已验证。

Node 18 和 Node 20 已进入 [官方 EOL 阶段](https://nodejs.org/en/about/previous-releases)。保留兼容性不等于它们仍获得上游安全维护。现有 Docker 运行时保留 Node 18，见下方镜像验证范围；后续升级仍需单独评审。

为保持 Node 18/20 安装兼容，前端固定 `element-plus@2.14.5`（依赖 VueUse 14）和 `@vue/test-utils@2.4.11`（依赖 js-beautify 1）；后续版本分别引入了要求 Node 22 的 VueUse 15 和 nopt 10 / abbrev 5。更新这些版本或锁文件前，须重新通过最低版本的严格安装和完整 CI 矩阵，同时评估被暂缓版本的修复与安全影响；不能使用忽略 engines 的参数或改写第三方 engines 声明绕过验证。

锁文件中的 Rollup 可选包 `@napi-rs/lzma-linux-x64-gnu` 仅供其上游跨平台编译工具使用，Node 18/20 的 npm 会按该包的 engines 正常跳过安装；Rollup 的实际平台绑定仍正常安装。不要全局省略 optional 依赖来绕过检查，也不要据此声称锁文件中每个可选包都支持 Node 18/20。

```bash
node --version
npm --version
npm run install:ci
npm run verify
```

- `install:ci` 使用前后端各自提交的锁文件执行 `npm ci`。根目录、`web/`、`server/` 的项目级 `.npmrc` 统一设置 `engine-strict=true`，本地与 CI 均严格检查依赖的 Node/npm 要求，无需重复命令行参数。三个目录是独立 npm 项目；直接进入子目录或使用 `npm --prefix` 时，项目级配置取自目标项目，不自动继承根目录配置，因此三处均保留同一策略，不修改用户级/全局配置。不要为通过安装删除锁文件或临时执行 `npm install` 改变依赖树；需要更新依赖时说明原因并评审 manifest/lockfile 差异。
- `verify` 是统一入口；`verify:web`、`verify:server` 可分别定位问题。各项以根目录和子项目 `package.json` 中的 scripts 为准。
- 前端验证覆盖 lint、现有 Vitest 测试和 build（含类型检查），后端覆盖 lint、Jest 单元测试和 build。单独跑测试使用 `npm --prefix web run test:ci`、`npm --prefix server run test:ci`；前端沿用已提交的 `web/vitest.config.ts`，不重新安装测试框架或覆盖配置。
- `lint` 只检查；`lint:fix` 是显式修复操作。构建可能生成产物，结束后用 `git status --short`、`git diff --check` 检查意外修改，不提交无关产物。
- 聚合命令在首个失败处停止。逐项记录已执行/失败/未执行状态，必要时单独运行后续检查获取完整诊断；不能把未运行项标记为通过。
- CI 与本地使用相同的分项检查，本地 `verify` 将这些检查顺序聚合。完整验证仍不等于浏览器端到端、数据库迁移、性能或生产部署已验证；涉及这些行为时补充相应隔离环境测试。
- 后端 `npm --prefix server run test:e2e` 是单独的诊断入口，未纳入默认 `verify`/CI；其结果与单元测试分开报告。不能据默认门禁通过宣称已有 HTTP 集成用例也通过。
- 纯文档改动至少检查链接、路径、示例命令与 `git diff --check`；未运行应用验证时说明理由，不能写“全部检查通过”。

## Node 18 镜像验证

`Dockerfile` 和 `Dockerfile.full` 分别固定使用 Node 18.20.8 的 Bookworm slim/完整变体；构建阶段和运行阶段均安装 npm 10.9.9。构建上下文保留前后端锁文件和项目 `.npmrc`，使用 `npm ci` 严格安装，避免浮动依赖重新解析后意外要求更高版本 Node。镜像基础标签仍可能收到重建，系统 apt 包也未逐项固定，因此这不是所有镜像层的位级可复现保证。

`Docker Compatibility` 工作流在 Linux amd64 上分别构建两个完整镜像，不推送镜像或部署。它使用仅含合成服务端环境配置的临时构建上下文、隔离的内部网络和临时 MongoDB 4.4.29，检查镜像 Node/npm 与严格配置、nginx 静态页面、未登录 API 响应及验证码数据库写入；容器和临时数据在结束后删除。该冒烟测试不替代浏览器完整业务流程、现有 HTTP E2E 用例或生产验收，也不验证其他 CPU 架构。

现有 `docker-compose.yaml` 仍引用已发布镜像，不能用它代表当前源码镜像已验证。本次不改变生产环境文件、数据库或启动协议；如需回滚，由维护者使用之前的镜像/提交，不自动执行部署。

## 复现和验收证据

Bug 修复先保留最小复现步骤/输入和预期结果，优先编写回归测试；当前工具缺失的模块要明确缺口并提供手工复现证据。用同一用例对比修复前后的行为：旧实现出现预期错误（自动化测试对应断言失败），新实现通过；环境、安装或超时故障不算有效的失败前证据。新增功能给出验收用例；文档/构建类改动说明适用的检查，确实不适用的项目写明原因。

每次交付和 PR 使用 [验收模板](.github/PULL_REQUEST_TEMPLATE.md)，至少记录：

- 实际基线分支及完整 SHA、被验证的完整提交 SHA。未提交的本地结果写“基线 SHA + 未提交 diff”，不可冒充该 SHA 已包含修改；提交后再验证最终版本。
- 精确命令、执行目录、Node/npm/OS 版本、退出码、测试统计及关键日志。按通过、失败、未运行区分，保留 CI run 或脱敏日志的位置。
- 修复前失败/修复后通过的复现与回归结果；相关 UI/API 手工检查的步骤和结果。
- 原有失败与本次引入失败的区分依据。无法在同一环境验证基线时，写明“来源未确认”，不要推断所有失败都与本次无关。
- 未运行的检查、具体阻碍、影响和下一步；代码、依赖或冲突解决发生变化后重跑受影响检查。

可用 `git rev-parse HEAD` 获取当前提交、`git rev-parse <upstream>/develop` 记录已同步的上游基线；将 `<upstream>` 替换为指向主仓库的实际 remote，不假设 fork 的 `origin` 就是主仓库。工作区状态另附 `git status --short`，推送后的 CI 也须匹配最终 SHA。

## 风险与交接

- 测试数据使用合成或脱敏样本，不连接生产服务，不提交生产数据、真实用户信息、密钥、令牌或包含敏感值的日志/截图。
- 鉴权/权限、加密、API/问卷协议、数据库实体或迁移、生产运行时/部署、分支保护的变更需显式列明范围、兼容性和回滚方式，交由人工评审；不要夹带到验证或文档维护任务中。
- 不通过删测试、降低断言、扩大忽略范围或将失败改为成功来规避检查。发现超出任务范围的基线问题时，独立记录并交接。
- 提交与发布权限分开：没有明确授权就不推送、创建 PR、合并或部署。合并、发布及上线由维护者人工决定；CLA 等协议由贡献者本人确认。
