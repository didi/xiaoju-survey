<template>
  <div>
    <WhiteListDialog
      v-if="showWhiteList"
      :visible="showWhiteList"
      ref="whiteListRef"
      @confirm="whiteListConfirm"
    />
    <FillDataDialog v-if="showFillData" :visible="showFillData" ref="fillDataRef" />
  </div>
</template>

<script setup lang="ts">
import { watch, computed, ref } from 'vue'
import { useSurveyStore } from '../../stores/survey'
import { getSurveyData, getSurveySubmit } from '../../utils/storage'

import WhiteListDialog from './WhiteListDialog.vue'
import FillDataDialog from './FillDataDialog.vue'

const surveyStore = useSurveyStore()
const baseConf: any = computed(() => surveyStore?.baseConf)

const showWhiteList = ref(false)
const showFillData = ref(false)

watch(
  () => baseConf.value,
  () => {
    const { passwordSwitch, whitelistType } = baseConf.value

    // 密码 or 白名单
    if ((whitelistType && whitelistType != 'ALL') || passwordSwitch) {
      showWhiteList.value = true
      return
    }

    whiteListConfirm()
  }
)

const whiteListConfirm = () => {
  const { surveyPath } = surveyStore || {}
  const { fillAnswer, fillSubmitAnswer } = baseConf.value || {}
  // 断点续答 or 自动填充
  const localData = getSurveyData(surveyPath)
  const isSubmit = getSurveySubmit(surveyPath)
  if ((fillAnswer || (fillSubmitAnswer && isSubmit)) && localData) {
    showFillData.value = true
  }
}

// export default {
//   components: { DialogComponent },
//   data() {
//     return {
//       showWhiteListDialog: false,
//       showFillDataDialog: false,
//     };
//   },
//   methods: {
//     startValidation() {
//       this.showDialog1 = true
//       await this.$refs.dialog1.validate()  // 校验第一个弹窗
//       this.showDialog1 = false

//       this.showDialog2 = true
//       await this.$refs.dialog2.validate()  // 校验第二个弹窗
//       this.showDialog2 = false
//     }
//   }
// };
</script>
