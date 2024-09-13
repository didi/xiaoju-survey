import { forEach as _forEach, trim as _trim } from 'lodash-es'
import { escapeFilterXSS } from '@/common/xss'

// 获取选项的hash
export function getNewHash(hashMap) {
  let random = getRandom()
  while (random in hashMap) {
    random = getRandom()
  }
  return random
}

// 获取长度为6或者指定长度的的随机字符串
export function getRandom(len) {
  return Math.random()
    .toString()
    .slice(len && typeof len === 'number' ? 0 - len : -6)
}

const optionListItem = [
  'text',
  'others',
  'mustOthers',
  'limit',
  'score',
  'othersKey',
  'placeholderDesc',
  'hash'
]

// 根据批量导入的问题生成多个选项
export function getMultiOptionByText(text) {
  let moduleData = []
  let data = text.split('\n').filter((item) => item.trim())
  if (data && data.length > 0) {
    _forEach(data, (d) => {
      const rData = d.split('\t')
      let rObj = {},
        j = 0
      let hashMap = {}
      try {
        _forEach(optionListItem, (key) => {
          switch (key) {
            case 'mustOthers':
              rObj[key] = !(_trim(rData[j]) === 'false' || _trim(rData[j]) === '')
              j++
              break
            case 'others':
              rObj[key] = !(_trim(rData[j]) === 'false' || _trim(rData[j]) === '')
              j++
              break
            case 'score':
              rObj[key] = parseInt(_trim(rData[j])) ? parseInt(_trim(rData[j])) : 0
              j++
              break
            case 'hash':
              rObj[key] = parseInt(_trim(rData[j]))
                ? parseInt(_trim(rData[j]))
                : getNewHash(hashMap)
              j++
              hashMap[rObj[key]] = true
              break
            default:
              rObj[key] = escapeFilterXSS(_trim(rData[j]))
              j++
              break
          }
        })
      } catch (e) {
        console.error(e)
      }
      moduleData.push(rObj)
    })
    return moduleData
  }
}
