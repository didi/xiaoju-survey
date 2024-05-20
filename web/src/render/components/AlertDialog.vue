<template>
  <div class="mask" v-if="visible">
    <div class="box">
      <div class="title">{{ title }}</div>
      <div class="btn" @click="handleConfirm">{{ btnText }}</div>
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

.btn {
  display: inline-block;
  text-align: center;
  width: 100%;
  height: 42px;
  margin-top: 20px;
  line-height: 42px;
  border-radius: 2px;
  font-size: 16px;
  background-color: #4a4c5b;
  border: 1px solid #4a4c5b;
  color: #fff;
  cursor: pointer;
}
</style>
