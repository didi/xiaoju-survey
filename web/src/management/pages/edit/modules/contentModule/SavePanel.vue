<template>
  <div class="btn" @click="handleSave" v-loading="isSaving">
    <i class="iconfont icon-baocun"></i>
    <span class="btn-txt">保存</span>
    <transition name="fade">
      <div class="auto-save-wrapper" v-if="isShowAutoSave">
        <span class="sv-text">
          {{ saveText }}
        </span>
        <i-ep-loading class="icon" v-if="autoSaveStatus === 'saving'" />
        <i-ep-check class="icon succeed" v-if="autoSaveStatus === 'succeed'" />
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useEditStore } from '@/management/stores/edit'
import { ElMessage, ElMessageBox } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'

import { saveSurvey } from '@/management/api/survey'
import buildData from './buildData'

interface Props {
  updateLogicConf: any
  updateWhiteConf: any
  seize: any
}

const route = useRoute()
const props = defineProps<Props>()
const isSaving = ref<boolean>(false)
const isShowAutoSave = ref<boolean>(false)
const autoSaveStatus = ref<'succeed' | 'saving' | 'failed'>('succeed')
const saveText = computed(
  () =>
    ({
      saving: '保存中',
      succeed: '保存成功',
      failed: '保存失败'
    })[autoSaveStatus.value]
)

const editStore = useEditStore()
const { schemaUpdateTime, schema, sessionId } = storeToRefs(editStore)

const validate = () => {
  let checked = true
  let msg = ''
  if (route.path.includes('edit/logic')) {
    const { validated, message } = props.updateLogicConf()
    checked = validated
    msg = message
  }

  if (route.path.includes('edit/setting')) {
    const { validated, message } = props.updateWhiteConf()
    checked = validated
    msg = message
  }

  return {
    checked,
    msg
  }
}

const onSave = async () => {
  const saveData = buildData(schema.value, sessionId.value)
  if (!saveData.sessionId) {
    ElMessage.error('sessionId有误')
    return null
  }

  if (!saveData.surveyId) {
    ElMessage.error('未获取到问卷id')
    return null
  }

  const res: Record<string, any> = await saveSurvey(saveData)
  return res
}

const timerHandle = ref<NodeJS.Timeout | number | null>(null)
const triggerAutoSave = () => {
  if (autoSaveStatus.value === 'saving') {
    setTimeout(() => triggerAutoSave(), 1000)
  } else {
    if (timerHandle.value) {
      clearTimeout(timerHandle.value)
      timerHandle.value = null
    }

    timerHandle.value = setTimeout(() => {
      autoSaveStatus.value = 'saving'
      isShowAutoSave.value = true
      nextTick(async () => {
        try {
          const res: any = await doSave()
          if (res !== undefined)  {
            if (res.code === 200) {
              autoSaveStatus.value = 'succeed'
            } else {
              autoSaveStatus.value = 'failed'
            }
            isShowAutoSave.value = true
          }
        } catch (err) {
          autoSaveStatus.value = 'failed'
          isShowAutoSave.value = true
        } finally {
          setTimeout(() => {
            isShowAutoSave.value = false
            timerHandle.value = null
          }, 300)
        }
      })
    }, 2000)
  }
}

const handleSave = async () => {
  const res: any = await doSave()
  if (res !== undefined && res.code === 200) {
    ElMessage.success('保存成功')
  }
}

/**
 * 保存问卷
 * @return 无返回时说明保存失败并由函数内部完成统一提示，有返回时，code为200为保存成功，不为200时，使用errmsg由外部实现错误信息展示
 */
const doSave = async () => {
  if (isSaving.value) {
    return
  }

  isShowAutoSave.value = false

  // 保存检测
  const { checked, msg } = validate()
  if (!checked) {
    ElMessage.error(msg)
    return
  }

  isSaving.value = true

  try {
    const res: any = await onSave()
    if (!res) {
      return
    }
    if (res.code === 200) {
      return res
    } else if (res.code === 3006) {
      ElMessageBox.alert(res.errmsg, '提示', {
        confirmButtonText: '刷新同步',
        callback: (action: string) => {
          if (action === 'confirm') {
            props.seize(sessionId.value)
          }
        }
      })
    } else {
      ElMessage.error(res.errmsg)
    }
  } catch (error) {
    ElMessage.error('保存问卷失败')
  } finally {
    isSaving.value = false
  }
}

watch(schemaUpdateTime, () => {
  triggerAutoSave()
})
</script>
<style lang="scss" scoped>
@import url('@/management/styles/edit-btn.scss');

.auto-save-wrapper {
  position: fixed;
  top: 13px;
  right: 280px;
  width: 90px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.12);
  border-radius: 2px;
  opacity: 1;

  .sv-text {
    vertical-align: middle;
    height: 30px;
    line-height: 30px;
    color: #666;
    font-size: 12px;
    margin-right: 6px;
  }

  .icon {
    font-size: 14px;

    &.succeed {
      animation: move 0.6s linear forwards;
      color: green;
    }
  }
}

.fade-enter-active {
  transition: all 0.5s;
}

.fade-leave-active {
  transition: all 0.5s 2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes move {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 100%;
  }
}
</style>
