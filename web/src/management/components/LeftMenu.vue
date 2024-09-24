<template>
  <div class="nav">
    <LogoIcon />
    <template v-for="(tab, index) in tabs" :key="tab.text + index">
      <router-link :to="tab.to" v-slot="{ isActive }">
        <div
          :class="[
            'tab-btn',
            ([
              'QuestionEditIndex',
              'QuestionEditSetting',
              'QuestionSkinSetting',
              'QuestionEditResultConfig'
            ].includes(route.name) &&
              tab.to.name === 'QuestionEditIndex') ||
            isActive
              ? 'router-link-active'
              : ''
          ]"
        >
          <div class="icon">
            <i class="iconfont" :class="tab.icon"></i>
          </div>
          <p>{{ tab.text }}</p>
        </div>
      </router-link>
    </template>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useEditStore } from '@/management/stores/edit'
import { useRoute } from 'vue-router'
const route = useRoute()
import LogoIcon from './LogoIcon.vue'
import { SurveyPermissions } from '@/management/utils/workSpace'
const editStore = useEditStore()

const tabArr = [
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
const tabs = ref([])
watch(
  () => editStore.cooperPermissions,
  (newVal) => {
    tabs.value = []
    // 如果有问卷管理权限，则加入问卷编辑和投放菜单
    if (newVal.includes(SurveyPermissions.SurveyManage)) {
      tabs.value.push(tabArr[0])
      tabs.value.push(tabArr[1])
    }
    // 如果有数据分析权限，则加入数据分析菜单
    if (newVal.includes(SurveyPermissions.DataManage)) {
      tabs.value.push(tabArr[2])
    }
  },
  { immediate: true }
)
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
