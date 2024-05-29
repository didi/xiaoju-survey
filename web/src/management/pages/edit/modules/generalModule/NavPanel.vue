<template>
  <div class="content">
    <template v-for="btnItem in btnList" :key="btnItem.key">
      <router-link
        :to="{ name: btnItem.router }"
        replace
        v-slot="{ href, navigate, isActive, isExactActive }"
        custom
      >
        <div
          :class="[
            'navbar-btn',
            (isActive && ['skinsettings', 'edit'].includes(btnItem.key)) || isExactActive
              ? 'router-link-exact-active'
              : ''
          ]"
        >
          <i class="iconfont" :class="[btnItem.icon]"></i>
          <a :href="href" @click="navigate"
            ><span>{{ btnItem.text }}</span></a
          >
        </div>
      </router-link>
    </template>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const btnList = reactive([
  {
    icon: 'icon-wenjuanbianji',
    text: '问卷编辑',
    router: 'QuestionEditIndex',
    key: 'edit',
    next: true
  },
  {
    icon: 'icon-wenjuanshezhi',
    text: '问卷设置',
    router: 'QuestionEditSetting',
    key: 'settings',
    next: true
  },
  {
    icon: 'icon-yangshishezhi',
    text: '皮肤设置',
    router: 'QuestionSkinSetting',
    key: 'skinsettings',
    next: true
  }
])
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  align-items: center;
  justify-content: center;

  .navbar-btn {
    position: relative;
    color: #92949d;
    padding: 0 20px;
    cursor: pointer;
    a {
      color: inherit;
    }
    &.router-link-exact-active {
      color: $font-color-title;

      &::before {
        content: '';
        position: absolute;
        width: 90px;
        height: 3px;
        background-color: $primary-color;
        bottom: -16px;
        left: 20px;
      }
    }

    // &.router-link-exact-active {
    //   color: #4a4c5b;
    // }
    .iconfont {
      margin-right: 12px;
    }
  }
}
</style>
