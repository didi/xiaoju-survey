<template>
  <el-button type="primary" :loading="isPublishing" class="publish-btn" @click="handlePublish">
    发布
  </el-button>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEditStore } from '@/management/stores/edit'
import { useRouter } from 'vue-router'
import { ElMessage, } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'
import { publishSurvey, saveSurvey } from '@/management/api/survey'
import buildData from './buildData'
import { storeToRefs } from 'pinia'

interface Props {
  updateLogicConf: any
  updateWhiteConf: any
}

const props = defineProps<Props>()

const isPublishing = ref<boolean>(false)
const editStore = useEditStore()
const { getSchemaFromRemote } = editStore
const { schema, sessionId } = storeToRefs(editStore)
const saveData = computed(() => {
  return buildData(schema.value, sessionId.value)
})
const router = useRouter()

const validate = () => {
  let checked = true
  let msg = ''
  const { validated, message } = props.updateLogicConf()
  if (!validated) {
    checked = validated
    msg = `检查页面"问卷编辑>显示逻辑"：${message}`
  }
  const { validated: whiteValidated, message: whiteMsg } = props.updateWhiteConf()
  if (!whiteValidated) {
    checked = whiteValidated
    msg = `检查页面"问卷设置>作答限制"：${whiteMsg}`
  }

  return {
    checked,
    msg
  }
}

const onSave = async () => {
  
  if (!saveData.value.sessionId) {
    ElMessage.error('未获取到sessionId')
    return null
  }
  
  if (!saveData.value.surveyId) {
    ElMessage.error('未获取到问卷id')
    return null
  }

  const res: Record<string, any> = await saveSurvey(saveData.value)
  return res
}
const handlePublish = async () => {
  if (isPublishing.value) {
    return
  }

  isPublishing.value = true

  // 发布检测
  const { checked, msg } = validate()
  if (!checked) {
    isPublishing.value = false
    ElMessage.error(msg)
    return
  }

  try {
    const saveRes: any = await onSave()
    if (!saveRes) {
      return
    }
    if(saveRes && saveRes?.code !== 200) {
      ElMessage.error(`保存失败 ${saveRes.errmsg}`)
      return
    }
    const publishRes: any = await publishSurvey({ surveyId: saveData.value.surveyId })
    if (publishRes.code === 200) {
      ElMessage.success('发布成功')
      getSchemaFromRemote()
      router.push({ name: 'publish' })
    } else {
      ElMessage.error(`发布失败 ${publishRes.errmsg}`)
    }
  } catch (err) {
    ElMessage.error(`发布失败`)
  } finally {
    isPublishing.value = false
  }
}
</script>
<style lang="scss" scoped>
.publish-btn {
  width: 100px;
  font-size: 14px;
  height: 36px;
  line-height: 36px;
  padding: 0;
}
</style>
