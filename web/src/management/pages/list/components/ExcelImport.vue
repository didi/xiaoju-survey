<template>
  <el-dialog
    class="base-dialog-root"
    :model-value="visible"
    width="40%"
    title="Excel导入"
    @close="handleClose"
    :close-on-click-modal="false"
  >    
    <div class="excel-import-content">
      <!-- 第一步：下载Excel模版 -->
      <div class="step-container">
        <div class="step-header">   
          <div class="step-number-icon-container">
              <i class="iconfont icon-xuhao1 step-number-icon"></i>
          </div>
          <span class="step-title">下载Excel模版，按照模版格式要求在Excel中编辑题目</span>
        </div>
        <div class="step-body1">
          <a href="/public/excel_survey_template.xlsx" download="Excel导入模板.xlsx" class="download-link">
            <el-button type="primary" class="download-button">
              <i class="iconfont icon-xiazai button-icon"></i>
              <span class="download-button-text">下载Excel模版</span>
            </el-button>
          </a>
        </div>
      </div>
    
      <!-- 第二步：上传Excel文件 -->
      <div class="step-container">
        <div class="step-header">
          <div class="step-number-icon-container">
              <i class="iconfont icon-xuhao2 step-number-icon"></i>
          </div>
          <span class="step-title">上传编辑好的Excel模版文件</span>
        </div>
        <div class="step-body2">
          <template v-if="!uploadSuccess">
            <el-upload
              ref="uploadRef"
              class="excel-uploader"
              drag
              action=""
              multiple
              accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              :auto-upload="false"
              :file-list="fileList"
              :on-change="handleChange"
              :on-remove="handleRemove"
            >
              <div class="custom-upload-area">
                <div class="upload-main">
                  <i class="iconfont icon-shangchuan1 upload-icon"></i>
                  <span class="upload-text-main">选择上传文件</span>
                </div>
                <div class="upload-text-secondary">点击按钮选择本地Excel文件或将其拖至此区域内</div>
                <div class="el-upload__tip">
                  <p>1、格式支持xls、xlsx</p>
                  <p>2、文件大小不超过2MB</p>
                  <p>3、文件必须包含表头，数据勿放在合并的单元格中</p>
                  <p>4、文件所含数据行数勿超过10000、列数勿超过3（超出可分多次上传）</p>
                </div>
              </div>
            </el-upload>
          </template>
          <template v-else>
            <div class="upload-success-view">
              <div class="success-icon-container">
                <i class="iconfont icon-shangchuanchenggong success-icon"></i>
              </div>
              <p class="success-message">上传成功</p>
            </div>
          </template>
        </div>
      </div>
    </div>


    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <template v-if="!uploadSuccess">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" class="upload-btn" @click="submitUpload">确定</el-button>
        </template>
        <template v-else>
          <el-button type="primary" class="publish-btn" @click="handleshowCreateFormExcelImport">创建</el-button>
        </template>
      </div>
    </template>
  </el-dialog>

   <!-- 异常提示弹窗 -->
  <el-dialog
    v-model="errorDialogVisible"
    width="528px"
    :show-close="true"
    :close-on-click-modal="false"
    class="excel-import-error-dialog"
    @close="handleCloseErrorDialog"
    :top="'275px'"
  >
    <template #header>
      <div class="error-dialog-header">
        <el-icon class = "warning-icon"><WarningFilled /></el-icon>
        <span class="error-dialog-header-text">异常提示</span>
      </div>
    </template>
    <div class="error-dialog-content">
      <p class="main-error-message">{{ errorDialogMessage }}</p>
      <p class="error-note">注：若未按照模版填写数据，请先下载模版</p>
    </div>
    <template #footer>
      <div class="dialog-footer error-dialog-footer">
        <a href="/public/excel_survey_template.xlsx" download="问卷题目Excel导入模板.xlsx" class="download-link">
          <el-button type="default" plain class="download-button">
            <i class="iconfont icon-xiazai button-icon"></i>
            <span class="download-button-text">下载Excel模版</span>
          </el-button>
        </a>
        <el-button type="primary" @click="handleCloseErrorDialog" class ="chongxinshangchuan-btn">重新上传</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage, ElDialog, ElButton, ElIcon} from 'element-plus'
import { WarningFilled } from '@element-plus/icons-vue'
import axios from 'axios'
import type { UploadFile, UploadUserFile, UploadInstance } from 'element-plus'
import { getMultiOptionByText } from "@/materials/questions/common/utils";
import { getQuestionByType } from "@/management/utils";
import { typeTagLabels, QUESTION_TYPE } from "@/common/typeEnum";


