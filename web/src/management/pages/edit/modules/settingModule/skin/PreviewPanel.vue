<template>
  <div class="main-operation">
    <div class="operation-wrapper">
      <div class="box" ref="box">
        <div class="mask"></div>
        <HeaderContent :bannerConf="bannerConf" :readonly="false" />
        <div class="content">
          <MainTitle :isSelected="false" :bannerConf="bannerConf" :readonly="false" />
          <MaterialGroup :questionDataList="questionDataList" ref="MaterialGroup" />
          <SubmitButton
            :submit-conf="submitConf"
            :skin-conf="skinConf"
            :readonly="false"
            :is-selected="currentEditOne === 'submit'"
          />
          <LogoIcon
            :logo-conf="bottomConf"
            :readonly="false"
            :is-selected="currentEditOne === 'logo'"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, toRefs } from 'vue'
import MaterialGroup from '@/management/pages/edit/components/MaterialGroup.vue'
import { storeToRefs } from 'pinia'
import { useEditStore } from '@/management/stores/edit'
import communalLoader from '@materials/communals/communalLoader.js'

const HeaderContent = () => communalLoader.loadComponent('HeaderContent')
const MainTitle = () => communalLoader.loadComponent('MainTitle')
const SubmitButton = () => communalLoader.loadComponent('SubmitButton')
const LogoIcon = () => communalLoader.loadComponent('LogoIcon')

export default defineComponent({
  components: {
    MaterialGroup,
    HeaderContent: HeaderContent(),
    MainTitle: MainTitle(),
    SubmitButton: SubmitButton(),
    LogoIcon: LogoIcon()
  },
  setup() {
    const editStore = useEditStore()
    const { questionDataList, currentEditOne, currentEditKey } = storeToRefs(editStore)
    const { schema } = editStore
    const { bannerConf, submitConf, skinConf, bottomConf } = toRefs(schema)

    return {
      bannerConf,
      submitConf,
      bottomConf,
      skinConf,
      questionDataList,
      currentEditOne,
      currentEditKey
    }
  },
  watch: {
    skinConf: {
      handler(newVal) {
        const { themeConf, backgroundConf, contentConf } = newVal
        const root = document.documentElement
        if (themeConf?.color) {
          root.style.setProperty('--primary-color', themeConf?.color) // 设置主题颜色
        }
        if (backgroundConf?.color) {
          root.style.setProperty('--primary-background-color', backgroundConf?.color) // 设置背景颜色
        }
        if (contentConf?.opacity.toString()) {
          root.style.setProperty('--opacity', contentConf?.opacity / 100) // 设置全局透明度
        }
      },
      immediate: true,
      deep: true
    }
  }
})
</script>

<style lang="scss" scoped>
.main-operation {
  width: 100%;
  height: 100%;
  min-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f6f7f9;
}

.toolbar {
  width: 100%;
  height: 38px;
  background-color: #fff;
  flex-grow: 0;
  flex-shrink: 0;
}

.operation-wrapper {
  margin-top: 50px;
  margin-bottom: 45px;
  // min-height: 812px;
  overflow-x: hidden;
  overflow-y: auto;
  // padding-right: 30px;
  margin-right: 0px;
  scrollbar-width: none;
  width: 90%;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  .box {
    background-color: var(--primary-background-color);
    position: relative;

    .mask {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 999;
    }

    .content {
      margin: 0 0.3rem;
      background: rgba(255, 255, 255, var(--opacity));
      border-radius: 8px 8px 0 0;
    }
  }
}
</style>
