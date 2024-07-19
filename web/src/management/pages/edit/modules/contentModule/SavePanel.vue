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
        <i-ep-check class="icon succeed" v-else-if="autoSaveStatus === 'succeed'" />
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { useStore } from 'vuex'
import { get as _get } from 'lodash-es'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'

import { saveSurvey } from '@/management/api/survey'
import { showLogicEngine } from '@/management/hooks/useShowLogicEngine'
import buildData from './buildData'

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

const store = useStore()

const saveData = async () => {
  const saveData = buildData(store.state.edit.schema)

  if (!saveData.surveyId) {
    ElMessage.error('未获取到问卷id')
    return null
  }

  const res = await saveSurvey(saveData)
  return res
}

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

const updateWhiteConf = () => {
  const baseConf = store.state.edit.schema.baseConf || {};
  if (baseConf.passwordSwitch && !baseConf.password) {
    return true;
  }
  if (baseConf.whitelistType!='ALL' && !baseConf.whitelist?.length) {
    return true;
  }
  return false
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
          const res: any = await saveData()
          if (res.code === 200) {
            autoSaveStatus.value = 'succeed'
          } else {
            autoSaveStatus.value = 'failed'
          }

          setTimeout(() => {
            isShowAutoSave.value = false
            timerHandle.value = null
          }, 300)
        } catch (err) {
          autoSaveStatus.value = 'failed'
          isShowAutoSave.value = true
        }
      })
    }, 2000)
  }
}

const handleSave = async () => {
  if (isSaving.value) {
    return
  }

  isSaving.value = true
  isShowAutoSave.value = false

  try {
    updateLogicConf()
  } catch (error) {
    isSaving.value = false
    ElMessage.error('请检查逻辑配置是否有误')
    return
  }

  if(updateWhiteConf()){
    isSaving.value = false
    ElMessage.error('请检查问卷设置是否有误')
    return
  }

  try {
    const res: any = await saveData()
    if (res.code === 200) {
      ElMessage.success('保存成功')
    } else {
      ElMessage.error(res.errmsg)
    }
  } catch (error) {
    ElMessage.error('保存问卷失败')
  } finally {
    isSaving.value = false
  }
}

const schemaUpdateTime = computed(() => _get(store.state, 'edit.schemaUpdateTime'))
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