const emit = defineEmits(['on-close-excel-import','on-excel-upload-success','on-show-create-form-excel-import']);
const props = defineProps({
  visible: Boolean
})

const uploadRef = ref<UploadInstance>();
const fileList = ref<UploadUserFile[]>([]);
const uploadSuccess = ref(false); 
const errorDialogVisible = ref(false);
const errorDialogMessage = ref('');

// 预定义错误信息
const ERROR_MESSAGES = {
  EXCEL_FORMAT_ERROR: "不支持该文件格式，请重新上传！", 
  FILE_SIZE_OVER_2MB_ERROR: "文件大小超出限制，请重新上传！", 
  MERGED_CELLS_ERROR: "文件格式不正确，请重新上传！",
  ROW_COL_LIMIT_ERROR: "文件所含数据超出限制，请重新上传！", 
  HEADER_INCORRECT_ERROR:"第一列标题必须为[题目标题]，第二列标题必须为[题型]，第三列标题必须为[选项内容]。"
};

const showErrorDialog = (message: string) => {
  errorDialogMessage.value = message;
  errorDialogVisible.value = true;
};

const handleCloseErrorDialog = () => {
  errorDialogVisible.value = false;
};

const handleClose = () => {
  resetUpload();
  uploadSuccess.value = false;
  errorDialogVisible.value = false;
  emit('on-close-excel-import');
}

const resetUpload = () => {
  fileList.value = [];
  if (uploadRef.value) {
    uploadRef.value.clearFiles();
  }
};

const handleChange = (file: UploadFile, files: UploadUserFile[]) => {
  fileList.value = files;
};

const handleRemove = (file: UploadFile, files: UploadUserFile[]) => {
  fileList.value = files;
};

// 创建类型映射表，与textToSchema.ts保持一致
const textTypeMap = (Object.keys(typeTagLabels) as Array<QUESTION_TYPE>).reduce((pre, key) => {
  const label = typeTagLabels[key]
  pre[label] = key
  return pre
}, {} as Record<string, string>)

// 将后端返回的Excel解析数据转换为问卷格式的题目列表
const excelToSchema = (excelQuestions: Array<{title: string, type: string, options: string}>) => {
  const questions = []

  for (const excelQuestion of excelQuestions) {
    const { title, type, options } = excelQuestion

    // 检查题型是否支持
    if (!textTypeMap[type]) {
      console.warn(`不支持的题型: ${type}，已跳过题目: ${title}`);
      continue;
    }

    const question: Record<string, any> = getQuestionByType(textTypeMap[type]);
    question.title = title
    question.showIndex = true

    switch (type) {
      case "单行输入框":
      case "多行输入框":
      case "评分":
      case "多级联动":
        questions.push(question);
        break;

      case "单选":
      case "多选":
      case "投票":
      case "判断题": {
        if (options && options.trim()) {
          const questionOptions = getMultiOptionByText(options.trim())
          question.options = questionOptions;
        }else {
          question.options = [];
        }
        questions.push(question);
        break;
      }

      case "NPS评分": {
        if (options && options.trim() && options.includes('-')) {
          const [left = '', right = ''] = options.split('-');
          question.minMsg = left.trim();
          question.maxMsg = right.trim();
        }
        questions.push(question);
        break;
      }

      default:
        break;
    }
  }

  return questions;
}

const submitUpload = async () => {
  // 文件列表为空时不允许上传
  if (fileList.value.length === 0) {
    ElMessage.warning('请选择要上传的文件');
    return;
  }

  try {
    // 校验所有文件格式和大小
    for (const item of fileList.value) {
      const file = item.raw;
      if (!file) continue;
      
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const isExcel = file.type === 'application/vnd.ms-excel' ||
                      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'||
                      (fileExtension && ['xls', 'xlsx'].includes(fileExtension));
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isExcel) {
        showErrorDialog(ERROR_MESSAGES.EXCEL_FORMAT_ERROR);
        resetUpload();
        return;
      }
      if (!isLt2M) {
        showErrorDialog(ERROR_MESSAGES.FILE_SIZE_OVER_2MB_ERROR);
        resetUpload();
        return;
      }
    }

    // 创建包含所有文件的FormData, 便于一次性上传至后端
    const formData = new FormData();
    fileList.value.forEach((item) => {
      if (item.raw) {
        formData.append('files', item.raw);
      }
    });

    const response = await axios.post('/api/survey/getExcelQuestions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.data.code === 200) {
      // 将Excel数据转换为问卷格式的题目列表
      const excelQuestions = response.data.data.questions;
      const questionList = excelToSchema(excelQuestions);

      emit('on-excel-upload-success', questionList);

      resetUpload();
      uploadSuccess.value = true;
    } else if (response.data.code === 400) {
      const error = response.data.error;
      switch (error) {
        case 'HEADER_FORMAT':
          showErrorDialog(ERROR_MESSAGES.HEADER_INCORRECT_ERROR);
          break;
        case 'MERGED_CELLS':
          showErrorDialog(ERROR_MESSAGES.MERGED_CELLS_ERROR);
          break;
        case 'SIZE_LIMIT':
          showErrorDialog(ERROR_MESSAGES.ROW_COL_LIMIT_ERROR);
          break;
      }
      resetUpload();
    } else {
      ElMessage.error('上传失败，请稍后重试');
      resetUpload();
    }
  } catch (err) {
    console.error('上传Excel发生错误：', err);
    ElMessage.error('上传过程中发生网络或服务器错误，请检查网络或联系管理员');
    resetUpload();
  }
};

