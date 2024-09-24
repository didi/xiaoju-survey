<template>
  <div class="mask" v-show="isVisible">
    <div class="box">
      <div class="head-wrapper">
        <div class="title">{{ title }}</div>
        <div v-if="tips" class="tips">{{ tips }}</div>
      </div>
      <div class="body-wrapper">
        <div v-if="formValues && formValues.length" class="body-content">
          <div class="form-item" v-for="item in formValues" :key="item.key">
            <div class="input-wrapper">
              <input
                class="input-inner"
                :name="item.key"
                v-model="item.value"
                :placeholder="item.placeholder"
              />
            </div>
          </div>
        </div>
        <slot name="body"></slot>
      </div>

      <div class="btn-wrapper">
        <div class="btn btn-shallow btn-base" v-if="cancel" @click="handleCancel">
          {{ cancelBtnText }}
        </div>
        <div class="btn btn-primary btn-base" @click="handleConfirm">{{ confirmBtnText }}</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'

type FormItem = {
  key: string
  value: string
  placeholder?: string
}

interface Props {
  visible?: boolean
  cancel?: boolean // 是否展示取消按钮
  cancelBtnText?: string
  confirmBtnText?: string
  title?: string
  tips?: string
  bodyContent?: FormItem[]
  autoClose?: boolean // 点击确认时是否关闭
}

interface Emit {
  (ev: 'confirm', data: any, callback: () => void): void
  (ev: 'close'): void
}

const emit = defineEmits<Emit>()

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  cancel: true,
  cancelBtnText: '取消',
  confirmBtnText: '确定',
  title: '',
  tips: '',
  autoClose: true
})

const isVisible = ref(props.visible)
const formValues = reactive(props.bodyContent || [])

const handleConfirm = () => {
  const data: {
    [key: string]: any
  } = {}
  formValues.forEach((item) => {
    data[item.key] = item.value
  })

  emit('confirm', data, handleCancel)

  props.autoClose && handleCancel()
}

const handleCancel = () => {
  isVisible.value = false
  emit('close')
}
</script>
<style lang="scss" scoped>
@import url('../styles/dialog.scss');

.tips {
  text-align: center;
  font-size: 0.24rem;
  color: #92949d;
  margin-top: 0.15rem;
  margin-bottom: 0.4rem;
}

.btn-wrapper {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;

  .btn-base {
    width: 100%;
    margin-right: 0.2rem;

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
