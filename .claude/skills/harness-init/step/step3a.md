请基于当前仓库中的真实脚本和配置，生成文件：

`harness/docs/engineering/commands.md`

要求：
- 只列出当前仓库真实存在、或根据现有配置显然可执行的命令
- 不允许发明命令
- 如果某类命令缺失，写 `TODO: needs input`
- 尽量按"场景"组织，而不是按工具名堆砌

至少包含以下部分：

1. Setup / Install
2. Dev
3. Lint / Typecheck
4. Unit Test
5. Integration / E2E / Smoke
6. Build
7. Local Verification Flow
8. 一键检查命令
   给出将已有 lint / test / type-check / build 命令组合为单条命令行的写法
   不创建新的脚本文件
9. Troubleshooting Hints

请直接输出完整文件内容。
