<template>
  <el-button type="primary" :loading="isPublishing" class="publish-btn" @click="handlePublish">
    发布
  </el-button>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEditStore } from '@/management/stores/edit'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type Action } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'

import { publishSurvey, saveSurvey, getConflictHistory } from '@/management/api/survey'

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
const saveData = computed(() => {
  return buildData(store.state.edit.schema, sessionStorage.getItem('sessionUUID'))
})

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

const checkConflict = async (surveyid:string) => {
  try {
    const dailyHis = await getConflictHistory({surveyId: surveyid, historyType: 'dailyHis', sessionId: sessionStorage.getItem('sessionUUID')})
    if (dailyHis.data.length > 0) {
      const lastHis = dailyHis.data.at(0)
      if (Date.now() - lastHis.createDate > 2 * 60 * 1000) {
        return [false, '']
      }
      return [true, lastHis.operator.username]
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
        callback: (action: Action) => {
          if (action === 'confirm') {
            store.dispatch('edit/getSchemaFromRemote')
          }
        }
      });
    } else {
      ElMessageBox.alert(`当前问卷2分钟内由${conflictName}编辑，刷新以获取最新内容。`, '提示', {
        confirmButtonText: '确认',
        callback: (action: Action) => {
          if (action === 'confirm') {
            store.dispatch('edit/getSchemaFromRemote')
          }
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
const checkConflict = async (surveyid:string) => {
  try {
    const dailyHis = await getConflictHistory({surveyId: surveyid, historyType: 'dailyHis', sessionId: sessionStorage.getItem('sessionUUID')})
    if (dailyHis.data.length > 0) {
      const lastHis = dailyHis.data.at(0)
      if (Date.now() - lastHis.createDate > 2 * 60 * 1000) {
        return [false, '']
      }
      return [true, lastHis.operator.username]
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
        callback: (action: Action) => {
          if (action === 'confirm') {
            store.dispatch('edit/getSchemaFromRemote')
          }
        }
      });
    } else {
      ElMessageBox.alert(`当前问卷2分钟内由${conflictName}编辑，刷新以获取最新内容。`, '提示', {
        confirmButtonText: '确认',
        callback: (action: Action) => {
          if (action === 'confirm') {
            store.dispatch('edit/getSchemaFromRemote')
          }
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
    }
    const publishRes: any = await publishSurvey({ surveyId: saveData.value.surveyId, sessionId: sessionStorage.getItem('sessionUUID') })
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
