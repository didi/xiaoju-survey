<template>
  <el-button type="primary" :loading="isPublishing" class="publish-btn" @click="handlePublish">
    发布
  </el-button>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'
import { publishSurvey, saveSurvey, getConflictHistory } from '@/management/api/survey'
import { showLogicEngine } from '@/management/hooks/useShowLogicEngine'
import buildData from './buildData'

const isPublishing = ref<boolean>(false)
const store = useStore()
const router = useRouter()
const saveData = computed(() => {
  return buildData(store.state.edit.schema, sessionStorage.getItem('sessionUUID'))
})
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

const checkConflict = async (surveyid:string) => {
  try {
    const dailyHis = await getConflictHistory({surveyId: surveyid, historyType: 'dailyHis', sessionId: sessionStorage.getItem('sessionUUID')})
    console.log(dailyHis)
    if (dailyHis.data.length > 0) {
      const lastHis = dailyHis.data.at(0)
      if (Date.now() - lastHis.createDate > 2 * 60 * 1000) {
        return [false, '']
      } else {
        return [true, lastHis.operator.username]
      }
    }
  } catch (error) {
    console.log(error)
  }
  return [false, '']
}
const onSave = async () => {
  let res
  
  if (!saveData.value.surveyId) {
    ElMessage.error('未获取到问卷id')
    return null
  }
  // 增加冲突检测
  const [isconflict, conflictName] = await checkConflict(saveData.value.surveyId)
  if(isconflict) {
    if (conflictName == store.state.user.userInfo.username) {
      ElMessageBox.alert('当前问卷已在其它页面开启编辑，刷新以获取最新内容。', '提示', {
        confirmButtonText: '确认',
        callback: () => {
          location.reload(); 
        }
      });
    } else {
      ElMessageBox.alert(`当前问卷2分钟内由${conflictName}编辑，刷新以获取最新内容。`, '提示', {
        confirmButtonText: '确认',
        callback: () => {
          location.reload(); 
        }
      });
    }
    return null
  } else {
    // 保存数据
    res = await saveSurvey(saveData.value)
  }
  return res
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

  try {
    const saveRes: any = await onSave()
    if (!saveRes) {
      return
    }
    if(saveRes && saveRes?.code !== 200) {
      ElMessage.error(`保存失败 ${saveRes.errmsg}`)
    }
    const publishRes: any = await publishSurvey({ surveyId: saveData.value.surveyId, sessionId: sessionStorage.getItem('sessionUUID') })
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
