---
name: cooper
description: Interact with Cooper (滴滴内部知识管理平台) - manage knowledge bases, read and edit documents, search content, and query recent resources. Use this skill whenever the user mentions Cooper, 石墨, Shimo, knowledge bases (知识库), or needs to work with Cooper documents/knowledge bases. The skill forwards requests through mcporter to the Cooper MCP server.
metadata:
  {
    "openclaw":
      {
        "emoji": "📄",
        "requires": { "bins": ["mcporter"], "mcpServers": ["Cooper"] },
        "install":
          [
            {
              "id": "node",
              "kind": "node",
              "package": "mcporter",
              "bins": ["mcporter"],
              "label": "Install mcporter (node)",
            },
          ],
      },
  }
---

# Cooper Skill

Interact with Cooper (滴滴内部知识管理平台) through the Cooper MCP server using mcporter as a forwarding layer.

## Core Concepts

Cooper is a collaborative documentation platform (滴滴内部知识管理平台) that provides:
- **Knowledge bases** (知识库) - hierarchical documentation
- **Documents** (文档) - rich text collaborative editing
- **Search** - full-text search across all content
- **Recent resources** - track recently accessed/edited content

## Prerequisites

Before using this skill, ensure:
1. mcporter is installed: `npm install -g mcporter`
2. Cooper MCP server is configured in mcporter (see Configuration below)
3. Authentication is set up with valid token

## Configuration

配置文件位置：`~/.mcporter/mcporter.json`

配置示例文件：`mcporter.json.example`（在本 skill 目录下）

需要添加 `Cooper` 的配置：

```json
{
  "mcpServers": {
    "Cooper": {
      "baseUrl": "<MCP_SERVER_URL>",
      "headers": {
        "Authorization": "Bearer <YOUR_TOKEN>"
      }
    }
  }
}
```

### 配置项说明

| 字段 | 说明 |
|-----|------|
| `baseUrl` | Cooper MCP server 的地址 |
| `headers.Authorization` | 认证 token，**格式必须为 `Bearer <token>`** |

### Token 获取

Token 从 MCP Hub 获取：https://mcphub.intra.xiaojukeji.com/

1. 访问 MCP Hub 网站
2. 登录后获取你的 Token
3. 将 Token 填入配置文件的 `Authorization` 字段，**注意添加 `Bearer ` 前缀**

### 配置示例

```json
{
  "mcpServers": {
    "Cooper": {
      "baseUrl": "http://10.88.128.45/cooper_mcp/mcp",
      "headers": {
        "Authorization": "Bearer your-token-from-mcphub"
      }
    }
  }
}
```

验证配置：
```bash
mcporter list
mcporter config get Cooper
```

## Using mcporter to Call Cooper Tools

All Cooper MCP tools are called through mcporter using this pattern:

```bash
mcporter call Cooper.<tool_name> <param1>=<value1> <param2>=<value2>
```

**IMPORTANT**: Always use the format `Cooper.<tool_name>` (NOT `mcp__Cooper__<tool_name>`). The mcporter CLI maps MCP tools to the `Cooper.` namespace.

For complex parameters (JSON objects, arrays, or strings with spaces), use `--args`:

```bash
mcporter call Cooper.<tool_name> --args '{"param1": "value1", "param2": ["a", "b"]}'
```

Always add `--output json` for machine-readable results:

```bash
mcporter call Cooper.<tool_name> <params> --output json
```

## Cooper MCP Tools Reference

### Knowledge Base Operations

#### List Knowledge Bases
```bash
# List all knowledge bases
mcporter call Cooper.listKnowledgeBases ownType=0 --output json

# ownType: 0=all, 1=owned by me, 2=transferred to me, 3=participating
```

#### Get Knowledge Directory Structure
```bash
# Get all directories with a specific parent expanded
mcporter call Cooper.getKnowledgeDirectory knowledgeId="<id>" parentResourceId="0" type=0 --output json

# Get only direct children of a parent directory
mcporter call Cooper.getKnowledgeDirectory knowledgeId="<id>" parentResourceId="<parent>" type=1 --output json
```

#### Create Knowledge Page
```bash
# Create a new page in a knowledge base
mcporter call Cooper.createKnowledgePage \
  spaceId="<space_id>" \
  name="Page Title" \
  parentId="<parent_page_id>" \
  content="<html_content>" \
  --output json
```

### Document Operations

#### Read Document Content
```bash
# Read Cooper document (appId=2)
mcporter call Cooper.readContent resourceId=<doc_id> appId=2 --output json

# Read knowledge base document (appId=4)
mcporter call Cooper.readContent resourceId=<doc_id> appId=4 --output json
```

### Search and Discovery

#### Search Content
```bash
mcporter call Cooper.search key="<search_term>" --output json
```

#### List Recent Resources
```bash
# Query types:
# 1 = recently visited, 2 = recently edited, 3 = shared with me
# 4 = recently commented/interacted, 5 = recent DC messages

mcporter call Cooper.listRecent queryType=1 pageNum=0 pageSize=33 type="all" --output json
```

## Common Workflows

### Workflow 1: Browse and Read Knowledge Base

```bash
# 1. List available knowledge bases
mcporter call Cooper.listKnowledgeBases ownType=1 --output json

# 2. Get directory structure
mcporter call Cooper.getKnowledgeDirectory knowledgeId="<kb_id>" parentResourceId="0" type=0 --output json

# 3. Read document content
mcporter call Cooper.readContent resourceId=<page_id> appId=4 --output json
```

### Workflow 2: Search and Navigate

```bash
# 1. Search for content
mcporter call Cooper.search key="project update" --output json

# 2. Get recent items
mcporter call Cooper.listRecent queryType=2 pageNum=0 pageSize=20 type="coo_doc" --output json

# 3. Read the found document
mcporter call Cooper.readContent resourceId=<doc_id> appId=2 --output json
```

### Workflow 3: Create Knowledge Page

```bash
# 1. Get parent directory (use root "0" for top-level)
mcporter call Cooper.getKnowledgeDirectory knowledgeId="<space_id>" parentResourceId="0" type=1 --output json

# 2. Create the page
mcporter call Cooper.createKnowledgePage \
  spaceId="<space_id>" \
  name="Meeting Notes" \
  parentId="0" \
  content="<h1>Meeting Notes</h1><p>Discussion points...</p>" \
  --output json
```

## Parameter Guidelines

### Resource IDs
- `resourceId`: Numeric or string ID for documents
- `knowledgeId`/`spaceId`: Knowledge base identifiers
- `parentResourceId`: Directory/page parent (use `"0"` for root)

### Content Format
- `createKnowledgePage.content`: HTML string

## Error Handling

If a call fails:
1. Check if Cooper MCP server is running: `mcporter list`
2. Verify authentication: `mcporter config get Cooper`
3. Check parameter types (IDs should match expected format)

## Tips

- Use `--output json` for all calls to get structured data
- When in doubt, list first (`listKnowledgeBases`, `getKnowledgeDirectory`) to explore structure
- For documents, use `readContent` with correct `appId` (2 for Cooper docs, 4 for knowledge base)
- Search is powerful for finding content across all resources
- Recent queries help track activity and find work-in-progress items