const handleshowCreateFormExcelImport = () => {
  emit('on-show-create-form-excel-import');
};
</script>

<style scoped>
.excel-import-content {
  padding: 0 20px 20px 20px; 
}

.step-container {
  margin-bottom: 25px;
}

.step-container:last-child {
  margin-bottom: 0;
}

.step-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.step-number-icon-container {  
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #FAA600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}

.step-number-icon {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  font-size: 14px;
  color: #FEF6E6;
  background-color: transparent;
  text-align: center;
  line-height: 14px;
  position: relative;
}

.step-title {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #292A36;
  letter-spacing: 0;
  text-align: left;
  font-weight: 400;
}

.step-body1 {
  padding-left: 28px;
}

.download-link {
  text-decoration: none;
}

.download-button {
  background: #FFFFFF;
  border: 1px solid var(--primary-color);
  border-radius: 2px;
  color:var(--primary-color)
}

.download-button:hover{
  border-color: #E25822;
}

.download-button:hover .button-icon,
.download-button:hover .download-button-text {
  color: #E25822;
}

.button-icon {
  margin-right: 4px;
}

.download-button-text {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: var(--primary-color);
  letter-spacing: 0;
  line-height: 18px;
  font-weight: 500;
}

.excel-uploader {
  width: 100%;
}

.excel-uploader :deep(.el-upload-dragger) {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px dashed #dcdfe6;
  border-radius: 2px;
  background-color:#F6F7F9;;
  min-height: 180px;
}

.custom-upload-area {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.upload-main {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.upload-main:hover .upload-icon,
.upload-main:hover .upload-text-main {
  color: #E25822;
}

.upload-icon {
  font-size: 16px; 
  color: var(--primary-color);
  margin-right: 8px;
}

.upload-text-main {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: var(--primary-color);
  letter-spacing: 0;
  font-weight: 500;
}

.upload-text-secondary {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #292A36;
  letter-spacing: 0;
  text-align: left;
  line-height: 18px;
  font-weight: 400;
  margin-bottom: 10px;
}

.el-upload__tip {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #92949D;
  letter-spacing: 0;
  text-align: left;
  line-height: 18px;
  font-weight: 400;
  width: 100%;
  padding: 0 80px;
  box-sizing: border-box;
}

.el-upload__tip p {
  margin: 4px 0;
}

.upload-success-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #F6F7F9;
  border: 1px dashed #dcdfe6;
  border-radius: 2px;
  min-height: 180px;
}

.success-icon-container {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--primary-color);
  border: 1px solid var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.success-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 50px;
  color: #FEF6E6;
  background-color: transparent;
  text-align: center;
  line-height: 50px;
  position: relative;
}

.success-message {
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: var(--primary-color);
  letter-spacing: 0;
  font-weight: 500;
}

.error-dialog-header{
  display: flex; 
  align-items: center;
}

.warning-icon{
  color: var(--primary-color);
  font-size: 32px;
  margin-right: 10px;
}

.error-dialog-header-text{
  font-family: PingFangSC-Medium;
  font-size: 24px;
  color: #292A36;
  letter-spacing: 0;
  line-height: 36px;
  font-weight: 500;
}

.error-dialog-content {
  display: flex;
  padding: 20px 42px;
  flex-direction: column;
}

.main-error-message {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #4A4C5B;
  letter-spacing: 0;
  text-align: justify;
  line-height: 24px;
  font-weight: 400;
  margin-bottom: 8px;
}

.error-note {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #92949D;
  letter-spacing: 0;
  text-align: justify;
  line-height: 22px;
  font-weight: 400;
}

.dialog-footer {
  text-align: right;
  padding: 24px 20px;
  border-top: 1px solid #e3e4e8;
}

.error-dialog-footer {
  padding: 10px 0px 10px;
  border-top: none;
}

.chongxinshangchuan-btn {
  margin-left: 10px;
}
</style>