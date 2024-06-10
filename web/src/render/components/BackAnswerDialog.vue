<template>
    <div class="mask" v-show="visible">
      <div class="box">
        <div class="title">{{ title }}</div>
        <div class="btn-box">
          <div class="btn cancel" @click="handleCancel">{{ cancelBtnText }}</div>
          <div class="btn confirm" @click="handleConfirm">{{ confirmBtnText }}</div>
        </div>
      </div>
    </div>
  </template>
  <script setup lang="ts">
  interface Props {
    visible?: boolean
    cancelBtnText?: string
    confirmBtnText?: string
    title?: string
  }
  
  interface Emit {
    (ev: 'confirm', callback: () => void): void
    (ev: 'close'): void
  }
  
  const emit = defineEmits<Emit>()
  
  withDefaults(defineProps<Props>(), {
    visible: false,
    cancelBtnText: '取消',
    confirmBtnText: '确定',
    title: ''
  })
  
  const handleConfirm = () => {
    emit('confirm', () => {
      emit('close')
    })
  }
  
  const handleCancel = () => {
    emit('cancel', () => {
        emit('close')
    })
  }
  </script>
  <style lang="scss" scoped>
  @import url('../styles/dialog.scss');
  
  .btn-box {
    padding: 20px 0 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  
    .btn {
      width: 48%;
      font-size: 0.28rem;
      border-radius: 0.04rem;
      text-align: center;
      padding: 0.16rem 0;
      line-height: 0.4rem;
      cursor: pointer;
  
      &.cancel {
        background: #fff;
        color: #92949d;
        border: 1px solid #e3e4e8;
      }
  
      &.confirm {
        background-color: #4a4c5b;
        border: 1px solid #4a4c5b;
        color: #fff;
      }
    }
  }
  </style>
  