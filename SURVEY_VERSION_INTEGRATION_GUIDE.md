# 问卷版本控制功能集成指南

## 📋 功能概述

问卷版本控制是一个完整的版本管理系统，允许用户：
- 自动保存问卷编辑历史
- 查看所有版本的修改记录
- 对比两个版本之间的差异
- 恢复到任意历史版本
- 为版本添加标签和描述

## 🚀 后端集成步骤

### 1. 注册模块和服务

在 `server/src/modules/survey/survey.module.ts` 中添加：

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyVersionService } from './services/surveyVersion.service';
import { SurveyVersionController } from './controllers/surveyVersion.controller';
import { SurveyVersion } from 'src/models/surveyVersion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SurveyVersion, SurveyConf, SurveyMeta]),
    // ... other imports
  ],
  providers: [SurveyVersionService, /* ... other services ... */],
  controllers: [
    SurveyVersionController,
    // ... other controllers
  ],
})
export class SurveyModule {}
```

### 2. 在 SurveyConf 服务中集成自动版本保存

在 `surveyConf.service.ts` 的 `saveSurveyConf` 方法中添加：

```typescript
async saveSurveyConf(params: {
  surveyId: string;
  schema: SurveySchemaInterface;
  changesSummary?: string;
  createdBy?: string;
  createdById?: string;
}) {
  const codeInfo = await this.getSurveyConfBySurveyId(params.surveyId);
  if (!codeInfo) {
    throw new SurveyNotFoundException('问卷配置不存在');
  }
  
  codeInfo.code = params.schema;
  await this.surveyConfRepository.save(codeInfo);

  // 自动创建版本
  if (params.createdBy && params.createdById) {
    await this.surveyVersionService.autoSaveVersion({
      surveyId: params.surveyId,
      schema: params.schema,
      createdBy: params.createdBy,
      createdById: params.createdById,
      changesSummary: params.changesSummary || '问卷编辑',
    });
  }
}
```

### 3. 更新现有的保存问卷接口

在 `survey.controller.ts` 中修改保存问卷的端点：

```typescript
@Post('saveConf/:surveyId')
@UseGuards(AuthenticationGuard, SurveyGuard)
async saveConf(
  @Param('surveyId') surveyId: string,
  @Body() body: { schema: SurveySchemaInterface; changesSummary?: string },
  @Req() req,
) {
  await this.surveyConfService.saveSurveyConf({
    surveyId,
    schema: body.schema,
    changesSummary: body.changesSummary || '编辑问卷',
    createdBy: req.user.username,
    createdById: req.user.userId,
  });
  
  return { code: 0, message: '保存成功' };
}
```

## 🎨 前端集成步骤

### 1. 在编辑页面集成版本历史组件

在 `web/src/management/pages/edit/index.vue` 中添加：

```vue
<template>
  <div class="edit-container">
    <!-- 编辑器 -->
    <div class="editor-panel">
      <!-- 你的编辑器代码 -->
    </div>

    <!-- 版本历史面板 -->
    <div class="version-panel">
      <VersionHistory :surveyId="surveyId" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import VersionHistory from '@/management/components/VersionHistory.vue';

const surveyId = ref('');

onMounted(() => {
  // 从路由或其他地方获取 surveyId
  surveyId.value = route.params.surveyId;
});
</script>

<style scoped>
.edit-container {
  display: flex;
  gap: 20px;
  padding: 20px;
}

.editor-panel {
  flex: 1;
}

.version-panel {
  width: 400px;
  overflow-y: auto;
  max-height: 80vh;
}
</style>
```

### 2. 在编辑器中添加自动保存版本的功能

修改编辑器的保存逻辑：

```javascript
// 在 useQuestionInfo.js 或相关的编辑 hook 中
import * as versionApi from '@/management/api/version';

