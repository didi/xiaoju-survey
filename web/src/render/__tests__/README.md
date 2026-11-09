# C 端单测（SUR-29 / answer-time-limit）

依赖与 `web/vitest.config.ts` 已纳入仓库，请沿用当前配置；不要重新安装测试框架或覆盖配置。完整要求见 [贡献与验证要求](../../../../CONTRIBUTING.md)。

从仓库根目录执行：

```bash
npm run install:ci
npm --prefix web run test:ci
# 聚焦本目录的回归用例
npm --prefix web run test:ci -- src/render/__tests__
# 前端 lint、测试、类型检查和构建
npm run verify:web
```

当前主要用例：

- `answerTimeStore.spec.ts`：答题时间状态（T-FE-R-01 / FR-036 / C-009）。
- `AnswerTimeLimitDialog.spec.ts`：时间限制弹窗（T-FE-R-02 / CL-012 / CL-015）。
- `CountdownHeader.spec.ts`：倒计时与 `visibilitychange` 校准（T-FE-R-03 / CL-013）。
- `answerMinDurationEffective.spec.ts`：最短答题时长的生效边界。
- 设置器的相关测试位于 `src/materials/setters/widgets/__tests__/TimeLimitConfig.spec.ts`，全量前端测试会一并运行。

用例数量以当前运行结果为准，不以本文中的历史数量作验收。Bug 修复记录同一用例修复前的预期失败和修复后的通过；列出完整 SHA、命令、退出码与未运行检查。涉及页面交互时另做隔离环境的编辑、预览和答题联调。
