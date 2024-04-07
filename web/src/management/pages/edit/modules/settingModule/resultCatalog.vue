<template>
  <div class="status-list-wrapper">
    <div
      v-for="(status, index) in statusList"
      :key="index"
      class="status-item"
      @click="filterDisabledStatus({ type: status.type })"
    >
      <span>{{ status.title }}</span>
      <div class="preview-item">
        <img :src="status.previewImg" :alt="status.title" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { EDIT_STATUS_MAP } from './enum'

export default {
  name: 'resultConfigList',
  data() {
    return {
      statusList: [
        {
          type: EDIT_STATUS_MAP.SUCCESS,
          title: '提交成功',
          previewImg: '/imgs/icons/success.webp',
        },
        {
          type: EDIT_STATUS_MAP.OVERTIME,
          title: '问卷过期',
          previewImg: '/imgs/icons/overtime.webp',
        },
      ],
    }
  },
  computed: {},
  methods: {
    ...mapMutations({
      changeStatusPreview: 'edit/changeStatusPreview',
    }),
    filterDisabledStatus(data) {
      this.changeStatusPreview(data)
    },
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.status-list-wrapper {
  width: 300px;
  height: 100%;
  padding: 19px 18px 100px 19px;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #fff;

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
