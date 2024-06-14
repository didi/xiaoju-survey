<template>

  <div class="list-wrapper" v-if="total">
    <el-table v-if="total"
     ref="multipleListTable"
      class="list-table" 
      :data="dataList" 
      empty-text="暂无数据" 
      row-key="_id"
      header-row-class-name="tableview-header" 
      row-class-name="tableview-row" 
      cell-class-name="tableview-cell"
      style="width: 100%" 
      v-loading="loading">
      <el-table-column 
      v-for="field in fieldList" 
      :key="field.key" 
      :prop="field.key" 
      :label="field.title"
      :width="field.width" 
      class-name="link">
      </el-table-column>
      <el-table-column 
      label="操作" 
      width="200">
        <template v-slot="{ row }">
          <el-button 
          type="text" 
          size="small" 
          @click="handleDownload(row)">
            下载
          </el-button>
          <el-button 
          type="text" 
          size="small" 
          @click="openDeleteDialog(row)">
            删除
          </el-button>
          <el-dialog 
          v-model="centerDialogVisible" 
          title="Warning" 
          width="500" 
          align-center>
            <span>确认删除文件吗？</span>
            <template #footer>
              <div class="dialog-footer">
                <el-button 
                @click="centerDialogVisible = false">
                取消
              </el-button>
                <el-button 
                type="primary" 
                @click=confirmDelete>
                  确认
                </el-button>
              </div>
            </template>
          </el-dialog>
        </template>
            </el-table-column>
          </el-table>
          <div class="small-text">文件有效期为十天，过期或删除将从下载页面移除，请及时下载.</div>
          <div class="list-pagination" v-if="total">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="total"
                @current-change="handleCurrentChange"
              >
              </el-pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, unref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { get, map } from 'lodash-es'

import { ElMessage, ElMessageBox } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'
import 'element-plus/theme-chalk/src/message-box.scss'

import moment from 'moment'
// 引入中文
import 'moment/locale/zh-cn'
// 设置中文
moment.locale('zh-cn')

import EmptyIndex from '@/management/components/EmptyIndex.vue'
import { CODE_MAP } from '@/management/api/base'
import { QOP_MAP } from '@/management/utils/constant'
import { deleteSurvey } from '@/management/api/survey'
import { SurveyPermissions } from '@/management/utils/types/workSpace'
import { deleteDownloadFile, getDownloadFileByName } from '@/management/api/download'
import axios from 'axios'

interface DownloadItem {
  downloadTime: number; // 根据实际情况可能需要调整类型
  [key: string]: any; // 允许其他任意属性
}
const store = useStore()
const router = useRouter()
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  data: {
    type: Array,
    default: () => []
  },
  total: {
    type: Number,
    default: 0
  }
})
const centerDialogVisible = ref(false)
// 下载文件
const handleDownload = async (row: any) => {
  if(row.curStatus == 'removed'){
    ElMessage.error('文件已删除')
    return
  }
  const fileName = row.filename;
  const owner=row.owner
  axios({
  method: 'get',
  url: '/api/survey/surveyDownload/getdownloadfileByName?fileName=' + fileName+'&owner='+owner,
  responseType: 'blob', // 设置响应类型为 Blob
})
  .then((response: { data: BlobPart }) => {

    const blob = new Blob([response.data]);
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName; 

    // 添加到文档中
    document.body.appendChild(link);

    // 模拟点击链接来触发文件下载
    link.click();

    // 清理资源
    window.URL.revokeObjectURL(blobUrl);
  })
  .catch((error: any) => {
    console.error('下载文件时出错:', error);
  });
  // try {
  //   // 获取文件内容
  //   const response = await getDownloadFileByName(fileName);
  //   console.log('Response from server:', response);

  //   // 解析文件名获取 MIME 类型
  //   let mimeType = '';
  //   if (fileName.endsWith('.csv')) {
  //     mimeType = 'text/csv; charset=utf-8'; // 指定编码方式为 UTF-8
  //   } else if (fileName.endsWith('.xls')) {
  //     mimeType = 'application/vnd.ms-excel';
  //   } else if (fileName.endsWith('.xlsx')) {
  //     mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  //   } else {
  //     throw new Error('不支持的文件类型');
  //   }

  //   const blob = new Blob(response.data, { type: mimeType });
  //   console.log('Blob:', blob); // Check the Blob object

  //   const url = window.URL.createObjectURL(blob);
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.download = fileName;
  //   link.click();
  //   window.URL.revokeObjectURL(url);
  //   if (link.parentNode)
  //     link.parentNode.removeChild(link);
  // } catch (error) {
  //   console.error('下载文件时出错:', error);
  // }
}
// 删除文件
const openDeleteDialog = (row: any) => {
  centerDialogVisible.value = true;
  store.dispatch('download/setRow', row)
}
const handleDelete = async (row: any, callback: { (): void; (): void }) => {
  try {
    console.log('Delete file:', row.filename);
    const fileName = row.filename;
    const owner=row.owner
    const response = await deleteDownloadFile(owner,fileName);
    row.curStatus = 'removed';
    if (callback) {
      callback();
    }
  } catch (error) {
    console.error('删除文件时出错:', error);
  }
};
// 确认删除文件
const confirmDelete = () => {
  handleDelete(store.state.download.currentRow, () => {
    centerDialogVisible.value = false;
  });
};

const fields = ['filename', 'fileType', 'fileSize', 'downloadTime', 'curStatus']
const total = computed(() => {
  return props.total
})
const data = computed(() => {
  return props.data
})

const dataList = computed(() => {
  return (data.value as DownloadItem[]).map((item:DownloadItem) => {
    if (typeof item === 'object' && item !== null) {
      return {
        ...item,
      }
    }
  })
})
const fieldList = computed(() => {
  return map(fields, (f) => {
    return get(downloadListConfig, f)
  })
})
const downloadListConfig = {
  filename: {
    title: '文件名称',
    key: 'filename',
    width: 340,
    tip: true
  },
  fileType: {
    title: '格式',
    key: 'fileType',
    width: 200,
    tip: true
  },
  fileSize: {
    title: '预估大小',
    key: 'fileSize',
    width: 140,

  },
  downloadTime: {
    title: '下载时间',
    key: 'downloadTime',
    width: 240
  },
  curStatus: {
    title: '状态',
    key: 'curStatus',
    comp: 'StateModule'
  },
}
const handleCurrentChange = (val: number) => {
  
    const params = {
      pageSize: 15,
      page: val,
      ownerId: store.state.user.userInfo.username
    }
  
  
  store.dispatch('download/getDownloadList', params)
}
</script>


<style lang="scss" scoped>
.question-list-root {
  height: 100%;
  background-color: #f6f7f9;

  .list-wrapper {
    padding: 10px 20px;
    background: #fff;

    .list-table {
      min-height: 620px;

      .cell {
        text-align: center;
      }
    }
    .small-text {
      color: red;
    }
    .list-pagination {
    margin-top: 20px;
    :deep(.el-pagination) {
      display: flex;
      justify-content: flex-end;
    }
  }
  }
}
</style>