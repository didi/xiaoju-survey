<template>
  <div class="white-list-wrap">
    <el-button class="create-btn" type="primary" @click="whiteVisible=true">
      添加
    </el-button>
    <el-button v-if="whitelist.length>0" class="create-btn" color="#4A4C5B" @click="delAllList">
      全部删除
    </el-button>
    <el-table class="table-wrap" empty-text="暂无数据" :data="whitelist" height="240" style="width: 426px">
      <el-table-column  label="名单" width="350" >
        <template #default="scope">
            <div>{{ whitelist[scope.$index] }}</div>
          </template>
        </el-table-column>
      <el-table-column  label="操作" width="74" >
        <template #default="scope">
            <div @click="delRowItem(scope.$index)" class="flex cursor"><i-ep-delete :size="16" /></div>
          </template>
        </el-table-column>
    </el-table>
    <el-dialog v-model="whiteVisible" title="添加白名单" width="600" @closed="handleClose">
      <div>
        <el-form-item  label-position="top" label="类型选择" label-width="auto">
          <el-radio-group v-model="memberType" >
            <el-radio value="MOBILE">手机号</el-radio>
            <el-radio value="EMAIL">邮箱</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label-position="top" class="flex-column" label="名单录入" label-width="auto">
          <el-input v-model="whiteTextarea" placeholder="多个用逗号(半角)“,”隔开"   rows="7" resize="none" type="textarea" />
        </el-form-item>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="whiteVisible = false">取消</el-button>
          <el-button type="primary" @click="handleChange">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>

import { ref,nextTick } from 'vue'
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'
import { ElMessage } from 'element-plus'
import { regexpMap } from '@/common/regexpMap.ts'

const props = defineProps({
  formConfig: Object,
})
const emit = defineEmits([FORM_CHANGE_EVENT_KEY])

const whitelist = ref(props.formConfig.value[0] || [])
const memberType = ref(props.formConfig.value[1] || 'MOBILE')
const whiteVisible = ref(false)
const whiteTextarea = ref(whitelist.value.join(','))

const regularMap = {
  MOBILE:regexpMap.m,
  EMAIL:regexpMap.e
}


const checkValRule = (list) => {
  let status = false;
  if (list.length > 100) { 
    ElMessage.error('最多添加100个')
    return true;
  };
  const pattern = regularMap[memberType.value];
  if(!pattern) return false;
  for (let i = 0; i < list.length; i++) {
    if (!pattern.test(list[i])) {
      status = true;
      ElMessage.error('数据格式错误，请检查后重新输入~')
      break;
    }
  }
  return status;
}



const handleChange = () => {
  const keys = props.formConfig.keys;
  const list = whiteTextarea.value ? whiteTextarea.value.split(',') : []
  if(checkValRule(list)) return
  emit(FORM_CHANGE_EVENT_KEY, { key:keys[0], value: list });
  emit(FORM_CHANGE_EVENT_KEY, { key: keys[1], value: memberType.value })
  whiteVisible.value = false
}

const handleClose = () => {
  nextTick(() => {
    whitelist.value = props.formConfig.value[0] || []
    whiteTextarea.value = whitelist.value.join(',')
    memberType.value = props.formConfig.value[1] || 'MOBILE'
  })
}

const delRowItem = (index) => {
  whitelist.value.splice(index, 1); 
  whiteTextarea.value = whitelist.value.join(',')
  const keys = props.formConfig.keys;
  emit(FORM_CHANGE_EVENT_KEY, { key:keys[0], value:  whitelist.value });
}

const delAllList = () => {
  whitelist.value = []
  whiteTextarea.value = ''
  handleChange();
}


</script>
<style lang="scss" scoped>
.white-list-wrap {
  .flex-column{
    flex-direction: column;
  }
  :deep(th){
    padding:4px 0;
    background: #F6F7F9;
  }
  :deep(td){
    padding:6px 0;
  }
  .table-wrap{
    margin-top: 16px;
    border: 1px solid #ebeef5;
    border-radius: 2px;
    overflow-x: hidden;
  }
  .cursor{
    cursor: pointer;
  }
  .flex{
    display: flex;
  }
}

</style>