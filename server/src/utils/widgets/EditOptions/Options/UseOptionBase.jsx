import { ref } from 'vue'
import { cloneDeep } from 'lodash-es'

import GetHash from '@materials/questions/common/utils/getOptionHash'

function useOptionBase(options) {
  const optionList = ref(options)
  const addOption = (text = '选项', others = false, index = -1, field) => {
    let addOne = {
      text: '',
      hash: '',
      others: false,
      mustOthers: false,
      othersKey: '',
      placeholderDesc: ''
    }
    if (typeof text !== 'string') {
      text = '选项'
    }

    const getHash = new GetHash()
    addOne.hash = getHash.getHash()
    for (const i in addOne) {
      if (i === 'others') {
        addOne[i] = others
        if (others) addOne.othersKey = `${field}_${addOne.hash}`
      } else if (i === 'mustOthers') {
        addOne[i] = false
      } else if (i === 'text') {
        addOne[i] = text
      }
    }
    let myoptionList = cloneDeep(optionList.value)
    if (index < 0) {
      myoptionList.push(addOne)
    } else {
      myoptionList.splice(index + 1, 0, addOne)
    }
    return myoptionList
  }

  const addOtherOption = (field) => {
    return addOption('其他', true, -1, field)
  }
  return {
    addOption,
    addOtherOption
  }
}

export default useOptionBase
