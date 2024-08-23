<template>
  <div class="tab-box">
    <div class="title">结果页状态选择</div>
    <div class="status-list-wrapper">
      <div
        v-for="(status, index) in statusList"
        :key="index"
        class="status-item"
        @click="handleChangePreview({ type: status.type })"
      >
        <span>{{ status.title }}</span>
        <div class="preview-item">
          <img :src="status.previewImg" :alt="status.title" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { EDIT_STATUS_MAP } from './components/enum'
import { useEditStore } from '@/management/stores/edit'

const editStore = useEditStore()
const { currentEditStatus } = storeToRefs(editStore)
const statusList = [
  {
    type: EDIT_STATUS_MAP.SUCCESS,
    title: '提交成功',
    previewImg: '/imgs/icons/success.webp'
  },
  {
    type: EDIT_STATUS_MAP.OVERTIME,
    title: '问卷过期',
    previewImg: '/imgs/icons/overtime.webp'
  }
]

const handleChangePreview = (data: any) => {
  if (currentEditStatus.value !== data.type) {
    editStore.changeCurrentEditStatus(data.type)
  }
}
</script>
<style lang="scss" scoped>
.tab-box {
  width: 360px;
  height: 100%;
  box-shadow: none;
  border: none;
  overflow-y: auto;
  background-color: #fff;
  .title {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: $primary-color;
    padding-left: 20px;
    // background: #f9fafc;
    border-bottom: 1px solid #edeffc;
  }
}
.status-list-wrapper {
  padding: 19px 18px 100px 19px;
  overflow-y: auto;
  overflow-x: hidden;

  label.title {
    font-size: 16px;
    color: #333;
  }

  .status-item {
    position: relative;
    margin-bottom: 24px;

    span {
      display: block;
      margin-bottom: 17px;
      color: $font-color-stress;
      font-size: 16px;
    }
    .preview-item {
      padding: 40px 80px;
    }
    img {
      position: relative;
      width: 100%;
      cursor: pointer;
      transition: all 0.2s;
      &:hover {
        -webkit-filter: brightness(90%);
        filter: brightness(90%);
      }
    }
  }
}
</style>
