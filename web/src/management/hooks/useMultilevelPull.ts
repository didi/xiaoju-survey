import { ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import { cloneDeep } from 'lodash-es'

interface NodeItem {
  hash: string,
  text: string,
  children?: NodeItem[],
}

type MultilevelDat = {
  placeholder: Array<{
    hash: string,
    text: string,
  }>,
  children: Array<NodeItem>,
}

export const useMultilevelPull = () => {
  const maxCount = 3;
  const optionsCount = 50;
  const multilevelVal = ref<Array<null | NodeItem>>([]);
  const multilevelData = ref<MultilevelDat | null>(null)
  let hashArr: Array<string> = [];


  const extractHash = (obj: MultilevelDat): Array<string> => {
    const hashes: Array<string> = [];

    function recurse(currentObj: any) {
      if (Array.isArray(currentObj)) {
        currentObj.forEach(item => recurse(item));
      } else if (typeof currentObj === 'object' && currentObj !== null) {
        if (currentObj.hash) {
          hashes.push(currentObj.hash);
        }
        for (const key in currentObj) {
          // eslint-disable-next-line no-prototype-builtins
          if (currentObj.hasOwnProperty(key as any)) {
            recurse(currentObj[key]);
          }
        }
      }
    }

    recurse(obj);
    return hashes;
  }

  const getRandom = () => {
    return Math.random().toString().slice(-6)
  }

  const getNewHash = () => {
    let random = getRandom()
    while (random in hashArr) {
      random = getRandom()
    }
    hashArr.push(random)
    return random
  }

  const addMultilevelNode = (key: number) => {
    const nodeItem: NodeItem = (key == 0 ? multilevelData.value : multilevelVal.value[key - 1]) as NodeItem
    if (nodeItem.children && nodeItem.children.length > optionsCount) {
      ElMessageBox.alert(`当前最多添加${optionsCount}个选项`, '提示', {
        confirmButtonText: '确定',
        type: 'warning'
      })
      return
    }
    const optionStr = `选项${nodeItem?.children ? nodeItem?.children?.length + 1 : 1}`
    nodeItem.children?.push({
      hash: getNewHash(),
      text: optionStr,
      children: []
    })
  }

  const resetMultilevelVal = (index: number) => {
    for (let i = multilevelVal.value.length; index < i; i--) {
      multilevelVal.value[i - 1] = null;
    }
  }

  const removeMultilevelNode = (nodeItem: NodeItem, index: number, key: number) => {
    try {
      if (key == 0 && multilevelData.value?.children && multilevelData.value?.children?.length<=1) {
        ElMessageBox.alert('至少保留一个选项', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
        return
      }
      if (nodeItem.children) {
        nodeItem.children[index].children = [];
      }
      nodeItem.children?.splice(index, 1)
      resetMultilevelVal(key)
    } catch (error) {
      console.log(error)
    }
  }

  const editMultilevelNode = (nodeItem: NodeItem, index: number, text: string) => {
    nodeItem.children && (nodeItem.children[index].text = text)
  }


  const setMultilevelVal = (data: NodeItem, index: number) => {
    if (multilevelVal.value[index]?.hash == data.hash) return
    resetMultilevelVal(index)
    multilevelVal.value[index] = data
  }


  const loadInitData = (data: MultilevelDat) => {
    multilevelData.value = cloneDeep(data);
    multilevelVal.value = [];
    for (let index = 0; index < maxCount; index++) {
      multilevelVal.value.push(null)
    }
    hashArr = extractHash(multilevelData.value);
  }



  return {
    addMultilevelNode,
    removeMultilevelNode,
    editMultilevelNode,
    loadInitData,
    setMultilevelVal,

    multilevelVal,
    multilevelData
  }
}