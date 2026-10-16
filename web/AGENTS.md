# Web 任务指南

先遵循 [根目录任务入口](../AGENTS.md) 和 [贡献与验证要求](../CONTRIBUTING.md)。本目录是 Vue 3 + Vite 的管理端/投放端工程。

## 找到改动位置

- `src/management/`：管理端页面、接口、路由和 Pinia 状态；编辑问卷先查 `pages/edit/`、`stores/edit.ts` 及 `config/`。
- `src/render/`：答题端页面、接口、状态与协议适配；管理端预览同样使用 render 入口。
- `src/materials/questions/` 与 `src/materials/setters/`：题型渲染和设置器。改题型时同时检查管理端设置、预览和答题端效果。
- `src/common/logicEngine/`：跳转/显示等逻辑；跨端字段定义应核对 [官方协议与架构入口](../CONTRIBUTING.md#已有文档)。

## 验证要求

- 根目录 `npm run verify:web` 执行前端验证；`npm --prefix web run test:ci` 可单独运行测试，`npm --prefix web run test:ci -- src/render/__tests__/answerTimeStore.spec.ts` 是定向测试示例。
- 使用已提交的 `vitest.config.ts` 和锁文件，不重复安装一套测试依赖或覆盖配置。测试放在相关模块附近，参考 [答题端用例](src/render/__tests__/README.md)。
- `npm --prefix web run build` 包含类型检查和构建；仅运行 `build-only` 不能替代完整构建验证。`lint` 不修复文件，需要修复时显式运行 `lint:fix` 并审查 diff。
- 对交互变化，用合成问卷验证受影响的管理端编辑/保存、预览、答题/提交流程；覆盖重复点击、异常响应、返回/刷新以及适用的移动端布局。记录浏览器、步骤、结果及脱敏截图；未执行就明确写出。
- 修复逻辑、计时或状态问题时加入边界/回归用例，明确修复前后的结果；单元测试不能替代浏览器联调。

## 保持边界

- 不为通过检查放宽类型、删除断言或全局屏蔽规则。构建产物、自动生成文件的意外变化要检查，不夹带到功能提交。
- 不擅自更改 API 契约、问卷字段/默认值、权限或提交语义；涉及服务端契约时同步检查对应模块并请求必要授权。
