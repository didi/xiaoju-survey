<template>
  <div class="left-side">
    <div class="main">
      <nav-header :box-shadow="false" />
      <div class="new-title">请选择创建的问卷类型</div>
      <ul class="new-cardList">
        <li
          v-for="item in renderData"
          class="list-item"
          :key="item.type"
          @click="handleSelectType('selectType', item)"
        >
          <div class="selected-border" v-if="selectType === item.type" />
          <img class="img" :src="item.img" alt="类别图片" />
          <div class="container">
            <div class="title-container">
              <p class="title">{{ item.title }}</p>
            </div>
            <p class="desc">{{ item.desc }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import NavHeader from './navHeader.vue'

import { SURVEY_TYPE_LIST } from '../types'

export default {
  name: 'LeftSide',
  components: {
    NavHeader,
  },
  props: {
    selectType: {
      type: String,
      default: '',
    },
  },
  computed: {
    renderData() {
      return SURVEY_TYPE_LIST
    },
  },
  methods: {
    handleSelectType(key, value) {
      const { type } = value
      this.$emit('selectTypeChange', type)
    },
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.left-side {
  position: relative;
  height: 100%;
  width: 575px;
  background: $background-color-light;

  .main {
    width: 560px;
    height: 100%;
    box-shadow: 4px 0 12px 0 rgba(74, 76, 91, 0.08);

    .new-title {
      color: $font-color-title;
      font-family: PingFangSC-Medium;
      font-size: 24px;
      letter-spacing: 0;
      margin: 45px 0 36px 64px;
    }
  }
}

.new-cardList {
  display: flex;
  flex-direction: column;
  align-items: center;

  .list-item {
    width: 476px;
    height: 92px;
    margin-bottom: 16px;
    border-radius: 2px;
    padding: 33px 0;
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    box-sizing: border-box;

    .selected-border {
      position: absolute;
      left: -1px;
      top: -1px;
      right: -1px;
      bottom: -1px;
      border: 2px solid $primary-color;
      border-radius: 2px;
      background-color: $primary-color-light;
    }

    .img {
      margin-left: 24px;
      width: 51px;
      height: 49px;
      // border: 1px solid #FFD166;
      background-color: $primary-color-hover;
      border-radius: 100%;
      z-index: 1;
    }

    .container {
      display: flex;
      flex-direction: column;
      margin-left: 25px;
      z-index: 1;

      .title-container {
        display: flex;
      }
    }

    .title {
      color: $font-color-title;
      margin-bottom: 8px;
      font-size: 18px;
      font-family: PingFangSC-Regular;
    }

    .desc {
      font-size: 12px;
      color: $font-color;
    }
  }
}
</style>
