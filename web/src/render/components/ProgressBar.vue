<template>
  <div class="progress-outer">
    <div class="progress-position">
      <div class="progress-inner-wrapper-mobile">
        <div
          class="progress-inner-mobile"
          :style="{
            transition: 'all 0.5s',
            width: percent || 0
          }"
        ></div>
      </div>
      <div class="progress-inner-wrapper-pc">
        <div class="progress-inner-bar">
          <div
            class="progress-inner-pc"
            :style="{
              transition: 'all 0.5s',
              height: percent || 0
            }"
          ></div>
        </div>
        <div class="percent-pc">{{ percent || '0%' }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useProgressBar } from '../hooks/useProgress'

const { percent } = useProgressBar()
</script>
<style lang="scss" scoped>
.progress-outer {
  position: relative;
  overflow: hidden;
  .progress-inner-wrapper-pc {
    display: none;
  }
}
@media (min-width: 930px) {
  .progress-position {
    position: absolute;
    right: -24px;
    top: 160px;
  }
  .progress-inner-wrapper-pc {
    position: fixed;
    display: flex !important;
    flex-direction: column;
    align-items: center;
    background: #ffffff;
    border-radius: 2px;
    width: 56px;
    height: 240px;
    .progress-inner-bar {
      height: 190px;
      width: 8px;
      background: #f2f4f7;
      border-radius: 4px;
      margin-top: 12px;
    }
    .percent-pc {
      font-size: 12px;
      color: #6e707c;
      margin-top: 8px;
    }
    .progress-inner-pc {
      border-radius: 2px;
      background-color: $primary-color;
    }
  }
}
@media (max-width: 930px) {
  .progress-outer {
    .progress-inner-wrapper-mobile {
      position: fixed;
      width: 100%;
      max-width: 750px;
      height: 2px;
      top: 0;
      background-color: #f5f5f5;
      display: block;
    }
    .progress-inner-mobile {
      display: block;
      z-index: 10000;
      position: absolute;
      top: 0;
      left: 0;
      width: 50%;
      height: 100%;
      background-color: $primary-color;
    }
  }
}
</style>
