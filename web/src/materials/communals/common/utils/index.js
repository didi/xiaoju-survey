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
