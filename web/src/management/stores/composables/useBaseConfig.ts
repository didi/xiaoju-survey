import { type Ref, reactive } from 'vue'

export type TypeMethod = 'INIT' | 'MODIFY' | 'REMOVE' | 'ADD'

export default function useEditGlobalBaseConf(
  questionDetailList: Ref<any[]>,
  updateTime: () => void
) {
  // 整卷配置数据
  const globalBaseConfig = reactive({
    isRequired: true,
    showIndex: true,
    showType: true,
    showSpliter: true
  })

  // 整卷配置各项选项选中个数统计
  const optionCheckedCounts = {
    isRequiredCount: 0,
    showIndexCount: 0,
    showTypeCount: 0,
    showSpliterCount: 0
  }

  const resetCount = () => {
    optionCheckedCounts.isRequiredCount = 0
    optionCheckedCounts.showIndexCount = 0
    optionCheckedCounts.showTypeCount = 0
    optionCheckedCounts.showSpliterCount = 0
  }

  // 初始化统计
  function initCounts() {
    resetCount()
    questionDetailList.value.forEach((question: any) => {
      calculateCountsForQuestion('INIT', { question })
    })
    updateGlobalBaseConf()
  }

  // 更新统计
  function updateCounts(type: TypeMethod, data: any) {
    if (type === 'MODIFY') {
      calculateOptionCounts(type, data)
    } else {
      calculateCountsForQuestion(type, data)
    }
    updateGlobalBaseConf()
  }

  // 计算整卷配置各项选项选中个数
  function calculateCountsForQuestion(type: TypeMethod, { question }: any) {
    Object.keys(globalBaseConfig).forEach((key) => {
      calculateOptionCounts(type, { key, value: question[key] })
    })
  }

  // 计算单个选项选中个数
  function calculateOptionCounts(type: TypeMethod, { key, value }: any) {
    const _key = `${key}Count` as keyof typeof optionCheckedCounts
    if (value) {
      if (type === 'REMOVE') optionCheckedCounts[_key]--
      else optionCheckedCounts[_key]++
    } else {
      if (type === 'MODIFY') optionCheckedCounts[_key]--
    }
  }

  // 更新整卷配置状态
  function updateGlobalBaseConf() {
    const len = questionDetailList.value.length
    const { isRequiredCount, showIndexCount, showSpliterCount, showTypeCount } = optionCheckedCounts
    Object.assign(globalBaseConfig, {
      isRequired: isRequiredCount === len,
      showIndex: showIndexCount === len,
      showSpliter: showSpliterCount === len,
      showType: showTypeCount === len
    })
  }

  // 整卷配置修改
  function updateGlobalConfOption({ key, value }: { key: string; value: boolean }) {
    const len = questionDetailList.value.length
    const _key = `${key}Count` as keyof typeof optionCheckedCounts
    if (value) optionCheckedCounts[_key] = len
    else optionCheckedCounts[_key] = 0
    questionDetailList.value.forEach((question: any) => {
      question[key] = value
    })
    updateTime()
  }

  return {
    globalBaseConfig,
    initCounts,
    updateCounts,
    updateGlobalConfOption
  }
}
