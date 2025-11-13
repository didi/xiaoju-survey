<template>
  <div class="version-history-container">
    <div class="version-header">
      <h2>版本历史</h2>
      <el-button
        type="primary"
        size="small"
        @click="handleRefresh"
        :loading="loading"
      >
        刷新
      </el-button>
    </div>

    <el-empty
      v-if="versions.length === 0"
      description="暂无版本历史"
    />

    <el-timeline v-else :reverse="false">
      <el-timeline-item
        v-for="(version, index) in versions"
        :key="version._id"
        :timestamp="formatDate(version.createdAt)"
        placement="top"
        :type="version.isCurrentVersion ? 'success' : 'primary'"
      >
        <div class="version-item">
          <div class="version-header-info">
            <span class="version-number">v{{ version.versionNumber }}</span>
            <span class="version-title">{{ version.title }}</span>
            <el-tag v-if="version.isCurrentVersion" type="success"
              >当前版本</el-tag
            >
            <el-tag
              v-for="tag in version.tags"
              :key="tag"
              type="info"
              size="small"
            >
              {{ tag }}
            </el-tag>
          </div>

          <div class="version-content">
            <p v-if="version.description" class="description">
              <strong>描述:</strong> {{ version.description }}
            </p>
            <p class="changes-summary">
              <strong>变更:</strong> {{ version.changesSummary }}
            </p>
            <p class="creator">
              <strong>编辑者:</strong> {{ version.createdBy }}
            </p>
          </div>

          <div class="version-actions">
            <el-button
              v-if="!version.isCurrentVersion"
              type="primary"
              size="small"
              link
              @click="showRestoreDialog(version)"
            >
              恢复此版本
            </el-button>
            <el-button
              type="primary"
              size="small"
              link
              @click="showCompareDialog(version)"
            >
              对比版本
            </el-button>
            <el-button
              type="primary"
              size="small"
              link
              @click="showDetailDialog(version)"
            >
              查看详情
            </el-button>
            <el-popconfirm
              v-if="!version.isCurrentVersion"
              title="确定要删除此版本吗?"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm="deleteVersion(version._id)"
            >
              <template #reference>
                <el-button type="danger" size="small" link>
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </el-timeline-item>
    </el-timeline>

    <!-- 恢复版本对话框 -->
    <el-dialog
      v-model="restoreDialogVisible"
      title="恢复版本"
      @close="resetRestoreForm"
    >
      <el-form
        ref="restoreFormRef"
        :model="restoreForm"
        label-width="100px"
      >
        <el-form-item label="恢复原因" prop="restoreReason">
          <el-input
            v-model="restoreForm.restoreReason"
            type="textarea"
            rows="4"
            placeholder="请输入恢复此版本的原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="restoreDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="confirmRestore"
          :loading="restoring"
        >
          恢复
        </el-button>
      </template>
    </el-dialog>

    <!-- 对比版本对话框 -->
    <el-dialog
      v-model="compareDialogVisible"
      title="版本对比"
      width="70%"
    >
      <div v-if="compareResult" class="compare-content">
        <div class="compare-header">
          <div class="version-info">
            <h4>版本 {{ compareResult.version1.versionNumber }}</h4>
            <p>{{ formatDate(compareResult.version1.createdAt) }}</p>
            <p>编辑者: {{ compareResult.version1.createdBy }}</p>
          </div>
          <div class="vs">VS</div>
          <div class="version-info">
            <h4>版本 {{ compareResult.version2.versionNumber }}</h4>
            <p>{{ formatDate(compareResult.version2.createdAt) }}</p>
            <p>编辑者: {{ compareResult.version2.createdBy }}</p>
          </div>
        </div>

        <div class="differences">
          <div
            v-for="(diff, index) in compareResult.differences"
            :key="index"
            class="difference-item"
            :class="diff.type"
          >
            <el-tag :type="getDiffTypeColor(diff.type)">
              {{ getDiffTypeLabel(diff.type) }}
            </el-tag>
            <p>{{ diff.description }}</p>
            <div v-if="diff.oldQuestion" class="question-detail">
              <p><strong>旧内容:</strong></p>
              <p>{{ JSON.stringify(diff.oldQuestion, null, 2) }}</p>
            </div>
            <div v-if="diff.newQuestion" class="question-detail">
              <p><strong>新内容:</strong></p>
              <p>{{ JSON.stringify(diff.newQuestion, null, 2) }}</p>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 版本详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="版本详情"
      width="70%"
    >
      <div v-if="selectedVersion" class="version-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="版本号">
            v{{ selectedVersion.versionNumber }}
          </el-descriptions-item>
          <el-descriptions-item label="标题">
            {{ selectedVersion.title }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ formatDate(selectedVersion.createdAt) }}
          </el-descriptions-item>
          <el-descriptions-item label="编辑者">
            {{ selectedVersion.createdBy }}
          </el-descriptions-item>
          <el-descriptions-item label="变更摘要" :span="2">
            {{ selectedVersion.changesSummary }}
          </el-descriptions-item>
          <el-descriptions-item label="描述" :span="2">
            {{ selectedVersion.description }}
          </el-descriptions-item>
          <el-descriptions-item label="标签" :span="2">
            <el-tag
              v-for="tag in selectedVersion.tags"
              :key="tag"
              type="info"
            >
              {{ tag }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <div class="schema-preview">
          <h4>问卷内容预览</h4>
          <div class="schema-code">
            <pre>{{ JSON.stringify(selectedVersion.schema, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import * as versionApi from '@/management/api/version';

const props = defineProps({
  surveyId: {
    type: String,
    required: true,
  },
});

const versions = ref([]);
const loading = ref(false);
const restoreDialogVisible = ref(false);
const compareDialogVisible = ref(false);
const detailDialogVisible = ref(false);
const restoring = ref(false);
const selectedVersion = ref(null);
const compareResult = ref(null);

const restoreForm = reactive({
  versionId: '',
  restoreReason: '',
});

const restoreFormRef = ref(null);

// 加载版本历史
const loadVersionHistory = async () => {
  loading.value = true;
  try {
    const response = await versionApi.getVersionHistory(props.surveyId);
    versions.value = response.data || [];
  } catch (error) {
    ElMessage.error('加载版本历史失败: ' + error.message);
  } finally {
    loading.value = false;
  }
};

// 刷新版本历史
const handleRefresh = () => {
  loadVersionHistory();
};

// 显示恢复对话框
const showRestoreDialog = (version) => {
  restoreForm.versionId = version._id;
  restoreForm.restoreReason = '';
  restoreDialogVisible.value = true;
};

// 确认恢复
const confirmRestore = async () => {
  if (!restoreForm.restoreReason.trim()) {
    ElMessage.warning('请输入恢复原因');
    return;
  }

  restoring.value = true;
  try {
    await versionApi.restoreVersion(props.surveyId, {
      versionId: restoreForm.versionId,
      restoreReason: restoreForm.restoreReason,
    });
    ElMessage.success('版本恢复成功');
    restoreDialogVisible.value = false;
    loadVersionHistory();
  } catch (error) {
    ElMessage.error('版本恢复失败: ' + error.message);
  } finally {
    restoring.value = false;
  }
};

// 显示对比对话框
const showCompareDialog = async (version) => {
  if (versions.value.length < 2) {
    ElMessage.warning('需要至少两个版本才能对比');
    return;
  }

  const latestVersion = versions.value[0];
  try {
    const response = await versionApi.compareVersions(props.surveyId, {
      versionId1: version._id,
      versionId2: latestVersion._id,
    });
    compareResult.value = response.data;
    compareDialogVisible.value = true;
  } catch (error) {
    ElMessage.error('获取版本对比失败: ' + error.message);
  }
};

// 显示详情对话框
const showDetailDialog = (version) => {
  selectedVersion.value = version;
  detailDialogVisible.value = true;
};

// 删除版本
const deleteVersion = async (versionId) => {
  try {
    await versionApi.deleteVersion(props.surveyId, versionId);
    ElMessage.success('版本已删除');
    loadVersionHistory();
  } catch (error) {
    ElMessage.error('删除版本失败: ' + error.message);
  }
};

// 格式化日期
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleString('zh-CN');
};

// 获取差异类型的颜色
const getDiffTypeColor = (type) => {
  const colors = {
    added: 'success',
    deleted: 'danger',
    modified: 'warning',
  };
  return colors[type] || 'info';
};

// 获取差异类型的标签
const getDiffTypeLabel = (type) => {
  const labels = {
    added: '新增',
    deleted: '删除',
    modified: '修改',
  };
  return labels[type] || '未知';
};

// 重置恢复表单
const resetRestoreForm = () => {
  restoreForm.versionId = '';
  restoreForm.restoreReason = '';
};

onMounted(() => {
  loadVersionHistory();
});
</script>

<style scoped lang="scss">
.version-history-container {
  padding: 20px;
  background: #f5f7fa;
  border-radius: 4px;

  .version-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
  }

  .version-item {
    background: white;
    padding: 16px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .version-header-info {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;

      .version-number {
        font-weight: 600;
        color: #409eff;
        font-size: 14px;
      }

      .version-title {
        font-weight: 500;
        font-size: 14px;
      }
    }

    .version-content {
      margin: 12px 0;
      font-size: 13px;
      color: #606266;

      p {
        margin: 6px 0;
      }

      .description,
      .changes-summary,
      .creator {
        margin: 8px 0;
      }
    }

    .version-actions {
      display: flex;
      gap: 8px;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #ebeef5;
    }
  }

  .compare-content {
    .compare-header {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 20px;
      padding: 16px;
      background: #f5f7fa;
      border-radius: 4px;

      .version-info {
        flex: 1;

        h4 {
          margin: 0 0 8px 0;
          font-size: 14px;
          font-weight: 600;
        }

        p {
          margin: 4px 0;
          font-size: 12px;
          color: #606266;
        }
      }

      .vs {
        font-size: 18px;
        font-weight: 600;
        color: #909399;
      }
    }

    .differences {
      .difference-item {
        padding: 12px;
        margin-bottom: 12px;
        border-left: 4px solid #409eff;
        background: white;
        border-radius: 4px;

        &.added {
          border-left-color: #67c23a;
        }

        &.deleted {
          border-left-color: #f56c6c;
        }

        &.modified {
          border-left-color: #e6a23c;
        }

        p {
          margin: 6px 0;
          font-size: 13px;
        }

        .question-detail {
          margin: 8px 0;
          padding: 8px;
          background: #f5f7fa;
          border-radius: 4px;
          font-size: 12px;

          pre {
            margin: 0;
            white-space: pre-wrap;
            word-wrap: break-word;
          }
        }
      }
    }
  }

  .version-detail {
    .schema-preview {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #ebeef5;

      h4 {
        margin-bottom: 12px;
      }

      .schema-code {
        background: #f5f7fa;
        padding: 12px;
        border-radius: 4px;
        max-height: 400px;
        overflow-y: auto;

        pre {
          margin: 0;
          font-size: 12px;
          line-height: 1.5;
          color: #606266;
        }
      }
    }
  }
}
</style>
