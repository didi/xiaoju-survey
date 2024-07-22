<template>
  <el-button type="primary" :loading="isPublishing" class="publish-btn" @click="handlePublish">
    发布
  </el-button>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useEditStore } from '@/management/stores/edit'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'

import { publishSurvey, saveSurvey } from '@/management/api/survey'
import buildData from './buildData'

interface Props {
  updateLogicConf: any
  updateWhiteConf: any
}

const props = defineProps<Props>()

const isPublishing = ref<boolean>(false)
const editStore = useEditStore()
const { schema, getSchemaFromRemote } = editStore
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

  const saveData = buildData(schema)
  if (!saveData.surveyId) {
    isPublishing.value = false
    ElMessage.error('未获取到问卷id')
    return
  }

  try {
    const saveRes: any = await saveSurvey(saveData)
    if (saveRes.code !== 200) {
      isPublishing.value = false
      ElMessage.error(saveRes.errmsg || '问卷保存失败')
      return
    }

    const publishRes: any = await publishSurvey({ surveyId: saveData.surveyId })
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
