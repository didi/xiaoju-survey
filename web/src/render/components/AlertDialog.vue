<template>
  <div class="mask" v-if="visible">
    <div class="box">
      <div class="title">{{ title }}</div>
      <div class="btn btn-primary btn-base" @click="handleConfirm">{{ btnText }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
interface Props {
  visible?: boolean
  btnText?: string
  title?: string
}

interface Emit {
  (ev: 'confirm'): void
  (ev: 'close'): void
}

const emit = defineEmits<Emit>()

withDefaults(defineProps<Props>(), {
  visible: false,
  btnText: '我知道了',
  title: ''
})

const handleConfirm = () => {
  emit('confirm')
  emit('close')
}
</script>
<style lang="scss" scoped>
@import url('../styles/dialog.scss');

.btn-base {
  // display: inline-block;
  margin-top: 20px;
}
</style>
