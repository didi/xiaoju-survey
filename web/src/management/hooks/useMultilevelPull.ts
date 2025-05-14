import { ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import { cloneDeep } from 'lodash-es'

interface NodeItem {
  hash: string,
  text: string,
  children?: NodeItem[],
}

type CascaderDate = {
  placeholder: Array<{
    hash: string,
    text: string,
  }>,
  children: Array<NodeItem>,
}

export const useCascaderPull = () => {
  const maxCount = 3;
  const optionsCount = 50;
  const cascaderVal = ref<Array<null | NodeItem>>([]);
  const cascaderData = ref<CascaderDate | null>(null)
  let hashArr: Array<string> = [];


  const extractHash = (obj: CascaderDate): Array<string> => {
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

  const addCascaderNode = (key: number) => {
    const nodeItem: NodeItem = (key == 0 ? cascaderData.value : cascaderVal.value[key - 1]) as NodeItem
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

  const resetCascaderVal = (index: number) => {
    for (let i = cascaderVal.value.length; index < i; i--) {
      cascaderVal.value[i - 1] = null;
    }
  }

  const removeCascaderNode = (nodeItem: NodeItem, index: number, key: number) => {
    try {
      if (key == 0 && cascaderData.value?.children && cascaderData.value?.children?.length<=1) {
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
      resetCascaderVal(key)
    } catch (error) {
      console.log(error)
    }
  }

  const editCascaderNode = (nodeItem: NodeItem, index: number, text: string) => {
    nodeItem.children && (nodeItem.children[index].text = text)
  }


  const setCascaderVal = (data: NodeItem, index: number) => {
    if (cascaderVal.value[index]?.hash == data.hash) return
    resetCascaderVal(index)
    cascaderVal.value[index] = data
  }


  const loadInitData = (data: CascaderDate) => {
    cascaderData.value = cloneDeep(data);
    cascaderVal.value = [];
    for (let index = 0; index < maxCount; index++) {
      cascaderVal.value.push(null)
    }
    hashArr = extractHash(cascaderData.value);
  }



  return {
    addCascaderNode,
    removeCascaderNode,
    editCascaderNode,
    loadInitData,
    setCascaderVal,

    cascaderVal,
    cascaderData
  }
}