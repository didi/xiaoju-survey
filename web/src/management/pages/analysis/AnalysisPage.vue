<template>
  <div class="analysis-page">
    <leftMenu class="left"></leftMenu>
    <div class="right">
      <div class="analysis-tabs">
        <router-link
          v-for="item in analysisType"
          class="analysis-tabs__item"
          :key="item.value"
          :to="{ name: item.value }"
        >
          <i class="iconfont" :class="item.icon"></i>
          <span>{{ item.label }}</span>
        </router-link>
      </div>
      <div class="content-wrapper">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import LeftMenu from '@/management/components/LeftMenu.vue'
import { analysisType } from '@/management/config/analysisConfig'
</script>

<style lang="scss" scoped>
.analysis-page {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .left {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
  }

  .right {
    width: 100%;
    height: 100%;
    min-width: 1300px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: #f6f7f9;

    .analysis-tabs {
      flex: none;
      gap: 40px;
      font-size: 14px;
      font-weight: normal;
      width: 100%;
      height: 56px;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      border-bottom: 1px solid #e7e9eb;

      &__item {
        cursor: pointer;
        padding: 8px 0;
        color: #92949d;

        .iconfont {
          margin-right: 8px;
        }
      }

      .router-link-active {
        color: $font-color-title;
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;

        &::before {
          content: '';
          position: absolute;
          width: calc(100% + 5px);
          height: 3px;
          background-color: $primary-color;
          bottom: 0;
          left: 0;
        }
      }
    }
  }

  .content-wrapper {
    flex: auto;
    overflow: hidden;
    padding: 24px 24px 24px 104px;
  }
}
</style>
