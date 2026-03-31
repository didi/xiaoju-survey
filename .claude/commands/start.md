启动一个新需求的交付流程。

用法：`/start <需求简短描述>`（如：`/start 新增业务域的xx逻辑`）

请按以下步骤执行：

## 1. 确认需求描述

如果用户提供了 Cooper 文档 ID，先通过 cooper skill 拉取内容写入 work/requests/；总结需求描述，用于文件名。

## 2. 创建计划文件

在 `harness/plans/active/` 创建计划文件，命名格式：`YYYY-MM-DD-<简短描述>.md`（今天日期 + 需求描述，空格换连字符）

内容模板：
```markdown
# <需求名称>

## 目标
TODO: 填写需求目标

## 范围
TODO: 填写涉及的模块/文件

## 任务拆解
- [ ] 创建 PRD（work/requests/）
- [ ] 生成技术方案（work/specs/）
- [ ] 任务拆解（work/tasks/）
- [ ] 实现
- [ ] 自验证（work/evals/）
- [ ] 知识回灌（harness/docs/）
- [ ] 计划归档

## 状态
🟡 进行中

## 关联文件
- PRD: `work/requests/YYYY-MM-DD-<描述>-prd.md`（待创建）
- 技术方案: （待创建）
- 任务清单: （待创建）
```

## 3. 更新 harness/plans/active/README.md

将"当前默认任务"指向刚创建的计划文件：

```markdown
## 当前默认任务

[<需求名称>](YYYY-MM-DD-<简短描述>.md)
```

## 4. 创建 PRD 文件

读取 `work/requests/REQUEST_TEMPLATE.md`，在 `work/requests/` 创建 PRD 文件：
命名：`YYYY-MM-DD-<简短描述>-prd.md`

PRD 初始内容基于模板，填入已知信息，其余留 TODO。

## 5. 输出提示

```
### 需求已启动

**计划文件：** harness/plans/active/YYYY-MM-DD-<描述>.md
**PRD 文件：** work/requests/YYYY-MM-DD-<描述>-prd.md

下一步：
1. 补充 PRD 中的 TODO 项
2. PRD 确认后，运行 prd-to-spec skill 生成技术方案（如已安装）
   或手动在 work/specs/ 创建技术方案文件
```
