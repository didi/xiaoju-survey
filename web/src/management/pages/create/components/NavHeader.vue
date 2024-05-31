<template>
  <div :class="['nav-header', `${boxShadow ? 'box-shadow' : null}`]">
    <div class="left">
      <div class="logo">
        <img class="logoImg" :src="img" @click="toHomePage" />
      </div>
      <div class="return no-logo-return icon-fanhui" @click="onBack">返回</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Props {
  boxShadow?: boolean
}

withDefaults(defineProps<Props>(), {
  boxShadow: true
})

const img = '/imgs/s-logo.webp'

const router = useRouter()

const onBack = () => {
  router.go(-1)
}

const toHomePage = () => {
  router.push({
    name: 'survey'
  })
}
</script>

<style lang="scss" scoped>
.nav-header {
  z-index: 99;
  position: relative;
  height: 64px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    display: flex;
    align-items: center;
    .logo {
      width: 66px;
      height: 35px;
      border-right: 1px solid rgb(242, 244, 247);
      cursor: pointer;
      display: flex;
      justify-content: center;
      .logoImg {
        width: 32px;
      }
    }
    .return {
      margin-left: 20px;
      line-height: 56px;
      font-size: 18px;
      color: #6e707c;
      position: relative;
      cursor: pointer;
      &::before {
        position: absolute;
        left: -20px;
        bottom: 2px;
        font-weight: 600;
        content: '<';
      }
    }
    .no-logo-return {
      left: 20px;
    }
  }
}
.box-shadow {
  box-shadow: 0 4px 8px 0 rgba(74, 76, 91, 0.08);
}
</style>
