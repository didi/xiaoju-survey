<template>
  <el-button type="primary" :loading="isPublishing" class="publish-btn" @click="handlePublish">
    发布
  </el-button>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'

import { publishSurvey, saveSurvey } from '@/management/api/survey'
import { showLogicEngine } from '@/management/hooks/useShowLogicEngine'
import buildData from './buildData'

const isPublishing = ref<boolean>(false)
const store = useStore()
const router = useRouter()

const updateLogicConf = () => {
  if (
    showLogicEngine.value &&
    showLogicEngine.value.rules &&
    showLogicEngine.value.rules.length !== 0
  ) {
    showLogicEngine.value.validateSchema()
    const showLogicConf = showLogicEngine.value.toJson()
    // 更新逻辑配置
    store.dispatch('edit/changeSchema', { key: 'logicConf', value: { showLogicConf } })
  }
}

const handlePublish = async () => {
  if (isPublishing.value) {
    return
  }

  isPublishing.value = true

  try {
    updateLogicConf()
  } catch (err) {
    isPublishing.value = false
    ElMessage.error('请检查逻辑配置是否有误')
    return
  }

  const saveData = buildData(store.state.edit.schema)
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
      store.dispatch('edit/getSchemaFromRemote')
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
