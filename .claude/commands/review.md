Review 当前变更。

请执行以下检查流程：

## 1. 读取变更范围

运行 `git diff --stat` 和 `git diff`（如有暂存则加 `--cached`），确认本次变更涉及哪些文件和模块。

## 2. Correctness（正确性）

- 逐文件审查变更逻辑，检查是否存在明显 bug、边界条件遗漏、类型错误
- 如涉及异步操作，检查 await / 错误处理是否完整
- 如涉及数据库操作，检查查询条件和字段是否正确

## 3. Risk（风险）

对照 `harness/docs/architecture/invariants.md` 逐条检查：

- INV-01: 是否破坏了保存/发布双表隔离？
- INV-02: 如涉及题型，三处注册是否一致？
- INV-03: 如新增 Entity，是否在 AppModule 注册？
- INV-04: 是否破坏了前端 MPA 入口隔离？
- INV-05: 是否引入了硬编码密钥或连接串？
- 其他涉及的不变量

对照 `harness/docs/architecture/boundaries.md`：
- 变更是否越过了模块边界？（如 surveyResponse 引用了 SurveyConf）
- 变更是否触及了"不应由 agent 随意修改"的区域？

## 4. Consistency（一致性）

- 命名风格是否与周围代码一致？
- 如涉及前端组件，是否遵循现有的物料注册模式？
- 如涉及后端接口，是否遵循现有的 Controller → Service → Entity 分层？
- 如新增环境变量，`docker-compose.yaml` 是否同步？

## 5. Tests（测试）

- 如涉及后端变更，运行 `cd server && npm run test` 确认测试通过
- 如涉及前端变更，运行 `cd web && npm run type-check && npm run lint` 确认无报错
- 如有新增逻辑，是否应补充测试用例？（server 端有 Jest，web 端当前无测试框架）

## 6. 输出

用以下格式输出 review 结果：

```
### Review 结论：PASS / NEEDS ATTENTION / BLOCK

**变更范围：** <涉及的模块和文件数>

**发现项：**
- [severity] 描述（文件:行号）

**不变量检查：** 全部通过 / 以下需要注意：...

**建议：** ...
```

severity 级别：`🔴 block`（必须修复）、`🟡 attention`（建议修复）、`🟢 note`（信息提示）