export function useAutoSaveVersion() {
  const saveWithVersion = async (schema, changesSummary = '自动保存') => {
    try {
      // 先保存问卷
      await saveSurvey({ schema });
      
      // 然后创建版本
      await versionApi.createVersion(surveyId.value, {
        changesSummary,
        schema,
      });
      
      message.success('已保存');
    } catch (error) {
      message.error('保存失败: ' + error.message);
    }
  };

  return { saveWithVersion };
}
```

## 📝 API 端点文档

### 获取版本历史
```
GET /api/survey/version/history/:surveyId
返回: Array<VersionInfo>
```

### 获取版本详情
```
GET /api/survey/version/detail/:versionId
返回: VersionDetail
```

### 创建新版本
```
POST /api/survey/version/create/:surveyId
请求体:
{
  "schema": SurveySchemaInterface,
  "changesSummary": string,
  "description": string,
  "tags": string[]
}
返回: VersionDetail
```

### 恢复版本
```
POST /api/survey/version/restore/:surveyId
请求体:
{
  "versionId": string,
  "restoreReason": string
}
返回: { backupVersion, restoredVersion, message }
```

### 对比版本
```
POST /api/survey/version/compare/:surveyId
请求体:
{
  "versionId1": string,
  "versionId2": string
}
返回: { version1, version2, differences }
```

### 标记版本
```
POST /api/survey/version/tag/:surveyId/:versionId
请求体:
{
  "tag": string
}
返回: VersionDetail
```

### 删除版本
```
POST /api/survey/version/delete/:surveyId/:versionId
返回: { message: '版本已删除' }
```

### 获取版本统计
```
GET /api/survey/version/stats/:surveyId
返回: {
  totalVersions: number,
  currentVersion: number,
  oldestVersion: number,
  contributors: string[],
  lastModified: Date
}
```

## 🗄️ 数据库迁移

如果你需要为现有问卷生成版本历史，可以运行以下迁移脚本：

```typescript
// server/src/database/migrations/CreateInitialVersions.ts
import { Migration } from 'typeorm';

export class CreateInitialVersions implements Migration {
  async up(queryRunner) {
    // 为每个现存问卷创建初始版本
    const surveys = await queryRunner.query('SELECT * FROM surveyConf');
    
    for (const survey of surveys) {
      const surveyMeta = await queryRunner.query(
        'SELECT * FROM surveyMeta WHERE _id = ?',
        [survey.pageId]
      );

      if (surveyMeta && surveyMeta.length > 0) {
        await queryRunner.query(
          'INSERT INTO surveyVersion (surveyId, versionNumber, schema, title, createdBy, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
          [
            survey.pageId,
            1,
            survey.code,
            surveyMeta[0].title,
            surveyMeta[0].creator,
            new Date(),
          ]
        );
      }
    }
  }

  async down(queryRunner) {
    // 回滚逻辑
  }
}
```

## 🧪 测试用例

### 后端测试
```typescript
// server/src/modules/survey/__test__/surveyVersion.service.spec.ts
describe('SurveyVersionService', () => {
  let service: SurveyVersionService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [SurveyVersionService],
    }).compile();
    service = module.get<SurveyVersionService>(SurveyVersionService);
  });

  it('应该创建新版本', async () => {
    const result = await service.createVersion({
      surveyId: 'test-id',
      schema: { /* mock schema */ },
      title: '测试问卷',
      createdBy: 'test-user',
      createdById: 'user-123',
    });
    
    expect(result.versionNumber).toBe(1);
    expect(result.isCurrentVersion).toBe(true);
  });

  it('应该能够恢复版本', async () => {
    // 测试代码...
  });

  it('应该能够对比版本', async () => {
    // 测试代码...
  });
});
```

## 🔒 权限控制

当前实现使用 `SurveyGuard` 来检查用户是否有权限操作问卷。确保用户有以下权限：
- 查看问卷 → 可以查看版本历史
- 编辑问卷 → 可以创建版本
- 是问卷所有者或协作者 → 可以恢复版本

## 🐛 常见问题

### Q: 如何禁用自动版本保存？
A: 在 `SurveyConfService.saveSurveyConf` 中注释掉版本创建代码，或添加一个配置选项。

### Q: 版本号会重复吗？
A: 不会。每次创建版本时，系统会查询最新的版本号并递增。

### Q: 可以无限制地保存版本吗？
A: 建议添加一个数据库索引和清理策略来管理旧版本。可以添加一个定期清理任务。

### Q: 如何修改版本的描述？
A: 当前实现不支持编辑已创建的版本。如需要，可以在 `SurveyVersionService` 中添加 `updateVersion` 方法。

## 📚 扩展功能建议

1. **版本标签** - 为版本添加自定义标签（如 "发布版本"、"草稿"）
2. **批量操作** - 支持批量删除旧版本
3. **版本注释** - 允许团队成员在版本上添加评论
4. **版本搜索** - 按日期范围、编辑者、标签搜索版本
5. **版本导出** - 将版本历史导出为 PDF 或 Excel
6. **自动清理** - 定期删除超过 N 天的旧版本（可配置）

