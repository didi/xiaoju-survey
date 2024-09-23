<template>
  <div class="main-operation">
    <div class="pagination-wrapper">
      <PageWrapper :readonly="true" />
    </div>
    <div class="operation-wrapper">
      <div class="box" ref="box">
        <div class="mask"></div>
        <HeaderContent v-if="pageEditOne == 1" :bannerConf="bannerConf" :readonly="false" />
        <div class="content">
          <MainTitle
            v-if="pageEditOne == 1"
            :isSelected="false"
            :bannerConf="bannerConf"
            :readonly="false"
          />
          <MaterialGroup :questionDataList="pageQuestionData" ref="MaterialGroup" />
          <SubmitButton
            :submit-conf="submitConf"
            :skin-conf="skinConf"
            :readonly="false"
            :is-selected="currentEditOne === 'submit'"
            :is-finally-page="isFinallyPage"
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
import PageWrapper from '@/management/pages/edit/components/Pagination/PaginationWrapper.vue'
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
    PageWrapper,
    HeaderContent: HeaderContent(),
    MainTitle: MainTitle(),
    SubmitButton: SubmitButton(),
    LogoIcon: LogoIcon()
  },
  setup() {
    const editStore = useEditStore()
    const { pageQuestionData, currentEditOne, currentEditKey, isFinallyPage, pageEditOne } =
      storeToRefs(editStore)
    const { schema } = editStore
    const { bannerConf, submitConf, skinConf, bottomConf } = toRefs(schema)

    return {
      bannerConf,
      submitConf,
      bottomConf,
      skinConf,
      pageQuestionData,
      currentEditOne,
      currentEditKey,
      isFinallyPage,
      pageEditOne
    }
  },
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
  background: var(--primary-background);
}

.pagination-wrapper {
  position: relative;
  top: 50px;
  width: 90%;
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
      background: rgba(255, 255, 255, var(--opacity));
    }
  }
}
</style>
