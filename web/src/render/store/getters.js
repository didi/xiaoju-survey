import { flatten } from 'lodash-es';

export default {
  // 题目列表
  renderData: (state) => {
    const { questionSeq, questionData, formValues } = state;
    let index = 1;
    return (
      questionSeq &&
      questionSeq.reduce((pre, item) => {
        const questionArr = [];
        for (const questionKey of item) {
          const question = { ...questionData[questionKey] };
          const { type, extraOptions, options, rangeConfig } = question;

          const questionVal = formValues[questionKey];

          question.value = questionVal;
          // 本题开启了
          if (question.showIndex) {
            question.indexNumber = index++;
          }

          const allOptions = [];
          if (Array.isArray(extraOptions)) {
            allOptions.push(...extraOptions);
          }
          if (Array.isArray(options)) {
            allOptions.push(...options);
          }

          let othersValue = {};
          let voteTotal = 0;
          const voteMap = state.voteMap;
          if (/vote/.test(type)) {
            voteTotal = voteMap?.[questionKey]?.total || 0;
          }
          // 遍历所有的选项
          for (const optionItem of allOptions) {
            // 开启了更多输入框，生成othersValue的值
            if (optionItem.others) {
              const opKey = `${questionKey}_${optionItem.hash}`;
              optionItem.othersKey = opKey;
              optionItem.othersValue = formValues[opKey];
              othersValue[opKey] = formValues[opKey];
            }

            // 投票题，用户手动选择选项后，要实时更新展示数据和进度
            if (/vote/.test(type)) {
              const voteCount = voteMap?.[questionKey]?.[optionItem.hash] || 0;
              if (
                Array.isArray(questionVal)
                  ? questionVal.includes(optionItem.hash)
                  : questionVal === optionItem.hash
              ) {
                optionItem.voteCount = voteCount + 1;
                voteTotal = voteTotal + 1;
              } else {
                optionItem.voteCount = voteCount;
              }
              question.voteTotal = voteTotal;
            }
          }

          // 开启了更多输入框，要将当前的value赋值给question
          if (
            rangeConfig &&
            Object.keys(rangeConfig).length > 0 &&
            rangeConfig[questionVal]
          ) {
            const curRange = rangeConfig[questionVal];
            if (curRange?.isShowInput) {
              const rangeKey = `${questionKey}_${questionVal}`;
              curRange.othersKey = rangeKey;
              curRange.othersValue = formValues[rangeKey];
              othersValue[rangeKey] = formValues[rangeKey];
            }
          }

          // 将othersValue赋值给
          question.othersValue = othersValue;
          questionArr.push(question);
        }

        if (questionArr && questionArr.length) {
          pre.push(questionArr);
        }
        return pre;
      }, [])
    );
  },
  // 根据渲染的题目生成的用户输入或者选择的数据
  formModel: (state, getters) => {
    const { renderData } = getters;
    const formdata = flatten(renderData).reduce((pre, current) => {
      const { othersValue, type, field } = current;
      if (othersValue && Object.keys(othersValue).length) {
        Object.assign(pre, othersValue);
      }
      switch (type) {
        // case 'fillin':
        //   current.fillinConfig.forEach(item => {
        //     item.forEach(subItem => {
        //       if (subItem.blanks > 0) {
        //         const resultField = `${field}_${subItem.hash}`
        //         Object.assign(pre, { [resultField]: subItem.value })
        //       }
        //     })
        //   })
        //   Object.assign(pre, { [field]: formValues[field] })
        //   break
        default:
          Object.assign(pre, { [field]: current.value });
          break;
      }

      return pre;
    }, {});
    return formdata;
  },
};
