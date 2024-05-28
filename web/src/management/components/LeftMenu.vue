<template>
  <div class="nav">
    <LogoIcon />
    <RouterLink
      v-for="(tab, index) in currentTabs"
      :key="index"
      class="tab-btn"
      :to="tab.to"
      replace
    >
      <div class="icon">
        <i class="iconfont" :class="tab.icon"></i>
      </div>
      <p>{{ tab.text }}</p>
    </RouterLink>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

import LogoIcon from './LogoIcon.vue'
import { SurveyPermissions } from '@/management/utils/types/workSpace.ts'
const store = useStore()
// console.log({metaData: store.state.edit.schema.metaData})
const tabs = [
  {
    text: '编辑问卷',
    icon: 'icon-bianji',
    to: {
      name: 'QuestionEditIndex'
    }
  },
  {
    text: '投放问卷',
    icon: 'icon-toufang',
    to: {
      name: 'publish'
    }
  },
  {
    text: '数据统计',
    icon: 'icon-shujutongji',
    to: {
      name: 'analysisPage'
    }
  }
]
const currentTabs = computed(() => {
  const { isCollaborated = true, currentPermission = [] } =
    store.state.edit?.schema?.metaData || {}
  if (!isCollaborated) {
    return tabs
  } else {
    // 如果没有问卷管理权限，则隐藏问卷编辑和投放菜单
    if (currentPermission.includes(SurveyPermissions.SurveyManage)) {
      return tabs.slice(0, 2)
    }
    // 如果没有数据分析权限，则隐藏数据分析菜单
    if (currentPermission.includes(SurveyPermissions.DataManage)) {
      return tabs.slice(2, 3)
    }
    return []
  }
})
</script>
<style lang="scss" scoped>
.nav {
  width: 80px;
  height: 100%;
  background-color: #fff;
  font-size: 12px;
  box-shadow: 2px 0 10px 0 rgba(173, 200, 218, 0.26);
}

.tab-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  color: $normal-color-light;

  &:hover {
    color: $normal-color;

    .icon {
      background-color: $disable-color;
    }
  }

  .icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 5px;
    border-radius: 2px;

    .iconfont {
      font-size: 20px;
      line-height: 1;
    }
  }

  p {
    font-size: 12px;
  }

  &.router-link-active {
    background-color: $background-color-light;
    color: #2b2c33;

    .icon {
      background-color: $primary-color;
    }
  }
}
</style>
