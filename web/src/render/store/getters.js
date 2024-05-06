import { flatten } from 'lodash-es'

export default {
  // 题目列表
  renderData: (state) => {
    const { questionSeq, questionData } = state
    
    let index = 1
    return (
      questionSeq &&
      questionSeq.reduce((pre, item) => {
        const questionArr = []
        
        item.forEach(questionKey => {
          console.log('题目重新计算')
          const question = { ...questionData[questionKey] }
          
          const { type, extraOptions, options, rangeConfig } = question

          // const questionVal = formValues[questionKey]

          // question.value = questionVal
          // 本题开启了
          if (question.showIndex) {
            question.indexNumber = index++
          }

          const allOptions = []
          if (Array.isArray(extraOptions)) {
            allOptions.push(...extraOptions)
          }
          if (Array.isArray(options)) {
            allOptions.push(...options)
          }

          let othersValue = {}
          // let voteTotal = 0
          // const voteMap = state.voteMap
          // if (/vote/.test(type)) {
          //   voteTotal = voteMap?.[questionKey]?.total || 0
          // }
          // 遍历所有的选项
          for (const optionItem of allOptions) {
            // 开启了更多输入框，生成othersValue的值
            if (optionItem.others) {
              const opKey = `${questionKey}_${optionItem.hash}`
              optionItem.othersKey = opKey
              // optionItem.othersValue = formValues[opKey]
              // othersValue[opKey] = formValues[opKey]
            }

            // 投票题，用户手动选择选项后，要实时更新展示数据和进度
            // if (/vote/.test(type)) {
            //   const voteCount = voteMap?.[questionKey]?.[optionItem.hash] || 0
            //   if (
            //     Array.isArray(questionVal)
            //       ? questionVal.includes(optionItem.hash)
            //       : questionVal === optionItem.hash
            //   ) {
            //     optionItem.voteCount = voteCount + 1
            //     voteTotal = voteTotal + 1
            //   } else {
            //     optionItem.voteCount = voteCount
            //   }
            //   question.voteTotal = voteTotal
            // }
          }

          // 开启了更多输入框，要将当前的value赋值给question
          // if (rangeConfig && Object.keys(rangeConfig).length > 0 && rangeConfig[questionVal]) {
          //   const curRange = rangeConfig[questionVal]
          //   if (curRange?.isShowInput) {
          //     const rangeKey = `${questionKey}_${questionVal}`
          //     curRange.othersKey = rangeKey
          //     curRange.othersValue = formValues[rangeKey]
          //     othersValue[rangeKey] = formValues[rangeKey]
          //   }
          // }

          // 将othersValue赋值给
          question.othersValue = othersValue
          
          questionArr.push(question)
        })

        if (questionArr && questionArr.length) {
          pre.push(questionArr)
        }
        
        return pre
      }, [])
    )
  }
}
