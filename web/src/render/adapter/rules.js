import {
  forEach as _forEach,
  get as _get,
  isArray as _isArray,
  keys as _keys,
  set as _set
} from 'lodash-es'
import { INPUT, RATES, QUESTION_TYPE } from '@/common/typeEnum.ts'
import { regexpMap } from '@/common/regexpMap.ts'


const msgMap = {
  '*': '必填',
  m: '请输入手机号',
  idcard: '请输入正确的身份证号码',
  strictIdcard: '请输入正确的身份证号码',
  n: '请输入数字',
  nd: '请输入数字',
  e: '请输入邮箱',
  licensePlate: '请输入车牌号'
}
const checkBoxTip = '至少选择#min#项，少选择了#less#项'
const checkBoxTipSame = '请选择#min#项，少选择了#less#项'
const textRangeMinTip = '至少输入#min#字'
const numberRangeMinTip = '数字最小为#min#'
const numberRangeMaxTip = '数字最大为#max#'

// 多选题的选项数目限制
export function optionValidator(value, minNum, maxNum) {
  let tip = minNum === maxNum ? checkBoxTipSame : checkBoxTip
  if (_isArray(value) && value.length < minNum) {
    const less = minNum - value.length
    tip = tip.replace(/#min#/g, minNum)
    tip = tip.replace(/#less#/g, less)
    return tip
  }
  return ''
}

// textarea最小字数检验
export function textAreaValidator(isRequired, value, textRangeMin) {
  let tip = textRangeMinTip
  if (value && value.length < parseInt(textRangeMin)) {
    tip = tip.replace(/#min#/g, textRangeMin)
    return tip
  }
  return ''
}

// 数字类的输入框，配置了最小值的，要对数值做校验
export function numberMinValidator(value, numberRangeMin) {
  let tip = numberRangeMinTip
  if (Number(value) < Number(numberRangeMin)) {
    tip = tip.replace(/#min#/g, numberRangeMin)
    return tip
  }
  return ''
}
// 数字类的输入框，配置了最大值的，要对数值做校验
export function numberMaxValidator(value, numberRangeMax) {
  let tip = numberRangeMaxTip
  if (Number(value) > Number(numberRangeMax)) {
    tip = tip.replace(/#max#/g, numberRangeMax)
    return tip
  }
  return ''
}

// 根据提醒和题目的配置，生成本题的校验规则
export function generateValidArr(
  isRequired,
  valid,
  minNum,
  textRangeMin,
  type,
  numberRangeMin,
  numberRangeMax
) {
  const validArr = []
  const isInput = INPUT.indexOf(type) !== -1
  if (isRequired || valid === '*') {
    // 输入框的必填校验做trim
    if (!isInput) {
      validArr.push({
        required: true,
        message: '此项未填，请填写完整'
        // trigger: 'change|blur'
      })
    } else {
      validArr.push({
        required: true,
        validator(rule, value, callback) {
          let errors = []
          let tip = ''
          if (value === '' || value?.replace(/\s*/, '') === '') {
            tip = '此项未填，请填写完整'
          }
          if (tip) {
            errors = [tip]
          }
          callback(errors)
        }
        // trigger: 'change|blur'
      })
    }
  }
  if (regexpMap[valid]) {
    validArr.push({
      validator(rule, value, callback) {
        let errors = []
        let tip = ''
        if (!regexpMap[valid].test(value)) {
          tip = msgMap[valid]
        }
        if (value === '') {
          tip = ''
        }
        if (tip) {
          errors = [tip]
        }
        callback(errors)
      }
      // trigger: 'change|blur'
    })
  }

  if (minNum) {
    validArr.unshift({
      validator(rule, value, callback) {
        let errors = []
        const tip = optionValidator(value, minNum)
        if (tip) {
          errors = [tip]
        }
        callback(errors)
      }
      // trigger: 'change|blur'
    })
  }

  if (textRangeMin) {
    validArr.push({
      validator(rule, value, callback) {
        let errors = []
        const tip = textAreaValidator(isRequired, value, textRangeMin)
        if (tip) {
          errors = [tip]
        }
        callback(errors)
      }
      // trigger: 'change|blur'
    })
  }

  if (isInput && valid === 'n' && numberRangeMin) {
    validArr.push({
      validator(rule, value, callback) {
        let errors = []
        const tip = numberMinValidator(value, numberRangeMin)
        if (tip) {
          errors = [tip]
        }
        callback(errors)
      }
      // trigger: 'change|blur'
    })
  }

  if (isInput && valid === 'n' && numberRangeMax) {
    validArr.push({
      validator(rule, value, callback) {
        let errors = []
        const tip = numberMaxValidator(value, numberRangeMax)
        if (tip) {
          errors = [tip]
        }
        callback(errors)
      }
      // trigger: 'change|blur'
    })
  }

  return validArr
}

// 生成选择类或者评分类的题目的更多输入框
const generateOthersKeyMap = (question) => {
  const { type, field, options, rangeConfig } = question
  let othersKeyMap = undefined

  if (RATES.includes(type)) {
    othersKeyMap = {}
    for (const key in rangeConfig) {
      if (rangeConfig[key].isShowInput) {
        othersKeyMap[`${field}_${key}`] = key
      }
    }
  } else if (type.includes(QUESTION_TYPE.RADIO) || type.includes(QUESTION_TYPE.CHECKBOX)) {
    othersKeyMap = {}
    options
      .filter((op) => op.others)
      .forEach((option) => {
        othersKeyMap[`${field}_${option.hash}`] = option.text
      })
  }
  return othersKeyMap
}

// 生成所有题目的校验规则
export default function (questionConfig) {
  const dataList = _get(questionConfig, 'dataConf.dataList')
  const rules = dataList.reduce((pre, current) => {
    const {
      field,
      valid,
      minNum,
      // othersKeyMap,
      type,
      options,
      isRequired,
      textRange,
      numberRange,
      rangeConfig
    } = current
    const othersKeyMap = generateOthersKeyMap(current)
    // 部分题目不校验
    if (valid === '0' || /mobileHidden|section|hidden/.test(type)) {
      return pre
    }

    let validMap = {}
    const textRangeMin = _get(textRange, 'min.value')
    const numberRangeMin = _get(numberRange, 'min.value')
    const numberRangeMax = _get(numberRange, 'max.value')

    const validArr = generateValidArr(
      isRequired,
      valid,
      minNum,
      textRangeMin,
      type,
      numberRangeMin,
      numberRangeMax
    )

    validMap = { [field]: validArr }

    // 对于选择题支持填写更多信息的，需要做是否必填的校验
    if (_keys(othersKeyMap).length) {
      if (RATES.includes(type)) {
        if (rangeConfig) {
          for (const key in rangeConfig) {
            if (rangeConfig[key].isShowInput && rangeConfig[key].required) {
              _set(validMap, `${field}_${key}`, generateValidArr(true, ''))
            }
          }
        }
      } else {
        _forEach(options, (item) => {
          const othersKey = `${field}_${item.hash}`
          const { mustOthers } = item
          if (mustOthers) {
            _set(validMap, othersKey, generateValidArr(true, ''))
          }
        })
      }
    }
    return Object.assign(validMap, pre)
  }, {})
  return { rules }
}
