export function isMobile() {
  const userAgentInfo = navigator.userAgent
  const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
  let flag = false
  for (let v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = true
      break
    }
  }
  const w = document.body && document.body.clientWidth

  if (w > 960) {
    return false
  } else if (w < 480) {
    return true
  } else {
    return flag
  }
}

// 对链接做一个兼容转换，支持用户不配置http开头或者配置 // 开头
export const formatLink = (url) => {
  url = url.trim()
  if (!url) {
    return url
  }
  if (url.startsWith('http') || url.startsWith('//')) {
    return url
  }
  return `http://${url}`
}

export const getQuestionIndexByField = (questionList, field) => {
  const arr = questionList.map((item) => item.field)
  const index = arr.findIndex((item) => item === field)
  return index
}

export function findMinKeyInMap(map, hit) {
  let minKey = null

  for (const [key, value] of map) {
    if (value === hit) {
      if (minKey === null || key < minKey) {
        minKey = key
      }
    }
  }

  return minKey
}
