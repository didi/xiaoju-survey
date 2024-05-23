export default {
  // 题目列表
  renderData: (state) => {
    const { questionSeq, questionData } = state

    let index = 1
    return (
      questionSeq &&
      questionSeq.reduce((pre, item) => {
        const questionArr = []

        item.forEach((questionKey) => {
          console.log('题目重新计算')
          const question = { ...questionData[questionKey] }
          // 开启显示序号
          if (question.showIndex) {
            question.indexNumber = index++
          }

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
