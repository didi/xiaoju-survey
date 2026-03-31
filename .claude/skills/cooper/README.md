# Cooper Skill 使用说明

## 功能简介

Cooper skill 让你可以通过自然语言与Cooper进行交互，轻松管理知识库、搜索文档内容、查看最近访问的资源等。

## 核心功能

### 1. 📚 知识库管理
- 列出我的知识库
- 浏览知识库目录结构
- 创建新的知识库页面

### 2. 📄 文档操作
- 读取文档内容
- 支持普通文档和知识库文档

### 3. 🔍 搜索功能
- 全文搜索所有内容
- 快速找到需要的文档

### 4. 📊 最近资源
- 查看最近访问的文档
- 查看最近编辑的文档
- 查看与我分享的文档

## 快速开始

### 配置要求

1. 确保已安装 mcporter：
```bash
npm install -g mcporter
```

2. 配置 Cooper MCP 服务（配置文件：`~/config/mcporter.json`）：
```json
{
  "mcpServers": {
    "Cooper": {
      "baseUrl": "http://10.88.128.45/cooper_mcp/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_TOKEN"
      }
    }
  }
}
```

3. 从 MCP Hub 获取 Token：https://mcphub.intra.xiaojukeji.com/

### 基本用法

只需用自然语言告诉 Claude 你想做什么：

```
用户：列出我的知识库
用户：搜索关于"API文档"的内容
用户：查看我最近访问的文档
用户：读取文档 ID 为 12345 的内容
```

## 常见使用场景

### 场景 1：浏览知识库

```
用户：我有哪些知识库？
Claude：[列出你的所有知识库，包括名称、描述、成员数量等]

用户：打开"个人知识库"
Claude：[显示知识库的目录结构]

用户：读取"欢迎页面"的内容
Claude：[显示页面完整内容]
```

### 场景 2：搜索文档

```
用户：搜索关于"ElasticSearch"的文档
Claude：[显示搜索结果，包含文档名称、描述、链接]

用户：打开第一个结果
Claude：[显示文档内容]
```

### 场景 3：查看最近活动

```
用户：我最近访问了哪些文档？
Claude：[列出最近访问的文档，包括时间、类型、所属空间]

用户：我最近编辑了什么？
Claude：[显示最近编辑的文档列表]
```

### 场景 4：创建文档

```
用户：在"个人知识库"中创建一个新页面"会议记录"
Claude：[创建页面并返回创建结果]

用户：添加一些内容，标题是"项目周会"
Claude：[更新页面内容]
```

## 支持的操作

### 知识库操作
- `listKnowledgeBases` - 列出知识库
- `getKnowledgeDirectory` - 获取知识库目录
- `createKnowledgePage` - 创建知识库页面

### 文档操作
- `readContent` - 读取文档内容

### 搜索和发现
- `search` - 搜索内容
- `listRecent` - 查看最近资源

## 参数说明

### knowledgeId / spaceId
知识库的唯一标识符，通常是数字 ID

### resourceId
文档或页面的唯一标识符

### parentId
父目录 ID，根目录使用 "0"

### appId
- `2` - Cooper 普通文档
- `4` - 知识库文档

### queryType (listRecent)
- `1` - 最近访问
- `2` - 最近编辑
- `3` - 与我分享
- `4` - 最近互动
- `5` - DC 消息

## 使用技巧

1. **先列出，再浏览**：使用 `listKnowledgeBases` 查看所有知识库，然后选择感兴趣的进行浏览

2. **善用搜索**：不确定文档在哪个知识库时，直接搜索关键词

3. **查看最近**：忘记文档位置时，查看最近访问列表快速定位

4. **指定类型**：读取文档时，正确指定 appId（普通文档用 2，知识库用 4）

## 故障排查

### 问题 1：无法连接到 Cooper
- 检查网络连接
- 验证配置文件路径和格式
- 确认 Token 是否有效

### 问题 2：返回 401/403 错误
- Token 可能已过期，重新从 MCP Hub 获取
- 确认 Token 格式为 `Bearer <token>`

### 问题 3：找不到文档
- 检查 resourceId 是否正确
- 确认 appId 参数（2 或 4）
- 验证是否有访问权限

### 问题 4：搜索无结果
- 尝试不同的关键词
- 检查搜索范围和权限
- 使用更通用的搜索词

## 验证配置

```bash
# 查看配置
mcporter config get Cooper

# 测试连接
mcporter call Cooper.listKnowledgeBases ownType=1 --output json
```

## 相关链接

- MCP Hub: https://mcphub.intra.xiaojukeji.com/
- Cooper文档: https://cooper.didichuxing.com/
- 技术支持: 联系 Cooper 团队

## 示例对话

```
用户：帮我找一下关于"搜索优化"的文档

Claude：好的，我来搜索相关文档。
[调用 search 工具搜索"搜索优化"]

找到了 5 个相关文档：

1. **搜索性能优化实践** - 知识库：搜索产品
   描述：介绍搜索系统性能优化的实践方案...

2. **ElasticSearch 调优指南** - 知识库：技术文档
   描述：ES 性能调优的详细说明...

需要我读取某个文档的内容吗？

用户：打开第一个

Claude：[读取并显示文档完整内容]
```

## 注意事项

1. **权限要求**：只能访问有权限的知识库和文档
2. **Token 安全**：妥善保管 Token，不要泄露
3. **网络环境**：需要在内网环境访问
4. **数据修改**：创建操作会真实创建文档，请谨慎操作

---

**更新日期**：2026-03-16
**版本**：1.0
**维护者**：quanfeihu
